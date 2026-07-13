import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { CargaMotivosForm } from "./CargaMotivosForm";
import { IMotivo } from "app/models/IMotivo";
import { ResponsableInicioLineaSliceRequests } from "app/Middleware/reducers/ResponsableInicioLineaSlice";
import { ValidaSliceRequests } from "app/Middleware/reducers/ValidaSlice";
import { MotivoSliceRequests } from "app/Middleware/reducers/MotivoSlice";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { ILinea, ITurno } from "app/models";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

interface initialState {
  fecha: Date;
  lineaId: number;
  turno: number;
  target: number;
  producidos: number;
  minutosDeLinea: number;
  minutosPerdidos: number;
  observacion: string;
  responsableInicioLineaId: number;
  validaId: number;
  minutosParados: number;
  lineaString: string;
  planta: string;
}

const initialStateVar: initialState = {
  fecha: moment().toDate(),
  lineaId: 0,
  turno: 0,
  target: 0,
  producidos: 0,
  minutosDeLinea: 540,
  minutosPerdidos: 0,
  observacion: "",
  responsableInicioLineaId: 0,
  validaId: 0,
  minutosParados: 0,
  lineaString: "",
  planta: "Planta 6"
};

interface props {
  setOpenPopup: any;
  refresh?: any; //Refresca la lista
}

export const ParadasForm = ({ setOpenPopup, refresh }: props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost: FetchPostMulti } = useFetchApiMultiResults<IMotivo>();
  const [turnos, setTurnos] = useState<ITurno[]>([]);
  const [openCargaMotivos, setOpenCargaMotivos] = useState(false);
  const [listResponsablesInicioLinea, setListResponsablesInicioLinea] = useState([]);
  const [listValida, setListValida] = useState([]);
  const [lineasProduccion, setLineasProduccion] = useState<ILinea[]>([]);
  const [hayMinutosDiferencia, setHayMinutosDiferencia] = useState(false);
  const [objetoMotivo, setObjetoMotivo] = useState<IMotivo>(null);
  const [minutosPerdidosState, setMinutosPerdidosState] = useState(0);
  const [editarTarget, setEditarTarget] = useState(false);
  const [paradasDeLinea, setParadasDeLinea] = useState<IParadasDeLinea[]>(null);

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;
  const watchFecha = watch("fecha");
  const watchLinea = watch("lineaId");
  const watchTurno = watch("turno");
  const watchMinutosPerdidos = watch("minutosPerdidos");
  // const watchMinutosDeLinea = watch("minutosDeLinea");

  // GET LineasProduccion
  FetchApi<any[]>(
    LineaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) {
        const parsed = JSON.parse(JSON.stringify(data));
        setLineasProduccion(parsed);
      }
    },
    false,
    false,
    true
  );

  // GET Turnos
  FetchApi<any[]>(
    TurnoSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setTurnos(data);
    },
    false,
    false,
    true
  );

  // GET ResponsablesInicioLinea
  FetchApi<any[]>(
    ResponsableInicioLineaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setListResponsablesInicioLinea(data);
    },
    false,
    false,
    true
  );

  // GET Valida
  FetchApi<any[]>(
    ValidaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setListValida(data);
    },
    false,
    false,
    true
  );

  useEffect(() => {
    if (watchFecha && watchLinea != 0 && watchTurno > 0) {
      //setValue("target", 0);
      setEditarTarget(false);
      setValue("producidos", 0);
      setValue("minutosPerdidos", 0);
      calcularInfo();
    }
  }, [watchFecha, watchLinea, watchTurno]);

  //Obtengo la cantidad de inicios filtrados por fecha, linea y turno.
  const getInicios = async () => {
    const result = unwrapResult(
      await dispatch(
        InicioSliceRequests.getAllIniciosByFechaTurnoLinea({
          fecha: moment(watchFecha).format("YYYY-MM-DD"),
          turno: turnos.find((z) => z.id == watchTurno)?.abreviatura,
          codigoNewsan2: lineasProduccion.find((x) => x.idLinea == watchLinea)?.codigoInicio
        })
      )
    );
    if (result) return result;
    else return [];
  };

  const calcularInfo = async () => {
    const targ = getValues("target");

    const inicios = await getInicios(); //Traigo los inicios
    if (inicios.length > 0) {
      if (editarTarget) {
        //Si elije editar Target, es xq inserto 1 diferente y quiere calcular los minutos en base a ese target.
        if (targ == 0 || !targ) {
          openNotificationUI("Cargar Target", "warning");
          return false;
        }
        calcularMinutos(inicios.length, targ);
      } else {
        //Sino, el target lo saca de inicio
        setValue("target", inicios[0].target); //Inserto el target
        calcularMinutos(inicios.length, inicios[0].target);
      }
    }
    calcularMinutosPerdidos();
    setValue("producidos", inicios.length); //Inserto equipos producidos
  };

  const calcularInfoFL = async () => {
    if (editarTarget) {
      const target = getValues("target");
      const producido = getValues("producidos");
      const tiempo = getValues("minutosDeLinea");
      console.log(target, producido, tiempo);
      if (target == 0 || !target || producido == 0 || !producido) {
        openNotificationUI("Cargar Target y Producido", "warning");
      } else {
        //Calcular Minutos Perdidos
        const minPerdidos = Math.round(tiempo - (producido * tiempo) / target);
        if (minPerdidos > 0) {
          setValue("minutosPerdidos", minPerdidos); //Le dejo solo la parte enetra.
          setMinutosPerdidosState(minPerdidos);
          setHayMinutosDiferencia(true);
          setValue("observacion", "");
        } else {
          openNotificationUI("No hay minutos de diferencia", "info");
          setValue("minutosPerdidos", 0);
          setValue("observacion", "Target Superado");
          setMinutosPerdidosState(0);
          setHayMinutosDiferencia(false);
        }
      }
      //No se calcular Minutos Parados, lo trae
    }
  };

  const getLineaByCodigoInicio = async (identificadorLinea) => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
    if (result) {
      const data = result.find((x) => x.identificadorLinea == identificadorLinea);
      return data ?? null;
    }
  };

  //Obtiene la cantidad de minutos perdidos, consultando la tabla ParadasDeLinea.
  const calcularMinutosPerdidos = async () => {
    //Esto viene de Produccion06 / Produccion08
    console.log("Aca estoy calculando Parada");
    const lineaSelected = lineasProduccion.find((x) => x.idLinea == watchLinea); //Obtengo la linea que selecciono del select2
    const objetoLineaProduccion = await getLineaByCodigoInicio(lineaSelected.codigoInicio);
    const result: IParadasDeLinea[] = unwrapResult(
      await dispatch(
        ParadasDeLineaSliceRequests.GetByFiltersAndDiscontinuo({
          fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
          lineaId: objetoLineaProduccion.id,
          turnoId: watchTurno,
          discontinuo: false
        })
      )
    );
    console.log(result);
    if (result) {
      setParadasDeLinea(result);
      cargarMinutosForm(result);
      let suma = 0;
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        suma += element.minutos;
      }
      setValue("minutosParados", suma);
    } else setValue("minutosParados", 0);
  };

  const cargarMinutosForm = (array: IParadasDeLinea[]) => {
    const init = {
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
    if (array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const alias = element.areaTraza.alias;
        switch (alias) {
          case "equipamientoMaquinariaMant":
            init.equipamientoMaquinariaMant += element.minutos;
            break;
          case "cambiosIngenieria":
            init.cambiosIngenieria += element.minutos;
            break;
          case "cambioModelo":
            init.cambioModelo += element.minutos;
            break;
          case "ausentismo":
            init.ausentismo += element.minutos;
            break;
          case "dobladoras":
            init.dobladoras += element.minutos;
            break;
          case "soldadura":
            init.soldadura += element.minutos;
            break;
          case "montaje":
            init.montaje += element.minutos;
            break;
          case "IAPlacasDisplay":
            init.IAPlacasDisplay += element.minutos;
            break;
          case "IAPlacasMain":
            init.IAPlacasMain += element.minutos;
            break;
          case "IMPlacasDisplay":
            init.IMPlacasDisplay += element.minutos;
            break;
          case "IMPlacasMain":
            init.IMPlacasMain += element.minutos;
            break;
          case "equipamientoMaquinariaIng":
            init.equipamientoMaquinariaIng += element.minutos;
            break;
          case "metodos":
            init.metodos += element.minutos;
            break;
          case "calidad":
            init.calidad += element.minutos;
            break;
          case "sistemas":
            init.sistemas += element.minutos;
            break;
          case "it":
            init.it += element.minutos;
            break;
          case "abastecimiento":
            init.abastecimiento += element.minutos;
            break;
          case "cli":
            init.cli += element.minutos;
            break;
          case "supply":
            init.supply += element.minutos;
            break;
          case "terceros":
            init.terceros += element.minutos;
            break;
          case "otros":
            init.otros += element.minutos;
            break;
        }
      }
    }
    setDefaultValues(init);
  };

  const [defaultValues, setDefaultValues] = useState(null);

  //Calcula los minutos perdidos, segun el target y la cantidad de equipos que se producieron en el dia.
  const calcularMinutos = (equiposProducidos, target) => {
    const tiempo = getValues("minutosDeLinea");
    // let minutosTrabajados = (equiposProducidos * tiempo) / target; //Regla de 3 simples.
    // minutosTrabajados = Math.trunc(minutosTrabajados);
    // let minPerdidos = tiempo - minutosTrabajados;
    const minPerdidos = Math.round(tiempo - (equiposProducidos * tiempo) / target);
    if (minPerdidos > 0) {
      setValue("minutosPerdidos", minPerdidos); //Le dejo solo la parte enetra.
      setMinutosPerdidosState(minPerdidos);
      setHayMinutosDiferencia(true);
      setValue("observacion", "");
    } else {
      openNotificationUI("No hay minutos de diferencia", "info");
      setValue("minutosPerdidos", 0);
      setValue("observacion", "Target Superado");
      setMinutosPerdidosState(0);
      setHayMinutosDiferencia(false);
    }
  };

  const guardarObjetoMotivo = async (objetoMotivo) => {
    const resultMotivo = await FetchPostMulti(MotivoSliceRequests.postRequest, objetoMotivo);
    if (resultMotivo) return resultMotivo;
  };

  const camposCorrectos = () => {
    if (getValues("validaId") == 0 || getValues("responsableInicioLineaId") == 0) return false;
    else return true;
  };

  const loginSubmit = async (e) => {
    let result: IMotivo;
    const puedeGuardar = camposCorrectos();

    if (!puedeGuardar) {
      openNotificationUI("Completar todos los datos!", "warning");
      return;
    }

    //Si minutos de diferencia, entonces tuvo que haber creado un objeto con los Motivos. Caso contrario, no cargo.
    if (hayMinutosDiferencia && objetoMotivo) result = await guardarObjetoMotivo(objetoMotivo);
    else result = null;
    //Primero guardo el motivo, para tener el id del Objeto.
    if (hayMinutosDiferencia && objetoMotivo) e.motivoId = result.id; //Si hay diferencia, asigna el objeto del motivo, sino no.
    const resultFetchParada = await FetchPostMulti(ParadaSliceRequests.postRequest, e);
    if (resultFetchParada) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  useEffect(() => {
    if (watchLinea > 0) {
      const line: ILinea = lineasProduccion.find((x) => x.idLinea == watchLinea);
      if (line) {
        setValue("lineaString", line.descripcion);
      }
    }
  }, [watchLinea]);

  return (
    <div className="h-full w-[80vw] relative">
      <form onSubmit={handleSubmit(loginSubmit)} className="w-full h-full">
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
            <SelectComponentForm
              control={control}
              name="lineaId"
              label="Linea Produccion"
              listItems={lineasProduccion || []}
              valueLabel={(item) => item.descripcion}
              valueSelect={(item) => item.idLinea}
              variant="standard"
              rules={{ required: "Seleccionar una línea", validate: (value) => (value as number) > 0 || "Seleccionar una línea" }}
            />
          </div>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="turno"
              label="Turno"
              listItems={turnos || []}
              valueLabel={(item) => item.abreviatura}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: "Seleccionar un turno", validate: (value) => (value as number) > 0 || "Seleccionar un turno" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <InputComponentForm
              control={control}
              name="target"
              label="Target"
              typeDate="number"
              disabled={!editarTarget}
              variant="outlined"
            />
            <Button
              className={classes.purpleButton}
              onClick={(e) => {
                if (watchLinea && watchTurno) {
                  setEditarTarget(!editarTarget);
                } else {
                  openNotificationUI("Seleccionar línea y turno!", "warning");
                }
              }}>
              {editarTarget == true ? "No Editar Target" : "Editar Target"}
            </Button>
            <Button className={classes.blueButton} onClick={calcularInfoFL}>
              Calcular Info
            </Button>
          </div>

          <div>
            <InputComponentForm
              control={control}
              name="producidos"
              label="Producidos"
              typeDate="number"
              disabled={!editarTarget}
              variant="outlined"
            />
          </div>
          <div>
            <InputComponentForm
              control={control}
              name="minutosDeLinea"
              label="Minutos de Línea"
              typeDate="number"
              disabled={!editarTarget}
              variant="outlined"
            />
          </div>
          <div>
            <InputComponentForm
              control={control}
              name="minutosPerdidos"
              label="Minutos Perdidos"
              typeDate="number"
              disabled={true}
              variant="outlined"
            />
          </div>
          <div>
            <InputComponentForm
              control={control}
              name="minutosParados"
              label="Minutos Parados"
              typeDate="number"
              disabled={true}
              variant="outlined"
            />
          </div>
          <div>
            <Button
              className={classes.yellowButton}
              onClick={(e) => {
                setOpenCargaMotivos(true);
                setMinutosPerdidosState(watchMinutosPerdidos);
              }}>
              Cargar Motivos
            </Button>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <InputComponentForm
            control={control}
            name="observacion"
            label="Observacion"
            variant="outlined"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="responsableInicioLineaId"
              label="Seleccione un Responsable de linea"
              listItems={listResponsablesInicioLinea || []}
              valueLabel={(item) => item.nombre}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: true, validate: (value) => (value as number) > 0 || "Seleccionar un responsable" }}
            />
          </div>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="validaId"
              label="Valida"
              listItems={listValida || []}
              valueLabel={(item) => item.nombre}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: true, validate: (value) => (value as number) > 0 || "Seleccionar quien valida" }}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isValid}>
            Guardar
          </Button>
        </div>
      </form>

      <ModalCompoment
        title={"Carga de Motivos. Minutos perdidos: " + minutosPerdidosState.toString()}
        openPopup={openCargaMotivos}
        setOpenPopup={setOpenCargaMotivos}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Completar los motivos de los minutos perdidos">
        <CargaMotivosForm
          setOpenPopup={setOpenCargaMotivos}
          minutosPerdidos={minutosPerdidosState}
          setObjetoMotivo={setObjetoMotivo}
          defaultValues={defaultValues}
        />
      </ModalCompoment>
    </div>
  );
};
