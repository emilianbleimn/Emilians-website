#!/usr/bin/env python3
"""Baut vorschau.html - die komplette Website in einer einzigen Datei.

Warum es diese Datei gibt: Die Website besteht normalerweise aus mehreren
Dateien (index.html, styles.css, script.js, fonts/). Vorschau-Dienste wie
raw.githack.com liefern aber jede Datei als text/html aus - der Browser
lehnt das CSS dann ab und die Seite waere unformatiert. Sobald alles in
einer einzigen HTML-Datei steckt, stimmt der Typ und die Vorschau laedt
sauber, ohne weisses Aufblitzen und ohne Nachladen.

Fuer den echten Server wird diese Datei NICHT gebraucht - dort gehoeren
index.html, styles.css, script.js und fonts/ getrennt hin.

Aufruf im Projektverzeichnis:  python3 tools/vorschau-bauen.py
"""

import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'vorschau.html')

HINWEIS = (
    '<!-- AUTOMATISCH ERZEUGT - nicht von Hand bearbeiten.\n'
    '     Quelle: index.html + styles.css + script.js + fonts/\n'
    '     Neu bauen mit: python3 tools/vorschau-bauen.py -->'
)


def read(name):
    with open(os.path.join(ROOT, name), encoding='utf-8') as fh:
        return fh.read()


def main():
    html = read('index.html')
    css = read('styles.css')
    js = read('script.js')

    # Schriften als data:-URI einbetten, damit nichts nachgeladen wird.
    def embed(match):
        path = os.path.join(ROOT, 'fonts', match.group(1))
        with open(path, 'rb') as fh:
            data = base64.b64encode(fh.read()).decode()
        return "url('data:font/woff2;base64,%s')" % data

    css, fonts = re.subn(r"url\('fonts/([a-z0-9-]+\.woff2)'\)", embed, css)
    if not fonts:
        sys.exit('Keine Schriftverweise in styles.css gefunden.')

    head = re.search(r'<head>\n(.*?)\n</head>', html, re.S).group(1)
    body = re.search(r'<body>\n(.*)\n</body>', html, re.S).group(1)

    # Verweise auf ausgelagerte Dateien entfernen - der Inhalt kommt inline.
    head = re.sub(r'\s*<link rel="preload"[^>]*>', '', head)
    head = re.sub(r'\s*<link rel="stylesheet" href="styles\.css"[^>]*>', '', head)
    body = re.sub(r'\s*<script src="script\.js"[^>]*></script>', '', body)

    page = ('<!DOCTYPE html>\n<html lang="de">\n<head>\n%s\n%s\n<style>\n%s\n</style>\n'
            '</head>\n<body>\n%s\n<script>\n%s\n</script>\n</body>\n</html>\n'
            % (HINWEIS, head.rstrip(), css.rstrip(), body.rstrip(), js.rstrip()))

    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(page)

    print('vorschau.html gebaut: %.1f KB, %d Schriften eingebettet'
          % (len(page.encode()) / 1024, fonts))


if __name__ == '__main__':
    main()
