/* eslint-disable unused-imports/no-unused-vars */
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import React, { useRef, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import produce from "immer";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { Button, TextField } from "@mui/material";
import { Upload } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  setOpenModalActualizarImagen: (newValue: boolean) => void;
  datosImagen: IEtiquetasImagen;
  refreshTable: () => void;
}

export const ActualizarImagenModal: React.FC<Props> = ({ setOpenModalActualizarImagen, datosImagen, refreshTable }) => {
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const ref: any = useRef(null);

  const [actualizarImagen, setActualizarImagen] = useState({
    modelo: "",
    tipoDeEtiqueta: "",
    imageFile: null,
    tipoUnidad: "",
    codigoEtiqueta: ""
  });
  const [urlImage, seturlImage] = useState(null);
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      console.log(reader);
      setActualizarImagen(
        produce((draft) => {
          draft.imageFile = file;
        })
      );
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const subirImagen = async () => {
    try {
      if (await getConfirmation("Desea continuar?", "La imagen actual sera eliminada, desea continuar?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const imagen = {
          ...actualizarImagen,
          modelo: datosImagen.modelo,
          tipoDeEtiqueta: datosImagen.tipoDeEtiqueta,
          tipoUnidad: null,
          codigoEtiqueta: datosImagen.codigoEtiqueta
        };
        const result = unwrapResult(await dispatch(EtiquetasImagenSliceRequests.UploadImagesCalidad(imagen)));
        console.log(imagen);
        openNotificationUI("Se actualizo la imagen correctamente", "success");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    refreshTable();
    setOpenModalActualizarImagen(false);
  };

  const seleccionarImagen = () => {
    ref.current.click();
  };

  return (
    <main>
      <section className="flex flex-col gap-x-5">
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
        <section className="flex w-full gap-x-6">
          <div>
            <div className="mb-4">
              <TitleUIComponent title="Imagen Actual"></TitleUIComponent>
            </div>
            <figure>
              <img
                style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
                src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${datosImagen?.url}`}
              />
            </figure>
          </div>
          <div>
            {urlImage == null && (
              <div className="flex self-center h-full items-center">
                <Button
                  onClick={() => {
                    seleccionarImagen();
                  }}
                  className={classes.blueButton}>
                  <Upload />
                  Subir Imagen
                </Button>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="Importar"
                  onChange={onFileChange}
                  ref={ref}
                  multiple={false}
                  className="hidden"
                />
              </div>
            )}
            {urlImage != null && (
              <>
                <div className="mb-4">
                  <TitleUIComponent title="Imagen Nueva"></TitleUIComponent>
                </div>
                <figure>
                  <img style={{ maxHeight: "50vh", width: "auto", height: "100%" }} src={urlImage} />
                </figure>
              </>
            )}
          </div>
        </section>
      </section>
      <section className="w-full flex justify-center mt-6">
        <Button
          type="button"
          disabled={urlImage == null}
          onClick={() => {
            subirImagen();
          }}
          className={classes.greenButton}>
          Actualizar Imagen
        </Button>
      </section>
    </main>
  );
};
