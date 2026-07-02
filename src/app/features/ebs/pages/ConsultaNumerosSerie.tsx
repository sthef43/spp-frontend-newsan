import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme
} from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { ILinea } from "app/models/ILinea";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IXXE_WIP_CONTROL_SERIALES } from "app/models/IXXE_WIP_CONTROL_SERIALES";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { IModelo } from "app/models/IModelo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { XXE_WIP_CONTROL_SERIALESSliceRequests } from "app/Middleware/reducers/XXE_WIP_CONTROL_SERIALESSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

const sxStyles = {
  formControl: {
    margin: 4,
    minWidth: 170
  },
  selectEmpty: {
    marginTop: 2
  }
};

export const ConsultaNumerosSerie = (): JSX.Element => {
  const [busquedaDisabled, setBusquedaDisabled] = useState<boolean>(false);
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const initialState = {
    planta: 0,
    linea: 0,
    modelo: "",
    name: ""
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  //Leer
  const [listPlantas, setListPlantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  const [lineas, setLineas] = useState<ILinea[]>([]);
  const getLineas = async () => {
    let fetchLineasResult;
    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlantaId)));
    } catch (error) {
      fetchLineasResult = null;
    }
    if (fetchLineasResult) {
      setLineas(fetchLineasResult);
    }
  };

  const watchModelo = watch("modelo");
  const [modelos, setModelos] = useState<IModelo[]>([]);
  const [modelosPrim, setModelosPrim] = useState<IModelo[]>([]);
  const getModelos = async () => {
    let fetchModelosResult;
    try {
      const lineaId = getValues("linea");
      fetchModelosResult = unwrapResult(await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(lineaId)));
      if (lineaId === 82) {
        const modelosAutomotriz = fetchModelosResult.map((modelo) => {
          return {
            ...modelo,
            nombre: modelo.nombre?.startsWith("91") ? modelo.nombre.substring(2) : modelo.nombre
          };
        });
        setModelosPrim(modelosAutomotriz);
      } else {
        setModelosPrim(fetchModelosResult);
      }
    } catch (error) {
      fetchModelosResult = null;
    }
  };

  const getModelosSinDuplicar = async () => {
    const datosUnicos = modelosPrim.filter((valor, indice, self) => {
      return self.findIndex((elemento) => elemento.nombre === valor.nombre) === indice;
    });
    setModelos(datosUnicos);
  };

  useEffect(() => {
    getModelosSinDuplicar();
  }, [modelosPrim]);

  const [serie, setSerie] = useState<IXXE_WIP_CONTROL_SERIALES[]>(null);
  const getAllNumSerie = async () => {
    if (watchModelo != "") {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      try {
        const params = { organizationCode: orgCode, item: orgCode == "UP6" ? "91" + watchModelo : watchModelo };
        const responses = unwrapResult(
          await dispatch(XXE_WIP_CONTROL_SERIALESSliceRequests.getByOrganizationCodeItemRequest(params))
        );
        setSerie(responses);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        openNotificationUI("Error al leer.", "error");
      }
    } else {
      openNotificationUI("Seleccione Parámetros.", "error");
    }
  };

  const watchLinea = watch("linea");
  useEffect(() => {
    if (watchLinea > 0) {
      getModelos();
    }
  }, [watchLinea]);

  //Organization Code
  const [orgCode, setorgCode] = useState("");
  useEffect(() => {
    if (orgCode) {
      getLineas();
    }
  }, [orgCode]);

  const watchPlantaId = watch("planta");
  useEffect(() => {
    if (watchPlantaId) {
      const nombre = listPlantas.find((x) => x.id === watchPlantaId).organizationCode;
      setorgCode(nombre);
    }
  }, [watchPlantaId]);

  useEffect(() => {
    TitleChanger("Consulta números de serie");
    getPlantas();
  }, []);

  return (
    // <div>
    <div className="m-1 sm:m-8 h-full">
      <div className="p-2 m-1 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
          {/* ----------------PLANTA---------------*/}
          <div className="text-center sm:text-left p-2">
            <FormControl sx={sxStyles.formControl} variant="standard">
              <InputLabel>Planta</InputLabel>
              <Controller
                name="planta"
                control={control}
                render={({ field }) => (
                  <Select {...field} variant="standard">
                    {listPlantas &&
                      listPlantas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>
          {/* ----------------LINEA---------------*/}
          <div className="text-center sm:text-left p-2">
            {/* <div> */}
            <FormControl sx={sxStyles.formControl} variant="standard">
              <InputLabel>Linea</InputLabel>
              <Controller
                name="linea"
                control={control}
                render={({ field }) => (
                  <Select {...field} variant="standard">
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
          {/* ----------------MODELO---------------*/}
          <div className="text-center sm:text-left p-1">
            <FormControl sx={sxStyles.formControl} variant="standard">
              <Autocomplete
                options={modelos?.map((mod) => mod?.nombre)}
                onChange={(e, newvalue: any) => setValue("modelo", newvalue)}
                renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Modelo" />}
              />
            </FormControl>
          </div>
          <div className="text-center  p-2">
            <Button
              onClick={() => {
                getAllNumSerie();
              }}
              className={buttonClasses.blueButton}
              disabled={busquedaDisabled}
              variant="contained">
              Buscar
            </Button>
          </div>
          <div className="text-center sm:text-left p-1">
            <div>Total</div>
            <div>{serie && serie.length}</div>
          </div>
        </div>
      </div>
      <Divider />
      {/* {serie && <NumeroSerie serie={serie} />} */}
      {/* {serie && ( */}
      <TableComponent
        buscar
        columns={[
          {
            title: "Organización",
            field: "organizatioN_CODE"
          },
          {
            title: "Modelo",
            field: "item"
          },
          {
            title: "Serie",
            field: "seriaL_NUMBER"
          }
          // {
          //   title: "Cantidad",
          //   field: "",
          //   render: (row) => {
          //     return (parseInt(row?.hasta) - parseInt(row?.desde) + 1).toString();
          //   }
          // }
        ]}
        excel
        IDcolumn="seriaL_NUMBER"
        dataInfo={serie}
      />
      {/* )} */}
      {/* </div> */}
    </div>
  );
};

// dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
// let fetchSeriesResult;
// const tipoUnidad = lineas.find((x) => x?.idLinea === getValues("linea")).tipoUnidad;
// try {
//   fetchSeriesResult = unwrapResult(
//     await dispatch(
//       XXE_WIP_CONTROL_SERIALESSliceRequests.getAllByCodigoModeloRequest({
//         codigoModelo: getValues("modelo"),
//         tipoUnidad: tipoUnidad
//       })
//     )
//   );
//   console.log(fetchSeriesResult);
//   // Creo el arreglo para la tabla
//   if (fetchSeriesResult) {
//     setSerie([{ ...fetchSeriesResult }]);
//   } else {
//     openNotificationUI("No hay datos para mostrar", "info");
//     setSerie([]);
//   }
//   dispatch(LoadingUISlice.actions.LoadingUIClose());
// } catch (error) {
//   dispatch(LoadingUISlice.actions.LoadingUIClose());
//   console.log(error);
//   fetchSeriesResult = null;
// }
