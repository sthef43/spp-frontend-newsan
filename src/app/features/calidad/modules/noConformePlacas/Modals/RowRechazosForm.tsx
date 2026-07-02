/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IControlLotePlacas } from "app/models/IControlLotePlacas";
import { IEstadoLote } from "app/models";
import { EstadoLoteSliceRequests } from "app/Middleware/reducers/EstadoLoteSlice";
import moment from "moment";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { ControlLotePlacasSliceRequests } from "app/Middleware/reducers/ControlLotePlacasSlice";
import { TrazaUnit2SliceRequest } from "app/Middleware/reducers/trazaUnit2Slice";
interface props {
  rowRechazado?: IControlLotePlacas;
  refresh?: any | null;
}

export const RowRechazosForm = ({ rowRechazado, refresh }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<IControlLotePlacas>({
    defaultValues: rowRechazado
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Cargo lista con Tipos de Máquinas
  useEffect(() => {
    getListCausa();
  }, []);

  //Cargar Causas
  const [listCausa, setListCausa] = useState<IEstadoLote[]>([]);
  const getListCausa = async () => {
    try {
      const result = unwrapResult(await dispatch(EstadoLoteSliceRequests.getAllRequest()));
      setListCausa(result);
    } catch (error) {
      console.log(error);
    }
  };

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    //*** Objeto para ControlLotePlacas
    const objectCLP = {
      ...e,
      empQ_Declarations: null,
      estadoLote: null
    };
    //*** Objeto para Rechazo
    const objectRechazo = {
      barcode: rowRechazado.empQ_DeclarationsId,
      estado: e.rechazado ? "R" : "A"
    };
    //*** Objeto para TrazaUnit2
    const objectTrazaUnit2 = {
      codigo: rowRechazado.empQ_DeclarationsId,
      rechazado: e.rechazado
    };
    try {
      //  * Control Lote Placas
      const resultPlacas = unwrapResult(await dispatch(ControlLotePlacasSliceRequests.putRequest(objectCLP)));
      //  * Rechazo
      const resultRechazo = unwrapResult(await dispatch(RechazoSliceRequests.actualizarRequest(objectRechazo)));
      //  * TrazaUnit
      const resultTrazaUnit2 = unwrapResult(await dispatch(TrazaUnit2SliceRequest.actualizarRequest(objectTrazaUnit2)));
      openNotificationUI("Guardado...", "success");
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-5" style={{ flex: "1 1 90%" }}>
              <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <div className="flex flex-wrap -mx-2">
                  <div className="px-2 flex-1">
                    <Controller
                      name="empQ_DeclarationsId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error} disabled>
                          <InputLabel>Serie</InputLabel>
                          <Input {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="px-2 flex-1">
                    <Controller
                      name="createdDate"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => {
                        const formatDate = field.value ? moment(new Date(field.value)).format("DD/MM/YYYY HH:mm") : "";
                        return (
                          <FormControl fullWidth variant="outlined" error={!!error} disabled>
                            <InputLabel>Fecha Creación</InputLabel>
                            <Input {...field} value={formatDate} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        );
                      }}
                    />
                  </div>
                  <div className="px-2 flex-1">
                    <Controller
                      name="lastModifiedDate"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => {
                        const formattedDate = field.value
                          ? moment(new Date(field.value)).format("DD/MM/YYYY HH:mm")
                          : "";
                        return (
                          <FormControl fullWidth variant="outlined" error={!!error} disabled>
                            <InputLabel>Fecha Modificación</InputLabel>
                            <Input {...field} value={formattedDate} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        );
                      }}
                    />
                  </div>
                  <div className="px-2 flex-1">
                    <Controller
                      name="nombreSupervisor"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error} disabled>
                          <InputLabel>Nombre Supervisor</InputLabel>
                          <Input {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* ***************************************************************************** */}
              <div className="flex flex-wrap justify-center sm:justify-start pl-10 pr-10 mt-3">
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="estadoLoteId"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="standard" style={{ flex: 1 }}>
                        <InputLabel>Causa</InputLabel>
                        <Select {...field} placeholder="Ingrese Causa" style={{ width: "400px" }}>
                          {listCausa &&
                            listCausa.map((lote) => (
                              <MenuItem key={lote.idEstadoLote} value={lote.idEstadoLote}>
                                {lote.descripcion}
                              </MenuItem>
                            ))}
                        </Select>
                        {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                        {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="rechazado"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="standard" style={{ flex: 1 }}>
                        <div className="mt-2">
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            }
                            label={field.value ? "Sí Rechazado" : "No Rechazado"}
                          />
                        </div>
                        {!!error && error.type !== "min" && <FormHelperText>{error.type}</FormHelperText>}
                        {!!error && error.type === "min" && <FormHelperText>required</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start pl-10 pr-10 mt-3">
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="contenidoDefectuoso"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Contenido Defectuoso</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="accionCorrectiva"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Acción Correctiva</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start pl-10 pr-10 mt-3">
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="causaRaiz"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Causa Raíz</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div className="text-center sm:text-left m-5 flex-1">
                  <Controller
                    name="descripcionRechazo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Descripción del Rechazo</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
