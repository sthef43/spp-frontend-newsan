import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
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
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useReactToPrint } from "react-to-print";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { ImpresionRechazos } from "app/features/informes/Modules/reporteRechazosPareto/components/ImpresionRechazos";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ExpandMore } from "@mui/icons-material";
import { RechazosInformesExcel } from "../components/RechazosInformesExcel";
import { unwrapResult } from "@reduxjs/toolkit";
import { IRechazo } from "app/models/IRechazo";

export const RechazosInformes = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const lineas = useAppSelector((state) => state.linea.dataAll);
  //const rechazados = useAppSelector((state) => state.rechazo.dataAll);
  const [rechazados, setRechazos] = useState<IRechazo[] | null>(null);
  const [lineaSeleccionada, setLineaSeleccionada] = useState(null);
  const [cambioFecha, setCambioFecha] = useState(false);
  const buttonClasses = MaterialButtons();

  React.useEffect(() => {
    TitleChanger("RECHAZOS");
    getLineas();
  }, []);

  interface initialState {
    lineaId: number; // representa la linea.
    fechaInicio: Date;
    fechaFin: Date;
    turnoRadioButton: string;
  }

  const initialStateVar = {
    lineaId: 0,
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    turnoRadioButton: "M"
  };

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");
  const watchTurno = watch("turnoRadioButton");

  const getRechazos = async (fechaDesde, fechaHasta, lineaId) => {
    const param = {
      fechaDesde,
      fechaHasta,
      lineaId,
      turno: watchTurno
    };
    try {
      // dispatch(RechazoSliceRequests.getRechazosByDateAndLineaId(param));
      const result = unwrapResult(await dispatch(RechazoSliceRequests.getRechazosByDateAndLineaId(param)));
      setRechazos(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getLineas = async () => {
    dispatch(LineaSliceRequests.getAllRequest());
  };

  const handleSearch = () => {
    setCambioFecha(false);
    const inicio = moment(getValues("fechaInicio")).format("YYYY-MM-DD");
    const fin = moment(getValues("fechaFin")).format("YYYY-MM-DD");
    if (fin < inicio) {
      openNotificationUI("La fecha Desde no puede ser mayor a la fecha Hasta", "warning");
      return false;
    }
    getRechazos(inicio, fin, getValues("lineaId"));
    setLineaSeleccionada(lineas.find((x) => x.idLinea == getValues("lineaId")).descripcion);
  };

  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de Rechazos - ${lineaSeleccionada} - ${moment(getValues("fechaInicio")).format(
      "DD-MM-YYYY"
    )} - ${moment(getValues("fechaFin")).format("DD-MM-YYYY")}`,
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: #002b36 !important; -webkit-print-color-adjust: exact; }"
  });

  const imprimirInforme = async () => {
    handleImprimir();
  };

  useEffect(() => {
    setCambioFecha(true);
  }, [fechaFin, fechaInicio]);

  const customToolTip = (value) => {
    const { label } = value;
    if (!label) return null;
    const elemento = rechazados.find((x) => x.descripcionRechazo == label);
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
          Codigo: {elemento ? elemento.codigoRechazo : 0}
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

  const [editState, setEditState] = useState(null);
  const [exportar, setExportar] = useState(false);
  const excelExport = async () => {
    //Get de la información
    const param = {
      fechaDesde: moment(getValues("fechaInicio")).format("YYYY-MM-DD"),
      fechaHasta: moment(getValues("fechaFin")).format("YYYY-MM-DD"),
      lineaId: getValues("lineaId"),
      turno: watchTurno
    };
    setEditState(param);
    setExportar(true);
  };

  return (
    <div className="p-2">
      <div className="hidden bg-white">
        {rechazados && (
          <ImpresionRechazos
            parentRef={componentRef}
            rechazos={rechazados}
            fechaDesde={moment(getValues("fechaInicio")).format("DD-MM-YYYY")}
            fechaHasta={moment(getValues("fechaFin")).format("DD-MM-YYYY")}
            linea={lineaSeleccionada}
          />
        )}
      </div>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-5 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            <Controller
              name="lineaId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea</InputLabel>
                  <Select {...field} placeholder="Seleccione una Linea" variant="standard">
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
                imprimirInforme();
              }}
              sx={{ marginLeft: 3 }}
              className={buttonClasses.greenButton}
              variant="contained"
              disabled={rechazados == null}>
              Imprimir
            </Button>
            <Button
              onClick={excelExport}
              sx={{ marginLeft: 3 }}
              className={buttonClasses.purpleButton}
              variant="contained"
              disabled={rechazados == null}>
              KPI
            </Button>
            {exportar && <RechazosInformesExcel editState={editState} lineaDescrip={lineaSeleccionada} />}
          </div>
        </div>
      </form>

      <div className="animate__animated animate__fadeIn my-6">
        {!cambioFecha && (
          <div className="animate__animated animate__fadeIn">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography component={"span"} className="text-base ">
                  Rechazos
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col w-full p-0">
                {rechazados && rechazados?.length > 0 ? (
                  <TableComponent
                    Dense={true}
                    Overflow={false}
                    buscar={true}
                    IDcolumn={"id"}
                    columns={[
                      {
                        title: "Codigo Rechazo",
                        field: "codigoRechazo"
                      },
                      {
                        title: "Descripcion Rechazo",
                        field: "descripcionRechazo"
                      },
                      {
                        title: "Total",
                        field: "total"
                      }
                    ]}
                    dataInfo={rechazados}
                  />
                ) : (
                  <AccordionDetails>
                    <Typography component={"span"} className="text-base ">
                      Sin rechazados
                    </Typography>
                  </AccordionDetails>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
        )}
        {!cambioFecha && rechazados && (
          <div className="animate__animated animate__fadeIn mt-4">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                width={730}
                height={250}
                data={rechazados}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="descripcionRechazo" />
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
