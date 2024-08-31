import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import {FaArrowLeft} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/BlocPersonalise.module.css';
import modalStyle from '../css/Modal.module.css';
import { useNavigate } from 'react-router-dom';
const BlocPersonlise = () => {
  const [content, setContent] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [blockName, setBlockName] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const savedBlocks = localStorage.getItem('blocks');
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    }
  }, []);

  const saveBlock = () => {
    if (!blockName.trim()){
      return alert('Attention Donner un nom au bloc ')
    }
    const newBlock = { id: Date.now(), name: blockName, content };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    if(blocks){
    localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    alert("Bloc personalisé enregistré avec succés")
    setContent('');
    setBlockName('');
    setShowModal(false);
  }else{
    alert("OPS! un probléme est survenu !")
  }
}
  const retourner=()=>{
    navigate('/biblioBloc'); 
  }
  
  return (
    <div className={`container mt-4 ${styles['container-background']} ${styles['mt-4']}`}>
      <Button variant="success" onClick={retourner}><FaArrowLeft/>Retour</Button>
      <h2 className={styles.title}>Créer un Bloc Personnalisé</h2>
      <InputGroup className="mb-3">
        <FormControl
          as="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire du HTML ou Markdown ici..."
          rows={10}
        />
      </InputGroup>
      <Button onClick={() => setShowModal(true)} variant="primary">Sauvegarder le Bloc</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className={modalStyle.titleModal}>Nommer le Bloc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Entrez le nom du bloc"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={saveBlock}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlocPersonlise ;
