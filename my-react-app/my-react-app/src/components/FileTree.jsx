import React, { useState, useEffect } from 'react';
import FolderItem from './FolderItem';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import '../App.css'; // Importation du fichier CSS

const FileTree = () => {
  const [structure, setStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');

  // Charger la structure depuis le localStorage
  useEffect(() => {
    const savedStructure = localStorage.getItem('fileStructure');
    if (savedStructure) {
      setStructure(JSON.parse(savedStructure));
    } else {
      // Structure par défaut si rien n'est trouvé dans le localStorage
      setStructure([
        {
          id: 1,
          name: 'Dossier 1',
          type: 'folder',
          children: [
            { id: 2, name: 'Fichier1.md', type: 'file', content: '' },
            { id: 3, name: 'Fichier2.md', type: 'file', content: '' },
          ],
        },
        { id: 4, name: 'Dossier 2', type: 'folder', children: [] },
      ]);
    }
  }, []);

  // Sauvegarder la structure dans le localStorage à chaque changement
  const saveToLocalStorage = (newStructure) => {
    localStorage.setItem('fileStructure', JSON.stringify(newStructure));
    setStructure(newStructure);
  };

  const addFolder = (parentId = null) => {
    const newFolder = {
      id: Date.now(),
      name: 'Nouveau dossier',
      type: 'folder',
      children: [],
    };
    const updatedStructure = addNode(structure, parentId, newFolder);
    saveToLocalStorage(updatedStructure);
  };

  const addFile = (parentId) => {
    const newFile = {
      id: Date.now(),
      name: 'Nouveau fichier.md',
      type: 'file',
      content: '',
    };
    const updatedStructure = addNode(structure, parentId, newFile);
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
      const updatedStructure = updateNodeContent(structure, selectedFile.id, editorContent);
      saveToLocalStorage(updatedStructure);
      setSelectedFile({ ...selectedFile, content: editorContent });
    }
  };

  const renameItem = (id, newName) => {
    const updatedStructure = renameNode(structure, id, newName);
    saveToLocalStorage(updatedStructure);
  };

  const deleteItem = (id) => {
    const updatedStructure = deleteNode(structure, id);
    saveToLocalStorage(updatedStructure);
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
  };

  const updateNodeContent = (nodes, id, newContent) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, content: newContent };
      }
      if (node.children) {
        return { ...node, children: updateNodeContent(node.children, id, newContent) };
      }
      return node;
    });
  };

  const renameNode = (nodes, id, newName) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, name: newName };
      }
      if (node.children) {
        return { ...node, children: renameNode(node.children, id, newName) };
      }
      return node;
    });
  };

  const deleteNode = (nodes, id) => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        if (node.children) {
          return { ...node, children: deleteNode(node.children, id) };
        }
        return node;
      });
  };

  const addNode = (nodes, parentId, newNode) => {
    if (parentId === null) {
      return [...nodes, newNode];
    }

    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }

      if (node.children) {
        return {
          ...node,
          children: addNode(node.children, parentId, newNode),
        };
      }

      return node;
    });
  };

  return (
    <div className="app-container">
      <div className="file-tree">
        <h3>Arborescence des fichiers</h3>
        {structure.map((item) => (
          <FolderItem
            key={item.id}
            item={item}
            addFolder={addFolder}
            addFile={addFile}
            selectFile={selectFile}
            renameItem={renameItem}
            deleteItem={deleteItem}
          />
        ))}
        <button onClick={() => addFolder(null)} className="icon-button">
          Ajouter un dossier
        </button>
      </div>
      <div className="editor-preview-container">
        {selectedFile ? (
          <>
            <MarkdownEditor
              content={editorContent}
              onContentChange={handleContentChange}
            />
            <button onClick={saveFile} className="icon-button">
              Sauvegarder
            </button>
            <MarkdownPreview content={editorContent} />
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
