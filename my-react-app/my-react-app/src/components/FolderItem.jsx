import React from 'react';
import FileItem from './FileItem';
import { FaFolderOpen, FaPlus, FaFile, FaEdit, FaTrash } from 'react-icons/fa'; // Assurez-vous que toutes les icônes sont importées
import styled from 'styled-components';

const FolderContainer = styled.div`
  margin-left: 20px;
  font-size: 14px;
`;

const FolderHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
`;

const IconButton = styled.div`
  color: #d4d4d4;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #007acc;
  }
`;

const FolderItem = ({ item, addFolder, addFile, selectFile, renameItem, deleteItem }) => {
  const handleAddFolder = () => {
    addFolder(item.id);
  };

  const handleAddFile = () => {
    addFile(item.id);
  };

  const handleRename = () => {
    const newName = prompt('Entrez le nouveau nom :', item.name);
    if (newName && newName.trim()) {
      renameItem(item.id, newName);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${item.name}" ?`)) {
      deleteItem(item.id);
    }
  };

  return (
    <FolderContainer>
      <FolderHeader>
        <FaFolderOpen style={{ marginRight: '8px' }} />
        <span>{item.name}</span>
        <IconButton onClick={handleAddFolder}>
          <FaPlus title="Ajouter un dossier" />
        </IconButton>
        <IconButton onClick={handleAddFile}>
          <FaFile title="Ajouter un fichier" />
        </IconButton>
        <IconButton onClick={handleRename}>
          <FaEdit title="Renommer" />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <FaTrash title="Supprimer" />
        </IconButton>
      </FolderHeader>
      {item.children && item.children.map((child) => (
        <div key={child.id} style={{ marginLeft: '20px' }}>
          {child.type === 'folder' ? (
            <FolderItem
              item={child}
              addFolder={addFolder}
              addFile={addFile}
              selectFile={selectFile}
              renameItem={renameItem}
              deleteItem={deleteItem}
            />
          ) : (
            <FileItem
              item={child}
              deleteNode={deleteItem}
              updateNodeName={renameItem}
              selectFile={selectFile}
            />
          )}
        </div>
      ))}
    </FolderContainer>
  );
};

export default FolderItem;
