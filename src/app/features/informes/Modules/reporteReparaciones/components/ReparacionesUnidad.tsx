import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ILinea } from "app/models";
import { Controller, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ReparacionSpSliceRequests } from "app/Middleware/reducers/reparacionSPSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useReactToPrint } from "react-to-print";
import { ImpresionReparacionesUnidad } from "app/features/informes/Modules/reporteReparaciones/components/ImpresionReparacionesUnidad";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ExpandMore } from "@mui/icons-material";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";

export const ReparacionesUnidad = (): JSX.Element => {
  //const infoUser: IAppUser = useAppSelector<ISPReparacion[]>((state) => state.appUser.data as any);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [reparaciones, setReparaciones] = useState([]);
  const [reparacionesTotales, setReparacionesTotales] = useState([]);

  const [lineas, setLineas] = useState<ILinea[]>(null);
  const [lineaSeleccionada, setLineaSeleccionada] = useState("");
  const buttonClasses = MaterialButtons();

  interface initialState {
    codigoError2: number; // representa la linea.
    fechaInicio: Date;
    fechaFin: Date;
    turnoRadioButton: string;
    tipo: string;
  }

  const initialStateVar = {
    codigoError2: 0,
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    turnoRadioButton: "Todos",
    tipo: "Todos"
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");
  const watchCodigoError2 = watch("codigoError2");

  const [cantidadPorReparador, setCantidadPorReparador] = useState([]);
  //El CodigoError2, es la linea, pero le paso ese atributo.
  const getReparaciones = async (fechaDesde, fechaHasta, codigoError2, turno, tipo) => {
    const param = { fechaDesde, fechaHasta, codigoError2, turno, tipo };
    let respuesta = [];
    let respuestaReparadores = [];
    let respuestaReparacionesGlobal = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      respuesta = unwrapResult(
        await dispatch(ReparacionSpSliceRequests.getReparacionesByFechaAndLineaAndOthers(param))
      );
      respuestaReparadores = unwrapResult(await dispatch(ReparacionSpSliceRequests.GetAllCountByReparador(param)));
      respuestaReparacionesGlobal = unwrapResult(
        await dispatch(
          ReparacionSpSliceRequests.GetAllReparacionesWithDates({
            fechaDesde: param.fechaDesde,
            fechaHasta: param.fechaHasta
          })
        )
      );
      if (respuestaReparadores) {
        setCantidadPorReparador(respuestaReparadores);
      }
      if (respuestaReparacionesGlobal) {
        const responseReparacionesModificada = await familiasReparacionesGlobal(respuestaReparacionesGlobal);
        if (responseReparacionesModificada) {
          setReparacionesTotales(responseReparacionesModificada);
        }
      }
      if (respuesta) {
        if (respuesta[0].codigoTrazabilidad.length > 11) {
          const familias = respuesta.map((elementos) => elementos.codigoTrazabilidad.substring(6, 12));
          respuesta.forEach((elementos, index) => {
            elementos.familia = familias[index];
            elementos.lineaProduccion = lineaSeleccionada;
          });
        }
        if (respuesta[0].codigoTrazabilidad.length < 11) {
          const codigosPlacas = respuesta.map((elementos) => elementos.codigoTrazabilidad);
          const responseTraza = unwrapResult(
            await dispatch(ReparacionSpSliceRequests.SearchTracesOfPlates(codigosPlacas))
          );
          respuesta.forEach((elementos, index) => {
            elementos.familia = responseTraza[index];
            elementos.lineaProduccion = lineaSeleccionada;
          });
        }
      }
      setReparaciones(respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  const familiasReparacionesGlobal = async (response: any[]) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const familiasTrazas: string[] = [];
      const familisQr: string[] = [];
      const clonResponse = [...response];

      const codigosTraza = response.map((elementos) => elementos.codigo);

      codigosTraza.forEach((elementos) => {
        if (elementos.length > 11) {
          const familia = elementos.substring(6, 12);
          familiasTrazas.push(familia);
        }
        if (elementos.length < 11) {
          familisQr.push(elementos);
        }
      });

      const responseTrazas = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.GetAllDatesOfTraces(familisQr)));
      if (responseTrazas) {
        clonResponse.map((elementos) => {
          const buscarTrazaPlaca = responseTrazas.find((placas) => placas.codigoInit == elementos.codigo);
          if (buscarTrazaPlaca) {
            elementos.familia = buscarTrazaPlaca.familia;
            return elementos;
          } else {
            return elementos;
          }
        });
      }
      return clonResponse;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [dataExcel, setDataExcel] = useState([]);
  const setExcel = () => {
    console.log(reparaciones);
    const newData = reparaciones.map((listadoReparaciones) => {
      const regex = /\s(?=\d{2}-)/;

      const fecha = moment(listadoReparaciones.fecha).format("L");
      const hora = listadoReparaciones.hora;
      const fechaRechazo = moment(listadoReparaciones.fechaRechazo).format("L");
      const horaRechazo = listadoReparaciones.horaRechazo.substring(0, 8);
      const codigo = listadoReparaciones.codigoTrazabilidad;
      const familia = listadoReparaciones.familia;
      const defecto = listadoReparaciones.defecto.descripcion != "" ? listadoReparaciones.defecto.descripcion : "-";
      const subComponente =
        listadoReparaciones.descripcionRechazo != null ? listadoReparaciones.descripcionRechazo.split(regex)[1] : "-";
      const causa = listadoReparaciones.causas.descripcion != "" ? listadoReparaciones.causas.descripcion : "-";
      const origen = listadoReparaciones.origenes.descripcion != "" ? listadoReparaciones.origenes.descripcion : "-";
      const descripcionRechazo =
        listadoReparaciones.descripcionRechazo != "" ? listadoReparaciones.descripcionRechazo : "-";
      const puestoRechazo = listadoReparaciones.puestoRechazo;
      const nombreReparador = listadoReparaciones.nombreReparador;
      const lineaProduccion = listadoReparaciones.lineaProduccion;
      return {
        ...listadoReparaciones,
        fecha,
        hora,
        fechaRechazo,
        horaRechazo,
        codigo,
        defecto,
        subComponente,
        causa,
        origen,
        descripcionRechazo,
        puestoRechazo,
        familia,
        nombreReparador,
        lineaProduccion
      };
    });
    setDataExcel(newData);
  };

  const [dataExcelPorPlanta, setDataExcelPorPlanta] = useState([]);
  const setExcelPorPlanta = async () => {
    const newData = reparacionesTotales.map((listadoReparaciones, index) => {
      const regex = /\s(?=\d{2}-)/;
      const familiaTrazabilidad =
        listadoReparaciones.codigo.length > 11 ? listadoReparaciones.codigo.substring(6, 12) : "";

      const fecha = moment(listadoReparaciones.fecha).format("L");
      const hora = listadoReparaciones.hora;
      const fechaRechazo = moment(listadoReparaciones.fechaRechazo).format("L");
      const horaRechazo = listadoReparaciones.horaRechazo.substring(0, 8);
      const codigo = listadoReparaciones.codigo;
      const familia = familiaTrazabilidad && familiaTrazabilidad ? familiaTrazabilidad : listadoReparaciones.familia;
      const turno = listadoReparaciones.turno;
      const defecto = listadoReparaciones.defecto;
      const subComponente =
        listadoReparaciones.descripcionRechazo != null ? listadoReparaciones.descripcionRechazo.split(regex)[1] : "-";
      const causa = listadoReparaciones.causa;
      const origen = listadoReparaciones.descripcion;
      const descripcionRechazo =
        listadoReparaciones.descripcionRechazo != "" ? listadoReparaciones.descripcionRechazo : "-";
      const puestoRechazo = listadoReparaciones.puestoRechazo;
      const nombreReparador = listadoReparaciones.nombreReparador;
      const lineaProduccion = listadoReparaciones.lineaProduccion;
      return {
        ...listadoReparaciones,
        fecha,
        hora,
        fechaRechazo,
        horaRechazo,
        codigo,
        turno,
        defecto,
        subComponente,
        causa,
        origen,
        descripcionRechazo,
        puestoRechazo,
        nombreReparador,
        lineaProduccion,
        familia
      };
    });
    setDataExcelPorPlanta(newData);
  };

  const getLineas = async () => {
    const lineasResp = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    setLineas(lineasResp);
  };

  const handleSearch = () => {
    // setPresionoBuscar(true);
    const inicio = moment(getValues("fechaInicio")).format("YYYY-MM-DD");
    const fin = moment(getValues("fechaFin")).format("YYYY-MM-DD");
    if (fin < inicio) {
      openNotificationUI("La fecha Desde no puede ser mayor a la fecha Hasta", "warning");
      return false;
    }
    getReparaciones(inicio, fin, getValues("codigoError2"), getValues("turnoRadioButton"), getValues("tipo"));
  };

  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de Reparaciones - ${lineaSeleccionada} - ${moment(getValues("fechaInicio")).format(
      "DD-MM-YYYY"
    )} - ${moment(getValues("fechaFin")).format("DD-MM-YYYY")}`,
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: #002b36 !important; -webkit-print-color-adjust: exact; }"
  });

  const imprimirInforme = async () => {
    handleImprimir();
  };

  useEffect(() => {
    setReparaciones([]);
    return () => {
      setReparaciones([]);
    };
  }, [fechaFin, fechaInicio]);

  useEffect(() => {
    reparaciones.length > 0 && setExcel();
    reparaciones.length > 0 && setExcelPorPlanta();
  }, [reparaciones]);

  useEffect(() => {
    if (watchCodigoError2) {
      setLineaSeleccionada(lineas.find((x) => x.codigoInicio == watchCodigoError2.toString()).descripcion);
    }
  }, [watchCodigoError2]);

  React.useEffect(() => {
    TitleChanger("REPARACIONES UNIDAD");
    getLineas();
  }, []);

  return (
    <div className="p-2">
      <div className="hidden bg-white">
        <ImpresionReparacionesUnidad
          parentRef={componentRef}
          reparaciones={reparaciones}
          fechaDesde={moment(getValues("fechaInicio")).format("DD-MM-YYYY")}
          fechaHasta={moment(getValues("fechaFin")).format("DD-MM-YYYY")}
          linea={lineaSeleccionada}
        />
      </div>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-6 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            <Controller
              name="codigoError2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea</InputLabel>
                  <Select {...field} placeholder="Seleccione una Linea" variant="standard">
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.codigoInicio} value={x.codigoInicio}>
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
          </div>
          {/* ----------------FECHA---------------*/}
          <div>
            <DesktopDatePicker
              label="Desde"
              value={fechaInicio}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fechaInicio", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          <div>
            <DesktopDatePicker
              label="Hasta"
              value={fechaFin}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fechaFin", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          <div className="text-center sm:text-center p-2">
            <FormControl>
              <FormLabel style={{ textAlign: "center" }}>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                        <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                      </div>
                      <div className="sm:col-span-1 text-center">
                        <FormControlLabel value="N" control={<Radio />} label="Noche" />
                        <FormControlLabel value="Todos" control={<Radio />} label="Todos" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                defaultValue="Todos"
                name="turnoRadioButton"
              />
            </FormControl>
          </div>
          <div className="text-center sm:text-center p-2">
            <FormControl>
              <FormLabel>Tipo</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className="sm:grid sm:grid-cols-1">
                      <div className="sm:col-span-1  sm:text-center  ">
                        <FormControlLabel value="P" control={<Radio />} label="P" />
                        <FormControlLabel value="M" control={<Radio />} label="M" />
                      </div>
                      <div className="sm:col-span-1 text-center">
                        <FormControlLabel value="Todos" control={<Radio />} label="Todos" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                defaultValue="Todos"
                name="tipo"
              />
            </FormControl>
          </div>
          <div className="text-center sm:text-center p-2" style={{ display: "flex", flexDirection: "row" }}>
            <Button variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
            <Button
              onClick={() => {
                imprimirInforme();
              }}
              sx={{ marginLeft: 3 }}
              className={buttonClasses.greenButton}
              variant="contained"
              disabled={reparaciones.length == 0}>
              Imprimir
            </Button>
          </div>
        </div>
      </form>

      <div>
        <div className="flex flex-row gap-x-4 my-3">
          {dataExcel.length > 0 && (
            <ExportExcel
              stylesButton="m-0"
              title="Informe Reparaciones"
              data={dataExcel.length > 0 ? dataExcel : []}
              columns={[
                {
                  title: "Fecha",
                  field: "fecha"
                },
                {
                  title: "Hora",
                  field: "hora"
                },
                {
                  title: "Fecha Rechazo",
                  field: "fechaRechazo"
                },
                {
                  title: "Hora Rechazo",
                  field: "horaRechazo"
                },
                {
                  title: "Codigo",
                  field: "codigo"
                },
                {
                  title: "Familia",
                  field: "familia"
                },
                {
                  title: "Defecto",
                  field: "defecto"
                },
                {
                  title: "Sub Componente",
                  field: "subComponente"
                },
                {
                  title: "Causa",
                  field: "causa"
                },
                {
                  title: "Origen",
                  field: "origen"
                },
                {
                  title: "Descripcion",
                  field: "descripcion"
                },
                {
                  title: "Descripcion Rechazo",
                  field: "descripcionRechazo"
                },
                {
                  title: "Puesto Rechazo",
                  field: "puestoRechazo"
                },
                {
                  title: "Nombre Reparador",
                  field: "nombreReparador"
                },
                {
                  title: "Linea",
                  field: "lineaProduccion"
                }
              ]}
            />
          )}
          {dataExcelPorPlanta.length > 0 && (
            <ExportExcel
              title="Informe Reparaciones Por Planta"
              stylesButton="m-0"
              titleButton="Exportar Reparaciones Por Planta"
              data={dataExcelPorPlanta.length > 0 ? dataExcelPorPlanta : []}
              columns={[
                {
                  title: "Fecha",
                  field: "fecha"
                },
                {
                  title: "Hora",
                  field: "hora"
                },
                {
                  title: "Fecha Rechazo",
                  field: "fechaRechazo"
                },
                {
                  title: "Hora Rechazo",
                  field: "horaRechazo"
                },
                {
                  title: "Codigo",
                  field: "codigo"
                },
                {
                  title: "Familia",
                  field: "familia"
                },
                {
                  title: "Turno",
                  field: "turno"
                },
                {
                  title: "Defecto",
                  field: "defecto"
                },
                {
                  title: "Sub Componente",
                  field: "subComponente"
                },
                {
                  title: "Causa",
                  field: "causa"
                },
                {
                  title: "Origen",
                  field: "origen"
                },
                {
                  title: "Descripcion",
                  field: "descripcion"
                },
                {
                  title: "Descripcion Rechazo",
                  field: "descripcionRechazo"
                },
                {
                  title: "Puesto Rechazo",
                  field: "puestoRechazo"
                },
                {
                  title: "Nombre Reparador",
                  field: "nombreReparador"
                },
                {
                  title: "Linea Produccion",
                  field: "lineaProduccion"
                }
              ]}
            />
          )}
        </div>
        <div className="mt-4">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-reparaciones" id="panel-reparaciones">
              <Typography component="span">Lista De Reparaciones</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* {dataExcel.length > 0 && (
                <ExportExcel
                  title="Informe Reparaciones"
                  data={dataExcel.length > 0 ? dataExcel : []}
                  columns={[
                    {
                      title: "Fecha",
                      field: "fecha"
                    },
                    {
                      title: "Hora",
                      field: "hora"
                    },
                    {
                      title: "Fecha Rechazo",
                      field: "fechaRechazo"
                    },
                    {
                      title: "Hora Rechazo",
                      field: "horaRechazo"
                    },
                    {
                      title: "Codigo",
                      field: "codigo"
                    },
                    {
                      title: "Familia",
                      field: "familia"
                    },
                    {
                      title: "Defecto",
                      field: "defecto"
                    },
                    {
                      title: "Causa",
                      field: "causa"
                    },
                    {
                      title: "Origen",
                      field: "origen"
                    },
                    {
                      title: "Descripcion",
                      field: "descripcion"
                    },
                    {
                      title: "Descripcion Rechazo",
                      field: "descripcionRechazo"
                    },
                    {
                      title: "Puesto Rechazo",
                      field: "puestoRechazo"
                    },
                    {
                      title: "Nombre Reparador",
                      field: "nombreReparador"
                    }
                  ]}
                />
              )} */}
              <TableComponent
                Dense={true}
                Overflow={false}
                buscar={true}
                IDcolumn={"idReparacion"}
                columns={[
                  {
                    title: "Fecha Y Hora",
                    field: "",
                    render: (rowData) => {
                      return `${moment(rowData.fecha).format("L")} ${rowData.hora}`;
                    }
                  },
                  {
                    title: "Fecha Y Hora Rechazo",
                    field: "",
                    render: (rowData) => {
                      return `${moment(rowData.fechaRechazo).format("L")} ${rowData.horaRechazo.substring(0, 8)}`;
                    }
                  },
                  {
                    title: "Codigo",
                    field: "codigoTrazabilidad"
                  },
                  {
                    title: "Familia",
                    field: "familia"
                  },
                  {
                    title: "Defecto",
                    field: "defecto.descripcion"
                  },
                  {
                    title: "Causa",
                    field: "causas.descripcion"
                  },
                  {
                    title: "Origen",
                    field: "origenes.descripcion"
                  },
                  {
                    title: "Descripcion",
                    field: "descripcion"
                  },
                  //Esto arreglar
                  {
                    title: "Descripcion del Rechazo",
                    field: "descripcionRechazo"
                  },
                  {
                    title: "Puesto Rechazo",
                    field: "puestoRechazo"
                  },
                  //************ */
                  {
                    title: "Nombre Reparador",
                    field: "nombreReparador"
                  }
                ]}
                dataInfo={reparaciones}
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="mt-4">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-reparaciones" id="panel-reparaciones">
              <Typography component="span">Lista De Reparaciones</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableComponent
                IDcolumn="reparador"
                dataInfo={cantidadPorReparador}
                columns={[
                  {
                    title: "Nombre Reparador",
                    field: "reparador"
                  },
                  {
                    title: "Cantidad Reparaciones",
                    field: "reparaciones"
                  }
                ]}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
