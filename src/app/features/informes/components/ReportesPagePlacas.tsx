import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import moment from "moment";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea, IPlanProd } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ReportePorDiaTable } from "app/features/informes/components/ReportePorDiaTable";
import { ImpresionInforme } from "app/features/informes/components/ImpresionInforme";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useReactToPrint } from "react-to-print";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import _ from "lodash";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ITargets } from "app/models/ITargets";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import produce from "immer";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const ReportesPagePlacas = (): JSX.Element => {
  const initialState = {
    fechaDesde: moment().toDate(),
    fechaHasta: moment().toDate()
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const plantas = useAppSelector((state) => state.plant.dataAll);
  const [lotesProducidos, setLotesProducidos] = React.useState<IPlanProd[]>([]);
  const [lotesProducidosPlacas, setLotesProducidosPlacas] = React.useState<IPlanProd[]>([]);
  const [nuevosLotesProducidos, setnuevosLotesProducidos] = React.useState<IPlanProd[]>([]);
  const [lotesPcTarget, setlotesPcTarget] = React.useState<IPlanProd[]>([]);
  const [keys, setKeys] = React.useState<string[]>([]);
  const [nombrePlanta, setNombrePlanta] = React.useState<string>("");
  const [keysTurno, setKeysTurno] = React.useState<string[]>([]);
  const [paradas, setParadas] = React.useState<Array<{ idLinea: string; minutos: number; turno: string }>>([]);
  const [agrupados, setAgrupados] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [busquedaDisabled, setBusquedaDisabled] = React.useState<boolean>(false);
  const [noConformesFlag, setNoConformesFlag] = React.useState<boolean>(false);
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const buttonClasses = MaterialButtons();
  const [screenWidth, setScreenWidth] = React.useState("");
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  React.useEffect(() => {
    TitleChanger("REPORTES DE PRODUCCIÓN");
  }, []);

  const onInit = async () => {
    try {
      const fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      setLineas(fetchLineasResult);
      await dispatch(PlantSliceRequests.getAllRequest());
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const separarPorLinea = (auxResult: IPlanProd[]) => {
    if (auxResult) {
      const agrupadas = _.groupBy(auxResult, "idLinea");
      const transformedData = _.map(agrupadas, (group) => _.groupBy(group, "turno"));
      setAgrupados(transformedData);
      setKeys(Object.keys(agrupadas));
      setKeysTurno(Object.keys(transformedData));
    }
  };

  //ME TRAIGO TODOS LOS INICIOS DENTRO DEL RANGO DE FECHAS AGRUPADOS POR LOTE
  const [placasConTurno, setPlacasConTurno] = useState<any[] | null>([]);
  const getAllProducidos = async () => {
    try {
      const plantSelected = plantas.find((x) => x.name === nombrePlanta);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const orgCode = plantas.find((planta) => planta.name == nombrePlanta).organizationCode;
      //Produccion
      const fetchProducidosResult: IPlanProd[] = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getAllByFechaAndPlantIdRequest({
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD"),
            plantId: plantSelected.id
            // orgCode
          })
        )
      );
      //Placas
      const fetchPlacasResult = unwrapResult(
        await dispatch(
          empq_declarationsSliceRequests.GetListByOrgFechaDesdeHasta({
            org: orgCode,
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
          })
        )
      );
      //Placas con turno
      const getPlacasConTurno = unwrapResult(
        await dispatch(
          empq_declarationsSliceRequests.GetListOrgFecha({
            org: orgCode,
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
          })
        )
      );
      setPlacasConTurno(getPlacasConTurno);
      setLotesProducidosPlacas(fetchPlacasResult);
      const combinedArray = [...fetchProducidosResult, ...fetchPlacasResult];
      setLotesProducidos(combinedArray);
      !fetchProducidosResult && openNotificationUI("No hay datos", "info");
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  // Preparar Impresión las Placas
  const [lineasAgrupadas, setLineasAgrupadas] = useState<any[]>([]);
  const prepararImpresion = async () => {
    const agrup2 = placasConTurno
      .map((x, index) => ({
        id: index,
        linea: x.linea,
        codigoModelo: x.modelo,
        lote: x.lote,
        cantidadProducida: x.producido,
        paradasPlacas: x.noConformes,
        numeroOp: x.numeroOp,
        turno: x.turno
      }))
      .sort((a, b) => a.linea.localeCompare(b.linea) || a.codigoModelo.localeCompare(b.codigoModelo));
    const totalProducidoMap2 = agrup2.reduce((acc, { linea, cantidadProducida }) => {
      acc[linea] = (acc[linea] || 0) + cantidadProducida;
      return acc;
    }, {});
    const agrupConTotal2 = agrup2.map((item) => ({
      ...item,
      totalProducido: totalProducidoMap2[item.linea]
    }));
    const agrupadoPorLinea2 = Object.entries(
      agrupConTotal2.reduce((acc, item) => {
        acc[item.linea] = acc[item.linea] || [];
        acc[item.linea].push(item);
        return acc;
      }, {})
    ).map(([linea, registros]) => ({ linea, registros }));
    setLineasAgrupadas(agrupadoPorLinea2);
  };
  useEffect(() => {
    prepararImpresion();
  }, [placasConTurno && lotesProducidosPlacas]);

  const getTitleSize = () => {
    setScreenWidth(window.screen.availWidth >= 420 ? "text-2xl" : "text-base");
  };

  const generarReporte = async (lotes: IPlanProd[]) => {
    //let fetchProducidosResult: IPlanProd[];

    //COMENTO ESTO XQ EXPLOTA LA PANTALLA PARA BAS AS
    try {
      const fetchProducidosResult = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getReporteRequest({
            planProd: lotes,
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
          })
        )
      );
      setlotesPcTarget(fetchProducidosResult);
      setnuevosLotesProducidos(fetchProducidosResult);
      separarPorLinea(fetchProducidosResult);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      openNotificationUI(err, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const componentRef = React.useRef(null);
  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de Producción`,
    copyStyles: true
  });

  const setTargetAndFPY = (planProd: IPlanProd[]) => {
    planProd.forEach((p) => {
      getTarget(p);
    });
  };
  const getParadas = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const promises = [];
    for (const group of agrupados) {
      for (const turno of Object.keys(group)) {
        promises.push(setParada(group[turno][0].idLinea, turno));
      }
    }
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching paradas:", error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setParada = async (idLinea: string, turno: string) => {
    const linea = lineas.find((linea) => linea.idLinea === parseInt(idLinea));
    if (!linea) return;
    const lineaNombre = linea.descripcion;
    const params = {
      fechaInicio: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
      fechaFin: moment(getValues("fechaHasta")).format("YYYY-MM-DD"),
      nombreL: lineaNombre,
      turno
    };
    try {
      const response = unwrapResult(await dispatch(ParadasDeLineaSliceRequests.GetParadaByNombreLineayTurno(params)));
      if (response.length === 0) return;
      const minutos: number[] = response.map((parada) => parada.minutos);
      const totalminutos: number = minutos.reduce((prevValue, value) => prevValue + value);
      setParadas(
        produce((draft) => {
          draft.push({ idLinea, minutos: totalminutos, turno });
        })
      );
    } catch (error) {
      console.error("Error fetching paradas:", error);
      throw error; // Re-throw the error to be caught in the getParadas function
    }
  };

  const getTarget = async (planProd: IPlanProd) => {
    try {
      const param = {
        idLinea: planProd?.idLinea,
        generico: planProd?.capacidad.trim()
      };
      const result: ITargets = unwrapResult(
        await dispatch(TargetsSliceRequests.getTargetByIdLineaGenericoRequest(param))
      );
      setlotesPcTarget(
        produce((draft) => {
          const plan = draft.find((p) => p?.idProduccion == planProd?.idProduccion && p?.turno == planProd.turno);
          plan.target = result.target;
        })
      );
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const imprimirInforme = async () => {
    // console.log("🚀 ~ file: ReportesPage.tsx ~ line 107 ~ generarReporte ~ auxResult", agrupados);
    const response = await getConfirmation("Desea el listado de no conformes?", "", null, "Si", "No");
    if (response) {
      setNoConformesFlag(true);
    } else {
      setNoConformesFlag(false);
    }
    handleImprimir();
    //setModalOpen(true);
  };

  React.useEffect(() => {
    if (nuevosLotesProducidos.length > 0) {
      setTargetAndFPY(nuevosLotesProducidos);
    }
  }, [nuevosLotesProducidos]);

  React.useEffect(() => {
    if (lotesPcTarget.length > 0) {
      separarPorLinea(lotesPcTarget);
    }
  }, [lotesPcTarget]);

  React.useEffect(() => {
    getTitleSize();
  }, [window.screen]);

  React.useEffect(() => {
    if (lotesProducidos.length > 0) {
      generarReporte(lotesProducidos);
    } else {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [lotesProducidos]);

  React.useEffect(() => {
    onInit();
  }, []);

  const handleFechaDesdeChange = (fecha: any) => {
    if (fecha <= moment(getValues("fechaHasta"))) {
      setErrorIzq("");
      setErrorDerecha("");
    } else {
      setErrorIzq("La fecha desde debe ser anterior a la fecha hasta.");
    }
    setValue("fechaDesde", fecha);
  };

  const handleFechaHastaChange = (fecha: any) => {
    if (fecha < moment(getValues("fechaDesde"))) {
      setErrorDerecha("La fecha hasta debe ser posterior a la fecha desde.");
    } else {
      setErrorDerecha("");
      setErrorIzq("");
    }
    setValue("fechaHasta", fecha);
  };

  const getDisabled = () => {
    if (errorIzq.trim().length === 0 && errorDerecha.trim().length === 0) {
      setBusquedaDisabled(false); //no lo desabilito
    } else {
      setBusquedaDisabled(true); //lo desabilito
    }
  };
  // Trae la planta que tiene asignadda por usuario
  const getPlantByUser = async () => {
    try {
      const user = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni)));
      setNombrePlanta(user?.planta.name || "");
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  React.useEffect(() => {
    plantas?.length > 0 && getPlantByUser();
  }, [plantas]);
  React.useEffect(() => {
    getDisabled();
  }, [errorIzq, errorDerecha]);

  React.useEffect(() => {
    if (keys.length > 0) getParadas();
  }, [keys]);

  return (
    <div>
      <div className="hidden bg-white">
        <ImpresionInforme
          plantaNombre={nombrePlanta}
          paradas={paradas}
          parentRef={componentRef}
          lineas={lineas}
          keys={keys}
          keysTurno={keysTurno}
          agrupados={agrupados}
          fechaDesde={moment(getValues("fechaDesde")).format("DD-MM-YYYY")}
          fechaHasta={moment(getValues("fechaHasta")).format("DD-MM-YYYY")}
          noConformes={noConformesFlag}
          lineasAgrupadas={lineasAgrupadas}
          // placasConTurno={placasConTurno}
        />
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ContainerForPages optionsLayout="page" activeEffectVisible>
          <ContainerForPages
            optionsLayout="personalized"
            classNamePersonalized="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center mb-3">
              <TitleUIComponent
                title="Reporte de producción por fecha"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle={screenWidth}
              />
            </div>
            <div className="w-full flex flex-row items-center gap-x-4 mt-8">
              {/* ----------------FECHA DESDE---------------*/}
              <div className="w-1/2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Seleccione una planta</InputLabel>
                  <Select
                    variant="standard"
                    defaultValue={nombrePlanta}
                    key={nombrePlanta}
                    onChange={(e: SelectChangeEvent) => setNombrePlanta(e.target.value)}>
                    {plantas &&
                      plantas.map((x) => (
                        <MenuItem key={x.id} value={x.name}>
                          <div className="w-full">
                            <div className="w-full">{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="w-full flex flex-row items-center justify-center gap-x-4">
                <div className="w-full">
                  <DesktopDatePicker
                    label="Fecha Desde"
                    value={fechaDesde}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      handleFechaDesdeChange(e);
                    }}
                    renderInput={(field) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="standard"
                        error={errorIzq.length > 0}
                        helperText={errorIzq}
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <DesktopDatePicker
                    label="Fecha Hasta"
                    value={fechaHasta}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      handleFechaHastaChange(e);
                    }}
                    renderInput={(field) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="standard"
                        error={errorDerecha.length > 0}
                        helperText={errorDerecha}
                      />
                    )}
                  />
                </div>
              </div>
              {/* ----------------FECHA HASTA---------------*/}
              <div className="flex flex-row items-center gap-x-2">
                <Button
                  onClick={() => {
                    getAllProducidos();
                  }}
                  className={buttonClasses.blueButton}
                  disabled={busquedaDisabled}
                  variant="contained">
                  Buscar
                </Button>
                <Button
                  onClick={() => {
                    // generarReporte(lotesProducidos);
                    imprimirInforme();
                  }}
                  sx={{ marginLeft: 3 }}
                  className={buttonClasses.greenButton}
                  variant="contained"
                  disabled={lotesProducidos.length === 0}>
                  Imprimir
                </Button>
              </div>
            </div>
          </ContainerForPages>
          <Divider />
          {lotesProducidos.length > 0 && (
            <div className="animate__animated animate_fadeUp">
              <ReportePorDiaTable lotes={lotesProducidos} />
            </div>
          )}
        </ContainerForPages>
      </LocalizationProvider>
      <ModalCompoment title="" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ImpresionInforme
          plantaNombre={nombrePlanta}
          paradas={paradas}
          parentRef={componentRef}
          lineas={lineas}
          keys={keys}
          keysTurno={keysTurno}
          agrupados={agrupados}
          fechaDesde={moment(getValues("fechaDesde")).format("DD-MM-YYYY")}
          fechaHasta={moment(getValues("fechaHasta")).format("DD-MM-YYYY")}
          noConformes={noConformesFlag}
          lineasAgrupadas={lineasAgrupadas}
          // placasConTurno={placasConTurno}
        />
      </ModalCompoment>
    </div>
  );
};
