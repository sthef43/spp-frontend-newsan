import { unwrapResult } from "@reduxjs/toolkit";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ParadasPorSectorDTO } from "app/models/DTO/ParadasPorSectorDTO";
import { GraficosParadasLinea } from "app/features/informes/Modules/informeParadasKpi/components/graficosParadasLinea";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TimerIcon from "@mui/icons-material/Timer";
import { ILinea, IPlant, IProducto } from "app/models";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { TableParadaLinea } from "app/features/informes/Modules/informeParadasKpi/components/tableParadaLinea";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

export const ReporteParadasLinea = (): JSX.Element => {
  const initialState = {
    fechaDesde: null,
    fechaHasta: moment().toDate()
  };

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const [listaProductos, setListaProductos] = useState<IProducto[]>([]);
  const [listaLineas, setListaLineas] = useState<ILinea[]>([]);

  const [paradasLinea, setParadasLinea] = useState<ParadasPorSectorDTO[]>([]);
  const [totalTiempoParadas, setTotalTiempoParadas] = useState<number>(null);
  const [totalParadas, setTotalParadas] = useState<number>(null);

  const [errorIzq, setErrorIzq] = useState<string>("");
  const [errorDerecha, setErrorDerecha] = useState<string>("");
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<number>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(null);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<number>(null);
  const [paradasLineaSeleccioanda, setParadasLineaSeleccionada] = useState<IParadasDeLinea[]>([]);
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  //---------------------------------------------REQUESTs de planta, producto y lineas----------------------------------------------**
  const GetPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando plantas..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setListaPlantas(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const GetProductos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando productos..."));
      const response = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      if (response) {
        setListaProductos(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const GetLineas = async (plantaId: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      if (response) {
        setListaLineas(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //---------------------------------------------REQUESTs de planta, producto y lineas----------------------------------------------**

  const getParadasLineaSelected = () => {
    console.log("linea id", lineaSeleccionada);
    console.log("paradas de linea", paradasLinea);
    const aux = paradasLinea.flatMap((sector) => sector.paradas);
    console.log("auxxd", aux);
    const movimientosParaTabla = paradasLinea
      .flatMap((sector) => sector.paradas)
      .filter((parada) => parada.lineaProduccionId === lineaSeleccionada);
    setParadasLineaSeleccionada(movimientosParaTabla);
    console.log("movs", movimientosParaTabla);
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

  const getParadasLinea = async () => {
    if (!plantaSeleccionada || !productoSeleccionado || !fechaDesde || !fechaHasta) {
      setParadasLinea([]);
      return;
    }

    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando paradas de linea..."));
    try {
      const response = unwrapResult(
        await dispatch(
          ParadasDeLineaSliceRequests.GetTotalParadasDeLineaByDate({
            fechaInicio: fechaDesde ? moment(fechaDesde).format("YYYY-MM-DD") : null,
            fechaFin: fechaHasta ? moment(fechaHasta).format("YYYY-MM-DD") : null,
            plantaId: plantaSeleccionada,
            productoId: productoSeleccionado
          })
        )
      );
      if (response) {
        setParadasLinea(response);
        const totalTiempo = response.reduce((total, parada) => total + (parada.totalMinutos ?? 0), 0);
        const totalParadas = response.reduce((total, parada) => total + (parada.paradas?.length ?? 0), 0);
        setTotalTiempoParadas(totalTiempo);
        setTotalParadas(totalParadas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    // getParadasLinea();
    GetPlantas();
    GetProductos();
  }, []);

  useEffect(() => {
    GetLineas(plantaSeleccionada);
  }, [plantaSeleccionada]);

  useEffect(() => {
    getParadasLinea();
    GetLineas(plantaSeleccionada);
  }, [plantaSeleccionada, productoSeleccionado, fechaDesde, fechaHasta]);

  useEffect(() => {
    getParadasLineaSelected();
  }, [lineaSeleccionada]);

  useEffect(() => {
    TitleChanger("INFORME PARADAS DE LINEA");
  }, []);

  return (
    <div className="w-full p-3 flex flex-col gap-5">
      <div className="w-full">
        <p className="text-[#3F3D56] font-bold text-2xl">Historial por fecha de paradas de linea.</p>
        <p>Reporte por fecha del historial de paradas de linea.</p>
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="flex w-full flex-row justify-between items-center">
          {/*  aca van filtro planta, producto y los dos selectores de fecha con el renderizado condiconal para la info de abajo ↓↓ asi que tambien tengo que agregar*/}
          <div className="w-1/5">
            <SelectComponent
              listaObjetos={listaPlantas}
              inputLabel="Seleccione una planta"
              valueSelect={(value) => value.id}
              varianteEstilo="filled"
              control={control as any}
              ValueSave={(val) => setPlantaSeleccionada(Number(val))}
              valueLabel={(value) => value.name}
              nameSelect="plantaSeleccionada"
              valueKey={(value) => value}
              estilosPersonalizados={{
                backgroundColor: "#fff"
              }}
            />
          </div>
          <div className="w-1/5">
            <SelectComponent
              listaObjetos={listaProductos}
              inputLabel="Seleccione un producto"
              valueSelect={(value) => value.id}
              varianteEstilo="filled"
              control={control as any}
              ValueSave={(val) => setProductoSeleccionado(Number(val))}
              valueLabel={(value) => value.nombre}
              nameSelect="productoSeleccionado"
              valueKey={(value) => value}
              estilosPersonalizados={{
                backgroundColor: "#fff"
              }}
            />
          </div>

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
        </div>
        {paradasLinea && paradasLinea.length > 0 ? (
          <>
            <div className="w-full flex flex-row justify-between gap-5">
              <div className="w-1/2 bg-white p-4 rounded-md shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="m-0 text-[10px] md:text-xs font-bold text-[#45474C] uppercase tracking-wider">
                    Duración total paradas
                  </p>
                  <TimerIcon sx={{ color: "#D32F2F", fontSize: "2rem" }} />
                </div>

                <div className="flex items-baseline gap-1 m-0">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600">
                    {(totalTiempoParadas / 60).toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">hs</span>
                </div>
              </div>

              <div className="w-1/2 bg-white p-4 rounded-md shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="m-0 text-[10px] md:text-xs font-bold text-[#45474C] uppercase tracking-wider">
                    Frecuencia de eventos
                  </p>
                  <ReportProblemIcon sx={{ color: "#F59E0B", fontSize: "2rem" }} />
                </div>

                <div className="flex items-baseline gap-1 m-0">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600">{totalParadas}</span>
                  <span className="text-sm font-semibold text-slate-600">eventos</span>
                </div>
              </div>
            </div>
            <div className="w-full ">
              <GraficosParadasLinea dataParadasLinea={paradasLinea} />
            </div>
            <div className="w-full flex-col">
              <div className="w-1/3">
                <SelectComponent
                  listaObjetos={listaLineas}
                  inputLabel="Seleccione una linea"
                  valueSelect={(value) => value.idLinea}
                  varianteEstilo="filled"
                  control={control as any}
                  ValueSave={(val) => setLineaSeleccionada(Number(val))}
                  valueLabel={(value) => value.descripcion}
                  nameSelect="lineaSeleccionada"
                  valueKey={(value) => value}
                  estilosPersonalizados={{
                    backgroundColor: "#fff"
                  }}
                />
              </div>
              {paradasLineaSeleccioanda.length > 0 ? (
                <>
                  <TableParadaLinea
                    lineaSelected={listaLineas.find((x) => x.idLinea === lineaSeleccionada)}
                    paradasLineaSelected={paradasLineaSeleccioanda}
                  />
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg mt-4">
                  <InfoOutlinedIcon sx={{ color: "#cbd5e1", fontSize: "3.5rem" }} />

                  <p className="text-slate-500 text-lg font-semibold mt-3">No se encontraron movimientos</p>
                  <p className="text-slate-400 text-sm mt-1 text-center max-w-md">
                    La línea seleccionada no registra paradas para este rango de fechas o filtros aplicados.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-10 bg-slate-50 border border-dashed border-slate-300 rounded-md mt-4">
            <TimerIcon sx={{ color: "#cbd5e1", fontSize: "4rem" }} />
            <p className="text-slate-500 text-lg mt-2 font-medium">No hay datos para mostrar</p>
            <p className="text-slate-400 text-sm">
              Seleccione una planta, un producto y el rango de fechas para visualizar el reporte.
            </p>
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};
