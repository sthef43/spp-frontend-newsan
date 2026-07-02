import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { IDotacionTareas } from "../../models/IDotacionTareas";
import { DotacionTareaSliceRequest } from "../../reducers/DotacionTareasSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  setListaTareas: (newValue: IDotacionTareas[]) => void;
  tareaSeleccionada: IDotacionTareas;
  sectorId: number;
  modoEditor: boolean;
}

export const AñadirEditarTareasModal: React.FC<Props> = ({
  setOpenModal,
  setListaTareas,
  tareaSeleccionada,
  modoEditor,
  sectorId
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
    let response: IDotacionTareas;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (modoEditor) {
        const actualizarTarea: IDotacionTareas = {
          ...tareaSeleccionada,
          detalles: data.detallesTarea,
          nombre: data.nombreTarea,
          dotacionSectorId: sectorId
        };
        delete actualizarTarea.dotacionSector;
        response = unwrapResult(await dispatch(DotacionTareaSliceRequest.PutRequest(actualizarTarea)));
      }
      if (!modoEditor) {
        const nuevaTarea = generarNuevaTarea(data);
        response = unwrapResult(await dispatch(DotacionTareaSliceRequest.PostRequest(nuevaTarea)));
      }
      if (response) {
        const getTareas = unwrapResult(await dispatch(DotacionTareaSliceRequest.GetAllBySectorId(sectorId)));
        setListaTareas(getTareas);
        setOpenModal(false);
        openNotificationUI(`Se ${modoEditor ? "edito" : "añadio"} correctamente la tarea`, "success");
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevaTarea = (formData) => {
    try {
      const nuevaTarea: IDotacionTareas = {
        detalles: formData.detallesTarea,
        nombre: formData.nombreTarea,
        dotacionSectorId: sectorId
      };

      if (nuevaTarea != null) {
        return nuevaTarea;
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
              nameInput="nombreTarea"
              index={0}
              labelInput="Ingrese un nombre"
              valueDefault={tareaSeleccionada.nombre}
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesTarea"
              index={1}
              labelInput="Ingrese los detalles"
              valueDefault={tareaSeleccionada.detalles}
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
              nameInput="nombreTarea"
              index={0}
              valueDefault=""
              labelInput="Ingrese un nombre"
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesTarea"
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
