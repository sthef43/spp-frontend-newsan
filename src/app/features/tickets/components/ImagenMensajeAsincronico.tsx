import { useState, useEffect } from "react";

interface PropsImagenMensaje {
  nombreArchivo: string;
  fetchFunction: (url: string) => Promise<string | null>;
}

export const ImagenMensajeAsincrona = ({ nombreArchivo, fetchFunction }: PropsImagenMensaje) => {
  const [imagenBlobUrl, setImagenBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const cargarImagen = async () => {
      const urlResult = await fetchFunction(nombreArchivo);
      if (urlResult) {
        setImagenBlobUrl(urlResult);
      }
    };

    cargarImagen();

    return () => {
      if (imagenBlobUrl) {
        URL.revokeObjectURL(imagenBlobUrl);
      }
    };
  }, [nombreArchivo]);
  if (!imagenBlobUrl) {
    return <div className="p-4 text-gray-500 text-sm animate-pulse">Cargando adjunto...</div>;
  }
  return <img src={imagenBlobUrl} alt="Evidencia del mensaje" className="max-w-xs rounded shadow-md mt-2" />;
};
