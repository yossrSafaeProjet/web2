import React, { useState, useEffect } from 'react';
import FileTree from './components/FileTree';

const LOCAL_STORAGE_KEY = 'markdownFiles';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedFiles) {
      setFiles(storedFiles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSave = (content) => {
    const updatedFiles = files.map(file =>
      file.id === selectedFile.id ? { ...file, content } : file
    );
    setFiles(updatedFiles);
    setSelectedFile({ ...selectedFile, content });
  };

  const createNewFile = () => {
    const newFile = {
      id: Date.now(),
      name: `Nouveau_Fichier_${Date.now()}.md`,
      content: ''
    };
    setFiles([...files, newFile]);
    setSelectedFile(newFile);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '100%' }}>
        <button onClick={createNewFile}>Créer un Nouveau Fichier</button>
        <FileTree files={files} onFileSelect={handleFileSelect} />
      </div>
    </div>
  );
}

export default App;
