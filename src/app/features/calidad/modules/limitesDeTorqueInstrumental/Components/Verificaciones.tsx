import { Button, Divider, FormControl, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LimitesSliceRequests } from "app/Middleware/reducers/LimitesSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILimites } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { InfoVerificacion } from "./InfoVerificacion";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

import { Info } from "@mui/icons-material";
import moment from "moment";
import { LimitesTrazaSliceRequests } from "app/Middleware/reducers/LimitesTrazaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";

interface props {
  limite: number;
  callback: any;
  refresh: () => void;
}

const initialState = {
  v1: false,
  v2: false,
  v3: false,
  v4: false,
  observaciones: "",
  correccion: ""
};

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2
  }
}));
//DIALOG QUE USA EL OPERARIO DE CALIDAD PARA HACER EL CONTROL DE TORQUES
export const Verificaciones = ({ limite, callback, refresh }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const [limiteFull, setLimiteFull] = React.useState<ILimites>();
  const [showInfo, setShowInfo] = React.useState<boolean>(false);
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const textColorSx = { color: darkMode ? "rgba(250, 250, 250, 0.9)" : "#c80f4d" };

  const { control, getValues } = useForm({
    defaultValues: initialState
  });

  const onInit = async () => {
    let fetchLimiteResult;
    try {
      fetchLimiteResult = unwrapResult(await dispatch(LimitesSliceRequests.getByIdRequest(limite)));
    } catch (error) {
      fetchLimiteResult = null;
    }
    if (fetchLimiteResult) {
      setLimiteFull(fetchLimiteResult);
    }
  };

  const handleCancelar = () => {
    callback(false);
  };

  const getTurno = (): string => {
    const horaActual = moment();
    const beginningTime = moment("6:00", "h:mm");
    const endTime = moment("15:00", "h:mm");

    if (horaActual.isBefore(endTime) && horaActual.isAfter(beginningTime)) {
      return "M";
    }
    return "T";
  };
  const getDataUser = async (): Promise<string> => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      return response.name + " " + response.surname;
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const handleGuardar = async () => {
    //creo un nuevo limite para guardarlo
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const userName = await getDataUser();
      const nuevoLimiteTraza = {
        observaciones: getValues("observaciones"),
        correccion: getValues("correccion"),
        verificacion1: getValues("v1"),
        verificacion2: getValues("v2"),
        verificacion3: getValues("v3"),
        verificacion4: getValues("v4"),
        limitesId: limiteFull?.id,
        identificadorLinea: limiteFull?.identificadorLinea,
        turno: getTurno(),
        createdDate: moment().toDate().toISOString(),
        userDni: GetInfoUser().dni,
        userName,
        fecha: moment().toDate()
      };
      const result = await dispatch(LimitesTrazaSliceRequests.PostRequest(nuevoLimiteTraza));
      openNotificationUI("Verificación guardada con éxito.", "success");
      refresh();
      callback(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  React.useEffect(() => {
    onInit();
  }, []);

  return (
    <div>
      {limiteFull && (
        <div style={{ width: "80vw" }}>
          <div className="text-right space-x-3">
            <Button size="small" sx={textColorSx} variant="text" onClick={() => setShowInfo(!showInfo)}>
              <Info />
              Info
            </Button>
          </div>
          {showInfo && (
            <div className="animate__animated animate__fadeIn">
              <InfoVerificacion limiteFull={limiteFull} />
            </div>
          )}

          <Divider />
          <div className="grid grid-cols-1 text-lg font-semibold gap-2">
            <div className="underline underline-offset-1">Verificaciones: </div>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-4 grid-cols-1">
            <div className="grid sm:grid-cols-2 grid-cols-1">
              <div className="grid grid-cols-1 row-auto">
                <FormControl variant="standard">
                  <Controller
                    render={({ field }) => (
                      <FormGroup {...field}>
                        <FormControlLabel control={<Android12Switch />} label="Verificación 1" />
                      </FormGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue={false}
                    name="v1"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <Controller
                    render={({ field }) => (
                      <FormGroup {...field}>
                        <FormControlLabel control={<Android12Switch />} label="Verificación 2" />
                      </FormGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue={false}
                    name="v2"
                  />
                </FormControl>
              </div>
              <div className="grid grid-cols-1 row-auto">
                <FormControl variant="standard">
                  <Controller
                    render={({ field }) => (
                      <FormGroup {...field}>
                        <FormControlLabel control={<Android12Switch />} label="Verificación 3" />
                      </FormGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue={false}
                    name="v3"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <Controller
                    render={({ field }) => (
                      <FormGroup {...field}>
                        <FormControlLabel control={<Android12Switch />} label="Verificación 4" />
                      </FormGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue={false}
                    name="v4"
                  />
                </FormControl>
              </div>
            </div>
            <div className="grid grid-cols-1 row-auto mb-3">
              <Controller
                name="observaciones"
                control={control}
                rules={{ required: true, minLength: 2 }}
                render={({ field }) => <TextField {...field} label="Observaciones" variant="standard" />}
              />
              <Controller
                name="correccion"
                control={control}
                rules={{ required: true, minLength: 2 }}
                render={({ field }) => <TextField {...field} label="Corrección" variant="standard" />}
              />
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
              Guardar
            </Button>
            <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
