import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ILinea, ITurno } from "app/models";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { ResponsableInicioLineaSliceRequests } from "app/Middleware/reducers/ResponsableInicioLineaSlice";
import { IResponsableInicioLinea } from "app/models/IResponsableInicioLinea";
import { ValidaSliceRequests } from "app/Middleware/reducers/ValidaSlice";
import { IValida } from "app/models/IValida";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";
import moment from "moment";

interface props {
  setOpenPopup: any;
  editState?: any;
  refresh?: any;
}

export const ParadasEditForm = ({ setOpenPopup, editState, refresh }: props) => {
  // console.log(editState);
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  interface initialState {
    fecha: string;
    turno: string;
    target: number;
    producidos: number;
    observacion: string;
    minutosPerdidos: number;
    lineaString: string;
    planta: string;
    motivoId: number;
    validaId: number;
    responsableInicioLineaId: number;
    lineaId: number;
  }

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editState
  });
  const { isDirty, isValid } = formState;

  //Leer
  const [lineasProduccion, setLineasProduccion] = useState<ILinea[] | null>([]);
  const getLineasProduccion = async () => {
    try {
      const result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      setLineasProduccion(result);
    } catch (error) {
      console.log(error);
    }
  };
  const [turnos, setTurnos] = useState<ITurno[] | null>(null);
  const getTurnos = async () => {
    try {
      const result = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
      setTurnos(result);
    } catch (error) {
      console.log(error);
    }
  };
  const [listResponsablesInicioLinea, setListResponsablesInicioLinea] = useState<IResponsableInicioLinea[] | null>([]);
  const getResponsablesInicioLinea = async () => {
    try {
      const result = unwrapResult(await dispatch(ResponsableInicioLineaSliceRequests.getAllRequest()));
      setListResponsablesInicioLinea(result);
    } catch (error) {
      console.log(error);
    }
  };
  const [listValida, setListValida] = useState<IValida[] | null>([]);
  const getValida = async () => {
    try {
      const result = unwrapResult(await dispatch(ValidaSliceRequests.getAllRequest()));
      setListValida(result);
    } catch (error) {
      console.log(error);
    }
  };

  //General
  useEffect(() => {
    getLineasProduccion();
    getTurnos();
    getResponsablesInicioLinea();
    getValida();
  }, []);

  //Guardar
  const loginSubmit = async (e) => {
    delete e.motivo;
    delete e.valida;
    delete e.responsableInicioLinea;
    delete e.linea;
    // console.log(e);
    const [month, day, year] = e.fecha.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const objeto = { ...e, fecha: moment(date.toISOString().slice(0, 10)).toDate() };
    // console.log(objeto);
    try {
      unwrapResult(await dispatch(ParadaSliceRequests.putRequest(objeto)));
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      console.log(x);
    }
  };

  //Fecha
  const onChangeFechaE = (fecha: string) => {
    setValue("fecha", fecha);
  };

  return (
    <div style={{ height: "100%", width: "80vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <SelectOfDate pickFecha setFechaProps={onChangeFechaE} fechaEdit={editState?.fecha} />
            {/* <Controller
              name="fecha"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  label="Fecha"
                  value={watchFecha}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              )}
            /> */}
          </div>
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="lineaId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea Produccion</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione una Linea de Produccion"
                    variant="standard"
                    /*    onClick={() => getFamiliasByLineaProduccion()} */
                  >
                    {lineasProduccion &&
                      lineasProduccion.map((x) => (
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
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="turno"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Turno</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione un Turno"
                    variant="standard"
                    /*    onClick={() => getFamiliasByLineaProduccion()} */
                  >
                    {turnos &&
                      turnos.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.abreviatura}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <Controller
              name="target"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Target"
                  variant="outlined"
                  type="number"
                  // disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {/* <Button
              className={classes.purpleButton}
              onClick={(e) => {
                if (watchLinea && watchTurno) {
                  setEditarTarget(!editarTarget);
                } else {
                  openNotificationUI("Seleccionar línea y turno!", "warning");
                }
              }}>
              {editarTarget == true ? "No Editar Target" : "Editar Target"}
            </Button> */}
            {/* <Button className={classes.blueButton} onClick={calcularInfoFL}>
              Calcular Info
            </Button> */}
          </div>

          <div>
            <Controller
              name="producidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Producidos"
                  variant="outlined"
                  type="number"
                  // disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          {/* <div>
            <Controller
              name="minutosDeLinea"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Minutos de Línea"
                  variant="outlined"
                  type="number"
                  // disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                />
              )}
            />
          </div> */}
          <div>
            <Controller
              name="minutosPerdidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  // disabled
                  label="Minutos Perdidos"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          {/* <div>
            <Controller
              name="minutosParados"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  // disabled
                  label="Minutos Parados"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div> */}
          {/* <div>
            <Button
              className={classes.yellowButton}
              onClick={(e) => {
                setOpenCargaMotivos(true);
                setMinutosPerdidosState(watchMinutosPerdidos);
              }}>
              Cargar Motivos
            </Button>
          </div> */}
        </div>
        <div style={{ padding: "20px" }}>
          <Controller
            name="observacion"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Observacion"
                variant="outlined"
                multiline
                error={!!error?.types}
                helperText={error?.type}
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="responsableInicioLineaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione un Responsable de linea</InputLabel>
                  <Select {...field} variant="standard">
                    {listResponsablesInicioLinea &&
                      listResponsablesInicioLinea.map((x) => (
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
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="validaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Valida</InputLabel>
                  <Select {...field} variant="standard">
                    {listValida &&
                      listValida.map((x) => (
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
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>

      {/* <ModalCompoment
        title={"Carga de Motivos. Minutos perdidos: " + minutosPerdidosState.toString()}
        openPopup={openCargaMotivos}
        setOpenPopup={setOpenCargaMotivos}>
        <CargaMotivosForm
          setOpenPopup={setOpenCargaMotivos}
          minutosPerdidos={minutosPerdidosState}
          setObjetoMotivo={setObjetoMotivo}
          defaultValues={defaultValues}
        />
      </ModalCompoment> */}
    </div>
  );
};
