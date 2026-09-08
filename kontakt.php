<?php
declare(strict_types=1);

/**
 * Nimmt die Anfragen der beiden Formulare entgegen, legt sie auf dem
 * Server ab und schickt eine Benachrichtigung per E-Mail.
 *
 * Die Anfragen landen bewusst AUSSERHALB von public_html. Damit sind sie
 * ueber das Internet nicht erreichbar, auch nicht, wenn jemand den
 * Dateinamen erraet. Lesen kann sie nur admin.php.
 */

require __DIR__ . '/eb-config.php';

const MAX_PRO_STUNDE  = 8;      // pro IP-Adresse, gegen Massen-Einsendungen
const MAX_FELDLAENGE  = 5000;

// Diese Felder werden gespeichert - alles andere wird verworfen.
const ERLAUBTE_FELDER = ['Name', 'E-Mail', 'Telefon', 'Unternehmen',
                         'Projektbeschreibung', 'Nachricht'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function antwort(bool $ok, string $text, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['success' => $ok, 'message' => $text], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    antwort(false, 'Nur POST erlaubt.', 405);
}

// ---- Honigtopf: von Menschen unsichtbares Feld -------------------------
// Bots fuellen es aus. Wir tun so, als sei alles gut, speichern aber nichts.
if (trim((string)($_POST['botcheck'] ?? '')) !== '') {
    antwort(true, 'Danke!');
}

// ---- Speicherort bestimmen --------------------------------------------
[$basis, $imWeb, $meldung] = eb_datenort();
if ($basis === '') {
    antwort(false, 'Der Server konnte die Anfrage nicht speichern.', 500);
}
$anfragen = $basis . '/anfragen';

// ---- Einfache Begrenzung pro IP ---------------------------------------
$ip     = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$zaehler = $basis . '/limit-' . hash('sha256', $ip) . '.json';
$jetzt  = time();
$treffer = [];
if (is_file($zaehler)) {
    $treffer = json_decode((string)file_get_contents($zaehler), true) ?: [];
}
$treffer = array_values(array_filter($treffer, static fn($t) => $jetzt - (int)$t < 3600));
if (count($treffer) >= MAX_PRO_STUNDE) {
    antwort(false, 'Zu viele Anfragen in kurzer Zeit. Bitte später erneut versuchen.', 429);
}

// ---- Eingaben pruefen --------------------------------------------------
$felder = [];
foreach (ERLAUBTE_FELDER as $name) {
    $wert = trim((string)($_POST[$name] ?? ''));
    if ($wert !== '') {
        $felder[$name] = mb_substr($wert, 0, MAX_FELDLAENGE);
    }
}

$name  = $felder['Name']   ?? '';
$mail  = $felder['E-Mail'] ?? '';
$text  = $felder['Projektbeschreibung'] ?? ($felder['Nachricht'] ?? '');

if ($name === '' || $mail === '' || $text === '') {
    antwort(false, 'Bitte Name, E-Mail und Nachricht ausfüllen.', 422);
}
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    antwort(false, 'Die E-Mail-Adresse sieht nicht gültig aus.', 422);
}
// Zeilenumbrueche in Kopfzeilen verhindern (Header-Injection)
if (preg_match('/[\r\n]/', $name . $mail)) {
    antwort(false, 'Ungültige Eingabe.', 422);
}

// ---- Speichern ---------------------------------------------------------
$id      = date('Y-m-d_His') . '-' . bin2hex(random_bytes(4));
$betreff = trim((string)($_POST['subject'] ?? 'Anfrage über EB Solutions'));
$datensatz = [
    'id'        => $id,
    'empfangen' => date('c'),
    'status'    => 'neu',
    'betreff'   => mb_substr($betreff, 0, 200),
    'felder'    => $felder,
    'ip'        => $ip,
    'browser'   => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 300),
];

$ziel = $anfragen . '/' . $id . '.json';
if (file_put_contents($ziel, json_encode($datensatz, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) {
    antwort(false, 'Der Server konnte die Anfrage nicht speichern.', 500);
}
@chmod($ziel, 0600);

$treffer[] = $jetzt;
@file_put_contents($zaehler, json_encode($treffer), LOCK_EX);

// ---- Benachrichtigung per E-Mail --------------------------------------
$zeilen = [];
foreach ($felder as $k => $v) {
    $zeilen[] = $k . ': ' . $v;
}
$zeilen[] = '';
$zeilen[] = 'Empfangen: ' . date('d.m.Y H:i');
$zeilen[] = 'Im Adminbereich ansehen: https://ebsolutions.info/admin.php';

$kopf = [
    'From: EB Solutions Website <' . EB_EMPFAENGER . '>',
    'Reply-To: ' . $mail,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: EB Solutions',
];
$anMich = @mail(EB_EMPFAENGER, $datensatz['betreff'], implode("\n", $zeilen), implode("\r\n", $kopf));

// ---- Automatische Eingangsbestaetigung an den Absender ----------------
// Geht nicht an die eigene Adresse - das gaebe eine Mailschleife.
$bestaetigt = false;
if (strcasecmp($mail, EB_EMPFAENGER) !== 0) {
    $vorname = trim(explode(' ', $name)[0]);

    $uebersicht = [];
    foreach ($felder as $k => $v) {
        $uebersicht[] = $k . ': ' . $v;
    }

    $text = "Hallo " . $vorname . ",\n\n"
          . "vielen Dank für deine Nachricht. Sie ist bei mir angekommen, und ich\n"
          . "melde mich innerhalb von 24 Stunden bei dir.\n\n"
          . "Das hast du mir geschickt:\n"
          . str_repeat('-', 52) . "\n"
          . implode("\n", $uebersicht) . "\n"
          . str_repeat('-', 52) . "\n\n"
          . "Fällt dir noch etwas ein? Antworte einfach auf diese E-Mail.\n\n"
          . "Viele Grüße\n"
          . "Emilian Bleim\n\n"
          . "--\n"
          . "EB Solutions · Emilian Bleim\n"
          . "Bürgermeister-Mohr-Straße 11, 64711 Erbach\n"
          . "Telefon: +49 151 41603740\n"
          . "E-Mail: " . EB_EMPFAENGER . "\n"
          . "https://ebsolutions.info\n\n"
          . "Diese Bestätigung wurde automatisch erzeugt, weil das Formular auf\n"
          . "ebsolutions.info mit dieser E-Mail-Adresse ausgefüllt wurde.\n";

    $kopfBest = [
        'From: EB Solutions <' . EB_EMPFAENGER . '>',
        'Reply-To: ' . EB_EMPFAENGER,
        'Content-Type: text/plain; charset=UTF-8',
        'Auto-Submitted: auto-replied',
        'X-Auto-Response-Suppress: All',
    ];
    $bestaetigt = @mail($mail, 'Deine Anfrage bei EB Solutions', $text, implode("\r\n", $kopfBest));
}

// Im Datensatz festhalten, damit im Adminbereich sichtbar ist, ob es geklappt hat.
$datensatz['benachrichtigung'] = $anMich;
$datensatz['bestaetigung']     = $bestaetigt;
@file_put_contents($ziel, json_encode($datensatz, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

antwort(true, 'Vielen Dank! Deine Nachricht ist angekommen. Du bekommst gleich eine Bestätigung per E-Mail.');
