<?php
declare(strict_types=1);

/**
 * Adminbereich fuer die Anfragen von ebsolutions.info
 *
 * Beim ersten Aufruf wird ein Passwort vergeben. Gespeichert wird davon
 * nur ein Hash - das Passwort selbst steht nirgends, auch nicht in dieser
 * Datei. Die Anfragen liegen ausserhalb von public_html und sind darum
 * ueber das Internet nicht direkt erreichbar.
 */

const SPERRE_AB      = 5;     // Fehlversuche
const SPERRE_SEKUNDEN = 900;  // danach 15 Minuten Pause

require __DIR__ . '/eb-config.php';

[$basis, $imWeb, $ortMeldung] = eb_datenort();
$anfragen = $basis . '/anfragen';
$zugang   = $basis . '/zugang.json';

session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'httponly' => true,
    'secure'   => !empty($_SERVER['HTTPS']) || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https',
    'samesite' => 'Strict',
]);
session_name('ebadmin');
session_start();

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function token(): string {
    if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(32)); }
    return $_SESSION['csrf'];
}
function tokenPruefen(): bool {
    return !empty($_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''));
}

function zugangLesen(string $datei): array {
    return is_file($datei) ? (json_decode((string)file_get_contents($datei), true) ?: []) : [];
}
function zugangSchreiben(string $datei, array $daten): bool {
    $ok = @file_put_contents($datei, json_encode($daten, JSON_PRETTY_PRINT), LOCK_EX);
    if ($ok === false) { return false; }
    @chmod($datei, 0600);
    return true;
}

$konto      = zugangLesen($zugang);
$eingerichtet = !empty($konto['hash']);
$angemeldet = !empty($_SESSION['auth']);
$hinweis    = '';
$fehler     = '';

// ---------------------------------------------------------------- Aktionen
$tat = (string)($_POST['tat'] ?? '');

if ($tat === 'einrichten' && !$eingerichtet) {
    $pw1 = (string)($_POST['passwort'] ?? '');
    $pw2 = (string)($_POST['passwort2'] ?? '');
    if (mb_strlen($pw1) < 10)      { $fehler = 'Das Passwort braucht mindestens 10 Zeichen.'; }
    elseif ($pw1 !== $pw2)         { $fehler = 'Die beiden Passwörter stimmen nicht überein.'; }
    elseif ($basis === '') {
        $fehler = 'Der Server lässt PHP nirgends schreiben. ' . $ortMeldung;
    }
    elseif (!zugangSchreiben($zugang, ['hash' => password_hash($pw1, PASSWORD_DEFAULT), 'angelegt' => date('c')])) {
        $fehler = 'Das Passwort konnte nicht gespeichert werden. ' . $ortMeldung;
    }
    else {
        $konto = zugangLesen($zugang); $eingerichtet = true;
        $hinweis = 'Passwort gesetzt. Bitte jetzt anmelden.';
    }
}

if ($tat === 'anmelden' && $eingerichtet) {
    $versuche = (int)($konto['versuche'] ?? 0);
    $letzter  = (int)($konto['letzter'] ?? 0);
    if ($versuche >= SPERRE_AB && time() - $letzter < SPERRE_SEKUNDEN) {
        $fehler = 'Zu viele Fehlversuche. Bitte ' . ceil((SPERRE_SEKUNDEN - (time() - $letzter)) / 60) . ' Minuten warten.';
    } elseif (password_verify((string)($_POST['passwort'] ?? ''), (string)$konto['hash'])) {
        session_regenerate_id(true);
        $_SESSION['auth'] = true;
        $angemeldet = true;
        unset($konto['versuche'], $konto['letzter']);
        zugangSchreiben($zugang, $konto);
    } else {
        $konto['versuche'] = $versuche + 1;
        $konto['letzter']  = time();
        zugangSchreiben($zugang, $konto);
        $fehler = 'Passwort falsch.';
    }
}

if ($tat === 'abmelden') {
    $_SESSION = []; session_destroy();
    header('Location: admin.php'); exit;
}

// Aktionen, die eine Anmeldung UND ein gueltiges Token brauchen
if ($angemeldet && in_array($tat, ['status', 'loeschen'], true)) {
    if (!tokenPruefen()) {
        $fehler = 'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.';
    } else {
        $id = (string)($_POST['id'] ?? '');
        // Nur unsere eigenen Dateinamen zulassen - verhindert Pfad-Tricks
        if (preg_match('/^\d{4}-\d{2}-\d{2}_\d{6}-[0-9a-f]{8}$/', $id)) {
            $datei = $anfragen . '/' . $id . '.json';
            if (is_file($datei)) {
                if ($tat === 'loeschen') {
                    unlink($datei);
                    $hinweis = 'Anfrage gelöscht.';
                } else {
                    $neu = (string)($_POST['wert'] ?? 'neu');
                    if (in_array($neu, ['neu', 'bearbeitung', 'erledigt'], true)) {
                        $d = json_decode((string)file_get_contents($datei), true) ?: [];
                        $d['status'] = $neu;
                        $d['geaendert'] = date('c');
                        file_put_contents($datei, json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
                        $hinweis = 'Status geändert.';
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------------- Auslesen
$liste = [];
if ($angemeldet) {
    foreach (glob($anfragen . '/*.json') ?: [] as $datei) {
        $d = json_decode((string)file_get_contents($datei), true);
        if (is_array($d) && isset($d['id'])) { $liste[] = $d; }
    }
    usort($liste, static fn($a, $b) => strcmp((string)$b['id'], (string)$a['id']));
}
$offen = count(array_filter($liste, static fn($d) => ($d['status'] ?? 'neu') === 'neu'));
$filter = (string)($_GET['status'] ?? 'alle');
$sichtbar = $filter === 'alle' ? $liste
          : array_values(array_filter($liste, static fn($d) => ($d['status'] ?? 'neu') === $filter));

$BEZEICHNUNG = ['neu' => 'Neu', 'bearbeitung' => 'In Bearbeitung', 'erledigt' => 'Erledigt'];
?><!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Anfragen — EB Solutions</title>
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<style>
  :root { color-scheme: dark;
    --bg:#0A0A0B; --karte:#141417; --rand:rgba(212,175,55,.20); --rand2:rgba(212,175,55,.42);
    --gold:#C2A24E; --creme:#F3EEE2; --grau:#9A968B;
    --font: system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif; }
  * { box-sizing:border-box }
  body { margin:0; background:var(--bg); color:var(--creme); font:15px/1.6 var(--font); }
  a { color:var(--gold); text-decoration:none } a:hover { text-decoration:underline }
  .wrap { max-width:960px; margin:0 auto; padding:24px 20px 60px }
  header.top { display:flex; align-items:center; justify-content:space-between; gap:16px;
    padding:18px 0 22px; border-bottom:1px solid var(--rand); margin-bottom:24px; flex-wrap:wrap }
  h1 { font-size:1.35rem; margin:0; font-weight:700; letter-spacing:.01em }
  .zahl { color:var(--grau); font-size:.9rem }
  .karte { background:var(--karte); border:1px solid var(--rand); border-radius:14px; padding:18px 20px; margin-bottom:14px }
  .karte.neu { border-color:var(--rand2) }
  .kopf { display:flex; justify-content:space-between; gap:12px; align-items:baseline; flex-wrap:wrap }
  .kopf strong { font-size:1.05rem }
  .zeit { color:var(--grau); font-size:.85rem; font-variant-numeric:tabular-nums }
  dl { display:grid; grid-template-columns:max-content 1fr; gap:4px 16px; margin:14px 0 0 }
  dt { color:var(--grau); font-size:.85rem } dd { margin:0; overflow-wrap:anywhere }
  dd.text { white-space:pre-wrap; padding:10px 12px; background:rgba(255,255,255,.03);
    border-left:2px solid var(--rand2); border-radius:0 6px 6px 0; grid-column:1/-1 }
  .pill { display:inline-block; padding:2px 10px; border-radius:99px; font-size:.78rem;
    font-weight:600; border:1px solid currentColor }
  .s-neu { color:var(--gold) } .s-bearbeitung { color:#7FB3E0 } .s-erledigt { color:#7FC49B }
  form.inline { display:inline } 
  .werkzeuge { display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;
    padding-top:14px; border-top:1px solid var(--rand) }
  button, .knopf { font:inherit; font-size:.85rem; font-weight:600; cursor:pointer;
    padding:7px 14px; border-radius:99px; border:1px solid var(--rand2);
    background:transparent; color:var(--gold); transition:background .15s, color .15s }
  button:hover { background:var(--gold); color:#14110a }
  button.warn { color:#E08585; border-color:rgba(224,133,133,.45) }
  button.warn:hover { background:#E08585; color:#1a0d0d }
  nav.filter { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px }
  nav.filter a { padding:6px 14px; border:1px solid var(--rand); border-radius:99px;
    font-size:.85rem; color:var(--grau) }
  nav.filter a.an { border-color:var(--rand2); color:var(--gold) }
  .melden { padding:11px 15px; border-radius:10px; margin-bottom:18px; font-size:.92rem }
  .ok { background:rgba(127,196,155,.12); border:1px solid rgba(127,196,155,.35); color:#9BD4B4 }
  .weg { background:rgba(224,133,133,.12); border:1px solid rgba(224,133,133,.35); color:#E5A0A0 }
  .anmelden { max-width:400px; margin:12vh auto; }
  label { display:block; font-size:.85rem; color:var(--grau); margin:14px 0 5px }
  input[type=password] { width:100%; font:inherit; padding:11px 13px; border-radius:9px;
    background:#0E0E10; border:1px solid var(--rand); color:var(--creme) }
  input[type=password]:focus { outline:none; border-color:var(--rand2) }
  .leer { text-align:center; color:var(--grau); padding:60px 20px }
  .hinweis { color:var(--grau); font-size:.82rem; margin-top:8px }
  code { font-family:ui-monospace,Menlo,Consolas,monospace; font-size:.85em; overflow-wrap:anywhere }
  .gut { color:#7FC49B } .schlecht { color:#E08585 }
</style>
</head>
<body>
<div class="wrap">

<?php if (!$eingerichtet): ?>
  <div class="anmelden">
    <h1>Adminbereich einrichten</h1>
    <p class="hinweis">Beim ersten Aufruf vergibst du ein Passwort. Gespeichert wird davon
      nur ein nicht rückrechenbarer Hash — das Passwort selbst steht nirgends.
      <strong>Schreib es dir auf</strong>, es lässt sich nicht wiederherstellen.</p>
    <?php if ($fehler): ?><div class="melden weg"><?= h($fehler) ?></div><?php endif; ?>
    <div class="melden <?= $basis === '' ? 'weg' : 'ok' ?>">
      <?php if ($basis === ''): ?>
        <strong>Achtung:</strong> <?= h($ortMeldung) ?>
      <?php else: ?>
        Ablage bereit: <code><?= h($basis) ?></code>
        <?= $imWeb ? ' — liegt im Webordner und ist per .htaccess gesperrt.'
                   : ' — liegt außerhalb des Webordners.' ?>
      <?php endif; ?>
    </div>
    <form method="post">
      <input type="hidden" name="tat" value="einrichten">
      <label for="p1">Passwort (mindestens 10 Zeichen)</label>
      <input id="p1" type="password" name="passwort" required minlength="10" autocomplete="new-password">
      <label for="p2">Passwort wiederholen</label>
      <input id="p2" type="password" name="passwort2" required minlength="10" autocomplete="new-password">
      <p></p><button type="submit">Passwort festlegen</button>
    </form>
  </div>

<?php elseif (!$angemeldet): ?>
  <div class="anmelden">
    <h1>Anfragen</h1>
    <?php if ($hinweis): ?><div class="melden ok"><?= h($hinweis) ?></div><?php endif; ?>
    <?php if ($fehler): ?><div class="melden weg"><?= h($fehler) ?></div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="tat" value="anmelden">
      <label for="pw">Passwort</label>
      <input id="pw" type="password" name="passwort" required autocomplete="current-password" autofocus>
      <p></p><button type="submit">Anmelden</button>
    </form>
    <p class="hinweis"><a href="index.html">← Zur Website</a></p>
  </div>

<?php else: ?>
  <header class="top">
    <div>
      <h1>Anfragen</h1>
      <div class="zahl"><?= count($liste) ?> gesamt<?= $offen ? ' · ' . $offen . ' neu' : '' ?>
        · Ablage: <?= $imWeb ? 'im Webordner (gesperrt)' : 'außerhalb des Webordners' ?></div>
    </div>
    <div>
      <a class="knopf" href="index.html">Website</a>
      <form class="inline" method="post"><input type="hidden" name="tat" value="abmelden">
        <button type="submit">Abmelden</button></form>
    </div>
  </header>

  <?php if ($hinweis): ?><div class="melden ok"><?= h($hinweis) ?></div><?php endif; ?>
  <?php if ($fehler): ?><div class="melden weg"><?= h($fehler) ?></div><?php endif; ?>

  <nav class="filter">
    <?php foreach (['alle' => 'Alle', 'neu' => 'Neu', 'bearbeitung' => 'In Bearbeitung', 'erledigt' => 'Erledigt'] as $k => $t): ?>
      <a class="<?= $filter === $k ? 'an' : '' ?>" href="?status=<?= h($k) ?>"><?= h($t) ?></a>
    <?php endforeach; ?>
  </nav>

  <?php if (!$sichtbar): ?>
    <div class="leer">Hier ist noch nichts.<?= $liste ? ' Mit diesem Filter jedenfalls.' : '' ?></div>
  <?php endif; ?>

  <?php foreach ($sichtbar as $d):
    $st   = (string)($d['status'] ?? 'neu');
    $f    = (array)($d['felder'] ?? []);
    $mail = (string)($f['E-Mail'] ?? '');
    $text = (string)($f['Projektbeschreibung'] ?? ($f['Nachricht'] ?? ''));
  ?>
    <article class="karte <?= $st === 'neu' ? 'neu' : '' ?>">
      <div class="kopf">
        <strong><?= h($f['Name'] ?? 'Ohne Namen') ?></strong>
        <span class="pill s-<?= h($st) ?>"><?= h($BEZEICHNUNG[$st] ?? $st) ?></span>
      </div>
      <div class="zeit"><?= h(date('d.m.Y · H:i', strtotime((string)($d['empfangen'] ?? 'now')))) ?>
        — <?= h((string)($d['betreff'] ?? '')) ?>
        <?php if (array_key_exists('bestaetigung', $d)): ?>
          · <span class="<?= $d['bestaetigung'] ? 'gut' : 'schlecht' ?>">
            <?= $d['bestaetigung'] ? 'Bestätigung verschickt' : 'Bestätigung fehlgeschlagen' ?></span>
        <?php endif; ?>
        <?php if (array_key_exists('einwilligung', $d) && !$d['einwilligung']): ?>
          · <span class="schlecht">ohne Einwilligung</span>
        <?php endif; ?>
        <?php if (array_key_exists('benachrichtigung', $d) && !$d['benachrichtigung']): ?>
          · <span class="schlecht">Benachrichtigung an mich fehlgeschlagen</span>
        <?php endif; ?></div>

      <dl>
        <?php if ($mail): ?><dt>E-Mail</dt><dd><a href="mailto:<?= h($mail) ?>"><?= h($mail) ?></a></dd><?php endif; ?>
        <?php if (!empty($f['Telefon'])): ?><dt>Telefon</dt><dd><a href="tel:<?= h(preg_replace('/[^\d+]/', '', $f['Telefon'])) ?>"><?= h($f['Telefon']) ?></a></dd><?php endif; ?>
        <?php if (!empty($f['Unternehmen'])): ?><dt>Unternehmen</dt><dd><?= h($f['Unternehmen']) ?></dd><?php endif; ?>
        <?php if ($text): ?><dd class="text"><?= h($text) ?></dd><?php endif; ?>
      </dl>

      <div class="werkzeuge">
        <?php foreach ($BEZEICHNUNG as $wert => $beschriftung): if ($wert === $st) continue; ?>
          <form class="inline" method="post">
            <input type="hidden" name="csrf" value="<?= h(token()) ?>">
            <input type="hidden" name="tat" value="status">
            <input type="hidden" name="id" value="<?= h((string)$d['id']) ?>">
            <input type="hidden" name="wert" value="<?= h($wert) ?>">
            <button type="submit">→ <?= h($beschriftung) ?></button>
          </form>
        <?php endforeach; ?>
        <?php if ($mail): ?>
          <a class="knopf" href="mailto:<?= h($mail) ?>?subject=<?= rawurlencode('Re: ' . (string)($d['betreff'] ?? '')) ?>">Antworten</a>
        <?php endif; ?>
        <form class="inline" method="post" onsubmit="return confirm('Diese Anfrage endgültig löschen?')">
          <input type="hidden" name="csrf" value="<?= h(token()) ?>">
          <input type="hidden" name="tat" value="loeschen">
          <input type="hidden" name="id" value="<?= h((string)$d['id']) ?>">
          <button class="warn" type="submit">Löschen</button>
        </form>
      </div>
    </article>
  <?php endforeach; ?>
<?php endif; ?>

</div>
</body>
</html>
