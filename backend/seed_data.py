from database import db
import uuid

def seed_sample_notes():
    """Aggiunge appunti di esempio al database"""
    
    # Sample notes data
    sample_notes = [
        {
            'title': 'Configurazione ambiente React',
            'content': '''// Installazione dipendenze principali
npm install react-router-dom axios
npm install -D tailwindcss

// Configurazione Tailwind
npx tailwindcss init

// Struttura componenti
src/
  components/
    ui/
    pages/
  services/
  utils/''',
            'type': 'code',
            'folder_id': 'work',
            'tag_names': ['react', 'frontend', 'importante']
        },
        {
            'title': 'Lista della spesa settimanale',
            'content': '''• Frutta:
  - Mele (2kg)
  - Banane (1kg)
  - Arance (1kg)

• Verdura:
  - Pomodori
  - Insalata
  - Carote
  - Zucchine

• Latticini:
  - Latte (2L)
  - Yogurt greco
  - Parmigiano

• Carne e pesce:
  - Pollo (500g)
  - Salmone (300g)

• Altro:
  - Pane integrale
  - Pasta
  - Riso basmati
  - Olio extravergine''',
            'type': 'list',
            'folder_id': 'personal',
            'tag_names': ['todo']
        },
        {
            'title': 'Algoritmo di ordinamento veloce',
            'content': '''def quicksort(arr):
    """
    Implementazione dell'algoritmo Quicksort
    Complessità temporale: O(n log n) medio, O(n²) peggiore
    Complessità spaziale: O(log n)
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Esempio di utilizzo
if __name__ == "__main__":
    numbers = [64, 34, 25, 12, 22, 11, 90]
    print("Array originale:", numbers)
    sorted_numbers = quicksort(numbers)
    print("Array ordinato:", sorted_numbers)''',
            'type': 'code',
            'folder_id': 'learning',
            'tag_names': ['python', 'algoritmi']
        },
        {
            'title': 'Idee per app mobile',
            'content': '''Brainstorming per nuove applicazioni:

1. **FitnessTracker Plus**
   - Tracciamento workout personalizzati
   - Integrazione con dispositivi wearable
   - Social features per sfide tra amici
   - AI coach virtuale

2. **LocalEats**
   - Scopri ristoranti locali nascosti
   - Reviews autentiche della community
   - Sistema di prenotazioni integrate
   - Mappa interattiva con filtri avanzati

3. **StudyBuddy**
   - Pianificatore di studio intelligente
   - Flashcard con spaced repetition
   - Gruppo studio virtuale
   - Statistiche di apprendimento

4. **EcoTrack**
   - Monitora la tua impronta carbonica
   - Suggerimenti per uno stile di vita sostenibile
   - Sfide ecologiche mensili
   - Marketplace prodotti eco-friendly

Note aggiuntive:
- Ricercare mercato per ogni idea
- Valutare fattibilità tecnica
- Creare MVP per validazione''',
            'type': 'text',
            'folder_id': 'projects',
            'tag_names': ['idea', 'progetti', 'mobile']
        },
        {
            'title': 'Setup database SQLite',
            'content': '''import sqlite3
from pathlib import Path

def create_connection(db_file):
    """Crea connessione al database SQLite"""
    try:
        conn = sqlite3.connect(db_file)
        conn.row_factory = sqlite3.Row
        return conn
    except Error as e:
        print(e)
    return None

def create_table(conn, create_table_sql):
    """Crea tabella dal SQL statement"""
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

# Esempio schema tabella utenti
sql_create_users_table = """
    CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        name text NOT NULL,
        email text UNIQUE NOT NULL,
        created_date timestamp DEFAULT CURRENT_TIMESTAMP
    );
"""

# Utilizzo
database = Path("example.db")
conn = create_connection(database)
if conn is not None:
    create_table(conn, sql_create_users_table)
    conn.close()
else:
    print("Error! Impossibile creare connessione al database.")''',
            'type': 'code',
            'folder_id': 'work',
            'tag_names': ['python', 'backend', 'database']
        }
    ]
    
    # Add sample notes
    for note_data in sample_notes:
        try:
            db.create_note(
                title=note_data['title'],
                content=note_data['content'],
                note_type=note_data['type'],
                folder_id=note_data['folder_id'],
                tag_names=note_data['tag_names']
            )
            print(f"✅ Creato appunto: {note_data['title']}")
        except Exception as e:
            print(f"❌ Errore creando appunto {note_data['title']}: {e}")

if __name__ == "__main__":
    print("🌱 Seeding database con appunti di esempio...")
    seed_sample_notes()
    print("✅ Seeding completato!")