let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let userAnswers = [];

// Settings
let quizSettings = {
    shuffleQuestions: true,
    enableSound: true,
    autoNext: false,
    autoNextDelay: 3
};

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('quizSettings');
    if (savedSettings) {
        quizSettings = { ...quizSettings, ...JSON.parse(savedSettings) };
        // Update UI
        document.getElementById('shuffleQuestions').checked = quizSettings.shuffleQuestions;
        document.getElementById('enableSound').checked = quizSettings.enableSound;
        document.getElementById('autoNext').checked = quizSettings.autoNext;
        document.getElementById('autoNextDelay').value = quizSettings.autoNextDelay;
    }
}

// Save settings to localStorage
function saveSettings() {
    quizSettings.shuffleQuestions = document.getElementById('shuffleQuestions').checked;
    quizSettings.enableSound = document.getElementById('enableSound').checked;
    quizSettings.autoNext = document.getElementById('autoNext').checked;
    quizSettings.autoNextDelay = parseInt(document.getElementById('autoNextDelay').value);
    localStorage.setItem('quizSettings', JSON.stringify(quizSettings));

    const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    modal.hide();
}

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        if (quizSettings.shuffleQuestions) {
            questions = shuffleArray(questions);
        }
        document.getElementById('total-questions').textContent = questions.length;
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize quiz
window.onload = function() {
    loadSettings();
    loadQuestions();
};

function startQuiz() {
    document.getElementById('welcome-screen').classList.add('d-none');
    document.getElementById('instructions-screen').classList.remove('d-none');
}

function returnToHome() {
    document.getElementById('instructions-screen').classList.add('d-none');
    document.getElementById('welcome-screen').classList.remove('d-none');
}

function startQuestions() {
    document.getElementById('instructions-screen').classList.add('d-none');
    document.getElementById('quiz-screen').classList.remove('d-none');
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('question-text').innerHTML = question.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    ['a', 'b', 'c', 'd', 'e', 'f'].forEach(option => {
        if (question[`option_${option}`]) {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-light option-btn';
            button.setAttribute('data-option', option);
            button.innerHTML = question[`option_${option}`];
            button.onclick = () => toggleOption(button);
            optionsContainer.appendChild(button);
        }
    });

    timeLeft = 120;
    updateTimer();
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    const validateBtn = document.getElementById('validate-btn');
    validateBtn.disabled = true;
    validateBtn.classList.remove('d-none');
    document.getElementById('next-btn').classList.add('d-none');
}

function toggleOption(button) {
    const question = questions[currentQuestionIndex];
    if (question.correct.length === 1) {
        document.querySelectorAll('.option-btn.selected').forEach(btn => btn.classList.remove('selected'));
    }
    button.classList.toggle('selected');
    const validateBtn = document.getElementById('validate-btn');
    validateBtn.disabled = !document.querySelector('.option-btn.selected');
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${timeLeft}s`;

    if (timeLeft <= 10) {
        timerElement.classList.add('timer-warning');
        if (quizSettings.enableSound) {
            document.getElementById('tick-sound').play().catch(() => {});
        }
    }

    if (timeLeft <= 0) {
        clearInterval(timer);
        validateAnswer(true);
    }

    timeLeft--;
}

function validateAnswer(timeout = false) {
    clearInterval(timer);
    const question = questions[currentQuestionIndex];
    const selectedOptions = Array.from(document.querySelectorAll('.option-btn.selected'))
        .map(btn => btn.getAttribute('data-option'));

    const isCorrect = arraysEqual(selectedOptions.sort(), question.correct.sort());
    userAnswers[currentQuestionIndex] = selectedOptions;

    if (isCorrect) {
        score++;
        if (quizSettings.enableSound) {
            document.getElementById('correct-sound').play().catch(() => {});
        }
    } else {
        if (quizSettings.enableSound) {
            document.getElementById('wrong-sound').play().catch(() => {});
        }
    }

    // Show correct/incorrect answers
    document.querySelectorAll('.option-btn').forEach(btn => {
        const option = btn.getAttribute('data-option');
        if (question.correct.includes(option)) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    document.getElementById('validate-btn').classList.add('d-none');
    document.getElementById('next-btn').classList.remove('d-none');

    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next-btn').textContent = 'Voir les résultats';
    }

    // Auto-next if enabled
    if (quizSettings.autoNext && currentQuestionIndex < questions.length - 1) {
        setTimeout(nextQuestion, quizSettings.autoNextDelay * 1000);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-screen').classList.add('d-none');
    document.getElementById('results-screen').classList.remove('d-none');

    const finalScore = document.getElementById('final-score');
    const maxScore = document.getElementById('max-score');
    const scoreProgress = document.getElementById('score-progress');
    const detailedResults = document.getElementById('detailed-results');

    finalScore.textContent = score;
    maxScore.textContent = questions.length;
    scoreProgress.style.width = `${(score / questions.length) * 100}%`;

    detailedResults.innerHTML = questions.map((question, index) => {
        const isCorrect = arraysEqual(userAnswers[index].sort(), question.correct.sort());
        return `
            <div class="question-review ${isCorrect ? 'correct' : 'incorrect'}">
                <h5>Question ${index + 1}</h5>
                <p>${question.question}</p>
                <p><strong>Votre réponse:</strong> ${userAnswers[index].map(opt => question[`option_${opt}`]).join(', ')}</p>
                <p><strong>Bonne réponse:</strong> ${question.correct.map(opt => question[`option_${opt}`]).join(', ')}</p>
            </div>
        `;
    }).join('');
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    if (quizSettings.shuffleQuestions) {
        questions = shuffleArray(questions);
    }
    document.getElementById('results-screen').classList.add('d-none');
    document.getElementById('welcome-screen').classList.remove('d-none');
}

function arraysEqual(a, b) {
    return Array.isArray(a) && Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}