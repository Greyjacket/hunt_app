import crud, models, schemas
from fastapi import Depends, FastAPI, HTTPException, Request
#from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from schemas import ParticipantCreate, LeadCreate

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

@app.delete("/participants/{participant_id}")
def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(db_participant)
    db.commit()
    return {"message": "Participant deleted successfully"}


#@app.post("/leads/", response_model=str)
@app.post("/leads/", response_model=schemas.Lead)
async def create_lead(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    # Transform the data here
    # For example, let's convert the 'name' field to uppercase
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
    #return "ok"

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
   
@app.delete("/leads/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(db_lead)
    db.commit()
    return {"message": "Lead deleted successfully"}
