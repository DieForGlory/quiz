from sqlalchemy.orm import Session
from models.quiz import Quiz, Question, Option, Lead
from schemas.quiz import QuizCreate, LeadCreate


def get_quiz(db: Session, quiz_id: int):
    return db.query(Quiz).filter(Quiz.id == quiz_id).first()


def get_quizzes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Quiz).offset(skip).limit(limit).all()


def set_quiz_active(db: Session, quiz_id: int, is_active: bool):
    db_quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not db_quiz:
        return None
    db_quiz.is_active = is_active
    db.commit()
    db.refresh(db_quiz)
    return db_quiz


def create_quiz(db: Session, quiz: QuizCreate):
    db_quiz = Quiz(name=quiz.name, is_active=quiz.is_active, settings=quiz.settings)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    for q in quiz.questions:
        db_question = Question(
            quiz_id=db_quiz.id, type=q.type, title=q.title,
            order_index=q.order_index, is_required=q.is_required
        )
        db.add(db_question)
        db.commit()
        db.refresh(db_question)

        for opt in q.options:
            db_option = Option(
                question_id=db_question.id, text=opt.text,
                next_question_id=opt.next_question_id
            )
            db.add(db_option)

    db.commit()
    db.refresh(db_quiz)
    return db_quiz


def update_quiz(db: Session, quiz_id: int, quiz_update: QuizCreate):
    db_quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not db_quiz:
        return None

    db_quiz.name = quiz_update.name
    db_quiz.is_active = quiz_update.is_active
    db_quiz.settings = quiz_update.settings

    # Полная очистка старого графа (каскадное удаление Options настроено в моделях)
    db.query(Question).filter(Question.quiz_id == quiz_id).delete()
    db.commit()

    # Перестроение графа
    for q in quiz_update.questions:
        db_question = Question(
            quiz_id=db_quiz.id, type=q.type, title=q.title,
            order_index=q.order_index, is_required=q.is_required
        )
        db.add(db_question)
        db.commit()
        db.refresh(db_question)

        for opt in q.options:
            db_option = Option(
                question_id=db_question.id, text=opt.text,
                next_question_id=opt.next_question_id
            )
            db.add(db_option)

    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def create_lead(db: Session, quiz_id: int, lead: LeadCreate):
    db_lead = Lead(
        quiz_id=quiz_id, contact_data=lead.contact_data,
        answers_log=lead.answers_log, utm_tags=lead.utm_tags
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead