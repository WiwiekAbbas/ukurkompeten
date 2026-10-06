from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID


class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(String, ForeignKey("modules.id"), nullable=False, index=True)
    dimension = Column(String, nullable=False)  # holland_R, holland_I, big5_O, etc.
    raw_score = Column(Numeric(5, 2), nullable=False)
    normalized_score = Column(Numeric(5, 2), nullable=False)  # 0-100
    percentile = Column(Numeric(5, 2), nullable=True)  # 0-100
    interpretation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="results")
    module = relationship("Module", backref="results")
