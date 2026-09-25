<?php
declare(strict_types=1);

/**
 * Gemeinsame Einstellungen fuer kontakt.php und admin.php.
 *
 * Sucht einen beschreibbaren Ort fuer die Anfragen. Am liebsten
 * ausserhalb von public_html - dort sind die Daten ueber das Internet
 * gar nicht erreichbar. Klappt das nicht (manche Hoster sperren das
 * Heimatverzeichnis fuer PHP), wird ein Ordner im Webbereich angelegt
 * und mit einer eigenen .htaccess abgeriegelt.
 */

const EB_EMPFAENGER = 'emilian@ebsolutions.info';

/** Sperrt ein Verzeichnis fuer Zugriffe ueber das Internet ab. */
function eb_abriegeln(string $pfad): void {
    $ht = $pfad . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht,
            "# Dieser Ordner enthaelt Kundendaten und darf nie ausgeliefert werden.\n" .
            "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n" .
            "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n" .
            "Options -Indexes\n");
    }
    if (!is_file($pfad . '/index.html')) {
        @file_put_contents($pfad . '/index.html', '');
    }
}

/**
 * Liefert [Pfad, liegtImWebordner, Meldung].
 * Pfad ist leer, wenn sich nirgends schreiben laesst.
 */
function eb_datenort(): array {
    $webordner = __DIR__;
    $daruber   = dirname($webordner);

    $kandidaten = [
        [$daruber . '/eb-daten',        false],  // bevorzugt: ausserhalb des Webordners
        [$daruber . '/.tmp/eb-daten',   false],
        [$webordner . '/eb-daten',      true ],  // Notloesung: im Webordner, abgeriegelt
    ];

    $versucht = [];
    foreach ($kandidaten as [$pfad, $imWeb]) {
        if (!is_dir($pfad)) { @mkdir($pfad, 0700, true); }
        if (is_dir($pfad) && is_writable($pfad)) {
            if ($imWeb) { eb_abriegeln($pfad); }
            if (!is_dir($pfad . '/anfragen')) { @mkdir($pfad . '/anfragen', 0700, true); }
            return [$pfad, $imWeb, 'Speicherort: ' . $pfad];
        }
        $versucht[] = $pfad;
    }
    return ['', false, 'Kein beschreibbarer Ordner gefunden. Versucht wurde: ' . implode(' , ', $versucht)];
}
