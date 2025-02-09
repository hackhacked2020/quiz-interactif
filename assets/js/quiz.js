// Configuration initiale
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let userAnswers = [];

// Charger les questions depuis l'API PHP
async function loadQuestions() {
    try {
        const response = await fetch('api/get_questions.php');
        questions = await response.json();
        document.getElementById('total-questions').textContent = questions.length;
        return true;
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        return false;
    }
}

// Démarrer le quiz
function startQuiz() {
    document.getElementById('welcome-screen').classList.add('d-none');
    loadInstructions();
}

// Charger les instructions
function loadInstructions() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div id="instructions-screen">
            <h2 class="mb-4">Instructions</h2>
            <div class="card">
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Vous avez 120 secondes par question</li>
                        <li class="list-group-item">Sélectionnez une ou plusieurs réponses selon la question</li>
                        <li class="list-group-item">Cliquez sur "Valider" pour confirmer votre réponse</li>
                        <li class="list-group-item">Les résultats seront affichés à la fin du quiz</li>
                    </ul>
                </div>
            </div>
            <div class="mt-4">
                <button class="btn btn-secondary" onclick="returnToHome()">Retour</button>
                <button class="btn btn-primary" onclick="startQuestions()">Continuer</button>
            </div>
        </div>
    `;
}

// Le reste du code JS sera ajouté dans la prochaine itération...
