import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Configure axios
axios.defaults.timeout = 10000;

// API Service Class
class NotesAPI {
  // FOLDERS
  async getFolders() {
    const response = await axios.get(`${API_BASE}/folders`);
    return response.data;
  }

  async createFolder(name) {
    const response = await axios.post(`${API_BASE}/folders`, { name });
    return response.data;
  }

  async updateFolder(id, name) {
    const response = await axios.put(`${API_BASE}/folders/${id}`, { name });
    return response.data;
  }

  async deleteFolder(id) {
    const response = await axios.delete(`${API_BASE}/folders/${id}`);
    return response.data;
  }

  // TAGS
  async getTags() {
    const response = await axios.get(`${API_BASE}/tags`);
    return response.data;
  }

  async createTag(name, color) {
    const response = await axios.post(`${API_BASE}/tags`, { name, color });
    return response.data;
  }

  // NOTES
  async getNotes(filters = {}) {
    const response = await axios.get(`${API_BASE}/notes`, { params: filters });
    return response.data;
  }

  async getNote(id) {
    const response = await axios.get(`${API_BASE}/notes/${id}`);
    return response.data;
  }

  async createNote(noteData) {
    const response = await axios.post(`${API_BASE}/notes`, noteData);
    return response.data;
  }

  async updateNote(id, noteData) {
    const response = await axios.put(`${API_BASE}/notes/${id}`, noteData);
    return response.data;
  }

  async deleteNote(id) {
    const response = await axios.delete(`${API_BASE}/notes/${id}`);
    return response.data;
  }

  async getNoteHistory(id) {
    const response = await axios.get(`${API_BASE}/notes/${id}/history`);
    return response.data;
  }

  // HEALTH CHECK
  async healthCheck() {
    const response = await axios.get(`${API_BASE}/`);
    return response.data;
  }
}

// Error handling wrapper
const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || 'Errore del server';
    throw new Error(`${error.response.status}: ${message}`);
  } else if (error.request) {
    // Network error
    throw new Error('Errore di connessione al server');
  } else {
    // Other error
    throw new Error('Errore inaspettato');
  }
};

// Wrap all API methods with error handling
const notesAPI = new NotesAPI();
const apiMethods = Object.getOwnPropertyNames(NotesAPI.prototype)
  .filter(name => name !== 'constructor');

apiMethods.forEach(method => {
  const original = notesAPI[method];
  notesAPI[method] = async (...args) => {
    try {
      return await original.apply(notesAPI, args);
    } catch (error) {
      handleAPIError(error);
    }
  };
});

export default notesAPI;