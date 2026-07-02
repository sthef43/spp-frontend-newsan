import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaPuestoSlice, LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaProduccionSliceRequests, lineaProduccionSlice } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  setPuestoLineaSeleccionada: (id: number) => void;
  setPuestoLineaSeleccionada2: (id: number) => void;
}

export const AndonIMModal = ({ setPuestoLineaSeleccionada, setPuestoLineaSeleccionada2 }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [lineas, setLineas] = useState<ILineaProduccion[]>([]);
  const [lineaPuestos, setLineaPuestos] = useState(null);
  const [ModalOpen, setModalOpen] = useState(true);

  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
      setLineas(result);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getLineasPuestos = async (lineaId) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const result = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllPuestoRechazoByLineaId(lineaId)));
      setLineaPuestos(result);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    getLineas();
  }, []);

  interface initialState {
    lineaId: number;
    lineaPuestoId: number;
    multiplePuestos: boolean;
    lineaPuestoId2: number;
  }
  const initialStateVar = {
    lineaId: 0,
    lineaPuestoId: 0,
    multiplePuestos: false,
    lineaPuestoId2: 0
  };
  const { control, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const botonAceptar = () => {
    dispatch(LineaPuestoSlice.actions.selectLineaPuesto(getValues("lineaPuestoId")));
    dispatch(lineaProduccionSlice.actions.setSelectLinea(getValues("lineaId")));
    setPuestoLineaSeleccionada(getValues("lineaPuestoId"));
    setPuestoLineaSeleccionada2(getValues("lineaPuestoId2"));
    setModalOpen(false);
  };

  const lineaOnchange = () => {
    getLineasPuestos(getValues("lineaId"));
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
                      <InputLabel>Seleccione el puesto de rechazo</InputLabel>
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
            {lineaPuestos && (
              <div>
                <Controller
                  name="multiplePuestos"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <FormControlLabel label="Multiple  puestos" control={<Checkbox {...field} />} />

                      {!!error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            )}
            {watch("multiplePuestos") && (
              <div>
                <Controller
                  name="lineaPuestoId2"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Seleccione el segundo puesto de rechazo</InputLabel>
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
