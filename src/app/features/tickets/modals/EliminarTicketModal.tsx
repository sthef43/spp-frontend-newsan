/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { ITickets } from "../models/ITickets";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { TicketsSliceRequest } from "../reducers/TicketsSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  ticketSeleccionado: ITickets;
  funcionDeRefresh: () => void;
}

export const EliminarTicketModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  ticketSeleccionado,
  funcionDeRefresh
}) => {
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const {
    validators: { minLength }
  } = useInputValidations(trigger);
  const { FetchPut } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();

  const handleOnSubmit = (data: any) => {
    const ticketDelete = generateTicketDelete(data.motivoEliminacion);
    FetchPut({
      consoleLog: false,
      modelPut: ticketDelete,
      sliceRequest: TicketsSliceRequest.PutRequest,
      functionAdd(response) {
        funcionDeRefresh();
        openNotificationUI("Ticket eliminado correctamente", "success");
        setOpenModal(false);
      }
    });
  };

  const generateTicketDelete = (motivoEliminacion: string) => {
    const ticketDelete: ITickets = {
      ...ticketSeleccionado,
      motivoEliminacion: motivoEliminacion,
      deleted: true
    };

    delete ticketDelete.operator;
    delete ticketDelete.ticketsItemsProcesosResultado;
    delete ticketDelete.ticketsCategoria;
    delete ticketDelete.ticketsEstado;
    delete ticketDelete.ticketsColaboradoresBloque;

    return ticketDelete;
  };

  return (
    <main className="w-[40vw] h-full">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Motivo de Eliminación"
          nameInput="motivoEliminacion"
          valueDefault=""
          autoFocus
          requiredBool
          errors={errors}
          typeInput="standard"
          validacionAdicionales={minLength(10, "El motivo de eliminación debe tener al menos 10 caracteres")}
        />
        <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} submitName="Eliminar" />
      </form>
    </main>
  );
};
