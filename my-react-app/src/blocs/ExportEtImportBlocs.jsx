import React, { useState } from 'react';
import { Button, ListGroup, ListGroupItem, Modal, FormCheck } from 'react-bootstrap';
import { FaFileExport, FaFileImport } from 'react-icons/fa';

const ExportEtImportBlocs = ({ blocks, setBlocks, images, setImages }) => {
  // Déterminer si on travaille avec des blocs ou des images
  const isBlocks = blocks && setBlocks;
  let data = isBlocks ? blocks : images;
  let setData = isBlocks ? setBlocks : setImages;

  const [selectedItems, setSelectedItems] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [file, setFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const selectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const exportBloc = () => {
      const blocksToExport = data.filter((block) => selectedItems.includes(block.id));

      if (!blocksToExport.length) return alert('Sélectionnez au moins un bloc à exporter.');

      const blob = new Blob([blocksToExport.map((block) => block.content).join('\n\n---\n\n')], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      if (isBlocks){
        link.download = `${blocksToExport[0].name}.part.mdlc`;
      }else{
        link.download = `${blocksToExport[0].name}.img.mdlc`;
      }
     
      link.click();
      window.URL.revokeObjectURL(link.href);

      setShowExportModal(false);
    
  };

  const exportAllBlocs = () => {
      const combinedContent = data.map((block) => `${block.content}\n\n---\n`).join('');
      
      if (!combinedContent.length) return alert('Aucun bloc à exporter.');

      const blob = new Blob([combinedContent], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      if(isBlocks){
        link.download = `allBlocks.parts.mdlc`;

      }else{
        link.download = `allBlocks.imgs.mdlc`;
      }
      link.click();
      window.URL.revokeObjectURL(link.href);

      setShowExportModal(false);
    };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const importerBloc = () => {
    if (!file) return alert('Veuillez sélectionner un fichier à importer.');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
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
if(!isBlocks){
  reader.readAsDataURL(file);
}else{
  reader.readAsText(file);
}
    


    setFile(null);
    setShowImportModal(false);
    
  };

  return (
    <div>
      <Button onClick={() => setShowExportModal(true)} variant="primary" className="m-2">
        <FaFileExport /> Exporter
      </Button>
      <Button onClick={() => setShowImportModal(true)} variant="primary" className="m-2">
        <FaFileImport /> Importer
      </Button>
      <Button onClick={() => setShowImportModal(true)} variant="primary" className="m-2">
        Parcourir
      </Button>
      {/* Modal d'exportation */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exporter des {isBlocks ? 'Blocs' : 'Images'}</Modal.Title>
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

      {/* Modal d'importation */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Importer des {isBlocks ? 'Blocs' : 'Images'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept={isBlocks?".part.mdlc,.parts.mdlc":"image/*,img.mdlc,imgs.mdlc"}
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
