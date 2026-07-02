/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useRef, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Controller, useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, TextField } from "@mui/material";
import { SelectLineaAndPlant } from "app/shared/helpers/SelectLineaAndPlant";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarEditarPlanProdModal } from "../modals/AgregarEditarPlanProdModal";
import { lineaProduccionSlice, LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { OptionFormSlice } from "../reducers/OptionFormReducers";
import { PlanProdSppSlice, PlanProdSppSliceRequest } from "../reducers/PlanProdSppSlice";
import { Settings } from "@mui/icons-material";
import { PlanProdSppEmbarqueSlice } from "../reducers/PlanProdSppEmbarqueSlice";
import { UseExcelHooks } from "../hooks/UseExcelHooks";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { StatesFormModalsSlice } from "../reducers/StatesForModalsSlice";
import { TableActualComponent } from "../components/Tablas/TableActualComponent";
import { TableNewInfoComponent } from "../components/Tablas/TableNewInfoComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IGeneratePlanProd } from "../models/DTOS/IGeneratePlanProd";
import { EditarPosicionPlanModal } from "../modals/EditarPosicionPlanModal";
import { UseExcelEmbarquesHooks } from "../hooks/UseExcelEmbarquesHooks";
import { PlanProdSppEstadoEmbarquesSliceRequest } from "../reducers/PlanProdSppEstadoEmbarquesSlice";
import { PlanProdSppEmbarqueBloqueSliceRequest } from "../reducers/PlanProdSppEmbarqueBloqueSlice";
import { PlanProdEmbarquesSppListDTO } from "../models/DTOS/PlanProdEmbarquesSppListDTO";
import { UseFetchPlanSeparateForMonth } from "../hooks/UseFetchPlanSeparateForMonth";
import dayjs from "dayjs";
import { IObjectFormPlan } from "../models/IObjectFormPlan";
import { IPlanProdSpp } from "../models/IPlanProdSpp";
import { IPlanProdSppEstadoEmbarque } from "../models/IPlanProdSppEstadoEmbarque";

export const PlanProdSppMain = () => {
  const { control, setValue } = useForm();

  const lineaProduccion = useAppSelector((state) => state.lineaProduccion);
  const { dataFormatExcel, nuevosRegistrosPlanProd, dataFormatExcelEmbarque, mostrarContenedores } = useAppSelector(
    (state) => state.statesFormModals
  );
  const planesProduccion = useAppSelector((state) => state.planProdSpp.dataAll as any[]);
  const planesGenerado = useAppSelector((state) => state.planProdSpp.planProdNew as IPlanProdSpp[]);
  const { estadoEdicion } = useAppSelector((state) => state.optionForm);

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const fechaActual = moment().toDate();
  const { HandleFileExcel } = UseExcelHooks();
  const { handleFileExcelEmbarques } = UseExcelEmbarquesHooks();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getAllPlan, refreshPlanByFetchComplete } = UseFetchPlanSeparateForMonth();
  const fileInputRefPlan = useRef<HTMLInputElement>(null);
  const fileInputRefEmbarques = useRef<HTMLInputElement>(null);

  //STATE PARA GUARDAR EL MES DE INICIO SELECCIONADO
  const [fechaSeleccionadaSelect, setFechaSeleccionadaSelect] = useState("");
  const [fechaSeleccionadaMesNombre, setFechaSeleccionadaMesNombre] = useState("");

  //STATE PARA GUARDAR EL MES DE FIN SELECCIONADO
  const [fechaFinSeleccionadaSelect, setFechaFinSeleccionadaSelect] = useState("");
  const [fechaFinSeleccionadaMesNombre, setFechaFinSeleccondaMesNombre] = useState("");

  //ARRAYY CON LOS PLANES FILTRADOS SEGUN FUE SELECCIONADO
  const [planesSeleccionados, setPlanesSeleccionados] = useState<IPlanProdSpp[]>([]);

  //STATES PARA LOS MODALES
  const [openModalAgregar, setOpenModalAgregar] = useState<boolean>(false);
  const [openModalEditarPosicion, setOpenModalEditarPosicion] = useState<boolean>(false);

  //GUARDO LOS VALORES DE LOS SELECT EN ESTOS 3 STATES
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | number>(0);
  const [productoSeleccionado, setProductoSeleciconado] = useState<string | number>(0);

  //PETICIONES USANDO EL FETCH API Y SETEO LAS LISTAS DE PLANTA, PRODUCTO Y LINEA
  const [lineasProduccion, setLineasProduccion] = useState<ILineaProduccion[]>([]);
  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.GetOnlyLinesMountingByProductIdAndPlantId,
    { plantaId: plantaSeleccionada, productoId: productoSeleccionado },
    false,
    productoSeleccionado,
    setLineasProduccion,
    true
  );

  FetchApi<IPlanProdSppEstadoEmbarque[]>(
    PlanProdSppEstadoEmbarquesSliceRequest.getAllRequest,
    null,
    false,
    null,
    null,
    false
  );

  const guardarPlan = () => {
    const planGenerado = cargarPlanProduccion();
    FetchPost(PlanProdSppSliceRequest.multiPostRequest, planGenerado, false, async () => {
      openNotificationUI("Se agrego el plan con exito", "success");
      dispatch(StatesFormModalsSlice.actions.setDataFormatExcel([]));
      const response = unwrapResult(
        await dispatch(
          PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
            lineaProduccionId: lineaSeleccionada,
            mesInicio: fechaSeleccionadaMesNombre,
            mesFin: fechaFinSeleccionadaMesNombre
          })
        )
      );
      refreshPlanByFetchComplete(response);
    });
  };

  const actualizarPlanGlobal = () => {
    const clonPlan = planesProduccion.map((elementos, index) => {
      const clonElemeneto: any = { ...elementos };
      delete clonElemeneto.modelo;
      clonElemeneto.position = index + 1;
      return clonElemeneto;
    });
    const planSinCambios: IPlanProdSpp[] = clonPlan.filter((elementos) => elementos.añadido !== false);
    const planConCambios: IPlanProdSpp[] = clonPlan.filter((elementos) => elementos.añadido === false);

    FetchPut({
      consoleLog: false,
      modelPut: planSinCambios,
      sliceRequest: PlanProdSppSliceRequest.multiPutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Actualizar Plan de Produccion",
      messageUser: `Desea actualizar el plan del mes de ${fechaSeleccionadaMesNombre}?`,
      functionAdd: async (response) => {
        if (response) {
          await dispatch(PlanProdSppSliceRequest.multiPostRequest(planConCambios));
          openNotificationUI("Se actualizo el plan con exito", "success");
          dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(false));
          dispatch(PlanProdSppSlice.actions.setNewPlanProd([]));
          dispatch(PlanProdSppSlice.actions.setPlanProdActualizado([]));
          dispatch(StatesFormModalsSlice.actions.setDataFormatExcel([]));
          const responsePlan = unwrapResult(
            await dispatch(
              PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
                lineaProduccionId: lineaSeleccionada,
                mesInicio: fechaSeleccionadaMesNombre,
                mesFin: fechaFinSeleccionadaMesNombre
              })
            )
          );
          refreshPlanByFetchComplete(responsePlan);
        }
      }
    });
  };

  const getPlanGenerate = async () => {
    const nuevaConsulta: IGeneratePlanProd = {
      IDataExcelFormat: dataFormatExcel,
      lineaProduccionId: lineaProduccion.object.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (lineaProduccion.object.nombre.toLowerCase().includes("window")) {
        const listaFormateada = dataFormatExcel.filter((elementos) =>
          elementos.comentarios.toLowerCase().includes("window")
        );
        nuevaConsulta.IDataExcelFormat = listaFormateada;
      } else {
        const listaFormateada = dataFormatExcel.filter(
          (elementos) => !elementos.comentarios.toLowerCase().includes("window")
        );
        nuevaConsulta.IDataExcelFormat = listaFormateada;
      }
      const response = unwrapResult(await dispatch(PlanProdSppSliceRequest.GenerateNewPlanProd(nuevaConsulta)));
      if (response) {
        dispatch(PlanProdSppSlice.actions.setNewPlanProd(response));
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando generar el nuevo plan de produccion", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarEmbarques = async () => {
    const asignacionEmbarques: PlanProdEmbarquesSppListDTO = {
      planProdSpp: planesProduccion,
      planProdSppEmbarques: dataFormatExcelEmbarque
    };
    FetchPost(
      PlanProdSppEmbarqueBloqueSliceRequest.AssignShipmentsToPlans,
      asignacionEmbarques,
      false,
      async (response) => {
        if (response) {
          openNotificationUI("Se cargaron los nuevos embarques con exito", "success");
          dispatch(StatesFormModalsSlice.actions.setDataFormatExcelEmbarque([]));
          dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(false));
        } else {
          openNotificationUI("No se encontraron cambios", "info");
          dispatch(StatesFormModalsSlice.actions.setDataFormatExcelEmbarque([]));
        }
      },
      true
    );
  };

  const handleOpenModalAgregarPlan = () => {
    const nuevoPlan = nuevoFormPlan();
    dispatch(OptionFormSlice.actions.setNewPlanAll(nuevoPlan));
    dispatch(PlanProdSppSlice.actions.setPlanProd(null));
    dispatch(OptionFormSlice.actions.setModeEdition(false));
    dispatch(PlanProdSppEmbarqueSlice.actions.setDataEmbarquesList([]));
    dispatch(StatesFormModalsSlice.actions.setShowMostrarInformacionModelo(false));
    dispatch(StatesFormModalsSlice.actions.setOpenModalEditar(true));
    dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(false));
    setOpenModalAgregar(true);
  };

  const handleOpenModalCambiarPosicion = () => {
    const planesFiltrados = planesProduccion.filter((elementos) => elementos.seleccionado === true);
    if (planesFiltrados && planesFiltrados.length > 0) {
      setPlanesSeleccionados(planesFiltrados);
      setOpenModalEditarPosicion(true);
    } else {
      openNotificationUI("No se encontraron planes seleccionados", "error");
    }
  };

  const nuevoFormPlan = () => {
    try {
      const nuevoPlan: IObjectFormPlan[] = [
        {
          idForm: 1,
          estadoForm: 1,
          aprobeForm: false
        },
        {
          idForm: 2,
          estadoForm: 0,
          aprobeForm: false
        },
        {
          idForm: 3,
          estadoForm: 0,
          aprobeForm: false
        }
      ];

      if (nuevoPlan.length > 0) {
        return nuevoPlan;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error: ${error}`, "error");
    }
  };

  const handleMesChange = (e) => {
    const mesFormat = dayjs(e).format("MMMM");
    setFechaSeleccionadaSelect(e);
    setFechaSeleccionadaMesNombre(mesFormat.toUpperCase());
    dispatch(StatesFormModalsSlice.actions.setMes(mesFormat.toUpperCase()));
  };

  const handelMesFinChange = (e) => {
    const mesFormat = dayjs(e).format("MMMM");
    setFechaFinSeleccionadaSelect(e);
    setFechaFinSeleccondaMesNombre(mesFormat.toUpperCase());
    dispatch(StatesFormModalsSlice.actions.setFinMes(mesFormat.toUpperCase()));
  };

  const cargarPlanProduccion = () => {
    try {
      const nuevaLista = planesGenerado.map((elemento) => {
        const aux = { ...elemento };
        delete aux.modelo;
        aux.mes.toUpperCase();
        console.log(aux.mes.toUpperCase());
        return aux;
      });

      if (nuevaLista.length > 0) {
        return nuevaLista;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando el plan automatico", "error");
    }
  };

  //CAMBIO EL TITULO DEL MODULO
  useEffect(() => {
    TitleChanger("Plan de produccion");
  }, []);

  //USO EL SLICE PARA PODER BUSCAR LA LINEA CON EL ID QUE LE PASO COMO ARGUMENTO
  useEffect(() => {
    if (lineaSeleccionada) {
      dispatch(lineaProduccionSlice.actions.setSelectLinea(lineaSeleccionada as number));
      dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(false));
      dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(false));
      dispatch(StatesFormModalsSlice.actions.setDataFormatExcelEmbarque([]));
      dispatch(PlanProdSppSlice.actions.setNewPlanProd([]));
      dispatch(PlanProdSppSlice.actions.setPlanProdActualizado([]));
      setFechaSeleccionadaSelect(null);
      setFechaSeleccionadaMesNombre(null);
      setFechaFinSeleccionadaSelect(null);
      setFechaFinSeleccondaMesNombre(null);
      setValue("mes", "");
    }
  }, [lineaSeleccionada]);

  useEffect(() => {
    if (dataFormatExcel && dataFormatExcel.length > 0) {
      getPlanGenerate();
    }
  }, [dataFormatExcel]);

  useEffect(() => {
    if (fechaSeleccionadaMesNombre && fechaFinSeleccionadaMesNombre) {
      const mesNumeroInicio = parseInt(moment().month(fechaSeleccionadaMesNombre).format("M"));
      const mesNumeroFin = parseInt(moment().month(fechaFinSeleccionadaMesNombre).format("M"));
      console.log(mesNumeroInicio, mesNumeroFin);
      if (mesNumeroInicio > mesNumeroFin) {
        openNotificationUI("El mes de inicio no puede ser posterior al mes de fin.", "error");
        return;
      }
      getAllPlan(lineaSeleccionada as number, fechaSeleccionadaMesNombre, fechaFinSeleccionadaMesNombre);
    }
  }, [fechaSeleccionadaMesNombre, fechaFinSeleccionadaMesNombre]);

  useEffect(() => {
    if (fechaSeleccionadaMesNombre) {
      dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(false));
      dispatch(PlanProdSppSlice.actions.setNewPlanProd([]));
      dispatch(PlanProdSppSlice.actions.setPlanProdActualizado([]));
      dispatch(StatesFormModalsSlice.actions.setDataFormatExcel([]));
    }
  }, [fechaSeleccionadaMesNombre]);

  return (
    <main className="w-full p-4">
      <section className="flex flex-col w-full items-start">
        <SelectLineaAndPlant
          setPlantaId={setPlantaSeleccionada}
          setProductoId={setProductoSeleciconado}
          activarEstilosPersonalizados
          estilos="flex flex-row gap-x-4 w-1/2 w-full"
          varianteEstilo={"standard"}
          aniadirCodigoHtml={
            <>
              <SelectComponent
                control={control}
                listaObjetos={lineasProduccion}
                nameSelect="linea"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.id}
                inputLabel="Seleccione una linea"
                valueKey={(value) => value}
                ValueSave={setLineaSeleccionada}
                varianteEstilo="standard"
              />
              <div className="w-full">
                <Controller
                  name="mes"
                  control={control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label="Seleccione el mes de inicio"
                      views={["year", "month"]}
                      value={fechaSeleccionadaSelect}
                      inputFormat="YYYY-MMMM"
                      maxDate={fechaActual}
                      renderInput={(field) => <TextField {...field} variant="standard" fullWidth />}
                      onChange={handleMesChange}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="mes"
                  control={control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label="Seleccione el mes fin"
                      views={["year", "month"]}
                      value={fechaFinSeleccionadaSelect}
                      inputFormat="YYYY-MMMM"
                      maxDate={fechaActual}
                      renderInput={(field) => <TextField {...field} variant="standard" fullWidth />}
                      onChange={handelMesFinChange}
                    />
                  )}
                />
              </div>
            </>
          }
        />
        <div className="flex flex-row items-center gap-x-4 mt-4">
          {fechaFinSeleccionadaMesNombre !== "" && (
            <div className="">
              <input
                type="file"
                accept=".xlsx"
                ref={fileInputRefPlan}
                style={{ display: "none" }}
                onChange={(e) => {
                  HandleFileExcel(e, fechaSeleccionadaMesNombre, fechaFinSeleccionadaMesNombre);
                }}
              />
              <Button
                disabled={false}
                variant="outlined"
                color="success"
                size="large"
                onClick={() => fileInputRefPlan.current?.click()}>
                Seleccionar archivo
                <Settings />
              </Button>
            </div>
          )}
          <Button
            variant="contained"
            onClick={() => {
              handleOpenModalAgregarPlan();
            }}
            disabled={lineaSeleccionada === 0}
            className={buttonClases.purpleButton}>
            Agregar
          </Button>
          {nuevosRegistrosPlanProd && (
            <Button
              sx={{ width: "14rem" }}
              variant="contained"
              className={buttonClases.blueButton}
              onClick={actualizarPlanGlobal}>
              Actualizar Plan
            </Button>
          )}
          {planesGenerado && planesGenerado.length > 0 && planesProduccion.length == 0 && (
            <Button
              sx={{ width: "14rem" }}
              variant="contained"
              className={buttonClases.greenButton}
              disabled={planesGenerado.length == 0}
              onClick={guardarPlan}>
              Cargar Plan Generado
            </Button>
          )}
          {planesProduccion.length > 0 && planesProduccion.some((elementos) => elementos.seleccionado === true) && (
            <Button
              sx={{ width: "14rem" }}
              variant="contained"
              className={buttonClases.blueButton}
              onClick={handleOpenModalCambiarPosicion}>
              Editar Orden
            </Button>
          )}
          {mostrarContenedores && mostrarContenedores && (
            <>
              <input
                type="file"
                accept=".xlsx"
                ref={fileInputRefEmbarques}
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFileExcelEmbarques(e);
                }}
              />
              <Button variant="contained" onClick={() => fileInputRefEmbarques.current?.click()}>
                Cargar Embarques
              </Button>
            </>
          )}
          {dataFormatExcelEmbarque && dataFormatExcelEmbarque.length > 0 && (
            <Button className={buttonClases.purpleButton} onClick={generarEmbarques} variant="contained">
              Asignar Embarques
            </Button>
          )}
        </div>
      </section>
      {planesProduccion && planesProduccion.length > 0 && (
        <>
          <section className="mt-4">
            <TableActualComponent
              refreshListPlanProd={() => {
                getAllPlan(lineaSeleccionada as number, fechaSeleccionadaMesNombre, fechaFinSeleccionadaMesNombre);
              }}
            />
          </section>
        </>
      )}
      {dataFormatExcel && dataFormatExcel.length > 0 && (
        <section className="mt-4">
          <TableNewInfoComponent />
        </section>
      )}
      {/* <UseFetchApiPost sliceRequets={TipoUnidadSliceRequests.postRequest} modelPost={modeloTipoPrueba} /> */}
      <ModalCompoment
        openPopup={openModalAgregar}
        setOpenPopup={setOpenModalAgregar}
        title={estadoEdicion ? "Editar Lote" : "Crear Nuevo Lote"}>
        <AgregarEditarPlanProdModal openModal={openModalAgregar} setOpenModal={setOpenModalAgregar} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalEditarPosicion}
        setOpenPopup={setOpenModalEditarPosicion}
        title="Cambiar posiciones de los planes"
        onCloseDynamic
        hiddenButtonClose>
        <EditarPosicionPlanModal
          openModal={openModalEditarPosicion}
          setOpenModal={setOpenModalEditarPosicion}
          planesFiltrados={planesSeleccionados}
        />
      </ModalCompoment>
    </main>
  );
};
