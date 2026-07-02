import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
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

interface props {
  setOpenPopup: any;
  refresh?: any; //Refresca la lista
}
export const ParadasForm = ({ setOpenPopup, refresh }: props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [turnos, setTurnos] = useState<ITurno[]>(null);
  const [openCargaMotivos, setOpenCargaMotivos] = useState(false);
  const [listResponsablesInicioLinea, setListResponsablesInicioLinea] = useState([]);
  const [listValida, setListValida] = useState([]);
  const [lineasProduccion, setLineasProduccion] = useState([]);
  const [hayMinutosDiferencia, setHayMinutosDiferencia] = useState(false);
  const [objetoMotivo, setObjetoMotivo] = useState<IMotivo>(null);
  const [minutosPerdidosState, setMinutosPerdidosState] = useState(0);
  const [editarTarget, setEditarTarget] = useState(false);
  const [paradasDeLinea, setParadasDeLinea] = useState<IParadasDeLinea[]>(null);

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
  const initialStateVar = {
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

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;
  const watchFecha = watch("fecha");
  const watchLinea = watch("lineaId");
  const watchTurno = watch("turno");
  const watchMinutosPerdidos = watch("minutosPerdidos");
  // const watchMinutosDeLinea = watch("minutosDeLinea");

  useEffect(() => {
    getLineasProduccion();
    getResponsablesInicioLinea();
    getValida();
    getTurnos();
  }, []);

  const getTurnos = async () => {
    const result = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
    setTurnos(result);
  };

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

  const getLineasProduccion = async () => {
    let result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    result = JSON.parse(JSON.stringify(result));
    setLineasProduccion(result);
  };

  const guardarObjetoMotivo = async (objetoMotivo) => {
    let resultMotivo;
    try {
      resultMotivo = await unwrapResult(await dispatch(MotivoSliceRequests.postRequest(objetoMotivo)));
    } catch (x) {
      resultMotivo = null;
    }
    if (resultMotivo) return resultMotivo;
  };

  const camposCorrectos = () => {
    if (getValues("validaId") == 0 || getValues("responsableInicioLineaId") == 0) return false;
    else return true;
  };

  const loginSubmit = async (e) => {
    let result: IMotivo;
    let resultFetchParada;
    const puedeGuardar = camposCorrectos();

    if (!puedeGuardar) {
      openNotificationUI("Completar todos los datos!", "warning");
      return;
    }

    //Si minutos de diferencia, entonces tuvo que haber creado un objeto con los Motivos. Caso contrario, no cargo.
    if (hayMinutosDiferencia && objetoMotivo) result = await guardarObjetoMotivo(objetoMotivo);
    else result = null;
    try {
      //Primero guarod el motivo, para tener el id del Objeto.
      if (hayMinutosDiferencia && objetoMotivo) e.motivoId = result.id; //Si hay diferencia, asigna el objeto del motivo, sino no.
      resultFetchParada = unwrapResult(await dispatch(ParadaSliceRequests.postRequest(e)));
      if (resultFetchParada) {
        openNotificationUI("Guardado exitosamente :)", "success");
        setOpenPopup(false);
        refresh();
      }
    } catch (x) {
      result = null;
    }
  };

  const getResponsablesInicioLinea = async () => {
    const resultFetch = unwrapResult(await dispatch(ResponsableInicioLineaSliceRequests.getAllRequest()));
    if (resultFetch) {
      setListResponsablesInicioLinea(resultFetch);
    }
  };
  //trae el listado de los que Validan.
  const getValida = async () => {
    const resultFetch = unwrapResult(await dispatch(ValidaSliceRequests.getAllRequest()));
    if (resultFetch) {
      setListValida(resultFetch);
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
    <div style={{ height: "100%", width: "80vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
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
            <Controller
              name="lineaId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea Produccion</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione una Linea de Produccion"
                    variant="standard"
                    /*    onClick={() => getFamiliasByLineaProduccion()} */
                  >
                    {lineasProduccion &&
                      lineasProduccion.map((x) => (
                        <MenuItem key={x.idLinea} value={x.idLinea}>
                          <div className="w-full">
                            <div>{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="turno"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Turno</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione un Turno"
                    variant="standard"
                    /*    onClick={() => getFamiliasByLineaProduccion()} */
                  >
                    {turnos &&
                      turnos.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.abreviatura}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <Controller
              name="target"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Target"
                  variant="outlined"
                  type="number"
                  disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
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
            <Controller
              name="producidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Producidos"
                  variant="outlined"
                  type="number"
                  disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="minutosDeLinea"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Minutos de Línea"
                  variant="outlined"
                  type="number"
                  disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  // onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="minutosPerdidos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  disabled
                  label="Minutos Perdidos"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="minutosParados"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  disabled
                  label="Minutos Parados"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
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
          <Controller
            name="observacion"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Observacion"
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
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="responsableInicioLineaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione un Responsable de linea</InputLabel>
                  <Select {...field} variant="standard">
                    {listResponsablesInicioLinea &&
                      listResponsablesInicioLinea.map((x) => (
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
          </div>
          <div style={{ minWidth: "176px" }}>
            <Controller
              name="validaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Valida</InputLabel>
                  <Select {...field} variant="standard">
                    {listValida &&
                      listValida.map((x) => (
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
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>

      <ModalCompoment
        title={"Carga de Motivos. Minutos perdidos: " + minutosPerdidosState.toString()}
        openPopup={openCargaMotivos}
        setOpenPopup={setOpenCargaMotivos}>
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
