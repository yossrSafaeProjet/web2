
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileTree from './components/FileTree';
import MarkdownPreview from './components/MarkdownPreview';
import MarkdownEditor from './components/MarkdownEditor';


// src/App.jsx
import React from 'react';

import BibliothequeBloc from './blocs/BibliothequeBloc';
import BlocPersonlise from './blocs/BlocPersonlise';
import RaccourciClavier from './blocs/RaccourciClavier';
import BiblioImg from './blocs/BiblioImage';
function App() {
  return (
    <Router>

      <Routes>
      <Route path="/" element={<FileTree />} />
      <Route path="/preview" element={<MarkdownPreview />} />
      <Route path="/biblio" element={<BibliothequeBloc />} />
      <Route path="/img" element={<BiblioImg />} />
      <Route path="/ajouter" element={<BlocPersonlise />} />
      <Route path="/" element={<FileTree />} />
      <Route path="/r" element={<RaccourciClavier blocks={[1,"aa","aa"]}/>} />
    </Routes>
  </Router>
  );
}

export default App;
