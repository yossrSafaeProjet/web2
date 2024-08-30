import React, { useState } from 'react';
import { Button, ListGroup, ListGroupItem, Modal, FormCheck } from 'react-bootstrap';
import { FaFileExport, FaFileImport } from 'react-icons/fa';

const ExportEtImportBlocs = ({ blocks, setBlocks }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [file, setFile] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);

  const selectBlock = (blockId) => {
    setSelectedBlocks(prev =>
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    );
  };

  const exportBloc = () => {
    const blocksToExport = blocks.filter(block => selectedBlocks.includes(block.id));
    
    if (!blocksToExport.length) return alert('Sélectionnez au moins un bloc à exporter.');

    const blob = new Blob([blocksToExport.map(block => block.content).join('\n\n---\n\n')], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${blocksToExport[0].name
    }.part.mdlc`;
    link.click();
    window.URL.revokeObjectURL(link.href);

    setShowExportModal(false);
  };

  const exportAllBlocs = () => {
    const blocksToExport = blocks.filter(block => selectedBlocks.includes(block.id));

    if (!blocks.length) return alert('Aucun bloc à exporter.');

    const combinedContent = blocksToExport
      .map(block => `${block.content}\n\n---\n`)
      .join('');
    
    const blob = new Blob([combinedContent], { type: 'text' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `allBlocks.parts.mdlc`;
    link.click();
    window.URL.revokeObjectURL(link.href);

    setShowExportModal(false);
  };

  const handleFileChange = (e) => {
    Array.from(e.target.files).map(file=> setFile(file));


  };

  const importerBloc = () => {
    if (!file) return alert('Veuillez sélectionner un fichier à importer.');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      console.log(e.target)
    
      try {
        const importedBlock = {
            content: content,
            id: Date.now(),
            name: file.name.replace(/\.[^/.]+$/, "").replace(/\.[^/.]+$/, "")  
          }   ;   
          setBlocks(prevBlocks => {
            const updatedBlocks = [...prevBlocks, importedBlock];
            console.log(updatedBlocks)
            localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
            return updatedBlocks;
          });
          alert('Bloc importé avec succès.');
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier.');
      }
    };

    reader.readAsText(file);
    setFile(null);
    setShowImportModal(false);
  };

  return (
    <div>
      <Button onClick={() => setShowExportModal(true)} variant="primary" className="m-2">
        <FaFileExport /> Exporter
      </Button>
      <Button onClick={() =>{ setShowImportModal(true)}} variant="primary" className="m-2">
        <FaFileImport /> Importer
        <input
        type="file"
        accept=".part.mdlc"
        style={{ display: 'none' }}
        onChange={handleFileChange}
       
      />
      </Button>

      {/* Modal d'exportation */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exporter des Blocs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {blocks.map(block => (
              <ListGroupItem key={block.id}>
                <FormCheck
                  type="checkbox"
                  label={block.name}
                  onChange={() => selectBlock(block.id)}
                  checked={selectedBlocks.includes(block.id)}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={selectedBlocks.length<=1 ? exportBloc : exportAllBlocs}>
            Exporter
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Importer des Blocs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept=".part.mdlc,.parts.mdlc"
            onChange={handleFileChange}
            className="form-control"
            multiple
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={importerBloc}>
            Importer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExportEtImportBlocs;
