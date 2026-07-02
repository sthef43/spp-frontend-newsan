import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Upload } from "@mui/icons-material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { ReporteSGIExcel, ReporteSGIModel } from "../models/ReporteSGIModel";
import { ReporteSGISliceRequests } from "app/Middleware/reducers/ReporteSGISlice";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Controller, useForm } from "react-hook-form";
import ReporteSGITable from "../components/ReporteSGITable";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import _ from "lodash";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

type filterFormShema = {
  año: string;
  mes: string;
  dia: string;
  modelo: string;
  linea: string;
  planta: string;
};
const meses = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE"
];

const obtenerDias = (year, month) => {
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) =>
    new Date(year, month - 1, i + 1).getDate().toString()
  );
};

const obtenerAños = () => {
  const anioActual = new Date().getFullYear();
  const anios = [];

  for (let i = anioActual - 5; i <= anioActual + 5; i++) {
    anios.push(i);
  }

  return anios;
};

const ReporteSGI = (): JSX.Element => {
  const hiddenFileInput: any = useRef(null);
  const { getConfirmation } = useConfirmationDialog();
  const { TitleChanger } = useTitleOfApp();

  const [data, setData] = useState<ReporteSGIExcel[]>(null);

  const [reporte, setReporte] = useState<ReporteSGIModel[]>([]);
  const [reporteImport, setReporteImport] = useState<ReporteSGIModel[]>([]);
  const [reporteImportFilter, setReporteImportFilter] = useState<ReporteSGIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [repetidos, setRepetidos] = useState(false);
  const [todosRepetidos, setTodosRepetidos] = useState(false);

  const [modelos, setModelos] = useState<string[]>([]);
  const [lineas, setLineas] = useState<string[]>([]);
  const [plantas, setPlantas] = useState<string[]>([]);

  const {
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm<filterFormShema>({});

  const años = obtenerAños();
  const dias = obtenerDias(new Date().getFullYear(), new Date().getMonth());
  const año = watch("año");
  const dia = watch("dia");
  const mes = watch("mes");
  const modelo = watch("modelo");
  const linea = watch("linea");
  const planta = watch("planta");

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const getAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(ReporteSGISliceRequests.SearchByFilter({ dia, mes, año, modelo, planta, linea }))
      );
      if (!modelos || modelos.length == 0) {
        const group = Object.keys(_.groupBy(response, "modelo"));
        setModelos(group);
      }
      if (!lineas || lineas.length == 0) {
        const group = Object.keys(_.groupBy(response, "linea"));
        setLineas(group);
      }
      if (!plantas || plantas.length == 0) {
        const group = Object.keys(_.groupBy(response, "planta"));
        setPlantas(group);
      }
      setReporte(response);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const resetFilter = () => {
    reset();
  };

  const onFileChange = (event) => {
    try {
      const file = event.target.files[0];
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      setLoading(true);
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
          cellDates: true,
          dateNF: "dd.mm.yyyy"
        });
        /* Get first worksheet */
        const wsnames = wb.SheetNames.map((sheet) => sheet.toLowerCase());
        if (!wsnames.includes("calidad")) {
          hiddenFileInput.current.value = "";
          openNotificationUI("No se Encontro la Hoja calidad", "error");
          setLoading(false);
        }

        const index = wsnames.indexOf("calidad");

        const ws = wb.Sheets["Calidad"];
        /* Convert array of arrays */
        const dataExcel: any[] = XLSX.utils.sheet_to_json(ws);
        /* Update state */
        setData(dataExcel);
      };
      if (rABS) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error(error);
      hiddenFileInput.current.value = "";
      openNotificationUI("Ocurrio un error al intentar leer el archivo", "error");
      setLoading(false);
    }
    // const file = e.newState[0]?.getRawFile();
    /* Boilerplate to set up FileReader */
  };

  const saveReporte = async () => {
    try {
      let withFiltros: any = false;
      if (dia || mes || año) {
        withFiltros = await getConfirmation(
          "Aceptar Importacion",
          "¿Desea cargar solo los datos filtrados o todo el archivo?",
          null,
          "Filtrados",
          "Todos"
        );
      }

      const resp = await getConfirmation(
        "Aceptar Importacion",
        "¿Se cargaran los registros no repetidos del excel desea continuar?"
      );

      if (!resp) {
        return;
      }

      let dataToUpload = null;
      if (withFiltros) {
        console.log(reporteImportFilter.filter((d) => !d.repetido));
        dataToUpload = reporteImportFilter.filter((d) => !d.repetido);
      } else {
        dataToUpload = reporteImport.filter((d) => !d.repetido);
      }

      console.log(dataToUpload);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ReporteSGISliceRequests.multiPostRequest(dataToUpload)));
      if (response) {
        openNotificationUI("Se cargaron los registros correctamente", "success");
      }
      hiddenFileInput.current.value = "";
      resetFilter();
      getAll();
      setIsImport(false);
      setReporteImport([]);
    } catch (error) {
      openNotificationUI("Ocurrio un error al intentar guardar los registros", "error");
    } finally {
      hiddenFileInput.current.value = "";
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const updateReportes = async () => {
    try {
      if (!reporteImport) return;
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const repetidos = reporteImport.filter((d) => d.repetido);
      const response = unwrapResult(await dispatch(ReporteSGISliceRequests.multiPutRequest(repetidos)));
      if (response) {
        openNotificationUI("Se cargaron los registros correctamente", "success");
      }
      console.log(repetidos);
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error al intentar guardar los registros", "error");
    } finally {
      resetFilter();
      getAll();
      setIsImport(false);
      setReporteImport([]);
      hiddenFileInput.current.value = "";
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const cancelarReporte = () => {
    setIsImport(false);
    setReporteImport([]);
  };

  const checkRepetead = async (data: ReporteSGIModel[]) => {
    const response = unwrapResult(await dispatch(ReporteSGISliceRequests.SearchRepetead(data)));
    setRepetidos(response.some((d) => d.repetido));
    setTodosRepetidos(response.filter((d) => d.repetido).length == response.length);
    console.log(response);
    setReporteImport(response);
    setReporteImportFilter(response);
    setIsImport(true);
    setLoading(false);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      console.log(data);
      data.forEach((item) => {
        item["PRODUCIDO"] = item[" PRODUCIDO "];
        delete item[" PRODUCIDO "];
      });

      const newData = data.map(
        (d) =>
          new ReporteSGIModel({
            año: d["AÑO"],
            cantPrimerProblemaFPY: d["Cant 1er Problema FPY"],
            categoria: d["Categoría"],
            dia: d["DIA"],
            hallazgosOQC: d["Hallazgos OQC"],
            linea: d["LINEA"],
            mes: d["MES"],
            modelo: d["MODELO"],
            muestreo: d["Muestreo"],
            planta: d["PLANTA"],
            problemaFPY: d["Problema FPY"],
            producido: d["PRODUCIDO"],
            rechazosFPY: d["RECHAZOS FPY"],
            rechazosFPYReporte: d["Rechazos FPY reporte"],
            rechazosOQC: d["RECHAZOS OQC"],
            turno: d["TURNO"],
            accionOQC: d["Acción OQC"],
            accionProblemaFPY: d["Acción Problema FPY"],
            causaOQC: d["Causa"],
            problemaOQC: d["Problema OQC"]
          })
      );
      checkRepetead(newData);
    }
  }, [data]);

  const filterImport = () => {
    console.log(año);
    if (!dia && !mes && !año) {
      setReporteImportFilter(reporteImport);
    }
    let filtro = reporteImport;
    if (año) {
      filtro = filtro.filter((d) => d.año == año);
    }
    if (mes) {
      filtro = filtro.filter((d) => d.mes == mes);
    }
    if (dia) {
      filtro = filtro.filter((d) => d.dia == dia);
    }
    setReporteImportFilter(filtro);
  };

  useEffect(() => {
    if (isImport) {
      filterImport();
      return;
    }
    getAll();
  }, [mes, año, dia, modelo, planta, linea]);

  useEffect(() => {
    if (loading) {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    } else {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [loading]);

  useEffect(() => {
    TitleChanger("Reporte De SGI");
  }, []);

  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };
  return (
    <div className="container m-auto mt-3">
      <div className="flex flex-col gap-5 bg-secondaryNew px-20 py-5 my-2">
        <form className="gap-6 h-full grid grid-cols-3 minnotebook:flex-row">
          <Controller
            name="año"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un año</InputLabel>
                <Select
                  {...field}
                  variant="standard"
                  defaultValue={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {años.map((año) => (
                    <MenuItem key={año} value={año}>
                      <div className="w-full">
                        <div>{año}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="mes"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un Mes</InputLabel>
                <Select
                  {...field}
                  variant="standard"
                  defaultValue={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {meses.map((mes) => (
                    <MenuItem key={mes} value={mes}>
                      <div className="w-full">
                        <div>{mes}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="dia"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un dia</InputLabel>
                <Select
                  {...field}
                  variant="standard"
                  defaultValue={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {dias.map((dia) => (
                    <MenuItem key={dia} value={dia}>
                      <div className="w-full">
                        <div>{dia}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="modelo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un Modelo</InputLabel>
                <Select
                  {...field}
                  disabled={isImport}
                  variant="standard"
                  defaultValue={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {modelos.map((modelo) => (
                    <MenuItem key={modelo} value={modelo}>
                      <div className="w-full">
                        <div>{modelo}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="linea"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione una Linea</InputLabel>
                <Select
                  {...field}
                  variant="standard"
                  defaultValue={field.value}
                  disabled={isImport}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {lineas.map((linea) => (
                    <MenuItem key={modelo} value={linea}>
                      <div className="w-full">
                        <div>{linea}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="planta"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione una Planta</InputLabel>
                <Select
                  {...field}
                  variant="standard"
                  disabled={isImport}
                  defaultValue={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // lineaOnchange()
                  }}>
                  <MenuItem value={undefined}>
                    <div className="w-full">
                      <div>Sin Eleccion</div>
                    </div>
                  </MenuItem>
                  {plantas.map((planta) => (
                    <MenuItem key={planta} value={planta}>
                      <div className="w-full">
                        <div>{planta}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </form>
        <div className="flex justify-center flex-wrap">
          {!isImport && (
            <Button
              onClick={handleClick}
              variant="contained"
              className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
              <Upload />
              <span className="hidden sm:block">Importar excel</span>
            </Button>
          )}

          {isImport && (
            <>
              {!todosRepetidos && (
                <Button
                  onClick={saveReporte}
                  variant="contained"
                  className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
                  <span className="hidden sm:block">Guardar Importacion</span>
                </Button>
              )}
              <Button
                onClick={cancelarReporte}
                variant="contained"
                className="bg-red-500 shadow-md hover:bg-red-700 text-white text-icon-rest rounded-full px-4 py-1">
                <span className="hidden sm:block">Cancelar Importacion</span>
              </Button>
              {repetidos && (
                <Button
                  onClick={updateReportes}
                  variant="contained"
                  className="bg-violet-500 shadow-md hover:bg-violet-700 text-white text-icon-rest rounded-full px-4 py-1">
                  <span className="hidden sm:block">Actualizar Registros</span>
                </Button>
              )}
            </>
          )}
          <input
            type="file"
            accept=".xlsx"
            name="Importar"
            onChange={onFileChange}
            ref={hiddenFileInput}
            multiple={false}
            className="hidden"
          />
        </div>
      </div>
      {isImport ? (
        <TableComponent
          IDcolumn="guidId"
          columns={[
            {
              title: "Dia",
              field: "dia"
            },
            {
              title: "Mes",
              field: "mes"
            },
            {
              title: "Año",
              field: "año"
            },
            {
              title: "Linea",
              field: "linea"
            },
            {
              title: "Planta",
              field: "planta"
            },
            {
              title: "Modelo",
              field: "modelo"
            },
            {
              title: "Producido",
              field: "producido"
            },
            {
              title: "Problema FPY",
              field: "problemaFPY"
            },
            {
              title: "",
              field: "repetido",
              render: (row) => row.repetido && <div>Esta Repetido</div>
            }
          ]}
          buscar
          dataInfo={reporteImportFilter}
        />
      ) : (
        <ReporteSGITable reporte={reporte} />
      )}
    </div>
  );
};

export default ReporteSGI;
