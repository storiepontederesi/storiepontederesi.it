function initCruciverba({rows, cols, words, episodeNum}) {
  const ROWS = rows, COLS = cols;
  const PAGEURL = window.location.href;
  const SHARETEXT = `Ho completato il Cruciverba Pontederese #${episodeNum}! 🛵 Riesci anche tu? Gioca qui: ${PAGEURL} — la newsletter Rotatorie di @storiepontederesi`;

  const solution = Array.from({length:ROWS}, () => Array(COLS).fill(null));
  const nums = Array.from({length:ROWS}, () => Array(COLS).fill(''));
  words.forEach(w => {
    for(let i=0; i<w.word.length; i++){
      const r = w.dir==='H' ? w.row : w.row+i;
      const c = w.dir==='H' ? w.col+i : w.col;
      solution[r][c] = w.word[i];
    }
    nums[w.row][w.col] = w.num;
  });

  const grid = document.getElementById('grid');
  grid.style.gridTemplateColumns = `repeat(${COLS},44px)`;
  const inputs = {};

  for(let r=0; r<ROWS; r++){
    for(let c=0; c<COLS; c++){
      const k = `${r},${c}`;
      const div = document.createElement('div');
      div.id = 'cell-'+k;
      if(solution[r][c]){
        div.className = 'cell active';
        if(nums[r][c]){
          const n = document.createElement('span');
          n.className = 'cell-num';
          n.textContent = nums[r][c];
          div.appendChild(n);
        }
        const inp = document.createElement('input');
        inp.maxLength = 1;
        inp.setAttribute('autocomplete','off');
        inp.addEventListener('input', e => {
          e.target.value = e.target.value.toUpperCase().slice(-1);
          document.getElementById('msg').textContent = '';
          document.getElementById('cell-'+k).classList.remove('correct','wrong');
          document.getElementById('shareBox').classList.remove('visible');
        });
        inp.addEventListener('keydown', e => {
          if(e.key==='Backspace' && !e.target.value){
            if(c>0 && solution[r][c-1]) inputs[`${r},${c-1}`]?.focus();
          } else if(e.key==='ArrowRight') focusNext(r,c,'H',1);
          else if(e.key==='ArrowLeft') focusNext(r,c,'H',-1);
          else if(e.key==='ArrowDown') focusNext(r,c,'V',1);
          else if(e.key==='ArrowUp') focusNext(r,c,'V',-1);
        });
        inp.addEventListener('keyup', e => {
          if(e.target.value){
            const hasRight = c+1<COLS && solution[r][c+1];
            const hasDown = r+1<ROWS && solution[r+1][c];
            if(hasRight) focusNext(r,c,'H',1);
            else if(hasDown) focusNext(r,c,'V',1);
          }
        });
        div.appendChild(inp);
        inputs[k] = inp;
      } else {
        div.className = 'cell';
      }
      grid.appendChild(div);
    }
  }

  function focusNext(r,c,dir,d){
    const nr = r+(dir==='V'?d:0), nc = c+(dir==='H'?d:0);
    const k = `${nr},${nc}`;
    if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && solution[nr][nc]) inputs[k]?.focus();
  }

  window.check = function(){
    let ok=0, tot=0, allFilled=true;
    for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++){
      const k = `${r},${c}`;
      if(solution[r][c]){
        tot++;
        const val = (inputs[k].value||'').toUpperCase();
        if(!val) allFilled = false;
        const cell = document.getElementById('cell-'+k);
        if(val===solution[r][c]){ok++; cell.classList.add('correct'); cell.classList.remove('wrong');}
        else if(val){cell.classList.add('wrong'); cell.classList.remove('correct');}
      }
    }
    const msg = document.getElementById('msg');
    const share = document.getElementById('shareBox');
    if(!allFilled){msg.textContent='Completa tutte le caselle prima di verificare.'; share.classList.remove('visible');}
    else if(ok===tot){msg.textContent='🛵 Complimenti! Sei un vero pontederese DOC!'; share.classList.add('visible');}
    else{msg.textContent=`Quasi! ${ok} di ${tot} lettere corrette. Dai, ce la fai!`; share.classList.remove('visible');}
  };

  window.reveal = function(){
    for(const k in inputs){
      const r=parseInt(k.split(',')[0]), c=parseInt(k.split(',')[1]);
      if(solution[r][c]) inputs[k].value = solution[r][c];
      document.getElementById('cell-'+k).classList.add('correct');
      document.getElementById('cell-'+k).classList.remove('wrong');
    }
    document.getElementById('msg').textContent = 'Ecco le risposte. La prossima volta ci arrivi da solo!';
    document.getElementById('shareBox').classList.remove('visible');
  };

  window.reset = function(){
    for(const k in inputs){
      inputs[k].value = '';
      document.getElementById('cell-'+k).classList.remove('correct','wrong');
    }
    document.getElementById('msg').textContent = '';
    document.getElementById('shareBox').classList.remove('visible');
  };

  window.shareWA = function(){
    window.location.href = 'https://wa.me/?text=' + encodeURIComponent(SHARETEXT);
  };

  window.shareIG = function(){
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

  window.shareFB = function(){
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(PAGEURL), '_blank');
  };

  window.copyText = function(){
    navigator.clipboard.writeText(SHARETEXT).then(() => {
      document.getElementById('copiedMsg').textContent = 'Testo copiato! Incollalo dove vuoi.';
      setTimeout(() => {document.getElementById('copiedMsg').textContent='';}, 3000);
    });
  };
}
