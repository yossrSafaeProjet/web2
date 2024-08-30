import React from 'react';
import Showdown from 'showdown';
import '../App.css'; // Import the CSS file

const MarkdownPreview = ({ content }) => {
  const converter = new Showdown.Converter();
  const html = converter.makeHtml(content);

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownPreview;
