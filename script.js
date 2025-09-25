// script.js

// --- GAME BOOT ---
document.addEventListener('DOMContentLoaded', () => {
  const game = new PlotTwistedGame();
  game.init();
});

// Safe no-op for Tone bootstrap if upstream helper is missing
function ensureTone(ctx){ if(!window.Tone) return; }

// --- GAME CLASS ---
class PlotTwistedGame{
  constructor(){
    this.allClues = [];
    this.categoryData = new Map();
    this.dom = {};
    this.state = {
      currentScreen:'start',
      currentGameMode:'standard', // 'standard' | 'daily'
      selectedCategory:null,
      lastPlayedCategory:'',
      gameQuestions:[],
      currentQuestionIndex:0, // points to NEXT question to fetch in nextQuestion()
      playedQuestions:[],
      totalScore:0,
      currentAnswer:'',
      guessedLetters:[],
      isRoundOver:false,
      strikesLeft:3
    };
    this.settings = {
      darkMode:false,
      neonTheme:false,
      sound:false,
      numRounds:5
    };
    this.keyLayout = ['QWERTYUIOP'.split(''),'ASDFGHJKL'.split(''),'ZXCVBNM'.split('')];
    this.synths = {};
    this._randomSeed = 0;
  }

  init(){
    // cluesJSON comes from clues.js
    this.allClues = Array.isArray(window.cluesJSON) ? window.cluesJSON : [];
    this.cacheDomElements();
    this.processCluesIntoCategories();
    this.loadSettings();
    this.applySettingsToUI();
    this.bindEventListeners();
    this.renderCategoryScreen();
    this.checkDailyChallengeStatus();
    this.showScreen('start');
  }

  getEl(id){ const el = document.getElementById(id); if(!el) console.warn(`Element #${id} not found`); return el; }

  cacheDomElements(){
    this.dom = {
      screens:{
        start:this.getEl('startScreen'),
        moreModes:this.getEl('moreModesScreen'),
        settings:this.getEl('settingsScreen'),
        category:this.getEl('categoryScreen'),
        game:this.getEl('gameScreen'),
        gameOver:this.getEl('gameOverScreen'),
        credits:this.getEl('creditsScreen'),
        dailyChallenge:this.getEl('dailyChallengeScreen'),
        howToPlay:this.getEl('howToPlayScreen')
      },
      buttons:{
        startGameBtn:this.getEl('startGameBtn'),
        dailyChallengeBtn:this.getEl('dailyChallengeBtn'),
        moreModesBtn:this.getEl('moreModesBtn'),
        settingsBtn:this.getEl('settingsBtn'),
        howToPlayBtn:this.getEl('howToPlayBtn'),
        dailyChallengeBackBtn:this.getEl('dailyChallengeBackBtn'),
        moreModesBackBtn:this.getEl('moreModesBackBtn'),
        settingsBackBtn:this.getEl('settingsBackBtn'),
        howToPlayBackBtn:this.getEl('howToPlayBackBtn'),
        playBtn:this.getEl('playBtn'),
        categoryBackToHomeBtn:this.getEl('categoryBackToHomeBtn'),
        finishGameBtn:this.getEl('finishGameBtn'),
        playAgainBtn:this.getEl('playAgainBtn'),
        chooseNewCategoryBtn:this.getEl('chooseNewCategoryBtn'),
        gameOverBackToHomeBtn:this.getEl('gameOverBackToHomeBtn'),
        viewCreditsBtn:this.getEl('viewCreditsBtn'),
        creditsBackBtn:this.getEl('creditsBackBtn'),
        speakBtn:this.getEl('speakBtn'),
        skipBtn:this.getEl('skipBtn'),
        continueBtn:this.getEl('continueBtn'),
        confirmQuitBtn:this.getEl('confirmQuitBtn'),
        cancelQuitBtn:this.getEl('cancelQuitBtn'),
        shareScoreBtn:this.getEl('shareScoreBtn')
      },
      displays:{
        gameProgressDisplay:this.getEl('gameProgressDisplay'),
        gameScoreDisplay:this.getEl('gameScoreDisplay'),
        strikesDisplay:this.getEl('strikesDisplay'),
        clueText:this.getEl('clueText'),
        wordDisplay:document.querySelector('.word-display'),
        gameOverTitle:this.getEl('gameOverTitle'),
        finalScore:this.getEl('finalScore'),
        scoreBreakdown:this.getEl('scoreBreakdown'),
        creditsContent:this.getEl('creditsContent'),
        categoryPill:this.getEl('categoryPill')
      },
      containers:{
        categoryGrid:document.querySelector('.category-grid'),
        keyboard:this.getEl('keyboard'),
        continueOverlay:this.getEl('continue-overlay'),
        confirmModal:this.getEl('confirmModal'),
        screenBox:document.querySelector('.screen-box')
      }
    };
  }

  processCluesIntoCategories(){
    const allCats = [...new Set(this.allClues.map(c => c.category))];
    this.categoryData.clear();
    allCats.forEach(categoryName=>{
      const first = this.allClues.find(c=>c.category===categoryName);
      if(first){
        this.categoryData.set(categoryName,{
          name:categoryName,
          clues:this.allClues.filter(c=>c.category===categoryName),
          emoji:first.emoji || '🎬'
        });
      }
    });
  }

  loadSettings(){
    try{
      const saved = localStorage.getItem('plotTwistedSettings');
      if(saved) Object.assign(this.settings, JSON.parse(saved));
    }catch(e){}
  }
  saveSettings(){ localStorage.setItem('plotTwistedSettings', JSON.stringify(this.settings)); }

  applySettingsToUI(){
    document.body.classList.toggle('dark-mode', this.settings.darkMode);
    document.body.classList.toggle('neon-theme', this.settings.neonTheme);
    const gl = document.getElementById('gameLengthSelector');
    if(gl){
      gl.querySelectorAll('.length-btn').forEach(btn=>{
        btn.classList.toggle('selected', parseInt(btn.dataset.count)==this.settings.numRounds);
      });
    }
  }

  bindEventListeners(){
    const L = [
      {el:this.dom.buttons.startGameBtn, fn:()=>this.showScreen('category')},
      {el:this.dom.buttons.settingsBtn, fn:()=>this.showScreen('settings')},
      {el:this.dom.buttons.howToPlayBtn, fn:()=>this.showScreen('howToPlay')},
      {el:this.dom.buttons.dailyChallengeBtn, fn:()=>this.startDailyChallenge()},
      {el:this.dom.buttons.moreModesBtn, fn:()=>this.showScreen('moreModes')},
      {el:this.dom.buttons.settingsBackBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.howToPlayBackBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.dailyChallengeBackBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.moreModesBackBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.categoryBackToHomeBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.gameOverBackToHomeBtn, fn:()=>this.showScreen('start')},
      {el:this.dom.buttons.creditsBackBtn, fn:()=>this.showScreen('gameOver')},
      {el:this.dom.buttons.playBtn, fn:()=>this.startGame()},
      {el:this.dom.buttons.skipBtn, fn:()=>this.skipQuestion()},
      {el:this.dom.buttons.continueBtn, fn:()=>this.nextQuestion()},
      {el:this.dom.buttons.finishGameBtn, fn:()=>this.dom.containers.confirmModal.classList.add('active')},
      {el:this.dom.buttons.playAgainBtn, fn:()=>this.playAgain()},
      {el:this.dom.buttons.chooseNewCategoryBtn, fn:()=>this.showScreen('category')},
      {el:this.dom.buttons.viewCreditsBtn, fn:()=>this.showCredits()},
      {el:this.dom.buttons.shareScoreBtn, fn:()=>this.shareDailyScore()},
      {el:this.dom.buttons.confirmQuitBtn, fn:()=>{this.dom.containers.confirmModal.classList.remove('active'); this.endGame(true);}},
      {el:this.dom.buttons.cancelQuitBtn, fn:()=>this.dom.containers.confirmModal.classList.remove('active')}
    ];
    L.forEach(({el,fn})=>{ if(el) el.addEventListener('click',fn); });

    const dm = document.getElementById('darkModeToggle');
    const nm = document.getElementById('neonThemeToggle');
    const snd = document.getElementById('soundToggle');
    const gl = document.getElementById('gameLengthSelector');

    if(dm){ dm.addEventListener('click',()=>{ this.settings.darkMode=!this.settings.darkMode; if(this.settings.darkMode) this.settings.neonTheme=false; this.saveSettings(); this.applySettingsToUI(); }); }
    if(nm){ nm.addEventListener('click',()=>{ this.settings.neonTheme=!this.settings.neonTheme; if(this.settings.neonTheme) this.settings.darkMode=false; this.saveSettings(); this.applySettingsToUI(); }); }
    if(snd){ snd.addEventListener('click',()=>{ this.settings.sound=!this.settings.sound; this.saveSettings(); this.applySettingsToUI(); }); }
    if(gl){
      gl.addEventListener('click',(e)=>{
        if(e.target.classList.contains('length-btn')){
          this.settings.numRounds=parseInt(e.target.dataset.count);
          this.saveSettings(); this.applySettingsToUI();
        }
      });
    }

    // Category grid clicks
    if(this.dom.containers.categoryGrid){
      this.dom.containers.categoryGrid.addEventListener('click',(e)=>{
        const btn = e.target.closest('.category-btn');
        if(btn) this.selectCategory(btn.dataset.category);
      });
    }
  }

  showScreen(name){
    Object.values(this.dom.screens).forEach(s=>s.classList.remove('active'));
    if(this.dom.screens[name]){ this.dom.screens[name].classList.add('active'); this.state.currentScreen=name; }
    if(name==='category'){ this.state.selectedCategory=null; this.renderCategoryScreen(); }
  }

  renderCategoryScreen(){
    const grid = this.dom.containers.categoryGrid;
    grid.innerHTML = '';
    this.dom.buttons.playBtn.disabled = true;

    // Order categories alphabetically for consistency
    const cats = [...this.categoryData.values()].sort((a,b)=>a.name.localeCompare(b.name));
    cats.forEach(cat=>{
      const btn = document.createElement('button');
      btn.className='category-btn';
      btn.dataset.category = cat.name;
      btn.innerHTML = `
        <div class="poster-emoji">${cat.emoji || '🎬'}</div>
        <div class="tape-label">${cat.name}</div>
      `;
      grid.appendChild(btn);
    });
  }

  selectCategory(category){
    this.state.selectedCategory = category;
    this.dom.containers.categoryGrid.querySelectorAll('.category-btn').forEach(b=>{
      b.classList.toggle('selected', b.dataset.category===category);
    });
    this.dom.buttons.playBtn.disabled = false;
  }

  startGame(){
    if(!this.state.selectedCategory) return;

    this.state.currentGameMode = 'standard';
    this.resetGameState();

    let available = this.getAvailableClues(this.state.selectedCategory);
    if(available.length < this.settings.numRounds){
      alert(`You've completed the ${this.state.selectedCategory} category! Resetting clues.`);
      this.resetSeenClues(this.state.selectedCategory);
      available = this.getAvailableClues(this.state.selectedCategory);
    }

    this.state.gameQuestions = this.shuffleArray(available).slice(0, this.settings.numRounds);
    if(this.state.gameQuestions.length===0){ alert('Not enough questions in this category!'); return; }

    this.state.lastPlayedCategory = this.state.selectedCategory;
    this.state.currentQuestionIndex = 0;

    // show category in pill
    if(this.dom.displays.categoryPill){
      this.dom.displays.categoryPill.textContent = this.state.selectedCategory;
      this.dom.displays.categoryPill.style.display = 'block';
    }

    this.showScreen('game');
    this.nextQuestion();
  }

  resetGameState(){
    this.state.totalScore = 0;
    this.state.playedQuestions = [];
    this.state.strikesLeft = 3;
  }

  nextQuestion(){
    if(this.state.currentQuestionIndex >= this.state.gameQuestions.length){
      this.endGame(false);
      return;
    }

    const q = this.state.gameQuestions[this.state.currentQuestionIndex];
    this.state.currentAnswer = q.title.toUpperCase();
    this.state.guessedLetters = [];
    this.state.isRoundOver = false;

    this.dom.displays.clueText.innerHTML = `<span class="clue-feedback">${q.clue}</span>`;
    this.dom.containers.continueOverlay.classList.remove('visible'); // hide continue

    this.updateWordDisplay();
    this.renderKeyboard();
    this.updateGameStatusDisplay(true);

    // Advance pointer *after* rendering so header shows 1-based correctly
    this.state.currentQuestionIndex++;
    this.updateGameStatusDisplay(true);
  }

  updateWordDisplay(){
    const ans = this.state.currentAnswer;
    const display = ans.split('').map(ch=>{
      if(ch===' ') return ' ';
      if(!/^[A-Z0-9]$/.test(ch)) return ch;
      return this.state.guessedLetters.includes(ch) ? ch : '_';
    }).join('');
    this.dom.displays.wordDisplay.textContent = display;
  }

  renderKeyboard(){
    const wrap = this.dom.containers.keyboard;
    wrap.innerHTML = '';
    this.keyLayout.forEach(row=>{
      const r = document.createElement('div');
      r.className = 'keyboard-row';
      row.forEach(k=>{
        const b = document.createElement('button');
        b.className = 'key';
        b.textContent = k;
        b.dataset.key = k;
        if(this.state.guessedLetters.includes(k)) b.classList.add('disabled');
        b.addEventListener('click',()=>this.handleKeyPress(k));
        r.appendChild(b);
      });
      wrap.appendChild(r);
    });
  }

  disableKeyboard(){
    this.dom.containers.keyboard.querySelectorAll('.key').forEach(k=>k.classList.add('disabled'));
  }

  handleKeyPress(k){
    if(this.state.isRoundOver || this.state.guessedLetters.includes(k)) return;

    this.state.guessedLetters.push(k);
    this.renderKeyboard();

    if(this.state.currentAnswer.includes(k)){
      this.updateWordDisplay();
      this.checkForWin();
    }else{
      this.state.strikesLeft--;
      this.updateGameStatusDisplay();

      this.dom.containers.screenBox.classList.add('animate-shake');
      setTimeout(()=>this.dom.containers.screenBox.classList.remove('animate-shake'),500);

      if(this.state.strikesLeft<=0){
        this.revealAnswerAndEnd();
      }
    }
  }

  checkForWin(){
    if(!this.dom.displays.wordDisplay.textContent.includes('_')){
      this.state.isRoundOver = true;
      this.state.totalScore += 100;

      const currentQ = this.state.gameQuestions[this.state.currentQuestionIndex-1];
      this.state.playedQuestions.push({ ...currentQ, status:'correct' });
      this.markClueAsSeen(this.state.selectedCategory, currentQ.title);

      this.dom.displays.clueText.innerHTML = `<span class="clue-feedback correct">Correct!</span>`;
      this.dom.containers.continueOverlay.classList.add('visible'); // show continue only now
    }
  }

  skipQuestion(){
    if(this.state.isRoundOver) return;
    this.state.isRoundOver = true;

    const currentQ = this.state.gameQuestions[this.state.currentQuestionIndex-1];
    this.state.playedQuestions.push({ ...currentQ, status:'skipped' });
    this.markClueAsSeen(this.state.selectedCategory, currentQ.title);

    this.dom.displays.clueText.innerHTML = `<span class="clue-feedback incorrect">Skipped! The answer was: ${this.state.currentAnswer}</span>`;
    this.disableKeyboard();
    this.dom.buttons.skipBtn.disabled = true;
    this.dom.containers.continueOverlay.classList.add('visible'); // show continue
  }

  updateGameStatusDisplay(){
    const cur = Math.min(this.state.currentQuestionIndex, this.state.gameQuestions.length);
    this.dom.displays.gameProgressDisplay.textContent = `Question: ${cur} / ${this.state.gameQuestions.length}`;
    this.dom.displays.gameScoreDisplay.textContent = `Score: ${this.state.totalScore}`;
    this.dom.buttons.skipBtn.disabled = this.state.isRoundOver;

    const strikes = this.dom.displays.strikesDisplay;
    strikes.innerHTML = '';
    for(let i=0;i<3;i++){
      const icon = document.createElement('i');
      icon.className = 'ph ph-ticket';
      if(i >= this.state.strikesLeft) icon.classList.add('used');
      strikes.appendChild(icon);
    }
  }

  revealAnswerAndEnd(){
    this.disableKeyboard();
    this.state.isRoundOver = true;

    const currentQ = this.state.gameQuestions[this.state.currentQuestionIndex-1];
    this.state.playedQuestions.push({ ...currentQ, status:'missed' });

    this.dom.displays.clueText.innerHTML = `<span class="clue-feedback incorrect">Out of strikes! Answer: ${this.state.currentAnswer}</span>`;

    setTimeout(()=>this.endGame(true),1500); // show "Game Over" title variant
  }

  endGame(wasQuit=false){
    this.dom.displays.gameOverTitle.textContent = wasQuit ? 'Game Over' : 'Your Final Cut';

    if(this.state.currentGameMode==='daily'){
      localStorage.setItem('pt_daily_played_'+new Date().toDateString(),'true');
      this.checkDailyChallengeStatus();
      const correct = this.state.playedQuestions.filter(q=>q.status==='correct').length;
      this.dom.displays.finalScore.textContent = `${correct} / 10`;
      this.dom.buttons.playAgainBtn.style.display='none';
      this.dom.buttons.chooseNewCategoryBtn.style.display='none';
      this.dom.buttons.shareScoreBtn.style.display='inline-block';
    }else{
      this.dom.displays.finalScore.textContent = this.state.totalScore;
      this.dom.buttons.playAgainBtn.style.display='inline-block';
      this.dom.buttons.chooseNewCategoryBtn.style.display='inline-block';
      this.dom.buttons.shareScoreBtn.style.display='none';
    }

    const list = this.dom.displays.scoreBreakdown;
    list.innerHTML = '';
    this.state.playedQuestions.forEach(q=>{
      const li = document.createElement('li');
      const pts = q.status==='correct' ? '+100' : '+0';
      li.innerHTML = `<span>${q.title}</span><span>${pts}</span>`;
      list.appendChild(li);
    });

    this.showScreen('gameOver');
  }

  playAgain(){ this.showScreen('category'); }

  showCredits(){
    const c = this.dom.displays.creditsContent;
    c.innerHTML = '';
    this.state.playedQuestions.forEach(q=>{
      const good = q.status==='correct';
      const statusClass = good ? 'status-correct' : 'status-incorrect';
      const label = good ? 'CORRECT' : (q.status==='skipped' ? 'SKIPPED' : 'MISSED');
      const item = document.createElement('div');
      item.className='credit-item';
      item.innerHTML = `
        <div class="title">${q.title}</div>
        <div class="clue">"${q.clue}"</div>
        <div class="${statusClass}">${label}</div>
      `;
      c.appendChild(item);
    });
    this.showScreen('credits');
  }

  shuffleArray(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  // --- DAILY ---
  checkDailyChallengeStatus(){
    try{
      const key='pt_daily_played_'+new Date().toDateString();
      const played = localStorage.getItem(key);
      const btn = this.dom.buttons.dailyChallengeBtn;
      if(btn){
        btn.disabled = !!played;
        btn.textContent = played ? 'Daily ✅' : 'Daily Challenge';
        btn.setAttribute('aria-pressed', !!played);
      }
    }catch(e){}
  }

  startDailyChallenge(){
    const key='pt_daily_played_'+new Date().toDateString();
    if(localStorage.getItem(key)){ alert("You've already completed today's challenge!"); return; }
    this.state.currentGameMode = 'daily';
    this.resetGameState();
    this.state.gameQuestions = this.getDailyQuestions();
    this.state.currentQuestionIndex = 0;

    if(this.dom.displays.categoryPill){
      this.dom.displays.categoryPill.textContent = 'Daily';
      this.dom.displays.categoryPill.style.display = 'block';
    }

    this.showScreen('game');
    this.nextQuestion();
  }

  getDailyQuestions(){
    const date = new Date();
    this._randomSeed = date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
    let shuffled = [...this.allClues];
    for(let i=shuffled.length-1;i>0;i--){
      const j = Math.floor(this.seededRandom()*(i+1));
      [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
    }
    return shuffled.slice(0,10);
  }
  seededRandom(){ this._randomSeed=(this._randomSeed*9301+49297)%233280; return this._randomSeed/233280.0; }

  shareDailyScore(){
    const correct = this.state.playedQuestions.filter(q=>q.status==='correct').length;
    const emojiGrid = this.state.playedQuestions.map(q=>{
      if(q.status==='correct') return '🟩';
      if(q.status==='skipped') return '🟨';
      return '🟥';
    }).join('');
    const t = new Date();
    const ds = `${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`;
    const text = `Plot Twisted - Daily Challenge ${ds}\n\nI got ${correct}/10 correct!\n\n🎬 ${emojiGrid}\n\nCan you beat my score?`;
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(()=>this.showCopiedFeedback()).catch(()=>this.copyTextFallback(text));
    }else{
      this.copyTextFallback(text);
    }
  }
  copyTextFallback(text){
    const ta=document.createElement('textarea');
    ta.value=text; ta.style.position='fixed'; ta.style.top='0'; ta.style.left='0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try{ document.execCommand('copy'); this.showCopiedFeedback(); }catch(e){}
    document.body.removeChild(ta);
  }
  showCopiedFeedback(){
    const btn = this.dom.buttons.shareScoreBtn;
    const original = btn.textContent;
    btn.textContent='Copied!'; btn.disabled=true;
    setTimeout(()=>{ btn.textContent=original; btn.disabled=false; },2000);
  }

  // --- Seen/Smart Shuffle ---
  getSeenClues(category){
    try{ const s = localStorage.getItem(`seenClues_${category}`); return s?JSON.parse(s):[]; }catch(e){ return []; }
  }
  markClueAsSeen(category,title){
    try{
      if(this.state.currentGameMode==='daily') return;
      const seen=this.getSeenClues(category);
      if(!seen.includes(title)){ seen.push(title); localStorage.setItem(`seenClues_${category}`, JSON.stringify(seen)); }
    }catch(e){}
  }
  getAvailableClues(category){
    const all = this.categoryData.get(category)?.clues || [];
    const seen = this.getSeenClues(category);
    return all.filter(c=>!seen.includes(c.title));
  }
  resetSeenClues(category){
    try{ localStorage.removeItem(`seenClues_${category}`); }catch(e){}
  }
}

// --- SMALL UTILITY: keyboard/viewport vars (optional) ---
(function(){
  const root=document.documentElement;
  const kb=document.getElementById('keyboard-area');
  function upd(){
    if(kb) root.style.setProperty('--kbui', kb.offsetHeight+'px');
    if(window.visualViewport){
      const osk = Math.max(0, window.innerHeight - window.visualViewport.height);
      root.style.setProperty('--osk', osk+'px');
    }
  }
  upd();
  if(window.ResizeObserver && kb) new ResizeObserver(upd).observe(kb);
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',upd);
    window.visualViewport.addEventListener('scroll',upd);
  }
})();
