import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const MarkdownEditor = ({ content, fileName, onContentChange, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const imageToInsert = location.state?.imageToInsert;

  useEffect(() => {
    if (imageToInsert) {
      const cleanImageSyntax = `(${imageToInsert.trim()})\n\n`;
      onContentChange(content.trim() + cleanImageSyntax);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [imageToInsert, content, onContentChange, navigate, location.pathname]);

  const handleAddImage = () => {
    navigate('/biblioImage', { state: { returnToEditor: true } });
  };

  const handleVisualize = () => {
    navigate('/preview', { state: { content } });
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
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
        <button className="add-image-button" onClick={handleAddImage}>
          Ajouter Image
        </button>
        <button className="visualize-button" onClick={handleVisualize}>
          Visualiser
        </button>
        <button className="export-button" onClick={handleExport}>
          Exporter
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
