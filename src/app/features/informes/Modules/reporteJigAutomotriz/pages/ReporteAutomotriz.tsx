import React, { useEffect, useMemo, useRef, useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import { useForm } from "react-hook-form";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { AutomotrizJigSliceRequest } from "../../reportePlacasAutomotriz/reducers/AutomotrizJigSlice";
import { AutomotrizTesteosTable } from "app/features/informes/Modules/reporteJigAutomotriz/components/automotrizTesteosTable";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

export const ReporteAutomotriz = (): JSX.Element => {
  const initialState = {
    fechaDesde: moment().toDate(),
    fechaHasta: moment().toDate(),
    filtroEquipos: ""
  };
  const tipoFiltros = [
    {
      tipo: "Placas OK",
      value: "OK"
    },
    {
      tipo: "Placas NG",
      value: "-"
    },
    {
      tipo: "Todas las placas",
      value: ""
    }
  ];
  const buttonClasses = MaterialButtons();
  const exportarExcelTests = useRef<ExcelExport>(null);
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [errorIzq, setErrorIzq] = useState<string>("");
  const [errorDerecha, setErrorDerecha] = useState<string>("");
  const [dataTesteos, setDataTesteos] = useState([]);
  const [filtroEquipos, setFiltroEquipos] = useState("");
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [agruparPlacas, setAgruparPlacas] = useState<boolean>(false);
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  const GetTesteosPorFecha = async () => {
    try {
      const responseTesteos = unwrapResult(
        await dispatch(
          AutomotrizJigSliceRequest.GetTesteosByDates({
            fechaDesde: moment(getValues("fechaDesde")).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
            fechaHasta: moment(getValues("fechaHasta")).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
          })
        )
      );
      console.log(responseTesteos);
      setDataTesteos(responseTesteos);
    } catch (err) {
      console.log(err);
    }
  };

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

  const setStateBtn = () => {
    if (errorIzq.trim().length === 0 && errorDerecha.trim().length === 0) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  };

  useEffect(() => {
    TitleChanger("Informe automotriz - Jig");
  }, []);

  useEffect(() => {
    setStateBtn();
  }, [errorIzq, errorDerecha]);
  //--------------------------useMemos-----------------------------
  const placasFiltradas = useMemo(() => {
    //este memo filtra las placas segun el estado del testeo
    if (!filtroEquipos || filtroEquipos === "") {
      return dataTesteos;
    }

    const estadoBuscado = filtroEquipos === "OK" ? true : false;
    return dataTesteos.filter((x) => x.estado === estadoBuscado);
  }, [dataTesteos, filtroEquipos]);

  const placasAgrupadas = useMemo(() => {
    //memo para el agrupamiento de placas, mas que nada para informar o que la persona vea cuantos testeos ng y ok tiene :/

    if (!agruparPlacas) {
      return placasFiltradas;
    }

    const agrupadoPorCodigo = dataTesteos.reduce((acumulador, placa) => {
      const codigo = placa.codigo;

      if (!acumulador[codigo]) {
        //aca checkeo si existe la plaquita
        acumulador[codigo] = []; //si no ta la agrego
      }

      acumulador[codigo].push(placa); //se agrega el registro original a la "carpeta" de la placa.
      return acumulador;
    }, {} as Record<string, any[]>);

    const resultadoAgrupado = Object.keys(agrupadoPorCodigo).map((codigo) => {
      //y aca rearmamos la tableData con el mapeo agregando al cantidad de ng y ok :D
      const historicoPlaca = agrupadoPorCodigo[codigo];

      const cantOk = historicoPlaca.filter((x) => x.estado === true).length;
      const cantNg = historicoPlaca.filter((x) => x.estado === false).length;

      return {
        id: codigo,
        codigo: codigo,
        modelo: historicoPlaca[0].modelo,
        cantOk: cantOk,
        cantNg: cantNg,
        historial: historicoPlaca
      }; //objeto que se devuelve por placa donde esta toda la info :D
    });
    //experiencia armando esto: 6/10
    return resultadoAgrupado;
  }, [placasFiltradas, dataTesteos, agruparPlacas]);

  //--------------------------useMemos-----------------------------

  //------------paseo de la data para el export del excel----------------

  const dataExcel = useMemo(() => {
    if (dataTesteos.length === 0 || !dataTesteos) return [];

    return placasFiltradas.map((placa) => {
      let dataParseada = null;
      if (placa.testeo) {
        try {
          dataParseada = JSON.parse(placa.testeo);
        } catch (e) {
          console.error("No se pudo parsear el testeo de la placa", placa.codigo);
        }
      }

      return {
        ...placa,
        testResult: dataParseada?.["Test Result"] ?? "N/A",

        maxVoltEff: dataParseada?.["Maximum Voltage Test"]?.["Efficiency[%]"] ?? "N/A",
        maxVoltInputCurrent: dataParseada?.["Maximum Voltage Test"]?.["Input Current[mA]"] ?? "N/A",
        maxVoltInputVoltage: dataParseada?.["Maximum Voltage Test"]?.["Input Voltage[V]"] ?? "N/A",
        maxVoltOutputCurrent: dataParseada?.["Maximum Voltage Test"]?.["Output Current[mA]"] ?? "N/A",
        maxVoltOutputVoltage: dataParseada?.["Maximum Voltage Test"]?.["Output Voltage[V]"] ?? "N/A",

        minVolInputCurrent: dataParseada?.["Minimum Voltage Test"]?.["Input Current[mA]"] ?? "N/A",
        minVolInputVoltage: dataParseada?.["Minimum Voltage Test"]?.["Input Voltage[V]"] ?? "N/A",
        minVolOutputCurrent: dataParseada?.["Minimum Voltage Test"]?.["Output Current[mA]"] ?? "N/A",
        minVolOutputVoltage: dataParseada?.["Minimum Voltage Test"]?.["Output Voltage[V]"] ?? "N/A",

        ratedVoltEff: dataParseada?.["Rated Voltage Test"]?.["Efficiency[%]"] ?? "N/A",
        ratedVoltInputCurrent: dataParseada?.["Rated Voltage Test"]?.["Input Current[mA]"] ?? "N/A",
        ratedVoltInputVoltage: dataParseada?.["Rated Voltage Test"]?.["Input Voltage[V]"] ?? "N/A",
        ratedVoltOutputCurrent: dataParseada?.["Rated Voltage Test"]?.["Output Current[mA]"] ?? "N/A",
        ratedVoltOutputVoltage: dataParseada?.["Rated Voltage Test"]?.["Output Voltage[V]"] ?? "N/A",
        slot: dataParseada?.["Slot"] ?? "N/A]"
      };
    });
  }, [dataTesteos]);

  //------------paseo de la data para el export del excel----------------

  const descargarExcel = () => {
    console.log("dataExcel", dataExcel);
    if (exportarExcelTests.current) {
      exportarExcelTests.current.save();
    }
  };

  console.log("agrup o no", placasAgrupadas);
  return (
    <main className="p-4 w-full">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="bg-white p-2 rounded-md ">
          <div className="w-full flex justify-center  mb-4">
            <TitleUIComponent
              title="Reporte de automotriz por fecha"
              classNameDiv="w-min whitespace-nowrap"
              classNameTitle={"text-2xl"}
            />
          </div>
          <div className="w-full flex flex-row justify-center gap-6">
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
                  <TextField {...field} variant="standard" error={errorDerecha.length > 0} helperText={errorDerecha} />
                )}
              />
            </div>
            <>
              <div className="w-1/5">
                <SelectComponent
                  listaObjetos={tipoFiltros}
                  inputLabel="Seleccione un filtro"
                  valueSelect={(value) => value.value}
                  varianteEstilo="filled"
                  control={control as any}
                  ValueSave={(val) => setFiltroEquipos(String(val))}
                  disabled={disableBtn || agruparPlacas || dataTesteos.length === 0}
                  valueLabel={(value) => value.tipo}
                  nameSelect="filtroEquipos"
                  valueKey={(value) => value}
                  estilosPersonalizados={{
                    backgroundColor: "#fff"
                  }}
                />
              </div>
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={dataTesteos.length === 0}
                      checked={agruparPlacas}
                      onChange={(e) => {
                        const check = e.target.checked;
                        setAgruparPlacas(check);

                        if (check) {
                          setFiltroEquipos("");
                        }
                      }}
                    />
                  }
                  label="Agrupar placas"
                />
              </div>
              <div className="p-2">
                <Button
                  className={buttonClasses.blueButton}
                  variant="contained"
                  disabled={disableBtn}
                  onClick={() => {
                    GetTesteosPorFecha();
                  }}>
                  Buscar
                </Button>
              </div>
            </>
          </div>
        </div>
        <div className="p-2 mt-3 flex items-center">
          <Button
            className={buttonClasses.greenButton}
            variant="contained"
            disabled={disableBtn || dataTesteos.length === 0}
            onClick={descargarExcel}>
            Exportar
          </Button>
        </div>
        {dataTesteos.length > 0 && (
          <div className="animate__animated animate_fadeUp w-full P-4 mt-6">
            <AutomotrizTesteosTable dataTabla={placasAgrupadas} flagAgrupado={agruparPlacas} />
          </div>
        )}
      </LocalizationProvider>
      <>
        <ExcelExport
          data={dataExcel}
          ref={exportarExcelTests}
          fileName={`"Automotriz JIG Reporte - ${moment(fechaDesde).format("DD-MM-YYYY")} - ${moment(fechaHasta).format(
            "DD-MM-YYYY"
          )}.xlsx`}>
          <ExcelExportColumn field="codigo" title="Codigo" />
          <ExcelExportColumn field="modelo" title="Modelo" />

          <ExcelExportColumn field="maxVoltEff" title="Max Vol Test - Eff [%]" />
          <ExcelExportColumn field="maxVoltInputCurrent" title="Max Vol Test - Input Current[mA]" />
          <ExcelExportColumn field="maxVoltInputVoltage" title="Max Vol Test - Input Voltaje[V]" />
          <ExcelExportColumn field="maxVoltOutputCurrent" title="Max Vol Test - Output Current[mA]" />
          <ExcelExportColumn field="maxVoltOutputVoltage" title="Max Vol Test - Output Voltage[V]" />

          <ExcelExportColumn field="minVolInputCurrent" title="Min Vol test - Input Current[mA]" />
          <ExcelExportColumn field="minVolInputVoltage" title="Min Vol test - Input Voltage[V]" />
          <ExcelExportColumn field="minVolOutputCurrent" title="Min Vol test - Output Current[mA]" />
          <ExcelExportColumn field="minVolOutputVoltage" title="Min Vol test - Output Voltage[V]" />

          <ExcelExportColumn field="ratedVoltEff" title="Rated Vol Test - Eff [%]" />
          <ExcelExportColumn field="ratedVoltInputCurrent" title="Rated Vol Test - Input Current[mA]" />
          <ExcelExportColumn field="ratedVoltInputVoltage" title="Rated Vol Test - Input Voltaje[V]" />
          <ExcelExportColumn field="ratedVoltOutputCurrent" title="Rated Vol Test - Output Current[mA]" />
          <ExcelExportColumn field="ratedVoltOutputVoltage" title="Rated Vol Test - Output Voltage[V]" />

          <ExcelExportColumn field="slot" title="Slot" />
          <ExcelExportColumn field="testResult" title="Resultado Testeo" />
        </ExcelExport>
      </>
    </main>
  );
};
