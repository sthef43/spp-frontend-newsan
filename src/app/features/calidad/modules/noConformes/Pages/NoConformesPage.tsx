/* eslint-disable unused-imports/no-unused-vars */
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { useAppDispatch } from "app/core/store/store";
import { IControlLote } from "app/models/IControlLote";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { FormControl, InputLabel, MenuItem, Select, Theme } from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { NoConformesTable } from "../Components/NoConformesTable";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";

const sxStyles = {
  formControl: {
    margin: 4,
    minWidth: 170
  },
  selectEmpty: {
    marginTop: 2
  }
};

interface initialState {
  estadoLote: number;
  temporada: number;
}

const initialState: initialState = {
  estadoLote: 0,
  temporada: 0
};

export const NoConformesPage = (): JSX.Element => {
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialState
  });

  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [estadoSelect, setEstadoSelect] = React.useState<boolean>(true);
  const [noConformesFlag, setNoConformesFlag] = React.useState<boolean>(false);

  const [temporadasSelect, setTemporadasSelect] = React.useState<number[]>([]);
  const [noConformes, setNoConformes] = React.useState<IControlLote[]>([]);

  const watchTemporada = watch("temporada");
  const watchEstado = watch("estadoLote");

  //FETCH PARA TRAERME TODOS LOS CONTROL LOTES QUE TENGAN ESTADO REPROCESO = 'N'
  const onInit = async () => {
    let fetchResult;
    try {
      fetchResult = unwrapResult(await dispatch(ControlLoteSliceRequests.getAllTemporadasRequest()));
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      setTemporadasSelect(fetchResult);
    }
  };

  //FETCH PARA TRAERME TODOS LOS CONTROL LOTE DE LA TEMPORADA SELECCIONADA Y DEPENDE EL ESTADO (NO CONFORME/REPROCESO)
  const handleSearch = async () => {
    let fetchResult: IControlLote[];
    try {
      fetchResult = unwrapResult(
        await dispatch(
          ControlLoteSliceRequests.getAllRechazosByEstadoTemporadaRequest({
            estado: getValues("estadoLote"),
            temporada: getValues("temporada")
          })
        )
      );
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult.length > 0) {
      setNoConformesFlag(!noConformesFlag);
      setNoConformes(fetchResult);
    } else {
      openNotificationUI("No existen registros de esa temporada", "error");
    }
  };

  React.useEffect(() => {
    if (watchEstado > 0 && watchTemporada > 0) {
      handleSearch();
    }
  }, [watchEstado, watchTemporada]);

  // ---------------TITULO---------
  React.useEffect(() => {
    TitleChanger("Equipos no conformes");
    onInit();
  }, []);

  //LISTENER, SE EJECUTA CUANDO SELECCIONO UN ESTADO DE LOTE
  React.useEffect(() => {
    if (watchEstado > 0) {
      setEstadoSelect(false);
    }
  }, [watchEstado]);

  return (
    <div>
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
          {/* ----------------ESTADO---------------*/}
          <div className="text-center sm:text-left p-2">
            <FormControl sx={sxStyles.formControl} variant="standard">
              <InputLabel>Estado</InputLabel>
              <Controller
                name="estadoLote"
                control={control}
                rules={{ required: "Seleccione una línea." }}
                defaultValue={0}
                render={({ field }) => (
                  <Select {...field} variant="standard">
                    <MenuItem value={1}>No Conforme</MenuItem>
                    <MenuItem value={2}>Reproceso</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </div>
          {/* ----------------TEMPORADA---------------*/}
          <div className="text-center sm:text-left p-2">
            <FormControl sx={sxStyles.formControl} disabled={estadoSelect} variant="standard">
              <InputLabel>Temporada</InputLabel>
              <Controller
                name="temporada"
                control={control}
                rules={{ required: true }}
                defaultValue={0}
                render={({ field }) => (
                  <Select {...field} variant="standard">
                    {temporadasSelect &&
                      temporadasSelect.map((temp, index) => {
                        return (
                          <MenuItem key={index} value={temp}>
                            {temp}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
              />
            </FormControl>
          </div>
        </div>
      </div>
      {noConformes.length > 0 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
          <ExportExcel
            title={`EquiposNoConformesTemporada${watchTemporada}`}
            columns={[
              {
                title: "Modelo",
                field: "codigoModelo"
              },
              {
                title: "Lote",
                field: "lote"
              },
              {
                title: "OP",
                field: "numeroOp"
              },
              {
                title: "Desde",
                field: "serieDesde"
              },
              {
                title: "Hasta",
                field: "serieHasta"
              },
              {
                title: "Observacion",
                field: "observaciones"
              },
              {
                title: "Contenido defectuoso",
                field: "contenidoDefectuoso"
              },
              {
                title: "Acción correctiva",
                field: "accioncorrectiva"
              },
              {
                title: "Plan de mejora",
                field: "planmejora"
              },
              {
                title: "Rechazados",
                field: "cantidadRechazos"
              },
              {
                title: "Reprocesados",
                field: "cantidadReprocesos"
              },
              {
                title: "Auditor",
                field: "nombreSupervisor"
              },
              {
                title: "Fecha",
                field: "fecha"
              },
              {
                title: "Fecha de ultimo reproceso",
                field: "fechaReproceso"
              },
              {
                title: "Total reprocesados de ultimo reproceso",
                field: "totalReprocesado"
              }
            ]}
            data={noConformes}
          />
          <NoConformesTable noConformes={noConformes} actualizarTabla={handleSearch} />
        </div>
      )}
    </div>
  );
};
