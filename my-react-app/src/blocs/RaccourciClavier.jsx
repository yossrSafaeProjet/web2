import React, { useState} from 'react';
import { Button, InputGroup, FormControl, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RaccourciClavier = () => {
  const { state } = useLocation();
  const [shortcuts, setShortcuts] = useState(state?.selectedBlocks || []);
  const [blocks, setBlocks] = useState(state?.allBlocks || []);
  const [shortcutKey, setShortcutKey] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showModal, setShowModal] = useState(false);



  const handleSaveShortcut = () => {
    if (!shortcutKey.trim() || !selectedBlock) return;
  
    const updatedShortcuts = shortcuts.map(block =>
      block.id === selectedBlock.id ? { ...block, shortcut: shortcutKey } : block
    );
    const updatedBlocks = blocks.map(block =>
      updatedShortcuts.find(updatedBlock => updatedBlock.id === block.id) || block
    );

    localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    setBlocks(updatedBlocks);
    setShortcuts(updatedShortcuts);
    setSelectedBlock(null);
    setShortcutKey('');
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Raccourci Clavier</h2>
      <ListGroup>
        {shortcuts.map((block) => (
          <ListGroupItem key={block.id}>
            <div className="d-flex justify-content-between align-items-center">
              <span>{block.name}</span>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedBlock(block);
                  setShowModal(true);
                }}
              >
                Définir Raccourci
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Définir Raccourci</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Appuyez sur la touche de raccourci"
              value={shortcutKey}
              onChange={(e) => setShortcutKey(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveShortcut}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RaccourciClavier;
/* Ici j'ai utilisé chat gpt  */