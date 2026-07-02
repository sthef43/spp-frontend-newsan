import { Button, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSlice, LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { ReparacionSpSliceRequests } from "app/Middleware/reducers/reparacionSPSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import { IInformeRechazoMensual } from "app/models/IInformeRechazoMensual";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TableRechazos } from "./Components/TableRechazos";
import { getTotalFPY, getTotalProduccion, getTotalRechazo, getTotalReparaciones } from "./functions/functionRechazos";
import * as XLSX from "xlsx";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

export const InformeRechazoMultiple = () => {
  const { control } = useForm();

  const linea = useAppSelector((state) => state.linea.object);

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const { TitleChanger } = useTitleOfApp();

  const fechaActual = moment().toDate();
  const dias = [...Array(31).keys()].map((_, i) => i + 1);
  const turnosDiponibles = ["Mañana", "Tarde", "Noche"];

  const [fechaSeleccionadaAño, setFechaSeleccionadaAño] = useState<string>(moment().year().toString());
  const [fechaSeleccionadaSelect, setFechaSeleccionadaSelect] = useState("");

  const [fechaSeleccionadaMes, setFechaSeleccionadaMes] = useState(0);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [lineaIdSeleccionada, setLineaIdSeleccionada] = useState(null);

  const [lineas, setLineas] = useState<ILinea[]>([]);
  FetchApi<ILinea[]>(LineaSliceRequests.getAllRequest, null, true, null, setLineas);

  const [listaRechazos, setListaRechazos] = useState<IInformeRechazoMensual[]>([]);
  const getRechazos = async () => {
    const siglaTurno = turnoSeleccionado.substring(0, 1);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          RechazoSliceRequests.GetAllDateWithDatesAndLinea({
            año: fechaSeleccionadaAño,
            mes: fechaSeleccionadaMes + 1,
            turno: siglaTurno,
            lineaIdAux: lineaIdSeleccionada
          })
        )
      );
      if (response) {
        setListaRechazos(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [reparaciones, setReparaciones] = useState([]);
  const getReparaciones = async () => {
    const siglaTurno = turnoSeleccionado.substring(0, 1);
    try {
      const response = unwrapResult(
        await dispatch(
          ReparacionSpSliceRequests.getInformeMensual({
            month: fechaSeleccionadaMes + 1,
            year: parseInt(fechaSeleccionadaAño),
            codigoInicio: parseInt(linea.codigoInicio),
            turno: siglaTurno
          })
        )
      );
      if (response) {
        setReparaciones(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [producciones, setProducciones] = useState([]);
  const getProducciones = async () => {
    const siglaTurno = turnoSeleccionado.substring(0, 1);
    try {
      if (linea.idLinea === 11 || linea.idLinea == 12) {
        const response = unwrapResult(
          await dispatch(
            empq_declarationsSliceRequests.GetListInformeMensual({
              month: fechaSeleccionadaMes + 1,
              year: parseInt(fechaSeleccionadaAño),
              lineaId: linea.idLinea,
              turno: siglaTurno
            })
          )
        );
        if (response) {
          setProducciones(response);
        }
      } else {
        const response = unwrapResult(
          await dispatch(
            InicioSliceRequests.getInformeMensual({
              month: fechaSeleccionadaMes + 1,
              year: parseInt(fechaSeleccionadaAño),
              codigoInicio: parseInt(linea.codigoInicio),
              turno: siglaTurno
            })
          )
        );
        setProducciones(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChange = (e) => {
    const añoFormat = moment(e).format("YYYY");
    setFechaSeleccionadaAño(añoFormat);
  };

  const handleMesChange = (e) => {
    const mesFormat = moment(e).format("MM");
    setFechaSeleccionadaSelect(e);
    setFechaSeleccionadaMes(e.month());
  };

  const exportarClick = () => {
    const arrayData = [];
    const linea = lineas.find((d) => d.idLinea == lineaIdSeleccionada);
    const Heading = [
      [
        `Resumen: Mes: ${moment(fechaSeleccionadaMes).format("MMMM")} - Año: ${fechaSeleccionadaAño} - Linea ${
          linea?.descripcion
        } - Turno: ${turnoSeleccionado}`
      ]
    ];

    listaRechazos.forEach((puesto) => {
      const objdias = dias.reduce(
        (o, key) =>
          Object.assign(o, {
            Rechazo: puesto.componente,
            SubComponente: puesto.subComponente,
            Defecto: puesto.defecto,
            [" " + key.toString()]: getTotalRechazo(puesto.componente, key, listaRechazos)
          }),
        {}
      );
      arrayData.push(objdias);
    });

    arrayData.forEach((data) => {
      data["Total"] = getTotalRechazo(data.Rechazo, 0, listaRechazos);
    });

    const objRechazoTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "Rechazo Total",
          [" " + key.toString()]: getTotalRechazo(null, key, listaRechazos)
        }),
      {}
    );
    objRechazoTotal["Total"] = getTotalRechazo(null, 0, listaRechazos);
    arrayData.push(objRechazoTotal);

    const objReparacionesTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "Reparados",
          [" " + key.toString()]: getTotalReparaciones(key, listaRechazos)
        }),
      {}
    );

    objReparacionesTotal["Total"] = getTotalReparaciones(0, listaRechazos);
    arrayData.push(objReparacionesTotal);

    const objTarget = dias.reduce((o, key) => {
      const total = producciones.find((d) => new Date(d.fecha).getDate() == key);
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
          [" " + key.toString()]: getTotalProduccion(key, producciones)
        }),
      {}
    );
    objRProduccionTotal["Total"] = getTotalProduccion(0, producciones);
    arrayData.push(objRProduccionTotal);
    const objRFPYTotal = dias.reduce(
      (o, key) =>
        Object.assign(o, {
          Rechazo: "FPY%",
          [" " + key.toString()]: `${getTotalFPY(key, producciones, listaRechazos)}%`
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
    XLSX.writeFile(wb, `resumen-${moment(fechaSeleccionadaMes).format("MMMM")}-${fechaSeleccionadaAño}.xlsx`);
  };

  useEffect(() => {
    if (lineaIdSeleccionada) {
      dispatch(LineaSlice.actions.setSelectLinea(lineaIdSeleccionada));
    }
  }, [lineaIdSeleccionada]);

  useEffect(() => {
    TitleChanger("Informe Rechazo Multiple Mensual");
  }, []);

  return (
    <main className="w-full h-full px-4 my-6">
      <header className="w-full mt flex flex-col items-center justify-center px-4 rounded-md border border-gray-200 shadow-lg bg-secondaryNew">
        <div className="mt-4 mb-6">
          <TitleUIComponent title="Informe Mensual Rechazos" classNameDiv="w-min whitespace-nowrap" />
        </div>
        <div className="flex flex-row justify-between w-full pb-4 gap-x-6">
          <Controller
            name="año"
            control={control}
            render={({ field }) => (
              <DesktopDatePicker
                label="Seleccione un año"
                views={["year"]}
                value={fechaSeleccionadaAño}
                inputFormat="YYYY"
                maxDate={fechaActual}
                renderInput={(field) => <TextField {...field} variant="outlined" fullWidth />}
                onChange={(e: any) => {
                  handleYearChange(e);
                }}
              />
            )}
          />
          <Controller
            name="mes"
            control={control}
            render={({ field }) => (
              <DesktopDatePicker
                label="Seleccione un mes"
                views={["month"]}
                value={fechaSeleccionadaSelect}
                inputFormat="MMMM"
                maxDate={fechaActual}
                renderInput={(field) => <TextField {...field} variant="outlined" fullWidth />}
                onChange={handleMesChange}
              />
            )}
          />
          <SelectComponent
            control={control}
            inputLabel="Seleccione un turno"
            listaObjetos={turnosDiponibles}
            nameSelect="turnos"
            valueSelect={(value) => value}
            valueLabel={(value) => value}
            valueKey={(value) => value}
            ValueSave={setTurnoSeleccionado}
          />
          <SelectComponent
            control={control}
            inputLabel="Seleccione un linea"
            listaObjetos={lineas}
            nameSelect="linea"
            valueSelect={(value) => value.idLinea}
            valueLabel={(value) => value.descripcion}
            valueKey={(value) => value}
            ValueSave={setLineaIdSeleccionada}
          />
          <section className="flex justify-center gap-x-4 mt-4">
            <div>
              <Button
                type="submit"
                onClick={() => {
                  getRechazos();
                  getReparaciones();
                  getProducciones();
                }}
                disabled={lineaIdSeleccionada == null}
                className={buttonClases.blueButton}>
                BUSCAR
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => {
                  exportarClick();
                }}
                disabled={listaRechazos.length == 0}
                className={buttonClases.greenButton}>
                EXPORTAR
              </Button>
            </div>
          </section>
        </div>
      </header>
      <section className="mt-6 w-full">
        <TableRechazos dias={dias} rechazos={listaRechazos} reparaciones={reparaciones} producciones={producciones} />
      </section>
    </main>
  );
};
