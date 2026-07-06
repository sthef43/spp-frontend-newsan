import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotacionSliceRequests } from "app/features/ingenieria/slices/DotacionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DatosTareasConResultadosDTO } from "../../models/DTOS/DatosTareasConResultadosDTO";
import { SumatoriaFieldTotal } from "../../models/DTOS/SumatoriaFieldTotal";
import { IDotacion } from "../../models/IDotacion";
import { IDotacionGrupoSectoresBloque } from "../../models/IDotacionGrupoSectoresBloque";
import { IDotacionTareasResultados } from "../../models/IDotacionTareasResultados";
import { IDotacionTotales } from "../../models/IDotacionTotales";
import { DotacionTareasResultadosSliceRequest } from "../../reducers/DotacionTareasResultadosSlice";
import { DotacionTareaSliceRequest } from "../../reducers/DotacionTareasSlice";
import { DotacionTotalesSliceRequest } from "../../reducers/DotacionTotalesSlice";

interface propiedadesDotacionTotales {
  piso: string;
  turno: string;
  fieldTotal: string;
}

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  dotacionSeleccionada: IDotacion;
  objetosDotacionTotales: propiedadesDotacionTotales;
  datosDates: any;
  refreshTable: (newValue: IDotacion[]) => void;
}

export const RealizarTareasModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  objetosDotacionTotales,
  datosDates,
  refreshTable
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, errors }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [modeloSeleccionada, setModeloSeleccionado] = useState<string | number>("");
  const [sectorSeleccionado, setSectorSeleccioado] = useState<string | number>(0);
  const [estadoDotacion, setEstadoDotacion] = useState<any>();

  const [listaDatosDotaciones, setListaDatosDotaciones] = useState<string[]>([]);
  FetchApi<string[]>(
    DotacionSliceRequests.GetAllDotacionGroupInLine,
    datosDates,
    false,
    openModal,
    setListaDatosDotaciones
  );

  const [listaSectores, setListaSectores] = useState<IDotacionGrupoSectoresBloque[]>([]);
  FetchApi<IDotacionGrupoSectoresBloque[]>(
    DotacionSliceRequests.GetDotacionBySector,
    7,
    false,
    openModal,
    setListaSectores
  );

  const [totalesDotacionEncontrada, setTotalesDotacionEncontrada] = useState<IDotacionTotales>();
  const verificarDotacion = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(DotacionSliceRequests.SearchThatExistDotacion(modeloSeleccionada as string))
      );
      if (response) {
        const dotacionValores = unwrapResult(
          await dispatch(DotacionTotalesSliceRequest.GetTotalsByDotacionId(response.dotacionId))
        );
        setEstadoDotacion({
          dotacionId: response.dotacionId,
          dotacionEncontrada: response.dotacionEncontada,
          dotacionModelo: response.dotacionModelo
        });
        setTotalesDotacionEncontrada(dotacionValores);
        openNotificationUI("Se encontro una dotacion", "success");
      } else {
        setEstadoDotacion(false);
        openNotificationUI("No se encontro una dotacion", "error");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaTareas, setListaTaras] = useState<DatosTareasConResultadosDTO[]>([]);
  const [tareasEncontradas, setTareasEncontradas] = useState<IDotacionTareasResultados[]>([]);
  const getListaTareas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          DotacionTareaSliceRequest.GetAllTareasWithValue({
            sectorId: sectorSeleccionado,
            dotacionId: estadoDotacion.dotacionId,
            lineaTurnoField: objetosDotacionTotales.fieldTotal
          })
        )
      );
      const responseTareasResultados = unwrapResult(
        await dispatch(
          DotacionTareasResultadosSliceRequest.GetAllTasksByDotacionId({
            dotacionId: estadoDotacion.dotacionId,
            sectorId: sectorSeleccionado,
            lineaTurnoField: objetosDotacionTotales.fieldTotal
          })
        )
      );
      if (response) {
        setListaTaras(response);
      } else {
        setListaTaras([]);
      }

      if (responseTareasResultados && responseTareasResultados.length > 0) {
        setTareasEncontradas(responseTareasResultados);
      } else {
        setTareasEncontradas(responseTareasResultados);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onSubmit = async (data) => {
    const { ritmoPlan, ritmoPauta, modelos, proveedor, ...dataSinRitmos } = data;
    let response = false;
    let total: SumatoriaFieldTotal;
    const nuevaLista = generarArchivos(dataSinRitmos);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (tareasEncontradas && tareasEncontradas.length == 0) {
        response = unwrapResult(await dispatch(DotacionTareasResultadosSliceRequest.multiPostRequest(nuevaLista)));
      } else {
        response = unwrapResult(await dispatch(DotacionTareasResultadosSliceRequest.multiPutRequest(nuevaLista)));
      }
      total = unwrapResult(
        await dispatch(
          DotacionTareasResultadosSliceRequest.GetTotalValuesOfTasks({
            dotacionId: estadoDotacion.dotacionId,
            lineaTurnoField: objetosDotacionTotales.fieldTotal
          })
        )
      );
      const subirTotales = generarNuevosTotales(total.sumaPorField);
      const responseActualizaTotales = unwrapResult(
        await dispatch(DotacionTotalesSliceRequest.PutRequest(subirTotales))
      );
      if (responseActualizaTotales) {
        const sumarTotales = { ...estadoDotacion.dotacionModelo, sumatoriaTotal: total.sumaTotalValores };
        await dispatch(DotacionSliceRequests.PutRequest(sumarTotales));
        const refreshTableDotacion = unwrapResult(await dispatch(DotacionSliceRequests.GetAllByDates(datosDates)));
        refreshTable(refreshTableDotacion);
        openNotificationUI("Se agregaron los datos de la dotacion", "success");
        setSectorSeleccioado(0);
        setListaTaras([]);
        reset();
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarArchivos = (data) => {
    try {
      const entries = Object.entries(data);
      const cambios = entries
        .filter(([_, value]) => {
          if (value === "") return false;
          const parsedValue = parseFloat(value as string);
          return !isNaN(parsedValue);
        })
        .map(([key, value]) => {
          const tarea = tareasEncontradas.find((elementos) => elementos.nombreTarea === key) || {
            id: 0,
            valorTarea: 0
          };
          const valorNuevo = parseFloat(value as string);

          return {
            nombreTarea: key,
            valorTarea: valorNuevo,
            dotacionId: estadoDotacion.dotacionId,
            dotacionSectoresId: sectorSeleccionado as number,
            createdDate: moment().format(),
            lineaTurnoField: objetosDotacionTotales.fieldTotal,
            id: tarea.id
          };
        })
        .filter(Boolean);
      return cambios;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const generarNuevosTotales = (total: number) => {
    try {
      const nuevoTotal: IDotacionTotales = {
        id: totalesDotacionEncontrada.id,
        piso: objetosDotacionTotales.piso,
        turno: "",
        dotacionId: estadoDotacion.dotacionId,
        hrUeTarde: objetosDotacionTotales.fieldTotal === "hrUeTarde" ? total : totalesDotacionEncontrada.hrUeTarde,
        hrUiTarde: objetosDotacionTotales.fieldTotal === "hrUiTarde" ? total : totalesDotacionEncontrada.hrUiTarde,
        hrUeMañana: objetosDotacionTotales.fieldTotal === "hrUeMañana" ? total : totalesDotacionEncontrada.hrUeMañana,
        hrUiMañana: objetosDotacionTotales.fieldTotal === "hrUiMañana" ? total : totalesDotacionEncontrada.hrUiMañana,
        lrUiMañana: objetosDotacionTotales.fieldTotal === "lrUiMañana" ? total : totalesDotacionEncontrada.lrUiMañana,
        lrUeFlexMañana:
          objetosDotacionTotales.fieldTotal === "lrUeFlexMañana" ? total : totalesDotacionEncontrada.lrUeFlexMañana,
        lrUiTarde: objetosDotacionTotales.fieldTotal === "lrUiTarde" ? total : totalesDotacionEncontrada.lrUiTarde,
        lrUeFlexTarde:
          objetosDotacionTotales.fieldTotal === "lrUeFlexTarde" ? total : totalesDotacionEncontrada.lrUeFlexTarde
      };

      if (nuevoTotal !== null) {
        return nuevoTotal;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error ${error}`, "error");
    }
  };

  useEffect(() => {
    reset();
    setListaTaras([]);
    if (sectorSeleccionado && sectorSeleccionado !== 0) {
      getListaTareas();
    }
  }, [sectorSeleccionado, reset]);

  useEffect(() => {
    if (listaTareas) {
      listaTareas.forEach((tarea) => {
        setValue(tarea.nombre, tarea.valorTarea, {
          shouldValidate: true,
          shouldDirty: true
        });
      });
    }
  }, [listaTareas, setValue]);

  return (
    <main className="w-[75vw]">
      {listaDatosDotaciones && (
        <section className="flex flex-col justify-between items-center">
          <div className="flex flex-row justify-between w-full gap-x-4">
            <SelectComponent
              listaObjetos={listaDatosDotaciones}
              nameSelect="modelos"
              control={control}
              inputLabel="seleccione un modelo"
              valueLabel={(value) => value}
              valueSelect={(value) => value}
              ValueSave={setModeloSeleccionado}
              valueKey={(value) => value}
            />
          </div>
          <div className="mt-4">
            <Button
              disabled={modeloSeleccionada === ""}
              onClick={() => {
                verificarDotacion();
              }}
              className={buttonClases.greenButton}>
              Buscar
            </Button>
          </div>
        </section>
      )}
      {listaSectores && estadoDotacion && (
        <section className="flex flex-row justify-between w-full my-4 border-y border-gray-400 py-4">
          {listaSectores.map((elementos, index) => (
            <div
              onClick={() => {
                setSectorSeleccioado(elementos.dotacionSectoresId);
              }}
              key={elementos.id}
              className="flex flex-col items-center w-1/3">
              <p
                className={`${
                  sectorSeleccionado == elementos.dotacionSectoresId
                    ? "bg-primaryNew text-white"
                    : "border-black bg-transparent"
                } hover:bg-primaryNew hover:text-white transition-colors hover:border-primaryNew border text-4xl rounded-full py-5 px-8`}>
                {index + 1}
              </p>
              <p className="mt-4 text-xl">{elementos.dotacionSectores.nombre}</p>
            </div>
          ))}
        </section>
      )}
      {listaTareas && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-28 mt-8 justify-center grid-cols-3 w-full">
          {listaTareas.map((elementos, index) => (
            <div key={index} className="flex flex-row flex-wrap mt-4">
              <TextFieldComponent
                control={control}
                index={index}
                labelInput={elementos.nombre}
                nameInput={elementos.nombre}
                valueDefault={elementos.valorTarea}
                requiredBool
                errors={errors}
                typeDate="text"
                typeInput="standard"
              />
            </div>
          ))}
          <div className="col-start-2 flex flex-row w-full justify-center mt-10 gap-x-2">
            <div>
              <Button type="submit" disabled={!isValid || sectorSeleccionado == 0} className={buttonClases.greenButton}>
                Guardar
              </Button>
            </div>
            <div>
              <Button
                onClick={() => {
                  setOpenModal(false);
                }}
                className={buttonClases.redButton}>
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
};
