import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Theme } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea } from "app/models";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import _ from "lodash";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { ReparacionSpSliceRequests } from "app/Middleware/reducers/reparacionSPSlice";
import * as XLSX from "xlsx";
import { ResumenMensualRechazos } from "app/models/DTO/ResumenMensualRechazosdto";
import { TableRechazo } from "../components/TableRechazo";
import {
  getTotalReparaciones,
  getTotalProduccion,
  getTotalRechazo,
  getTotalFPY
} from "app/shared/helpers/resumenRechazoFunciones";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";

export const RechazoMensual = (): JSX.Element => {
  const fechaActual = moment().toDate();
  const initialState = {
    fecha: moment().toDate(),
    linea: 0,
    turno: "M"
  };
  const dias = [...Array(31).keys()].map((_, i) => i + 1);
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [month, setMonth] = React.useState<number>(moment().month() + 1);
  const [year, setYear] = React.useState<number>(moment().year());
  const [lineaSelected, setlineaSelected] = React.useState<number>(0);
  const [rechazos, setRechazos] = React.useState<ResumenMensualRechazos[]>([]);
  const [produccion, setProduccion] = React.useState<any[]>([]);
  const [reparaciones, setReparaciones] = React.useState<any[]>([]);
  const [puestos, setPuestos] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { control, setValue, getValues, watch, register } = useForm({
    defaultValues: initialState
  });

  const linea = register("linea");
  const fecha = watch("fecha");

  const buttonClasses = MaterialButtons();

  const { TitleChanger } = useTitleOfApp();
  React.useEffect(() => {
    TitleChanger("Informe mensual de Rechazos");
    onInit();
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

  const getInformeMensual = async () => {
    try {
      const lineaId = getValues("linea");
      const fecha = moment(getValues("fecha"));
      const turno = getValues("turno");
      const codigoInicio = +lineas.find((d) => d.idLinea == lineaId).codigoInicio;
      const year = fecha.year();
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const rechazos = unwrapResult(
        await dispatch(
          RechazoSliceRequests.getInformeMensual({
            month,
            year,
            lineaId,
            turno
          })
        )
      );

      //Seleccionar entre EMPQ y Inicio
      let producciones = [];
      if (lineaId === 11 || lineaId === 12) {
        console.log("tomar desde EMPQDecl");
        //Tomar de la tabla EMPQ_Declarations
        producciones = unwrapResult(
          await dispatch(
            empq_declarationsSliceRequests.GetListInformeMensual({
              month,
              year,
              lineaId,
              turno
            })
          )
        );
      } else {
        //Tomar de la tabla Inicio
        producciones = unwrapResult(
          await dispatch(
            InicioSliceRequests.getInformeMensual({
              month,
              year,
              codigoInicio,
              turno
            })
          )
        );
      }

      const reparaciones = unwrapResult(
        await dispatch(
          ReparacionSpSliceRequests.getInformeMensual({
            month,
            year,
            codigoInicio,
            turno
          })
        )
      );

      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setProduccion(producciones);
      setRechazos(rechazos);
      setReparaciones(reparaciones);
      setPuestos(Object.keys(_.groupBy(rechazos, "codigoRechazoCampos.descripcionPuesto")));
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const handleChange = (event) => {
    linea.onChange(event);
    const lineaId = event.target.value;
    setlineaSelected(lineaId);
  };

  const handleMonthChange = (fecha: any) => {
    setValue("fecha", fecha);
    setMonth(fecha.month() + 1);
  };

  const handleYearChange = (fecha: any) => {
    setValue("fecha", fecha);
    setYear(fecha.year());
    setMonth(fecha.month() + 1);
  };

  /** exportar */

  const exportarClick = () => {
    const arrayData = [];
    const linea = lineas.find((d) => d.idLinea == lineaSelected);
    const Heading = [
      [
        `Resumen: Mes: ${moment(fecha).format("MMMM")} - Año: ${year} - Linea ${
          linea?.descripcion
        } - Turno: ${getValues("turno")}`
      ]
    ];
    puestos.forEach((puesto) => {
      const objdias = dias.reduce(
        (o, key) =>
          Object.assign(o, {
            Rechazo: puesto,
            [" " + key.toString()]: getTotalRechazo(puesto, key, rechazos)
          }),
        {}
      );
      arrayData.push(objdias);
    });
    arrayData.forEach((data) => {
      data["Total"] = getTotalRechazo(data.Rechazo, 0, rechazos);
    });

    const objRechazoTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "Rechazo Total",
          [" " + key.toString()]: getTotalRechazo(null, key, rechazos)
        }),
      {}
    );
    objRechazoTotal["Total"] = getTotalRechazo(null, 0, rechazos);
    arrayData.push(objRechazoTotal);

    const objReparacionesTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "Reparados",
          [" " + key.toString()]: getTotalReparaciones(key, reparaciones)
        }),
      {}
    );

    objReparacionesTotal["Total"] = getTotalReparaciones(0, reparaciones);
    arrayData.push(objReparacionesTotal);

    const objTarget = dias.reduce((o, key) => {
      const total = produccion.find((d) => new Date(d.fecha).getDate() == key);
      return Object.assign(o, {
        Rechazo: "Target",
        [" " + key.toString()]: total && total.target ? total.target : ""
      });
    }, {});
    arrayData.push(objTarget);

    const objRProduccionTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "Produccion",
          [" " + key.toString()]: getTotalProduccion(key, produccion)
        }),
      {}
    );
    objRProduccionTotal["Total"] = getTotalProduccion(0, produccion);
    arrayData.push(objRProduccionTotal);
    const objRFPYTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "FPY%",
          [" " + key.toString()]: `${getTotalFPY(key, produccion, rechazos)}%`
        }),
      {}
    );

    arrayData.push(objRFPYTotal);

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_json(ws, arrayData, { origin: "A2", skipHeader: false });
    const merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 32 } }];
    ws["!merges"] = merge;
    XLSX.utils.book_append_sheet(wb, ws, "Resumen Rechazo");
    XLSX.writeFile(wb, `resumen-${moment(fecha).format("MMMM")}-${year}.xlsx`);
  };

  return (
    <div>
      <div className="m-1 sm:m-10 h-full">
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="w-full flex justify-center mb-3">
            <TitleUIComponent title="Informe Mensual Rechazos" classNameDiv="w-min whitespace-nowrap" />
          </div>
          <div className="md:flex items-center justify-around w-full font-semibold">
            <div className="text-center ">
              <DesktopDatePicker
                label="Año"
                views={["year"]}
                value={fecha}
                inputFormat="YYYY"
                maxDate={fechaActual}
                renderInput={(field) => (
                  <TextField
                    {...field}
                    variant="standard"
                    sx={{ "& input": { textTransform: "uppercase", textAlign: "center", fontWeight: "900" } }}
                  />
                )}
                onChange={(e: any) => {
                  handleYearChange(e);
                }}
              />
            </div>

            <div className="text-center ">
              <DesktopDatePicker
                label="Mes"
                views={["month"]}
                value={fecha}
                inputFormat="MMMM"
                maxDate={fechaActual}
                renderInput={(field) => (
                  <TextField
                    {...field}
                    variant="standard"
                    sx={{ "& input": { textTransform: "uppercase", textAlign: "center", fontWeight: "900" } }}
                  />
                )}
                onChange={(e: any) => {
                  handleMonthChange(e);
                }}
              />
            </div>

            <div className="text-center ">
              <FormControl sx={{ margin: 4, minWidth: 170 }} variant="standard">
                <InputLabel>Turno</InputLabel>
                <Controller
                  name="turno"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} variant="standard" onChange={handleChange}>
                      <MenuItem value="M">Mañana</MenuItem>
                      <MenuItem value="T">Tarde</MenuItem>
                      <MenuItem value="N">Noche</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            <div className="text-center ">
              <FormControl sx={{ margin: 4, minWidth: 170 }} variant="standard">
                <InputLabel>Linea</InputLabel>
                <Controller
                  name="linea"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} variant="standard" onChange={handleChange}>
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
            <div className="text-center md:flex gap-1 sm:flex">
              <Button
                onClick={() => {
                  getInformeMensual();
                }}
                disabled={lineaSelected == 0}
                className={`${buttonClasses.blueButton} w-full mb-1 xs:mb-0 sm:mb-0`}
                variant="contained">
                Buscar
              </Button>
              <Button
                onClick={() => {
                  exportarClick();
                }}
                disabled={rechazos && rechazos.length == 0}
                className={`${buttonClasses.blueButton} w-full mb-1 xs:mb-0 sm:mb-0`}
                color="info"
                variant="contained">
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <TableRechazo
        dias={dias}
        rechazos={rechazos}
        produccion={produccion}
        puestos={puestos}
        reparaciones={reparaciones}
        month={month}
        year={year}
        idLinea={lineaSelected}
      />
    </div>
  );
};
