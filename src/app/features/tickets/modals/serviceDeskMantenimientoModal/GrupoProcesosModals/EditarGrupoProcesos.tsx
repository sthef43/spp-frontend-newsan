import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { ITicketsGrupoProcesos } from "../../../models/iTicketsGrupoProcesos";
import { TicketsGrupoProcesosSliceRequest } from "app/features/tickets/reducers/TicketsGrupoProcesosSlice";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  grupoSeleccionado: ITicketsGrupoProcesos;
  setListadoGrupoProcesos: (newValue: ITicketsGrupoProcesos[]) => void;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const EditarGrupoProcesos: React.FC<Props> = ({
  openModal,
  setOpenModal,
  grupoSeleccionado,
  setListadoGrupoProcesos
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data) => {
    const categoriaEditada: ITicketsGrupoProcesos = {
      ...grupoSeleccionado,
      nombre: data.nombreGrupo,
      detalles: data.detallesGrupo
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketsGrupoProcesosSliceRequest.PutRequest(categoriaEditada)));
      if (response) {
        const responseGetAll = unwrapResult(
          await dispatch(
            TicketsGrupoProcesosSliceRequest.GetAllGroupsByCategoriaId(grupoSeleccionado.ticketsCategoriasId)
          )
        );
        if (responseGetAll) {
          setListadoGrupoProcesos(responseGetAll);
          openNotificationUI("Se edito la categoria correctamente", "success");
          setOpenModal(false);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Ingrese el nombre del grupo"
          nameInput="nombreGrupo"
          valueDefault={grupoSeleccionado.nombre}
          requiredBool
          errors={errors}
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Ingrese los detalles del grupo"
          nameInput="detallesGrupo"
          valueDefault={grupoSeleccionado.detalles}
          requiredBool
          errors={errors}
        />
        <div className="flex flex-row justify-center gap-x-3 mt-2">
          <Button className={buttonClases.greenButton} type="submit" disabled={!isValid}>
            Guardar
          </Button>
          <Button
            className={buttonClases.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
