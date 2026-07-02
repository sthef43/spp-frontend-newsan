import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContContenedorSliceRequests } from "app/Middleware/reducers/ContContenedorSlice";
import { ContPedidoSliceRequests } from "app/Middleware/reducers/ContPedidoSlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
  FunnelChart,
  Funnel,
  LabelList,
  RadialBarChart,
  RadialBar
} from "recharts";

export const Indicadores = () => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const buttonClasses = MaterialButtons();
  interface initialState {
    columna: string;
  }
  const initialStateVar = {
    columna: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Columnas de Fechas
  const [columnasFechas, setColumnasFechas] = useState([]);
  const getColumnasFechas = () => {
    const arr = [];
    arr.push({ id: 1, value: "Programado" });
    arr.push({ id: 2, value: "Entregado" });
    // arr.push({ id: 3, value: "Creación" });
    setColumnasFechas(arr);
  };

  //Watch Columna de Fechas
  const watchLinea = watch("columna");

  //Fecha
  const [fechaSelect, setfechaSelect] = useState(null);
  const onChangeFecha = (fecha: string) => {
    setfechaSelect(moment(fecha).format("YYYY-MM-DD"));
  };

  //Leer Registros
  const [reporte, setReporte] = useState(null);
  const [reporteUno, setReporteUno] = useState(null);
  const [reporteDos, setReporteDos] = useState(null);
  const [reporteFiltrado, setReporteFiltrado] = useState([]);
  const [reportePorcentajeT, setReportePorcentajeT] = useState([]);
  // const [reportePorcentaje, setReportePorcentaje] = useState([]);
  const getInformeEstados = async () => {
    // console.log(fechaSelect); //Fecha Seleccionada YYYY-MM-DD
    // console.log(watchLinea); //Columna de Fecha Seleccionada
    try {
      let result;
      let result2;
      if (watchLinea == "1") {
        result = unwrapResult(
          await dispatch(ContContenedorSliceRequests.getListByMesEstadoProgramadoRequest(fechaSelect))
        );
        result2 = unwrapResult(
          await dispatch(ContPedidoSliceRequests.getListByMesEstadoProgramadoRequest(fechaSelect))
        );
      } else {
        result = unwrapResult(
          await dispatch(ContContenedorSliceRequests.getListByMesEstadoEntregadoRequest(fechaSelect))
        );
        result2 = unwrapResult(await dispatch(ContPedidoSliceRequests.getListByMesEstadoEntregadoRequest(fechaSelect)));
      }
      setReporteUno(result);
      setReporteDos(result2);
    } catch (error) {
      openNotificationUI("Error al leer.", "error");
    }
  };

  const getInformeEstadosFiltrados = () => {
    const grupos = [];

    reporte.forEach((objeto) => {
      const contEstadoDetalle = objeto.contEstado.detalle;
      if (!grupos[contEstadoDetalle]) {
        grupos[contEstadoDetalle] = [];
      }
      grupos[contEstadoDetalle].push(objeto);
      // console.log(grupos);
    });

    const estadosDeseados = ["Programado", "Agregado", "Devuelto", "Entregado", "Cancelado"];
    const arregloResultado = [];
    let idCorrelativo = 1;
    for (const estadoDeseado of estadosDeseados) {
      if (!grupos[estadoDeseado]) {
        grupos[estadoDeseado] = [];
      }
      arregloResultado.push({
        id: idCorrelativo++,
        estado: estadoDeseado,
        cantidad: grupos[estadoDeseado].length
      });
    }
    //Resultado del arreglo
    // console.log(arregloResultado);

    //Calculo Porcentaje
    const sumaProgAg = arregloResultado
      .filter((item) => item.estado === "Programado" || item.estado === "Agregado") // Filtrar los objetos
      .reduce((total, item) => total + item.cantidad, 0); // Sumar los valores
    // console.log("Programados y Agregados: " + sumaProgAg);
    const sumaEntCan = arregloResultado
      .filter((item) => item.estado === "Entregado" || item.estado === "Cancelado") // Filtrar los objetos
      .reduce((total, item) => total + item.cantidad, 0); // Sumar los valores
    // console.log("Entregado y Cancelado: " + sumaEntCan);

    const porcentaje = (sumaEntCan / sumaProgAg) * 100;
    const porcentajeFormateado = porcentaje.toFixed(2);
    // console.log(porcentajeFormateado);

    arregloResultado.push({
      id: idCorrelativo++,
      estado: "EFICIENCIA",
      cantidad: porcentajeFormateado + " % "
    });

    //Porcentaje para gráfico
    const arregloPorcentajeT = [];
    // const arregloPorcentaje = [];

    arregloPorcentajeT.push({
      id: 1,
      estado: "Eficiencia",
      cantidad: 100,
      fill: "#8884d8"
    });
    arregloPorcentajeT.push({
      id: 2,
      estado: "Eficiencia",
      cantidad: porcentaje,
      fill: "#a4de6c"
    });

    setReportePorcentajeT(arregloPorcentajeT);
    // setReportePorcentaje(arregloPorcentaje);
    //Cargo arreglo resultado
    setReporteFiltrado(arregloResultado);
  };
  // useEffect(() => {
  //   console.log(reporteFiltrado);
  // }, [reporteFiltrado]);

  useEffect(() => {
    if (reporteUno && reporteDos) {
      // console.log(reporteUno);
      // console.log(reporteDos);
      const arregloCombinado = reporteUno.concat(reporteDos);
      // console.log(arregloCombinado);
      setReporte(arregloCombinado);
    }
  }, [reporteUno && reporteDos]);

  useEffect(() => {
    if (reporte) {
      getInformeEstadosFiltrados();
    }
  }, [reporte]);

  useEffect(() => {
    TitleChanger("indicadores");
    //Establece la fecha del día al cargarse
    const today = new Date();
    setfechaSelect(moment(today).format("YYYY-MM-DD"));
    getColumnasFechas();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Controller
            name="columna"
            control={control}
            rules={{ required: false }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Columna de Fecha</InputLabel>
                <Select {...field} placeholder="Seleccione Columna de Fecha" variant="standard">
                  {columnasFechas &&
                    columnasFechas.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div className="w-full">
                          <div>{x.value}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>

        <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
          <SelectOfDate pickFecha setFechaProps={onChangeFecha} />
          {/* {fechaSelect && <div>{moment(fechaSelect).format("MM/YYYY")}</div>} */}
        </div>

        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          {watchLinea && (
            <Button
              onClick={getInformeEstados}
              sx={{ marginLeft: 3 }}
              className={buttonClasses.greenButton}
              variant="contained">
              Buscar
            </Button>
          )}
        </div>
      </div>

      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div>
          {reporteFiltrado && (
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              excel={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Estado",
                  field: "estado"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                }
              ]}
              dataInfo={reporteFiltrado}
            />
          )}
        </div>
      </div>
      <div>
        <ComposedChart width={730} height={250} data={reporteFiltrado}>
          <XAxis dataKey="estado" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Area type="monotone" dataKey="cantidad" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="cantidad" barSize={20} fill="#413ea0" />
          {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
        </ComposedChart>
      </div>
      {/* <div>
        <PieChart width={730} height={250}>
          <Pie data={reportePorcentajeT} dataKey="cantidad" nameKey="estado" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
          <Pie
            data={reportePorcentaje}
            dataKey="cantidad"
            nameKey="estado"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#82ca9d"
            label
          />
        </PieChart>
      </div> */}
      <div>
        <RadialBarChart
          width={730}
          height={250}
          innerRadius="10%"
          outerRadius="80%"
          data={reportePorcentajeT}
          startAngle={180}
          endAngle={0}>
          <RadialBar
            // minAngle={15}
            label={{ fill: "#666", position: "insideStart" }}
            background
            // clockWise={true}
            dataKey="cantidad"
          />
          <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
          <Tooltip />
        </RadialBarChart>
      </div>
      <div>
        <FunnelChart width={730} height={250}>
          <Tooltip />
          <Funnel dataKey="cantidad" data={reportePorcentajeT} isAnimationActive>
            <LabelList position="right" fill="#000" stroke="none" dataKey="cantidad" />
          </Funnel>
        </FunnelChart>
      </div>
    </div>
  );
};
