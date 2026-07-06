import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme
} from "@mui/material";

import { useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import moment from "moment";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea, IPlanProd } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ReportePorDiaTable } from "app/features/informes/components/ReportePorDiaTable";
// import { ImpresionInforme } from "app/shared/components/informes/ImpresionInforme";
// import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
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
import { IEMPQDeclarationsPorTurno } from "app/models/IEMPQDeclarationsPorTurno";

export const ReportesPage = (): JSX.Element => {
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
  const [placasConTurno, setPlacasConTurno] = useState<IEMPQDeclarationsPorTurno[] | null>(null);

  const [reporteView, setReporteView] = React.useState<IPlanProd[]>([]);

  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  React.useEffect(() => {
    TitleChanger("REPORTES DE PRODUCCIÓN");
  }, []);

  const norm = (v: any) => String(v ?? "").trim();

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

  const getAllProducidos = async () => {
    try {
      const plantSelected = plantas.find((x) => x.name === nombrePlanta);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const orgCode = plantas.find((planta) => planta.name == nombrePlanta).organizationCode;

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

      setLotesProducidos(fetchProducidosResult);

      !fetchProducidosResult && openNotificationUI("No hay datos", "info");
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getTitleSize = () => {
    setScreenWidth(window.screen.availWidth >= 420 ? "text-2xl" : "text-base");
  };

  const turnoValido = (t: any) => {
    const s = String(t ?? "")
      .trim()
      .toUpperCase();
    return s === "M" || s === "T" || s === "N";
  };

  const generarReporte = async (lotes: IPlanProd[]) => {
    try {
      const fetchProducidosResult: IPlanProd[] = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getReporteRequest({
            planProd: lotes,
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
          })
        )
      );

      const onlyReporte = (fetchProducidosResult ?? []).filter((r: any) => turnoValido(r?.turno));

      setReporteView(onlyReporte);
      setlotesPcTarget(onlyReporte);
      setnuevosLotesProducidos(onlyReporte);
      separarPorLinea(onlyReporte);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      openNotificationUI(err, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const componentRef = React.useRef<HTMLDivElement>(null);

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
      throw error;
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
          if (plan) plan.target = result.target;
        })
      );
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const imprimirInforme = async () => {
    const response = await getConfirmation("Desea el listado de no conformes?", "", null, "Si", "No");
    setNoConformesFlag(!!response);
    separarPorLinea(reporteView);
    setTimeout(() => handleImprimir(), 0);
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
      setBusquedaDisabled(false);
    } else {
      setBusquedaDisabled(true);
    }
  };

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

  useEffect(() => {
    console.log(lotesProducidosPlacas);
  }, [lotesProducidosPlacas]);

  return (
    <div>
      <div className="hidden bg-white" ref={componentRef}>
        <ReportePorDiaTable lotes={reporteView} />
      </div>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center mb-3">
              <TitleUIComponent
                title="Reporte de producción por fecha"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle={screenWidth}
              />
            </div>
            <div className="w-full font-semibold grid grid-cols-4 ">
              <Box>
                <FormControl sx={{ minWidth: 250, margin: "10px" }} variant="outlined">
                  <InputLabel>Seleccione una planta</InputLabel>
                  <Select
                    variant="standard"
                    defaultValue={nombrePlanta}
                    key={nombrePlanta}
                    sx={{ minWidth: "unset" }}
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
              </Box>

              <div className="text-center sm:text-left p-2">
                <DesktopDatePicker
                  label="Fecha Desde"
                  value={fechaDesde}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    handleFechaDesdeChange(e);
                  }}
                  renderInput={(field) => (
                    <TextField {...field} variant="standard" error={errorIzq.length > 0} helperText={errorIzq} />
                  )}
                />
              </div>

              <div className="text-center sm:text-left p-2">
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
                      variant="standard"
                      error={errorDerecha.length > 0}
                      helperText={errorDerecha}
                    />
                  )}
                />
              </div>

              <div className="text-center sm:text-left p-2 gap-3">
                <Button
                  onClick={() => {
                    setReporteView([]);
                    setlotesPcTarget([]);
                    setnuevosLotesProducidos([]);
                    setKeys([]);
                    setKeysTurno([]);
                    setAgrupados([]);
                    getAllProducidos();
                  }}
                  className={buttonClasses.blueButton}
                  disabled={busquedaDisabled}
                  variant="contained">
                  Buscar
                </Button>

                <Button
                  onClick={() => {
                    imprimirInforme();
                  }}
                  sx={{ marginLeft: 3 }}
                  className={buttonClasses.greenButton}
                  variant="contained"
                  disabled={reporteView.length === 0}>
                  Imprimir
                </Button>
              </div>
            </div>
          </div>

          <Divider />

          {reporteView.length > 0 && (
            <div className="animate__animated animate_fadeUp">
              <ReportePorDiaTable lotes={reporteView} />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
