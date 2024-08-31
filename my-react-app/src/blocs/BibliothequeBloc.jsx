import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, InputGroup, FormControl, FormCheck, ListGroupItem, ListGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/Biblio.module.css';
import ExportEtImportBlocs from './ExportEtImportBlocs';
import modalStyle from '../css/Modal.module.css';
import ContextBloc from '../Contexte/ContexteBloc';

const BibliothequeBloc = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRaccourciModal, setShowRaccourciModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [blockName, setBlockName] = useState('');
  const [content, setContent] = useState('');
  const [blockToDelete, setBlockToDelete] = useState(null);
  const [blockRaccourci, setBlockRaccourci] = useState('');
  const [file, setFile] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedBlocks = localStorage.getItem('blocks');
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    }
    const savedFiles = localStorage.getItem('fileStructure');
    if (savedFiles) {
      setFile(JSON.parse(savedFiles));
    }
  }, []);
  
  useEffect(() => {
    const selectedBlocksList = selectedBlocks.map(id => blocks.find(block => block.id === id));
    
    const keyUp = (e) => {
      const keyPressed = `${e.ctrlKey ? 'ctrl+' : ''}${e.key}`;
      const shortcuts = selectedBlocksList.map(block => block.shortcut || '');
      
      if (shortcuts.includes(keyPressed)) {
        e.preventDefault();
        console.log("cssssc",selectedFile)
        insertBlockIntoFile(selectedBlocksList.find(block => block.shortcut === keyPressed));
      }
    };

    document.addEventListener('keyup', keyUp);

    return () => {
      document.removeEventListener('keyup', keyUp);
    };
  }, [selectedBlocks, blocks,selectedFile]);

  const insertBlockIntoFile = (block) => {
    const fichiers = JSON.parse(localStorage.getItem('fileStructure')) || [];
    console.log("cc",selectedFile)
    const fichiersCibles = fichiers.filter(fichier =>selectedFile.includes(fichier.id));
    
    console.log(fichiersCibles);
    
    if (fichiersCibles.length > 0) {
      fichiersCibles.forEach(fichier => {
        fichier.content += `\n${block.content}\n`;
      });
  
      localStorage.setItem('fileStructure', JSON.stringify(fichiers));
      alert(`Bloc "${block.name}" inséré avec succès dans les fichiers sélectionnés !`);
    } else {
      alert("Aucun fichier cible trouvé pour l'insertion.");
    }
  };

  const selectFile = (file) => {
   console.log("ff",file)
    setSelectedFile((prev) =>
    { const a = prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
      console.log(a);
      return a; 
  });
  }; 


  const sauvegarderBlock = () => {
    if (!blockName.trim() || !content.trim()) {
      return alert("Un nom et un contenu sont obligatoires pour enregistrer un bloc !");
    }

    const newBlock = { id: currentBlock ? currentBlock.id : Date.now(), name: blockName, content };
    const updatedBlocks = currentBlock
      ? blocks.map(block => (block.id === currentBlock.id ? newBlock : block))
      : [...blocks, newBlock];

    setBlocks(updatedBlocks);
    localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    alert("Bloc sauvegardé avec succès");
    setContent('');
    setBlockName('');
    setCurrentBlock(null);
    setShowModal(false);
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

  const choisirFile = () => {
    setShowFileModal(true);
  };

  const ajoutRaccourci = () => {
    const selectedBlocksList = selectedBlocks.map(id => blocks.find(block => block.id === id));
    navigate('/raccourci', { state: { allBlocks: blocks, selectedBlocks: selectedBlocksList } });
  };

  const voirRaccourci = (block) => {
    setBlockRaccourci(block.shortcut || 'Aucun raccourci défini');
    setShowRaccourciModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className={styles.title}>Bibliothèque des Blocs Personnalisés</h2>
      <Button onClick={() => navigate('/ajouterBloc')} variant="success" className="mb-3 me-2">
        <FaPlus /> Ajouter un Bloc
      </Button>
    
      <Button
        onClick={ajoutRaccourci}
        variant="success"
        className="mb-3"
        disabled={selectedBlocks.length === 0}
      >
        Ajouter un Raccourci
      </Button>
      <ContextBloc.Provider value={{blocks,setBlocks}}>
      <ExportEtImportBlocs />
</ContextBloc.Provider>
      <div className={styles.cardContainer}>
        {blocks.map((block) => (
          <Card key={block.id} className={`${styles.card} mb-3`}>
            <div className={styles.cardBody}>
              <Card.Header className={styles.cardTitle}>
                <InputGroup>
                  <InputGroup.Text>
                    <input
                      type="checkbox"
                      checked={selectedBlocks.includes(block.id)}
                      onChange={() => selectBlock(block.id)}
                    />
                  </InputGroup.Text>
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
                  className="ms-2 "
                >
                  <FaEye />
                </Button>
                <Button variant="primary" onClick={choisirFile} className='ms-2'>
                  Choisir Fichier
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

    
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className={modalStyle.titleModal}>{currentBlock ? 'Éditer le Bloc' : 'Ajouter un Bloc'}</Modal.Title>
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
          <Modal.Title className={modalStyle.titleModal}>Confirmation de Suppression</Modal.Title>
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

      {/* Modal pour voir le raccourci du bloc */}
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

      <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choisir un fichier pour insérer le bloc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {file.filter(f => f.name.includes('.md')).map((f) => (
              <ListGroupItem key={f.id}>
                <FormCheck
                  type="checkbox"
                  label={f.name}
                  onChange={() => selectFile(f) }
                
                  checked={selectedFile.includes(f.id)}
                
                />
              </ListGroupItem>
              
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFileModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BibliothequeBloc;
