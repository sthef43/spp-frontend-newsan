import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea, IPlanProd } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ImpresionPorLinea } from "app/features/informes/Modules/reporteProduccionPorLinea/components/ImpresionPorLinea";
import { useReactToPrint } from "react-to-print";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ReportePorDiaTableFecha } from "app/features/informes/Modules/reporteProduccionPorLinea/components/ReportePorDiaTableFecha";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const ReportePorLinea = (): JSX.Element => {
  const initialState = {
    fechaDesde: moment().toDate(),
    fechaHasta: moment().toDate(),
    linea: 0
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const [lotesProducidos, setLotesProducidos] = React.useState<IPlanProd[]>([]);
  // const [lotesProducidosDos, setLotesProducidosDos] = React.useState<IPlanProd[]>([]);
  // const [lotesProducidosResult, setLotesProducidosResult] = React.useState<IPlanProd[]>([]);
  const [nuevosLotesProducidos, setnuevosLotesProducidos] = React.useState<IPlanProd[]>([]);
  const [busquedaDisabled, setBusquedaDisabled] = React.useState<boolean>(false);
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const buttonClasses = MaterialButtons();
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  React.useEffect(() => {
    TitleChanger("REPORTES DE PRODUCCIÓN POR LINEA");
  }, []);

  const onInit = async () => {
    let fetchLineasResult;
    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineasResult = null;
    }
    if (fetchLineasResult) {
      setLineas(fetchLineasResult);
    }
  };

  //ME TRAIGO TODOS LOS INICIOS DENTRO DEL RANGO DE FECHAS AGRUPADOS POR LOTE
  const getAllProducidos = async () => {
    let fetchProducidosResult: IPlanProd[];
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    try {
      fetchProducidosResult = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getAllByLineaFechaRequest({
            idLinea: getValues("linea"),
            fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
            fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
          })
        )
      );
    } catch (error) {
      fetchProducidosResult = null;
    }
    if (fetchProducidosResult) {
      console.log(
        "🚀 ~ file: AdministrarTraza.tsx ~ line 125 ~ getAllProducidos ~ fetchProducidosResult",
        fetchProducidosResult
      );
      setLotesProducidos(fetchProducidosResult);
    }
  };

  const generarReporte = async (lotes: IPlanProd[]) => {
    const fetchProducidosResult = unwrapResult(
      await dispatch(
        PlanProdSliceRequests.getReportePorLineaRequest({
          planProd: lotes,
          fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
          fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
        })
      )
    );
    // console.log(fetchProducidosResult);
    setnuevosLotesProducidos(fetchProducidosResult);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    console.log(
      "🚀 ~ file: ReportesPage.tsx ~ line 107 ~ generarReporte ~ fetchProducidosResult",
      fetchProducidosResult
    );
    // setLotesProducidosDos(fetchProducidosResult);
  };

  //Agrego las fechas
  // const getLotesProducidosResult = () => {
  //   const recorre = lotesProducidos
  //     .filter((d) => lotesProducidosDos.some((e) => e.idProduccion == d.idProduccion))
  //     .map((loteObj) => {
  //       const objeto = lotesProducidosDos.find((loteDosObj) => loteObj.idProduccion == loteDosObj.idProduccion);
  //       if (objeto) {
  //         return { ...loteObj, fechaInicio: objeto.fechaInicio, fechaFinal: objeto.fechaFinal };
  //       }
  //     });
  //   setLotesProducidosResult(recorre); //Esto paso al reporte
  // };

  // useEffect(() => {
  //   if (lotesProducidos && lotesProducidosDos) {
  //     getLotesProducidosResult();
  //   }
  // }, [lotesProducidos && lotesProducidosDos]);

  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de Producción`,
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: #002b36 !important; -webkit-print-color-adjust: exact; }"
  });

  const imprimirInforme = async () => {
    handleImprimir();
  };

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
    if (fecha < moment(getValues("fechaHasta"))) {
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
      setErrorIzq("");
      setErrorDerecha("");
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

  React.useEffect(() => {
    getDisabled();
  }, [errorIzq, errorDerecha]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <div className="hidden bg-white">
        <ImpresionPorLinea
          parentRef={componentRef}
          linea={lineas.find((x) => x?.idLinea === getValues("linea"))?.descripcion}
          fechaDesde={moment(getValues("fechaDesde")).format("DD-MM-YYYY")}
          fechaHasta={moment(getValues("fechaHasta")).format("DD-MM-YYYY")}
          producidos={nuevosLotesProducidos}
        />
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ContainerForPages optionsLayout="Selects">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew w-full">
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ----------------FECHA DESDE---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <DesktopDatePicker
                  label="Fecha Desde"
                  value={fechaDesde}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    handleFechaDesdeChange(e);
                  }}
                  renderInput={(field) => (
                    <TextField
                      fullWidth
                      {...field}
                      variant="standard"
                      error={errorIzq.length > 0}
                      helperText={errorIzq}
                    />
                  )}
                />
              </div>
              {/* ----------------FECHA HASTA---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <DesktopDatePicker
                  label="Fecha Hasta"
                  value={fechaHasta}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    handleFechaHastaChange(e);
                  }}
                  renderInput={(field) => (
                    <TextField
                      fullWidth
                      {...field}
                      variant="standard"
                      error={errorDerecha.length > 0}
                      helperText={errorDerecha}
                    />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl variant="standard" fullWidth>
                  <InputLabel>Linea</InputLabel>
                  <Controller
                    name="linea"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} variant="standard">
                        {lineas &&
                          lineas.map((lane) => {
                            return (
                              <MenuItem key={lane.idLinea} value={lane.idLinea}>
                                {lane.descripcion}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div className="text-center flex flex-row items-center sm:text-left p-2 gap-3">
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
          </div>
        </ContainerForPages>
        <Divider />
        {lotesProducidos && (
          <div className="animate__animated animate_fadeUp">
            {/* <ReportePorDiaTableFecha lotes={lotesProducidosResult} /> */}
            <ReportePorDiaTableFecha lotes={lotesProducidos} />
          </div>
        )}
      </LocalizationProvider>
    </ContainerForPages>
  );
};
