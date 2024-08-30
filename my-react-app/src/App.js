import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileTree from './components/FileTree';
import MarkdownPreview from './components/MarkdownPreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileTree />} />
        <Route path="/preview" element={<MarkdownPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
