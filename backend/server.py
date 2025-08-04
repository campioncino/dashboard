from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
import logging
from typing import List, Optional

from database import db
from models import (
    Folder, FolderCreate, 
    Tag, TagCreate,
    Note, NoteCreate, NoteUpdate, NoteHistoryEntry
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Notes Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Health check
@api_router.get("/")
async def health_check():
    return {"status": "ok", "message": "Notes Dashboard API"}

# FOLDERS ENDPOINTS
@api_router.get("/folders", response_model=List[Folder])
async def get_folders():
    """Ottieni tutte le cartelle"""
    try:
        folders = db.get_folders()
        return folders
    except Exception as e:
        logger.error(f"Error getting folders: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving folders")

@api_router.post("/folders", response_model=Folder)
async def create_folder(folder: FolderCreate):
    """Crea nuova cartella"""
    try:
        new_folder = db.create_folder(folder.name)
        return new_folder
    except Exception as e:
        logger.error(f"Error creating folder: {e}")
        raise HTTPException(status_code=500, detail="Error creating folder")

@api_router.put("/folders/{folder_id}", response_model=Folder)
async def update_folder(folder_id: str, folder: FolderCreate):
    """Aggiorna cartella"""
    try:
        updated_folder = db.update_folder(folder_id, folder.name)
        if not updated_folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        return updated_folder
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating folder: {e}")
        raise HTTPException(status_code=500, detail="Error updating folder")

@api_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    """Elimina cartella"""
    try:
        success = db.delete_folder(folder_id)
        if not success:
            raise HTTPException(status_code=404, detail="Folder not found")
        return {"message": "Folder deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting folder: {e}")
        raise HTTPException(status_code=500, detail="Error deleting folder")

# TAGS ENDPOINTS
@api_router.get("/tags", response_model=List[Tag])
async def get_tags():
    """Ottieni tutti i tag"""
    try:
        tags = db.get_tags()
        return tags
    except Exception as e:
        logger.error(f"Error getting tags: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving tags")

@api_router.post("/tags", response_model=Tag)
async def create_tag(tag: TagCreate):
    """Crea nuovo tag"""
    try:
        new_tag = db.create_tag(tag.name, tag.color)
        return new_tag
    except Exception as e:
        logger.error(f"Error creating tag: {e}")
        raise HTTPException(status_code=500, detail="Error creating tag")

# NOTES ENDPOINTS
@api_router.get("/notes", response_model=List[Note])
async def get_notes(
    folder_id: Optional[str] = Query(None, description="Filter by folder ID"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    tag: Optional[str] = Query(None, description="Filter by tag name")
):
    """Ottieni appunti con filtri opzionali"""
    try:
        notes = db.get_notes(folder_id=folder_id, search=search, tag=tag)
        return notes
    except Exception as e:
        logger.error(f"Error getting notes: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving notes")

@api_router.get("/notes/{note_id}", response_model=Note)
async def get_note(note_id: str):
    """Ottieni singolo appunto"""
    try:
        note = db.get_note_by_id(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        return note
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting note: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving note")

@api_router.post("/notes", response_model=Note)
async def create_note(note: NoteCreate):
    """Crea nuovo appunto"""
    try:
        new_note = db.create_note(
            title=note.title,
            content=note.content,
            note_type=note.type,
            folder_id=note.folder_id,
            tag_names=note.tag_names
        )
        return new_note
    except Exception as e:
        logger.error(f"Error creating note: {e}")
        raise HTTPException(status_code=500, detail="Error creating note")

@api_router.put("/notes/{note_id}", response_model=Note)
async def update_note(note_id: str, note_update: NoteUpdate):
    """Aggiorna appunto"""
    try:
        updated_note = db.update_note(
            note_id=note_id,
            title=note_update.title,
            content=note_update.content,
            tag_names=note_update.tag_names
        )
        if not updated_note:
            raise HTTPException(status_code=404, detail="Note not found")
        return updated_note
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating note: {e}")
        raise HTTPException(status_code=500, detail="Error updating note")

@api_router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    """Elimina appunto"""
    try:
        success = db.delete_note(note_id)
        if not success:
            raise HTTPException(status_code=404, detail="Note not found")
        return {"message": "Note deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting note: {e}")
        raise HTTPException(status_code=500, detail="Error deleting note")

@api_router.get("/notes/{note_id}/history", response_model=List[NoteHistoryEntry])
async def get_note_history(note_id: str):
    """Ottieni storico modifiche appunto"""
    try:
        # Verifica che l'appunto esista
        note = db.get_note_by_id(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        
        history = db.get_note_history(note_id)
        return history
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting note history: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving note history")

# Include API router
app.include_router(api_router)

# Serve React static files in production
# In development, React dev server handles this
static_path = Path(__file__).parent.parent / "frontend" / "build"
if static_path.exists():
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
    logger.info(f"Serving static files from {static_path}")
else:
    logger.info("Static files not found - running in development mode")

@app.on_event("startup")
async def startup():
    logger.info("🚀 Notes Dashboard API started successfully")
    logger.info(f"📁 Database location: {db.db_path}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)