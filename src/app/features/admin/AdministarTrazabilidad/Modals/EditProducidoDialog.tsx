/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { IInicio, ITurno } from "app/models";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface props {
  numeroEscaneado: IInicio;
  setOpenPopup: any;
}

export interface IInicioFormData {
  idInicio?: number | null;
  fecha?: string | null;
  turno?: string | null;
  idProduccion?: number | null;
  tipoUnidad?: string | null;
  codigoTrazabilidad?: string | null;
  codigoNewsan?: string | null;
  fechaFin?: string | null;
  nombreInicio?: string | null;
  nombreFin?: string | null;
  turnoFin?: string | null;
  hora?: string | null;
  horaFin?: string | null;
  observaciones?: string | null;
  compresor?: string | null;
  codigoNewsan2?: string | null;
  idModelo?: number | null;
  montado?: number | null;
  fechaMontado?: string | null;
  horaMontado?: Date | null;
  modeloFin?: string | null;
  nroOp?: string | null;
  organizacion?: string | null;
  lote?: string | null;
  target?: number | null;
  nroLpn?: string | null;
  codigoEvaporador?: string | null;
  idProveedor?: number | null;
  desde?: number | null;
  hasta?: number | null;
  producido?: number | null;
  rechazados?: number | null;
}

export const EditProducidoDialog = ({ numeroEscaneado, setOpenPopup }: props): JSX.Element => {
  const initialState: IInicio = numeroEscaneado;
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const turnos = useAppSelector((state) => state.turno.dataAll as ITurno[]);

  const dispatch = useAppDispatch();

  const { control, getValues, setValue, handleSubmit, watch } = useForm<IInicioFormData>({
    defaultValues: initialState
  });

  const fecha = watch("fecha");
  const fechaFin = watch("fechaFin");
  const turno = watch("turno");
  const turnoFin = watch("turnoFin");
  // const watchFecha = watch("fec");

  const guardarNumero = async (nuevoNumeroEscaneado: IInicio) => {
    let fetchNumeroEscaneadoResult;
    try {
      fetchNumeroEscaneadoResult = unwrapResult(await dispatch(InicioSliceRequests.putRequest(nuevoNumeroEscaneado)));
    } catch (error) {
      fetchNumeroEscaneadoResult = null;
    }
    if (fetchNumeroEscaneadoResult) {
      openNotificationUI("Número actualizado con éxito", "success");
    } else {
      openNotificationUI("Error al actualizar el número", "error");
    }
    setOpenPopup(false);
  };

  const handleGuardar = async () => {
    const nuevoNumeroEscaneado: IInicio = JSON.parse(JSON.stringify(numeroEscaneado));
    nuevoNumeroEscaneado.fecha = moment(getValues("fecha")).format("YYYY-MM-DD");
    nuevoNumeroEscaneado.fechaFin = moment(getValues("fechaFin")).format("YYYY-MM-DD");
    nuevoNumeroEscaneado.turno = getValues("turno");
    nuevoNumeroEscaneado.turnoFin = getValues("turnoFin");
    nuevoNumeroEscaneado.modeloFin = getValues("modeloFin");
    nuevoNumeroEscaneado.tipoUnidad = getValues("tipoUnidad");
    nuevoNumeroEscaneado.codigoTrazabilidad = getValues("codigoTrazabilidad");
    nuevoNumeroEscaneado.codigoNewsan = getValues("codigoNewsan");
    nuevoNumeroEscaneado.codigoNewsan2 = getValues("codigoNewsan2");
    nuevoNumeroEscaneado.nroOp = getValues("nroOp");
    console.log(
      "🚀 ~ file: EditProducidoDialog.tsx ~ line 60 ~ handleGuardar ~ nuevoNumeroEscaneado",
      nuevoNumeroEscaneado
    );
    guardarNumero(nuevoNumeroEscaneado);
  };

  const handleCancelar = async () => {
    setOpenPopup(false);
  };

  React.useEffect(() => {
    console.log(numeroEscaneado);
  }, []);

  return (
    <div style={{ width: "70vw", textAlign: "center" }}>
      <form onSubmit={handleSubmit(handleGuardar)}>
        <div className="inline-grid sm:inline-flex  sm:gap-x-36 gap-x-10">
          {/* ----------------FECHA---------------*/}
          <div className="text-center sm:text-left p-2">
            <DesktopDatePicker
              label="Fecha"
              value={fecha}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fecha", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          {/* ----------------FECHA FIN---------------*/}
          <div className="text-center sm:text-left p-2">
            <DesktopDatePicker
              label="Fecha Fin"
              value={fechaFin}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fechaFin", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
        </div>
        <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
          {/* ----------------TURNO---------------*/}
          <div className="text-center sm:text-left p-2">
            <FormControl>
              <FormLabel>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={turno.trim()}
                    onChange={(e: any) => {
                      setValue("turno", e.target.value);
                    }}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        {turnos?.map((turno) => (
                          <FormControlLabel
                            key={turno.id}
                            value={turno.abreviatura}
                            control={<Radio />}
                            label={turno.nombre}
                          />
                        ))}
                      </div>
                      <div className="sm:col-span-1">
                        <FormControlLabel value="EM" control={<Radio />} label="Extra Mañana" />
                        <FormControlLabel value="ET" control={<Radio />} label="Extra Tarde" />
                        <FormControlLabel value="EN" control={<Radio />} label="Extra Noche" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                name="turno"
              />
            </FormControl>
          </div>
          {/* ----------------TURNO FIN---------------*/}
          <div className="text-center sm:text-left p-2">
            <FormControl>
              <FormLabel>Turno Fin</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={turnoFin.trim()}
                    onChange={(e: any) => {
                      setValue("turnoFin", e.target.value);
                    }}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        {turnos?.map((turno) => (
                          <FormControlLabel
                            key={turno.id}
                            value={turno.abreviatura}
                            control={<Radio />}
                            label={turno.nombre}
                          />
                        ))}
                      </div>
                      <div className="sm:col-span-1">
                        <FormControlLabel value="EM" control={<Radio />} label="Extra Mañana" />
                        <FormControlLabel value="ET" control={<Radio />} label="Extra Tarde" />
                        <FormControlLabel value="EN" control={<Radio />} label="Extra Noche" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                name="turnoFin"
              />
            </FormControl>
          </div>
        </div>
        <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
          {/* ----------------MODELO FIN---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="modeloFin"
              control={control}
              defaultValue={numeroEscaneado?.modeloFin}
              render={({ field }) => <TextField label="Modelo Fin" {...field} variant="standard" />}
            />
          </div>
          {/* ----------------CODIGO DE TRAZABILIDAD---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="codigoTrazabilidad"
              control={control}
              defaultValue={numeroEscaneado?.codigoTrazabilidad}
              render={({ field }) => <TextField label="Codigo de Trazabilidad" {...field} variant="standard" />}
            />
          </div>
        </div>
        <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
          {/* ----------------CODIGO NEWSAN---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="codigoNewsan"
              control={control}
              defaultValue={numeroEscaneado?.codigoNewsan}
              render={({ field }) => <TextField label="Codigo de Newsan" {...field} variant="standard" />}
            />
          </div>
          {/* ----------------NUMERO DE OP---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="nroOp"
              control={control}
              defaultValue={numeroEscaneado?.nroOp}
              render={({ field }) => <TextField label="Número de OP" {...field} variant="standard" />}
            />
          </div>
        </div>
      </form>
      <div className="space-x-10 mt-10">
        <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
          Guardar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
