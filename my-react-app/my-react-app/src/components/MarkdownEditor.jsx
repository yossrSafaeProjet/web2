import React from 'react';
import '../App.css'; // Import the CSS file

const MarkdownEditor = ({ content, onContentChange }) => {
  return (
    <textarea
      className="markdown-editor"
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      placeholder="Écrivez votre Markdown ici..."
    />
  );
};

export default MarkdownEditor;
