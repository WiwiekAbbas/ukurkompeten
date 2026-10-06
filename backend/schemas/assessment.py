from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class AssessmentStart(BaseModel):
    module_id: str


class AssessmentAnswer(BaseModel):
    item_id: int
    user_answer: str
    time_spent: Optional[int] = 0


class AssessmentSubmit(BaseModel):
    answers: List[AssessmentAnswer]


class AssessmentItemResponse(BaseModel):
    item_id: int
    question_text: str
    question_type: str
    options: List[str]
    order_index: int


class AssessmentResponse(BaseModel):
    assessment_id: int
    module_id: str
    status: str
    items: List[AssessmentItemResponse]
    total_items: int
    time_limit: Optional[int]  # seconds


class AssessmentResultResponse(BaseModel):
    dimension: str
    raw_score: float
    normalized_score: float
    percentile: Optional[float]
    interpretation: Optional[str]
