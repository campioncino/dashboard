import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotesApp from "./components/NotesApp";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NotesApp />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;