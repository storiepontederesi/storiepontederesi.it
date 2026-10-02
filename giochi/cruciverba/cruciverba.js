// Il Cruciverba Pontederese: motore di gioco.
// Gli episodi stanno in episodi.js (generato da Storie_Pontederesi/cruciverba-generatore).

// Venerdì in cui esce l'episodio #3: da qui ne esce uno nuovo ogni venerdì.
const CRUCIVERBA_PRIMO_VENERDI = { anno: 2026, mese: 10, giorno: 9, episodio: 3 };

function episodioCorrente(totale) {
  const p = CRUCIVERBA_PRIMO_VENERDI;
  const oggi = new Date();
  const giorni = Math.floor(
    (Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) - Date.UTC(p.anno, p.mese - 1, p.giorno)) / 86400000
  );
  const n = giorni < 0 ? p.episodio - 1 : p.episodio + Math.floor(giorni / 7);
  return Math.max(1, Math.min(n, totale));
}

// Celle occupate dalla parola w, in ordine.
function celleParola(w) {
  return Array.from(w.word, (_, i) => w.dir === 'H' ? [w.row, w.col + i] : [w.row + i, w.col]);
}

function initCruciverba({ rows, cols, words, episodeNum }) {
  const ROWS = rows, COLS = cols;
  const PAGEURL = window.location.href;
  const SHARETEXT = `Ho completato il Cruciverba Pontederese #${episodeNum}! 🛵 Riesci anche tu? Gioca qui: ${PAGEURL} (il cruciverba di Rotatorie, la newsletter di @storiepontederesi)`;

  const solution = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const nums = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
  const wordsAt = {}; // "r,c" -> {H: indice parola, V: indice parola}
  const errori = [];

  words.forEach((w, wi) => {
    celleParola(w).forEach(([r, c], i) => {
      if (r >= ROWS || c >= COLS) { errori.push(`${w.word} esce dalla griglia`); return; }
      if (solution[r][c] && solution[r][c] !== w.word[i]) errori.push(`${w.word} in conflitto in ${r},${c}`);
      solution[r][c] = w.word[i];
      (wordsAt[`${r},${c}`] ||= {})[w.dir] = wi;
    });
    nums[w.row][w.col] = w.num;
  });
  if (errori.length) console.error('Cruciverba non valido:', errori);

  const grid = document.getElementById('grid');
  grid.style.gridTemplateColumns = `repeat(${COLS}, auto)`;
  const inputs = {};
  let dir = 'H';
  let current = null;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const k = `${r},${c}`;
      const div = document.createElement('div');
      div.id = 'cell-' + k;
      if (!solution[r][c]) { div.className = 'cell'; grid.appendChild(div); continue; }

      div.className = 'cell active';
      if (nums[r][c]) {
        const n = document.createElement('span');
        n.className = 'cell-num';
        n.textContent = nums[r][c];
        div.appendChild(n);
      }
      const inp = document.createElement('input');
      inp.maxLength = 1;
      inp.setAttribute('autocomplete', 'off');
      inp.setAttribute('autocapitalize', 'characters');
      inp.setAttribute('aria-label', `Casella riga ${r + 1} colonna ${c + 1}`);

      inp.addEventListener('mousedown', () => {
        // Secondo tocco su un incrocio: cambia direzione.
        if (current === k && wordsAt[k].H !== undefined && wordsAt[k].V !== undefined) {
          dir = dir === 'H' ? 'V' : 'H';
          highlight();
        }
      });
      inp.addEventListener('focus', () => {
        current = k;
        if (wordsAt[k][dir] === undefined) dir = dir === 'H' ? 'V' : 'H';
        highlight();
      });
      inp.addEventListener('input', e => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
        clearFeedback(k);
        if (e.target.value) move(r, c, 1);
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value) {
          e.preventDefault();
          const prev = step(r, c, dir, -1);
          if (prev) { inputs[prev].value = ''; clearFeedback(prev); inputs[prev].focus(); }
        } else if (e.key.startsWith('Arrow')) {
          e.preventDefault();
          const d = { ArrowRight: ['H', 1], ArrowLeft: ['H', -1], ArrowDown: ['V', 1], ArrowUp: ['V', -1] }[e.key];
          const next = step(r, c, d[0], d[1]);
          if (next) { dir = d[0]; inputs[next].focus(); }
        }
      });
      div.appendChild(inp);
      inputs[k] = inp;
      grid.appendChild(div);
    }
  }

  function step(r, c, d, delta) {
    const nr = r + (d === 'V' ? delta : 0), nc = c + (d === 'H' ? delta : 0);
    return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && solution[nr][nc] ? `${nr},${nc}` : null;
  }

  function move(r, c, delta) {
    const next = step(r, c, dir, delta);
    if (next) inputs[next].focus();
  }

  function highlight() {
    document.querySelectorAll('.cell.in-word').forEach(el => el.classList.remove('in-word'));
    const wi = current && wordsAt[current][dir];
    if (wi === undefined || wi === null) return;
    celleParola(words[wi]).forEach(([r, c]) => document.getElementById(`cell-${r},${c}`).classList.add('in-word'));
  }

  function clearFeedback(k) {
    document.getElementById('msg').textContent = '';
    document.getElementById('cell-' + k).classList.remove('correct', 'wrong');
    document.getElementById('shareBox').classList.remove('visible');
  }

  window.check = function () {
    let ok = 0, tot = 0, allFilled = true;
    for (const k in inputs) {
      const [r, c] = k.split(',').map(Number);
      tot++;
      const val = inputs[k].value.toUpperCase();
      if (!val) allFilled = false;
      const cell = document.getElementById('cell-' + k);
      if (val === solution[r][c]) { ok++; cell.classList.add('correct'); cell.classList.remove('wrong'); }
      else if (val) { cell.classList.add('wrong'); cell.classList.remove('correct'); }
    }
    const msg = document.getElementById('msg');
    const share = document.getElementById('shareBox');
    if (!allFilled) { msg.textContent = 'Completa tutte le caselle prima di verificare.'; share.classList.remove('visible'); }
    else if (ok === tot) { msg.textContent = '🛵 Complimenti! Sei un vero pontederese DOC!'; share.classList.add('visible'); }
    else { msg.textContent = `Quasi! ${ok} di ${tot} lettere corrette. Dai, ce la fai!`; share.classList.remove('visible'); }
  };

  window.reveal = function () {
    for (const k in inputs) {
      const [r, c] = k.split(',').map(Number);
      inputs[k].value = solution[r][c];
      document.getElementById('cell-' + k).classList.add('correct');
      document.getElementById('cell-' + k).classList.remove('wrong');
    }
    document.getElementById('msg').textContent = 'Ecco le risposte. La prossima volta ci arrivi da solo!';
    document.getElementById('shareBox').classList.remove('visible');
  };

  window.reset = function () {
    for (const k in inputs) {
      inputs[k].value = '';
      document.getElementById('cell-' + k).classList.remove('correct', 'wrong');
    }
    document.getElementById('msg').textContent = '';
    document.getElementById('shareBox').classList.remove('visible');
  };

  window.shareWA = function () {
    window.location.href = 'https://wa.me/?text=' + encodeURIComponent(SHARETEXT);
  };

  window.shareIG = function () {
    navigator.clipboard.writeText(SHARETEXT).then(() => {
      document.getElementById('copiedMsg').textContent = 'Testo copiato! Incollalo nel post su Instagram.';
      setTimeout(() => {
        document.getElementById('copiedMsg').textContent = '';
        window.open('https://www.instagram.com/', '_blank');
      }, 900);
    }).catch(() => {
      window.open('https://www.instagram.com/', '_blank');
    });
  };

  window.shareFB = function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(PAGEURL), '_blank');
  };

  window.copyText = function () {
    navigator.clipboard.writeText(SHARETEXT).then(() => {
      document.getElementById('copiedMsg').textContent = 'Testo copiato! Incollalo dove vuoi.';
      setTimeout(() => { document.getElementById('copiedMsg').textContent = ''; }, 3000);
    });
  };
}
