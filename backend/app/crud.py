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

def update_participant(db: Session, participant_id: int, participant: schemas.ParticipantCreate):
    db_participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
    for key, value in participant.dict().items():
        setattr(db_participant, key, value)
    db.commit()
    return db_participant

def delete_participant(db: Session, participant_id: int):
    db_participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
    db.delete(db_participant)
    db.commit()
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

def update_lead(db: Session, lead_id: int, lead: schemas.LeadCreate):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    for key, value in lead.dict().items():
        setattr(db_lead, key, value)
    db.commit()
    return db_lead

def delete_lead(db: Session, lead_id: int):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    db.delete(db_lead)
    db.commit()
    return db_lead

def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Note).offset(skip).limit(limit).all()

def get_notes_by_lead_id(db: Session, lead_id: int):
    return db.query(models.Note).filter(models.Note.lead_id == lead_id).all()

def create_note(db: Session, note: schemas.NoteCreate):
    db_note = models.Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, note_id: int, note: schemas.NoteUpdate):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise ValueError("Note with given id not found")

    # Get a list of all addenda IDs associated with the note
    addenda_ids = [addendum.id for addendum in db_note.addenda]

    for key, value in note.dict().items():
        if key == 'addenda':
            for addendum in value:
                db_addendum = db.query(models.Addendum).filter(models.Addendum.id == addendum.get('id')).first()
                if db_addendum is None:
                    db_note.addenda.append(models.Addendum(**schemas.AddendumCreate(**addendum).dict()))
                else:
                    for k, v in addendum.items():
                        setattr(db_addendum, k, v)
                    # Remove the ID of the addendum from the list
                    addenda_ids.remove(addendum.get('id'))
        elif hasattr(db_note, key):
            setattr(db_note, key, value)

    # Delete any addenda that were not in the request
    for addendum_id in addenda_ids:
        db_addendum = db.query(models.Addendum).filter(models.Addendum.id == addendum_id).first()
        if db_addendum is not None:
            db.delete(db_addendum)

    db.commit()
    return db_note

def delete_note(db: Session, note_id: int):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    db.delete(db_note)
    db.commit()
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

def update_addendum(db: Session, addendum_id: int, addendum: schemas.AddendumCreate):
    db_addendum = db.query(models.Addendum).filter(models.Addendum.id == addendum_id).first()
    for key, value in addendum.dict().items():
        setattr(db_addendum, key, value)
    db.commit()
    return db_addendum

def delete_addendum(db: Session, addendum_id: int):
    db_addendum = db.query(models.Addendum).filter(models.Addendum.id == addendum_id).first()
    db.delete(db_addendum)
    db.commit()
    return db_addendum