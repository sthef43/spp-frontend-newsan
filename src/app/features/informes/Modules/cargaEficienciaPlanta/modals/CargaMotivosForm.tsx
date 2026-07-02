import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, Typography } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IMotivo } from "app/models/IMotivo";
interface props {
  setOpenPopup: any;
  minutosPerdidos: number;
  setObjetoMotivo: any; //SetState q inserta el objectMotivo.
  defaultValues: IMotivo | null;
}
export const CargaMotivosForm = ({ setOpenPopup, minutosPerdidos, setObjetoMotivo, defaultValues }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    tiempoXMantenimiento: number;
    cambiosIngenieria: number;
    cambioModelo: number;
    ausentismo: number;
    dobladoras: number;
    soldadura: number;
    montaje: number;
    IAPlacasDisplay: number;
    IAPlacasMain: number;
    IMPlacasDisplay: number;
    IMPlacasMain: number;
    equipamientoMaquinariaMant: number;
    equipamientoMaquinariaIng: number;
    metodos: number;
    calidad: number;
    sistemas: number;
    it: number;
    abastecimiento: number;
    cli: number;
    supply: number;
    terceros: number;
    otros: number;
  }
  const initialStateVar = {
    tiempoXMantenimiento: 0,
    cambiosIngenieria: 0,
    cambioModelo: 0,
    ausentismo: 0,
    dobladoras: 0,
    soldadura: 0,
    montaje: 0,
    IAPlacasDisplay: 0,
    IAPlacasMain: 0,
    IMPlacasDisplay: 0,
    IMPlacasMain: 0,
    equipamientoMaquinariaMant: 0,
    equipamientoMaquinariaIng: 0,
    metodos: 0,
    calidad: 0,
    sistemas: 0,
    it: 0,
    abastecimiento: 0,
    cli: 0,
    supply: 0,
    terceros: 0,
    otros: 0
  };

  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: defaultValues != null ? defaultValues : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  const [totalCargando, setTotalCargando] = useState(0);
  const [diferencia, setDiferencia] = useState(minutosPerdidos);
  const [cometioError, setCometioError] = useState(false);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const loginSubmit = async (e) => {
    //cONVIERTO A NUMBER TODOS LOS CAMPOS, POR QUE QUEDAN EN STRING
    e.IAPlacasDisplay = parseInt(e.IAPlacasDisplay);
    e.tiempoXMantenimiento = parseInt(e.tiempoXMantenimiento);
    e.cambiosIngenieria = parseInt(e.cambiosIngenieria);
    e.cambioModelo = parseInt(e.cambioModelo);
    e.ausentismo = parseInt(e.ausentismo);
    e.dobladoras = parseInt(e.dobladoras);
    e.soldadura = parseInt(e.soldadura);
    e.montaje = parseInt(e.montaje);
    e.IAPlacasDisplay = parseInt(e.IAPlacasDisplay);
    e.IAPlacasMain = parseInt(e.IAPlacasMain);
    e.IMPlacasDisplay = parseInt(e.IMPlacasDisplay);
    e.IMPlacasMain = parseInt(e.IMPlacasMain);
    e.equipamientoMaquinariaMant = parseInt(e.equipamientoMaquinariaMant);
    e.equipamientoMaquinariaIng = parseInt(e.equipamientoMaquinariaIng);
    e.metodos = parseInt(e.metodos);
    e.calidad = parseInt(e.calidad);
    e.sistemas = parseInt(e.sistemas);
    e.it = parseInt(e.it);
    e.abastecimiento = parseInt(e.abastecimiento);
    e.cli = parseInt(e.cli);
    e.supply = parseInt(e.supply);
    e.terceros = parseInt(e.terceros);
    e.otros = parseInt(e.otros);
    setObjetoMotivo(e);
    openNotificationUI("Motivos agregados correctamente :)", "success");
    setOpenPopup(false);
  };

  //Retorna el numero en tipo number;
  const verValor = (valor) => {
    if (valor) return parseInt(valor);
    else return 0;
  };

  const changeTotalCargando = () => {
    //Obtengo los valores parseados a number.
    const tiempoXMantenimiento = verValor(getValues("tiempoXMantenimiento"));
    const cambiosIngenieria = verValor(getValues("cambiosIngenieria"));
    const cambioModelo = verValor(getValues("cambioModelo"));
    const ausentismo = verValor(getValues("ausentismo"));
    const dobladoras = verValor(getValues("dobladoras"));
    const soldadura = verValor(getValues("soldadura"));
    const montaje = verValor(getValues("montaje"));
    const IAPlacasDisplay = verValor(getValues("IAPlacasDisplay"));
    const IAPlacasMain = verValor(getValues("IAPlacasMain"));
    const IMPlacasDisplay = verValor(getValues("IMPlacasDisplay"));
    const IMPlacasMain = verValor(getValues("IMPlacasMain"));
    const equipamientoMaquinariaMant = verValor(getValues("equipamientoMaquinariaMant"));
    const equipamientoMaquinariaIng = verValor(getValues("equipamientoMaquinariaIng"));
    const metodos = verValor(getValues("metodos"));
    const calidad = verValor(getValues("calidad"));
    const sistemas = verValor(getValues("sistemas"));
    const it = verValor(getValues("it"));
    const abastecimiento = verValor(getValues("abastecimiento"));
    const cli = verValor(getValues("cli"));
    const supply = verValor(getValues("supply"));
    const terceros = verValor(getValues("terceros"));

    //Sumo todos los campos
    const sumaTotal =
      tiempoXMantenimiento +
      cambiosIngenieria +
      cambioModelo +
      ausentismo +
      dobladoras +
      soldadura +
      montaje +
      IAPlacasDisplay +
      IAPlacasMain +
      IMPlacasDisplay +
      IMPlacasMain +
      equipamientoMaquinariaMant +
      equipamientoMaquinariaIng +
      metodos +
      calidad +
      sistemas +
      it +
      abastecimiento +
      cli +
      supply +
      terceros;

    setTotalCargando(sumaTotal);
    if (minutosPerdidos - sumaTotal < 0) {
      openNotificationUI("No debe pasar los minutos!", "error");
      setCometioError(true);
    } else {
      setCometioError(false);
    }
    setDiferencia(minutosPerdidos - sumaTotal);
  };

  useEffect(() => {
    if (defaultValues) {
      changeTotalCargando();
    }
  }, [defaultValues]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h3">
          Total cargando: {totalCargando} - Diferencia: {diferencia}
        </Typography>
      </div>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className=" flex-col grid grid-cols-4 gap-30 " style={{ height: "80%" }}>
          <div>
            <Controller
              name="tiempoXMantenimiento"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Tiempo por Mantenimiento"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto p-2" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cambiosIngenieria"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Ramp Up/EOL/ Cambios Ing."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="ausentismo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Ausentismo."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="dobladoras"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Dobladoras.."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="soldadura"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Soldadura."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="montaje"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Montaje."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="IAPlacasDisplay"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="IA Placas Display"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="IAPlacasMain"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="IA Placas Main."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="IMPlacasDisplay"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="IM Placas Display."
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
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="IMPlacasMain"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="IM Placas Main."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="equipamientoMaquinariaMant"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Equipamiento Maquinaria Mantenimiento."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="equipamientoMaquinariaIng"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Equipamiento Maquinaria Ing."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="metodos"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Metodos Calidad Sistemas."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="calidad"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Calidad."
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="sistemas"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Sistemas"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="it"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="It"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="abastecimiento"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Abastecimiento"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cli"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Cli"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="supply"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Supply"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="terceros"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Terceros/dm"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="otros"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Otros"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    changeTotalCargando();
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button
            className={classes.greenButton}
            type="submit"
            variant="contained"
            disabled={(!isDirty && !isValid) || cometioError}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
