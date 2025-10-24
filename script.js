// =============================================
// GAME STATE
// =============================================
let gameState = {
    currentScreen: 'start',
    selectedCategories: [],
    currentQuestionIndex: 0,
    score: 0,
    strikes: 3,
    maxStrikes: 3,
    questions: [],
    guessedLetters: [],
    currentAnswer: '',
    gameLength: 10,
    settings: {
        darkMode: false,
        neonTheme: false,
        sound: true
    }
};

// =============================================
// INITIALIZE
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    loadSettings();
});

function initializeGame() {
    showScreen('startScreen');
    generateKeyboard();
}

// =============================================
// SCREEN MANAGEMENT
// =============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // Start screen buttons
    document.getElementById('startGameBtn').addEventListener('click', () => showScreen('categoryScreen'));
    document.getElementById('dailyChallengeBtn').addEventListener('click', () => showScreen('dailyChallengeScreen'));
    document.getElementById('moreModesBtn').addEventListener('click', () => showScreen('moreModesScreen'));
    document.getElementById('settingsBtn').addEventListener('click', () => showScreen('settingsScreen'));
    document.getElementById('howToPlayBtn').addEventListener('click', () => showScreen('howToPlayScreen'));

    // Back buttons
    document.getElementById('dailyChallengeBackBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('moreModesBackBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('settingsBackBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('howToPlayBackBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('categoryBackToHomeBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('gameOverBackToHomeBtn').addEventListener('click', () => showScreen('startScreen'));
    document.getElementById('creditsBackBtn').addEventListener('click', () => showScreen('gameOverScreen'));

    // Category screen
    document.getElementById('playBtn').addEventListener('click', startGame);

    // Game screen
    document.getElementById('skipBtn').addEventListener('click', skipQuestion);
    document.getElementById('continueBtn').addEventListener('click', nextQuestion);
    document.getElementById('finishGameBtn').addEventListener('click', showQuitConfirmation);
    document.getElementById('speakBtn').addEventListener('click', speakClue);

    // Game over screen
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
    document.getElementById('chooseNewCategoryBtn').addEventListener('click', () => showScreen('categoryScreen'));
    document.getElementById('viewCreditsBtn').addEventListener('click', showCredits);

    // Quit confirmation modal
    document.getElementById('confirmQuitBtn').addEventListener('click', quitGame);
    document.getElementById('cancelQuitBtn').addEventListener('click', hideQuitConfirmation);

    // Settings
    setupSettingsListeners();

    // Populate categories
    populateCategories();
}

// =============================================
// CATEGORIES
// =============================================
function populateCategories() {
    const categoryGrid = document.querySelector('.category-grid');
    
    // Extract unique categories from clues
    const categories = {};
    window.cluesJSON.forEach(clue => {
        if (!categories[clue.category]) {
            categories[clue.category] = {
                name: clue.category,
                emoji: clue.emoji,
                count: 0
            };
        }
        categories[clue.category].count++;
    });

    // Add "All Categories" option
    const allCard = createCategoryCard('All Categories', '🎬', window.cluesJSON.length);
    categoryGrid.appendChild(allCard);

    // Add individual category cards
    Object.values(categories).forEach(cat => {
        const card = createCategoryCard(cat.name, cat.emoji, cat.count);
        categoryGrid.appendChild(card);
    });
}

function createCategoryCard(name, emoji, count) {
    const card = document.createElement('button');
    card.className = 'category-btn';
    card.innerHTML = `
        <div class="poster-emoji">${emoji}</div>
        <div class="tape-label">${name}</div>
    `;
    
    card.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        gameState.selectedCategories = name === 'All Categories' ? ['all'] : [name];
        // Enable play button
        document.getElementById('playBtn').disabled = false;
    });
    
    return card;
}

// =============================================
// GAME LOGIC
// =============================================
function startGame() {
    if (gameState.selectedCategories.length === 0) {
        alert('Please select a category first!');
        return;
    }

    // Reset game state
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.strikes = gameState.maxStrikes;
    gameState.questions = getRandomQuestions();
    
    showScreen('gameScreen');
    loadQuestion();
}

function getRandomQuestions() {
    let pool = window.cluesJSON;
    
    // Filter by category if not "all"
    if (!gameState.selectedCategories.includes('all')) {
        pool = pool.filter(clue => gameState.selectedCategories.includes(clue.category));
    }
    
    // Shuffle and take gameLength questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, gameState.gameLength);
}

function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
        return;
    }

    const question = gameState.questions[gameState.currentQuestionIndex];
    gameState.currentAnswer = question.title.toLowerCase();
    gameState.guessedLetters = [];

    // Update UI
    document.getElementById('clueText').textContent = question.clue;
    document.getElementById('gameProgressDisplay').textContent = `${gameState.currentQuestionIndex + 1}/${gameState.questions.length}`;
    document.getElementById('strikesDisplay').textContent = `❌ ${gameState.strikes}`;
    document.getElementById('gameScoreDisplay').textContent = `Score: ${gameState.score}`;
    
    displayWord();
    resetKeyboard();
    hideContinueOverlay();
}

function displayWord() {
    const wordDisplay = document.querySelector('.word-display');
    wordDisplay.innerHTML = '';
    
    for (let char of gameState.currentAnswer) {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        
        if (char === ' ') {
            tile.classList.add('space');
        } else if (/[^a-z]/.test(char)) {
            // Show non-letter characters (like &, :, numbers)
            tile.textContent = char;
            tile.classList.add('revealed');
        } else if (gameState.guessedLetters.includes(char)) {
            tile.textContent = char.toUpperCase();
            tile.classList.add('revealed');
        }
        
        wordDisplay.appendChild(tile);
    }
}

function guessLetter(letter) {
    if (gameState.guessedLetters.includes(letter)) return;
    
    gameState.guessedLetters.push(letter);
    
    // Check if letter is in answer
    if (gameState.currentAnswer.includes(letter)) {
        playSound('correct');
        displayWord();
        
        // Check if word is complete
        if (isWordComplete()) {
            setTimeout(() => {
                gameState.score += 100;
                showContinueOverlay();
                playSound('win');
            }, 300);
        }
    } else {
        gameState.strikes--;
        playSound('wrong');
        document.getElementById('strikesDisplay').textContent = `❌ ${gameState.strikes}`;
        
        if (gameState.strikes <= 0) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    }
    
    // Disable the letter button
    const btn = document.querySelector(`[data-letter="${letter}"]`);
    if (btn) {
        btn.disabled = true;
        btn.classList.add('used');
    }
}

function isWordComplete() {
    for (let char of gameState.currentAnswer) {
        if (/[a-z]/.test(char) && !gameState.guessedLetters.includes(char)) {
            return false;
        }
    }
    return true;
}

function skipQuestion() {
    showContinueOverlay();
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    loadQuestion();
}

function endGame() {
    showGameOverScreen();
}

// =============================================
// KEYBOARD
// =============================================
function generateKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];
    
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        for (let letter of row) {
            const btn = document.createElement('button');
            btn.className = 'key';
            btn.textContent = letter.toUpperCase();
            btn.setAttribute('data-letter', letter);
            btn.addEventListener('click', () => guessLetter(letter));
            rowDiv.appendChild(btn);
        }
        
        keyboard.appendChild(rowDiv);
    });
}

function resetKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('used');
    });
}

// =============================================
// CONTINUE OVERLAY
// =============================================
function showContinueOverlay() {
    document.getElementById('continue-overlay').classList.add('active');
    
    // Reveal the answer
    const tiles = document.querySelectorAll('.letter-tile');
    tiles.forEach(tile => {
        if (!tile.classList.contains('space') && !tile.classList.contains('revealed')) {
            const index = Array.from(tiles).indexOf(tile);
            const char = gameState.currentAnswer[index];
            if (char && /[a-z]/.test(char)) {
                tile.textContent = char.toUpperCase();
                tile.classList.add('revealed');
            }
        }
    });
}

function hideContinueOverlay() {
    document.getElementById('continue-overlay').classList.remove('active');
}

// =============================================
// GAME OVER SCREEN
// =============================================
function showGameOverScreen() {
    const breakdown = document.getElementById('scoreBreakdown');
    breakdown.innerHTML = '';
    
    gameState.questions.forEach((q, index) => {
        const li = document.createElement('li');
        const wasAnswered = index < gameState.currentQuestionIndex || (index === gameState.currentQuestionIndex && isWordComplete());
        li.innerHTML = `
            <span>${q.title}</span>
            <span>${wasAnswered ? '100' : '0'}</span>
        `;
        breakdown.appendChild(li);
    });
    
    document.getElementById('finalScore').textContent = gameState.score;
    showScreen('gameOverScreen');
}

function playAgain() {
    startGame();
}

function showCredits() {
    const creditsContent = document.getElementById('creditsContent');
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
        <p>To
