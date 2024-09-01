import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const MarkdownEditor = ({ content, fileName, onContentChange, onSave, selectedFile }) => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const imageToInsert = location.state?.imageToInsert;
  
      console.log('Image to Insert:', imageToInsert);
  
      if (imageToInsert) {
        const updatedContent = content.trim() + `\n![${imageToInsert.trim()}](${imageToInsert.trim()})\n`;
        console.log('Updated Content for File:', updatedContent);
        onContentChange(updatedContent);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location.state, content, onContentChange, navigate]);
  
    const handleAddImage = () => {
      console.log('Navigating to image page');
      navigate('/img', {
        state: { 
          returnToEditor: true, 
          selectedFileId: selectedFile?.id,
        }
      });
    };
  
    const handleVisualize = () => {
      console.log('Navigating to preview page');
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
