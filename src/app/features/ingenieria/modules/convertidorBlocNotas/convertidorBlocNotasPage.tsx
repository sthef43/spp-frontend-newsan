import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from "@mui/material";
import { Upload } from "@mui/icons-material";

function ConvertidorBlocNotasPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, seleccione un archivo.");
      return;
    }

    try {
      // debugger;
      const formData = new FormData();
      formData.append("request", selectedFile);
      const response = await axios.post("https://localhost:5001/api/ZPL_Impresiones/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedFile.name + "-COMPACTADO" + ".txt");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al cargar y descargar el archivo:", error);
    }
  };

  return (
    <div className="flex-row text-center bg-black z-40 w-full h-96">
        <Input type="file" onChange={handleFileChange}></Input>
      <Button onClick={handleUpload}>
        <Upload></Upload>
        Subir y descargar
      </Button>
      {/* <button onClick={handleUpload}>Subir y Descargar</button> */}
    </div>
  );
}

export default ConvertidorBlocNotasPage;
