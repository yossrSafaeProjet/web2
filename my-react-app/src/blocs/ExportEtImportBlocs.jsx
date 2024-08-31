import React, { useState, useContext } from 'react';
import { Button, ListGroup, ListGroupItem, Modal, FormCheck } from 'react-bootstrap';
import { FaFileExport, FaFileImport } from 'react-icons/fa';
import modalStyle from '../css/Modal.module.css';
import ContextBloc from '../Contexte/ContexteBloc';
import contexteImage from '../Contexte/ContextImage';

const ExportEtImportBlocs = () => {
  const contextBloc = useContext(ContextBloc);
  const contextImage = useContext(contexteImage);

  const blocks = contextBloc?.blocks;
  const setBlocks = contextBloc?.setBlocks;
  const images = contextImage?.images;
  const setImages = contextImage?.setImages;

  const isBlocks = blocks && setBlocks;
  let data = isBlocks ? blocks : images;
  let setData = isBlocks ? setBlocks : setImages;

  const [selectedItems, setSelectedItems] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [file, setFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isButton, setIsButton] = useState('');

  const selectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const exportBloc = () => {
    if (!data || !setData) return;

    const blocksToExport = data.filter((data) => selectedItems.includes(data.id));

    if (!blocksToExport.length) return alert(`Sélectionnez au moins ${isBlocks ? ' un bloc' : ' une image'} à exporter.`);

    const blob = new Blob([blocksToExport.map((data) => data.content).join('\n\n---\n\n')], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = isBlocks ? `${blocksToExport[0].name}.part.mdlc` : `${blocksToExport[0].name}.img.mdlc`;

    link.click();
    window.URL.revokeObjectURL(link.href);

    setShowExportModal(false);
  };

  const exportAllBlocs = () => {
    if (!data || !setData) return;

    const combinedContent = data.map((block) => `${block.content}\n\n---\n`).join('');
    if (!combinedContent.length) return alert(`Aucun ${isBlocks ? 'bloc' : 'image'} à exporter.`);

    const blob = new Blob([combinedContent], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = isBlocks ? `allBlocks.parts.mdlc` : `allImages.imgs.mdlc`;
    link.click();
    window.URL.revokeObjectURL(link.href);

    setShowExportModal(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const importerBloc = () => {
    if (!file) return alert('Veuillez sélectionner un fichier à importer.');
    if (!setData) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result;
      console.log(e.target)
      if(content.startsWith('data:application/octet-stream')){
        content = content.replace('data:application/octet-stream', 'data:image/png');
      }

      try {
        const importedItem = {
          content: content,
          id: Date.now(),
          name: file.name.replace(/\.[^/.]+$/, "").replace(/\.[^/.]+$/, "")
        };

        setData((prevData) => {
          const updatedData = [...prevData, importedItem];
          localStorage.setItem(isBlocks ? 'blocks' : 'images', JSON.stringify(updatedData));
          return updatedData;
        });

        alert('Bloc importé avec succès.');
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier.');
      }
    };
    
    isBlocks ? reader.readAsText(file) : reader.readAsDataURL(file);
    setFile(null);
    setShowImportModal(false);
  };

  return (
    <div>
      <Button onClick={() => setShowExportModal(true)} variant="primary" className="m-2">
        <FaFileExport /> Exporter
      </Button>

      {isBlocks ? (
        <Button onClick={() => setShowImportModal(true)} variant="primary" className="m-2">
          <FaFileImport /> Importer
        </Button>
      ) : (
        <>
          <Button onClick={() => { setShowImportModal(true); setIsButton('Importer'); }} variant="primary" className="m-2">
            <FaFileImport /> Importer
          </Button>
          <Button onClick={() => { setShowImportModal(true); setIsButton('Parcourir'); }} variant="primary" className="m-2">
            Parcourir
          </Button>
        </>
      )}

      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className={modalStyle.titleModal}>Exporter des {isBlocks ? 'Blocs' : 'Images'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {data.map((item) => (
              <ListGroupItem key={item.id}>
                <FormCheck
                  type="checkbox"
                  label={item.name}
                  onChange={() => selectItem(item.id)}
                  checked={selectedItems.includes(item.id)}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={selectedItems.length <= 1 ? exportBloc : exportAllBlocs}>
            Exporter
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className={modalStyle.titleModal}>Importer des {isBlocks ? 'Blocs' : 'Images'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept={
              isBlocks 
                ? ".part.mdlc,.parts.mdlc"  
                : isButton === "Importer"
                ? ".img.mdlc,.imgs.mdlc"    
                : "image/*"                 
            }            
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
