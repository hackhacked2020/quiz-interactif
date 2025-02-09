# Quiz Interactif

Application de quiz interactive avec minuteur, validation des réponses multiples et interface moderne.

## Fonctionnalités

- Interface utilisateur moderne et responsive avec Bootstrap 5
- Minuteur de 120 secondes par question
- Support des questions à choix unique ou multiple
- Effets sonores pour les réponses correctes/incorrectes
- Affichage détaillé des résultats
- Mode sombre par défaut
- Base de données PostgreSQL pour le stockage des questions

## Configuration technique

### Prérequis

- Python 3.11+
- PostgreSQL
- Node.js (pour les dépendances front-end)

### Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd quiz-interactif
```

2. Installer les dépendances Python
```bash
pip install -r requirements.txt
```

3. Configurer la base de données
- Créer une base de données PostgreSQL
- Configurer les variables d'environnement :
  ```
  DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
  FLASK_SECRET_KEY=[votre_clé_secrète]
  ```

4. Lancer l'application
```bash
python main.py
```

L'application sera accessible à l'adresse : `http://localhost:5000`

## Structure du projet

```
quiz-interactif/
├── app.py              # Application Flask principale
├── main.py            # Point d'entrée
├── static/            # Fichiers statiques (JS, CSS, sons)
├── templates/         # Templates HTML
└── requirements.txt   # Dépendances Python
```

## Fonctionnalités à venir

- Système de catégories de questions
- Mode révision avec explications détaillées
- Statistiques de performance par thème
- Export des résultats en PDF

## License

MIT
