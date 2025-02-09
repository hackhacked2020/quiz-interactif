let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let userAnswers = [];

// Load questions from API endpoint
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        document.getElementById('total-questions').textContent = questions.length;
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

// Initialize quiz
loadQuestions();

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
    
    // Create option buttons
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

    // Reset timer
    timeLeft = 120;
    updateTimer();
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    // Reset validate button
    const validateBtn = document.getElementById('validate-btn');
    validateBtn.disabled = true;
    validateBtn.classList.remove('d-none');
    document.getElementById('next-btn').classList.add('d-none');
}

function toggleOption(button) {
    const question = questions[currentQuestionIndex];
    if (question.correct.length === 1) {
        // Single choice question
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
        document.getElementById('tick-sound').play().catch(() => {});
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
        document.getElementById('correct-sound').play().catch(() => {});
    } else {
        document.getElementById('wrong-sound').play().catch(() => {});
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
    
    // Generate detailed results
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
    document.getElementById('results-screen').classList.add('d-none');
    document.getElementById('welcome-screen').classList.remove('d-none');
}

function arraysEqual(a, b) {
    return Array.isArray(a) && Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
