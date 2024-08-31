
import React from 'react';
import Showdown from 'showdown';
import { useLocation } from 'react-router-dom';
import '../App.css'; 

const MarkdownPreview = () => {
  const location = useLocation();
  const { content } = location.state || {};  

  const converter = new Showdown.Converter();
  let html = content ? converter.makeHtml(content) : '';

  
  html = html.replace(/<img /g, '<img class="image-preview" ');

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownPreview;
