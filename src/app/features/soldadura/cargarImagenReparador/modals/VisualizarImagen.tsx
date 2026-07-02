import React from "react";

interface VisualizarImagenProps {
  Imagen: string;
}

export const VisualizarImagen: React.FC<VisualizarImagenProps> = ({ Imagen }) => {
  console.log(Imagen);
  //Imagen contiene \\10.30.10.155\Aplicacion\Imagen Soldadura\UE09CG.JPG
  return (
    <div>
      VisualizarImagen
      <div className="flex-col gap-30" style={{ height: "100%" }}>
        <div style={{ height: "83vh", width: "90vw", position: "relative" }}>
          <div className="flex-col gap-30" style={{ width: "100%", height: "100%" }}>
            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={Imagen} />
          </div>
        </div>
      </div>
    </div>
  );
};
