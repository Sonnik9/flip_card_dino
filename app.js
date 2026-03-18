// --- КОНФИГУРАЦИЯ ТЕМ И УРОВНЕЙ ---
const CONFIG = {
    themes: {
        dino: { path: './assets/dino/', ext: '.jpg', prefix: 'dino' },
        uno:  { path: './assets/uno/',  ext: '.jpg', prefix: 'uno' },
        cars: { path: './assets/cars/', ext: '.jpg', prefix: 'cars' }
    },
    levels: {
        easy:    { pairs: 6,  columns: 4 },
        middle:  { pairs: 12, columns: 6 },
        advance: { pairs: 18, columns: 9 }
    }
};

// --- КЛАСС ИГРЫ ---
class MemoryGame {
    constructor(config) {
        this.config = config;
        this.board = document.getElementById('game-board');
        this.btnStart = document.getElementById('btn-start');
        this.selTheme = document.getElementById('select-theme');
        this.selLevel = document.getElementById('select-level');
        this.timeDisplay = document.getElementById('time-display');
        this.scoreDisplay = document.getElementById('score-display');
        this.winMessage = document.getElementById('win-message');
        this.timerId = null;
        this.initEvents();
        this.startNewGame();
    }

    initEvents() {
        this.btnStart.addEventListener('click', () => this.startNewGame());
        this.selLevel.addEventListener('change', () => this.startNewGame());
        this.selTheme.addEventListener('change', () => this.startNewGame());
    }

    startNewGame() {
        // Сброс состояния
        clearInterval(this.timerId);
        this.seconds = 0; this.clicks = 0; this.matches = 0;
        this.hasFlippedCard = false; this.lockBoard = false;
        this.firstCard = null; this.secondCard = null;
        
        this.timeDisplay.innerText = '0';
        this.scoreDisplay.innerText = '0';
        this.winMessage.style.display = 'none';

        const levelKey = this.selLevel.value;
        const themeKey = this.selTheme.value;
        const levelConfig = this.config.levels[levelKey];
        this.pairsCount = levelConfig.pairs;
        
        // Настройка сетки
        this.board.style.gridTemplateColumns = `repeat(${levelConfig.columns}, 1fr)`;

        this.renderBoard(themeKey);
        this.startTimer();
    }

    renderBoard(themeKey) {
        const theme = this.config.themes[themeKey];
        let cardsArray = [];

        // Создаем пары
        for (let i = 1; i <= this.pairsCount; i++) {
            let cardSrc = `${theme.path}${i}${theme.prefix}${theme.ext}`;
            let cardObj = { id: i, front: cardSrc };
            cardsArray.push(cardObj, cardObj); // Добавляем дважды
        }

        // Перемешиваем
        cardsArray.sort(() => Math.random() - 0.5);

        // Отрисовываем
        this.board.innerHTML = cardsArray.map(card => `
            <div class="memory-card" data-id="${card.id}">
                <img class="front-face" src="${card.front}" alt="Dino ${card.id}">
                <img class="back-face" src="${theme.path}back-face-img.jpg" alt="Rubashka">
            </div>
        `).join('');

        // Вешаем слушатели
        document.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', (e) => this.flipCard(e.currentTarget));
        });
    }

    flipCard(card) {
        if (this.lockBoard || card === this.firstCard) return;

        card.classList.add('flip');

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true; this.firstCard = card; return;
        }

        this.secondCard = card; this.clicks++;
        this.scoreDisplay.innerText = this.clicks;
        this.checkForMatch();
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.id === this.secondCard.dataset.id;
        if (isMatch) {
            this.disableCards();
            this.matches++;
            if (this.matches === this.pairsCount) this.endGame();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        // Убираем слушатели с отгаданных карт
        this.firstCard.style.pointerEvents = 'none';
        this.secondCard.style.pointerEvents = 'none';
        this.resetBoardState();
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.classList.remove('flip');
            this.secondCard.classList.remove('flip');
            this.resetBoardState();
        }, 1100);
    }

    resetBoardState() {
        [this.hasFlippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    startTimer() {
        this.timerId = setInterval(() => { this.seconds++; this.timeDisplay.innerText = this.seconds; }, 1000);
    }

    endGame() {
        clearInterval(this.timerId);
        this.winMessage.style.display = 'block';
    }
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => new MemoryGame(CONFIG));