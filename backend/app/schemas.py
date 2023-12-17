from pydantic import BaseModel
from typing import Optional

class LeadBase(BaseModel):
    buyer_id: int
    seller_id: int
    interest: str


class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    interest: str
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
    leads: list[Lead] = []

    class Config:
        orm_mode = True

class AddendumBase(BaseModel):
    content: str

class AddendumCreate(AddendumBase):
    pass

class Addendum(AddendumBase):
    id: int
    note_id: int

    class Config:
        orm_mode = True

class NoteBase(BaseModel):
    content: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    lead_id: int
    addendums: list[Addendum] = []

    class Config:
        orm_mode = True