import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import '../App.css';
import { FaFolder, FaFileAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

const FileTree = () => {
  const [structure, setStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [itemToMove, setItemToMove] = useState(null);
  const [destinationFolder, setDestinationFolder] = useState(null);

  useEffect(() => {
    const savedStructure = localStorage.getItem('fileStructure');
    if (savedStructure) {
      setStructure(JSON.parse(savedStructure));
    } else {
      setStructure([
        { id: 1, name: 'Dossier 1', type: 'folder', parentId: null },
        { id: 2, name: 'Fichier1.md', type: 'file', content: '', parentId: 1 },
        { id: 3, name: 'Fichier2.md', type: 'file', content: '', parentId: 1 },
        { id: 4, name: 'Dossier 2', type: 'folder', parentId: null },
      ]);
    }
  }, []);

  const saveToLocalStorage = (newStructure) => {
    localStorage.setItem('fileStructure', JSON.stringify(newStructure));
    setStructure(newStructure);
  };

  const addFolder = (parentId = null) => {
    const newFolder = {
      id: Date.now(),
      name: 'Nouveau dossier',
      type: 'folder',
      parentId,
    };
    const updatedStructure = [...structure, newFolder];
    saveToLocalStorage(updatedStructure);
  };

  const addFile = (parentId) => {
    const newFile = {
      id: Date.now(),
      name: 'Nouveau fichier.md',
      type: 'file',
      content: '',
      parentId,
    };
    const updatedStructure = [...structure, newFile];
    saveToLocalStorage(updatedStructure);
  };

  const selectFile = (file) => {
    setSelectedFile(file);
    setEditorContent(file.content);
  };

  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
  };
  const saveFile = () => {
    if (selectedFile) {
      const updatedStructure = structure.map((item) =>
        item.id === selectedFile.id ? { ...item, content: editorContent } : item
      );
      saveToLocalStorage(updatedStructure);
      setSelectedFile({ ...selectedFile, content: editorContent });
    }
  };

  const renameItem = (id, newName) => {
    const updatedStructure = structure.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    saveToLocalStorage(updatedStructure);
  };

  const handleRename = (id) => {
    const newName = prompt("Entrez le nouveau nom:");
    if (newName) {
      renameItem(id, newName);
    }
  };

  const deleteItem = (id) => {
    const updatedStructure = structure.filter(item => item.id !== id);
    saveToLocalStorage(updatedStructure);
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
  };

  const moveItemInStructure = (items, itemId, newParentId) => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, parentId: newParentId };
      }
      return item;
    });
  };

  const moveItem = () => {
    if (!itemToMove || !destinationFolder || itemToMove.id === destinationFolder.id) {
      alert("Sélectionnez un élément valide et une destination valide.");
      return;
    }

    const updatedStructure = moveItemInStructure(structure, itemToMove.id, destinationFolder.id);

    saveToLocalStorage(updatedStructure);

    setItemToMove(null);
    setDestinationFolder(null);
  };

  const selectItemToMove = (item) => {
    setItemToMove(item);
  };

  const selectDestinationFolder = (folder) => {
    setDestinationFolder(folder);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, folder) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (item && folder) {
      selectItemToMove(item);
      selectDestinationFolder(folder);
      setTimeout(() => moveItem(), 0);
    }
  };

  const renderItems = (parentId) => {
    const items = structure.filter(item => item.parentId === parentId);
    return items.map(item => (
      <div key={item.id} className="file-tree-item" style={{ marginLeft: parentId ? '20px' : '0' }}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          className="file-tree-item-content"
          onClick={() => item.type === 'file' && selectFile(item)}
        >
          {item.type === 'folder' ? <FaFolder /> : <FaFileAlt />}
          <span>{item.name}</span>
          <button onClick={() => handleRename(item.id)} className="icon-button">
            <FaEdit />
          </button>
          <button onClick={() => deleteItem(item.id)} className="icon-button">
            <FaTrashAlt />
          </button>
          {item.type === 'folder' && (
            <>
              <button onClick={() => addFolder(item.id)} className="icon-button">
                <FaPlus /> Ajouter dossier
              </button>
              <button onClick={() => addFile(item.id)} className="icon-button">
                <FaPlus /> Ajouter fichier
              </button>
            </>
          )}
        </div>
        {item.type === 'folder' && (
          <div className="file-tree-children">
            {renderItems(item.id)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="app-container">
      <div className="file-tree">
        <h3>Arborescence des fichiers</h3>
        {renderItems(null)}
        <button onClick={() => addFolder(null)} className="icon-button">
          <FaPlus /> Ajouter un dossier
        </button>
        <button onClick={() => addFile(null)} className="icon-button">
          <FaPlus /> Ajouter un fichier
        </button>
      </div>
      <div className="editor-preview-container">
        {selectedFile ? (
          <>
            <MarkdownEditor
              content={editorContent}
              onContentChange={handleContentChange}
              onSave={saveFile}  // Pass the saveFile function as a prop
            />
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Sélectionnez un fichier pour l'éditer
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
