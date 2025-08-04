import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  Search, 
  Plus, 
  FileText, 
  Code, 
  List, 
  Folder, 
  Tag, 
  Edit, 
  Trash2, 
  History,
  Save,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import notesAPI from '../services/api';
import CodeEditor from './CodeEditor';
import HistoryViewer from './HistoryViewer';
import { useToast } from '../hooks/use-toast';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteHistory, setNoteHistory] = useState([]);

  const { toast } = useToast();

  // Form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'text',
    folder_id: '',
    tag_names: []
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [notesData, foldersData, tagsData] = await Promise.all([
        notesAPI.getNotes(),
        notesAPI.getFolders(),
        notesAPI.getTags()
      ]);
      
      setNotes(notesData);
      setFolders(foldersData);
      setTags(tagsData);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtro note
  const filteredNotes = notes.filter(note => {
    const matchesFolder = selectedFolder === 'all' || note.folder_id === selectedFolder;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCreateNote = async () => {
    try {
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        type: newNote.type,
        folder_id: newNote.folder_id || null,
        tag_names: newNote.tag_names
      };
      
      const createdNote = await notesAPI.createNote(noteData);
      setNotes([createdNote, ...notes]);
      setNewNote({ title: '', content: '', type: 'text', folder_id: '', tag_names: [] });
      setShowCreateDialog(false);
      
      toast({
        title: "Successo",
        description: "Appunto creato con successo",
      });
    } catch (err) {
      toast({
        title: "Errore",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      
      toast({
        title: "Successo", 
        description: "Appunto eliminato con successo",
      });
    } catch (err) {
      toast({
        title: "Errore",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note) => {
    setEditingNote({ ...note });
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        title: editingNote.title,
        content: editingNote.content,
        tag_names: editingNote.tags.map(tag => tag.name)
      };
      
      const updatedNote = await notesAPI.updateNote(editingNote.id, updateData);
      setNotes(notes.map(note => 
        note.id === editingNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      setEditingNote(null);
      
      toast({
        title: "Successo",
        description: "Appunto aggiornato con successo",
      });
    } catch (err) {
      toast({
        title: "Errore", 
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const loadNoteHistory = async (noteId) => {
    try {
      const history = await notesAPI.getNoteHistory(noteId);
      setNoteHistory(history);
      setShowHistoryDialog(true);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile caricare lo storico",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'list': return <List className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTagColor = (tagName) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || 'bg-gray-200';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Caricamento appunti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Errore: {error}</p>
          <button 
            onClick={loadInitialData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">I Miei Appunti</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca appunti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Note Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuovo Appunto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crea Nuovo Appunto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Titolo..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                />
                <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo di appunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Testo</SelectItem>
                    <SelectItem value="code">Codice</SelectItem>
                    <SelectItem value="list">Lista</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newNote.folderId} onValueChange={(value) => setNewNote({...newNote, folderId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona cartella" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map(folder => (
                      <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Contenuto..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  rows={6}
                />
                <Button onClick={handleCreateNote} className="w-full">
                  Crea Appunto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Folders */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
            <Folder className="w-4 h-4 mr-2" />
            Cartelle
          </h3>
          <div className="space-y-1">
            <Button
              variant={selectedFolder === 'all' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedFolder('all')}
            >
              Tutti gli appunti ({notes.length})
            </Button>
            {folders.map(folder => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name} ({notes.filter(n => n.folderId === folder.id).length})
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Notes List */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-3">
            {filteredNotes.map(note => (
              <Card 
                key={note.id}
                className={`cursor-pointer transition-colors ${
                  selectedNote?.id === note.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(note.type)}
                      <h4 className="font-medium text-sm truncate">{note.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className={`text-xs ${getTagColor(tag)} text-white`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          editingNote ? (
            // Edit Mode
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                    className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveEdit} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salva
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingNote(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6">
                {editingNote.type === 'code' ? (
                  <CodeEditor
                    value={editingNote.content}
                    onChange={(value) => setEditingNote({...editingNote, content: value})}
                  />
                ) : (
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    className="w-full h-full resize-none border-none focus-visible:ring-0"
                    placeholder="Scrivi qui il tuo appunto..."
                  />
                )}
              </div>
            </div>
          ) : (
            // View Mode
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(selectedNote.type)}
                    <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                  </div>
                  <div className="flex space-x-2">
                    {selectedNote.type === 'code' && selectedNote.history?.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowHistoryDialog(true)}
                      >
                        <History className="w-4 h-4 mr-2" />
                        Storico
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditNote(selectedNote)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifica
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedNote.tags.map(tag => (
                    <Badge 
                      key={tag}
                      className={`${getTagColor(tag)} text-white`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Creato: {new Date(selectedNote.createdAt).toLocaleString()} | 
                  Modificato: {new Date(selectedNote.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex-1 p-6">
                {selectedNote.type === 'code' ? (
                  <CodeEditor
                    value={selectedNote.content}
                    readOnly={true}
                  />
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {selectedNote.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nessun appunto selezionato
              </h3>
              <p className="text-gray-500">
                Seleziona un appunto dalla sidebar o creane uno nuovo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* History Dialog */}
      {selectedNote && (
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Storico Modifiche - {selectedNote.title}</DialogTitle>
            </DialogHeader>
            <HistoryViewer history={selectedNote.history || []} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NotesApp;