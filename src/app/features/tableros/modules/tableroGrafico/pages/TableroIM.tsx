import React, { useCallback, useEffect, useState } from "react";
import { GraficoRechazoPorDia } from "../components/subComponents/GraficoRechazoPorDia";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ILinea, ITurno } from "app/models";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import IndicadorProduccionGeneral from "../components/IndicadorProduccionGeneral";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import IndicadorPorFamilia from "../components/subComponents/IndicadorPorFamilia";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import _ from "lodash";
import IndicadorSoldadura from "../components/IndicadorSoldadura";
import { AgruparRechazoPorHora } from "../utils/helper";

const TableroIM = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [lineas, setLineas] = useState<ILinea[]>([]);
  const [turnos, setTurnos] = useState<ITurno[]>([]);
  const [lineasProduccion, setLineasProduccion] = useState<ILineaProduccion[]>([]);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<ILinea>();
  const [lineaProduccionSeleccionada, setLineaProduccionSeleccionada] = useState<ILineaProduccion>();
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<ITurno>();

  const [totalProduccion, setTotalProduccion] = useState(0);
  const [totalRechazo, setTotalRechazo] = useState(0);

  const [produccion, setProduccion] = useState<any[]>();
  const [produccion2, setProduccion2] = useState<any[]>();

  const init = useCallback(async () => {
    let fetchLineasResult;
    let fetchLineasProduccionResult;
    let fetchHorariosResult;
    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      fetchLineasProduccionResult = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
      fetchHorariosResult = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineasResult = null;
      fetchLineasProduccionResult = null;
      fetchHorariosResult = null;
    }
    if (fetchLineasResult) {
      setLineas(fetchLineasResult);
      setLineasProduccion(fetchLineasProduccionResult);
      setTurnos(fetchHorariosResult);
    }
  }, []);

  useEffect(() => {
    TitleChanger("Indicadores Graficos");
    init();
  }, []);

  const onChangeLinea = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value;
    const linea = lineas.find((d) => d.idLinea == value);
    if (!linea) {
      return;
    }
    const lineaProduccion = lineasProduccion.find((d) => d.identificadorLinea == +linea.codigoInicio);
    if (!lineaProduccion) return;
    if (linea) {
      setLineaSeleccionada(linea);
      setLineaProduccionSeleccionada(lineaProduccion);
    }
  };

  const onChangeTurno = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value;
    const turno = turnos.find((d) => d.id == value);
    if (!turno) return;
    setTurnoSeleccionado(turno);
  };

  const getProduccionPorModelo = async () => {
    const desde = turnoSeleccionado.desdeHora.split(":")[0];
    const hasta = turnoSeleccionado.hastaHora.split(":")[0];
    const data = unwrapResult(
      await dispatch(
        TrazaUnit_History2SliceRequests.getProduccionByModelo({
          lineaProduccionId: lineaProduccionSeleccionada.id,
          desde,
          hasta
        })
      )
    );
    const data2 = unwrapResult(
      await dispatch(RechazoSliceRequests.GetRechazoByFamilia({ idLinea: lineaSeleccionada.idLinea, desde, hasta }))
    );
    if (!data || !data2) {
      return;
    }
    const agruparProduccion = _.chain(data)
      .groupBy("familia")
      .map((value, key) => ({ familia: key, data: value, cantidad: _.sumBy(value, "cantidad") }))
      .value();
    const agruparRechazo = _.chain(data2)
      .groupBy("familia")
      .map((value, key) => ({ familia: key, data: AgruparRechazoPorHora(value), total: _.sumBy(value, "total") }))
      .value();

    agruparProduccion.map((prod) => {
      const rechazos = agruparRechazo.find((rech) => rech.familia);
      prod["rechazos"] = rechazos || 0;
    });

    data.map((prod) => {
      const ob = data2.filter((rech) => rech.familia == prod.familia && rech.hora == prod.hora);
      prod["rechazo"] = ob;
      return prod;
    });

    const totalProduccion = _.sumBy(agruparProduccion, "cantidad");
    const totalRechazo = _.sumBy(data2, "total");
    setProduccion2(data);

    setProduccion(agruparProduccion);
    setTotalProduccion(totalProduccion);
    setTotalRechazo(totalRechazo);
  };

  useEffect(() => {
    if (!turnoSeleccionado || !lineaProduccionSeleccionada) {
      return;
    }
    getProduccionPorModelo();
  }, [lineaProduccionSeleccionada, turnoSeleccionado]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Indicadores Línea Inserción Manual</h1>
      <div className="flex flex-col md:flex-row gap-2 w-full rounded-md mb-4">
        <Select className="w-full" variant="standard" onChange={onChangeLinea}>
          {lineas &&
            lineas.map((x) => (
              <MenuItem key={x.idLinea} value={x.idLinea}>
                <div className="w-full">
                  <div>{x.descripcion}</div>
                </div>
              </MenuItem>
            ))}
        </Select>

        <Select className="w-full" variant="standard" onChange={onChangeTurno}>
          {turnos &&
            turnos.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                <div className="w-full">
                  <div>{x.nombre}</div>
                </div>
              </MenuItem>
            ))}
        </Select>
      </div>
      {lineaSeleccionada && turnoSeleccionado && (
        <>
          <div className="flex justify-center">
            <GraficoRechazoPorDia idLinea={lineaSeleccionada.idLinea} turno={turnoSeleccionado.abreviatura} />
          </div>
          <div className="mt-4 flex flex-col xl:flex-row gap-3">
            <div className="bg-secondaryNew rounded-md p-3 w-full xl:w-[45%] border border-gray-400/30">
              <IndicadorProduccionGeneral
                lineaProduccionId={lineaProduccionSeleccionada.id}
                idLinea={lineaSeleccionada.idLinea}
                identificadorLinea={+lineaSeleccionada.codigoInicio}
                totalProduccion={totalProduccion}
                totalRechazo={totalRechazo}
              />
            </div>
            <div className="bg-secondaryNew rounded-md p-3 w-full xl:w-[55%] border border-gray-400/30">
              <h2 className="text-center md:text-left  text-3xl font-medium">Producción por Modelo</h2>
              {produccion && <IndicadorPorFamilia produccion={produccion} />}
              <div>
                <h2 className="text-center md:text-left text-3xl font-medium">Informe Soldadura</h2>
                {produccion2 && (
                  <IndicadorSoldadura
                    produccion={produccion2}
                    lineaProduccionId={lineaProduccionSeleccionada.id}
                    idLinea={lineaSeleccionada.idLinea}
                    turno={turnoSeleccionado.abreviatura}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            {/* <GraficoPorModelo />
      <GraficoInformeSoldadura /> */}
          </div>
          {/* <GraficoProduccionGeneral />
      <div>
      </div> */}
        </>
      )}
    </div>
  );
};

export default TableroIM;
