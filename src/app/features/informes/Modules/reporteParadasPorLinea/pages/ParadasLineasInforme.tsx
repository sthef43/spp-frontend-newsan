import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlant, ITurno } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Check } from "@mui/icons-material";
import moment from "moment";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";

export const ParadasLineasInforme = () => {
  const classes = MaterialButtons();
  const ListOfPlants: IPlant[] = useAppSelector((state) => state.plant.dataAll);
  const ListOfTurnos: ITurno[] = useAppSelector((state) => state.turno.dataAll);
  const { TitleChanger } = useTitleOfApp();
  const [dataOpen, setDataOpen] = useState([]);
  const [disabledPlant, setDisabledPlant] = useState(false);
  const initialState = {
    plantId: 0,
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate(),
    turnoRadioButton: 1
  };
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const getPlants = async () => {
    try {
      dispatch(await LoadingUISlice.actions.LoadingUIOpen());
      const response = await dispatch(PlantSliceRequests.getAllRequest());
      dispatch(await LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getTurnos = async () => {
    try {
      dispatch(await LoadingUISlice.actions.LoadingUIOpen());
      const response = await dispatch(TurnoSliceRequests.getAllRequest());
      dispatch(await LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
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
  const getParadas = async () => {
    try {
      dispatch(await LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(
        await dispatch(
          ParadasDeLineaSliceRequests.GetAllByPlantId({
            fechaInicio: moment(getValues("fechaInicio")).format("YYYY-MM-DD"),
            fechaFin: moment(getValues("fechaFin")).format("YYYY-MM-DD"),
            plantId: getValues("plantId"),
            turnoId: getValues("turnoRadioButton")
          })
        )
      );
      setDataOpen(response);
      dispatch(await LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });
  const plantId = watch("plantId");
  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");
  const watchTurno = watch("turnoRadioButton");

  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  useEffect(() => {
    getTurnos();
    getPlants();
    getRol();
    TitleChanger("Informes de paradas del lineas por planta");
  }, []);
  useEffect(() => {
    if (getValues("plantId") > 0) {
      getParadas();
    }
  }, [plantId, fechaInicio, fechaFin, watchTurno]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="m-1 sm:m-10 h-full">
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="w-full flex justify-around items-center gap-4 ">
            {/* ---------------------Plantas -------------- */}
            {ListOfPlants && (
              <Controller
                name="plantId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl className="w-80 " variant="outlined" error={!!error}>
                    <InputLabel variant="filled">Seleccione una planta</InputLabel>
                    <Select className="pt-2" disabled={disabledPlant} {...field}>
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
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ------------------EXPORTAR A EXCEL------------- */}
              <div>
                <Button className={classes.blueButton} variant="contained" onClick={excelExport}>
                  Exportar a excel
                </Button>
                <ExcelExport data={dataOpen} ref={_exporter} fileName="ParadasDeLineaPorPlanta">
                  <ExcelExportColumn field="lineaProduccion.nombre" title="Linea de producción" />
                  <ExcelExportColumn field="turno.nombre" title="Turno" />
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
        </div>
        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Linea de producción",
              field: "lineaProduccion.nombre"
            },
            {
              title: "Código de modelo",
              field: "modelo.nombre"
            },
            {
              title: "Desde",
              field: "horaInicio"
            },
            {
              title: "Hasta",
              field: "horaFin"
            },
            {
              title: "Fecha",
              field: "",
              render: (row: any) => row && <div className="w-full">{moment(row?.fecha).format("YYYY-MM-DD")}</div>
            },
            {
              title: "Causa",
              field: "causa"
            },
            {
              title: "Area",
              field: "areaTraza.nombre"
            },
            {
              title: "Minutos",
              field: "minutos"
            },
            {
              title: "Supervisor",
              field: "supervisor"
            },
            {
              title: "Discontinuo?",
              field: "",
              render: (row: any) =>
                row && (
                  <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                    <div id="icono" className="col-span-2 text-right sm:text-left ">
                      {row.discontinuo ? (
                        <Tooltip title="Si">
                          <IconButton size="small">
                            <Check fontSize="small" color="success" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="No">
                          <IconButton size="small">
                            <Check fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                )
            }
          ]}
          buscar
          dataInfo={dataOpen}
          Dense={true}
          Overflow={true}
        />
      </div>
    </LocalizationProvider>
  );
};
