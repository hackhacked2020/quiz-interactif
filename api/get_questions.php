<?php
require_once '../config/database.php';
require_once '../config/session.php';

header('Content-Type: application/json');

// Vérifier si l'utilisateur est connecté
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

try {
    // Récupérer les questions de la base de données
    $stmt = $pdo->query('SELECT * FROM questions ORDER BY RAND()');
    $questions = $stmt->fetchAll();
    
    // Formater les questions pour le JavaScript
    $formattedQuestions = array_map(function($q) {
        return [
            'id' => $q['id'],
            'question' => $q['question_text'],
            'option_a' => $q['option_a'],
            'option_b' => $q['option_b'],
            'option_c' => $q['option_c'],
            'option_d' => $q['option_d'],
            'option_e' => $q['option_e'],
            'option_f' => $q['option_f'],
            'correct' => explode(',', $q['correct_answers'])
        ];
    }, $questions);
    
    echo json_encode($formattedQuestions);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
}
?>
