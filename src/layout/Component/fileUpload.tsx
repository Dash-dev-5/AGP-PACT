import React, { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Button, ListGroup, Image } from 'react-bootstrap';
import { BsTrash, BsDownload } from 'react-icons/bs';

export interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void; // Prop pour envoyer les fichiers au parent
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Fonction pour gérer le drop de fichiers
  const onDrop = (acceptedFiles: File[]) => {
    const mappedFiles = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    // Ajouter les nouveaux fichiers aux fichiers existants
    const updatedFiles = [...files, ...mappedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // Appeler la fonction de rappel avec les nouveaux fichiers
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
    } as Accept,
    multiple: true, // Autoriser plusieurs fichiers
  });

  const handleDelete = (file: UploadedFile) => {
    const newFiles = files.filter((f) => f.name !== file.name);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ddd',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <input {...getInputProps()} />
        <p>Déposez vos fichiers ici, ou parcourez</p>
        <span style={{ color: '#888' }}>Seules les images et PDF sont pris en charge</span>
      </div>

      <ListGroup variant="flush" className="mt-3">
        {files.map((file) => (
          <ListGroup.Item key={file.name} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Image
                src={file.preview}
                alt={file.name}
                rounded
                style={{ width: '40px', height: '40px', marginRight: '10px' }}
              />
              <div>
                <p className="mb-0">{file.name}</p>
                <small>{(file.size / 1024).toFixed(1)} KB</small>
              </div>
            </div>
            <div>
              <Button variant="link" onClick={() => handleDelete(file)}>
                <BsTrash color="red" />
              </Button>
              <a href={file.preview} download={file.name}>
                <Button variant="link">
                  <BsDownload color="teal" />
                </Button>
              </a>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default FileUpload;
