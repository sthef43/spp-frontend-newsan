import { TextField } from "@mui/material";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import React from "react";

interface Props {
  datosImagen: IEtiquetasImagen;
}

export const VerImagenCargadaModal: React.FC<Props> = ({ datosImagen }) => {
  return (
    <main>
      <section className="w-full">
        <div className="w-full flex gap-x-4 mb-4">
          <div className="w-full">
            <TextField
              fullWidth
              id="tipoEtiqueta"
              label="Tipo De Etiqueta"
              value={datosImagen.tipoDeEtiqueta}
              variant="outlined"
              disabled
            />
          </div>
          <div className="w-full">
            <TextField
              fullWidth
              id="codigoEtiqueta"
              label="Codigo Etiqueta"
              value={datosImagen.codigoEtiqueta}
              variant="outlined"
              disabled
            />
          </div>
          <div className="w-full">
            <TextField fullWidth id="modelo" label="Modelo" value={datosImagen.modelo} variant="outlined" disabled />
          </div>
        </div>
        <figure>
          <img
            style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
            src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${datosImagen?.url}`}
          />
        </figure>
      </section>
    </main>
  );
};
