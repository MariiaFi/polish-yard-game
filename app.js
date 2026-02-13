/**
 * Основная логика приложения YardWords Polski
 * Чистый JavaScript, без зависимостей
 */

// --- Конфигурация ---
const TARGET_LANG = 'pl'; // Целевой язык - польский
const INTERFACE_LANG = 'ru';

// --- Словарь (VOCAB) ---
// Предметы во дворе / на улице на польском языке
const VOCAB = [
    // Ограждения и конструкции
    { pl: "płot", ipa: "/pwɔt/", ru: "забор" },
    { pl: "furtka", ipa: "/ˈfurtka/", ru: "калитка" },
    { pl: "brama", ipa: "/ˈbrama/", ru: "ворота" },
    { pl: "ławka", ipa: "/ˈwafka/", ru: "скамейка" },
    
    // Растения и газон
    { pl: "huśtawka", ipa: "/xuɕˈtafka/", ru: "качели" },
    { pl: "trawa", ipa: "/ˈtrava/", ru: "газон, трава" },
    { pl: "krzak", ipa: "/kʂak/", ru: "куст" },
    { pl: "krzew", ipa: "/kʂɛf/", ru: "кустарник" },
    { pl: "drzewo", ipa: "/ˈdʐɛvɔ/", ru: "дерево" },
    { pl: "kwiat", ipa: "/kfjat/", ru: "цветок" },
    { pl: "kwiaty", ipa: "/ˈkfjatɨ/", ru: "цветы" },
    { pl: "ogród", ipa: "/ˈɔɡrut/", ru: "сад" }, // Ложный друг: похоже на "огород", но значит "сад" [citation:7]
    
    // Малые архитектурные формы
    { pl: "fontanna", ipa: "/fɔnˈtanna/", ru: "фонтан" },
    { pl: "altana", ipa: "/alˈtana/", ru: "беседка" },
    { pl: "grill", ipa: "/ɡrɨl/", ru: "гриль" },
    { pl: "szopa", ipa: "/ˈʂɔpa/", ru: "сарай" },
    { pl: "garaż", ipa: "/ˈɡaraʂ/", ru: "гараж" },
    { pl: "ścieżka", ipa: "/ˈɕt͡ɕɛʂka/", ru: "дорожка, тропинка" },
    
    // Освещение и коммуникации
    { pl: "latarnia", ipa: "/laˈtarɲa/", ru: "фонарь" },
    { pl: "skrzynka na listy", ipa: "/ˈskʂɨnka na ˈlistɨ/", ru: "почтовый ящик" },
    { pl: "śmietnik", ipa: "/ˈɕmʲɛtɲik/", ru: "мусорный бак" },
    { pl: "kosz na śmieci", ipa: "/kɔʂ na ˈɕmʲɛt͡ɕi/", ru: "мусорка" },
    
    // Садовый инвентарь
    { pl: "wąż ogrodowy", ipa: "/vɔw̃z‿ɔɡrɔˈdɔvɨ/", ru: "шланг" },
    { pl: "konewka", ipa: "/kɔˈnɛfka/", ru: "лейка" },
    { pl: "grabie", ipa: "/ˈɡrabʲɛ/", ru: "грабли" },
    { pl: "łopata", ipa: "/wɔˈpata/", ru: "лопата" },
    { pl: "taczka", ipa: "/ˈtat͡ʂka/", ru: "тачка" },
    
    // Водные объекты
    { pl: "basen", ipa: "/ˈbasɛn/", ru: "бассейн" },
    { pl: "oczkko wodne", ipa: "/ˈɔt͡ʂkɔ ˈvɔdnɛ/", ru: "пруд, водоём" },
    
    // Детская площадка
    { pl: "plac zabaw", ipa: "/plat͡s ˈzabaf/", ru: "детская площадка" },
    { pl: "zjeżdżalnia", ipa: "/zjɛʐˈd͡ʐalɲa/", ru: "горка" },
    { pl: "piaskownica", ipa: "/pjaskɔvˈɲit͡sa/", ru: "песочница" },
    
    // Живой мир
    { pl: "ptak", ipa: "/ptak/", ru: "птица" },
    { pl: "karmnik", ipa: "/ˈkarmɲik/", ru: "кормушка" },
    { pl: "budka lęgowa", ipa: "/ˈbutka lɛŋˈɡɔva/", ru: "скворечник" },
    { pl: "wiewiórka", ipa: "/vʲɛˈvʲurka/", ru: "белка" },
    
    // Техника и другие предметы
    { pl: "kosiarka", ipa: "/kɔˈɕarka/", ru: "газонокосилка" },
    { pl: "ganek", ipa: "/ˈɡanɛk/", ru: "крыльцо" },
    { pl: "taras", ipa: "/ˈtaras/", ru: "терраса, патио" },
    { pl: "donica", ipa: "/dɔˈɲit͡sa/", ru: "кашпо, цветочный горшок" },
    { pl: "kompostownik", ipa: "/kɔmpɔsˈtɔvɲik/", ru: "компостная яма" },
];

// --- Состояние приложения (State) ---
let state = {
    currentTheme: 'light',
    currentVocab: [...VOCAB], // Текущий отображаемый список слов
    quizMode: 'ru-pl', // 'ru-pl', 'pl-ru', 'mixed'
    quizQuestions: [], // Массив вопросов для текущей сессии
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    selectedOption: null, // Индекс выбранного варианта
    answerSubmitted: false,
    isQuizActive: false,
    mistakes: [], // Слова, на которые ответили неправильно
    originalQuizQuestions: [], // Для сброса
};

// --- DOM Элементы ---
const dom = {
    themeToggle: document.getElementById('theme-toggle'),
    dictSection: document.getElementById('dictionary-section'),
    quizSection: document.getElementById('quiz-section'),
    cardsContainer: document.getElementById('cards-container'),
    searchInput: document.getElementById('search-input'),
    sortAzBtn: document.getElementById('sort-az'),
    sortRandomBtn: document.getElementById('sort-random'),
    goToQuizBtn: document.getElementById('go-to-quiz'),
    backToDictBtns: [
        document.getElementById('back-to-dict-from-result'),
    ],
    quizModeTitle: document.getElementById('quiz-mode-title'),
    scoreDisplay: document.getElementById('score-display'),
    progressBar: document.getElementById('progress-bar'),
    questionWord: document.getElementById('question-word'),
    questionTranslation: document.getElementById('question-translation'),
    optionsContainer: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    resultScreen: document.getElementById('result-screen'),
    quizArea: document.getElementById('quiz-area'),
    resultMessage: document.getElementById('result-message'),
    retryMistakesBtn: document.getElementById('retry-mistakes-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
};

// --- Инициализация приложения ---
function initApp() {
    loadTheme();
    renderDictionary(state.currentVocab);
    setupEventListeners();
}

// --- Работа с темой ---
function loadTheme() {
    const savedTheme = localStorage.getItem('yardwords-pl-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    state.currentTheme = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('yardwords-pl-theme', newTheme);
    state.currentTheme = newTheme;
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    dom.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// --- Функции словаря ---
function renderDictionary(items) {
    if (!dom.cardsContainer) return;
    if (items.length === 0) {
        dom.cardsContainer.innerHTML = '<p class="no-results">Ничего не найдено</p>';
        return;
    }

    dom.cardsContainer.innerHTML = items.map(item => `
        <div class="word-card">
            <span class="target-word">${item.pl}</span>
            <span class="ipa">${item.ipa}</span>
            <span class="translation">${item.ru}</span>
            <button class="speak-btn" data-word="${item.pl}" data-lang="pl-PL">🔊 Odtwórz</button>
        </div>
    `).join('');

    // Добавляем слушатели на кнопки "Озвучить"
    document.querySelectorAll('.speak-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.dataset.word;
            speakText(word, 'pl-PL');
        });
    });
}

// Web Speech API
function speakText(text, lang) {
    if (!window.speechSynthesis) {
        alert('Twoja przeglądarka nie obsługuje syntezy mowy.');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Комфортная скорость для польского
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Остановить предыдущую речь
    window.speechSynthesis.speak(utterance);
}

// Поиск и сортировка
function filterAndSortDictionary() {
    const searchTerm = dom.searchInput.value.toLowerCase().trim();
    let filtered = VOCAB.filter(item =>
        item.pl.toLowerCase().includes(searchTerm) ||
        item.ru.toLowerCase().includes(searchTerm)
    );

    // Применяем текущую сортировку (по умолчанию A-Z)
    filtered.sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
    state.currentVocab = filtered;
    renderDictionary(state.currentVocab);
}

function sortAZ() {
    state.currentVocab = [...state.currentVocab].sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
    renderDictionary(state.currentVocab);
}

function sortRandom() {
    state.currentVocab = [...state.currentVocab].sort(() => Math.random() - 0.5);
    renderDictionary(state.currentVocab);
}

// --- Логика Квиза ---
function startQuiz(mode = 'ru-pl', questionsList = null) {
    // Переключение секций
    dom.dictSection.classList.remove('active');
    dom.quizSection.classList.add('active');
    dom.resultScreen.classList.add('hidden');
    dom.quizArea.classList.remove('hidden');

    // Сброс состояния квиза
    if (questionsList) {
        // Для повторения ошибок или кастомного списка
        state.quizQuestions = questionsList;
    } else {
        // Генерация новых вопросов из всего словаря
        state.quizQuestions = generateQuestions(VOCAB, mode);
    }

    state.quizMode = mode;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.totalQuestions = state.quizQuestions.length;
    state.selectedOption = null;
    state.answerSubmitted = false;
    state.isQuizActive = true;
    state.mistakes = [];

    updateQuizHeader();
    renderQuestion();
}

function generateQuestions(vocab, mode) {
    // Перемешиваем и берём все слова
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    return shuffled.map(item => {
        let type;
        if (mode === 'mixed') {
            type = Math.random() < 0.5 ? 'ru-pl' : 'pl-ru';
        } else {
            type = mode;
        }
        return {
            ...item,
            type: type,
        };
    });
}

function renderQuestion() {
    if (state.currentQuestionIndex >= state.quizQuestions.length) {
        endQuiz();
        return;
    }

    const question = state.quizQuestions[state.currentQuestionIndex];
    const isRuPl = question.type === 'ru-pl';

    // Устанавливаем текст вопроса
    dom.questionWord.textContent = isRuPl ? question.ru : question.pl;
    dom.questionTranslation.textContent = isRuPl ? question.pl : question.ru;

    // Генерация вариантов ответа
    const correctAnswer = isRuPl ? question.pl : question.ru;
    const allPossibleAnswers = isRuPl
        ? VOCAB.map(item => item.pl) // Все польские слова
        : VOCAB.map(item => item.ru); // Все русские переводы

    // Получаем 3 неправильных уникальных варианта
    let wrongOptions = allPossibleAnswers.filter(ans => ans !== correctAnswer);
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);

    let options = [...wrongOptions, correctAnswer];
    options = shuffleArray(options); // Финальное перемешивание

    // Отрисовка кнопок
    dom.optionsContainer.innerHTML = options.map((opt, index) => `
        <button class="option-btn" data-option-index="${index}" data-value="${opt}">${opt}</button>
    `).join('');

    // Добавляем слушатели
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleOptionClick(e, correctAnswer, question));
    });

    // Сброс состояния для нового вопроса
    state.selectedOption = null;
    state.answerSubmitted = false;
    dom.nextBtn.disabled = true;
}

function handleOptionClick(e, correctAnswer, question) {
    if (state.answerSubmitted) return; // Блокируем повторный выбор

    const clickedBtn = e.currentTarget;
    const selectedValue = clickedBtn.dataset.value;
    const isCorrect = selectedValue === correctAnswer;

    // Подсветка
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.dataset.value === selectedValue && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Обновление счета и запись ошибок
    if (isCorrect) {
        state.score++;
    } else {
        // Сохраняем оригинальный объект слова для повтора ошибок
        state.mistakes.push(question);
    }

    state.answerSubmitted = true;
    dom.nextBtn.disabled = false;

    // Обновить счет на экране
    updateScore();
}

function nextQuestion() {
    if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
        state.currentQuestionIndex++;
        state.selectedOption = null;
        state.answerSubmitted = false;
        dom.nextBtn.disabled = true;
        updateProgress();
        renderQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    state.isQuizActive = false;
    dom.quizArea.classList.add('hidden');
    dom.resultScreen.classList.remove('hidden');

    const percentage = Math.round((state.score / state.totalQuestions) * 100);
    dom.resultMessage.textContent = `Odpowiedziałeś poprawnie na ${state.score} z ${state.totalQuestions} (${percentage}%)`;
}

function updateQuizHeader() {
    const modeNames = {
        'ru-pl': 'Rosyjski → Polski',
        'pl-ru': 'Polski → Rosyjski',
        'mixed': 'Tryb mieszany'
    };
    dom.quizModeTitle.textContent = `Quiz: ${modeNames[state.quizMode]}`;
    updateScore();
    updateProgress();
}

function updateScore() {
    dom.scoreDisplay.textContent = `Wynik: ${state.score} / ${state.totalQuestions}`;
}

function updateProgress() {
    const progress = ((state.currentQuestionIndex + (state.answerSubmitted ? 1 : 0)) / state.totalQuestions) * 100;
    dom.progressBar.style.width = `${progress}%`;
}

// Повтор ошибочных
function retryMistakes() {
    if (state.mistakes.length === 0) {
        alert('Nie ma błędnych słów!');
        return;
    }
    // Создаем новые вопросы только из ошибочных слов, сохраняя режим
    const mistakeQuestions = state.mistakes.map(item => ({
        ...item,
        type: state.quizMode === 'mixed' ? (Math.random() < 0.5 ? 'ru-pl' : 'pl-ru') : state.quizMode
    }));
    startQuiz(state.quizMode, mistakeQuestions);
}

// Сброс и новая игра
function playAgain() {
    startQuiz(state.quizMode);
}

// Переход в словарь
function backToDictionary() {
    dom.quizSection.classList.remove('active');
    dom.dictSection.classList.add('active');
    // Перерендерить словарь на всякий случай
    renderDictionary(state.currentVocab);
}

// --- Утилиты ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Настройка слушателей событий ---
function setupEventListeners() {
    // Тема
    dom.themeToggle.addEventListener('click', toggleTheme);

    // Словарь
    dom.searchInput.addEventListener('input', filterAndSortDictionary);
    dom.sortAzBtn.addEventListener('click', sortAZ);
    dom.sortRandomBtn.addEventListener('click', sortRandom);
    dom.goToQuizBtn.addEventListener('click', () => startQuiz('ru-pl'));

    // Квиз навигация
    dom.nextBtn.addEventListener('click', nextQuestion);
    dom.retryMistakesBtn.addEventListener('click', retryMistakes);
    dom.playAgainBtn.addEventListener('click', playAgain);

    // Кнопки "Назад в словарь"
    dom.backToDictBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', backToDictionary);
    });
}

// --- Запуск приложения ---
document.addEventListener('DOMContentLoaded', initApp);
