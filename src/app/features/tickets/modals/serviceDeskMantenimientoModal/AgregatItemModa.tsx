import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ITicketsItemsProcesos } from "../../models/ITicketsItemsProcesos";
import { TicketsItemsProcesosSliceRequest } from "../../reducers/TicketsItemsProcesos";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  refreshListaItems: (newValue: ITicketsItemsProcesos[]) => void;
  rolSeleccionado: number;
}

export const AgreagrItemModal: React.FC<Props> = ({ setOpenModal, openModal, refreshListaItems, rolSeleccionado }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data) => {
    const nuevoItems: ITicketsItemsProcesos = {
      nombre: data.nombreItem,
      detalles: data.detalleItem,
      rolId: rolSeleccionado,
      aprobacionIntermedia: data.aprobacionIntermedia
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseAgregarItem = unwrapResult(
        await dispatch(TicketsItemsProcesosSliceRequest.PostRequest(nuevoItems))
      );
      if (responseAgregarItem) {
        openNotificationUI("Se agrego el item correctamente", "success");
        const refresh = unwrapResult(
          await dispatch(TicketsItemsProcesosSliceRequest.GetAllItemsByRolId(rolSeleccionado))
        );
        if (refresh) {
          refreshListaItems(refresh);
          setOpenModal(!openModal);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[40vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Ingrese el nombre del item"
          nameInput="nombreItem"
          valueDefault=""
          requiredBool
          errors={errors}
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Ingrese los detalles del item"
          nameInput="detalleItem"
          valueDefault=""
          requiredBool
          errors={errors}
        />
        <Controller
          name="aprobacionIntermedia"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              control={<Checkbox checked={field.value} />}
              label="Aprobacion Intermedia del item"
            />
          )}
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
