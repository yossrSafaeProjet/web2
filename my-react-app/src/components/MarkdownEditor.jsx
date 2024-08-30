import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
// Import the CSS file , onAddImage, onAddCustomBlock
const MarkdownEditor = ({ content,fileName, onContentChange, onSave }) => {
    const navigate = useNavigate(); // Initialize useNavigate

  const handleVisualize = () => {
    // Navigate to the preview page and pass the content as state
    navigate('/preview', { state: { content } });
  };
  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });  // Créer un fichier blob du contenu en Markdown
    const url = URL.createObjectURL(blob);  // Créer une URL temporaire pour le blob
    const a = document.createElement('a');
    a.href = url;
    a.download = {fileName};  // Nom par défaut du fichier
    a.click();  // Déclencher le téléchargement
    URL.revokeObjectURL(url);  // Nettoyer l'URL temporaire après le téléchargement
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
        {/* Bouton d'exportation du fichier */}
        <button className="export-button" onClick={handleExport}>
                    Exporter
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;