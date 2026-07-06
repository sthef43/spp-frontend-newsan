import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  setPuestoLineaSeleccionada: any;
}

export const BinarioTableroModalForm = ({ setPuestoLineaSeleccionada }: props) => {
  const dispatch = useAppDispatch();
  const [lineas, setLineas] = useState(null);
  const [linea, setLinea] = useState(null);
  const [lineaPuestos, setLineaPuestos] = useState(null);
  const [ModalOpen, setModalOpen] = useState(true);

  const getLineas = async () => {
    // const result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
    setLineas(result);
  };

  const getLineasPuestos = async (lineaId) => {
    const result = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllByLineaId(lineaId)));
    setLineaPuestos(result);
    console.log(result);
  };

  useEffect(() => {
    getLineas();
  }, []);

  interface initialState {
    lineaId: number;
    lineaPuestoId: number;
  }
  const initialStateVar = {
    lineaId: 0,
    lineaPuestoId: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const botonAceptar = () => {
    console.log(getValues("lineaPuestoId"));
    setPuestoLineaSeleccionada(getValues("lineaPuestoId"));
    setModalOpen(false);
  };

  const lineaOnchange = () => {
    console.log(getValues("lineaId"));
    getLineasPuestos(getValues("lineaId"));
  };

  return (
    <>
      <ModalCompoment title={"Configuracion Andon Binario"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <form style={{ width: "100%", height: "100%" }}>
          <div className="grid col-span-1 sm:grid-cols-1 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
            <div>
              <Controller
                name="lineaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una Linea</InputLabel>
                    <Select
                      {...field}
                      variant="standard"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        lineaOnchange();
                      }}>
                      {lineas &&
                        lineas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            {lineaPuestos && (
              <div>
                <Controller
                  name="lineaPuestoId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Seleccione el puesto a descontar</InputLabel>
                      <Select {...field} variant="standard">
                        {lineaPuestos &&
                          lineaPuestos.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.puesto.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            )}
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
