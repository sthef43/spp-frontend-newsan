import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IPlanProd, IPlant } from "app/models";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { calcularCantidad } from "app/shared/helpers/calcularCantidadProducida";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RechazosPlacas } from "../Components/RechazosPlacas";
import { oqcDesignadaResultadoSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

interface initialState {
  plantId: number;
  planta: number;
  linea: number;
  modelo: string;
  lote: string;
  numeroOp: string;
  cantidadLote: number;
  producidos: number;
  diferencia: number;
}
const initialStateVar = {
  plantId: 0,
  planta: 0,
  linea: 0,
  modelo: "",
  lote: "",
  numeroOp: "",
  cantidadLote: 0,
  producidos: 0,
  diferencia: 0
};

export const NoConformePlacas = (): JSX.Element => {
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const oqcDesRes = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const watchPlanta = watch("planta");
  const watchLinea = watch("linea");
  const watchModelo = watch("modelo");
  const watchLote = watch("lote");

  const [lineaSelect, setLineaSelect] = useState(true);
  const [modeloSelect, setModeloSelect] = useState(true);
  const [loteSelect, setLoteSelect] = useState(false);

  const [linea, setLinea] = useState<ILinea[]>([]); //lista de las lineas
  const [modelos, setModelos] = useState<IPlanProd[]>([]); //lista de los modelos de la linea seleccionada|
  const [lotes, setLotes] = useState<IPlanProd[]>([]); // lista de los lotes del modelo seleccionado
  const [planProd, setPlanProd] = useState<IPlanProd>({}); //datos del plan prod seleccionado

  //SE EJECUTA AL RENDERIZAR
  const getLineasByPlantId = async (plantId: number) => {
    let fetchLineaResult: ILinea[];
    setModeloSelect(true);
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult.filter((x) => x.plantId == plantId));
      setLineaSelect(false);
    }
  };

  const getInfoOqc = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const inicio = unwrapResult(await dispatch(InicioSliceRequests.getByCodigoNewsan(oqcDesRes.numeroSerie)));
      const plan = unwrapResult(await dispatch(PlanProdSliceRequests.getByIdRequest(inicio.idProduccion)));
      setValue("linea", plan.idLinea);
      setValue("lote", plan.lote);
      setValue("modelo", plan.codigoModelo);
      setPlanProd(plan);
      setearCampos(plan);
      setLoteSelect(true);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  //FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const handleLineaChange = async () => {
    let mounted = true;
    const idLinea: number = getValues().linea;
    setModeloSelect(true);
    if (idLinea) {
      let fetchPlanProdResult;
      try {
        fetchPlanProdResult = unwrapResult(await dispatch(PlanProdSliceRequests.getModelosByIdLinea(idLinea)));
      } catch (error) {
        fetchPlanProdResult = null;
      }
      if (fetchPlanProdResult && mounted) {
        setModelos(fetchPlanProdResult);
        setModeloSelect(false);
      }
    }
    return () => (mounted = false);
  };

  //FUNC QUE ME DEVUELVE EL LOTE QUE YO QUIERO MOSTRAR
  const encontrarPlanProd = (modelo: string, lote: string): IPlanProd => {
    let planAux: IPlanProd;
    lotes.map((plan) => {
      if (plan.codigoModelo == modelo && plan.lote == lote) {
        planAux = plan;
      }
    });
    return planAux;
  };

  //SETEO LOS CAMPOS DE LOS TEXT FIELD
  const setearCampos = (plan: IPlanProd) => {
    setValue("numeroOp", plan.numeroOp);
    setValue("producidos", plan.cantidad - calcularCantidad(plan));
    setValue("cantidadLote", plan.cantidad);
    setValue("diferencia", calcularCantidad(plan));
  };

  //FETCH PARA TRAER LA INFO DE EL LOTE SELECCIONADO
  const cargarInfoLote = async (lote, modelo) => {
    setLoteSelect(false);
    const planAux = encontrarPlanProd(modelo, lote);
    if (planAux) {
      let fetchInfoLoteResult: IPlanProd;
      try {
        fetchInfoLoteResult = unwrapResult(await dispatch(PlanProdSliceRequests.getByIdRequest(planAux.idProduccion)));
      } catch (error) {
        fetchInfoLoteResult = null;
      }
      if (fetchInfoLoteResult) {
        setLoteSelect(false);
        setPlanProd(fetchInfoLoteResult);
        setearCampos(fetchInfoLoteResult); //cargar los campos
      }
    }
    setLoteSelect(true);
  };

  //FETCH PARA TRAERME LOS LOTES DEL MODELO SELECCIONADO
  const handleModeloChange = async () => {
    const idLinea = getValues().linea;
    const modelo = getValues().modelo;
    const query = {
      idLinea: idLinea,
      modelo: modelo
    };
    if (modelo) {
      let fetchLoteResult: IPlanProd[];
      try {
        fetchLoteResult = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanByLineaModelo(query)));
      } catch (error) {
        fetchLoteResult = null;
      }
      if (fetchLoteResult) {
        setLotes(fetchLoteResult);
      }
    }
  };

  const actualizarDatos = () => {
    if (watchLote) cargarInfoLote(watchLote, getValues("modelo"));
  };

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA PLANTA
  useEffect(() => {
    getLineasByPlantId(watchPlanta);
  }, [watchPlanta]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA LINEA
  useEffect(() => {
    handleLineaChange();
  }, [watchLinea]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UN MODELO
  useEffect(() => {
    handleModeloChange();
  }, [watchModelo]);

  useEffect(() => {
    actualizarDatos();
  }, [watchLote]);

  useEffect(() => {
    oqcDesRes && getInfoOqc();
    return () => {
      dispatch(oqcDesignadaResultadoSlice.actions.setClear());
    };
  }, [oqcDesRes]);

  useEffect(() => {
    TitleChanger("Carga de no conforme");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);

  return (
    <div>
      <div className="m-1 sm:m-10 h-full">
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="w-full flex justify-center ">
            <TitleUIComponent title="PLANTAS NEWSAN" classNameDiv="w-min whitespace-nowrap" classNameTitle="text-2xl" />
          </div>
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <FormControl variant="standard">
              <InputLabel>Planta</InputLabel>
              <Controller
                name="planta"
                control={control}
                rules={{ required: "Seleccione una planta." }}
                render={({ field }) => (
                  <Select {...field} style={{ width: "300px" }}>
                    {plantas &&
                      plantas.map((plant) => (
                        <MenuItem key={plant.id} value={plant.id} style={{ width: "300px" }}>
                          {plant.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
            {/* ----------------LINEA---------------*/}
            <div className="text-center sm:text-left p-2">
              <FormControl disabled={lineaSelect} variant="standard">
                <InputLabel>Linea</InputLabel>
                <Controller
                  name="linea"
                  control={control}
                  rules={{ required: "Seleccione una línea." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "300px" }}
                      variant="standard"
                      disabled={oqcDesRes ? true : false}>
                      {linea &&
                        linea.map((lane) => (
                          <MenuItem key={lane.idLinea} value={lane.idLinea}>
                            {lane.descripcion}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------MODELOS---------------*/}
            <div className="text-center sm:text-left p-2">
              <FormControl disabled={modeloSelect} variant="standard">
                <InputLabel>Modelos</InputLabel>
                <Controller
                  name="modelo"
                  control={control}
                  rules={{ required: "Seleccione un modelo." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "300px" }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      variant="standard"
                      disabled={oqcDesRes ? true : false}>
                      {modelos &&
                        modelos.map((plan) => {
                          if (plan.codigoModelo !== "FELICITACIONES") {
                            return (
                              <MenuItem key={plan.codigoModelo} value={plan.codigoModelo}>
                                {plan.codigoModelo}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------LOTE---------------*/}
            <div className="text-center sm:text-left p-2">
              <FormControl disabled={watchModelo.length < 1} variant="standard">
                <InputLabel>Lote</InputLabel>
                <Controller
                  name="lote"
                  control={control}
                  rules={{ required: "Seleccione un lote." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: "300px" }}
                      variant="standard"
                      disabled={oqcDesRes ? true : false}>
                      {lotes &&
                        lotes.map((loteAux) => {
                          return (
                            loteAux.codigoModelo === watchModelo && (
                              <MenuItem key={loteAux.idProduccion} value={loteAux.lote}>
                                {loteAux.lote}
                              </MenuItem>
                            )
                          );
                        })}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div>
              <Button onClick={actualizarDatos}>Actualizar Datos</Button>
            </div>
          </div>
        </div>
        {loteSelect && (
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
            <div className="sm:flex items-center justify-around w-full font-semibold">
              {/* ----------------NUMERO OP---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numeroOp"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => <TextField disabled label="Número de OP" {...field} variant="standard" />}
                />
              </div>
              {/* ----------------PRODUCIDO---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="producidos"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => <TextField disabled label="Producidos" {...field} variant="standard" />}
                />
              </div>
              {/* ----------------CANTIDAD LOTE---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="cantidadLote"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => <TextField disabled label="Cantidad del Lote" {...field} variant="standard" />}
                />
              </div>
              {/* ----------------DIFERENCIA---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="diferencia"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => <TextField disabled label="Diferencia" {...field} variant="standard" />}
                />
              </div>
            </div>
          </div>
        )}
        <Divider />
        {loteSelect && <RechazosPlacas linea={linea} plan={planProd} refresh={actualizarDatos} />}
      </div>
    </div>
  );
};
