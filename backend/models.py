from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: str
    created_at: Optional[datetime] = None
    note_count: int = 0

class TagBase(BaseModel):
    name: str
    color: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int

class NoteTag(BaseModel):
    name: str
    color: str

class NoteHistoryEntry(BaseModel):
    id: int
    version: int
    content: str
    changes: str
    timestamp: datetime

class NoteBase(BaseModel):
    title: str
    content: str
    type: str = Field(..., regex="^(text|code|list)$")
    folder_id: Optional[str] = None

class NoteCreate(NoteBase):
    tag_names: List[str] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tag_names: Optional[List[str]] = None

class Note(NoteBase):
    id: str
    created_at: datetime
    updated_at: datetime
    tags: List[NoteTag] = []

class NoteWithHistory(Note):
    history: List[NoteHistoryEntry] = []