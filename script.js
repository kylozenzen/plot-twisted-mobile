/* ================================
    Plot Twisted — IMPROVED VERSION
    Based on reference implementation
    Features: Better state management, physical keyboard, clue tracking
================================== */

// --- BOOT ---
document.addEventListener('DOMContentLoaded', () => {
  const game = new PlotTwistedGame();
  game.init();
});

class PlotTwistedGame {
  constructor() {
    this.allClues = [];
    this.categoryData = new Map();
    this.dom = {};
    this.state = {
      currentScreen: 'start',
      selectedCategory: null,
      gameQuestions: [],
      currentQuestionIndex: 0,
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
      sound: true,
      numRounds: 10,
    };
    this.keyLayout = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')];
  }

  // ---------- INIT ----------
  init() {
    this.allClues = Array.isArray(window.cluesJSON) ? window.cluesJSON : [];
    this.cacheDomElements();
    this.processCluesIntoCategories();
    this.loadSettings();
    this.applySettingsToUI();
    this.bindEventListeners();
    this.renderCategoryScreen();
    this.setupPhysicalKeyboard();
    this.showScreen('startScreen');
  }

  getEl(id) {
    return document.getElementById(id);
  }

  cacheDomElements() {
    this.dom = {
      screens: {
        start: this.getEl('startScreen'),
        category: this.getEl('categoryScreen'),
        game: this.getEl('gameScreen'),
        gameOver: this.getEl('gameOverScreen'),
        settings: this.getEl('settingsScreen'),
        howToPlay: this.getEl('howToPlayScreen'),
        credits: this.getEl('creditsScreen'),
        dailyChallenge: this.getEl('dailyChallengeScreen'),
        moreModes: this.getEl('moreModesScreen'),
      },
      displays: {
        clueText: this.getEl('clueText'),
        wordDisplay: document.querySelector('.word-display'),
        gameProgressDisplay: this.getEl('gameProgressDisplay'),
        gameScoreDisplay: this.getEl('gameScoreDisplay'),
        strikesDisplay: this.getEl('strikesDisplay'),
        gameOverTitle: this.getEl('gameOverTitle'),
        finalScore: this.getEl('finalScore'),
        scoreBreakdown: this.getEl('scoreBreakdown'),
      },
      containers: {
        keyboard: this.getEl('keyboard'),
        continueOverlay: this.getEl('continue-overlay'),
        categoryGrid: document.querySelector('.category-grid'),
        confirmModal: this.getEl('confirmModal'),
        screenBox: document.querySelector('.screen-box'),
      },
      buttons: {
        startGameBtn: this.getEl('startGameBtn'),
        playBtn: this.getEl('playBtn'),
        skipBtn: this.getEl('skipBtn'),
        continueBtn: this.getEl('continueBtn'),
        finishGameBtn: this.getEl('finishGameBtn'),
        playAgainBtn: this.getEl('playAgainBtn'),
        speakBtn: this.getEl('speakBtn'),
        chooseNewCategoryBtn: this.getEl('chooseNewCategoryBtn'),
        viewCreditsBtn: this.getEl('viewCreditsBtn'),
        confirmQuitBtn: this.getEl('confirmQuitBtn'),
        cancelQuitBtn: this.getEl('cancelQuitBtn'),
        // Back buttons
        categoryBackToHomeBtn: this.getEl('categoryBackToHomeBtn'),
        gameOverBackToHomeBtn: this.getEl('gameOverBackToHomeBtn'),
        creditsBackBtn: this.getEl('creditsBackBtn'),
        settingsBtn: this.getEl('settingsBtn'),
        settingsBackBtn: this.getEl('settingsBackBtn'),
        howToPlayBtn: this.getEl('howToPlayBtn'),
        howToPlayBackBtn: this.getEl('howToPlayBackBtn'),
        dailyChallengeBtn: this.getEl('dailyChallengeBtn'),
        dailyChallengeBackBtn: this.getEl('dailyChallengeBackBtn'),
        moreModesBtn: this.getEl('moreModesBtn'),
        moreModesBackBtn: this.getEl('moreModesBackBtn'),
      },
      settingsToggles: {
        darkMode: this.getEl('darkModeToggle'),
        neonTheme: this.getEl('neonThemeToggle'),
        sound: this.getEl('soundToggle'),
        gameLength: this.getEl('gameLengthSelector'),
      },
    };
  }

  processCluesIntoCategories() {
    const catMap = new Map();
    
    // Build "All Categories" first
    catMap.set('All Categories', {
      name: 'All Categories',
      emoji: '🎬',
      clues: [...this.allClues],
    });

    // Build individual categories
    this.allClues.forEach(clue => {
      if (!catMap.has(clue.category)) {
        catMap.set(clue.category, {
          name: clue.category,
          emoji: clue.emoji || '🎬',
          clues: [],
        });
      }
      catMap.get(clue.category).clues.push(clue);
    });

    this.categoryData = catMap;
  }

  // ---------- SETTINGS ----------
  loadSettings() {
    try {
      const saved = localStorage.getItem('plotTwistedSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('plotTwistedSettings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  applySettingsToUI() {
    // Dark mode
    if (this.settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('neon-theme');
      if (this.dom.settingsToggles.darkMode) this.dom.settingsToggles.darkMode.classList.add('active');
      if (this.dom.settingsToggles.neonTheme) this.dom.settingsToggles.neonTheme.classList.remove('active');
    }
    // Neon theme
    else if (this.settings.neonTheme) {
      document.body.classList.add('neon-theme');
      document.body.classList.remove('dark-mode');
      if (this.dom.settingsToggles.neonTheme) this.dom.settingsToggles.neonTheme.classList.add('active');
      if (this.dom.settingsToggles.darkMode) this.dom.settingsToggles.darkMode.classList.remove('active');
    }
    // Light mode
    else {
      document.body.classList.remove('dark-mode', 'neon-theme');
      if (this.dom.settingsToggles.darkMode) this.dom.settingsToggles.darkMode.classList.remove('active');
      if (this.dom.settingsToggles.neonTheme) this.dom.settingsToggles.neonTheme.classList.remove('active');
    }

    // Sound toggle
    if (this.dom.settingsToggles.sound) {
      this.dom.settingsToggles.sound.classList.toggle('active', this.settings.sound);
    }

    // Game length buttons
    if (this.dom.settingsToggles.gameLength) {
      this.dom.settingsToggles.gameLength.querySelectorAll('.length-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.count) === this.settings.numRounds);
      });
    }
  }

  // ---------- EVENT LISTENERS ----------
  bindEventListeners() {
    const map = [
      // Main menu
      { el: this.dom.buttons.startGameBtn, fn: () => this.showScreen('category') },
      { el: this.dom.buttons.settingsBtn, fn: () => this.showScreen('settings') },
      { el: this.dom.buttons.howToPlayBtn, fn: () => this.showScreen('howToPlay') },
      { el: this.dom.buttons.dailyChallengeBtn, fn: () => this.showScreen('dailyChallenge') },
      { el: this.dom.buttons.moreModesBtn, fn: () => this.showScreen('moreModes') },

      // Back buttons
      { el: this.dom.buttons.categoryBackToHomeBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.settingsBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.howToPlayBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.dailyChallengeBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.moreModesBackBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.gameOverBackToHomeBtn, fn: () => this.showScreen('start') },
      { el: this.dom.buttons.creditsBackBtn, fn: () => this.showScreen('gameOver') },

      // Game flow
      { el: this.dom.buttons.playBtn, fn: () => this.startGame() },
      { el: this.dom.buttons.skipBtn, fn: () => this.skipQuestion() },
      { el: this.dom.buttons.continueBtn, fn: () => this.nextQuestion() },
      { el: this.dom.buttons.finishGameBtn, fn: () => this.showQuitConfirmation() },
      
      // Game over
      { el: this.dom.buttons.playAgainBtn, fn: () => this.playAgain() },
      { el: this.dom.buttons.chooseNewCategoryBtn, fn: () => this.showScreen('category') },
      { el: this.dom.buttons.viewCreditsBtn, fn: () => this.showCredits() },

      // Quit modal
      { el: this.dom.buttons.confirmQuitBtn, fn: () => this.quitGame() },
      { el: this.dom.buttons.cancelQuitBtn, fn: () => this.hideQuitConfirmation() },

      // Speak button
      { el: this.dom.buttons.speakBtn, fn: () => this.speakClue() },
    ];

    map.forEach(({ el, fn }) => {
      if (el) el.addEventListener('click', fn);
    });

    // Category selection
    if (this.dom.containers.categoryGrid) {
      this.dom.containers.categoryGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (btn) this.selectCategory(btn.dataset.category);
      });
    }

    // Settings toggles
    if (this.dom.settingsToggles.darkMode) {
      this.dom.settingsToggles.darkMode.addEventListener('click', () => {
        this.settings.darkMode = !this.settings.darkMode;
        if (this.settings.darkMode) this.settings.neonTheme = false;
        this.saveSettings();
        this.applySettingsToUI();
      });
    }

    if (this.dom.settingsToggles.neonTheme) {
      this.dom.settingsToggles.neonTheme.addEventListener('click', () => {
        this.settings.neonTheme = !this.settings.neonTheme;
        if (this.settings.neonTheme) this.settings.darkMode = false;
        this.saveSettings();
        this.applySettingsToUI();
      });
    }

    if (this.dom.settingsToggles.sound) {
      this.dom.settingsToggles.sound.addEventListener('click', () => {
        this.settings.sound = !this.settings.sound;
        this.saveSettings();
        this.applySettingsToUI();
      });
    }

    if (this.dom.settingsToggles.gameLength) {
      this.dom.settingsToggles.gameLength.addEventListener('click', (e) => {
        if (e.target.classList.contains('length-btn')) {
          this.settings.numRounds = parseInt(e.target.dataset.count);
          this.saveSettings();
          this.applySettingsToUI();
        }
      });
    }
  }

  // ---------- PHYSICAL KEYBOARD SUPPORT ----------
  setupPhysicalKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Only active during game screen and not round over
      if (this.state.currentScreen !== 'game' || this.state.isRoundOver) return;
      
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        this.handleKeyPress(key);
      }
    });
  }

  // ---------- SCREENS ----------
  showScreen(screenName) {
    Object.values(this.dom.screens).forEach(s => {
      if (s) s.classList.remove('active');
    });

    const target = this.dom.screens[screenName];
    if (target) {
      target.classList.add('active');
      this.state.currentScreen = screenName;
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
    this.playSound('correct');
  }

  // ---------- GAME FLOW ----------
  startGame() {
    if (!this.state.selectedCategory) return;

    this.resetGameState();

    const categoryClues = this.categoryData.get(this.state.selectedCategory)?.clues || [];
    const availableClues = this.getAvailableClues(categoryClues);

    // Reset if exhausted
    if (availableClues.length < this.settings.numRounds) {
      this.resetSeenClues(this.state.selectedCategory);
      this.state.gameQuestions = this.shuffleArray(categoryClues).slice(0, this.settings.numRounds);
    } else {
      this.state.gameQuestions = this.shuffleArray(availableClues).slice(0, this.settings.numRounds);
    }

    this.state.currentQuestionIndex = 0;
    this.showScreen('game');
    this.nextQuestion();
    this.playSound('win');
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
    this.dom.displays.clueText.textContent = question.clue;
    
    // Hide Continue overlay until win/skip
    this.dom.containers.continueOverlay.classList.remove('visible');

    this.updateWordDisplay();
    this.renderKeyboard();
    
    // Increment for display purposes
    this.state.currentQuestionIndex++;
    this.updateGameStatusDisplay();
  }

  updateWordDisplay() {
    const answer = this.state.currentAnswer;
    const display = answer.split('').map(char => {
      if (char === ' ') return '  '; // Double space for visibility
      if (!/^[A-Z0-9]$/.test(char)) return char;
      return this.state.guessedLetters.includes(char) ? char : '_';
    }).join(' ');
    
    this.dom.displays.wordDisplay.textContent = display;
  }

  renderKeyboard() {
    const keyboard = this.dom.containers.keyboard;
    if (!keyboard) return;
    
    keyboard.innerHTML = '';
    
    this.keyLayout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';
      
      row.forEach(key => {
        const keyBtn = document.createElement('button');
        keyBtn.className = 'key';
        keyBtn.textContent = key;
        keyBtn.dataset.key = key;
        
        if (this.state.guessedLetters.includes(key)) {
          keyBtn.classList.add('disabled');
          keyBtn.disabled = true;
        }
        
        keyBtn.addEventListener('click', () => this.handleKeyPress(key));
        rowDiv.appendChild(keyBtn);
      });
      
      keyboard.appendChild(rowDiv);
    });
  }

  disableKeyboard() {
    if (this.dom.containers.keyboard) {
      this.dom.containers.keyboard.querySelectorAll('.key').forEach(k => {
        k.classList.add('disabled');
        k.disabled = true;
      });
    }
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
      this.playSound('wrong');
      this.state.strikesLeft--;
      this.updateGameStatusDisplay();

      // Shake animation
      if (this.dom.containers.screenBox) {
        this.dom.containers.screenBox.classList.add('animate-shake');
        setTimeout(() => this.dom.containers.screenBox.classList.remove('animate-shake'), 500);
      }

      if (this.state.strikesLeft <= 0) {
        this.revealAnswerAndEnd();
      }
    }
  }

  checkForWin() {
    const display = this.dom.displays.wordDisplay.textContent.replace(/\s/g, '');
    const answer = this.state.currentAnswer.replace(/[^A-Z0-9]/g, '');
    
    if (display === answer) {
      this.state.isRoundOver = true;
      this.state.totalScore += 100;

      const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
      this.state.playedQuestions.push({ ...currentQuestion, status: 'correct' });
      this.markClueAsSeen(currentQuestion.title);

      this.dom.displays.clueText.innerHTML = `<span class="clue-feedback correct">✓ Correct!</span>`;
      this.dom.containers.continueOverlay.classList.add('visible');
      this.playSound('win');
    }
  }

  skipQuestion() {
    if (this.state.isRoundOver) return;

    this.state.isRoundOver = true;
    const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
    this.state.playedQuestions.push({ ...currentQuestion, status: 'skipped' });
    this.markClueAsSeen(currentQuestion.title);

    this.dom.displays.clueText.innerHTML = 
      `<span class="clue-feedback incorrect">Skipped! The answer was: ${this.state.currentAnswer}</span>`;

    this.disableKeyboard();
    if (this.dom.buttons.skipBtn) this.dom.buttons.skipBtn.disabled = true;
    this.dom.containers.continueOverlay.classList.add('visible');
  }

  updateGameStatusDisplay() {
    const cur = Math.min(this.state.currentQuestionIndex, this.state.gameQuestions.length);
    this.dom.displays.gameProgressDisplay.textContent = `${cur}/${this.state.gameQuestions.length}`;
    this.dom.displays.gameScoreDisplay.textContent = `Score: ${this.state.totalScore}`;
    
    if (this.dom.buttons.skipBtn) {
      this.dom.buttons.skipBtn.disabled = this.state.isRoundOver;
    }

    // Update strikes display
    this.dom.displays.strikesDisplay.textContent = `❌ ${this.state.strikesLeft}`;
  }

  revealAnswerAndEnd() {
    this.disableKeyboard();
    this.state.isRoundOver = true;

    const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
    this.state.playedQuestions.push({ ...currentQuestion, status: 'missed' });

    this.dom.displays.clueText.innerHTML = 
      `<span class="clue-feedback incorrect">✗ Out of strikes! Answer: ${this.state.currentAnswer}</span>`;

    setTimeout(() => this.endGame(true), 1500);
  }

  endGame(wasQuit = false) {
    this.dom.displays.gameOverTitle.textContent = wasQuit ? 'Game Over' : 'Your Final Cut';

    // Build score breakdown
    const breakdown = this.dom.displays.scoreBreakdown;
    breakdown.innerHTML = '';

    this.state.gameQuestions.forEach((q, index) => {
      const played = this.state.playedQuestions.find(pq => pq.title === q.title);
      const status = played ? played.status : 'missed';
      const points = status === 'correct' ? 100 : 0;

      const li = document.createElement('li');
      li.innerHTML = `
        <span>${q.title}</span>
        <span>${points}</span>
      `;
      breakdown.appendChild(li);
    });

    this.dom.displays.finalScore.textContent = this.state.totalScore;
    this.showScreen('gameOver');
  }

  playAgain() {
    this.startGame();
  }

  showCredits() {
    const creditsContent = this.getEl('creditsContent');
    if (creditsContent) {
      creditsContent.innerHTML = `
        <h2>PLOT TWISTED</h2>
        <h3>Cinema Edition</h3>
        <br>
        <p><strong>Game Design & Development</strong></p>
        <p>Ben Campbell</p>
        <br>
        <p><strong>Clue Writing</strong></p>
        <p>Ben Campbell</p>
        <p>With assistance from Claude (Anthropic)</p>
        <br>
        <p><strong>Special Thanks</strong></p>
        <p>To all movie fans who love a good plot twist!</p>
        <br>
        <p><strong>Connect</strong></p>
        <p><a href="https://x.com/Ben_Soup" target="_blank" style="color: var(--primary-color);">@Ben_Soup on X</a></p>
      `;
    }
    this.showScreen('credits');
  }

  showQuitConfirmation() {
    if (this.dom.containers.confirmModal) {
      this.dom.containers.confirmModal.classList.add('active');
    }
  }

  hideQuitConfirmation() {
    if (this.dom.containers.confirmModal) {
      this.dom.containers.confirmModal.classList.remove('active');
    }
  }

  quitGame() {
    this.hideQuitConfirmation();
    this.endGame(true);
  }

  // ---------- CLUE TRACKING ----------
  getAvailableClues(clues) {
    const seenKey = `pt_seen_${this.state.selectedCategory}`;
    const seen = JSON.parse(localStorage.getItem(seenKey) || '[]');
    return clues.filter(c => !seen.includes(c.title));
  }

  markClueAsSeen(title) {
    const seenKey = `pt_seen_${this.state.selectedCategory}`;
    const seen = JSON.parse(localStorage.getItem(seenKey) || '[]');
    if (!seen.includes(title)) {
      seen.push(title);
      localStorage.setItem(seenKey, JSON.stringify(seen));
    }
  }

  resetSeenClues(category) {
    const seenKey = `pt_seen_${category}`;
    localStorage.removeItem(seenKey);
  }

  // ---------- UTILITIES ----------
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  playSound(type) {
    if (!this.settings.sound) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
      case 'correct':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'wrong':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'win':
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1200;
          gain2.gain.value = 0.1;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.15);
        }, 150);
        break;
    }
  }

  speakClue() {
    if ('speechSynthesis' in window) {
      const text = this.dom.displays.clueText.textContent;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  }
}
