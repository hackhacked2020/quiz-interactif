from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'dev_key_123')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///quiz.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    option_a = db.Column(db.String(255))
    option_b = db.Column(db.String(255))
    option_c = db.Column(db.String(255))
    option_d = db.Column(db.String(255))
    option_e = db.Column(db.String(255))
    option_f = db.Column(db.String(255))
    correct_answers = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.text,
            'option_a': self.option_a,
            'option_b': self.option_b,
            'option_c': self.option_c,
            'option_d': self.option_d,
            'option_e': self.option_e,
            'option_f': self.option_f,
            'correct': self.correct_answers.split(',')
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    return jsonify([q.to_dict() for q in questions])

def add_sample_questions():
    if Question.query.count() == 0:
        sample_questions = [
            {
                'text': 'Quelle est la capitale de la France?',
                'option_a': 'Londres',
                'option_b': 'Paris',
                'option_c': 'Berlin',
                'option_d': 'Madrid',
                'correct_answers': 'b'
            },
            {
                'text': 'Quels sont les pays membres permanents du Conseil de sécurité de l\'ONU?',
                'option_a': 'États-Unis',
                'option_b': 'Royaume-Uni',
                'option_c': 'France',
                'option_d': 'Chine',
                'option_e': 'Russie',
                'option_f': 'Japon',
                'correct_answers': 'a,b,c,d,e'
            }
        ]

        for q_data in sample_questions:
            question = Question(**q_data)
            db.session.add(question)

        db.session.commit()

with app.app_context():
    db.create_all()
    add_sample_questions()