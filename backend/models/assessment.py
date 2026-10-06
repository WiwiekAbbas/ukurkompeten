from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID


class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(String, ForeignKey("modules.id"), nullable=False, index=True)
    status = Column(String, nullable=False, default="in_progress")  # in_progress, completed, abandoned
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_score = Column(Numeric(5, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="assessments")
    module = relationship("Module", backref="assessments")
    answers = relationship("AssessmentAnswer", backref="assessment", cascade="all, delete-orphan")
    results = relationship("AssessmentResult", backref="assessment", cascade="all, delete-orphan")


class AssessmentItem(Base):
    __tablename__ = "assessment_items"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(String, ForeignKey("modules.id"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, nullable=False)  # multiple_choice, likert, ranking
    options = Column(JSON, nullable=True)  # ["Option A", "Option B", ...]
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    module = relationship("Module", backref="items")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("assessment_items.id", ondelete="CASCADE"), nullable=False)
    user_answer = Column(Text, nullable=False)
    time_spent = Column(Integer, nullable=True)  # seconds
    created_at = Column(DateTime(timezone=True), server_default=func.now())
