from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.assessment import Assessment, AssessmentItem, AssessmentAnswer
from models.module import Module
from schemas.assessment import AssessmentStart, AssessmentSubmit, AssessmentResponse, AssessmentResultResponse
from datetime import datetime

router = APIRouter()


@router.get("/modules")
async def get_modules(db: Session = Depends(get_db)):
    """Get all available assessment modules"""
    modules = db.query(Module).filter(Module.is_active == True).all()
    
    return {
        "modules": [
            {
                "module_id": m.id,
                "name": m.name,
                "description": m.description,
                "time_limit": m.time_limit,
                "is_available": True
            }
            for m in modules
        ]
    }


@router.post("/start", response_model=AssessmentResponse)
async def start_assessment(
    data: AssessmentStart,
    db: Session = Depends(get_db)
):
    """Start a new assessment"""
    # Create new assessment
    assessment = Assessment(
        module_id=data.module_id,
        status="in_progress",
        started_at=datetime.utcnow()
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    # Get questions for this module
    items = db.query(AssessmentItem).filter(
        AssessmentItem.module_id == data.module_id
    ).order_by(AssessmentItem.order_index).all()
    
    # Get module time limit
    module = db.query(Module).filter(Module.id == data.module_id).first()
    time_limit = module.time_limit * 60 if module and module.time_limit else None
    
    return {
        "assessment_id": assessment.id,
        "module_id": assessment.module_id,
        "status": assessment.status,
        "items": [
            {
                "item_id": item.id,
                "question_text": item.question_text,
                "question_type": item.question_type,
                "options": item.options or [],
                "order_index": item.order_index
            }
            for item in items
        ],
        "total_items": len(items),
        "time_limit": time_limit
    }


@router.patch("/{assessment_id}/answers")
async def save_answers(
    assessment_id: int,
    answers: List[dict],
    db: Session = Depends(get_db)
):
    """Save assessment answers (auto-save)"""
    # Save answers to database
    for answer_data in answers:
        answer = AssessmentAnswer(
            assessment_id=assessment_id,
            item_id=answer_data["item_id"],
            user_answer=answer_data["user_answer"],
            time_spent=answer_data.get("time_spent", 0)
        )
        db.add(answer)
    
    db.commit()
    
    return {
        "assessment_id": assessment_id,
        "answers_saved": len(answers),
        "message": "Jawaban berhasil disimpan"
    }


@router.post("/{assessment_id}/submit")
async def submit_assessment(
    assessment_id: int,
    db: Session = Depends(get_db)
):
    """Submit completed assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    
    assessment.status = "completed"
    assessment.completed_at = datetime.utcnow()
    
    # TODO: Calculate scores here (scoring service)
    # For MVP, just mark as completed
    
    db.commit()
    
    return {
        "assessment_id": assessment_id,
        "status": "completed",
        "message": "Assessment berhasil disubmit"
    }
