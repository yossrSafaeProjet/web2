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
  color: #007bff;
  cursor: pointer;
  margin: 0 5px;
  &:hover {
    color: #0056b3;
  }
`;

const FolderItem = ({ item, addFolder, addFile, selectFile, renameItem, deleteItem, onDragStart, onDragOver, onDrop }) => {
  const handleDragStart = (e) => {
    onDragStart(e, item);
  };

  const handleDrop = (e) => {
    onDrop(e, item);
  };

  return (
    <FolderContainer
      draggable
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <FolderHeader>
        <FaFolderOpen style={{ marginRight: '8px' }} />
        <span>{item.name}</span>
        <IconButton onClick={() => addFolder(item.id)}>
          <FaPlus />
        </IconButton>
        <IconButton onClick={() => addFile(item.id)}>
          <FaFile />
        </IconButton>
        <IconButton onClick={() => renameItem(item.id, prompt('Nouveau nom :'))}>
          <FaEdit />
        </IconButton>
        <IconButton onClick={() => deleteItem(item.id)}>
          <FaTrash />
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
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
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
