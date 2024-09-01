import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Biblio.module.css';
import ExportEtImportBlocs from './ExportEtImportBlocs';

const BiblioImg = () => {
  const [images, setImages] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [imageName, setImageName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  // Ajout de useLocation pour gérer 'location'

  useEffect(() => {
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  const deleteImage = (id) => {
    setImageToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    const updatedImages = images.filter(img => img.id !== imageToDelete);
    setImages(updatedImages);
    localStorage.setItem('images', JSON.stringify(updatedImages));
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setImageToDelete(null);
    setShowConfirmModal(false);
  };

  const insererImage = (img) => {
    navigate('/', { state: { imageToAdd: img.content } });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImages = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;

        newImages.push({
          id: Date.now() + Math.random(),
          name: file.name,
          content: content // Base64 URL of the image
        });
        if (newImages.length === files.length) {
          setImages(prevImages => [...prevImages, ...newImages]);
          localStorage.setItem('images', JSON.stringify([...images, ...newImages]));
          setShowImportModal(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const renommerImage = () => {    
    const updatedImages = images.map(image =>
      image.id === currentImage.id
        ? { ...image, name: imageName }
        : image
    );
    
    setImages(updatedImages);
    localStorage.setItem('images', JSON.stringify(updatedImages));
    alert("Nom d'image modifié avec succès");
    setShowModal(false);
    setCurrentImage(null);
    setImageName('');
  };

  const handleInjectImage = (image) => {
    const updatedContent = `![${image.name}](${image.content})`;
  
    console.log('Injecting Image:', image);
    console.log('Updated Content:', updatedContent);
  
    if (location.state?.returnToEditor) {
      console.log('Navigating back to editor with image data');
      navigate('/', {
        state: {
          imageToInsert: updatedContent,
          selectedFileId: location.state.selectedFileId,
        }
      });
    } else {
      console.log('Navigating to main with updated file content');
      navigate('/', {
        state: {
          selectedFile: {
            ...location.state.selectedFile,
            content: location.state.selectedFile?.content + updatedContent
          },
        },
      });
    }
  };
  
  
  
  
  
  return (
    <div className="container mt-4">
      <h2 className={styles.title}>Bibliothèque des Images</h2>
      
      <ExportEtImportBlocs images={images} setImages={setImages} />

      <div className={styles.cardContainer}>
        {images.map((img) => (
          <Card key={img.id} className={`${styles.card} mb-3`}>
            <div className={styles.cardBody}>
              <Card.Header className={styles.cardTitle}>
                <InputGroup>
                  <InputGroup.Text>
                    <div className={styles.cardFooter}>
                      <Button
                        variant="info"
                        onClick={() => {
                          setCurrentImage(img);
                          setImageName(img.name);
                          setShowModal(true);
                        }}
                        className="me-2"
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  </InputGroup.Text>
                  {img.name}
                </InputGroup>
              </Card.Header>
              <Card.Body>
                <img
                  src={img.content}
                  alt={img.name}
                  className={styles.image}
                />
              </Card.Body>

              <div className={styles.cardFooter}>
                <Button variant="danger" onClick={() => deleteImage(img.id)}>
                  <FaTrash />
                </Button>
                <button onClick={() => handleInjectImage(img)}>Injecter</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette image ?
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={cancelDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Éditer le nom de l'image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Nom de l'image"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={renommerImage}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BiblioImg;
