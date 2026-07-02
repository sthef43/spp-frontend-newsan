import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant, ITurno } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ParadasDeLineaTable } from "app/features/produccion/modules/paradasLinea/components/ParadasDeLineaTable";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";

export const ParadasDeLineaPage = (): JSX.Element => {
  const initialState = {
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    turnoRadioButton: 1,
    plantId: 0,
    linea: 0
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const [linea, setLinea] = React.useState<ILineaProduccion[]>([]);
  const [lineaSelect, setLineaSelect] = React.useState<boolean>(false);
  const [faltantesFlag] = React.useState<boolean>(false);
  const [disabledPlant, setDisabledPlant] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [data, setData] = React.useState({});
  const [dataTable, setdataTable] = React.useState<IParadasDeLinea[]>([]);

  const watchPlantId = watch("plantId");
  const watchLinea = watch("linea");
  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");
  const planta = watch("plantId");
  const watchTurno = watch("turnoRadioButton");

  const getAllParadasDeLinea = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          ParadasDeLineaSliceRequests.GetByFilters({
            fechaInicio: moment(getValues("fechaInicio")).format("YYYY-MM-DD"),
            fechaFin: moment(getValues("fechaFin")).format("YYYY-MM-DD"),
            lineaId: getValues("linea"),
            turnoId: getValues("turnoRadioButton")
          })
        )
      );
      setdataTable(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const getRol = async () => {
    try {
      const user = unwrapResult(await dispatch(AppUserSliceRequests.getInfoUserById(GetInfoUser().id)));
      if (user.permisos?.rolId == 10) {
        setValue("plantId", user?.operator?.plantaId);
        setDisabledPlant(true);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getPlantByUser = async () => {
    try {
      const user = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni)));
      if (user) {
        setValue("plantId", user?.plantaId || 0);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const { State: ListOfPlants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
  const { State: ListOfTurnos } = useFetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest);
  const getAllLineasByPlantaId = async () => {
    let fetchLineaResult: ILineaProduccion[];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      fetchLineaResult = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(getValues("plantId")))
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
    }
  };
  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  React.useEffect(() => {
    TitleChanger("Paradas de linea");
    getRol();
    getPlantByUser();
  }, []);
  React.useEffect(() => {
    if (planta > 0) {
      getAllLineasByPlantaId();
    }
  }, [planta]);

  React.useEffect(() => {
    if (watchLinea > 0) {
      getAllParadasDeLinea();
      setData({
        plantId: getValues("plantId"),
        lineaProduccionId: getValues("linea"),
        codigoNewsan: linea?.find((l) => l.id == getValues("linea")).identificadorLinea || 0,
        turno: getValues("turnoRadioButton")
      });
    }
  }, [watchLinea, fechaInicio, fechaFin, watchTurno]);
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-evenly ">
              {/* ---------------------Plantas -------------- */}
              {ListOfPlants && (
                <Controller
                  name="plantId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel variant="filled">Seleccione una planta</InputLabel>
                      <Select
                        disabled={disabledPlant}
                        className="pt-2"
                        defaultValue={0}
                        {...field}
                        onClick={() => {
                          setLineaSelect(false);
                          setValue("linea", 0);
                          console.log("ageriasd");
                        }}>
                        {ListOfPlants &&
                          ListOfPlants.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.name}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              )}
              {/* ----------------LINEA---------------*/}
              <FormControl fullWidth variant="outlined">
                <InputLabel variant="filled">Seleccione una linea</InputLabel>
                <Controller
                  name="linea"
                  control={control}
                  rules={{ required: "Seleccione una línea." }}
                  render={({ field }) => (
                    <Select
                      className="pt-2"
                      {...field}
                      defaultValue={0}
                      onClick={() => {
                        setLineaSelect(true);
                      }}>
                      {linea &&
                        linea.map((linea) => (
                          <MenuItem key={linea.id} value={linea.id}>
                            <div className="w-full">
                              <div>{linea.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ------------------EXPORTAR A EXCEL------------- */}
              <div>
                <Button className={classes.blueButton} variant="contained" onClick={excelExport}>
                  Exportar a excel
                </Button>
                <ExcelExport data={dataTable} ref={_exporter} fileName="ParadasDeLinea">
                  <ExcelExportColumn field="modelo.nombre" title="Código de modelo" />
                  <ExcelExportColumn field="horaInicio" title="Desde" />
                  <ExcelExportColumn field="horaFin" title="Hasta" />
                  <ExcelExportColumn field="fecha" title="Fecha" />
                  <ExcelExportColumn field="causa" title="Causa" />
                  <ExcelExportColumn field="areaTraza.nombre" title="Area" />
                  <ExcelExportColumn field="minutos" title="Minutos" />
                  <ExcelExportColumn field="discontinuo" title="Discontinuo?" />
                </ExcelExport>
              </div>
              {/* ----------------FECHA---------------*/}
              <div className="text-center sm:text-left p-2">
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
              <div className="text-center sm:text-right p-2">
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

              {/* ----------------TURNO---------------*/}
              <div className="text-center sm:text-left p-2">
                <FormControl>
                  <FormLabel>Turno</FormLabel>
                  <Controller
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        {ListOfTurnos &&
                          ListOfTurnos.map((turno) => (
                            <FormControlLabel
                              key={turno.id}
                              value={turno.id}
                              control={<Radio />}
                              label={turno.nombre}
                            />
                          ))}
                      </RadioGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue={1}
                    name="turnoRadioButton"
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <Divider />
          {lineaSelect && getValues("linea") != 0 && (
            <div className="animate__animated animate__fadeInUp">
              <ParadasDeLineaTable
                plantId={watchPlantId}
                data={data}
                tableData={dataTable}
                refresh={getAllParadasDeLinea}
              />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
