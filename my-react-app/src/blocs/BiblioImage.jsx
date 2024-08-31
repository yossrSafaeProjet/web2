import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/Biblio.module.css';
import ExportEtImportBlocs from './ExportEtImportBlocs';
import GlisserImage from './GilsserImage'; 
import modalStyle from '../css/Modal.module.css';
import ContextImage from '../Contexte/ContextImage'
const BiblioImg = () => {
  const [images, setImages] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [imageName, setImageName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
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
    setImageToDelete(null);
  };

  const cancelDelete = () => {
    setImageToDelete(null);
    setShowConfirmModal(false);
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
    if (location.state && location.state.returnToEditor) {
      navigate('/', { state: { imageToInsert: `![${image.name}](${image.content})` } });
      
    } else {
      navigate('/');
    }
  };
    
  
  return (
    <div className="container mt-4">
      <h2 className={styles.title}>Bibliothèque des Images</h2>
      <ContextImage.Provider value={{images,setImages}}>
      <ExportEtImportBlocs />
      </ContextImage.Provider>
      <div className={styles.cardContainer}>
        {images.map((img) => (
          <Card key={img.id} className={`${styles.card} mb-3`}>
            <Card.Header className={styles.cardTitle}>
              <InputGroup>
                  <Button
                    variant="info"
                    onClick={() => {
                      setCurrentImage(img);
                      setImageName(img.name);
                      setShowModal(true);
                    }}
                    className="me-2 edi"
                  >
                    <FaEdit />
                  </Button>
                {img.name}
              </InputGroup>
            </Card.Header>
            <Card.Body>
              <img
                src={
                  img.content.startsWith("data:image/") 
                    ? img.content
                    : `data:image/jpeg;base64,${img.content.split(';')[0].split(',')[1]}`
                }
                alt={img.name}
                className={styles.image}
              />
            </Card.Body>
            <Card.Footer className={styles.cardFooter}>
              <Button variant="danger" onClick={() => deleteImage(img.id)}>
                <FaTrash />
              </Button>
            </Card.Footer>
          </Card>
        ))}

        <Card className={`${styles.card} mb-3`}>
          <Card.Header className={styles.cardTitle}>Ajouter des Images</Card.Header>
          <Card.Body>
            <GlisserImage images={images} setImages={setImages} />
          </Card.Body>
          <Card.Footer className={styles.cardFooter}>
            <small className="text-muted">Glissez et déposez vos images ici</small>
          </Card.Footer>
        </Card>
      </div>

      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title className={modalStyle.title}>Confirmation de Suppression</Modal.Title>
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
