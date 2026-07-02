import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea, IPlanProd, IModelos, IInicio } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ReportePorDiaTable } from "app/features/informes/components/ReportePorDiaTable";
import { ImpresionPorModelo } from "app/features/informes/Modules/reporteProduccionPorModelo/components/ImpresionPorModelo";
// import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useReactToPrint } from "react-to-print";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";

export const ReportePorModelo = (): JSX.Element => {
  const initialState = {
    linea: 0,
    modelo: ""
  };

  const { control, getValues, watch, setValue } = useForm({
    defaultValues: initialState
  });

  const [lotesProducidos, setLotesProducidos] = React.useState<IPlanProd[]>([]);
  const [nuevosLotesProducidos, setnuevosLotesProducidos] = React.useState<IInicio[]>([]);
  const [busquedaDisabled, setBusquedaDisabled] = React.useState<boolean>(false);
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [modelos, setModelos] = React.useState<IModelos[]>([]);
  const buttonClasses = MaterialButtons();
  const [screenWidth, setScreenWidth] = React.useState("");
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const watchLinea = watch("linea");

  React.useEffect(() => {
    TitleChanger("REPORTES DE PRODUCCIÓN");
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

  //FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const handleLineaChange = async () => {
    let fetchModelosResult;
    try {
      fetchModelosResult = unwrapResult(
        await dispatch(PlanProdSliceRequests.getAllModelosHistoricoByLineaIdRequest(getValues("linea")))
      );
    } catch (error) {
      fetchModelosResult = null;
    }
    if (fetchModelosResult) {
      setModelos(fetchModelosResult);
    }
  };

  //ME TRAIGO TODOS LOS INICIOS DENTRO DEL RANGO DE FECHAS AGRUPADOS POR LOTE
  const getAllProducidos = async () => {
    let fetchProducidosResult: IPlanProd[];
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    try {
      fetchProducidosResult = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getAllByLineaModeloRequest({
            idLinea: getValues("linea"),
            codigoModelo: getValues("modelo")
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

  const getTitleSize = () => {
    setScreenWidth(window.screen.availWidth >= 420 ? "text-2xl" : "text-base");
  };

  const generarReporte = async () => {
    //let fetchProducidosResult: IPlanProd[];
    const fetchProducidosResult = unwrapResult(await dispatch(InicioSliceRequests.getAllByModelo(getValues("modelo"))));
    console.log(fetchProducidosResult);
    setnuevosLotesProducidos(fetchProducidosResult);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    console.log(
      "🚀 ~ file: ReportesPage.tsx ~ line 107 ~ generarReporte ~ fetchProducidosResult",
      fetchProducidosResult
    );
  };

  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de Producción por Modelo`,
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: #002b36 !important; -webkit-print-color-adjust: exact; }"
  });

  const imprimirInforme = async () => {
    handleImprimir();
  };

  React.useEffect(() => {
    getTitleSize();
  }, [window.screen]);

  React.useEffect(() => {
    if (lotesProducidos.length > 0) {
      generarReporte();
    } else {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [lotesProducidos]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA LINEA
  React.useEffect(() => {
    handleLineaChange();
  }, [watchLinea]);

  React.useEffect(() => {
    onInit();
  }, []);

  const getDisabled = () => {
    // if (errorIzq.trim().length === 0 && errorDerecha.trim().length === 0) {
    //   setBusquedaDisabled(false); //no lo desabilito
    // } else {
    //   setBusquedaDisabled(true); //lo desabilito
    // }
  };

  //   React.useEffect(() => {
  //     getDisabled();
  //   }, []);

  return (
    <div>
      <div className="hidden bg-white">
        <ImpresionPorModelo parentRef={componentRef} modelo={getValues("modelo")} producidos={nuevosLotesProducidos} />
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center mb-3">
              <TitleUIComponent
                title="Reporte de producción por modelo"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle={screenWidth}
              />
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div className="text-center sm:text-left p-2">
                <FormControl sx={{ margin: 4, minWidth: 170 }} variant="standard">
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
              <div className="text-center sm:text-left p-2">
                <FormControl sx={{ margin: 4, minWidth: 170 }} variant="standard">
                  <Autocomplete
                    options={modelos?.map((modelo) => modelo?.nombre)}
                    onChange={(e, newvalue: any) => setValue("modelo", newvalue)}
                    renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Modelo" />}
                  />
                </FormControl>
              </div>
              <div className="text-center sm:text-left p-2 gap-3">
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
          </div>
          <Divider />
          {lotesProducidos.length > 0 && (
            <div className="animate__animated animate_fadeUp">
              <ReportePorDiaTable lotes={lotesProducidos} />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
