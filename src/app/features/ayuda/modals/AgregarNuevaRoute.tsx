/* eslint-disable unused-imports/no-unused-vars */
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RoutesAyudaSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaSlice";
import { Button, IconButton, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { unwrapResult } from "@reduxjs/toolkit";
import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import FetchApi from "app/shared/helpers/FetchApi";
import { RoutesAyudaPadresSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaPadresSlice";
import { Add } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AñadirPadre } from "./AñadirPadre";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  setListaRoutes: (newValue: IRoutesAyuda[]) => void;
}

export const AgregarNuevaRoute: React.FC<Props> = ({ setOpenModal, openModal, setListaRoutes }) => {
  const {
    control,
    watch,
    formState: { errors, isValid }
  } = useForm();

  const ref = useRef(null);

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  const [openModalAñadirPadre, setOpenModalAñadirPadre] = useState(false);

  const [listaPadres, setListaPadres] = useState<IRoutesAyudaPadres[]>([]);

  const [datosImagen, setDatosImagen] = useState(null);
  const [pdfEncontrado, setPdfEncontrado] = useState(null);
  const [padreId, setPadreId] = useState<string | number>(null);

  FetchApi<IRoutesAyudaPadres[]>(RoutesAyudaPadresSliceRequest.getAllRequest, null, true, openModal, setListaPadres);

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
    const watchnNombreArchivo = watch("nombreArchivo");
    const watchRuta = watch("rutaPdf");
    const buscarPadre = listaPadres.find((elementos) => elementos.id == padreId);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(
        RoutesAyudaSliceRequest.UploadFile({
          ruta: watchRuta,
          padre: buscarPadre.padre,
          file: datosImagen,
          nombrePdf: watchnNombreArchivo,
          routesAyudaPadresId: padreId
        })
      );
      const response = unwrapResult(await dispatch(RoutesAyudaSliceRequest.getAllRequest()));
      if (response) {
        setListaRoutes(response);
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
    <main className="w-[80vw] flex flex-col gap-y-4">
      <div className="w-full flex flex-col items-center justify-center1">
        <h2 className="uppercase font-semibold text-xl underline">
          NOTA: Cuando se agrega la ruta debe ser, Padre/Nombre del archivo pdf
        </h2>
        <h2 className="font-semibold mt-2 underline">Por Ejemplo: Auditorias/realizar_auditorias</h2>
      </div>
      <TextFieldComponent
        control={control}
        nameInput="nombreArchivo"
        labelInput="Ingrese el Nombre del PDF"
        index={0}
        autoFocus
        requiredBool
        errors={errors}
        typeInput="outlined"
        valueDefault=""
      />
      <div className="flex flex-row gap-x-4">
        <SelectComponent
          control={control}
          listaObjetos={listaPadres}
          nameSelect="padre"
          valueSelect={(items) => items.id}
          valueLabel={(item) => item.padre}
          valueKey={(item) => item}
          inputLabel="Seleccione un padre"
          ValueSave={setPadreId}
        />
        <div className="flex items-center">
          <Tooltip title="Agregar Padre">
            <IconButton
              size="medium"
              onClick={() => {
                setOpenModalAñadirPadre(true);
              }}>
              <Add color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <TextFieldComponent
        control={control}
        nameInput="rutaPdf"
        labelInput="Ingrese la ruta"
        index={1}
        requiredBool
        errors={errors}
        typeInput="outlined"
        valueDefault=""
      />
      <div className="flex flex-col justify-center items-center">
        <Button
          type="button"
          disabled={!isValid}
          className={classes.blueButton}
          onClick={() => {
            seleccionarImagen();
          }}>
          Cargar PDF
        </Button>
        <input
          multiple={false}
          onChange={onFileChange}
          type="file"
          accept=".pdf"
          id="subirArchivo"
          ref={ref}
          className="hidden"
        />
      </div>
      <div className="text-center text-xl text-green-500 font-semibold">
        <p className={`${datosImagen == null ? "hidden" : "block"}`}>Se cargo un PDF</p>
      </div>
      <div className="flex items-center gap-x-5 justify-center">
        <Button
          disabled={!isValid || datosImagen == null}
          className={classes.blueButton}
          onClick={() => {
            guardarPdf();
          }}
          type="submit">
          Guardar
        </Button>
        <Button
          type="button"
          className={classes.redButton}
          onClick={() => {
            setOpenModal(false);
          }}>
          Cancelar
        </Button>
      </div>

      <ModalCompoment setOpenPopup={setOpenModalAñadirPadre} openPopup={openModalAñadirPadre} title="Añadir Padre">
        <AñadirPadre
          refreshListaPadres={setListaPadres}
          setOpenModal={setOpenModalAñadirPadre}
          listaPadre={listaPadres}
        />
      </ModalCompoment>
    </main>
  );
};
