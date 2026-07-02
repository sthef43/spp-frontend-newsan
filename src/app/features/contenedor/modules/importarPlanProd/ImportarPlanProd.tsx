import React, { useEffect, useState } from "react";
import FileInput from "./FileInput";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import * as XLSX from "xlsx";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
// import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { ContConfigImpoExcelSliceRequests } from "app/Middleware/reducers/ContConfigImpoExcelSlice";
import { ContPlantaSliceRequests } from "app/Middleware/reducers/ContPlantaSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CloudDownload } from "@mui/icons-material";
import { ContPlanProduccionSliceRequests } from "app/Middleware/reducers/ContPlanProduccionSlice";
import { ContEmbarqueSliceRequests } from "app/Middleware/reducers/ContEmbarqueSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

export const ImportarPlanProd = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  // const { getConfirmation } = useConfirmationDialog();
  interface initialState {
    name: string;
    sheet: string;
  }
  const initialStateVar = {
    name: "",
    sheet: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Leer Plantas
  const [listPlantas, setListPlantas] = useState([]);
  const getListPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(ContPlantaSliceRequests.getAllRequest()));
      setListPlantas(responses);
      // console.log(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };
  // useEffect(() => {
  //   console.log(listPlantas);
  // }, [listPlantas]);

  //GENERAL UseEffect
  useEffect(() => {
    TitleChanger("Importar Plan de Producción");
    getListPlantas();
  }, []);

  //Leer Configuración Excel
  const [listPlantasConfig, setListPlantasConfig] = useState([]);
  const getListPlantasConfig = async () => {
    // console.log(watchPlantaId);
    if (watchPlantaId) {
      try {
        const responses = unwrapResult(
          await dispatch(ContConfigImpoExcelSliceRequests.getListByPlantIdRequest(parseInt(watchPlantaId)))
        );
        setListPlantasConfig(responses);
        // console.log(responses);
      } catch (error) {
        openNotificationUI("Error al leer Configuración de Plantas.", "error");
      }
    }
  };

  //Leer ContPlanProduccion por Planta
  const [listContPlanProduccion, setContPlanProduccion] = useState([]);
  const getContPlanProduccion = async () => {
    if (watchPlantaId) {
      try {
        const params = { contPlantaId: parseInt(watchPlantaId), linea: watchSolapaId };
        const responses = unwrapResult(
          await dispatch(ContPlanProduccionSliceRequests.getListByPlantaLineaIdRequest(params))
        );
        setContPlanProduccion(responses);
      } catch (error) {
        openNotificationUI("Error al leer Cont Plan Produccion.", "error");
      }
    }
  };
  // useEffect(() => {
  //   console.log(listContPlanProduccion);
  // }, [listContPlanProduccion]);

  //Habilitar Archivo
  const watchPlantaId = watch("name");

  useEffect(() => {
    // console.log(watchPlantaId);
    getListPlantasConfig();
    setList(null);
    setFilterList(null);
  }, [watchPlantaId]);

  // useEffect(() => {
  //   console.log(listPlantasConfig);
  // }, [listPlantasConfig]);

  // Leer Archivo Excel
  const [List, setList] = useState([]);
  const handleFileUpload = (file: File) => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryString = evt.target?.result;
      if (binaryString) {
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetNames: string[] = workbook.SheetNames; // Agrega el tipo de datos para sheetNames
        const sheetData = sheetNames.reduce((acc: { name: string; data: any[] }[], name: string) => {
          const sheet = workbook.Sheets[name];
          // Obtener solo las columnas B (row[1]) MODELO)
          const filteredData = XLSX.utils.sheet_to_json(sheet, { header: 1 }).filter((row) => row[1]);
          //Cargo el encabezado en un List Nuevo
          const cabeza = filteredData[0];
          //Elimino el encabezado
          filteredData.shift();
          // Eliminar filas vacías y construir objetos en lugar de arreglos
          const nonEmptyData = filteredData
            .filter((row) => Array.isArray(row) && row.some((cell) => cell !== null && cell !== ""))
            .map((row, index) => {
              return {
                id: index + 15,
                [cabeza[listPlantasConfig[0].modelo]]: row[listPlantasConfig[0].modelo] ?? "-",
                [cabeza[listPlantasConfig[0].lote]]: row[listPlantasConfig[0].lote] ?? "-",
                Cant: row[listPlantasConfig[0].cantidad] ?? "-",
                // [cabeza[listPlantasConfig[0].cantidad]]: row[listPlantasConfig[0].cantidad] ?? "-",
                [cabeza[listPlantasConfig[0].po]]: row[listPlantasConfig[0].po] ?? "-",
                [cabeza[listPlantasConfig[0].embarque1]]: row[listPlantasConfig[0].embarque1] ?? "-",
                [cabeza[listPlantasConfig[0].embarque2]]: row[listPlantasConfig[0].embarque2] ?? "-",
                [cabeza[listPlantasConfig[0].embarque3]]: row[listPlantasConfig[0].embarque3] ?? "-",
                [cabeza[listPlantasConfig[0].embarque4]]: row[listPlantasConfig[0].embarque4] ?? "-",
                [cabeza[listPlantasConfig[0].embarque5]]: row[listPlantasConfig[0].embarque5] ?? "-",
                [cabeza[listPlantasConfig[0].embarque6]]: row[listPlantasConfig[0].embarque6] ?? "-",
                [cabeza[listPlantasConfig[0].embarque7]]: row[listPlantasConfig[0].embarque7] ?? "-",
                [cabeza[listPlantasConfig[0].embarque8]]: row[listPlantasConfig[0].embarque8] ?? "-",
                [cabeza[listPlantasConfig[0].ritmo]]: row[listPlantasConfig[0].ritmo] ?? "-",
                Ritmo10: row[listPlantasConfig[0].ritmo]
                  ? row[listPlantasConfig[0].ritmo] + row[listPlantasConfig[0].ritmo] * 0.1
                  : "-"
              };
            });

          return [...acc, { name, data: nonEmptyData }];
        }, []);
        if (Array.isArray(sheetData)) {
          setList(sheetData);
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    // console.log(List);
  }, [List]);

  //FILTRADO por línea cuando cambia Solapa
  const watchSolapaId = watch("sheet");
  useEffect(() => {
    // console.log(watchSolapaId);
    getFilterList();
    getContPlanProduccion();
  }, [watchSolapaId]);

  const [filterList, setFilterList] = useState(null); //**************
  const getFilterList = async () => {
    if (List && watchSolapaId) {
      const filtrado = List.filter((objeto) => objeto.name === watchSolapaId);
      // setFilterList(filtrado);
      setFilterList(filtrado[0].data);
    }
  };
  // useEffect(() => {
  //   if (filterList) {
  //     console.log(filterList);
  //   }
  // }, [filterList]);

  //Cargar Desde el Plan a Mi Plan Local
  const getSubirPP = async (e) => {
    // console.log(e);
    let result;
    //Esto va en ContPlanProduccion
    const objectSubmit = {
      contPlanta: null,
      contPlantaId: parseInt(watchPlantaId),
      lineaExcel: e.id,
      linea: watchSolapaId,
      modelo: e.Modelo,
      lote: e.Lote,
      cantidad: e.Cant,
      po: e.PO,
      abierto: true
    };
    // console.log(objectSubmit);

    //Guardar ContPlanProduccion
    try {
      result = unwrapResult(await dispatch(ContPlanProduccionSliceRequests.PostRequest(objectSubmit)));
      openNotificationUI("Guardado Plan Produccion...", "success");
      // getContPlanProduccion();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }

    //Esto va en ContEmbarque
    const atributosExcluidos = ["Cant", "Lote", "Modelo", "PO", "Plan/Real", "Ritmo", "id", "Ritmo10"];
    const resultadoCE1 = {};
    for (const atributo in e) {
      if (!atributosExcluidos.includes(atributo)) {
        resultadoCE1[atributo] = e[atributo];
      }
    }
    // console.log(resultadoCE1);
    const resultContEmbarque = [];
    for (const key in resultadoCE1) {
      const obj = {
        contPlanProduccion: null,
        contPlanProduccionId: result.id,
        detalle: key,
        numero: resultadoCE1[key]
      };
      resultContEmbarque.push(obj);
    }
    // console.log(resultContEmbarque);
    //Guardar ContEmbarque
    try {
      unwrapResult(await dispatch(ContEmbarqueSliceRequests.multiPostRequest(resultContEmbarque)));
      openNotificationUI("Guardado Embarques...", "success");
      getContPlanProduccion();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      // result2 = null;
    }
  };

  //Muestra lista de Embarques por renglón
  const ExtraModulesCollapse = ({ row }: any) => {
    // console.log(row);
    return (
      <>
        {/* <div style={{ height: "80%", width: "80vw", position: "relative" }}>
          <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew"> */}
        <div className="p-5 m-2 rounded-lg shadow-elevation-2 bg-secondaryNew">
          {row.contEmbarque.length > 0 ? (
            <div>
              {/* <div className="my-2 mx-4 h-full"> */}
              {/* <div className="flex justify-center font-small py-3"> */}
              <div className="flex justify-center">
                <TableComponent
                  columns={[
                    {
                      title: "Id",
                      field: "id"
                    },
                    {
                      title: "Embarque",
                      field: "detalle"
                    },
                    {
                      title: "Número",
                      field: "numero"
                    }
                  ]}
                  IDcolumn={"id"}
                  dataInfo={row.contEmbarque}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <h1>Sin Embarque</h1>
            </div>
          )}
          {/* </div> */}
        </div>
      </>
    );
  };

  return (
    <div style={{ height: "100%", width: "100vw", position: "relative" }}>
      {/* <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}> */}
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={3}>
            {watchPlantaId && (
              <div className="mt-2" style={{ textAlign: "center" }}>
                <FileInput onFileUpload={handleFileUpload} />
              </div>
            )}
          </Grid>
          <Grid item xs={3}>
            {List && List.length > 0 && (
              <div className="mt-2" style={{ textAlign: "center" }}>
                <Controller
                  name="sheet"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Solapa</InputLabel>
                      <Select {...field} placeholder="Seleccione Solapa" variant="standard">
                        {List.map((x) => (
                          <MenuItem key={x.name} value={x.name}>
                            <div className="w-full">
                              <div>{x.name}</div>
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        {filterList && (
          <div className="my-2 mx-4 h-full">
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={filterList[0].id}
              columns={[
                {
                  title: Object.keys(filterList[0])[0],
                  field: Object.keys(filterList[0])[0]
                },
                {
                  title: Object.keys(filterList[0])[1],
                  field: Object.keys(filterList[0])[1]
                },
                {
                  title: Object.keys(filterList[0])[2],
                  field: Object.keys(filterList[0])[2]
                },
                {
                  title: Object.keys(filterList[0])[3],
                  field: Object.keys(filterList[0])[3]
                },
                {
                  title: Object.keys(filterList[0])[4],
                  field: Object.keys(filterList[0])[4]
                },
                {
                  title: Object.keys(filterList[0])[5],
                  field: Object.keys(filterList[0])[5]
                },
                {
                  title: Object.keys(filterList[0])[6],
                  field: Object.keys(filterList[0])[6]
                },
                {
                  title: Object.keys(filterList[0])[7],
                  field: Object.keys(filterList[0])[7]
                },
                {
                  title: Object.keys(filterList[0])[8],
                  field: Object.keys(filterList[0])[8]
                },
                {
                  title: Object.keys(filterList[0])[9],
                  field: Object.keys(filterList[0])[9]
                },
                {
                  title: Object.keys(filterList[0])[10],
                  field: Object.keys(filterList[0])[10]
                },
                {
                  title: Object.keys(filterList[0])[11],
                  field: Object.keys(filterList[0])[11]
                },
                {
                  title: Object.keys(filterList[0])[12],
                  field: Object.keys(filterList[0])[12]
                },
                {
                  title: Object.keys(filterList[0])[13],
                  field: Object.keys(filterList[0])[13]
                },
                {
                  title: Object.keys(filterList[0])[14],
                  field: Object.keys(filterList[0])[14]
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <div className="flex w-full justify-end sm:justify-start gap-4">
                        <div>
                          <Tooltip title="Descargar">
                            <IconButton
                              // disabled={Object.keys(filterList[0].data[0])[2] == "-"}
                              onClick={() => {
                                getSubirPP(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <CloudDownload color="success" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  }
                }
              ]}
              dataInfo={filterList}
            />
          </div>
        )}
      </div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        {filterList && (
          <div className="my-2 mx-4 h-full">
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Id Excel",
                  field: "lineaExcel"
                },
                {
                  title: "Línea",
                  field: "linea"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Lote",
                  field: "lote"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "PO",
                  field: "po"
                }
              ]}
              dataInfo={listContPlanProduccion}
              Collapse
              CollapseExtraModulesBefore={ExtraModulesCollapse}
            />
          </div>
        )}
      </div>
    </div>
  );
};
