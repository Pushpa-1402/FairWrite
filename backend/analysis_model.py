from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from database import Base
from datetime import datetime

class AnalysisHistory(Base):

    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    original_text = Column(Text)

    detected_bias = Column(Text)

    severity = Column(String(50))

    rewritten_text = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)