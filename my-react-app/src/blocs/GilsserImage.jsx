import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import styles from '../css/Glisser.module.css'; 

const GlisserImage = ({ setImages }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [currentFile, setCurrentFile] = useState(null); 

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCurrentFile(file); 
      convertToBase64(file);
    } else {
      alert('Veuillez déposer un fichier image.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; 
      setImageSrc(`data:${file.type};base64,${base64String}`);
    };
    reader.readAsDataURL(file); 
  };

  const ajouterImage = () => {
    if (!currentFile) return alert('Veuillez déposer un fichier image.');

    try {
      const importedImage = {
        content: imageSrc,
        id: Date.now(),
        name: currentFile.name.replace(/\.[^/.]+$/, "")
      };

      setImages((prevData) => {
        const updatedData = [...prevData, importedImage];
        localStorage.setItem('images', JSON.stringify(updatedData));
        return updatedData;
      });

      alert('Image importée avec succès.');
    } catch (error) {
      alert('Erreur lors de l\'importation du fichier.');
    }


    setImageSrc(null);
    setCurrentFile(null);
  };

  return (
    <div
      className={styles.dropZone}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imageSrc ? (
        <img src={imageSrc} alt="Uploaded" className={styles.imagePreview} />
      ) : (
        <span className={styles.placeholderText}>Glissez-déposez une image ici</span>
      )}
      <div className={styles.buttonContainer}>
        <Button onClick={ajouterImage} variant="success">
          <FaPlus /> Ajouter Une image
        </Button>
      </div>
    </div>
  );
};

export default GlisserImage;
