import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ITicketsGrupoProcesos } from "../../../models/iTicketsGrupoProcesos";
import { ITicketsGrupoProcesosBloque } from "../../../models/ITicketsGrupoProcesosBloque";
import { ITicketsItemsProcesos } from "../../../models/ITicketsItemsProcesos";
import { TicketGrupoProcesosBloqueSliceRequest } from "app/features/tickets/reducers/TicketsGrupoProcesosBloqueSlice";
import { TicketsItemsProcesosSliceRequest } from "app/features/tickets/reducers/TicketsItemsProcesos";

interface Props {
  openModal: boolean;
  itemSeleccionado: ITicketsItemsProcesos;
  grupoProcesos: ITicketsGrupoProcesos;
  setOpenModal: (newValue: boolean) => void;
  setListadoItems: (newValue: ITicketsItemsProcesos[]) => void;
  setListadoBloques: (newValue: ITicketsGrupoProcesosBloque[]) => void;
}

export const CambiarPositionItem: React.FC<Props> = ({
  openModal,
  setOpenModal,
  itemSeleccionado,
  grupoProcesos,
  setListadoItems,
  setListadoBloques
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [bloqueGrupo, setBloqueGrupo] = useState<ITicketsGrupoProcesosBloque>();
  FetchApi<ITicketsGrupoProcesosBloque>(
    TicketGrupoProcesosBloqueSliceRequest.GetBloqueByGrupoIdAndItemId,
    { itemId: itemSeleccionado.id, grupoId: grupoProcesos.id },
    true,
    openModal,
    setBloqueGrupo
  );

  const onSubmit = async (data) => {
    const actualizarBloque = { ...bloqueGrupo, position: data.posicion };
    delete actualizarBloque.ticketsItemsProcesos;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketGrupoProcesosBloqueSliceRequest.PutTicketsGrupoProcesosBloque(actualizarBloque))
      );
      if (response) {
        openNotificationUI("Se actualizo el bloque con exito", "success");
        const responseRefresh = unwrapResult(
          await dispatch(TicketsItemsProcesosSliceRequest.GetAllWithGroup(grupoProcesos.id))
        );
        const responseBloqueRefresh = unwrapResult(
          await dispatch(TicketGrupoProcesosBloqueSliceRequest.GetAllWithGrupoId(grupoProcesos.id))
        );
        if (responseRefresh) {
          setListadoBloques(responseBloqueRefresh);
          setListadoItems(responseRefresh);
          setOpenModal(false);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const fechaFormateada = (fechaTickets: ITicketsItemsProcesos) => {
    const fechaFormat = new Date(fechaTickets.createdDate);
    if (fechaFormat) {
      return `${fechaFormat.getFullYear()}-${fechaFormat.getMonth() + 1}-${fechaFormat.getDate()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  return (
    <>
      {bloqueGrupo && (
        <main className="w-[60vw]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <figure className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors mb-6">
              <div>
                <h2 className="mb-2 font-semibold">{itemSeleccionado.nombre}</h2>
                <p className="text-xs text-gray-500">Creado: {fechaFormateada(itemSeleccionado)}</p>
                <p className="text-xs text-gray-500">Detalles: {`${itemSeleccionado.detalles}`}</p>
              </div>
            </figure>
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Ingrese una nueva posicion"
              nameInput="posicion"
              valueDefault={bloqueGrupo.position.toString()}
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
      )}
    </>
  );
};
