import { FormControl, MenuItem, InputLabel, Select, Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ReprocesoLineaScSliceRequest } from "app/Middleware/reducers/ReprocesoLineaSCSlice";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlant } from "app/models";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface defaultValue {
  plantaId: number;
  lineaId: number;
  opcionReproceso: string;
}

const initialValues = {
  plantaId: 0,
  lineaId: 0,
  opcionReproceso: ""
};

export const ReporteReprocesoPage = (): JSX.Element => {
  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const {
    control,
    watch,
    register,
    formState: { errors, isValid }
  } = useForm<defaultValue>({
    defaultValues: initialValues
  });

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [fechaInvalida, setFechaInvalida] = useState(false);

  const watchPlantaId = watch("plantaId");
  const watchLineaId = watch("lineaId");
  const watchOpcionReproceso = watch("opcionReproceso");

  const [reprocesosFiltrado, setReprocesosFiltrados] = useState([]);
  const getReprocesoCargadosconTraza = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          ReprocesoLineaSliceRequests.getReprocesosByLineaAndDate({
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            idLinea: watchLineaId
          })
        )
      );
      if (response.length == 0) {
        openNotificationUI("No se encontraron reproceso cargados", "success");
        setReprocesosCargados([]);
      } else {
        setReprocesosFiltrados(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const [reprocesosCargados, setReprocesosCargados] = useState([]);
  const getReprocesoCargados = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          ReprocesoLineaScSliceRequest.getReprocesosWithTrazaByDate({ fechaDesde: fechaDesde, fechaHasta: fechaHasta })
        )
      );
      if (response.length == 0) {
        openNotificationUI("No se encontraron reproceso cargados", "success");
        setReprocesosCargados([]);
      } else {
        setReprocesosCargados(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      if (response) {
        setListaPlantas(response);
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const [lineas, setLineas] = useState<ILinea[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlantaId)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      if (response) {
        setLineas(response);
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const opcionReproceso = () => {
    if (watchOpcionReproceso == "Reproceso Con no Conforme SPP") {
      getReprocesoCargadosconTraza();
    } else if (watchOpcionReproceso == "Reproceso Sin no Conforme SPP") {
      getReprocesoCargados();
    }
  };

  useEffect(() => {
    TitleChanger("Reporte de reprocesos");
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlantaId) {
      getLineas();
    }
  }, [watchPlantaId]);

  useEffect(() => {
    setReprocesosFiltrados([]);
  }, [watchLineaId]);

  useEffect(() => {
    if (watchOpcionReproceso) {
      if (reprocesosCargados.length > 0 || reprocesosFiltrado.length > 0) {
        setReprocesosCargados([]);
        setReprocesosFiltrados([]);
      }
    }
  }, [watchOpcionReproceso]);

  return (
    <main className="w-screen h-screen flex justify-start items-center flex-col px-8">
      <header className="flex justify-center gap-4 w-full items-center py-5 mt-3">
        <div className="w-[30%]">
          <Controller
            control={control}
            name="plantaId"
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined">
                <InputLabel className="bg-background" sx={{ paddingX: "8px", paddingY: "1px" }}>
                  Seleccione una planta
                </InputLabel>
                <Select {...field}>
                  {listaPlantas?.map((elementos) => (
                    <MenuItem key={elementos.id} value={elementos.id}>
                      <div className="w-full">
                        <div>{elementos.name}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="w-[30%]">
          <Controller
            control={control}
            name="opcionReproceso"
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <InputLabel className="bg-background" sx={{ paddingX: "8px", paddingY: "1px" }}>
                  Seleccione una opcion
                </InputLabel>
                <Select
                  {...field}
                  {...register("opcionReproceso", {
                    validate: (value) => {
                      if (value == "") {
                        return "Debe ingresar una opcion";
                      } else {
                        return true;
                      }
                    }
                  })}>
                  {["Reproceso Con no Conforme SPP", "Reproceso Sin no Conforme SPP"].map((elementos, index) => (
                    <MenuItem key={index} value={elementos}>
                      <div className="w-full">
                        <div>{elementos}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {errors.opcionReproceso && errors.opcionReproceso?.type === "validate" && (
            <span className="text-red-500 font-semibold">Debe seleccionar una opcion</span>
          )}
        </div>
        {watchOpcionReproceso == "Reproceso Con no Conforme SPP" && (
          <div className="w-[30%]">
            <Controller
              control={control}
              name="lineaId"
              defaultValue={0}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel className="bg-background" sx={{ paddingX: "8px", paddingY: "1px" }}>
                    Seleccione una linea
                  </InputLabel>
                  <Select {...field}>
                    {lineas.map((elementos) => (
                      <MenuItem key={elementos.idLinea} value={elementos.idLinea}>
                        <div className="w-full">
                          <div>{elementos.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        )}
        <SelectOfDate
          fechaDesdeHasta
          setFechaDesdeProps={setFechaDesde}
          setFechaHastaProps={setFechaHasta}
          setErrorProps={setFechaInvalida}
        />
        <Button
          className={classes.blueButton}
          onClick={() => {
            opcionReproceso();
          }}
          disabled={!isValid || fechaInvalida}>
          BUSCAR
        </Button>
      </header>
      <div className="w-full">
        <TableComponent
          dataInfo={watchOpcionReproceso == "Reproceso Sin no Conforme SPP" ? reprocesosCargados : reprocesosFiltrado}
          IDcolumn="datosReproceso.id"
          buscar
          excel
          columns={[
            {
              title: "Codigo Modelo",
              field: "codigoModelo",
              render: (rowData) => {
                return (
                  <>
                    {watchOpcionReproceso === "Reproceso Con no Conforme SPP" ? (
                      <div>{rowData.codigoModelo}</div>
                    ) : (
                      <div>No se encontro modelo</div>
                    )}
                  </>
                );
              }
            },
            {
              title: "Lote",
              field: "lote",
              render: (rowData) => {
                return (
                  <>
                    {watchOpcionReproceso === "Reproceso Con no Conforme SPP" ? (
                      <div>{rowData.lote}</div>
                    ) : (
                      <div>No se encontro lote</div>
                    )}
                  </>
                );
              }
            },
            {
              title: "Numero Newsan",
              field: "codigoNewsan"
            },
            {
              title: "Trazabilidad",
              field: "trazabilidad"
            },
            {
              title: "Auditor",
              field: "nombreUsuario"
            },
            {
              title: "Estado Reproceso",
              field: "estadoReproceso"
            }
          ]}
        />
      </div>
    </main>
  );
};
