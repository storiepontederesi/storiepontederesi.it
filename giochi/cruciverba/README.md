# cruciverbapontederese
Il Cruciverba Pontederese: il gioco della newsletter "Rotatorie" di Storie Pontederesi

# Cruciverba Pontederese — Istruzioni per Claude Code

## Contesto del progetto
Questo repository contiene il **Cruciverba Pontederese**, il gioco interattivo allegato alla newsletter **Rotatorie** di **Storie Pontederesi** (storiepontederesi.substack.com).

Ogni episodio della newsletter ha il suo cruciverba numerato (#1, #2, #3...).

---

## Struttura del repository
```
cruciverbapontederese/
├── index.html                        ← pagina archivio (lista tutti gli episodi)
├── logo.png                          ← logo Storie Pontederesi
├── CLAUDE.md                         ← questo file
├── 01/
│   └── index.html                    ← cruciverba episodio #1
├── 02/
│   └── index.html                    ← cruciverba episodio #2
└── ...
```

---

## Come aggiungere un nuovo episodio

### 1. Crea la cartella
```bash
mkdir 03
```

### 2. Crea il file index.html nella nuova cartella
Copia la struttura dall'episodio precedente e modifica:
- Il numero episodio (`#2` → `#3`) nel titolo e nel testo
- Le **parole** del cruciverba (array `words`)
- Le **definizioni** nella sezione `.clues`
- Il **testo di condivisione** (`SHARETEXT`)
- Il link di navigazione (aggiorna "episodio precedente")

### 3. Aggiorna la pagina archivio
In `index.html` (cartella principale) aggiungi una nuova card:
```html
<a class="card" href="03/">
  <span class="card-num">#3</span>
  <span class="card-label">Gioca →</span>
</a>
```

### 4. Pubblica su GitHub
```bash
git add .
git commit -m "Aggiunto cruciverba #3"
git push
```

---

## Come definire le parole del cruciverba

Nel file `index.html` di ogni episodio, l'array `words` definisce le parole:

```javascript
const words=[
  {word:"PAROLA", row:0, col:0, dir:"H", num:1},  // H = orizzontale
  {word:"ALTRA",  row:2, col:3, dir:"V", num:2},  // V = verticale
];
```

- `row` e `col` indicano la cella di partenza (da 0)
- Le parole devono incrociarsi su almeno una lettera comune
- `ROWS` e `COLS` definiscono le dimensioni della griglia — adattali alle parole

---

## Stile grafico
- **Sfondo:** `#f2c9be` (rosa)
- **Colore principale:** `#8b1a2f` (rosso scuro)
- **Caselle cruciverba:** `#5bbfad` (teal)
- **Font titolo:** Permanent Marker (Google Fonts)
- **Logo:** `logo.png` nella root (percorso relativo `../logo.png` dagli episodi)

---

## Link importanti
- **Archivio cruciverba:** https://storiepontederesi.github.io/cruciverbapontederese/
- **Newsletter:** https://storiepontederesi.substack.com
- **Iscrizione:** https://storiepontederesi.substack.com/subscribe
- **Instagram:** https://www.instagram.com/storiepontederesi
- **Facebook:** https://www.facebook.com/storiepontederesi

---

## Note
- Il logo si trova nella cartella root, gli episodi lo referenziano con `../logo.png`
- La navigazione tra episodi usa percorsi relativi (`../01/`, `../02/`, `../`)
- Il pulsante "Soluzione" è posizionato DOPO le definizioni, non vicino alla griglia
- Il messaggio di completamento corretto è: *"🛵 Complimenti! Sei un vero pontederese DOC!"*
- Il messaggio soluzione è: *"Ecco le risposte. La prossima volta ci arrivi da solo!"*
- Il commento toscano sulla soluzione: *"Un ti riesce? Niente paura... guarda la soluzione — non lo diciamo a nessuno. 🤫"*