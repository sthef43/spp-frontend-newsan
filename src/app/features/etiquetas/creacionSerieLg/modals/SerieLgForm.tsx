import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Button,
  FormControlLabel,
  Switch,
  TextField
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { ISerieLg } from "app/models/ISerieLg";
import { SerieLgSliceRequests } from "app/Middleware/reducers/SerieLgSlice";
import moment from "moment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
interface props {
  setOpenPopup: any;
  editState?: ISerieLg | null;
  refresh?: any;
  estaEditando: any;
}

export const SerieLgForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  interface initialState {
    trazabilidad: string;
    generico: string; //familia
    modelo: string;
    fecha: string;
    impreso: boolean;
    usado: boolean;
  }
  const initialStateVar = {
    trazabilidad: "",
    generico: "", //familia
    modelo: "",
    fecha: "",
    impreso: true,
    usado: true
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Guadar Dato
  const loginSubmit = async (e) => {
    try {
      if (estaEditando) {
        unwrapResult(await dispatch(SerieLgSliceRequests.putRequest(e)));
        openNotificationUI("Actualizado...", "success");
      } else {
        unwrapResult(await dispatch(SerieLgSliceRequests.postRequest(e)));
        openNotificationUI("Guardado...", "success");
      }
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Watch
  const watchTrazabilidad = watch("trazabilidad");

  //Verificar Código
  const getTrazabilidad = async () => {
    try {
      if (!watchTrazabilidad) {
        openNotificationUI("Ingrese Trazabilidad a buscar.", "error");
      } else {
        const responses = unwrapResult(await dispatch(SerieLgSliceRequests.getByNroSrv(watchTrazabilidad)));
        if (responses) {
          openNotificationUI("Trazabilidad existe en base de datos.", "error");
        } else {
          openNotificationUI("Trazabilidad no encontrado.", "success");
        }
      }
    } catch (error) {
      openNotificationUI("Error al leer Trazabilidad.", "error");
    }
  };

  // Fecha
  const [fechaSelect, setfechaSelect] = useState(null);
  const onChangeFecha = (fecha: string) => {
    const fechaChange = moment(fecha).format("YYYY-MM-DD");
    setfechaSelect(fechaChange);
    setValue("fecha", fechaChange);
  };
  const establecerFecha = () => {
    if (estaEditando) {
      setfechaSelect(editState.fecha);
    } else {
      const today = new Date();
      const fechaEst = moment(today).format("YYYY-MM-DD");
      setfechaSelect(fechaEst);
      setValue("fecha", fechaEst);
    }
  };

  //SWITCH Destino
  const [checkedImpreso, setCheckedImpreso] = useState(true);
  const handleChangeImpreso = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedImpreso(event.target.checked);
    setValue("impreso", event.target.checked);
  };
  const [checkedUsado, setCheckedUsado] = useState(true);
  const handleChangeUsado = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedUsado(event.target.checked);
    setValue("usado", event.target.checked);
  };
  const establecerChecked = () => {
    if (estaEditando) {
      setCheckedImpreso(editState.impreso);
      setCheckedUsado(editState.usado);
    }
  };

  //Inicio
  useEffect(() => {
    establecerFecha();
    establecerChecked();
  }, []);

  return (
    <div style={{ height: "100%", width: "50vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)}>
        <div className="m-1 sm:m-5 h-full">
          <div className="grid grid-cols-3 gap-8" style={{ height: "100%" }}>
            <div className="py-2 m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="trazabilidad"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Trazabilidad</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Button
                onClick={getTrazabilidad}
                className={classes.purpleButton}
                variant="contained"
                style={{ marginTop: "10px" }}>
                Verificar
              </Button>
            </div>
            <div className="py-2 m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="generico"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="modelo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Modelo</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8" style={{ height: "100%", textAlign: "center" }}>
            <div className="py-2 m-2" style={{ flex: "1 1 90%" }}>
              <div style={{ width: "90%" }}>
                <DesktopDatePicker
                  label="Fecha"
                  value={fechaSelect}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    onChangeFecha(e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>
            </div>
            <div className="py-2 m-2 items-center" style={{ flex: "1 1 90%" }}>
              <InputLabel>Impreso</InputLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedImpreso}
                    onChange={handleChangeImpreso}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={checkedImpreso ? "Sí" : "No"}
              />
            </div>
            <div className="py-2 m-2" style={{ flex: "1 1 90%" }}>
              <InputLabel>Usado</InputLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedUsado}
                    onChange={handleChangeUsado}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={checkedUsado ? "Sí" : "No"}
              />
            </div>
          </div>
        </div>
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
