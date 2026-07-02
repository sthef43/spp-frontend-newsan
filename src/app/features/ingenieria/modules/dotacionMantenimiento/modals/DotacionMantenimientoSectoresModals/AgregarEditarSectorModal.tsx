import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { IDotacionSector } from "../../models/IDotacionSector";
import { DotacionSectorSliceRequest } from "../../reducers/DotacionSectorSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  modoEditor: boolean;
  sectorSeleccionado: IDotacionSector;
  setListaSectores: (newValue: IDotacionSector[]) => void;
}

export const AgregarEditarSectorModal: React.FC<Props> = ({
  setOpenModal,
  setListaSectores,
  modoEditor,
  sectorSeleccionado
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    let response: IDotacionSector;
    try {
      if (modoEditor) {
        const actualizarSector: IDotacionSector = {
          ...sectorSeleccionado,
          nombre: data.nombreSector,
          descripcion: data.detallesSector
        };
        response = unwrapResult(await dispatch(DotacionSectorSliceRequest.PutRequest(actualizarSector)));
      }
      if (!modoEditor) {
        const nuevoSector = generarNuevoSector(data);
        response = unwrapResult(await dispatch(DotacionSectorSliceRequest.PostRequest(nuevoSector)));
      }
      if (response) {
        const getSectores = unwrapResult(await dispatch(DotacionSectorSliceRequest.getAllRequest()));
        if (getSectores) {
          setListaSectores(getSectores);
          openNotificationUI(`Se ${modoEditor ? "edito" : "añadio"} correctamente el sector`, "success");
          setOpenModal(false);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevoSector = (dataForm) => {
    try {
      const nuevoSector: IDotacionSector = {
        nombre: dataForm.nombreSector,
        descripcion: dataForm.detallesSector
      };

      if (nuevoSector != null) {
        return nuevoSector;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error ${error}`, "error");
    }
  };

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-y-4 w-full">
        {modoEditor ? (
          <>
            <TextFieldComponent
              control={control}
              nameInput="nombreSector"
              index={0}
              labelInput="Ingrese un nombre"
              valueDefault={sectorSeleccionado.nombre}
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesSector"
              index={1}
              labelInput="Ingrese los detalles"
              valueDefault={sectorSeleccionado.descripcion}
              requiredBool
              errors={errors}
            />
            <div className="flex flex-row w-full justify-center mt-2 gap-x-2">
              <div>
                <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
                  Guardar
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className={buttonClases.redButton}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <TextFieldComponent
              control={control}
              nameInput="nombreSector"
              index={0}
              valueDefault=""
              labelInput="Ingrese un nombre"
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesSector"
              index={1}
              valueDefault=""
              labelInput="Ingrese los detalles"
              requiredBool
              errors={errors}
            />
            <div className="flex flex-row w-full justify-center mt-2 gap-x-2">
              <div>
                <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
                  Guardar
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className={buttonClases.redButton}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </main>
  );
};
