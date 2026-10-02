"""Scrive episodi.js con i soli episodi gia usciti.

Tutti gli episodi stanno cifrati in episodi.enc (generato da cruciverba-generatore/genera.py):
le soluzioni future non sono leggibili nel repo pubblico. Ogni venerdi GitHub Actions
(.github/workflows/cruciverba.yml) decifra il file e pubblica l'episodio della settimana.

Uso: CRUCIVERBA_CHIAVE=... python3 pubblica.py
"""
import json
import os
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

QUI = Path(__file__).parent
JS = QUI / "episodi.js"
ENC = QUI / "episodi.enc"

# Stessa regola di cruciverba.js: il #3 esce venerdi 9/10/2026, poi uno a settimana.
PRIMO_VENERDI, PRIMO_EPISODIO = date(2026, 10, 9), 3

OPENSSL = ["openssl", "enc", "-aes-256-cbc", "-pbkdf2", "-iter", "100000", "-md", "sha256", "-a", "-pass", "env:CRUCIVERBA_CHIAVE"]


def oggi_italia():
    return datetime.now(ZoneInfo("Europe/Rome")).date()


def episodi_usciti(oggi=None):
    giorni = ((oggi or oggi_italia()) - PRIMO_VENERDI).days
    return PRIMO_EPISODIO - 1 if giorni < 0 else PRIMO_EPISODIO + giorni // 7


def scrivi_pubblici(completi, oggi=None):
    """Scrive in episodi.js solo gli episodi usciti; restituisce quanti."""
    n = min(episodi_usciti(oggi), len(completi))
    JS.write_text(
        "// Episodi gia usciti, scritti da pubblica.py: non modificare a mano.\n"
        "const EPISODI = " + json.dumps(completi[:n], ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    return n


def cifra(completi, chiave):
    testo = json.dumps(completi, ensure_ascii=False).encode("utf-8")
    env = {**os.environ, "CRUCIVERBA_CHIAVE": chiave}
    ENC.write_bytes(subprocess.run(OPENSSL + ["-salt"], input=testo, env=env, capture_output=True, check=True).stdout)


def decifra():
    if not os.environ.get("CRUCIVERBA_CHIAVE"):
        sys.exit("Manca la variabile CRUCIVERBA_CHIAVE")
    out = subprocess.run(OPENSSL + ["-d"], input=ENC.read_bytes(), capture_output=True, check=True).stdout
    return json.loads(out)


if __name__ == "__main__":
    print(f"{scrivi_pubblici(decifra())} episodi pubblicati in {JS.name}")
