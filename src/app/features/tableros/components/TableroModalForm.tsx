import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  setLineaSeleccionada: any;
}

export const TableroModalForm = ({ setLineaSeleccionada }: props) => {
  const dispatch = useAppDispatch();
  const [lineas, setLineas] = useState(null);
  const [ModalOpen, setModalOpen] = useState(true);

  const getLineas = async () => {
    const result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    setLineas(result);
  };

  useEffect(() => {
    getLineas();
  }, []);

  interface initialState {
    lineaId: number;
  }
  const initialStateVar = {
    lineaId: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const botonAceptar = () => {
    const objetoLinea = lineas.find((x) => x.idLinea == getValues("lineaId"));
    setLineaSeleccionada(objetoLinea);
    setModalOpen(false);
  };

  return (
    <>
      <ModalCompoment title={"Configuracion Andon"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <form style={{ width: "100%", height: "100%" }}>
          <div className="grid col-span-1 sm:grid-cols-1 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
            <div>
              <Controller
                name="lineaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una Linea</InputLabel>
                    <Select {...field} variant="standard">
                      {lineas &&
                        lineas.map((x) => (
                          <MenuItem key={x.idLinea} value={x.idLinea}>
                            <div className="w-full">
                              <div>{x.descripcion}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div>
              <Button variant="outlined" onClick={botonAceptar}>
                Aceptar
              </Button>
            </div>
          </div>
        </form>
      </ModalCompoment>
    </>
  );
};
