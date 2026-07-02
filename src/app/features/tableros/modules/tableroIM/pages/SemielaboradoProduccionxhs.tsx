/* eslint-disable unused-imports/no-unused-vars */
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { MapasRutasSliceRequest } from "app/Middleware/reducers/MapasRutasSlice";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { ILineaPuesto } from "app/models/ILineaPuesto";
import { RechazosTable } from "../components/RechazosTable";
import { ReparacionesTable } from "../components/ReparacionesTable";
import TableByPuestoIM from "../components/TableByPuestoIM";
import TableProductionByPuesto from "../components/TableProductionByPuesto";
import dayjs from "dayjs";

export const SemielaboradoProduccionxhs = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const [lineas, setLineas] = useState(null);
  const [lineasProduccion, setLineasProduccion] = useState(null);
  const [lineaProduccionSelected, setLineaProduccionSelected] = useState(0);
  const [dataOpen, setDataOpen] = useState(null);
  const [turnoSelected, setTurnoSelected] = useState("M");
  const [fecha, setFecha] = useState(dayjs());
  const [dataOpenModelos, setDataOpenModelos] = useState(null);
  const [total, setTotal] = useState(0);
  const [cantidadByFamilia, setCantidadByFamilia] = useState(null);

  useEffect(() => {
    getLineasProduccion();
    getLineas();
    TitleChanger("PRODUCCION POR HORA");
  }, []);

  //Trae las lineas de controlmantenimiento
  const getLineasProduccion = async () => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
    setLineasProduccion(result);
  };

  //Trae las lineas de produccion06
  const getLineas = async () => {
    let result = [];
    result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    result = result.filter((x) => x.tipoProduccion != "Montaje");
    result = result.filter((x) => {
      const d = (x?.descripcion ?? "").toString().trim().toUpperCase();
      const esInsercionManual = x.tipoProduccion.toLowerCase() != "montaje";
      // const esInsercionManual = d.includes("INSERCION MANUAL") || d.includes("INSERCIÓN MANUAL") || d.includes("AUTOMOTRIZ");
      // const esIM =
      //   d === "IM" ||
      //   d.startsWith("IM ") ||
      //   d.startsWith("IM-") ||
      //   d.startsWith("IM -") ||
      //   d.startsWith("IM_");

      return esInsercionManual;
    });

    setLineas(result);
  };

  const fetchGeneric = async (funcion) => {
    const result = unwrapResult(await dispatch(funcion));
    if (result) return result;
    else return null;
  };

  //Hace las consultas necesarias para armar el listado por hora.
  const getData = async (idLinea) => {
    const lineaProduccionRuta = await fetchGeneric(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId(idLinea));
    if (!lineaProduccionRuta) {
      openNotificationUI("Error al obtener la lineaProduccionRuta", "error");
      return false;
    }
    const mapaRuta = await fetchGeneric(MapasRutasSliceRequest.getByRutaIdAndEsUltimo(lineaProduccionRuta.rutasId));
    if (!mapaRuta) {
      openNotificationUI("Error al obtener el mapaRuta", "error");
      return false;
    }
    const arrayLineaPuesto = await fetchGeneric(LineaPuestoSliceRequest.getAllByLineaId(idLinea));
    if (!arrayLineaPuesto) {
      openNotificationUI("Error al obtener LineaPuesto", "error");
      return false;
    }
    const lineaPuesto = arrayLineaPuesto.find((z) => z.puestoId == mapaRuta.desdePuestoId);
    getListPuestos(arrayLineaPuesto); //Genera el listado de los puestos y las cantidades
    const arrayFinal = [];
    let cantidadTotal = 0;
    //Armo la produccion por hora llamando a trazaunit
    const hora = turnoSelected == "M" ? 6 : turnoSelected == "T" ? 15 : 0;
    const horaFin = turnoSelected == "N" ? hora + 6 : hora + 9; //Calcula en base a 9 hs de trabajo. o 6hs, depende si es turno noche o no.
    for (let index = hora; index < horaFin; index++) {
      const cantidad = await getCantidadProducion(index, index + 1, lineaPuesto.id);
      const objeto = {
        horaDesde: index + ":00 HS",
        horaHasta: index + 1 + ":00 HS",
        produccion: cantidad != null ? cantidad.length : 0
      };
      arrayFinal.push(objeto);
      cantidadTotal = cantidadTotal + (cantidad != null ? cantidad.length : 0);
    }
    setTotal(cantidadTotal);
    setDataOpen(arrayFinal);
    //Calculo los datos para el listado de los modelos y familias.
    getFamiliasModelos(lineaPuesto.id);
    getCantidadPorLineaTurno(idLinea);
  };

  const getCantidadProducion = async (horaDesde, horaHasta, lineaPuestoId) => {
    return await fetchGeneric(
      TrazaUnit_History2SliceRequests.getListByLineaPuestoAndFechaAndHora({
        lineaPuestoId: lineaPuestoId,
        fecha: dayjs(fecha).format("YYYY-MM-DD"),
        horaDesde,
        horaHasta
      })
    );
  };

  // ********** PRODUCCION POR PUESTO ***********************
  const [puestos, setPuestos] = useState(null);
  const [rows, setRows] = useState(null);
  const getCantidadPorLineaTurno = async (idLinea) => {
    const hora = turnoSelected == "M" ? 6 : turnoSelected == "T" ? 15 : 0;
    const horaFin = turnoSelected == "N" ? hora + 5 : hora + 8; //Calcula en base a 9 hs de trabajo. o 6hs, depende si es turno noche o no.
    const objeto = {
      lineaProduccionId: idLinea,
      fecha: dayjs(fecha).format("YYYY-MM-DD"),
      horaDesde: hora,
      horaHasta: horaFin
    };
    const datos = unwrapResult(await dispatch(TrazaUnit_History2SliceRequests.GetListByLineaTurno(objeto)));
    // Obtener todos los puestos únicos
    const puestos = Array.from(new Set(datos.map((d) => d.puesto)));
    // Obtener todos los rangos de horas únicos y ordenados
    const horas = Array.from(new Set(datos.map((d) => `${d.horaDesde}-${d.horaHasta}`)))
      .map((str) => {
        const [desde, hasta] = str.split("-").map(Number);
        return { horaDesde: desde, horaHasta: hasta };
      })
      .sort((a, b) => a.horaDesde - b.horaDesde);
    // Construir filas para la tabla
    const rows = horas.map(({ horaDesde, horaHasta }) => {
      const row = { horaDesde, horaHasta };
      puestos.forEach((puesto) => {
        const obj = datos.find((d) => d.puesto === puesto && d.horaDesde === horaDesde && d.horaHasta === horaHasta);
        row[puesto] = obj ? obj.produccion : "-";
      });
      return row;
    });
    setPuestos(puestos);
    setRows(rows);
  };

  //TRAIGO LAS FAMILIAS Y MODELOS QUE SE PRODUCIERON
  const getAux = async (lineaPuestoId, horaIn, horaFin) => {
    let result;
    try {
      result = unwrapResult(
        await dispatch(
          TrazaOperacionesSliceRequests.getListByLineaPuestoAndFechaAndHora({
            lineaPuestoId,
            fecha: dayjs(fecha).format("YYYY-MM-DD"),
            horaDesde: horaIn,
            horaHasta: horaFin
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) return result;
    else return null;
  };

  const getFamiliasModelos = async (lineaPuestoId: number) => {
    const horaIn = turnoSelected == "M" ? 6 : turnoSelected == "T" ? 15 : 0;
    const horaFin = turnoSelected == "M" ? 14 : turnoSelected == "T" ? 23 : 5;
    const result = await getAux(lineaPuestoId, horaIn, horaFin);
    const array = [];

    if (result) {
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        //consulto las cantidades que se hicieron para ese modelo y familia.
        const resultAux = await fetchGeneric(
          TrazaOperacionesSliceRequests.GetCantidadByLineaPuesto({
            lineaPuestoId,
            fecha: dayjs(fecha).format("YYYY-MM-DD"),
            horaDesde: horaIn,
            horaHasta: horaFin,
            familia: element.familia,
            modelo: element.modelo
          })
        );

        array.push({
          ...element,
          total: resultAux
        });
      }
    }
    setDataOpenModelos(array);
  };

  const vaciarData = () => {
    setTotal(0);
    setDataOpen(null);
    setDataOpenModelos(null);
    // setListCantidadPuestos(null);
  };

  useEffect(() => {
    vaciarData();
    if (lineaProduccionSelected) {
      const linea = lineas.find((x) => x.idLinea == lineaProduccionSelected); //Obtengo la linea de produccion06
      const lineaProduccion = lineasProduccion.find((x) => x.identificadorLinea == linea.codigoInicio); //Obtengo la lineaproduccion de controlmantenimiento
      getData(lineaProduccion.id);
    }
  }, [fecha]);

  useEffect(() => {
    vaciarData();
    if (lineaProduccionSelected) {
      const linea = lineas.find((x) => x.idLinea == lineaProduccionSelected); //Obtengo la linea de produccion06
      const lineaProduccion = lineasProduccion.find((x) => x.identificadorLinea == linea.codigoInicio); //Obtengo la lineaproduccion de controlmantenimiento
      getData(lineaProduccion.id);
    }
  }, [turnoSelected]);

  const handleChangeLinea = (e) => {
    vaciarData();
    setLineaProduccionSelected(e.target.value);
    const linea = lineas.find((x) => x.idLinea == e.target.value); //Obtengo la linea de produccion06
    const lineaProduccion = lineasProduccion.find((x) => x.identificadorLinea == linea.codigoInicio); //Obtengo la lineaproduccion de controlmantenimiento
    //setLineaProduccionSelected(lineaProduccion);
    getData(lineaProduccion.id);
  };

  //Genero el listado de los puestos por los que pasaron.
  const getListPuestos = async (listLineaPuesto: ILineaPuesto[]) => {
    const listLineaPuestoId = listLineaPuesto.map((x) => x.id);
    // const listTrazaUnitHistory2 = await unwrapResult(
    //   await dispatch(
    //     TrazaUnit_History2SliceRequests.GetListPuestosAndCantidad({
    //       fecha: moment(fecha).format("YYYY-MM-DD"),
    //       horaDesde: turnoSelected == "M" ? 6 : turnoSelected == "T" ? 15 : 0,
    //       horaHasta: turnoSelected == "M" ? 15 : turnoSelected == "T" ? 24 : 6,
    //       listLineaPuestoId: listLineaPuestoId
    //     })
    //   )
    // );

    const cantidadByFamilia = await unwrapResult(
      await dispatch(
        TrazaUnit_History2SliceRequests.GetListPuestosAndCantidadByFamilia({
          fecha: dayjs(fecha).format("YYYY-MM-DD"),
          horaDesde: turnoSelected == "M" ? 6 : turnoSelected == "T" ? 15 : 0,
          horaHasta: turnoSelected == "M" ? 15 : turnoSelected == "T" ? 24 : 6,
          listLineaPuestoId: listLineaPuestoId
        })
      )
    );
    if (cantidadByFamilia) {
      setCantidadByFamilia(cantidadByFamilia);
    } else {
      setCantidadByFamilia(null);
    }

    // if (listTrazaUnitHistory2) {
    //   console.log(listTrazaUnitHistory2);
    //   setListCantidadPuestos(listTrazaUnitHistory2);
    // } else setListCantidadPuestos(null);
  };

  // const [listCantidadPuestos, setListCantidadPuestos] = useState(null);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          alignContent: "center",
          maxWidth: "100%",
          padding: "10px"
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "stretch"
          }}
          className="rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="p-2">
            {lineas && (
              <FormControl style={{ width: "400px" }}>
                <InputLabel id="demo-simple-select-label">Linea</InputLabel>
                <Select
                  labelId="demo-simple-selec"
                  id="demo-simple"
                  value={lineaProduccionSelected}
                  label="Linea"
                  onChange={handleChangeLinea}>
                  {lineas &&
                    lineas.map((x) => (
                      <MenuItem key={x.idLinea} value={x.idLinea}>
                        <div className="w-full">
                          <div>{x.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>
          <div className="p-2">
            <FormControl style={{ width: "200px" }}>
              <DesktopDatePicker
                label="Fecha"
                value={fecha}
                inputFormat="DD/MM/YYYY"
                onChange={(e: any) => {
                  setFecha(e);
                }}
                renderInput={(field) => <TextField {...field} variant="standard" />}
              />
            </FormControl>
          </div>
          <div className="text-center sm:text-left p-2">
            <FormControl>
              <FormLabel>Turno</FormLabel>
              <RadioGroup
                value={turnoSelected}
                onChange={(e) => {
                  setTurnoSelected(e.target.value);
                }}>
                <div className="sm:grid sm:grid-cols-1 ">
                  <div className="sm:col-span-1 ">
                    <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                    <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                    <FormControlLabel value="N" control={<Radio />} label="Noche" />
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div>
          <Typography variant="h2" align="center">
            Total Producido: {total}
          </Typography>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          placeContent: "stretch space-around",
          alignContent: "stretch"
        }}>
        <div>
          {/* Produccion por Puesto */}
          {puestos && rows && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <div className="w-full flex justify-center ">
                <TitleUIComponent title={"Producción por Puesto"} classNameDiv="w-full whitespace-wrap mx-0" />
              </div>
              <div>
                <TableProductionByPuesto puestos={puestos} rows={rows} />
              </div>
            </div>
          )}

          {/* Producción */}
          {/* {dataOpen && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <div className="w-full flex justify-center">
                <TitleUIComponent title={"Producción"} classNameDiv="w-full whitespace-wrap mx-0" />
              </div>
              <div>
                <TableComponent
                  Dense={true}
                  IDcolumn={"horaDesde"}
                  columns={[
                    {
                      title: "Hora Desde",
                      field: "horaDesde"
                    },
                    {
                      title: "Hora Hasta",
                      field: "horaHasta"
                    },
                    {
                      title: "Produccion",
                      field: "produccion"
                    }
                  ]}
                  dataInfo={dataOpen}
                />
              </div>
            </div>
          )} */}
        </div>

        <div>
          {/* Rechazos */}
          {lineaProduccionSelected && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <RechazosTable lineaId={lineaProduccionSelected} fecha={fecha} turno={turnoSelected}></RechazosTable>
            </div>
          )}
          {/* Reparaciones */}
          {lineaProduccionSelected && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <ReparacionesTable
                lineaId={lineaProduccionSelected}
                lineas={lineas}
                fecha={fecha}
                turno={turnoSelected}></ReparacionesTable>
            </div>
          )}
        </div>

        <div>
          {/* Modelos y Familias */}
          {dataOpenModelos && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <div className="w-full flex justify-center ">
                <TitleUIComponent title={"Modelos y Familias"} classNameDiv="w-full whitespace-wrap mx-0" />
              </div>
              <div>
                <TableComponent
                  Dense={true}
                  IDcolumn={"total"}
                  columns={[
                    {
                      title: "Modelo",
                      field: "modelo"
                    },
                    {
                      title: "Familia",
                      field: "familia"
                    },
                    {
                      title: "Produccion",
                      field: "total"
                    }
                  ]}
                  dataInfo={dataOpenModelos}
                />
              </div>
            </div>
          )}
          {/* Puestos */}
          {cantidadByFamilia && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <div className="w-full flex justify-center ">
                <TitleUIComponent title={"Puestos "} classNameDiv="w-full whitespace-wrap mx-0" />
              </div>
              <div>
                <TableByPuestoIM cantidadByFamilia={cantidadByFamilia} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
