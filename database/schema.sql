-- Création de la base de données
CREATE DATABASE IF NOT EXISTS quiz_db;
USE quiz_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    question_text TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    option_e TEXT,
    option_f TEXT,
    correct_answers VARCHAR(50) NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table des résultats
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    completion_time INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des réponses détaillées
CREATE TABLE IF NOT EXISTS detailed_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(50),
    is_correct BOOLEAN,
    time_taken INT,
    FOREIGN KEY (quiz_result_id) REFERENCES quiz_results(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
