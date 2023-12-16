from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone1 = Column(String)
    phone2 = Column(String)
    email = Column(String, unique=True)
    address = Column(String)

    # Relationships
    selling_leads = relationship("Lead", foreign_keys="Lead.seller_id", back_populates="seller")
    buying_leads = relationship("Lead", foreign_keys="Lead.buyer_id", back_populates="buyer")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    interest = Column(String)

    # Foreign keys
    seller_id = Column(Integer, ForeignKey("participants.id"))
    buyer_id = Column(Integer, ForeignKey("participants.id"))

    # Relationships
    seller = relationship("Participant", foreign_keys=[seller_id])
    buyer = relationship("Participant", foreign_keys=[buyer_id])
