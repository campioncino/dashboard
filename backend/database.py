import sqlite3
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import uuid

class NotesDatabase:
    def __init__(self, db_path: str = None):
        if db_path is None:
            # Crea directory data se non exists
            data_dir = Path('/app/data')
            data_dir.mkdir(exist_ok=True)
            db_path = data_dir / 'notes.db'
        
        self.db_path = str(db_path)
        self.init_database()
        self.seed_initial_data()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Crea tabelle se non esistono"""
        with self.get_connection() as conn:
            # Folders table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS folders (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Tags table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    color TEXT NOT NULL
                )
            ''')
            
            # Notes table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS notes (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    type TEXT NOT NULL CHECK (type IN ('text', 'code', 'list')),
                    folder_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (folder_id) REFERENCES folders (id)
                )
            ''')
            
            # Note Tags junction table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS note_tags (
                    note_id TEXT,
                    tag_id INTEGER,
                    PRIMARY KEY (note_id, tag_id),
                    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
                )
            ''')
            
            # Note History table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS note_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    note_id TEXT NOT NULL,
                    version INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    changes TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
                )
            ''')
            
            conn.commit()
    
    def seed_initial_data(self):
        """Popola database con dati iniziali se vuoto"""
        with self.get_connection() as conn:
            # Controlla se esistono già dati
            cursor = conn.execute('SELECT COUNT(*) FROM folders')
            if cursor.fetchone()[0] > 0:
                return  # Dati già presenti
            
            # Seed folders
            folders = [
                ('personal', 'Personale'),
                ('work', 'Lavoro'), 
                ('projects', 'Progetti'),
                ('learning', 'Apprendimento')
            ]
            
            conn.executemany(
                'INSERT INTO folders (id, name) VALUES (?, ?)',
                folders
            )
            
            # Seed tags
            tags = [
                ('importante', 'bg-red-500'),
                ('javascript', 'bg-yellow-500'), 
                ('python', 'bg-green-500'),
                ('react', 'bg-blue-500'),
                ('idea', 'bg-purple-500'),
                ('todo', 'bg-orange-500'),
                ('backend', 'bg-indigo-500'),
                ('frontend', 'bg-pink-500'),
                ('algoritmi', 'bg-cyan-500'),
                ('progetti', 'bg-teal-500'),
                ('mobile', 'bg-rose-500'),
                ('database', 'bg-violet-500')
            ]
            
            conn.executemany(
                'INSERT INTO tags (name, color) VALUES (?, ?)',
                tags
            )
            
            conn.commit()
    
    # FOLDERS CRUD
    def get_folders(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.execute('''
                SELECT id, name, created_at,
                       (SELECT COUNT(*) FROM notes WHERE folder_id = folders.id) as note_count
                FROM folders 
                ORDER BY name
            ''')
            return [dict(row) for row in cursor.fetchall()]
    
    def create_folder(self, name: str) -> Dict[str, Any]:
        folder_id = str(uuid.uuid4())
        with self.get_connection() as conn:
            conn.execute(
                'INSERT INTO folders (id, name) VALUES (?, ?)',
                (folder_id, name)
            )
            conn.commit()
            return {'id': folder_id, 'name': name, 'note_count': 0}
    
    def update_folder(self, folder_id: str, name: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.execute(
                'UPDATE folders SET name = ? WHERE id = ?',
                (name, folder_id)
            )
            if cursor.rowcount == 0:
                return None
            conn.commit()
            return {'id': folder_id, 'name': name}
    
    def delete_folder(self, folder_id: str) -> bool:
        with self.get_connection() as conn:
            cursor = conn.execute('DELETE FROM folders WHERE id = ?', (folder_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    # TAGS CRUD
    def get_tags(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.execute('SELECT * FROM tags ORDER BY name')
            return [dict(row) for row in cursor.fetchall()]
    
    def create_tag(self, name: str, color: str) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.execute(
                'INSERT INTO tags (name, color) VALUES (?, ?) RETURNING *',
                (name, color)
            )
            row = cursor.fetchone()
            conn.commit()
            return dict(row)
    
    # NOTES CRUD
    def get_notes(self, folder_id: str = None, search: str = None, tag: str = None) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            query = '''
                SELECT DISTINCT n.*, 
                       GROUP_CONCAT(t.name) as tag_names,
                       GROUP_CONCAT(t.color) as tag_colors
                FROM notes n
                LEFT JOIN note_tags nt ON n.id = nt.note_id
                LEFT JOIN tags t ON nt.tag_id = t.id
                WHERE 1=1
            '''
            params = []
            
            if folder_id:
                query += ' AND n.folder_id = ?'
                params.append(folder_id)
            
            if search:
                query += ' AND (n.title LIKE ? OR n.content LIKE ?)'
                search_term = f'%{search}%'
                params.extend([search_term, search_term])
            
            if tag:
                query += ' AND t.name = ?'
                params.append(tag)
            
            query += ' GROUP BY n.id ORDER BY n.updated_at DESC'
            
            cursor = conn.execute(query, params)
            notes = []
            
            for row in cursor.fetchall():
                note = dict(row)
                # Parse tags
                if note['tag_names']:
                    tag_names = note['tag_names'].split(',')
                    tag_colors = note['tag_colors'].split(',')
                    note['tags'] = [{'name': name, 'color': color} 
                                  for name, color in zip(tag_names, tag_colors)]
                else:
                    note['tags'] = []
                
                del note['tag_names']
                del note['tag_colors']
                notes.append(note)
            
            return notes
    
    def get_note_by_id(self, note_id: str) -> Optional[Dict[str, Any]]:
        notes = self.get_notes()
        return next((n for n in notes if n['id'] == note_id), None)
    
    def create_note(self, title: str, content: str, note_type: str, 
                   folder_id: str = None, tag_names: List[str] = None) -> Dict[str, Any]:
        note_id = str(uuid.uuid4())
        
        with self.get_connection() as conn:
            # Create note
            conn.execute('''
                INSERT INTO notes (id, title, content, type, folder_id) 
                VALUES (?, ?, ?, ?, ?)
            ''', (note_id, title, content, note_type, folder_id))
            
            # Add tags
            if tag_names:
                for tag_name in tag_names:
                    # Get tag ID
                    cursor = conn.execute('SELECT id FROM tags WHERE name = ?', (tag_name,))
                    tag_row = cursor.fetchone()
                    if tag_row:
                        conn.execute(
                            'INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)',
                            (note_id, tag_row['id'])
                        )
            
            # Create initial history entry for code notes
            if note_type == 'code':
                conn.execute('''
                    INSERT INTO note_history (note_id, version, content, changes)
                    VALUES (?, 1, ?, 'Versione iniziale')
                ''', (note_id, content))
            
            conn.commit()
        
        return self.get_note_by_id(note_id)
    
    def update_note(self, note_id: str, title: str = None, content: str = None, 
                   tag_names: List[str] = None) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            # Get current note for history
            current = self.get_note_by_id(note_id)
            if not current:
                return None
            
            # Update note
            if title is not None:
                conn.execute('UPDATE notes SET title = ?, updated_at = ? WHERE id = ?',
                           (title, datetime.now().isoformat(), note_id))
            
            if content is not None:
                conn.execute('UPDATE notes SET content = ?, updated_at = ? WHERE id = ?', 
                           (content, datetime.now().isoformat(), note_id))
                
                # Add history entry for code notes if content changed
                if current['type'] == 'code' and content != current['content']:
                    # Get next version number
                    cursor = conn.execute(
                        'SELECT MAX(version) FROM note_history WHERE note_id = ?', 
                        (note_id,)
                    )
                    max_version = cursor.fetchone()[0] or 0
                    
                    conn.execute('''
                        INSERT INTO note_history (note_id, version, content, changes)
                        VALUES (?, ?, ?, 'Modifica contenuto')
                    ''', (note_id, max_version + 1, content))
            
            # Update tags
            if tag_names is not None:
                # Remove old tags
                conn.execute('DELETE FROM note_tags WHERE note_id = ?', (note_id,))
                
                # Add new tags
                for tag_name in tag_names:
                    cursor = conn.execute('SELECT id FROM tags WHERE name = ?', (tag_name,))
                    tag_row = cursor.fetchone()
                    if tag_row:
                        conn.execute(
                            'INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)',
                            (note_id, tag_row['id'])
                        )
            
            conn.commit()
        
        return self.get_note_by_id(note_id)
    
    def delete_note(self, note_id: str) -> bool:
        with self.get_connection() as conn:
            cursor = conn.execute('DELETE FROM notes WHERE id = ?', (note_id,))
            conn.commit()
            return cursor.rowcount > 0
    
    def get_note_history(self, note_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.execute('''
                SELECT * FROM note_history 
                WHERE note_id = ? 
                ORDER BY version
            ''', (note_id,))
            return [dict(row) for row in cursor.fetchall()]

# Global database instance
db = NotesDatabase()