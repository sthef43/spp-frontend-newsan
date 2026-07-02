import React, { useEffect, useState } from "react";
import { IMotivo } from "app/models/IMotivo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { MotivoSliceRequests } from "app/Middleware/reducers/MotivoSlice";
import { useAppDispatch } from "app/core/store/store";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { CargaMotivosForm } from "../../../../informes/Modules/cargaEficienciaPlanta/modals/CargaMotivosForm";
import { useForm, Controller } from "react-hook-form";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { ITurno } from "app/models";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ResponsableInicioLineaSliceRequests } from "app/Middleware/reducers/ResponsableInicioLineaSlice";
import { ValidaSliceRequests } from "app/Middleware/reducers/ValidaSlice";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";

interface props {
  rowSelected: any; //Es el registro que selecciono al apreta la accion.
  plantaSelected: string; //Nombre de la planta seleccionada.
  fecha: Date; //Fecha que inserta para buscar el listado.
  refresh: any; //Funcion para refrescar el listado principal.
  setOpenModalAccionMotivos: any; //Funcion para cerrar modal.
}

export const CargaMotivosAccion = ({
  rowSelected,
  plantaSelected,
  fecha,
  refresh,
  setOpenModalAccionMotivos
}: props) => {
  const [openModalCargaMotivos, setOpenModalCargaMotivos] = useState(false);
  const dispatch = useAppDispatch();
  const [objetoMotivo, setObjetoMotivo] = useState<IMotivo>(null);
  const [turnos, setTurnos] = useState<ITurno[]>(null);
  const { openNotificationUI } = useNotificationUI();
  const [listResponsablesInicioLinea, setListResponsablesInicioLinea] = useState([]);
  const [listValida, setListValida] = useState([]);

  useEffect(() => {
    getTurnos();
    getResponsablesInicioLinea();
    getValida();
  }, []);

  interface initialState {
    observacion: string;
    responsableId: number;
    validaId: number;
    fecha: Date;
    turno: number;
    producidos: number;
    minutosPerdidos: number;
    minutosParados: number;
    responsableInicioLineaId: number;
    target: number;
    lineaString: string;
    motivoId: number;
  }
  const initialStateVar = {
    observacion: rowSelected.declaredQuantity >= rowSelected.expectedQuantity ? "Target Superado." : "",
    responsableId: 0,
    validaId: 0,
    fecha: fecha,
    turno: 0,
    producidos: rowSelected.declaredQuantity,
    minutosPerdidos: rowSelected.minutos,
    minutosParados: 0,
    responsableInicioLineaId: 0,
    target: rowSelected.expectedQuantity,
    lineaString: rowSelected.lineName,
    planta: plantaSelected,
    lineaId: null,
    motivoId: 0
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;
  const watchFecha = watch("fecha");
  const classes = MaterialButtons();

  const getResponsablesInicioLinea = async () => {
    const resultFetch = unwrapResult(await dispatch(ResponsableInicioLineaSliceRequests.getAllRequest()));
    if (resultFetch) {
      setListResponsablesInicioLinea(resultFetch);
    }
  };

  const getValida = async () => {
    const resultFetch = unwrapResult(await dispatch(ValidaSliceRequests.getAllRequest()));
    if (resultFetch) {
      setListValida(resultFetch);
    }
  };

  const puedeGuardar = () => {
    if (getValues("responsableInicioLineaId") == 0) return false;

    if (getValues("validaId") == 0) return false;

    return true;
  };

  const loginSubmit = async () => {
    if (!puedeGuardar()) {
      openNotificationUI("Faltan cargar campos.", "error");
      return false;
    }
    //Si los minutos es 0, no carga los motivos.
    if (!objetoMotivo && rowSelected.minutos > 0) {
      openNotificationUI("Falta cargar los motivos", "error");
    }

    let objetoMotivoGuardadoId = null;
    //Si los minutos parados son > 0, guarda el objeto motivo.
    if (rowSelected.minutos > 0) {
      //Guardo el objeto Motivo.
      objetoMotivoGuardadoId = await guardarMotivo();
      if (!objetoMotivoGuardadoId) {
        openNotificationUI("Error al guardar motivo", "error");
        return false;
      }
    }

    //Creo le object parada.
    const objectParada = { ...getValues() };
    //Si hay minutos parados, guarde el motivo, entonces le asigno la relacion.
    objectParada.motivoId = rowSelected.minutos > 0 ? objetoMotivoGuardadoId : null;
    guardarParadada(objectParada);
  };

  const guardarParadada = async (objectParada) => {
    const result = unwrapResult(await dispatch(ParadaSliceRequests.postRequest(objectParada)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenModalAccionMotivos(false);
      refresh();
    } else {
      openNotificationUI("Error al guardar :(", "error");
    }
  };

  const getTurnos = async () => {
    const result = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
    setTurnos(result);
  };
  const guardarMotivo = async () => {
    const result = unwrapResult(await dispatch(MotivoSliceRequests.postRequest(objetoMotivo)));
    if (result) return result.id;
    else return null;
  };

  return (
    <div>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <Controller
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
                  disabled={true}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="producidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  disabled={true}
                  label="Producidos"
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
          <div>
            <Controller
              name="minutosPerdidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  disabled
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
          <div>
            <Button
              className={classes.yellowButton}
              onClick={(e) => {
                setOpenModalCargaMotivos(true);
              }}>
              Cargar Motivos
            </Button>
          </div>
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
      <ModalCompoment
        openPopup={openModalCargaMotivos}
        setOpenPopup={setOpenModalCargaMotivos}
        title="Carga de motivos">
        <CargaMotivosForm
          setOpenPopup={setOpenModalCargaMotivos}
          minutosPerdidos={rowSelected.minutos}
          setObjetoMotivo={setObjetoMotivo}
          defaultValues={null}
        />
      </ModalCompoment>
    </div>
  );
};
