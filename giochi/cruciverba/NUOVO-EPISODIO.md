# Come aggiungere un nuovo episodio

## 1. Crea la cartella

```
mkdir 03
cp template/index.html 03/index.html
```

## 2. Modifica `03/index.html`

Cerca il blocco `initCruciverba({...})` in fondo al file e compila solo questi campi:

```js
initCruciverba({
  rows: 5,        // numero di righe occupate dalle parole (conta dall'alto, escludi righe vuote)
  cols: 9,        // numero di colonne occupate dalle parole (conta da sinistra, escludi colonne vuote)
  episodeNum: 3,  // numero episodio
  words: [
    {word:"PAROLA", row:0, col:0, dir:"H", num:1},  // H = orizzontale
    {word:"ALTRA",  row:0, col:3, dir:"V", num:2},  // V = verticale
  ]
});
```

**Campi word:**
- `word` — la parola in maiuscolo
- `row` — riga di partenza (0 = prima riga)
- `col` — colonna di partenza (0 = prima colonna)
- `dir` — `"H"` orizzontale, `"V"` verticale
- `num` — numero che appare nella casella (primo numero libero)

**Come calcolare rows e cols:**
- `rows` = riga più bassa occupata + 1 (es. se l'ultima parola arriva a riga 4 → rows: 5)
- `cols` = colonna più a destra occupata + 1 (es. se la parola più larga finisce a col 7 → cols: 8)

## 3. Aggiorna le definizioni

Nel file `03/index.html` aggiorna anche:
- Il tag `<title>` → `Il Cruciverba Pontederese #3`
- Il tag `og:title` → `Il Cruciverba Pontederese #3`
- Le definizioni (Orizzontali / Verticali) nell'HTML

## 4. Aggiorna l'archivio

In `index.html` aggiungi la card del nuovo episodio:

```html
<a class="card" href="03/">
  <span class="card-num">#3</span>
  <span class="card-label">Gioca →</span>
</a>
```

## 5. Aggiorna la navigazione

In `02/index.html` aggiorna il nav-episodi:

```html
<div class="nav-episodi">
  ← <a href="../01/">Episodio #1</a> &nbsp;|&nbsp;
  <a href="../02/">Episodio #2</a> &nbsp;|&nbsp;
  <a href="../">Tutti gli episodi</a>
</div>
```

## 6. Pubblica

```
git add .
git commit -m "Aggiunto cruciverba #3"
git push
```
