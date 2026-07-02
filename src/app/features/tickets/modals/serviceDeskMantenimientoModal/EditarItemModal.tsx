import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRol } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ITicketsItemsProcesos } from "../../models/ITicketsItemsProcesos";
import { TicketsItemsProcesosSliceRequest } from "app/features/tickets/reducers/TicketsItemsProcesos";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  itemSeleccionado: ITicketsItemsProcesos;
  setListadoItems: (newValue: ITicketsItemsProcesos[]) => void;
  rolSeleccionado: number;
}

export const EditarItemModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  itemSeleccionado,
  setListadoItems,
  rolSeleccionado
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const [listadoRol, setListadoRol] = useState<IRol[]>([]);
  FetchApi<IRol[]>(RolSliceRequests.getAllRequest, null, false, openModal, setListadoRol);

  const onSubmit = async (data) => {
    console.log(data);
    const edicionItem = {
      ...itemSeleccionado,
      nombre: data.nombreItem,
      detalles: data.detallesItem,
      rolId: data.rolId,
      aprobacionIntermedia: data.aprobacionIntermedia
    };
    delete edicionItem.rol;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketsItemsProcesosSliceRequest.PutRequest(edicionItem)));
      if (response) {
        const refreshListado = unwrapResult(
          await dispatch(TicketsItemsProcesosSliceRequest.GetAllItemsByRolId(rolSeleccionado))
        );
        if (refreshListado) {
          openNotificationUI("Se edito el item correctamente", "success");
          setListadoItems(refreshListado);
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        <div className="w-full">
          <Controller
            control={control}
            name="rolId"
            defaultValue={itemSeleccionado.rolId}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="seleccion-UBC">Selecione un rol</InputLabel>
                <Select
                  {...field}
                  labelId="seleccion-UBC"
                  id="seleccion"
                  defaultValue={itemSeleccionado.rol.name}
                  label="Selecione un rol">
                  {listadoRol.map((elementos, index) => (
                    <MenuItem value={elementos.id} key={index}>
                      {elementos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Nombre del item"
          nameInput="nombreItem"
          valueDefault={itemSeleccionado.nombre}
          requiredBool
          errors={errors}
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Detalles del item"
          nameInput="detallesItem"
          valueDefault={itemSeleccionado.detalles}
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
          <Button className={buttonClases.purpleButton} type="button">
            Añadir Items para Cancelacion
          </Button>
        </div>
      </form>
    </main>
  );
};
