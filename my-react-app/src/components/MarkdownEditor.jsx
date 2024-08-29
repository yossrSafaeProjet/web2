import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
// Import the CSS file , onAddImage, onAddCustomBlock
const MarkdownEditor = ({ content, onContentChange, onSave }) => {
    const navigate = useNavigate(); // Initialize useNavigate

  const handleVisualize = () => {
    // Navigate to the preview page and pass the content as state
    navigate('/preview', { state: { content } });
  };
  return (
    <div className="markdown-editor-container">
      <textarea
        className="markdown-editor"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Écrivez votre Markdown ici..."
      />
      <div className="editor-buttons">
        <button className="save-button" onClick={onSave}>
          Sauvegarder
        </button>
        <button className="add-image-button" onClick={""}>
          Ajouter Image
        </button>
        <button className="add-block-button" onClick={""}>
          Ajouter Bloc Personnalisé
        </button>
        <button className="visualize-button" onClick={handleVisualize}>
          Visualiser
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;