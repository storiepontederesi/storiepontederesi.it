# Vesple — Istruzioni per Claude Code

## Cos'è Vesple
**Vesple** è un gioco alla Wordle localizzato su Pontedera, allegato alla newsletter **Rotatorie** di **Storie Pontederesi**.

Il giocatore ha 6 tentativi per indovinare una parola di 5 lettere legata a Pontedera e al suo territorio. Dopo ogni tentativo le lettere si colorano:
- 🟩 **Verde** — lettera giusta, posizione giusta
- 🟨 **Giallo** — lettera presente, posizione sbagliata
- ⬜ **Grigio** — lettera non presente

---

## Struttura del repository
```
cruciverbapontederese/
├── vesple/
│   ├── index.html       ← gioco Vesple (una parola per episodio)
│   └── archivio.html    ← archivio di tutte le parole già giocate
```

---

## Stile grafico (identico al Cruciverba Pontederese)
- **Sfondo:** `#f2c9be` (rosa)
- **Colore principale:** `#8b1a2f` (rosso scuro)
- **Verde corretto:** `#5bbfad` (teal, stesso delle caselle cruciverba)
- **Giallo presente:** `#f5c842`
- **Grigio assente:** `#c4a89a`
- **Font titolo:** Permanent Marker (Google Fonts)
- **Logo:** `../LogoStoriePontederesi_cruciverba.png`

---

## Parole valide (solo 5 lettere, legate a Pontedera e territorio)
Esempi di parole da usare come soluzione o come vocabolario accettato:
```
VESPA, ARNO, PIAZZA (6 - scarta), ERA (3 - scarta)
CIELO, BORGO, FIUME, TORRE, MAPPA, TERRA, OLIVE, VIGNA,
SAGRA, FIERA, PRATO, COLLE, PORTA, BANCA, PIAVE (no),
TOSCA, DUOMO, PONTE, MUSEO, PARCO, CORSA, PIENA,
ABETE, GREVE, FESTA, CAMPO, PIANO, MILLE, MARZO
```
> La parola del giorno deve essere **esattamente 5 lettere**.
> Il vocabolario delle parole accettate può essere più ampio (parole italiane comuni a 5 lettere).

---

## Struttura HTML da generare

### Elementi obbligatori
1. **Titolo** "Vesple" con sottotitolo "#N — Newsletter Rotatorie"
2. **Griglia 6x5** — 6 righe (tentativi) × 5 colonne (lettere)
3. **Tastiera virtuale** — lettere A-Z più INVIO e CANC, con colori aggiornati
4. **Messaggio esito** — vittoria o sconfitta con parola rivelata
5. **Box condivisione** — appare solo a gioco finito, con griglia emoji da copiare
6. **Navigazione** — link all'archivio e all'episodio precedente
7. **Link social e iscrizione newsletter**
8. **Logo** in fondo

### Testo condivisione (emoji grid)
```
Vesple #N — Rotatorie / Storie Pontederesi
🟩🟨⬜🟩⬜
⬜🟩🟩⬜🟨
🟩🟩🟩🟩🟩
Gioca anche tu: [URL]
```

### Messaggi di esito
- **Vittoria al 1° tentativo:** "Incredibile! Sei una leggenda pontederese! 🛵"
- **Vittoria al 2°:** "Che fiuto! Ci sei arrivato quasi subito!"
- **Vittoria al 3°-4°:** "Bravo! Sei un vero conoscitore del territorio!"
- **Vittoria al 5°-6°:** "Ce l'hai fatta, per un pelo! 😅"
- **Sconfitta:** "Un ti riesce stavolta... La parola era [PAROLA]. Riprova al prossimo numero! 🤫"

---

## Come creare un nuovo episodio

### 1. Aggiorna la parola segreta
Nel file `vesple/index.html` cambia:
```javascript
const PAROLA_SEGRETA = "PONTE"; // cambia qui ogni episodio
const NUMERO_EPISODIO = 3;      // numero progressivo
```

### 2. Aggiorna l'archivio
In `vesple/archivio.html` aggiungi una riga alla tabella:
```html
<tr>
  <td>#3</td>
  <td>PONTE</td>
  <td><a href="../03-ponte/">Gioca ancora</a></td>
</tr>
```

### 3. Pubblica
```bash
git add .
git commit -m "Vesple #3 — parola: PONTE"
git push
```

---

## Note importanti
- Il vocabolario delle parole accettate deve essere un array JS nel file HTML
- La parola segreta va in maiuscolo nel codice
- La tastiera virtuale si aggiorna con i colori dopo ogni tentativo
- Su mobile la tastiera virtuale sostituisce quella di sistema (niente input field visibile)
- Il gioco blocca ulteriori tentativi dopo la vittoria o dopo 6 tentativi
- Stesso stile bottoni del cruciverba: bordo rosso scuro, hover riempimento rosso

---

## Link importanti
- **Vesple:** https://storiepontederesi.github.io/cruciverbapontederese/vesple/
- **Newsletter:** https://storiepontederesi.substack.com
- **Iscrizione:** https://storiepontederesi.substack.com/subscribe
- **Instagram:** https://www.instagram.com/storiepontederesi
- **Facebook:** https://www.facebook.com/storiepontederesi