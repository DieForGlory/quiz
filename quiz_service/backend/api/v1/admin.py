from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from api.dependencies import get_db
from schemas.quiz import QuizResponse, QuizCreate, LeadResponse
from models.quiz import Lead
from crud import quiz as crud_quiz

router = APIRouter(prefix="/admin/quizzes", tags=["admin"])


class QuizActiveUpdate(BaseModel):
    is_active: bool


@router.post("/", response_model=QuizResponse)
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    return crud_quiz.create_quiz(db=db, quiz=quiz)


@router.get("/", response_model=List[QuizResponse])
def read_quizzes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_quiz.get_quizzes(db, skip=skip, limit=limit)


@router.get("/{quiz_id}", response_model=QuizResponse)
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz


@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(quiz_id: int, quiz: QuizCreate, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.update_quiz(db, quiz_id=quiz_id, quiz_update=quiz)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz


@router.patch("/{quiz_id}/active", response_model=QuizResponse)
def set_quiz_active(quiz_id: int, payload: QuizActiveUpdate, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.set_quiz_active(db, quiz_id=quiz_id, is_active=payload.is_active)
    if db_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz


@router.get("/{quiz_id}/leads", response_model=List[LeadResponse])
def read_quiz_leads(quiz_id: int, db: Session = Depends(get_db)):
    return db.query(Lead).filter(Lead.quiz_id == quiz_id).order_by(Lead.created_at.desc()).all()
