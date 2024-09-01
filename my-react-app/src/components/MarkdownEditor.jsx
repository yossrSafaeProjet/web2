import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button} from 'react-bootstrap';

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
      navigate('/biblioImage', {
        state: { 
          returnToEditor: true, 
          selectedFileId: selectedFile?.id,
        }
      });
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
      const handleAddBloc= () => {

        navigate('/biblioBloc');}
    
    return (
      <div className="markdown-editor-container">
        <textarea
          className="markdown-editor"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Écrivez votre Markdown ici..."
        />
        <div className="editor-buttons">
          <Button  onClick={onSave} className="m-2">
            Sauvegarder
          </Button>
          <Button  variant="success" className="m-2" onClick={handleAddImage}>
            Ajouter Image
          </Button>
          <Button variant="success" className="m-2" onClick={handleAddBloc}>
            Ajouter Bloc
          </Button>
          <Button variant="success" className="m-2" onClick={handleVisualize}>
            Visualiser
          </Button>
          <Button className="m-2" onClick={handleExport}>
            Exporter
          </Button>
        </div>
      </div>
    );
  };
  
  
export default MarkdownEditor;