import React from 'react';
import Showdown from 'showdown';
import { useLocation } from 'react-router-dom';
import '../App.css'; 

const MarkdownPreview = () => {
  const location = useLocation();
  const { content } = location.state || {};  // Safely destructure content

  const converter = new Showdown.Converter();
  const html = content ? converter.makeHtml(content) : '';
  console.log('Markdown content:', content);
  console.log('Converted HTML:', html);
  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownPreview;
