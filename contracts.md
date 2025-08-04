# Contratti API - Dashboard Appunti

## Panoramica Architettura
- **Frontend**: React con dati mock (da sostituire)
- **Backend**: FastAPI + SQLite
- **Database**: SQLite file-based per semplicità deployment

## Modelli Dati da Implementare

### 1. Folders (Cartelle)
```sql
CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tags
```sql  
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL
);
```

### 3. Notes (Appunti)
```sql
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'code', 'list')),
    folder_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders (id)
);
```

### 4. Note Tags (Relazione Many-to-Many)
```sql
CREATE TABLE note_tags (
    note_id TEXT,
    tag_id INTEGER,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
```

### 5. Note History (Solo per appunti codice)
```sql
CREATE TABLE note_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    changes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);
```

## API Endpoints da Implementare

### Folders
- `GET /api/folders` - Lista tutte le cartelle
- `POST /api/folders` - Crea nuova cartella  
- `PUT /api/folders/{id}` - Modifica cartella
- `DELETE /api/folders/{id}` - Elimina cartella

### Tags  
- `GET /api/tags` - Lista tutti i tag
- `POST /api/tags` - Crea nuovo tag
- `PUT /api/tags/{id}` - Modifica tag
- `DELETE /api/tags/{id}` - Elimina tag

### Notes
- `GET /api/notes` - Lista appunti (con filtri)
  - Query params: `folder_id`, `search`, `tag`
- `GET /api/notes/{id}` - Dettagli singolo appunto
- `POST /api/notes` - Crea nuovo appunto
- `PUT /api/notes/{id}` - Modifica appunto (con storico per codice)
- `DELETE /api/notes/{id}` - Elimina appunto

### History
- `GET /api/notes/{id}/history` - Storico modifiche appunto

## Dati Mock da Sostituire

### File: `/app/frontend/src/services/mockData.js`
**DATI MOCK ATTUALI:**
- 4 cartelle predefinite (personal, work, projects, learning)
- 8 tag colorati  
- 5 appunti di esempio con storico per codice

**DA SOSTITUIRE CON:**
- Chiamate API al backend SQLite
- Gestione stati loading/error
- Cache locale opzionale

## Piano Integrazione Frontend-Backend

### 1. Sostituire Mock Service
Creare `/app/frontend/src/services/api.js`:
```javascript
// Sostituisce mockData.js
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Implementare tutti i metodi API
export const notesAPI = {
  getNotes: (filters) => axios.get(`${API_BASE}/notes`, { params: filters }),
  createNote: (data) => axios.post(`${API_BASE}/notes`, data),
  // ... altri metodi
};
```

### 2. Aggiornare Componenti
- **NotesApp.jsx**: Sostituire mockData con chiamate API
- Aggiungere stati loading/error
- Gestire operazioni async

### 3. Gestione Errori  
- Toast notifications per errori API
- Fallback per connessioni fallite
- Retry automatico

## Schema Migrazione da Mock

### useEffect Initialization
```javascript
// PRIMA (mock)
const data = mockData.getData();
setNotes(data.notes);

// DOPO (API)
useEffect(() => {
  const loadData = async () => {
    try {
      const [notesRes, foldersRes, tagsRes] = await Promise.all([
        notesAPI.getNotes(),
        foldersAPI.getFolders(), 
        tagsAPI.getTags()
      ]);
      setNotes(notesRes.data);
      setFolders(foldersRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  loadData();
}, []);
```

### CRUD Operations
```javascript
// CREATE
const handleCreateNote = async () => {
  try {
    const response = await notesAPI.createNote(newNote);
    setNotes([...notes, response.data]);
    // Success feedback
  } catch (error) {
    // Error handling
  }
};

// UPDATE con History per Code
const handleSaveEdit = async () => {
  try {
    const response = await notesAPI.updateNote(editingNote.id, editingNote);
    setNotes(notes.map(note => 
      note.id === editingNote.id ? response.data : note
    ));
  } catch (error) {
    // Error handling  
  }
};
```

## Deployment Configuration

### Dockerfile
```dockerfile
FROM python:3.11-slim
# Backend + SQLite database
# Serve static React build
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  notes-app:
    build: .
    ports:
      - "8001:8001"
    volumes:
      - ./data:/app/data  # SQLite persistence
```

### Database Persistence
- SQLite file: `/app/data/notes.db`
- Volume mount per persistenza
- Backup: copia file database

## Prossimi Passi Implementazione

1. ✅ **Backend SQLite + FastAPI** - Implementare modelli e API
2. ✅ **Seed Data** - Popolare DB con dati demo
3. ✅ **Frontend Integration** - Sostituire mock con API calls  
4. ✅ **Error Handling** - Gestione errori e loading states
5. ✅ **Testing** - Verificare funzionalità end-to-end
6. ✅ **Docker Setup** - Containerizzazione completa

## Note Tecniche
- **SQLite**: Database embedded, zero configurazione
- **Alembic**: Migrations per schema changes future  
- **CORS**: Configurato per frontend React
- **Error Handling**: Standardizzato con HTTP status codes