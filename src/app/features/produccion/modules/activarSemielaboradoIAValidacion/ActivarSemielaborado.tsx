import { PowerSettingsNew } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { SemielaboradoTipoSliceRequests } from "app/Middleware/reducers/SemielaboradoTipoSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea } from "app/models";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface typesValue {
  semiElaboradoId: number;
  lineaId: number;
}

const defaultValue = {
  semiElaborado: 0,
  lineaId: 0
};

export const ActivarSemielaborado = () => {
  const { control, watch } = useForm<typesValue>({ defaultValues: defaultValue });
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const watchLineaId = watch("lineaId");
  const watchSemiId = watch("semiElaboradoId");

  const [lineas, setLineas] = useState<ILinea[]>([]);
  const [tipoSemiElaborado, setTipoSemiElaborado] = useState<ISemielaboradoTipo[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const [responseLineas, responseTipoSemi] = await Promise.all([
        unwrapResult(await dispatch(LineaSliceRequests.GetListByTipoProduccion("Semielaborado"))),
        unwrapResult(await dispatch(SemielaboradoTipoSliceRequests.getAllRequest()))
      ]);
      if (responseLineas || responseTipoSemi) {
        setLineas(responseLineas);
        setTipoSemiElaborado(responseTipoSemi);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [semielaborados, setSemielaborado] = useState([]);
  const getSemielaborados = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getSemielaboradoValidacion({ tipoSemi: watchSemiId, lineaId: watchLineaId })
        )
      );
      if (response) {
        setSemielaborado(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const activarSemielaborado = async (row) => {
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    debugger;
    if (row.familiaId == row.familiaSemielaboradoIaId) {
      const actualizarDato = {
        name: "",
        activa: row.lineaActiva,
        deleted: false,
        familiaId: row.familiaSemielaboradoIaId,
        id: row.idFamiliaTabla,
        lineaProduccionId: row.lineaProduccionId,
        LineaProduccionFamilia: null,
        semiActivo: row.semiActivo ? false : true,
        semielaboradoIA: null,
        semielaboradoIAId: row.semiElaboradoIAId
      };
      console.log(row);
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.PutRequest(actualizarDato)));
        console.log(response);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        console.log(error);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
      openNotificationUI("Se activo la familia correctamente", "success");
      getSemielaborados();
    } else {
      openNotificationUI("La familia del semielaborado es distinta a la familia del modelo", "warning");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    TitleChanger("Activacion Semielaborado");
    getLineas();
  }, []);

  useEffect(() => {
    if (watchLineaId) {
      setSemielaborado([]);
    }
    if (watchSemiId) {
      setSemielaborado([]);
    }
  }, [watchLineaId, watchSemiId]);

  useEffect(() => {
    if (watchSemiId) {
      getSemielaborados();
    }
  }, [watchSemiId]);

  return (
    <main className="w-screen h-screen px-10">
      <section className="flex items-center gap-x-4 mt-8">
        <div className="bg-secondaryNew rounded-md shadow-elevation-6 p-2 w-1/2">
          {lineas && (
            <Controller
              name="lineaId"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una linea</InputLabel>
                  <Select {...field} variant="standard">
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.idLinea} value={x.idLinea}>
                          <div className="w-full">
                            <div>{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          )}
        </div>
        <div className="bg-secondaryNew rounded-md shadow-elevation-6 p-2 w-1/2">
          {tipoSemiElaborado && (
            <Controller
              name="semiElaboradoId"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione Tipo de Placa</InputLabel>
                  <Select {...field} variant="standard">
                    {tipoSemiElaborado &&
                      tipoSemiElaborado.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          )}
        </div>
      </section>
      <div className="w-full mt-8">
        <TableComponent
          dataInfo={semielaborados}
          IDcolumn="datosSemielaborado.idProduccion"
          rowStyle={(rowData) => {
            if (rowData.datosSemielaborado.semiActivo) return { backgroundColor: "#36e0ff70" };
          }}
          columns={[
            {
              title: "Modelo",
              field: "datosSemielaborado.codigoModelo"
            },
            {
              title: "Lote",
              field: "datosSemielaborado.lote"
            },
            {
              title: "OP",
              field: "datosSemielaborado.numeroOp"
            },
            {
              title: "Cantidad",
              field: "datosSemielaborado.cantidad"
            },
            {
              title: "Producido",
              field: "datosSemielaborado.cantidadProducida"
            },
            {
              title: "Familia",
              field: "datosSemielaborado.familia.nombre"
            },
            {
              title: "Semielaborado IM",
              field: "datosSemielaborado.semielaboradoImNombre"
            },
            {
              title: "Semielaborado IA",
              field: "datosSemielaborado.semielaboradoIaNombre"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                if (row.datosSemielaborado.semielaboradoIaNombre != "-") {
                  return (
                    <div>
                      <div>
                        <Tooltip title={row.datosSemielaborado.semiActivo ? "Desactivar" : "Activar"}>
                          <IconButton
                            onClick={() => activarSemielaborado(row.datosSemielaborado)}
                            size="small"
                            style={{ position: "relative" }}>
                            <PowerSettingsNew color={row.datosSemielaborado.semiActivo ? "success" : "inherit"} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                } else {
                  return "";
                }
              }
            }
          ]}
        />
      </div>
    </main>
  );
};
