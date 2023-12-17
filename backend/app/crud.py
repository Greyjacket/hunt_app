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

def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Note).offset(skip).limit(limit).all()

def create_note(db: Session, note: schemas.NoteCreate, lead_id: int):
    db_note = models.Note(**note.dict(), lead_id=lead_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_addendum(db: Session, addendum_id: int):
    return db.query(models.Addendum).filter(models.Addendum.id == addendum_id).first()

def get_addendums(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Addendum).offset(skip).limit(limit).all()

def create_addendum(db: Session, addendum: schemas.AddendumCreate, note_id: int):
    db_addendum = models.Addendum(**addendum.dict(), note_id=note_id)
    db.add(db_addendum)
    db.commit()
    db.refresh(db_addendum)
    return db_addendum
