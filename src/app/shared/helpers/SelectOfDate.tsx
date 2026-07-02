/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "@mui/material";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect } from "react";

interface ISelectOfDate {
  fechaDesdeHasta?: boolean;
  horaDesdeHasta?: boolean;
  pickHora?: boolean;
  pickFecha?: boolean;
  deactivateLabel?: boolean;
  label?: string;
  setFechaDesdeProps?: (fecha: string) => void;
  setFechaHastaProps?: (fecha: string) => void;
  setHoraDesdeProps?: (hora: string) => void;
  setHoraHastaProps?: (hora: string) => void;
  setHoraProps?: (hora: string) => void;
  setFechaProps?: (hora: string) => void;
  fechaEdit?: string;
  estilosPredeterminados?: boolean;
  setErrorProps?: (hora: boolean) => void;
  children?: JSX.Element;
  stylesForSelects?: "outlined" | "standard" | "filled";
}

/**Las variables booleanas son para condicionar la visualizacion de los picks
 * SetStates : todos son para poder manejar el estado y poder acceder al valor. Se espera un 'SetState'
 * @param fechaDesdeHasta?: boolean;
 * @param horaDesdeHasta?: boolean;
 * @param pickHora?: boolean;
 * @param pickFecha?: boolean;
 * @param setFechaDesdeProps?: (fecha: string) => void;
 * @param setFechaHastaProps?: (fecha: string) => void;
 * @param setHoraDesdeProps?: (hora: string) => void;
 * @param setHoraHastaProps?: (hora: string) => void;
 * @param setHoraProps?: (hora: string) => void;
 * @param setFechaProps?: (hora: string) => void;
 * @param fechaEdit?:  string; pasar fecha para seter por default;
 * @param setErrorProps?: (error: boolean) => void; Para manejar el error en booleano
 * @param children?: JSX.Element; Si es necesario un select/componente, se puede renderizar dentro para que quede todo bien distribuido
 * @returns Selección de fecha|hora|horaDesdeHasta|fechaDesdeHasta
 */
export const SelectOfDate = (props: ISelectOfDate): JSX.Element => {
  const {
    fechaDesdeHasta,
    setFechaDesdeProps,
    setFechaHastaProps,
    horaDesdeHasta,
    setHoraDesdeProps,
    setHoraHastaProps,
    pickHora,
    pickFecha,
    setHoraProps,
    setFechaProps,
    fechaEdit,
    setErrorProps,
    children,
    estilosPredeterminados,
    label,
    stylesForSelects,
    deactivateLabel
  } = props;
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const [fechaDesde, setFechaDesde] = React.useState(dayjs().toDate());
  const [fechaHasta, setFechaHasta] = React.useState(dayjs().toDate());
  const [fecha, setFecha] = React.useState(dayjs(fechaEdit).toDate() || dayjs().toDate());
  const [horaDesde, setHoraDesde] = React.useState(dayjs().toDate());
  const [horaHasta, setHoraHasta] = React.useState(dayjs().toDate());
  const [hora, setHora] = React.useState(dayjs().toDate());

  const handleFechaDesdeChange = (fecha: any) => {
    if (fecha <= dayjs(fechaHasta)) {
      setErrorIzq("");
      setErrorDerecha("");
    } else {
      setErrorIzq("La fecha desde debe ser anterior a la fecha hasta.");
    }
    setFechaDesde(fecha);
  };

  const handleFechaHastaChange = (fecha: any) => {
    if (dayjs(fecha).format("L") < dayjs(fechaDesde).format("L")) {
      setErrorDerecha("La fecha hasta debe ser posterior a la fecha desde.");
    } else {
      setErrorDerecha("");
      setErrorIzq("");
    }
    setFechaHasta(fecha);
  };

  const handleFechaChange = (fecha: any) => {
    setFecha(fecha);
  };

  const handleHoraDesdeChange = (hora: any) => {
    if (hora <= dayjs(horaHasta)) {
      setErrorIzq("");
      setErrorDerecha("");
    } else {
      setErrorIzq("La hora desde debe ser inferior a la hora hasta.");
    }
    setHoraDesde(hora);
  };

  const handleHoraHastaChange = (hora: any) => {
    if (hora < dayjs(horaHasta)) {
      setErrorDerecha("La hora hasta debe ser superior a la hora desde.");
    } else {
      setErrorDerecha("");
      setErrorIzq("");
    }
    setHoraHasta(hora);
  };
  const handleHoraChange = (hs: any) => {
    setHora(hs);
  };

  useEffect(() => {
    if (fechaDesdeHasta) {
      setFechaDesdeProps(dayjs(fechaDesde).format("MM-DD-YYYY"));
    }
  }, [fechaDesde]);

  useEffect(() => {
    if (fechaDesdeHasta) {
      setFechaHastaProps(dayjs(fechaHasta).format("MM-DD-YYYY"));
    }
  }, [fechaHasta]);

  useEffect(() => {
    if (horaDesdeHasta) {
      setHoraDesdeProps(dayjs(horaDesde).format("HH:mm:ss"));
    }
  }, [horaDesde]);

  useEffect(() => {
    if (horaDesdeHasta) {
      setHoraHastaProps(dayjs(horaHasta).format("HH:mm:ss"));
    }
  }, [horaHasta]);

  useEffect(() => {
    if (pickHora) {
      setHoraProps(dayjs(hora).format("HH:mm:ss"));
    }
  }, [hora]);

  useEffect(() => {
    if (pickFecha) {
      setFechaProps(dayjs(fecha).format("MM-DD-YYYY"));
    }
  }, [fecha]);

  useEffect(() => {
    if (errorIzq.length > 0 || errorDerecha.length > 0) {
      setErrorProps && setErrorProps(true);
    } else {
      setErrorProps && setErrorProps(false);
    }
  }, [errorIzq, errorDerecha]);

  return (
    <div
      className={`${
        estilosPredeterminados
          ? "sm:flex md:flex font-semibold"
          : "sm:flex md:flex w-full items-center justify-around font-semibold"
      }`}>
      {fechaDesdeHasta && (
        <>
          {/* ----------------FECHA DESDE--------------- */}
          <div className={stylesForSelects ? "text-center sm:text-left p-2 w-full" : "text-center sm:text-left p-2"}>
            <DesktopDatePicker
              label="Fecha Desde"
              value={fechaDesde}
              inputFormat="DD/MM/YYYY"
              onChange={(e: any) => {
                handleFechaDesdeChange(e);
              }}
              renderInput={(field) => (
                <TextField
                  {...field}
                  fullWidth={stylesForSelects ? true : false}
                  variant={stylesForSelects ? stylesForSelects : "standard"}
                  error={errorIzq.length > 0}
                  helperText={errorIzq}
                />
              )}
            />
          </div>
          {/*  ----------------FECHA HASTA---------------*/}
          <div className={stylesForSelects ? "text-center sm:text-left p-2 w-full" : "text-center sm:text-left p-2"}>
            <DesktopDatePicker
              label="Fecha Hasta"
              value={fechaHasta}
              inputFormat="DD/MM/YYYY"
              onChange={(e: any) => {
                handleFechaHastaChange(e);
              }}
              renderInput={(field) => (
                <TextField
                  {...field}
                  fullWidth={stylesForSelects ? true : false}
                  variant={stylesForSelects ? stylesForSelects : "standard"}
                  error={errorDerecha.length > 0}
                  helperText={errorDerecha}
                />
              )}
            />
          </div>
        </>
      )}
      {pickFecha && (
        /* ----------------FECHA DESDE--------------- */
        <div className={stylesForSelects ? "text-center sm:text-left w-full" : "text-center sm:text-left p-2"}>
          <DesktopDatePicker
            label={deactivateLabel && !label ? label : "Seleccione una fecha"}
            value={fecha}
            inputFormat="DD/MM/YYYY"
            onChange={(e: any) => {
              handleFechaChange(e);
            }}
            renderInput={(field) => (
              <TextField
                {...field}
                fullWidth={stylesForSelects ? true : false}
                variant={stylesForSelects ? stylesForSelects : "standard"}
                error={errorIzq.length > 0}
                helperText={errorIzq}
              />
            )}
          />
        </div>
      )}
      {horaDesdeHasta && (
        <>
          {/* ----------------Hora desde---------------*/}
          <div className={stylesForSelects ? "text-center sm:text-left p-2 w-full" : "text-center sm:text-left p-2"}>
            <TimePicker
              ampm
              label="Hora de inicio"
              value={horaDesde}
              onChange={(e: any) => {
                handleHoraDesdeChange(e);
              }}
              renderInput={(field) => (
                <TextField
                  {...field}
                  fullWidth={stylesForSelects ? true : false}
                  variant={stylesForSelects ? stylesForSelects : "standard"}
                  error={errorIzq.length > 0}
                  helperText={errorIzq}
                />
              )}
            />
          </div>

          {/* ----------------Hora hasta---------------*/}
          <div className={stylesForSelects ? "text-center sm:text-left p-2 w-full" : "text-center sm:text-left p-2"}>
            <TimePicker
              ampm
              label="Hora de fin"
              value={horaHasta}
              onChange={(e: any) => {
                handleHoraHastaChange(e);
              }}
              renderInput={(field) => (
                <TextField
                  {...field}
                  fullWidth={stylesForSelects ? true : false}
                  variant={stylesForSelects ? stylesForSelects : "standard"}
                  error={errorDerecha.length > 0}
                  helperText={errorDerecha}
                />
              )}
            />
          </div>
        </>
      )}
      {pickHora && (
        /* ----------------Hora---------------*/
        <div className={stylesForSelects ? "text-center sm:text-left p-2 w-full" : "text-center sm:text-left p-2"}>
          <TimePicker
            ampm
            label="Seleccione una hora"
            value={hora}
            onChange={(e: any) => {
              handleHoraChange(e);
            }}
            renderInput={(field) => <TextField {...field} variant={stylesForSelects ? stylesForSelects : "standard"} />}
          />
        </div>
      )}
      {children && { children }}
    </div>
  );
};
