# 📝 Notes Dashboard

Una dashboard moderna e completa per gestire i tuoi appunti con supporto per testo, codice e liste.

## ✨ Caratteristiche

- **📁 Organizzazione**: Cartelle e tag colorati
- **🔍 Ricerca avanzata**: Trova appunti per titolo e contenuto
- **💻 Editor codice**: Sintassi highlighting per appunti di codice  
- **📚 Storico versioni**: Tracciamento modifiche per appunti codice
- **⚡ Real-time**: Interfaccia reattiva e moderna
- **🐳 Docker ready**: Containerizzazione completa

## 🏗️ Architettura

- **Frontend**: React + TailwindCSS + Shadcn/ui
- **Backend**: FastAPI + SQLite
- **Database**: SQLite file-based (perfetto per Docker)

## 🚀 Quick Start

### Con Docker (Raccomandato)

```bash
# Clone repository
git clone <your-repo>
cd notes-dashboard

# Build e avvia
docker-compose up --build

# Accedi all'app
open http://localhost:8001
```

### Sviluppo Locale

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed_data.py  # Popola con dati di esempio
python server.py

# Frontend (in altra finestra)
cd frontend  
yarn install
yarn start
```

## 📊 API Endpoints

- `GET /api/notes` - Lista appunti
- `POST /api/notes` - Crea appunto
- `PUT /api/notes/{id}` - Modifica appunto
- `DELETE /api/notes/{id}` - Elimina appunto
- `GET /api/notes/{id}/history` - Storico modifiche
- `GET /api/folders` - Lista cartelle
- `GET /api/tags` - Lista tag

## 🗄️ Database

SQLite file-based salvato in `/app/data/notes.db`.

### Backup
```bash
# Copia file database
cp data/notes.db backup-$(date +%Y%m%d).db
```

## 🐳 Deployment

### Docker Compose Production

```yaml
version: '3.8'
services:
  notes-app:
    image: notes-dashboard:latest
    ports:
      - "80:8001"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### Con Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📝 Utilizzo

1. **Creare Appunti**: Clicca "Nuovo Appunto" e scegli tipo (testo/codice/lista)
2. **Organizzare**: Assegna cartelle e tag colorati
3. **Cercare**: Usa la barra di ricerca per trovare rapidamente
4. **Modificare**: Clicca su un appunto e usa il pulsante "Modifica"  
5. **Storico**: Per appunti codice, visualizza tutte le versioni precedenti

## 🔧 Personalizzazione

### Aggiungere Cartelle
```javascript
// Via API
POST /api/folders
{
  "name": "Nuova Cartella"  
}
```

### Nuovi Tag
```javascript  
// Via API
POST /api/tags
{
  "name": "custom-tag",
  "color": "bg-emerald-500"
}
```

## 🛠️ Tecnologie

- **React 19** con Hooks moderni
- **TailwindCSS** per styling
- **Shadcn/ui** per componenti
- **FastAPI** backend performante  
- **SQLite** database embedded
- **Docker** per containerizzazione

## 📄 Licenza

MIT License - Usa liberamente per progetti personali e commerciali.

## 🤝 Contributi

Contributi benvenuti! Apri issue o pull request.

---

**Creato con ❤️ per organizzare meglio le tue idee**