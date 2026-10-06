from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String, nullable=True)  # credit_card, bank_transfer, gopay, ovo
    payment_status = Column(String, nullable=False, default="pending")  # pending, success, failed, refunded
    payment_gateway_tx_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="transactions")
    package = relationship("Package", backref="transactions")
