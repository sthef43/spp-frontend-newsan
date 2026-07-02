import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React, { useEffect } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
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
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { PlantSliceRequests } from "app/Middleware/reducers";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { InformesPITable } from "app/features/programacionIndustrial/informesProgramacionIndustrial/components/InformesPITable";
import { IPlant, ITurno } from "app/models";
import { InformesPISliceRequest } from "app/Middleware/reducers/InformesPISlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GetInfoUser } from "app/shared/helpers/userConfig";

export const InformesPIPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const plantas = useAppSelector<IPlant[]>((state) => state.plant.dataAll);
  const turnos = useAppSelector<ITurno[]>((state) => state.turno.dataAll);
  const dataTable = useAppSelector((state) => state.informesPI.dataAll);
  const initialState = {
    fecha: moment().toDate(),
    turnoRadioButton: 1,
    plantId: 0
  };

  const { control, setValue, watch } = useForm({
    defaultValues: initialState
  });
  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };
  const refresh = async () => {
    try {
      const response = await dispatch(
        InformesPISliceRequest.getAllByPlantId({
          plantId: plantaWatch,
          fecha: moment(fechaWatch).format("YYYY-MM-DD"),
          turnoId: turnoWatch
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  // Trae la planta que tiene asignadda por usuario
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
  const plantaWatch = watch("plantId");
  const turnoWatch = watch("turnoRadioButton");
  const fechaWatch = watch("fecha");
  useEffect(() => {
    plantaWatch != 0 && refresh();
  }, [plantaWatch, fechaWatch, turnoWatch]);
  useEffect(() => {
    dispatch(PlantSliceRequests.getAllRequest());
    dispatch(TurnoSliceRequests.getAllRequest());
    getPlantByUser();
  }, []);
  useEffect(() => {
    TitleChanger("Informes de programación industrial");
  }, []);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-evenly gap-4">
              {/* ---------------------Plantas -------------- */}
              {plantas && (
                <Controller
                  name="plantId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel variant="filled">Seleccione una planta</InputLabel>
                      <Select className="pt-2" defaultValue={0} {...field}>
                        {plantas &&
                          plantas.map((x) => (
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
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ------------------EXPORTAR A EXCEL------------- */}
              <div>
                <Button className={classes.blueButton} variant="contained" onClick={excelExport}>
                  Exportar a excel
                </Button>
                <ExcelExport
                  data={dataTable}
                  ref={_exporter}
                  fileName={`InformeDiarioPI-${moment(fechaWatch).format("YYYY-MM-DD")}`}>
                  <ExcelExportColumn field="lineaProduccion.nombre" title="Linea" />
                  <ExcelExportColumn field="asunto" title="Asunto" />
                  <ExcelExportColumn field="descripcion" title="Descripción" />
                  <ExcelExportColumn field="solucion" title="Solución" />
                  <ExcelExportColumn field="sector.name" title="Sector" />
                  <ExcelExportColumn field="turno.nombre" title="Turno" />
                  <ExcelExportColumn field="fecha" title="Fecha" />
                  <ExcelExportColumn field="desdeHora" title="Desde la hora" />
                  <ExcelExportColumn field="hastaHora" title="Hasta la hora" />
                </ExcelExport>
              </div>
              {/* ----------------FECHA---------------*/}
              <div className="text-center sm:text-left p-2">
                <DesktopDatePicker
                  label="Fecha"
                  value={fechaWatch}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
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
                        {turnos &&
                          turnos.map((turno) => (
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
          {plantaWatch != 0 && (
            <div className="animate__animated animate__fadeInUp">
              <InformesPITable refresh={refresh} plantId={plantaWatch} />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
