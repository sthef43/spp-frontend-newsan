import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, Typography } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IMotivo } from "app/models/IMotivo";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";

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

const initialStateVar: initialState = {
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

interface props {
  setOpenPopup: any;
  minutosPerdidos: number;
  setObjetoMotivo: any; //SetState q inserta el objectMotivo.
  defaultValues: IMotivo | null;
}
export const CargaMotivosForm = ({ setOpenPopup, minutosPerdidos, setObjetoMotivo, defaultValues }: props) => {
  const classes = MaterialButtons();

  const { openNotificationUI } = useNotificationUI();
  const { control, getValues, handleSubmit, watch, formState } = useForm<initialState>({
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

  useEffect(() => {
    changeTotalCargando();
  }, [watch([
    "tiempoXMantenimiento", "cambiosIngenieria", "cambioModelo", "ausentismo", "dobladoras",
    "soldadura", "montaje", "IAPlacasDisplay", "IAPlacasMain", "IMPlacasDisplay", "IMPlacasMain",
    "equipamientoMaquinariaMant", "equipamientoMaquinariaIng", "metodos", "calidad", "sistemas",
    "it", "abastecimiento", "cli", "supply", "terceros", "otros"
  ])]);

  return (
    <div className="h-full w-[60vw] relative">
      <div className="text-center">
        <Typography variant="h3">
          Total cargando: {totalCargando} - Diferencia: {diferencia}
        </Typography>
      </div>
      <form onSubmit={handleSubmit(loginSubmit)} className="w-full h-full">
        <div className=" flex-col grid grid-cols-4 gap-30 " style={{ height: "80%" }}>
          <div>
            <InputComponentForm
              control={control}
              name="tiempoXMantenimiento"
              label="Tiempo por Mantenimiento"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto p-2" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="cambiosIngenieria"
              label="Ramp Up/EOL/ Cambios Ing."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="ausentismo"
              label="Ausentismo."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="dobladoras"
              label="Dobladoras.."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="soldadura"
              label="Soldadura."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="montaje"
              label="Montaje."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="IAPlacasDisplay"
              label="IA Placas Display"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="IAPlacasMain"
              label="IA Placas Main."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="IMPlacasDisplay"
              label="IM Placas Display."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="IMPlacasMain"
              label="IM Placas Main."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="equipamientoMaquinariaMant"
              label="Equipamiento Maquinaria Mantenimiento."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="equipamientoMaquinariaIng"
              label="Equipamiento Maquinaria Ing."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="metodos"
              label="Metodos Calidad Sistemas."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="calidad"
              label="Calidad."
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="sistemas"
              label="Sistemas"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="it"
              label="It"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="abastecimiento"
              label="Abastecimiento"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="cli"
              label="Cli"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="supply"
              label="Supply"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="terceros"
              label="Terceros/dm"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <InputComponentForm
              control={control}
              name="otros"
              label="Otros"
              typeDate="number"
              variant="outlined"
              rules={{ required: true }}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button
            className={classes.greenButton}
            type="submit"
            variant="contained"
            disabled={!isValid || cometioError}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
