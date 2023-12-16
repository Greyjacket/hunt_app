from sqlalchemy.orm import Session
import models, schemas


def get_participant(db: Session, participant_id: int):
    return db.query(models.Participant).filter(models.Participant.id == participant_id).first()

def get_participants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Participant).offset(skip).limit(limit).all()

def get_participant_by_name(db: Session, name: str):
    return db.query(models.Participant).filter(models.Participant.name == name).first()

def create_participant(db: Session, participant: schemas.ParticipantCreate):
    db_participant = models.Participant(**participant.dict())
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def get_lead(db: Session, lead_id: int):
    return db.query(models.Lead).filter(models.Lead.id == lead_id).first()

def get_leads(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Lead).offset(skip).limit(limit).all()

def create_lead(db: Session, lead: schemas.LeadCreate):
    db_lead = models.Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead
