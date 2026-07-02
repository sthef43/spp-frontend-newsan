import { Settings } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useRef } from "react";

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
      <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
      <Button
        className="!bg-[#61D864] !text-[#FFF] !font-medium !p-[0.5rem 1rem] !shadow-Box !normal-case hover:!bg-[#4FCB56]"
        disabled = {false}
        variant="outlined"
        color="success"
        size="large"
        onClick={() => fileInputRef.current?.click()}>
        Seleccionar archivo
        <Settings />
      </Button>
    </div>
  );
};

export default FileInput;
