from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LeadBase(BaseModel):
    buyer_id: int
    seller_id: int
    interest: str

class LeadUpdate(BaseModel):
    interest: str

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    buyer: Optional['Participant'] = None
    seller: Optional['Participant'] = None

    class Config:
        orm_mode = True

class ParticipantBase(BaseModel):
    name: str
    email: str
    phone1: str
    phone2: str
    address: str

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    id: int
    leads: List[Lead] = []

    class Config:
        orm_mode = True

class AddendumBase(BaseModel):
    content: str
    note_id: int

class AddendumCreate(AddendumBase):
    pass

class Addendum(AddendumBase):
    id: int

    class Config:
        orm_mode = True

class NoteBase(BaseModel):
    content: str
    addenda: Optional[List[Addendum]] = None

class NoteCreate(NoteBase):
    lead_id: int

class Note(NoteBase):
    id: int
    created_at: datetime
    lead_id: int

    class Config:
        orm_mode = True

class NoteUpdate(NoteBase):
    addenda: Optional[List[AddendumBase]] = None

    class Config:
        orm_mode = True