import { Settings } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useRef } from 'react';

interface FileInputProps {
  onFileUpload: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        disabled = {false}
        variant="outlined"
        color="success"
        size="large"
        onClick={() => fileInputRef.current?.click()}        
      >Seleccionar archivo
       <Settings /> 
       
      </Button>
    </div>
  );
};

export default FileInput;
