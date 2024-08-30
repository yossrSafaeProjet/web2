import React, { useState } from 'react';
import { FaFile, FaEdit, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

const FileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 40px;
  font-size: 14px;
  margin-bottom: 5px;
`;

const FileName = styled.span`
  margin-right: 10px;
  cursor: pointer;
  flex-grow: 1;
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

const FileItem = ({ item, deleteNode, updateNodeName, selectFile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (newName.trim() === '') {
      alert('Le nom ne peut pas être vide.');
      return;
    }
    updateNodeName(item.id, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(item.name); // Revert to original name
  };

  const handleDelete = () => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${item.name}" ?`)) {
      deleteNode(item.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <FileContainer>
      <FaFile onClick={() => selectFile(item)} style={{ marginRight: '8px', cursor: 'pointer' }} />
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ marginRight: '8px' }}
        />
      ) : (
        <FileName onClick={() => selectFile(item)}>{item.name}</FileName>
      )}
      {!isEditing && (
        <>
          <IconButton onClick={handleEdit}>
            <FaEdit />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <FaTrash />
          </IconButton>
        </>
      )}
    </FileContainer>
  );
};

export default FileItem;
