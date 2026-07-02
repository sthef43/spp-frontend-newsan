import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import {
  Button,
  Checkbox,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IAreaTraza } from "app/models/IAreaTraza";
import { AreaTrazaSliceRequests } from "app/Middleware/reducers/AreaTrazaSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Info } from "@mui/icons-material";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { ILineaProduccionFamilia } from "app/models";
import { IModelo } from "app/models/IModelo";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";

interface props {
  setOpenPopup: any;
  editState: any;
  refresh: any;
  data: any;
  plantId: number;
}
export const ParadasDeLineaForm = ({ setOpenPopup, editState, refresh, data, plantId }: props) => {
  const [discontinuo, setDiscontinuo] = useState(false);
  const [familias, setFamilias] = useState<ILineaProduccionFamilia[]>([]);
  const [modelos, setModelos] = useState<IModelo[]>([]);
  const [supervisor, setSupervisor] = useState("");
  const [diferencia, setdiferencia] = useState("La diferencia es: 0");
  const [minutos, setMinutos] = useState(0);
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  interface initialState {
    lineaProduccionId: number;
    plantId: number;
    familiaId: number;
    modeloId: number;
    turnoId: number;
    areaTrazaId: number;
    userDni: number;
    discontinuo: boolean;
    fecha: Date;
    horaInicio: Date | string;
    fechaFin: Date;
    horaFin: Date | string;
    minutos: number;
    causa: string;
    supervisor: string;
  }
  const initialStateVar = {
    lineaProduccionId: data?.lineaProduccionId,
    plantId: plantId,
    familiaId: editState?.familiaId || 0,
    modeloId: 0,
    turnoId: data.turno,
    areaTrazaId: 0,
    userDni: GetInfoUser().dni,
    discontinuo: discontinuo,
    fecha: moment().toDate(),
    horaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    horaFin: moment().toDate(),
    minutos: 0,
    causa: "",
    supervisor: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editState ? editState : initialStateVar
  });
  const { State: ListOfAreas } = useFetchApi<IAreaTraza[]>(AreaTrazaSliceRequests.getAllRequest);
  const getAllFamilias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(
        await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(data.lineaProduccionId))
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setFamilias(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getAllModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(getValues("familiaId"))));
      setModelos(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      if (response) {
        setSupervisor(response.name + " " + response.surname);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getFamiliaProducida = async () => {
    try {
      const response = unwrapResult(await dispatch(InicioSliceRequests.getFamiliaByCN(data?.codigoNewsan)));
      const fam = familias?.find((f) => f.familia.nombre.toLowerCase().trim() == response.toLowerCase().trim());
      setValue("familiaId", fam?.familia.id || 0);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getModeloProducido = async () => {
    try {
      const response = unwrapResult(await dispatch(InicioSliceRequests.getModeloProducidoByCN(data?.codigoNewsan)));
      const model = modelos?.find((f) => f.nombre.toLowerCase().trim() == response.toLowerCase().trim());
      setValue("modeloId", model?.id || 0);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const { isDirty, isValid, errors } = formState;

  const onSubmitPDL = async (e) => {
    try {
      const objSubmit = {
        ...e,
        fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
        horaInicio: moment(getValues("horaInicio")).format("hh:mm a"),
        horaFin: moment(getValues("horaFin")).format("hh:mm a"),
        fechaFin: moment(getValues("fechaFin")).format("YYYY-MM-DD")
      };
      if (editState) {
        delete objSubmit.areaTraza;
        delete objSubmit.turno;
        delete objSubmit.modelo;
      }
      const response = editState
        ? await dispatch(ParadasDeLineaSliceRequests.PutRequest(objSubmit))
        : await dispatch(ParadasDeLineaSliceRequests.PostRequest(objSubmit));
      editState
        ? openNotificationUI("Se edito la parada de linea correctamente", "success")
        : openNotificationUI("Se agrego la parada de linea correctamente", "success");
      refresh();
      setOpenPopup(false);
      if (!editState) sendEmail(objSubmit);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const sendEmail = async (objSubmit) => {
    const area = ListOfAreas.find((x) => x.id == getValues("areaTrazaId"));
    const param = {
      fecha: moment(getValues("fecha")).format("DD-MM-YYYY"),
      fechaFin: moment(getValues("fechaFin")).format("DD-MM-YYYY"),
      hsInicio: objSubmit.horaInicio,
      hsFin: objSubmit.horaFin,
      causa: objSubmit.causa,
      supervisor: objSubmit.supervisor,
      lineaProduccionId: objSubmit.lineaProduccionId,
      minutos: objSubmit.minutos,
      plantId: plantId,
      sectr: area.nombre,
      disc: objSubmit.discontinuo ? "Si" : "No"
    };
    await dispatch(EmailSliceRequest.EmailParadaLinea(param));
  };

  const watchHoraInicio = watch("horaInicio");
  const watchHorafin = watch("horaFin");
  const fecha = watch("fecha");
  const fechaFin = watch("fechaFin");
  const familiaWatch = watch("familiaId");

  useEffect(() => {
    if (editState) {
      setDiscontinuo(editState.discontinuo);
      getAllModelos();
      const newHoraI = moment("2022-08-18 " + editState.horaInicio);
      const newHoraF = moment("2022-08-18 " + editState.horaFin);
      setValue("horaInicio", newHoraI.toDate());
      setValue("horaFin", newHoraF.toDate());
    }
  }, [editState]);

  const validarFechas = (desde, hasta) => {
    return desde <= hasta;
  };

  useEffect(() => {
    if (fecha && fechaFin) {
      if (!validarFechas(fecha, fechaFin)) {
        openNotificationUI("La fecha fin no puede ser mayor a la fecha", "warning");
        setValue("fechaFin", fecha);
      } else calcularMinutos();
    }
  }, [fechaFin]);

  useEffect(() => {
    if (fecha && fechaFin) {
      if (!validarFechas(fecha, fechaFin)) {
        openNotificationUI("La fecha fin no puede ser mayor a la fecha", "warning");
        setValue("fecha", fechaFin);
      } else calcularMinutos();
    }
  }, [fecha]);

  const calcularMinutos = () => {
    const a = moment(getValues("horaInicio"));
    const b = moment(getValues("horaFin"));

    const fechaAuxiliar = moment(moment(getValues("fecha")).format("YYYY-MM-DD"), "YYYY-MM-DD");
    const fechaFinAuxiliar = moment(moment(getValues("fechaFin")).format("YYYY-MM-DD"), "YYYY-MM-DD");
    const differenceDays = fechaFinAuxiliar.diff(fechaAuxiliar, "days");

    const fechasCorrectas = validarFechas(fechaAuxiliar, fechaFinAuxiliar);

    if (!fechasCorrectas) {
      openNotificationUI("La fecha fin no puede ser mayor a la fecha.", "warning");

      return false;
    }
    if (a > b) {
      b.add(1, "days");
      const difference = moment.duration(b.diff(a));
      const hora = difference.get("hours");
      const minutos = difference.get("minutes");
      hora != 0
        ? setdiferencia(`La diferencia es de ${hora} hora/s con ${minutos} minuto/s`)
        : setdiferencia(`La diferencia es de ${minutos} minuto/s`);
      const min = hora / 60 + minutos;
      setMinutos(min | 0);
    } else {
      const dife1 = moment.duration(b.diff(a));
      const hora1 = dife1.get("hours") + (differenceDays == 0 ? 0 : differenceDays * 24);
      const minutos1 = dife1.get("minutes");
      hora1 != 0
        ? setdiferencia(`La diferencia es de ${hora1} hora/s con ${minutos1} minuto/s`)
        : setdiferencia(`La diferencia es de ${minutos1} minuto/s`);
      const min1 = hora1 * 60 + minutos1;
      setMinutos(min1 | 0);
    }
  };

  useEffect(() => {
    calcularMinutos();
  }, [watchHoraInicio, watchHorafin]);
  useEffect(() => {
    if (getValues("familiaId") != 0) {
      getAllModelos();
    }
  }, [familiaWatch]);

  useEffect(() => {
    getAllFamilias();
    getDataUser();
  }, []);
  useEffect(() => {
    modelos.length > 0 && !editState && getModeloProducido();
  }, [modelos]);
  useEffect(() => {
    familias.length > 0 && !editState && getFamiliaProducida();
  }, [familias]);

  useEffect(() => {
    setValue("minutos", minutos);
  }, [minutos]);

  useEffect(() => {
    setValue("supervisor", supervisor);
  }, [supervisor]);

  useEffect(() => {
    if (editState) {
      const fec = moment(editState.fecha).toDate();
      setValue("fecha", fec);
      const fecFin = moment(editState.fechaFin).toDate();
      setValue("fechaFin", fecFin);
    }
  }, [editState]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(onSubmitPDL)} style={{ width: "100%", height: "100%" }}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className="flex flex-col" style={{ height: "100%" }}>
            <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
              {familias && (
                <Controller
                  name="familiaId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="filled" error={!!error}>
                      <InputLabel>Seleccione una familia</InputLabel>
                      <Select {...field} variant="filled">
                        {familias &&
                          familias.map((x) => (
                            <MenuItem key={x.id} value={x.familiaId}>
                              <div className="w-full">
                                <div>{x.familia.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && (
                        <FormHelperText>
                          {error.type && error.type == "min" && <h1> Tiene que seleccionar una linea</h1>}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              )}
              {modelos && (
                <Controller
                  rules={{ required: true, min: 1 }}
                  name="modeloId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="filled" error={!!error}>
                      <InputLabel>Seleccione un modelo</InputLabel>
                      <Select {...field} variant="filled">
                        {modelos &&
                          modelos.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && (
                        <FormHelperText>
                          {" "}
                          {error.type && error.type == "min" && <h1> Tiene que seleccionar un modelo</h1>}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              )}
              {/* ----------------Areas ---------------- */}
              <div style={{ display: "flex" }}>
                <div style={{ width: "30%", marginRight: "60px" }}>
                  {ListOfAreas && (
                    <Controller
                      rules={{ required: true }}
                      name="areaTrazaId"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="filled" error={!!error}>
                          <InputLabel>Seleccione un area</InputLabel>
                          <Select {...field} variant="filled">
                            {ListOfAreas &&
                              ListOfAreas.map((x) => (
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
                  )}
                </div>
                <div style={{ width: "30%" }}>
                  <FormControlLabel
                    label="Discontinuo?"
                    control={
                      <Controller
                        name={"discontinuo"}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={discontinuo}
                            onClick={() => {
                              setDiscontinuo(!discontinuo);
                            }}
                            {...field}
                          />
                        )}
                      />
                    }
                  />
                  <Tooltip title="No afecta a la producción?">
                    <IconButton>
                      <Info color="info" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div style={{ width: "30", marginRight: "10px" }}>
                <DesktopDatePicker
                  label="Fecha Inicio"
                  value={fecha}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
                    console.log(typeof e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <TimePicker
                  ampm
                  label="Hora de inicio"
                  value={watchHoraInicio}
                  onChange={(e: any) => {
                    setValue("horaInicio", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>
              <div style={{ width: "30", marginRight: "10px" }}>
                <DesktopDatePicker
                  label="Fecha Fin"
                  value={fechaFin}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fechaFin", e);
                    console.log("meti esto ");
                    console.log(e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <TimePicker
                  ampm
                  label="Hora de fin"
                  value={watchHorafin}
                  onChange={(e: any) => {
                    setValue("horaFin", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>
            </div>
            <div className="w-full p-2">
              <TextField variant="filled" disabled label={diferencia} fullWidth />
            </div>
            <div className="my-3">
              <Controller
                name="causa"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="filled" error={!!error}>
                    <InputLabel> Causa: </InputLabel>
                    <FilledInput {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
              <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
                Guardar
              </Button>
            </div>
          </div>
        </LocalizationProvider>
      </form>
    </div>
  );
};
