/* ================================
   Plot Twisted — SINGLE PLAYER JS
   Modes: Standard, Daily
   Continue overlay only after win/skip
   Credits screen intact
================================== */

// --- GAME START ---
document.addEventListener('DOMContentLoaded', () => {
  const game = new PlotTwistedGame();
  game.init();
});

// Safe no-op for Tone bootstrap if helper is missing
function ensureTone(ctx) {
  if (!window.Tone) return;
}

class PlotTwistedGame {
  constructor() {
    this.allClues = [];
    this.categoryData = new Map();
    this.dom = {};
    this.state = {
      currentScreen: 'start',
      currentGameMode: 'standard', // 'standard' | 'daily'
      selectedCategory: null,
      lastPlayedCategory: '',
      gameQuestions: [],
      currentQuestionIndex: 0, // points to NEXT question
      playedQuestions: [],
      totalScore: 0,
      currentAnswer: '',
      guessedLetters: [],
      isRoundOver: false,
      strikesLeft: 3,
    };
    this.settings = {
      darkMode: false,
      neonTheme: false,
      sound: false,
      numRounds: 5,
    };
    this.keyLayout = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')];
    this.synths = {};
    this.recognition = null;
    this.isListening = false;
    this._randomSeed = 0;
  }

  // ---------- INIT ----------
  init() {
    // cluesJSON must be loaded from clues.js before this file
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

  getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element #${id} not found`);
    return el;
  }

  cacheDomElements() {
    this.dom = {
      screens: {
        start: this.getEl('startScreen'),
        moreModes: this.getEl('moreModesScreen'), // present in HTML, but unused
        settings: this.getEl('settingsScreen'),
        category: this.getEl('categoryScreen'),
        game: this.getEl('gameScreen'),
        gameOver: this.getEl('gameOverScreen'),
        credits: this.getEl('creditsScreen'),
        dailyChallenge: this.getEl('dailyChallengeScreen'),
        howToPlay: this.getEl('howToPlayScreen'),
      },
      buttons: {
        startGameBtn: this.getEl('startGameBtn'),
        dailyChallengeBtn: this.getEl('dailyChallengeBtn'),
        moreModesBtn: this.getEl('moreModesBtn'),
        settingsBtn: this.getEl('settingsBtn'),
        howToPlayBtn: this.getEl('howToPlayBtn'),

        dailyChallengeBackBtn: this.getEl('dailyChallengeBackBtn'),
        moreModesBackBtn: this.getEl('moreModesBackBtn'),
        settingsBackBtn: this.getEl('settingsBackBtn'),
        howToPlayBackBtn: this.getEl('howToPlayBackBtn'),

        playBtn: this.getEl('playBtn'),
        categoryBackToHomeBtn: this.getEl('categoryBackToHomeBtn'),

        finishGameBtn: this.getEl('finishGameBtn'),
        playAgainBtn: this.getEl('playAgainBtn'),
        chooseNewCategoryBtn: this.getEl('chooseNewCategoryBtn'),
        gameOverBackToHomeBtn: this.getEl('gameOverBackToHomeBtn'),
        viewCreditsBtn: this.getEl('viewCreditsBtn'),

        creditsBackBtn: this.getEl('creditsBackBtn'),

        speakBtn: this.getEl('speakBtn'),
        skipBtn: this.getEl('skipBtn'),
        continueBtn: this.getEl('continueBtn'),

        confirmQuitBtn: this.getEl('confirmQuitBtn'),
        cancelQuitBtn: this.getEl('cancelQuitBtn'),

        shareScoreBtn: this.getEl('shareScoreBtn'),
      },
      displays: {
        gameProgressDisplay: this.getEl('gameProgressDisplay'),
        gameScoreDisplay: this.getEl('gameScoreDisplay'),
        strikesDisplay: this.getEl('strikesDisplay'),
        clueText: this.getEl('clueText'),
        wordDisplay: document.querySelector('.word-display'),
        gameOverTitle: this.getEl('gameOverTitle'),
        finalScore: this.getEl('finalScore'),
        scoreBreakdown: this.getEl('scoreBreakdown'),
        creditsContent: this.getEl('creditsContent'),
      },
      containers: {
        categoryGrid: document.querySelector('.category-grid'),
        keyboard: this.getEl('keyboard'),
        continueOverlay: this.getEl('continue-overlay'),
        confirmModal: this.getEl('confirmModal'),
        screenBox: document.querySelector('.screen-box'),
      },
      settingsToggles: {
        darkMode: this.getEl('darkModeToggle'),
        neonTheme: this.getEl('neonThemeToggle'),
        sound: this.getEl('soundToggle'),
        gameLength: this.getEl('gameLengthSelector'),
      }
    };
  }

  processCluesIntoCategories() {
    const categories = ["Family", "Sci-Fi", "Superhero", "Fantasy", "Emotional Damage", "Streaming Hits"];
    this.categoryData.clear();
    categories.forEach(name => {
      const first = this.allClues.find(c => c.category === name);
      if (first) {
        this.categoryData.set(name, {
          name,
          clues: this.allClues.filter(c => c.category === name),
          emoji: first.emoji,
        });
      }
    });
  }

  // ---------- SETTINGS ----------
  loadSettings() {
    const saved = localStorage.getItem('plotTwistedSettings');
    if (saved) Object.assign(this.settings, JSON.parse(saved));
  }
  saveSettings() {
    localStorage.setItem('plotTwistedSettings', JSON.stringify(this.settings));
  }
  applySettingsToUI() {
    document.body.classList.toggle('dark-mode', this.settings.darkMode);
    document.body.classList.toggle('neon-theme', this.settings.neonTheme);

    if (this.dom.settingsToggles.darkMode)
      this.dom.settingsToggles.darkMode.classList.toggle('active', this.settings.darkMode);
    if (this.dom.settingsToggles.neonTheme)
      this.dom.settingsToggles.neonTheme.classList.toggle('active', this.settings.neonTheme);
    if (this.dom.settingsToggles.sound)
      this.dom.settingsToggles.sound.classList.toggle('active', this.settings.sound);

    if (this.settings.sound) ensureTone(this);

    if (this.dom.settingsToggles.gameLength) {
      this.dom.settingsToggles.gameLength
        .querySelectorAll('.length-btn')
        .forEach(btn => btn.classList.toggle('selected', parseInt(btn.dataset.count) === this.settings.numRounds));
    }
  }

  // ---------- EVENTS ----------
  bindEventListeners() {
    const map = [
      { el: this.dom.buttons.startGameBtn, fn: () => this.showScreen('category') },
      { el: this.dom.buttons.settingsBtn, fn: () => this.showScreen('settings') },
      { el: this.dom.buttons.howToPlayBtn, fn: () => this.showScreen('howToPlay') },
      { el: this.dom.buttons.dailyChallengeBtn, fn: () => this.startDailyChallenge() },
      { el: this.dom.buttons.moreModesBtn, fn: () => this.showScreen('moreModes') }, // placeholder only

      { el: this.dom.buttons.settingsBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.howToPlayBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.dailyChallengeBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.moreModesBackBtn, fn: () => this.showScreen('start') },

      { el: this.dom.buttons.categoryBackToHomeBtn, fn: () => this.showScreen('start') },

      { el: this.dom.buttons.playBtn, fn: () => this.startGame() },
      { el: this.dom.buttons.skipBtn, fn: () => this.skipQuestion() },
      { el: this.dom.buttons.continueBtn, fn: () => this.nextQuestion() },

      { el: this.dom.buttons.finishGameBtn, fn: () => this.dom.containers.confirmModal.classList.add('active') },
      { el: this.dom.buttons.confirmQuitBtn, fn: () => { this.dom.containers.confirmModal.classList.remove('active'); this.endGame(true); } },
      { el: this.dom.buttons.cancelQuitBtn, fn: () => this.dom.containers.confirmModal.classList.remove('active') },

      { el: this.dom.buttons.playAgainBtn, fn: () => this.playAgain() },
      { el: this.dom.buttons.chooseNewCategoryBtn, fn: () => this.showScreen('category') },
      { el: this.dom.buttons.viewCreditsBtn, fn: () => this.showCredits() },
      { el: this.dom.buttons.gameOverBackToHomeBtn, fn: () => this.showScreen('start') },

      { el: this.dom.buttons.shareScoreBtn, fn: () => this.shareDailyScore() },
      { el: this.dom.buttons.speakBtn, fn: () => this.toggleSpeechRecognition() },
      { el: this.dom.buttons.creditsBackBtn, fn: () => this.showScreen('gameOver') },
    ];
    map.forEach(({ el, fn }) => { if (el) el.addEventListener('click', fn); });

    if (this.dom.containers.categoryGrid) {
      this.dom.containers.categoryGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (btn) this.selectCategory(btn.dataset.category);
      });
    }

    if (this.dom.settingsToggles.darkMode) {
      this.dom.settingsToggles.darkMode.addEventListener('click', () => {
        this.settings.darkMode = !this.settings.darkMode;
        if (this.settings.darkMode) this.settings.neonTheme = false;
        this.saveSettings(); this.applySettingsToUI();
      });
    }
    if (this.dom.settingsToggles.neonTheme) {
      this.dom.settingsToggles.neonTheme.addEventListener('click', () => {
        this.settings.neonTheme = !this.settings.neonTheme;
        if (this.settings.neonTheme) this.settings.darkMode = false;
        this.saveSettings(); this.applySettingsToUI();
      });
    }
    if (this.dom.settingsToggles.sound) {
      this.dom.settingsToggles.sound.addEventListener('click', () => {
        this.settings.sound = !this.settings.sound;
        this.saveSettings(); this.applySettingsToUI();
      });
    }
    if (this.dom.settingsToggles.gameLength) {
      this.dom.settingsToggles.gameLength.addEventListener('click', (e) => {
        if (e.target.classList.contains('length-btn')) {
          this.settings.numRounds = parseInt(e.target.dataset.count);
          this.saveSettings(); this.applySettingsToUI();
        }
      });
    }
  }

  // ---------- SCREENS ----------
  showScreen(screenName) {
    // Remove .active only from existing screens
    const screens = Object.values(this.dom.screens).filter(Boolean);
    screens.forEach(s => s.classList.remove('active'));

    const target = this.dom.screens[screenName];
    if (target) {
      target.classList.add('active');
      this.state.currentScreen = screenName;
    } else {
      console.warn(`[showScreen] Screen "${screenName}" not found`);
    }

    if (screenName === 'category') {
      this.state.selectedCategory = null;
      this.renderCategoryScreen();
    }
  }

  renderCategoryScreen() {
    const grid = this.dom.containers.categoryGrid;
    if (!grid) return;
    grid.innerHTML = '';
    if (this.dom.buttons.playBtn) this.dom.buttons.playBtn.disabled = true;

    this.categoryData.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.dataset.category = cat.name;
      btn.innerHTML = `
        <div class="poster-emoji">${cat.emoji}</div>
        <div class="tape-label">${cat.name}</div>
      `;
      grid.appendChild(btn);
    });
  }

  selectCategory(category) {
    this.state.selectedCategory = category;
    this.dom.containers.categoryGrid.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.category === category);
    });
    if (this.dom.buttons.playBtn) this.dom.buttons.playBtn.disabled = false;
    this.playSound('click');
  }

  // ---------- GAME FLOW ----------
startGame() {
    if (!this.state.selectedCategory) return;

    this.state.currentGameMode = 'standard';
    this.resetGameState();

    let availableClues = this.getAvailableClues(this.state.selectedCategory);

    // If not enough unseen clues, reset silently
    if (availableClues.length < this.settings.numRounds) {
        this.resetSeenClues(this.state.selectedCategory);
        availableClues = this.getAvailableClues(this.state.selectedCategory);
    }

    this.state.gameQuestions = this.shuffleArray(availableClues).slice(0, this.settings.numRounds);
    if (this.state.gameQuestions.length === 0) return;

    this.state.lastPlayedCategory = this.state.selectedCategory;
    this.state.currentQuestionIndex = 0;

    if (this.dom.displays.categoryDisplay) {
        this.dom.displays.categoryDisplay.textContent = this.state.selectedCategory;
    }

    this.showScreen('game');
    this.nextQuestion();
    this.playSound('start');
}


   this.state.gameQuestions = this.shuffleArray(availableClues).slice(0, this.settings.numRounds);
    if (this.state.gameQuestions.length === 0) {
      alert('Not enough questions in this category!');
      return;
    }

    this.state.lastPlayedCategory = this.state.selectedCategory;
    this.state.currentQuestionIndex = 0;

    this.showScreen('game');
    this.nextQuestion();
    this.playSound('start');
  }

  resetGameState() {
    this.state.totalScore = 0;
    this.state.playedQuestions = [];
    this.state.strikesLeft = 3;
  }

  nextQuestion() {
    if (this.state.currentQuestionIndex >= this.state.gameQuestions.length) {
      this.endGame();
      return;
    }

    const question = this.state.gameQuestions[this.state.currentQuestionIndex];
    this.state.currentAnswer = question.title.toUpperCase();
    this.state.guessedLetters = [];
    this.state.isRoundOver = false;

    // Show clue
    this.dom.displays.clueText.innerHTML = `<span class="clue-feedback">${question.clue}</span>`;
    // Hide Continue overlay UNTIL win/skip
    this.dom.containers.continueOverlay.classList.remove('visible');

    this.updateWordDisplay();
    this.renderKeyboard();
    this.updateGameStatusDisplay(true);

    // Move pointer so header shows "Question N / total"
    this.state.currentQuestionIndex++;
    this.updateGameStatusDisplay(true);
  }

  updateWordDisplay() {
    const answer = this.state.currentAnswer;
    const display = answer.split('').map(char => {
      if (char === ' ') return ' ';
      if (!/^[A-Z0-9]$/.test(char)) return char;
      return this.state.guessedLetters.includes(char) ? char : '_';
    }).join('');
    this.dom.displays.wordDisplay.textContent = display;
  }

  renderKeyboard() {
    const keyboard = this.dom.containers.keyboard;
    keyboard.innerHTML = '';
    this.keyLayout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';
      row.forEach(k => {
        const keyBtn = document.createElement('button');
        keyBtn.className = 'key';
        keyBtn.textContent = k;
        keyBtn.dataset.key = k;
        if (this.state.guessedLetters.includes(k)) keyBtn.classList.add('disabled');
        keyBtn.addEventListener('click', () => this.handleKeyPress(k));
        rowDiv.appendChild(keyBtn);
      });
      keyboard.appendChild(rowDiv);
    });
  }

  disableKeyboard() {
    this.dom.containers.keyboard.querySelectorAll('.key').forEach(k => k.classList.add('disabled'));
  }

  handleKeyPress(key) {
    if (this.state.isRoundOver || this.state.guessedLetters.includes(key)) return;

    this.state.guessedLetters.push(key);
    this.renderKeyboard();

    if (this.state.currentAnswer.includes(key)) {
      this.playSound('correct');
      this.updateWordDisplay();
      this.checkForWin();
    } else {
      // Wrong letter = strike
      this.playSound('incorrect');
      this.state.strikesLeft--;
      this.updateGameStatusDisplay();

      this.dom.containers.screenBox.classList.add('animate-shake');
      setTimeout(() => this.dom.containers.screenBox.classList.remove('animate-shake'), 500);

      if (this.state.strikesLeft <= 0) {
        this.revealAnswerAndEnd();
      }
    }
  }

  checkForWin() {
    const currentDisplay = this.dom.displays.wordDisplay.textContent;
    if (!currentDisplay.includes('_')) {
      this.state.isRoundOver = true;
      this.state.totalScore += 100;

      const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
      this.state.playedQuestions.push({ ...currentQuestion, status: 'correct' });
      this.markClueAsSeen(this.state.selectedCategory, currentQuestion.title);

      this.dom.displays.clueText.innerHTML = `<span class="clue-feedback correct">Correct!</span>`;
      // NOW show Continue overlay
      this.dom.containers.continueOverlay.classList.add('visible');
      this.playSound('winRound');
    }
  }

  skipQuestion() {
    if (this.state.isRoundOver) return;

    this.state.isRoundOver = true;
    const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
    this.state.playedQuestions.push({ ...currentQuestion, status: 'skipped' });
    this.markClueAsSeen(this.state.selectedCategory, currentQuestion.title);

    this.dom.displays.clueText.innerHTML =
      `<span class="clue-feedback incorrect">Skipped! The answer was: ${this.state.currentAnswer}</span>`;

    this.disableKeyboard();
    this.dom.buttons.skipBtn.disabled = true;
    // Show Continue only after skip
    this.dom.containers.continueOverlay.classList.add('visible');

    this.playSound('skip');
  }

  updateGameStatusDisplay() {
    const cur = Math.min(this.state.currentQuestionIndex, this.state.gameQuestions.length);
    this.dom.displays.gameProgressDisplay.textContent = `Question: ${cur} / ${this.state.gameQuestions.length}`;
    this.dom.displays.gameScoreDisplay.textContent = `Score: ${this.state.totalScore}`;
    this.dom.buttons.skipBtn.disabled = this.state.isRoundOver;

    const strikes = this.dom.displays.strikesDisplay;
    strikes.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const icon = document.createElement('i');
      icon.className = 'ph ph-ticket';
      if (i >= this.state.strikesLeft) icon.classList.add('used');
      strikes.appendChild(icon);
    }
  }

  // On final strike: reveal answer, then end game
  revealAnswerAndEnd() {
    this.disableKeyboard();
    this.state.isRoundOver = true;

    const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
    this.state.playedQuestions.push({ ...currentQuestion, status: 'missed' });

    if (this.dom.displays.clueText) {
      this.dom.displays.clueText.innerHTML =
        `<span class="clue-feedback incorrect">Out of strikes! Answer: ${this.state.currentAnswer}</span>`;
    }

    setTimeout(() => this.endGame(true), 1500);
  }

  endGame(wasQuit = false) {
    this.dom.displays.gameOverTitle.textContent = wasQuit ? 'Game Over' : 'Your Final Cut';

    if (this.state.currentGameMode === 'daily') {
      localStorage.setItem('pt_daily_played_' + new Date().toDateString(), 'true');
      this.checkDailyChallengeStatus();
      const correctCount = this.state.playedQuestions.filter(q => q.status === 'correct').length;
      this.dom.displays.finalScore.textContent = `${correctCount} / 10`;
      this.dom.buttons.playAgainBtn.style.display = 'none';
      this.dom.buttons.chooseNewCategoryBtn.style.display = 'none';
      this.dom.buttons.shareScoreBtn.style.display = 'inline-block';
    } else {
      this.dom.displays.finalScore.textContent = this.state.totalScore;
      this.dom.buttons.playAgainBtn.style.display = 'inline-block';
      this.dom.buttons.chooseNewCategoryBtn.style.display = 'inline-block';
      this.dom.buttons.shareScoreBtn.style.display = 'none';
    }

    const ul = this.dom.displays.scoreBreakdown;
    ul.innerHTML = '';
    this.state.playedQuestions.forEach(q => {
      const li = document.createElement('li');
      const pts = q.status === 'correct' ? '+100' : '+0';
      li.innerHTML = `<span>${q.title}</span><span>${pts}</span>`;
      ul.appendChild(li);
    });

    this.showScreen('gameOver');
    this.playSound('endGame');
  }

  playAgain() { this.showScreen('category'); }

  showCredits() {
    const wrap = this.dom.displays.creditsContent;
    wrap.innerHTML = '';
    this.state.playedQuestions.forEach(q => {
      const good = q.status === 'correct';
      const statusClass = good ? 'status-correct' : 'status-incorrect';
      const statusLabel = good ? 'CORRECT' : (q.status === 'skipped' ? 'SKIPPED' : 'MISSED');
      const item = document.createElement('div');
      item.className = 'credit-item';
      item.innerHTML = `
        <div class="title">${q.title}</div>
        <div class="clue">"${q.clue}"</div>
        <div class="${statusClass}">${statusLabel}</div>
      `;
      wrap.appendChild(item);
    });
    this.showScreen('credits');
  }

  // ---------- UTIL ----------
  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  setupSounds() {
    if (window.Tone && Object.keys(this.synths).length === 0) {
      this.synths.click = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination();
      this.synths.correct = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination();
      this.synths.incorrect = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 } }).toDestination();
      this.synths.winRound = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.2 } }).toDestination();
      this.synths.skip = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.2, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination();
      this.synths.endGame = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.1, decay: 0.5, sustain: 0, release: 0.2 } }).toDestination();
    }
  }

  playSound(name) {
    if (!this.settings.sound || !window.Tone) return;
    this.setupSounds();
    if (!this.synths[name]) return;
    Tone.start().then(() => {
      switch (name) {
        case 'click': this.synths.click.triggerAttackRelease('C5', '8n'); break;
        case 'correct': this.synths.correct.triggerAttackRelease('G5', '8n'); break;
        case 'incorrect': this.synths.incorrect.triggerAttackRelease('C3', '8n'); break;
        case 'winRound': this.synths.winRound.triggerAttackRelease(['C4','E4','G4','C5'],'8n'); break;
        case 'skip': this.synths.skip.triggerAttackRelease('F3','8n'); break;
        case 'endGame': this.synths.endGame.triggerAttackRelease('C2','2n'); break;
      }
    });
  }

  toggleSpeechRecognition() {
    alert('Speech recognition coming soon!');
  }

  // ---------- DAILY ----------
  checkDailyChallengeStatus() {
    try {
      const key = 'pt_daily_played_' + new Date().toDateString();
      const played = localStorage.getItem(key);
      const btn = this.dom.buttons.dailyChallengeBtn;
      if (btn) {
        btn.disabled = !!played;
        btn.textContent = played ? 'Daily ✅' : 'Daily Challenge';
        btn.setAttribute('aria-pressed', !!played);
      }
    } catch (e) {
      console.error('Daily status error:', e);
    }
  }

  startDailyChallenge() {
    try {
      const key = 'pt_daily_played_' + new Date().toDateString();
      if (localStorage.getItem(key)) {
        alert("You've already completed today's challenge!");
        return;
      }
      this.state.currentGameMode = 'daily';
      this.resetGameState();
      this.state.gameQuestions = this.getDailyQuestions();
      this.state.currentQuestionIndex = 0;

      this.showScreen('game');
      this.nextQuestion();
      this.playSound('start');
    } catch (e) {
      console.error('Failed to start daily:', e);
    }
  }

  getDailyQuestions() {
    const d = new Date();
    this._randomSeed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const arr = [...this.allClues];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.seededRandom() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 10);
  }

  seededRandom() {
    this._randomSeed = (this._randomSeed * 9301 + 49297) % 233280;
    return this._randomSeed / 233280.0;
  }

  shareDailyScore() {
    const correctCount = this.state.playedQuestions.filter(q => q.status === 'correct').length;
    const emojiGrid = this.state.playedQuestions.map(q => {
      if (q.status === 'correct') return '🟩';
      if (q.status === 'skipped') return '🟨';
      return '🟥';
    }).join('');
    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const shareText = `Plot Twisted - Daily Challenge ${dateString}\n\nI got ${correctCount}/10 correct!\n\n🎬 ${emojiGrid}\n\nCan you beat my score?`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => this.showCopiedFeedback())
        .catch(() => this.copyTextFallback(shareText));
    } else {
      this.copyTextFallback(shareText);
    }
  }

  copyTextFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); this.showCopiedFeedback(); } catch (e) { console.error('Copy failed'); }
    document.body.removeChild(ta);
  }

  showCopiedFeedback() {
    const btn = this.dom.buttons.shareScoreBtn;
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2000);
  }

  // ---------- SEEN / SHUFFLE ----------
  getSeenClues(category) {
    try {
      const seen = localStorage.getItem(`seenClues_${category}`);
      return seen ? JSON.parse(seen) : [];
    } catch { return []; }
  }
  markClueAsSeen(category, title) {
    try {
      if (this.state.currentGameMode === 'daily') return;
      const seen = this.getSeenClues(category);
      if (!seen.includes(title)) {
        seen.push(title);
        localStorage.setItem(`seenClues_${category}`, JSON.stringify(seen));
      }
    } catch {}
  }
  getAvailableClues(category) {
    const allInCategory = this.categoryData.get(category).clues;
    const seen = this.getSeenClues(category);
    return allInCategory.filter(c => !seen.includes(c.title));
  }
  resetSeenClues(category) {
    try { localStorage.removeItem(`seenClues_${category}`); } catch {}
  }
}

/* === Keyboard/Viewport spacing helper (unchanged) === */
(function () {
  const root = document.documentElement;
  const keyboardArea = document.getElementById('keyboard-area');

  function updateKeyboardVars() {
    if (keyboardArea) {
      root.style.setProperty('--kbui', keyboardArea.offsetHeight + 'px');
    }
    if (window.visualViewport) {
      const osk = Math.max(0, window.innerHeight - window.visualViewport.height);
      root.style.setProperty('--osk', osk + 'px');
    }
  }

  updateKeyboardVars();
  if (window.ResizeObserver && keyboardArea) new ResizeObserver(updateKeyboardVars).observe(keyboardArea);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateKeyboardVars);
    window.visualViewport.addEventListener('scroll', updateKeyboardVars);
  }
})();
