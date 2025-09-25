// --- GAME BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    const game = new PlotTwistedGame();
    game.init();
});

function ensureTone(ctx) { if (!window.Tone) return; }

class PlotTwistedGame {
    constructor() {
        this.allClues = [];
        this.categoryData = new Map();
        this.dom = {};
        this.state = {
            currentScreen: 'start',
            currentGameMode: 'standard', // 'standard' | 'daily' | 'passplay' | 'blitz'
            selectedCategory: null,
            lastPlayedCategory: '',
            gameQuestions: [],
            currentQuestionIndex: 0,
            playedQuestions: [],
            totalScore: 0,
            currentAnswer: '',
            guessedLetters: [],
            isRoundOver: false,
            strikesLeft: 3,
            // Pass & Play
            players: [], // [{name, score}]
            currentPlayerIndex: 0,
            // Blitz
            blitzMs: 0,
            blitzInterval: null
        };
        this.settings = { darkMode: false, neonTheme: false, sound: false, numRounds: 5 };
        this.keyLayout = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')];
        this.synths = {};
        this.recognition = null;
        this.isListening = false;
        this._randomSeed = 0;
    }

    init() {
        this.allClues = (typeof cluesJSON !== 'undefined') ? cluesJSON : [];
        this.cacheDomElements();
        this.processCluesIntoCategories();
        this.loadSettings();
        this.applySettingsToUI();
        this.bindEventListeners();
        this.renderCategoryScreen();
        this.checkDailyChallengeStatus();
        this.showScreen('start');
    }

    getEl(id) { const el = document.getElementById(id); if (!el) console.warn(`Element with ID '${id}' not found.`); return el; }

    cacheDomElements() {
        this.dom = {
            screens: {
                start: this.getEl('startScreen'),
                moreModes: this.getEl('moreModesScreen'),
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
                // new mode buttons
                passPlayBtn: this.getEl('passPlayBtn'),
                blitzBtn: this.getEl('blitzBtn'),
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
                gameContentArea: this.getEl('game-content-area'),
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
        categories.forEach(categoryName => {
            const firstClue = this.allClues.find(c => c.category === categoryName);
            if (firstClue) {
                this.categoryData.set(categoryName, {
                    name: categoryName,
                    clues: this.allClues.filter(c => c.category === categoryName),
                    emoji: firstClue.emoji,
                });
            }
        });
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('plotTwistedSettings');
        if (savedSettings) Object.assign(this.settings, JSON.parse(savedSettings));
    }
    saveSettings() { localStorage.setItem('plotTwistedSettings', JSON.stringify(this.settings)); }

    applySettingsToUI() {
        document.body.classList.toggle('dark-mode', this.settings.darkMode);
        document.body.classList.toggle('neon-theme', this.settings.neonTheme);
        if (this.dom.settingsToggles.darkMode) this.dom.settingsToggles.darkMode.classList.toggle('active', this.settings.darkMode);
        if (this.dom.settingsToggles.neonTheme) this.dom.settingsToggles.neonTheme.classList.toggle('active', this.settings.neonTheme);
        if (this.dom.settingsToggles.sound) this.dom.settingsToggles.sound.classList.toggle('active', this.settings.sound);
        if (this.settings.sound) ensureTone(this);
        if (this.dom.settingsToggles.gameLength) {
            this.dom.settingsToggles.gameLength.querySelectorAll('.length-btn').forEach(btn => {
                btn.classList.toggle('selected', parseInt(btn.dataset.count) === this.settings.numRounds);
            });
        }
    }

    bindEventListeners() {
        const listeners = [
            { el: this.dom.buttons.startGameBtn, fn: () => this.showScreen('category') },
            { el: this.dom.buttons.settingsBtn, fn: () => this.showScreen('settings') },
            { el: this.dom.buttons.howToPlayBtn, fn: () => this.showScreen('howToPlay') },
            { el: this.dom.buttons.dailyChallengeBtn, fn: () => this.startDailyChallenge() },
            { el: this.dom.buttons.moreModesBtn, fn: () => this.showScreen('moreModes') },
            { el: this.dom.buttons.settingsBackBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.howToPlayBackBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.dailyChallengeBackBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.moreModesBackBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.categoryBackToHomeBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.gameOverBackToHomeBtn, fn: () => this.showScreen('start') },
            { el: this.dom.buttons.creditsBackBtn, fn: () => this.showScreen('gameOver') },
            { el: this.dom.buttons.playBtn, fn: () => this.startGame() },
            { el: this.dom.buttons.skipBtn, fn: () => this.skipQuestion() },
            { el: this.dom.buttons.continueBtn, fn: () => this.nextQuestion() },
            { el: this.dom.buttons.finishGameBtn, fn: () => this.dom.containers.confirmModal.classList.add('active') },
            { el: this.dom.buttons.speakBtn, fn: () => this.toggleSpeechRecognition() },
            { el: this.dom.buttons.playAgainBtn, fn: () => this.playAgain() },
            { el: this.dom.buttons.chooseNewCategoryBtn, fn: () => this.showScreen('category') },
            { el: this.dom.buttons.viewCreditsBtn, fn: () => this.showCredits() },
            { el: this.dom.buttons.shareScoreBtn, fn: () => this.shareDailyScore() },
            { el: this.dom.buttons.confirmQuitBtn, fn: () => { this.dom.containers.confirmModal.classList.remove('active'); this.endGame(true); } },
            { el: this.dom.buttons.cancelQuitBtn, fn: () => this.dom.containers.confirmModal.classList.remove('active') },
            // new modes
            { el: this.dom.buttons.passPlayBtn, fn: () => this.setupPassPlay() },
            { el: this.dom.buttons.blitzBtn, fn: () => this.setupBlitz() },
        ];
        listeners.forEach(({ el, fn }) => { if (el) el.addEventListener('click', fn); });

        if (this.dom.containers.categoryGrid) {
            this.dom.containers.categoryGrid.addEventListener('click', (e) => {
                const categoryButton = e.target.closest('.category-btn');
                if (categoryButton) this.selectCategory(categoryButton.dataset.category);
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

    showScreen(screenName) {
        Object.values(this.dom.screens).forEach(screen => screen.classList.remove('active'));
        if (this.dom.screens[screenName]) {
            this.dom.screens[screenName].classList.add('active');
            this.state.currentScreen = screenName;
        }
        if (screenName === 'category') {
            this.state.selectedCategory = null;
            this.renderCategoryScreen();
        }
        if (screenName !== 'game' && this.state.currentGameMode === 'blitz') {
            this.stopBlitz();
        }
    }

    renderCategoryScreen() {
        const grid = this.dom.containers.categoryGrid;
        grid.innerHTML = '';
        this.dom.buttons.playBtn.disabled = true;
        this.categoryData.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.category = cat.name;
            btn.innerHTML = `<div class="poster-emoji">${cat.emoji}</div><div class="tape-label">${cat.name}</div>`;
            grid.appendChild(btn);
        });
    }

    selectCategory(category) {
        this.state.selectedCategory = category;
        this.dom.containers.categoryGrid.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.category === category);
        });
        this.dom.buttons.playBtn.disabled = false;
        this.playSound('click');
    }

    startGame() {
        if (!this.state.selectedCategory) return;
        this.state.currentGameMode = (this.state.currentGameMode === 'passplay' || this.state.currentGameMode === 'blitz')
            ? this.state.currentGameMode : 'standard';
        this.resetGameState();
        let availableClues = this.getAvailableClues(this.state.selectedCategory);

        const needed = (this.state.currentGameMode === 'passplay')
            ? this.settings.numRounds * Math.max(1, this.state.players.length || 1)
            : this.settings.numRounds;

        if (availableClues.length < needed) {
            alert(`You've completed the ${this.state.selectedCategory} category! Resetting clues for this category.`);
            this.resetSeenClues(this.state.selectedCategory);
            availableClues = this.getAvailableClues(this.state.selectedCategory);
        }

        this.state.gameQuestions = this.shuffleArray(availableClues).slice(0, needed);
        if (this.state.gameQuestions.length === 0) { alert("Not enough questions in this category!"); return; }

        this.state.lastPlayedCategory = this.state.selectedCategory;
        this.state.currentQuestionIndex = 0;
        this.showScreen('game');
        if (this.state.currentGameMode === 'blitz') this.startBlitzTimer();
        this.nextQuestion();
        this.playSound('start');
    }

    resetGameState() {
        this.state.totalScore = 0;
        this.state.playedQuestions = [];
        this.state.strikesLeft = 3;
        // keep players if passplay mode already set
        if (this.state.currentGameMode !== 'passplay') {
            this.state.players = [];
            this.state.currentPlayerIndex = 0;
        } else {
            // reset player scores but keep names
            this.state.players = this.state.players.map(p => ({...p, score: 0}));
            this.state.currentPlayerIndex = 0;
        }
        this.stopBlitz();
        this.removeBlitzBar();
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

        this.dom.displays.clueText.innerHTML = `<span class="clue-feedback">${question.clue}</span>`;
        this.dom.containers.continueOverlay.classList.remove('visible');

        this.updateWordDisplay();
        this.renderKeyboard();
        this.updateGameStatusDisplay(true);

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
        const keyboardContainer = this.dom.containers.keyboard;
        keyboardContainer.innerHTML = '';
        this.keyLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyBtn = document.createElement('button');
                keyBtn.className = 'key';
                keyBtn.textContent = key;
                keyBtn.dataset.key = key;
                if (this.state.guessedLetters.includes(key)) keyBtn.classList.add('disabled');
                keyBtn.addEventListener('click', () => this.handleKeyPress(key));
                rowDiv.appendChild(keyBtn);
            });
            keyboardContainer.appendChild(rowDiv);
        });
    }

    disableKeyboard() {
        this.dom.containers.keyboard.querySelectorAll('.key').forEach(key => key.classList.add('disabled'));
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
            // score to current player (passplay) or global
            if (this.state.currentGameMode === 'passplay' && this.state.players.length > 0) {
                this.state.players[this.state.currentPlayerIndex].score += 100;
            } else {
                this.state.totalScore += 100;
            }
            const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
            const owner = (this.state.currentGameMode === 'passplay' && this.state.players.length > 0)
                ? this.state.players[this.state.currentPlayerIndex].name : null;
            this.state.playedQuestions.push({ ...currentQuestion, status: 'correct', owner });
            this.markClueAsSeen(this.state.selectedCategory, currentQuestion.title);
            this.dom.displays.clueText.innerHTML = `<span class="clue-feedback correct">Correct!</span>`;
            this.dom.containers.continueOverlay.classList.add('visible');
            this.playSound('winRound');
        }
    }

    skipQuestion() {
        if (this.state.isRoundOver) return;
        this.state.isRoundOver = true;
        const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
        const owner = (this.state.currentGameMode === 'passplay' && this.state.players.length > 0)
            ? this.state.players[this.state.currentPlayerIndex].name : null;
        this.state.playedQuestions.push({ ...currentQuestion, status: 'skipped', owner });
        this.markClueAsSeen(this.state.selectedCategory, currentQuestion.title);
        this.dom.displays.clueText.innerHTML = `<span class="clue-feedback incorrect">Skipped! The answer was: ${this.state.currentAnswer}</span>`;
        this.disableKeyboard();
        this.dom.buttons.skipBtn.disabled = true;
        this.dom.containers.continueOverlay.classList.add('visible');
        this.playSound('skip');
    }

    updateGameStatusDisplay() {
        const cur = Math.min(this.state.currentQuestionIndex, this.state.gameQuestions.length);
        // progress left side: show player turn in passplay
        let left = `Question: ${cur} / ${this.state.gameQuestions.length}`;
        if (this.state.currentGameMode === 'passplay' && this.state.players.length) {
            left = `${this.state.players[this.state.currentPlayerIndex].name} • ${left}`;
        }
        this.dom.displays.gameProgressDisplay.textContent = left;

        // score right side
        if (this.state.currentGameMode === 'passplay' && this.state.players.length) {
            const s = this.state.players.map(p => `${p.name}: ${p.score}`).join(' · ');
            this.dom.displays.gameScoreDisplay.textContent = s;
        } else {
            this.dom.displays.gameScoreDisplay.textContent = `Score: ${this.state.totalScore}`;
        }

        // strikes UI (shared for all modes, matches your original rule)
        const strikesContainer = this.dom.displays.strikesDisplay;
        strikesContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const icon = document.createElement('i');
            icon.className = 'ph ph-ticket';
            if (i >= this.state.strikesLeft) icon.classList.add('used');
            strikesContainer.appendChild(icon);
        }
    }

    // On final strike: reveal answer, then end game
    revealAnswerAndEnd() {
        this.disableKeyboard();
        this.state.isRoundOver = true;
        const currentQuestion = this.state.gameQuestions[this.state.currentQuestionIndex - 1];
        const owner = (this.state.currentGameMode === 'passplay' && this.state.players.length > 0)
            ? this.state.players[this.state.currentPlayerIndex].name : null;
        this.state.playedQuestions.push({ ...currentQuestion, status: 'missed', owner });
        if (this.dom.displays.clueText) {
            this.dom.displays.clueText.innerHTML =
                `<span class="clue-feedback incorrect">Out of strikes! Answer: ${this.state.currentAnswer}</span>`;
        }
        setTimeout(() => { this.endGame(true); }, 1500);
    }

    endGame(wasQuit = false) {
        this.dom.displays.gameOverTitle.textContent = wasQuit ? "Game Over" : "Your Final Cut";

        if (this.state.currentGameMode === 'daily') {
            localStorage.setItem('pt_daily_played_' + new Date().toDateString(), 'true');
            this.checkDailyChallengeStatus();
            const correctCount = this.state.playedQuestions.filter(q => q.status === 'correct').length;
            this.dom.displays.finalScore.textContent = `${correctCount} / 10`;
            this.dom.buttons.playAgainBtn.style.display = 'none';
            this.dom.buttons.chooseNewCategoryBtn.style.display = 'none';
            this.dom.buttons.shareScoreBtn.style.display = 'inline-block';
        } else if (this.state.currentGameMode === 'passplay' && this.state.players.length) {
            const s = this.state.players.map(p => `${p.name}: ${p.score}`).join(' · ');
            this.dom.displays.finalScore.textContent = s;
            this.dom.buttons.playAgainBtn.style.display = 'inline-block';
            this.dom.buttons.chooseNewCategoryBtn.style.display = 'inline-block';
            this.dom.buttons.shareScoreBtn.style.display = 'none';
        } else {
            this.dom.displays.finalScore.textContent = this.state.totalScore;
            this.dom.buttons.playAgainBtn.style.display = 'inline-block';
            this.dom.buttons.chooseNewCategoryBtn.style.display = 'inline-block';
            this.dom.buttons.shareScoreBtn.style.display = 'none';
        }

        const breakdownList = this.dom.displays.scoreBreakdown;
        breakdownList.innerHTML = '';
        this.state.playedQuestions.forEach(q => {
            const points = q.status === 'correct' ? '+100' : '+0';
            const owner = q.owner ? ` <em>(${q.owner})</em>` : '';
            const li = document.createElement('li');
            li.innerHTML = `<span>${q.title}${owner}</span><span>${points}</span>`;
            breakdownList.appendChild(li);
        });

        this.showScreen('gameOver');
        this.playSound('endGame');
        this.stopBlitz();
        this.removeBlitzBar();
    }

    playAgain() { this.showScreen('category'); }

    showCredits() {
        const creditsContainer = this.dom.displays.creditsContent;
        creditsContainer.innerHTML = '';
        this.state.playedQuestions.forEach(q => {
            const item = document.createElement('div');
            item.className = 'credit-item';
            const good = q.status === 'correct';
            const statusClass = good ? 'status-correct' : 'status-incorrect';
            const statusLabel = good ? 'CORRECT' : (q.status === 'skipped' ? 'SKIPPED' : 'MISSED');
            const owner = q.owner ? ` <em>(${q.owner})</em>` : '';
            item.innerHTML = `
                <div class="title">${q.title}${owner}</div>
                <div class="clue">"${q.clue}"</div>
                <div class="${statusClass}">${statusLabel}</div>
            `;
            creditsContainer.appendChild(item);
        });
        this.showScreen('credits');
    }

    shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

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

    playSound(sound) {
        if (!this.settings.sound || !window.Tone) return;
        this.setupSounds();
        if (!this.synths[sound]) return;
        Tone.start().then(() => {
            switch (sound) {
                case 'click': this.synths.click.triggerAttackRelease('C5', '8n'); break;
                case 'correct': this.synths.correct.triggerAttackRelease('G5', '8n'); break;
                case 'incorrect': this.synths.incorrect.triggerAttackRelease('C3', '8n'); break;
                case 'winRound': this.synths.winRound.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '8n'); break;
                case 'skip': this.synths.skip.triggerAttackRelease('F3', '8n'); break;
                case 'endGame': this.synths.endGame.triggerAttackRelease('C2', '2n'); break;
            }
        });
    }

    toggleSpeechRecognition() { alert('Speech recognition coming soon!'); }

    // --- DAILY CHALLENGE ---
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
        } catch (e) { console.error('Error checking daily challenge status:', e); }
    }

    startDailyChallenge() {
        try {
            const key = 'pt_daily_played_' + new Date().toDateString();
            if (localStorage.getItem(key)) { alert("You've already completed today's challenge!"); return; }
            this.state.currentGameMode = 'daily';
            this.resetGameState();
            this.state.gameQuestions = this.getDailyQuestions();
            this.state.currentQuestionIndex = 0;
            this.showScreen('game');
            this.nextQuestion();
            this.playSound('start');
        } catch (e) { console.error('Failed to start daily challenge:', e); }
    }

    getDailyQuestions() {
        const date = new Date();
        this._randomSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        let shuffled = [...this.allClues];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(this.seededRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    }
    seededRandom() { this._randomSeed = (this._randomSeed * 9301 + 49297) % 233280; return this._randomSeed / 233280.0; }

    shareDailyScore() {
        const correctCount = this.state.playedQuestions.filter(q => q.status === 'correct').length;
        const emojiGrid = this.state.playedQuestions.map(q => q.status === 'correct' ? '🟩' : (q.status === 'skipped' ? '🟨' : '🟥')).join('');
        const today = new Date();
        const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const shareText = `Plot Twisted - Daily Challenge ${dateString}\n\nI got ${correctCount}/10 correct!\n\n🎬 ${emojiGrid}\n\nCan you beat my score?`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => this.showCopiedFeedback()).catch(err => { console.warn('Clipboard API failed, trying fallback:', err); this.copyTextFallback(shareText); });
        } else { this.copyTextFallback(shareText); }
    }
    copyTextFallback(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text; textArea.style.top = "0"; textArea.style.left = "0"; textArea.style.position = "fixed";
        document.body.appendChild(textArea); textArea.focus(); textArea.select();
        try { const ok = document.execCommand('copy'); if (ok) this.showCopiedFeedback(); else throw new Error('Fallback copy failed'); }
        catch (err) { console.error('Fallback copy failed:', err); }
        document.body.removeChild(textArea);
    }
    showCopiedFeedback() {
        const originalText = this.dom.buttons.shareScoreBtn.textContent;
        this.dom.buttons.shareScoreBtn.textContent = 'Copied!';
        this.dom.buttons.shareScoreBtn.disabled = true;
        setTimeout(() => { this.dom.buttons.shareScoreBtn.textContent = originalText; this.dom.buttons.shareScoreBtn.disabled = false; }, 2000);
    }

    // --- SMART SHUFFLE LOGIC ---
    getSeenClues(category) {
        try { const seen = localStorage.getItem(`seenClues_${category}`); return seen ? JSON.parse(seen) : []; }
        catch (e) { console.error("Could not get seen clues from localStorage", e); return []; }
    }
    markClueAsSeen(category, title) {
        try {
            if (this.state.currentGameMode === 'daily') return;
            const seen = this.getSeenClues(category);
            if (!seen.includes(title)) { seen.push(title); localStorage.setItem(`seenClues_${category}`, JSON.stringify(seen)); }
        } catch (e) { console.error("Could not save seen clue to localStorage", e); }
    }
    getAvailableClues(category) {
        const allInCategory = this.categoryData.get(category).clues;
        const seenInCategory = this.getSeenClues(category);
        return allInCategory.filter(clue => !seenInCategory.includes(clue.title));
    }
    resetSeenClues(category) { try { localStorage.removeItem(`seenClues_${category}`); } catch (e) { console.error("Could not reset seen clues", e); } }

    /* ==== PASS & PLAY ==== */
    setupPassPlay() {
        // simple prompts to keep HTML unchanged
        const countStr = prompt("How many players? (2-4)", "2");
        const count = Math.max(2, Math.min(4, parseInt(countStr || "2")));
        const players = [];
        for (let i=0;i<count;i++) {
            const name = prompt(`Player ${i+1} name:`, `Player ${i+1}`) || `Player ${i+1}`;
            players.push({ name, score: 0 });
        }
        this.state.currentGameMode = 'passplay';
        this.state.players = players;
        this.state.currentPlayerIndex = 0;
        this.showScreen('category'); // choose a category first
    }

    /* ==== BLITZ MODE ==== */
    setupBlitz() {
        this.state.currentGameMode = 'blitz';
        this.showScreen('category'); // choose a category first
    }
    startBlitzTimer() {
        this.insertBlitzBar();
        this.state.blitzMs = 60000; // 60s
        const started = Date.now();
        this.state.blitzInterval = setInterval(() => {
            const elapsed = Date.now() - started;
            const remain = Math.max(0, 60000 - elapsed);
            this.state.blitzMs = remain;
            this.renderBlitzBar(remain / 60000);
            if (remain <= 0) {
                this.stopBlitz();
                this.endGame();
            }
        }, 100);
    }
    stopBlitz() { if (this.state.blitzInterval) { clearInterval(this.state.blitzInterval); this.state.blitzInterval = null; } }
    insertBlitzBar() {
        if (!this.dom.containers.gameContentArea) return;
        if (this.dom.containers.gameContentArea.querySelector('.blitz-timer-wrap')) return;
        const wrap = document.createElement('div');
        wrap.className = 'blitz-timer-wrap';
        const bar = document.createElement('div');
        bar.className = 'blitz-timer-bar';
        wrap.appendChild(bar);
        this.dom.containers.gameContentArea.prepend(wrap);
    }
    renderBlitzBar(ratio) {
        const bar = this.dom.containers.gameContentArea.querySelector('.blitz-timer-bar');
        if (bar) bar.style.width = `${Math.round(ratio*100)}%`;
        this.dom.displays.gameProgressDisplay.textContent = `⏱ ${Math.ceil(this.state.blitzMs/1000)}s`;
    }
    removeBlitzBar() {
        const wrap = this.dom.containers.gameContentArea?.querySelector('.blitz-timer-wrap');
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    /* === SPACING SYNC WITH KEYBOARD === */
}

(function () {
  const root = document.documentElement;
  const keyboardArea = document.getElementById('keyboard-area');
  function updateKeyboardVars() {
    if (keyboardArea) root.style.setProperty('--kbui', keyboardArea.offsetHeight + 'px');
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