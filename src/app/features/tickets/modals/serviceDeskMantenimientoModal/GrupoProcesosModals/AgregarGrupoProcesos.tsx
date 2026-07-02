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
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  ticketCategoriaId: number;
  refreshListaGrupos: (newValue: ITicketsGrupoProcesos[]) => void;
  plantaId: number;
}

export const AgregarGrupoProcesos: React.FC<Props> = ({
  setOpenModal,
  openModal,
  ticketCategoriaId,
  refreshListaGrupos,
  plantaId
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data) => {
    const nuevoItems: ITicketsGrupoProcesos = {
      nombre: data.nombreGrupo,
      detalles: data.detalleGrupo,
      ticketsCategoriasId: ticketCategoriaId,
      plantId: plantaId
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseAgregarItem = unwrapResult(
        await dispatch(TicketsGrupoProcesosSliceRequest.PostRequest(nuevoItems))
      );
      if (responseAgregarItem) {
        openNotificationUI("Se agrego el item correctamente", "success");
        const refresh = unwrapResult(
          await dispatch(TicketsGrupoProcesosSliceRequest.GetAllGroupsByCategoriaId(ticketCategoriaId))
        );
        if (refresh) {
          refreshListaGrupos(refresh);
          setOpenModal(!openModal);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const validacionDetalles = (value: string, index: number) => {
    if (value.length > 10 && index == 1) {
      return true;
    } else {
      return "Ingrese un mejor detalle";
    }
  };

  return (
    <main className="w-[40vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Ingrese el nombre del grupo"
          nameInput="nombreGrupo"
          valueDefault=""
          requiredBool
          errors={errors}
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Ingrese los detalles del grupo"
          nameInput="detalleGrupo"
          valueDefault=""
          requiredBool
          errors={errors}
          validacionAdicionales={validacionDetalles}
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
