import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { ISPReparacion } from "app/models/ISPReparacion";
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
import { ImpresionReparaciones } from "app/features/informes/Modules/reporteReparaciones/components/ImpresionReparaciones";
import { ExpandMore } from "@mui/icons-material";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export const Reparaciones = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  //const infoUser: IAppUser = useAppSelector<ISPReparacion[]>((state) => state.appUser.data as any);
  const { TitleChanger } = useTitleOfApp();
  const [reparaciones, setReparaciones] = useState<ISPReparacion[]>([]);
  const [lineas, setLineas] = useState<ILinea[]>(null);
  const [lineaSeleccionada, setLineaSeleccionada] = useState("");
  // const [presionoBuscar, setPresionoBuscar] = useState(false);

  const buttonClasses = MaterialButtons();

  React.useEffect(() => {
    TitleChanger("REPARACIONES");
    getLineas();
  }, []);

  interface initialState {
    codigoError2: number; // representa la linea.
    fechaInicio: Date;
    fechaFin: Date;
    turnoRadioButton: string;
  }

  const initialStateVar = {
    codigoError2: 0,
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    turnoRadioButton: "M"
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");
  const watchTurno = watch("turnoRadioButton");

  //El CodigoError2, es la linea, pero le paso ese atributo.
  const getReparaciones = async (fechaDesde, fechaHasta, codigoError2) => {
    const param = {
      fechaDesde,
      fechaHasta,
      codigoError2,
      watchTurno
    };
    let respuesta = [];
    try {
      respuesta = unwrapResult(await dispatch(ReparacionSpSliceRequests.getReparacionesSP(param)));
      respuesta = respuesta.map((d, i) => {
        d["id"] = i;
        return d;
      });
    } catch (error) {
      console.log(error);
    }
    if (respuesta) setReparaciones(respuesta);
  };

  // useEffect(() => {
  //   console.log(reparaciones)
  // }, [reparaciones])

  const getLineas = async () => {
    const lineasResp = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    setLineas(lineasResp);
  };

  useEffect(() => {
    getLineas();
  }, []);

  const handleSearch = () => {
    // setPresionoBuscar(true);
    const inicio = moment(getValues("fechaInicio")).format("YYYY-MM-DD");
    const fin = moment(getValues("fechaFin")).format("YYYY-MM-DD");
    if (fin < inicio) {
      openNotificationUI("La fecha Desde no puede ser mayor a la fecha Hasta", "warning");
      return false;
    }

    getReparaciones(inicio, fin, getValues("codigoError2"));
    setLineaSeleccionada(lineas.find((x) => x.codigoInicio == getValues("codigoError2").toString()).descripcion);
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
      // setPresionoBuscar(false);
    };
  }, [fechaFin, fechaInicio]);

  const customToolTip = (value) => {
    const { label } = value;
    if (!label) return null;
    const elemento = reparaciones.find((x) => x.descripcionOrigen == label);
    if (!elemento) return null;
    return (
      <div
        style={{
          backgroundColor: "#5b63ffe7",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "1px 2px 10px -2px #7873ffb1"
        }}>
        <p
          key={"target"}
          style={{
            borderStyle: "solid 1px",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "sans-serif",
            color: "#fff"
          }}>
          Codigo Defecto: {elemento ? elemento.codigoDefecto : 0}
        </p>
        <p
          style={{
            borderStyle: "solid 1px",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "sans-serif",
            color: "#fff",
            textTransform: "capitalize"
          }}>
          Total: {elemento ? elemento.total : 0}
        </p>
      </div>
    );
  };

  return (
    <div className="p-2">
      <div className="hidden bg-white">
        <ImpresionReparaciones
          parentRef={componentRef}
          reparaciones={reparaciones}
          fechaDesde={moment(getValues("fechaInicio")).format("DD-MM-YYYY")}
          fechaHasta={moment(getValues("fechaFin")).format("DD-MM-YYYY")}
          linea={lineaSeleccionada}
        />
      </div>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-5 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
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
          <div className="text-center sm:text-left p-2">
            <FormControl>
              <FormLabel>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                        <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                        <FormControlLabel value="N" control={<Radio />} label="Noche" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                defaultValue="M"
                name="turnoRadioButton"
              />
            </FormControl>
          </div>
          <div>
            <Button variant="outlined" onClick={handleSearch}>
              Buscar
            </Button>
            <Button
              onClick={() => {
                // generarReporte(lotesProducidos);
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography component={"span"} className="text-base ">
              Rechazos
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col w-full p-0">
            {reparaciones && reparaciones.length > 0 && (
              <TableComponent
                Dense={true}
                Overflow={false}
                buscar={true}
                IDcolumn={"id"}
                excel
                columns={[
                  {
                    title: "Codigo Defecto",
                    field: "codigoDefecto"
                  },
                  {
                    title: "Defecto",
                    field: "descripcionDefecto"
                  },
                  {
                    title: "Codigo Causa",
                    field: "codigoCausa"
                  },
                  {
                    title: "Causa",
                    field: "descripcionCausa"
                  },
                  {
                    title: "Codigo Origen",
                    field: "codigoOrigen"
                  },
                  {
                    title: "Origen",
                    field: "descripcionOrigen"
                  },
                  {
                    title: "Total",
                    field: "total"
                  }
                ]}
                dataInfo={reparaciones}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      <div>
        {reparaciones && reparaciones.length > 0 && (
          <div className="animate__animated animate__fadeIn">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                width={730}
                height={250}
                data={reparaciones}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="codigoDefecto" />
                <YAxis />
                <Tooltip content={customToolTip} cursor={false} />
                <Legend height={0} />
                <Bar dataKey="total" fill="#1FA552">
                  <LabelList dataKey="total" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
