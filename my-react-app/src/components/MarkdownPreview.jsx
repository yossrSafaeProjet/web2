// MarkdownPreview.jsx
import React from 'react';
import Showdown from 'showdown';
import { useLocation } from 'react-router-dom';
import '../App.css'; // Assurez-vous que le fichier CSS est importé

const MarkdownPreview = () => {
  const location = useLocation();
  const { content } = location.state || {};  // Safely destructure content

  const converter = new Showdown.Converter();
  let html = content ? converter.makeHtml(content) : '';

  // Ajouter une classe CSS à toutes les images
  html = html.replace(/<img /g, '<img class="image-preview" ');

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownPreview;
