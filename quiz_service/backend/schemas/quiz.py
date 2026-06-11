from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class OptionBase(BaseModel):
    text: str
    next_question_id: Optional[int] = None

class OptionCreate(OptionBase):
    pass

class OptionResponse(OptionBase):
    id: int
    question_id: int
    model_config = ConfigDict(from_attributes=True)

class QuestionBase(BaseModel):
    type: str
    title: str
    order_index: int
    is_required: bool = True

class QuestionCreate(QuestionBase):
    options: List[OptionCreate] = []

class QuestionResponse(QuestionBase):
    id: int
    quiz_id: int
    options: List[OptionResponse] = []
    model_config = ConfigDict(from_attributes=True)

class QuizBase(BaseModel):
    name: str
    is_active: bool = True
    settings: Dict[str, Any] = {}

class QuizCreate(QuizBase):
    questions: List[QuestionCreate] = []

class QuizResponse(QuizBase):
    id: int
    created_at: datetime
    questions: List[QuestionResponse] = []
    model_config = ConfigDict(from_attributes=True)

class LeadCreate(BaseModel):
    contact_data: Dict[str, Any]
    answers_log: List[Dict[str, Any]]
    utm_tags: Optional[Dict[str, Any]] = {}

class LeadResponse(LeadCreate):
    id: int
    quiz_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)