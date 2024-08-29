// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import BibliothequeBloc from './blocs/BibliothequeBloc';
import BlocPersonlise from './blocs/BlocPersonlise';
import RaccourciClavier from './blocs/RaccourciClavier';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<BibliothequeBloc />} />
      <Route path="/ajouter" element={<BlocPersonlise />} />
      <Route path="/r" element={<RaccourciClavier blocks={[1,"aa","aa"]}/>} />
    </Routes>
  </Router>
  );
}

export default App;
