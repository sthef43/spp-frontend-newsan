/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
  TextField,
  Theme
} from "@mui/material";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILimitesTraza, ILinea } from "app/models";
import { LimitesPorDiaTable } from "app/features/informes/Modules/reporteTorquesInstrumentales/components/LimitesPorDiaTable";
import { useReactToPrint } from "react-to-print";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import moment from "moment";
import { LimitesTrazaSliceRequests } from "app/Middleware/reducers/LimitesTrazaSlice";
import { ImpresionTorques } from "app/features/informes/Modules/reporteTorquesInstrumentales/components/ImpresionTorques";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { InsttrazaSliceRequests } from "app/Middleware/reducers/InsttrazaSlice";
import { IInsttraza } from "app/models/IInsttraza";
import { InsttrazaPorDiaTable } from "app/features/informes/Modules/reporteTorquesInstrumentales/components/InsttrazaTable";
import { ImpresionInsttraza } from "app/features/informes/Modules/reporteTorquesInstrumentales/components/ImpresionInsttraza";

/**
 * Extrae el código de familia desde codigoTrazabilidad, usando el codigoPuesto como prefijo.
 * Ej:
 * codigoTrazabilidad: "2612C-TCOMPE18ITA"
 * -> Familia: "E18ITA"
 */
const getFamiliaFromCodigoTraza = (codigoTrazabilidad?: string, codigoPuesto?: string): string => {
  if (!codigoTrazabilidad) return "";

  const s = codigoTrazabilidad.trim();

  if (s.includes("-") && codigoPuesto) {
    const parts = s.split("-");
    const right = (parts[1] ?? "").trim(); // "TCOMPE18ITA"
    const puesto = codigoPuesto.trim().replace("C-", ""); // "TCOMP"
    if (puesto && right.startsWith(puesto)) {
      const fam = right.slice(puesto.length).trim();
      if (fam) return fam;
    }
  }

  const match = s.match(/([IE]\d{2}[A-Z]{2,3})$/i);
  if (match?.[1]) return match[1].toUpperCase();

  return "";
};

export const ReportesDeTorques = (): JSX.Element => {
  const initialState = {
    fechaDesde: moment().toDate(),
    fechaHasta: moment().toDate(),
    turno: "M",
    linea: 0
  };

  const { control, getValues, setValue, watch } = useForm({
    defaultValues: initialState
  });

  const watchFechaDesde = watch("fechaDesde");
  const { openNotificationUI } = useNotificationUI();
  const watchFechaHasta = watch("fechaHasta");
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [limites, setLimites] = React.useState<ILimitesTraza[]>([]);
  const [insttraza, setInsttraza] = React.useState<IInsttraza[]>([]);
  const buttonClasses = MaterialButtons();
  const [screenWidth, setScreenWidth] = React.useState("");
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [system, setSystem] = useState(0);

  const watchLinea = watch("linea");
  const watchTurno = watch("turno");

  React.useEffect(() => {
    TitleChanger("REPORTES DE TRAZABILIDAD/INSTRUMENTALES");
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

  // FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const getAllLimites = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());

      if (system == 0) {
        const fetchLimitesResult = unwrapResult(
          await dispatch(
            LimitesTrazaSliceRequests.getReporteRequest({
              identificadorLinea: watchLinea,
              turno: watchTurno,
              fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
              fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
            })
          )
        );

        const mapped = (fetchLimitesResult ?? []).map((x: any) => {
          const codTraza = x?.limites?.codigoTrazabilidad;
          const codPuesto = x?.limites?.codigoPuesto;
          const familia = getFamiliaFromCodigoTraza(codTraza, codPuesto);
          return { ...x, familia };
        });

        setLimites(mapped);
      } else {
        const response = unwrapResult(
          await dispatch(
            InsttrazaSliceRequests.getReporteRequest({
              identificadorLinea: watchLinea,
              turno: watchTurno,
              fechaDesde: moment(getValues("fechaDesde")).format("YYYY-MM-DD"),
              fechaHasta: moment(getValues("fechaHasta")).format("YYYY-MM-DD")
            })
          )
        );
        setInsttraza(response);
      }

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI(error, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getTitleSize = () => {
    setScreenWidth(window.screen.availWidth >= 420 ? "text-2xl" : "text-base");
  };

  const componentRef = React.useRef(null);
  const componentRef2 = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => (system == 0 ? componentRef.current : componentRef2.current),
    documentTitle: `Reporte de trazabilidad/instrumentales`,
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: #002b36 !important; -webkit-print-color-adjust: exact; }"
  });

  const imprimirInforme = async () => {
    handleImprimir();
  };

  const onSetLineaCB = React.useCallback((id: string) => {
    setValue("linea", parseInt(id));
  }, []);

  React.useEffect(() => {
    getTitleSize();
  }, [window.screen]);

  React.useEffect(() => {
    onInit();
  }, []);

  const actionBtnSx = {
    minWidth: 140,
    height: 40,
    padding: "8px 18px",
    fontSize: "0.875rem",
    borderRadius: 1
  } as const;

  return (
    <div>
      <div className="hidden bg-white">
        <ImpresionTorques
          parentRef={componentRef}
          limites={limites}
          linea={lineas?.find((lane) => lane?.codigoReparacion == watchLinea.toString())}
          fechaDesde={moment(getValues("fechaDesde")).format("L")}
          fechaHasta={moment(getValues("fechaHasta")).format("L")}
          turno={watchTurno === "M" ? "Mañana" : "Tarde"}
        />
      </div>
      <div className="hidden bg-white">
        <ImpresionInsttraza
          parentRef={componentRef2}
          insttraza={insttraza}
          linea={lineas?.find((lane) => lane?.codigoReparacion == watchLinea.toString())}
          fechaDesde={moment(getValues("fechaDesde")).format("L")}
          fechaHasta={moment(getValues("fechaHasta")).format("L")}
          turno={watchTurno === "M" ? "Mañana" : "Tarde"}
        />
      </div>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center items-center flex-col mb-3">
              <TitleUIComponent
                title="Reporte de torques/instrumentales"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle={screenWidth}
              />

              <Box sx={{ width: 500 }}>
                <BottomNavigation
                  showLabels
                  value={system}
                  onChange={(event, newValue) => {
                    setSystem(newValue);
                    if (newValue == 0) setInsttraza([]);
                    if (newValue == 1) setLimites([]);
                  }}>
                  <BottomNavigationAction
                    label="SPP"
                    icon={
                      <Icon className="text-gray-50 text-center" style={{ fontSize: "1.75rem" }}>
                        <img
                          className="h-full"
                          src={`${import.meta.env.BASE_URL}/icons/system.svg`}
                          style={{ filter: "invert(1)" }}
                        />
                      </Icon>
                    }
                  />
                  <BottomNavigationAction
                    label="TrazaViejo"
                    icon={
                      <Icon className="text-gray-50 text-center" style={{ fontSize: "1.75rem" }}>
                        <img
                          className="h-full"
                          src={`${import.meta.env.BASE_URL}/icons/informes.svg`}
                          style={{ filter: "invert(1)" }}
                        />
                      </Icon>
                    }
                  />
                </BottomNavigation>
              </Box>
            </div>

            <div className=" p-2 flex gap-5">
              <SelectOFPlantAndProducts selectLineas setCodigoErrorProps={onSetLineaCB}>
                <div className="flex justify-between gap-4">
                  <DesktopDatePicker
                    label="Fecha desde"
                    value={watchFechaDesde}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      setValue("fechaDesde", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                  <DesktopDatePicker
                    label="Fecha hasta"
                    value={watchFechaHasta}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      setValue("fechaHasta", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                </div>
              </SelectOFPlantAndProducts>

              <div className="text-center sm:text-left p-2">
                <FormControl variant="standard">
                  <FormLabel>Turno</FormLabel>
                  <Controller
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                        <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                        <FormControlLabel value="N" control={<Radio />} label="Noche" />
                      </RadioGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue="M"
                    name="turno"
                  />
                </FormControl>
              </div>

              <div className="text-center sm:text-left p-2 gap-3 grid grid-rows-2">
                <Button
                  onClick={() => {
                    getAllLimites();
                  }}
                  sx={actionBtnSx}
                  className={buttonClasses.blueButton}
                  disabled={Number.isNaN(watchLinea)}
                  variant="contained">
                  Buscar
                </Button>

                <Button
                  onClick={() => {
                    imprimirInforme();
                  }}
                  sx={actionBtnSx}
                  className={buttonClasses.greenButton}
                  variant="contained"
                  disabled={limites.length === 0 && insttraza.length == 0}>
                  Imprimir
                </Button>
              </div>
            </div>
          </div>

          <Divider />

          {limites.length == 0 && watchLinea > 0 && insttraza.length == 0 && (
            <div className="animate__animated animate_fadeUp">
              <TitleUIComponent title="Sin datos registrados" classNameTitle="text-base" />
            </div>
          )}

          {limites.length > 0 && system != 1 && (
            <div className="animate__animated animate_fadeUp">
              <LimitesPorDiaTable limites={limites} refresh={getAllLimites} />
            </div>
          )}

          {insttraza.length > 0 && system != 0 && (
            <div className="animate__animated animate_fadeUp">
              <InsttrazaPorDiaTable insttraza={insttraza} refresh={getAllLimites} />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
