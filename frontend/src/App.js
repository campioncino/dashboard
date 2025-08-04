import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotesApp from "./components/NotesApp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NotesApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;