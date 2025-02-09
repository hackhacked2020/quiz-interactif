<?php
require_once 'config/session.php';
?>
<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Interactif</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/styles.css" rel="stylesheet">
</head>
<body>
    <div class="container py-4">
        <!-- Welcome Screen -->
        <div id="welcome-screen" class="text-center">
            <h1 class="display-4 mb-4">Quiz Interactif</h1>
            <?php if (isLoggedIn()): ?>
                <button class="btn btn-primary btn-lg" onclick="startQuiz()">Commencer</button>
            <?php else: ?>
                <div class="d-grid gap-2 col-6 mx-auto">
                    <a href="login.php" class="btn btn-primary btn-lg">Se connecter</a>
                    <a href="register.php" class="btn btn-outline-primary btn-lg">S'inscrire</a>
                </div>
            <?php endif; ?>
        </div>

        <!-- Le reste du contenu sera chargé dynamiquement via JavaScript -->
        <div id="quiz-container"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/quiz.js"></script>
</body>
</html>
