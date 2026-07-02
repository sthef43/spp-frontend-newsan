import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { ITicketsCategoria } from "../../../models/ITicketsCategorias";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  categoriaSeleccionada: ITicketsCategoria;
  setListadoCategorias: (newValue: ITicketsCategoria[]) => void;
  plantaId: number;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const EditarCategoriaModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  categoriaSeleccionada,
  setListadoCategorias,
  plantaId
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
    const categoriaEditada: ITicketsCategoria = {
      ...categoriaSeleccionada,
      nombre: data.nombreCategoria,
      descripcion: data.descripcionCategoria
    };
    delete categoriaEditada.ticketsCategoriaRolBloque;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketsCategoriaSliceRequest.PutRequest(categoriaEditada)));
      if (response) {
        const responseGetAll = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId(plantaId))
        );
        if (responseGetAll) {
          setListadoCategorias(responseGetAll);
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
          labelInput="Ingrese el nombre de la categoria"
          nameInput="nombreCategoria"
          valueDefault={categoriaSeleccionada.nombre}
          requiredBool
          errors={errors}
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Ingrese la descripcion de la categoria"
          nameInput="descripcionCategoria"
          valueDefault={categoriaSeleccionada.descripcion}
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
