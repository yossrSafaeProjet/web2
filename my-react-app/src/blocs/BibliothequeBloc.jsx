import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Biblio.module.css';
import ExportEtImportBlocs from './ExportEtImportBlocs';

const BibliothequeBloc = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRaccourciModal, setShowRaccourciModal] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [blockName, setBlockName] = useState('');
  const [content, setContent] = useState('');
  const [blockToDelete, setBlockToDelete] = useState(null);
  const [blockRaccourci, setBlockRaccourci] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedBlocks = localStorage.getItem('blocks');
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    }
  }, []);
  useEffect(() => {
    const keyUp = (e) => {
      const keyPressed = `${e.ctrlKey ? 'ctrl+' : ''}${e.key}`;
      if(selectedBlocks.shortcut === keyPressed){
        e.preventDefault(); 
        insertBlockIntoFile(selectedBlocks[0]);
      }
    };

    document.addEventListener('keyup', keyUp);

    return () => {
      document.removeEventListener('keyup', keyUp);
    };
  }, [selectedBlocks]);

  const insertBlockIntoFile = (block) => {
    const fichiers = JSON.parse(localStorage.getItem('fichiersMarkdown')) || [];
    const fichierCible = fichiers[0];
  
    if (fichierCible) {
      fichierCible.content += `\n${block.content}\n`;

      fichiers[0] = fichierCible;
      localStorage.setItem('fichiersMarkdown', JSON.stringify(fichiers));
      alert(`Bloc "${block.name}" inséré avec succès !`);
    } else {
      alert("Aucun fichier cible trouvé pour l'insertion.");
    }
  };
  const sauvegarderBlock = () => {
    while(!blockName.trim() && !content.trim()) 
      return alert("Un nom et un contenu est obligatoire pour enregistrer un bloc !");

    const newBlock = { id: currentBlock ? currentBlock.id : Date.now(), name: blockName, content };
    const updatedBlocks = currentBlock
      ? blocks.map(block => (block.id === currentBlock.id ? newBlock : block))
      : [...blocks, newBlock];

    setBlocks(updatedBlocks);
    if(blocks){
    localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    alert("Bloc modifié avec succés");
    setContent('');
    setBlockName('');
    setCurrentBlock(null);
    setShowModal(false);
  }else{
    alert("Un problème est survenu lors de la modification du bloc")
  }
  };
  const editBlock = (block) => {
    setCurrentBlock(block);
    setBlockName(block.name);
    setContent(block.content);
    setShowModal(true);
  };

  const deleteBlock = (id) => {
    setBlockToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    const updatedBlocks = blocks.filter(block => block.id !== blockToDelete);
    setBlocks(updatedBlocks);
    localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setBlockToDelete(null);
    setShowConfirmModal(false);
  };

  const selectBlock = (blockId) => {
    setSelectedBlocks(prev =>
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    );
  };

  const ajoutRaccourci = () => {
    const selectedBlocksList = selectedBlocks.map(id => blocks.find(block => block.id === id));
    const stateData = {
      allBlocks: blocks, 
      selectedBlocks: selectedBlocksList
    };
    console.log(selectedBlocksList)
    navigate('/r', { state: stateData });
  };
  

  const voirRaccourci = (block) => {
    setBlockRaccourci(block.shortcut || 'Aucun raccourci défini');
    setShowRaccourciModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className={styles.title}>Bibliothèque des Blocs Personnalisés</h2>
      <Button onClick={() => navigate('/ajouter')} variant="success" className="mb-3">
        <FaPlus /> Ajouter un Bloc
      </Button>
      <div></div>
      <Button
        onClick={ajoutRaccourci}
        variant="success"
        className="mb-3"
        /* disabled={selectedBlocks.size === 0} */
      >
        Ajouter un Raccourci
      </Button>
      <ExportEtImportBlocs blocks={blocks} setBlocks={setBlocks}/>

      <div className={styles.cardContainer}>
        {blocks.map((block) => (
          <Card key={block.id} className={`${styles.card} mb-3`}>
            <div className={styles.cardBody}>
              <Card.Header className={styles.cardTitle}>
                <InputGroup>
                  <InputGroup.Text >
                    <input
                      type="checkbox"
                      checked={(selectedBlocks.id)}
                      onChange={() => selectBlock(block.id)}
                    />
                  </InputGroup.Text >
                 {block.name}
                </InputGroup>
              </Card.Header>
              <Card.Body>
                <ReactMarkdown>{block.content}</ReactMarkdown>
              </Card.Body>

              <div className={styles.cardFooter}>
                <Button variant="info" onClick={() => editBlock(block)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => deleteBlock(block.id)}>
                  <FaTrash />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => voirRaccourci(block)}
                  className="ms-2"
                >
                  <FaEye />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentBlock ? 'Éditer le Bloc' : 'Ajouter un Bloc'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Nom du Bloc"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <FormControl
              as="textarea"
              placeholder="Contenu du Bloc"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={sauvegarderBlock}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce bloc ?
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

      <Modal show={showRaccourciModal} onHide={() => setShowRaccourciModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Raccourci du Bloc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{blockRaccourci}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRaccourciModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BibliothequeBloc;
