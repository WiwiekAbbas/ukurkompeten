from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    package_type = Column(String, nullable=False)  # 'B2C' or 'B2B'
    price = Column(Numeric(12, 2), nullable=False)
    features = Column(JSON, nullable=False)  # ['module_1', 'module_2', ...]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
