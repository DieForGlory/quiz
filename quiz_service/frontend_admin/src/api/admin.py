from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.dependencies import get_db
from schemas.quiz import QuizResponse, QuizCreate, LeadResponse
from models.quiz import Lead
from crud import quiz as crud_quiz

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/quizzes/", response_model=QuizResponse)
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    return crud_quiz.create_quiz(db=db, quiz=quiz)

@router.get("/quizzes/", response_model=List[QuizResponse])
def read_quizzes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_quiz.get_quizzes(db, skip=skip, limit=limit)

@router.get("/quizzes/{quiz_id}", response_model=QuizResponse)
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz

@router.get("/quizzes/{quiz_id}/leads", response_model=List[LeadResponse])
def read_quiz_leads(quiz_id: int, db: Session = Depends(get_db)):
    leads = db.query(Lead).filter(Lead.quiz_id == quiz_id).order_by(Lead.created_at.desc()).all()
    return leads