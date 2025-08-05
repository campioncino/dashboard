import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Search, 
  Plus, 
  FileText, 
  Code, 
  List, 
  Folder, 
  Tag, 
  Calendar,
  User,
  Settings,
  Grid3X3,
  LayoutDashboard,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notesAPI from '../services/api';
import { useToast } from '../hooks/use-toast';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedView, setSelectedView] = useState('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state per nuovo appunto
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'text',
    folder_id: '',
    tag_names: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notesData, foldersData, tagsData] = await Promise.all([
        notesAPI.getNotes(),
        notesAPI.getFolders(),
        notesAPI.getTags()
      ]);
      
      setNotes(notesData);
      setFolders(foldersData);
      setTags(tagsData);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      toast({
        title: "Errore",
        description: error.message,
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'code': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'list': return 'bg-green-50 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  // Filtra e organizza appunti
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Organizza per cartelle
  const notesByFolder = folders.map(folder => ({
    ...folder,
    notes: filteredNotes.filter(note => note.folder_id === folder.id)
  }));

  // Appunti senza cartella
  const unorganizedNotes = filteredNotes.filter(note => !note.folder_id);

  const recentNotes = [...filteredNotes]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento progetti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Grid3X3 className="w-8 h-8 mr-3 text-blue-600" />
                I Miei Progetti
              </h1>
              
              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <Button
                  variant={selectedView === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('all')}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Tutti
                </Button>
                <Button
                  variant={selectedView === 'recent' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('recent')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Recenti
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cerca progetti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>

              {/* Create Button */}
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuovo Progetto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crea Nuovo Progetto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome progetto..."
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    />
                    <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo di progetto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Documentazione</SelectItem>
                        <SelectItem value="code">Codice</SelectItem>
                        <SelectItem value="list">Task List</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newNote.folder_id} onValueChange={(value) => setNewNote({...newNote, folder_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map(folder => (
                          <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Descrizione progetto..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      rows={4}
                    />
                    <Button 
                      onClick={handleCreateNote} 
                      className="w-full"
                      disabled={!newNote.title || !newNote.content}
                    >
                      Crea Progetto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progetti Totali</p>
                  <p className="text-3xl font-bold text-gray-900">{notes.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progetti Codice</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {notes.filter(n => n.type === 'code').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Task Lists</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {notes.filter(n => n.type === 'list').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <List className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorie</p>
                  <p className="text-3xl font-bold text-gray-900">{folders.length}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedView === 'recent' ? (
          /* Recent Projects View */
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Progetti Recenti
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotes.map(note => (
                <Card 
                  key={note.id}
                  className={`cursor-pointer transition-all duration-200 ${getTypeColor(note.type)}`}
                  onClick={() => navigate(`/dashboard?note=${note.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(note.type)}
                        <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(note.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {note.content.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map(tag => (
                        <Badge 
                          key={tag.name}
                          variant="secondary" 
                          className={`text-xs ${tag.color} text-white`}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          /* All Projects by Category */
          <div className="space-y-8">
            {/* Projects by Folder */}
            {notesByFolder.map(folder => (
              folder.notes.length > 0 && (
                <section key={folder.id}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Folder className="w-5 h-5 mr-2" />
                      {folder.name}
                      <span className="ml-2 text-sm text-gray-500">({folder.notes.length})</span>
                    </h2>
                    <Button variant="outline" size="sm">
                      Visualizza tutti
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {folder.notes.map(note => (
                      <Card 
                        key={note.id}
                        className={`cursor-pointer transition-all duration-200 ${getTypeColor(note.type)}`}
                        onClick={() => navigate(`/dashboard?note=${note.id}`)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(note.type)}
                              <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(note.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {note.content.substring(0, 150)}...
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 3).map(tag => (
                              <Badge 
                                key={tag.name}
                                variant="secondary" 
                                className={`text-xs ${tag.color} text-white`}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            ))}

            {/* Unorganized Projects */}
            {unorganizedNotes.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Progetti non categorizzati
                    <span className="ml-2 text-sm text-gray-500">({unorganizedNotes.length})</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unorganizedNotes.map(note => (
                    <Card 
                      key={note.id}
                      className={`cursor-pointer transition-all duration-200 ${getTypeColor(note.type)}`}
                      onClick={() => navigate(`/dashboard?note=${note.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(note.type)}
                            <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(note.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {note.content.substring(0, 150)}...
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map(tag => (
                            <Badge 
                              key={tag.name}
                              variant="secondary" 
                              className={`text-xs ${tag.color} text-white`}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nessun progetto trovato' : 'Nessun progetto ancora'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Prova a modificare i termini di ricerca' 
                : 'Inizia creando il tuo primo progetto'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crea primo progetto
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;