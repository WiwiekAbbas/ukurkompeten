from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class Module(Base):
    __tablename__ = "modules"
    
    id = Column(String, primary_key=True, index=True)  # module_1, module_2, etc.
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    time_limit = Column(Integer, nullable=True)  # minutes
    scoring_rules = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
