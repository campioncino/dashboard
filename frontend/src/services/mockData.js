export const mockData = {
  getData() {
    return {
      folders: [
        { id: 'personal', name: 'Personale' },
        { id: 'work', name: 'Lavoro' },
        { id: 'projects', name: 'Progetti' },
        { id: 'learning', name: 'Apprendimento' }
      ],
      
      tags: [
        { name: 'importante', color: 'bg-red-500' },
        { name: 'javascript', color: 'bg-yellow-500' },
        { name: 'python', color: 'bg-green-500' },
        { name: 'react', color: 'bg-blue-500' },
        { name: 'idea', color: 'bg-purple-500' },
        { name: 'todo', color: 'bg-orange-500' },
        { name: 'backend', color: 'bg-indigo-500' },
        { name: 'frontend', color: 'bg-pink-500' }
      ],
      
      notes: [
        {
          id: '1',
          title: 'Configurazione ambiente React',
          content: `// Installazione dipendenze principali
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
  utils/`,
          type: 'code',
          folderId: 'work',
          tags: ['react', 'frontend', 'importante'],
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T14:30:00Z',
          history: [
            {
              version: 1,
              content: `// Setup iniziale React
npm install react-router-dom`,
              timestamp: '2025-01-15T10:00:00Z',
              changes: 'Versione iniziale'
            },
            {
              version: 2,
              content: `// Installazione dipendenze principali
npm install react-router-dom axios
npm install -D tailwindcss

// Configurazione Tailwind
npx tailwindcss init`,
              timestamp: '2025-01-15T12:00:00Z',
              changes: 'Aggiunta configurazione Tailwind'
            },
            {
              version: 3,
              content: `// Installazione dipendenze principali
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
  utils/`,
              timestamp: '2025-01-15T14:30:00Z',
              changes: 'Aggiunta struttura cartelle'
            }
          ]
        },
        {
          id: '2',
          title: 'Lista della spesa settimanale',
          content: `• Frutta:
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
  - Olio extravergine`,
          type: 'list',
          folderId: 'personal',
          tags: ['todo'],
          createdAt: '2025-01-14T08:00:00Z',
          updatedAt: '2025-01-14T08:00:00Z',
          history: []
        },
        {
          id: '3',
          title: 'Algoritmo di ordinamento veloce',
          content: `def quicksort(arr):
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
    print("Array ordinato:", sorted_numbers)`,
          type: 'code',
          folderId: 'learning',
          tags: ['python', 'algoritmi'],
          createdAt: '2025-01-13T16:20:00Z',
          updatedAt: '2025-01-13T17:45:00Z',
          history: [
            {
              version: 1,
              content: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[0]
    left = [x for x in arr[1:] if x < pivot]
    right = [x for x in arr[1:] if x >= pivot]
    
    return quicksort(left) + [pivot] + quicksort(right)`,
              timestamp: '2025-01-13T16:20:00Z',
              changes: 'Versione iniziale'
            },
            {
              version: 2,
              content: `def quicksort(arr):
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
    print("Array ordinato:", sorted_numbers)`,
              timestamp: '2025-01-13T17:45:00Z',
              changes: 'Migliorato pivot selection e aggiunta documentazione'
            }
          ]
        },
        {
          id: '4',
          title: 'Idee per app mobile',
          content: `Brainstorming per nuove applicazioni:

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
- Creare MVP per validazione`,
          type: 'text',
          folderId: 'projects',
          tags: ['idea', 'progetti', 'mobile'],
          createdAt: '2025-01-12T11:30:00Z',
          updatedAt: '2025-01-12T11:30:00Z',
          history: []
        },
        {
          id: '5',
          title: 'Setup database MongoDB',
          content: `// Connessione MongoDB con Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Schema esempio per User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { connectDB, User: mongoose.model('User', userSchema) };`,
          type: 'code',
          folderId: 'work',
          tags: ['javascript', 'backend', 'database'],
          createdAt: '2025-01-11T09:15:00Z',
          updatedAt: '2025-01-11T09:15:00Z',
          history: [
            {
              version: 1,
              content: `// Connessione MongoDB con Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};`,
              timestamp: '2025-01-11T09:15:00Z',
              changes: 'Setup iniziale connessione MongoDB'
            }
          ]
        }
      ]
    };
  }
};