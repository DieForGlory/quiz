from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from api.dependencies import get_db
from schemas.quiz import QuizResponse, LeadCreate, LeadResponse
from crud import quiz as crud_quiz

router = APIRouter(prefix="/public/quiz", tags=["public"])


def process_webhook(lead_id: int, data: dict):
    pass


@router.get("/{quiz_id}/structure", response_model=QuizResponse)
def get_structure(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not db_quiz or not db_quiz.is_active:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz


@router.post("/{quiz_id}/submit", response_model=LeadResponse)
def submit_lead(quiz_id: int, lead: LeadCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_quiz = crud_quiz.get_quiz(db, quiz_id=quiz_id)
    if not db_quiz or not db_quiz.is_active:
        raise HTTPException(status_code=404, detail="Quiz not found")

    new_lead = crud_quiz.create_lead(db, quiz_id=quiz_id, lead=lead)
    background_tasks.add_task(process_webhook, new_lead.id, lead.model_dump())
    return new_lead