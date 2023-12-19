from sqlalchemy import DateTime, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
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
    selling_leads = relationship("Lead", foreign_keys="Lead.seller_id", back_populates="seller", cascade="all, delete")
    buying_leads = relationship("Lead", foreign_keys="Lead.buyer_id", back_populates="buyer", cascade="all, delete")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    interest = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign keys
    seller_id = Column(Integer, ForeignKey("participants.id"))
    buyer_id = Column(Integer, ForeignKey("participants.id"))

    # Relationships
    seller = relationship("Participant", foreign_keys=[seller_id])
    buyer = relationship("Participant", foreign_keys=[buyer_id])
    notes = relationship("Note", back_populates="lead")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    lead_id = Column(Integer, ForeignKey("leads.id"))
    
    # Relationships
    lead = relationship("Lead", back_populates="notes")
    addenda = relationship("Addendum", back_populates="note")

class Addendum(Base):
    __tablename__ = "addendums"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    note_id = Column(Integer, ForeignKey("notes.id"))

    # Relationships
    note = relationship("Note", back_populates="addenda")