import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ISector, ITurno } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { SectorSliceRequests } from "app/Middleware/reducers/SectorSlice";
import { InformesPISliceRequest } from "app/Middleware/reducers/InformesPISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
interface Props {
  dataEdit: any;
  setOpenPopup: any;
  refresh: any;
  plantId: number;
}
export const InformesPIForm = ({ dataEdit, setOpenPopup, refresh, plantId }: Props) => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const lineas = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const turnos = useAppSelector<ITurno[]>((state) => state.turno.dataAll);
  const sectores = useAppSelector<ISector[]>((state) => state.sector.dataAll);
  const [usuario, setUsuario] = useState("");
  interface initialState {
    fecha: string;
    desdeHora: Date | string;
    hastaHora: Date | string;
    turnoId: number;
    plantId: number;
    lineaProduccionId: number;
    sectorId: number;
    asunto: string;
    descripcion: string;
    solucion: string;
    userDni: number;
    usuario: string;
  }
  const initialStateVar = {
    fecha: moment().toDate(),
    desdeHora: moment().toDate(),
    hastaHora: moment().toDate(),
    turnoId: 1,
    plantId: plantId,
    lineaProduccionId: 0,
    sectorId: 0,
    asunto: "",
    descripcion: "",
    solucion: "",
    userDni: GetInfoUser().dni,
    usuario: ""
  };

  const { control, setValue, getValues, watch, formState, handleSubmit } = useForm<initialState>({
    defaultValues: dataEdit ? dataEdit : initialStateVar
  });
  const { isDirty, isValid } = formState;
  const fechaWatch = watch("fecha");
  const desdeHoraWatch = watch("desdeHora");
  const hastaHoraWatch = watch("hastaHora");
  const onSubmit = async (e) => {
    try {
      const objSubmit = {
        ...e,
        fecha: moment(fechaWatch).format("YYYY-MM-DD"),
        desdeHora: moment(getValues("desdeHora")).format("hh:mm a"),
        hastaHora: moment(getValues("hastaHora")).format("hh:mm a")
      };
      const response = dataEdit
        ? await dispatch(InformesPISliceRequest.PutRequest(objSubmit))
        : await dispatch(InformesPISliceRequest.PostRequest(objSubmit));
      dataEdit
        ? openNotificationUI("Se edito reporte correctamente", "success")
        : openNotificationUI("Se agrego reporte correctamente", "success");
      refresh();
      setOpenPopup(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
    console.log(getValues());
  };
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      console.log(response);
      setUsuario(response.name + " " + response.surname);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId));
  }, [plantId]);
  useEffect(() => {
    dispatch(TurnoSliceRequests.getAllRequest());
    dispatch(SectorSliceRequests.getAllRequest());
    getDataUser();
  }, []);
  useEffect(() => {
    TitleChanger("Informes de programación industrial");
  }, []);
  useEffect(() => {
    setValue("usuario", usuario);
  }, [usuario]);
  useEffect(() => {
    if (dataEdit) {
      const newHoraI = moment("2022-08-18 " + dataEdit.desdeHora);
      const newHoraF = moment("2022-08-18 " + dataEdit.hastaHora);
      setValue("desdeHora", newHoraI.toDate());
      setValue("hastaHora", newHoraF.toDate());
    }
  }, [dataEdit]);

  return (
    <div>
      <div className="m-1 sm:m-10 h-full">
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", height: "100%" }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <div className="w-full flex justify-evenly gap-4">
                {/* ----------------LINEA---------------*/}
                <FormControl fullWidth variant="outlined">
                  <InputLabel variant="filled">Seleccione una linea</InputLabel>
                  <Controller
                    name="lineaProduccionId"
                    control={control}
                    rules={{ required: "Seleccione una línea." }}
                    render={({ field }) => (
                      <Select className="pt-2" {...field}>
                        {lineas &&
                          lineas.map((linea) => (
                            <MenuItem key={linea.id} value={linea.id}>
                              <div className="w-full">
                                <div>{linea.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
                {/* ----------------Sector---------------*/}
                <FormControl fullWidth variant="outlined">
                  <InputLabel variant="filled">Seleccione un sector</InputLabel>
                  <Controller
                    name="sectorId"
                    control={control}
                    rules={{ required: "Seleccione una línea." }}
                    render={({ field }) => (
                      <Select className="pt-2" {...field}>
                        {sectores &&
                          sectores.map((sector) => (
                            <MenuItem key={sector.id} value={sector.id}>
                              <div className="w-full">
                                <div>{sector.name}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
                {/* ----------------FECHA---------------*/}
                <div className="text-center sm:text-left p-2">
                  <DesktopDatePicker
                    label="Fecha"
                    value={fechaWatch}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      setValue("fecha", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                </div>
                {/* ----------------HoraInicio---------------*/}
                <div className="text-center sm:text-left p-2">
                  <TimePicker
                    ampm
                    label="Hora de inicio"
                    value={desdeHoraWatch}
                    onChange={(e: any) => {
                      setValue("desdeHora", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                </div>

                {/* ----------------HoraFin---------------*/}
                <div className="text-center sm:text-left p-2">
                  <TimePicker
                    ampm
                    label="Hora de fin"
                    value={hastaHoraWatch}
                    onChange={(e: any) => {
                      setValue("hastaHora", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                </div>

                {/* ----------------TURNO---------------*/}
                <div className="text-center sm:text-left p-2">
                  <FormControl>
                    <FormLabel>Turno</FormLabel>
                    <Controller
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          {turnos &&
                            turnos.map((turno) => (
                              <FormControlLabel
                                key={turno.id}
                                value={turno.id}
                                control={<Radio />}
                                label={turno.nombre}
                              />
                            ))}
                        </RadioGroup>
                      )}
                      rules={{ required: true }}
                      control={control}
                      defaultValue={1}
                      name="turnoId"
                    />
                  </FormControl>
                </div>
              </div>
              <div className="flex justify-between gap-4">
                {/* --------------- Asunto---------------- */}
                <div className="my-3 w-full">
                  <Controller
                    name="asunto"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="filled" error={!!error}>
                        <TextField label="Asunto:" multiline maxRows={10} {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                {/* ---------------Descripción ---------------- */}
                <div className="my-3 w-full">
                  <Controller
                    name="descripcion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="filled" error={!!error}>
                        <TextField label="Descripción:" multiline maxRows={10} {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                {/* ---------------Solución ---------------- */}
                <div className="my-3 w-full">
                  <Controller
                    name="solucion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="filled" error={!!error}>
                        <TextField label="Solución:" multiline maxRows={10} {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
                <Button
                  className={classes.greenButton}
                  type="submit"
                  variant="contained"
                  disabled={!isDirty && !isValid}>
                  Guardar
                </Button>
              </div>
            </LocalizationProvider>
          </form>
        </div>
      </div>
    </div>
  );
};
