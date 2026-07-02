/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RoutesAyudaSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import React, { useRef, useState } from "react";
import { ViewerPdf } from "../components/ViewerPdf";
import { Button } from "@mui/material";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  pdfSeleccionado: IRoutesAyuda;
}

export const CambiarPdf: React.FC<Props> = ({ setOpenModal, openModal, pdfSeleccionado }) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const ref = useRef(null);

  const [datosImagen, setDatosImagen] = useState(null);
  const [pdfEncontrado, setPdfEncontrado] = useState(null);
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      setDatosImagen(file);
      reader.addEventListener("load", () => {
        setPdfEncontrado(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const guardarPdf = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(
        RoutesAyudaSliceRequest.UploadFile({
          ruta: pdfSeleccionado.ruta,
          padre: pdfSeleccionado.padre,
          file: datosImagen,
          nombrePdf: pdfSeleccionado.nombrePDF,
          routesAyudaPadresId: pdfSeleccionado.routesAyudaPadresId
        })
      );
      const response = unwrapResult(await dispatch(RoutesAyudaSliceRequest.getAllRequest()));
      if (response) {
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const seleccionarImagen = () => {
    ref.current.click();
  };

  return (
    <main className="w-[80vw]">
      <section className="flex flex-row justify-start gap-x-4">
        <ViewerPdf pantallActualizacion urlPdf={pdfSeleccionado.ruta.toLowerCase()} />
        <div className="flex flex-col justify-start gap-y-4">
          <Button
            className={classes.blueButton}
            variant="contained"
            type="button"
            onClick={() => {
              seleccionarImagen();
            }}>
            Selecione un nuevo PDF
          </Button>
          <input
            type="file"
            accept=".pdf"
            name="Importar"
            onChange={onFileChange}
            ref={ref}
            multiple={false}
            className="hidden"
          />
          {pdfEncontrado !== null && (
            <Button
              className={classes.blueButton}
              variant="contained"
              type="button"
              onClick={() => {
                guardarPdf();
              }}>
              Actualizar PDF
            </Button>
          )}
        </div>
        {pdfEncontrado !== null && <ViewerPdf pantallActualizacion urlPdf={pdfEncontrado} fileUnsaved />}
      </section>
    </main>
  );
};
