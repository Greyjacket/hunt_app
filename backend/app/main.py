import crud, models, schemas
from fastapi import Depends, FastAPI, HTTPException, Request
#from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from schemas import ParticipantCreate, LeadCreate
from typing import List

models.Base.metadata.create_all(bind=engine)


origins = [
    "http://127.0.0.1:3000",  
    "http://localhost:3000"
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

app = FastAPI(middleware=middleware)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/participants/", response_model=schemas.Participant)
async def create_participant(participant: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    return crud.create_participant(db=db, participant=participant)

@app.get("/participants/", response_model=list[schemas.Participant])
async def read_participants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    participants = crud.get_participants(db, skip=skip, limit=limit)
    return participants

@app.get("/participants/{participant_id}", response_model=schemas.Participant)
async def read_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = crud.get_participant(db, participant_id=participant_id)
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    return db_participant

@app.put("/participants/{participant_id}", response_model=schemas.Participant)
async def update_participant(participant_id: int, participant: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    return crud.update_participant(db=db, participant_id=participant_id, participant=participant)

@app.delete("/participants/{participant_id}")
async def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    return crud.delete_participant(db=db, participant_id=participant_id)

@app.post("/leads/", response_model=schemas.Lead)
async def create_lead(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Construct the seller participant
    seller = {
        "name": data.get("seller", ""),
        "phone1": data.get("sellerNumber1", ""),
        "phone2": data.get("sellerNumber2", ""),
        "email": data.get("sellerEmail", ""),
        "address": data.get("sellerAddress", ""),
    }

    # Construct the buyer participant
    buyer = {
        "name": data.get("buyer", ""),
        "phone1": data.get("buyerNumber1", ""),
        "phone2": data.get("buyerNumber2", ""),
        "email": data.get("buyerEmail", ""),
        "address": data.get("buyerAddress", ""),
    }

    seller = ParticipantCreate.parse_obj(seller)

    # Check if the seller already exists
    db_seller = crud.get_participant_by_name(db, name=seller.name)
    if db_seller is None:
        # If the seller doesn't exist, create a new one
        db_seller = crud.create_participant(db=db, participant=seller)

    buyer = ParticipantCreate.parse_obj(buyer)

    # Check if the buyer already exists
    db_buyer = crud.get_participant_by_name(db, name=buyer.name)
    if db_buyer is None:
        # If the buyer doesn't exist, create a new one
        db_buyer = crud.create_participant(db=db, participant=buyer)

    lead_data = {
        "seller_id": db_seller.id,
        "buyer_id": db_buyer.id,
        "interest": data.get("interest", ""),
    }  
    lead = LeadCreate.parse_obj(lead_data)

    return crud.create_lead(db=db, lead=lead)

@app.get("/leads/", response_model=list[schemas.Lead])
async def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    leads = crud.get_leads(db, skip=skip, limit=limit)
    return leads

@app.get("/leads/{lead_id}", response_model=schemas.Lead)
async def read_lead(lead_id: int, db: Session = Depends(get_db)):
    db_lead = crud.get_lead(db, lead_id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return db_lead

@app.put("/leads/{lead_id}", response_model=schemas.Lead)
async def update_lead(lead_id: int, lead: schemas.LeadUpdate, db: Session = Depends(get_db)):
    return crud.update_lead(db=db, lead_id=lead_id, lead=lead)

@app.get("/leads/{lead_id}/notes", response_model=List[schemas.Note])
async def get_notes_by_lead_id(lead_id: int, db: Session = Depends(get_db)):
    notes = crud.get_notes_by_lead_id(db, lead_id)
    if notes is None:
        raise HTTPException(status_code=404, detail="Notes not found")
    return notes

@app.delete("/leads/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(db_lead)
    db.commit()
    return {"message": "Lead deleted successfully"}

@app.post("/notes/", response_model=schemas.Note)
async def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_lead = db.query(models.Lead).filter(models.Lead.id == note.lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return crud.create_note(db=db, note=note)

@app.get("/notes/", response_model=list[schemas.Note])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    notes = crud.get_notes(db, skip=skip, limit=limit)
    return notes

@app.get("/notes/{note_id}", response_model=schemas.Note)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = crud.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notes/{note_id}", response_model=schemas.Note)
async def update_note(note_id: int, note: schemas.NoteUpdate, db: Session = Depends(get_db)):
    return crud.update_note(db=db, note_id=note_id, note=note)

@app.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    return crud.delete_note(db=db, note_id=note_id)

@app.post("/addendums/", response_model=schemas.Addendum)
def create_addendum(addendum: schemas.AddendumCreate, note_id: int, db: Session = Depends(get_db)):
    return crud.create_addendum(db=db, addendum=addendum, note_id=note_id)

@app.get("/addendums/", response_model=list[schemas.Addendum])
def read_addendums(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    addendums = crud.get_addendums(db, skip=skip, limit=limit)
    return addendums

@app.get("/addendums/{addendum_id}", response_model=schemas.Addendum)
def read_addendum(addendum_id: int, db: Session = Depends(get_db)):
    db_addendum = crud.get_addendum(db, addendum_id=addendum_id)
    if db_addendum is None:
        raise HTTPException(status_code=404, detail="Addendum not found")
    return db_addendum

@app.put("/addendums/{addendum_id}", response_model=schemas.Addendum)
async def update_addendum(addendum_id: int, addendum: schemas.AddendumCreate, db: Session = Depends(get_db)):
    return crud.update_addendum(db=db, addendum_id=addendum_id, addendum=addendum)

@app.delete("/addendums/{addendum_id}")
async def delete_addendum(addendum_id: int, db: Session = Depends(get_db)):
    return crud.delete_addendum(db=db, addendum_id=addendum_id)