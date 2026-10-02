# Cruciverba Pontederese: come escono gli episodi

Non si crea più una cartella per episodio. Tutti gli episodi stanno cifrati in
`episodi.enc`; `episodi.js` contiene solo quelli già usciti, così le soluzioni future
non sono leggibili sul sito. Ogni venerdì GitHub Actions (`.github/workflows/cruciverba.yml`)
lancia `pubblica.py`, che decifra il file con il segreto `CRUCIVERBA_CHIAVE` e aggiunge
l'episodio della settimana a `episodi.js`.

- **Uscita automatica:** il #3 esce venerdì 9 ottobre 2026, poi uno nuovo ogni venerdì prima delle 7
  (costante `CRUCIVERBA_PRIMO_VENERDI` in `cruciverba.js`).
- **Link:** `gioca/` apre l'ultimo uscito, `gioca/?n=5` un episodio preciso.
  Gli episodi futuri non si aprono. `01/` e `02/` reindirizzano a `gioca/?n=1` e `?n=2`.
- **Archivio:** `index.html` elenca da solo gli episodi usciti.

## Aggiungere o cambiare parole

`episodi.js` ed `episodi.enc` sono generati: non modificarli a mano. Si lavora in
`Storie_Pontederesi/cruciverba-generatore/`:

1. modifica `parole.csv` (parola;definizione;livello;epoca;tema;fonte)
   - `epoca`: M fino al 1500, G 1500-1799, O Ottocento, N Novecento, C dal 2000.
     Ogni episodio mescola tre epoche diverse.
   - `tema` (facoltativo): crastan, piaggio, arte, calcio. Massimo una parola per tema
     a episodio, e un tetto totale (`MAX_PER_TEMA` in `genera.py`).
2. `python3 genera.py` riscrive `episodi-completi.json` (in chiaro, solo nel generatore),
   `episodi.enc` ed `episodi.js` (gli episodi già usciti restano fissi)
3. `python3 verifica.py` deve dare 0 errori; `python3 anteprima.py` aggiorna l'anteprima
4. commit e push del sito

Attenzione: rigenerare cambia anche l'ordine degli episodi futuri, mai quelli già usciti.
La data del primo venerdì è in due posti: `cruciverba.js` e `pubblica.py`.
