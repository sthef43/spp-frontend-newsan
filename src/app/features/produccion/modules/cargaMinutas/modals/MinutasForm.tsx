import { IMinutas } from "app/models/IMinutas";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { MinutasSliceRequests } from "app/Middleware/reducers/MinutasSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IAppUser } from "app/models";
import moment from "moment";
import { Button, Divider, FormControl, FormHelperText, TextField } from "@mui/material";

interface props {
  setOpenPopup: any;
  editState?: IMinutas | null;
  refresh?: any;
  estaEditando: any;
  linea: number;
  estaVisualizando: any;
}

export const MinutasForm = ({ setOpenPopup, editState, refresh, estaEditando, linea, estaVisualizando }: props) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  interface initialState {
    lineaId: number;
    appUserId: number;
    usuario: string;
    tema: string;
    causa: string;
    accion: string;
    departamento: string;
    cumplido: string;
    fechaMinuta: string;
    fechaCierre: string;
    semana: number;
  }
  const initialStateVar = {
    lineaId: 0,
    appUserId: 0,
    usuario: "",
    tema: "",
    causa: "",
    accion: "",
    departamento: "-",
    cumplido: "",
    fechaMinuta: "",
    fechaCierre: "",
    semana: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  //Guardar Remito *****************************
  const loginSubmit = async (e) => {
    if (fechaCierre < fechaMinuta) {
      openNotificationUI("Fecha Cierre Inferior a Fecha Minuta", "error");
      return;
    }

    try {
      if (estaEditando) {
        const objectEdit = {
          ...e,
          appUserId: infoUser.id,
          fechaMinuta: moment(fechaMinuta).format(),
          fechaCierre: moment(fechaCierre).format()
        };
        delete objectEdit.appUser;
        delete objectEdit.linea;
        unwrapResult(await dispatch(MinutasSliceRequests.PutRequest(objectEdit)));
      } else {
        const objectSubmit = {
          lineaId: linea,
          appUserId: infoUser.id,
          tema: e.tema,
          causa: e.causa,
          accion: e.accion,
          departamento: e.departamento,
          cumplido: e.cumplido == "" ? "SB" : e.cumplido,
          fechaMinuta: moment(fechaMinuta).format(),
          fechaCierre: moment(fechaCierre).format(),
          semana: e.semana
        };
        unwrapResult(await dispatch(MinutasSliceRequests.PostRequest(objectSubmit)));
      }
      refresh();
      setOpenPopup(false);
    } catch (error) {
      openNotificationUI("Error al guardar", "error");
    }
  };

  //Fecha Minuta
  const [fechaMinuta, setFechaMinuta] = useState(null);
  //Fecha Cierre
  const [fechaCierre, setFechaCierre] = useState(null);
  //Estados Botones
  const [estado, setEstado] = useState<string>("SB");
  useEffect(() => {
    if (estaEditando) {
      setValue("usuario", editState.appUser.operator.name + " " + editState.appUser.operator.surname);
      setFechaMinuta(moment(editState.fechaMinuta).format("MM-DD-YYYY"));
      setFechaCierre(moment(editState.fechaCierre).format("MM-DD-YYYY"));
      setEstado(editState.cumplido);
    } else {
      setValue("usuario", infoUser.operator.name + " " + infoUser.operator.surname);
      setFechaMinuta(moment().format("MM-DD-YYYY"));
      setFechaCierre(moment().format("MM-DD-YYYY"));
    }
  }, [editState]);

  //Calcular semana
  const calcularSemana = () => {
    setValue("semana", moment(fechaCierre).week()); //26
  };
  useEffect(() => {
    if (fechaCierre) {
      calcularSemana();
    }
  }, [fechaCierre]);

  //Cumplir
  const setCumplir = (x: string) => {
    setEstado(x);
    setValue("cumplido", x);
    setValue("fechaCierre", moment().format("L"));
    if (getValues("departamento") == "-") {
      setValue("departamento", "");
    }
    calcularSemana();
  };

  //Cancelar
  const cancelar = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <div style={{ height: "100%", width: "50vw", position: "relative" }}>
        <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
          {/* Fecha Tema */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px"
            }}>
            <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
              <FormControl disabled={estaVisualizando}>
                <SelectOfDate pickFecha fechaEdit={editState?.fechaMinuta} setFechaProps={setFechaMinuta} />
              </FormControl>
            </div>
            <div style={{ flex: 3, textAlign: "center", padding: "10px", alignContent: "center" }}>
              <Controller
                name="tema"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Tema"
                      variant="standard"
                      type="text"
                      {...field}
                      disabled={estaVisualizando}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          {/* Operador AnalisisCausa */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px"
            }}>
            <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
              <Controller
                name="usuario"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField fullWidth label="Operador" variant="standard" type="text" disabled={true} {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div style={{ flex: 3, textAlign: "center", padding: "10px" }}>
              <Controller
                name="causa"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Análisis de Causa"
                      variant="standard"
                      type="text"
                      {...field}
                      disabled={estaVisualizando}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          {/* Acciones Botones */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px"
            }}>
            <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
              <Controller
                name="accion"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Acciones"
                      variant="standard"
                      type="text"
                      {...field}
                      disabled={estaVisualizando}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>

            <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
              <div style={{ display: "flex", textAlign: "center", padding: "10px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>Cumplida</div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  {estado == "OK" ? (
                    <Button
                      className={classes.greenButton}
                      onClick={(x) => setCumplir("OK")}
                      variant="contained"
                      disabled={estaVisualizando}>
                      OK
                    </Button>
                  ) : (
                    <Button onClick={(x) => setCumplir("OK")} variant="outlined" disabled={estaVisualizando}>
                      OK
                    </Button>
                  )}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  {estado == "NG" ? (
                    <Button
                      className={classes.redButton}
                      onClick={(x) => setCumplir("NG")}
                      variant="contained"
                      disabled={estaVisualizando}>
                      NG
                    </Button>
                  ) : (
                    <Button onClick={(x) => setCumplir("NG")} variant="outlined" disabled={estaVisualizando}>
                      NG
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: "3%", paddingBottom: "3%" }}>
            <Divider />
          </div>

          {/* FechaCierre Departamento Semana */}
          {estado != "SB" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%"
                }}>
                <div style={{ flex: 1, textAlign: "center", alignContent: "end" }}>
                  <h5>Fecha de Cierre</h5>
                </div>
                <div style={{ flex: 2, textAlign: "center", alignContent: "center" }}></div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px"
                }}>
                <div style={{ flex: 1, textAlign: "center", paddingLeft: "3%", paddingRight: "3%" }}>
                  <SelectOfDate pickFecha fechaEdit={editState?.fechaCierre} setFechaProps={setFechaCierre} />
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    alignContent: "center",
                    paddingLeft: "3%",
                    paddingRight: "3%"
                  }}>
                  <Controller
                    name="departamento"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <TextField
                          fullWidth
                          label="Departamento"
                          variant="standard"
                          type="text"
                          {...field}
                          disabled={estaVisualizando}
                        />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    alignContent: "center",
                    paddingLeft: "3%",
                    paddingRight: "3%"
                  }}>
                  <Controller
                    name="semana"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <TextField fullWidth label="Semana" variant="standard" type="text" disabled={true} {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Botones Aceptar Cancelar */}
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%", marginTop: "3%" }}>
            <Button
              className={classes.redButton}
              onClick={cancelar}
              variant="contained"
              disabled={(!isDirty && !isValid) || estaVisualizando}>
              Cancelar
            </Button>
            <Button
              className={classes.greenButton}
              type="submit"
              variant="contained"
              disabled={(!isDirty && !isValid) || estaVisualizando}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
