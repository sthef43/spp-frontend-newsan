/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ILinea } from "app/models/ILinea";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { IInicio } from "app/models/IInicio";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { TurnoExtrasSliceRequests } from "app/Middleware/reducers/TurnoExtrasSlice";
import { IPlant, ITurno } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import FetchApi from "app/shared/helpers/FetchApi";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { NumerosFaltantesTable } from "../Components/NumerosFaltantesTable";
import { ProducidosTable } from "../Components/ProducidosTable";

export const AdministrarTraza = (props: any): JSX.Element => {
  const { control, setValue, getValues, watch } = useForm();

  let type = props.type;
  if (type == undefined) {
    type = "N";
  }

  const [linea, setLinea] = useState<ILinea[]>([]); //lista de las lineas
  const [faltantesFlag] = useState<boolean>(false);
  const [producidos, setProducidos] = useState<IInicio[]>([]); //todos los producidos de esa fecha
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const turnos = useAppSelector((state) => state.turno.dataAll as ITurno[]);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [lineaSelect, setLineaSelect] = useState<string | number>(0);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const watchLinea = watch("linea");
  const fecha = watch("fecha");
  const watchTurno = watch("turnoRadioButton");

  FetchApi<ILinea[]>(LineaSliceRequests.getAllRequest, null, false, plantaSeleccionada, setLinea, true);
  // const onInit = async (plantId: number) => {
  //   let fetchLineaResult: ILinea[];
  //   try {
  //     fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
  //   } catch (error) {
  //     fetchLineaResult = null;
  //   }
  //   if (fetchLineaResult) {
  //     setLinea(fetchLineaResult.filter((x) => x.plantId == plantId));
  //   }
  // };

  const getAllTurnosAndExtra = async () => {
    try {
      await dispatch(TurnoSliceRequests.getAllRequest());
      await dispatch(TurnoExtrasSliceRequests.getAllRequest());
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const getAllProducidos = async () => {
    const lineaAux: ILinea = linea.find((lane) => lane.idLinea == getValues("linea"));
    setLineaSelect(0);
    let fetchProducidosResult: ILinea[];
    try {
      fetchProducidosResult = unwrapResult(
        await dispatch(
          InicioSliceRequests.getAllIniciosRequest({
            fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
            turno: getValues("turnoRadioButton"),
            codigoInicio: lineaAux?.codigoInicio
          })
        )
      );
    } catch (error) {
      fetchProducidosResult = null;
    }
    if (fetchProducidosResult) {
      setProducidos(fetchProducidosResult);
      setLineaSelect(1);
    }
  };

  useEffect(() => {
    TitleChanger("ADMINISTRACIÓN DE TRAZABILIDAD");
    dispatch(PlantSliceRequests.getAllRequest());
    getAllTurnosAndExtra();
    setValue("fecha", moment().toDate());
    setValue("turnoRadioButton", "M");
  }, []);

  useEffect(() => {
    if (watchLinea > 0) {
      getAllProducidos();
    }
  }, [watchLinea, fecha, watchTurno]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ContainerForPages optionsLayout="page">
          <div className="p-4 shadow-md m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center ">
              <TitleUIComponent
                title="PLANTAS DE NEWSAN"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle="text-2xl"
              />
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ----------------FECHA---------------*/}
              <div className="text-center sm:text-left p-2 w-1/2">
                <DesktopDatePicker
                  label="Fecha"
                  value={fecha}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              </div>

              {/* ----------------TURNO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl>
                  <FormLabel>Turno</FormLabel>
                  <Controller
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <div className="sm:grid sm:grid-cols-1 ">
                          <div className="sm:col-span-1 ">
                            {turnos?.map((turno) => (
                              <FormControlLabel
                                key={turno.id}
                                value={turno.abreviatura}
                                control={<Radio />}
                                label={turno.nombre}
                              />
                            ))}
                          </div>
                          <div className="sm:col-span-1">
                            <FormControlLabel value="EM" control={<Radio />} label="Extra Mañana" />
                            <FormControlLabel value="ET" control={<Radio />} label="Extra Tarde" />
                            <FormControlLabel value="EN" control={<Radio />} label="Extra Noche" />
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
              {/* ----------------LINEA---------------*/}
              <div className="w-full flex flex-row item-center gap-x-4">
                {plantas && (
                  <SelectComponent
                    control={control}
                    inputLabel="Planta"
                    nameSelect="plantId"
                    defaultValue="0"
                    varianteEstilo="standard"
                    listaObjetos={plantas}
                    valueLabel={(value) => value.name}
                    valueSelect={(value) => value.id}
                    valueKey={(value) => value}
                    ValueSave={setPlantaSeleccionada}
                  />
                  // <div className="text-center sm:text-left p-2">
                  //   <FormControl className={classes.formControl} variant="standard">
                  //     <InputLabel>Planta</InputLabel>
                  //     <Controller
                  //       name="plantId"
                  //       control={control}
                  //       rules={{ required: "Seleccione una planta." }}
                  //       defaultValue={null}
                  //       render={({ field }) => (
                  //         <Select
                  //           {...field}
                  //           onChange={(e) => {
                  //             setValue("plantId", parseInt(e.target.value.toString()));
                  //             onInit(parseInt(e.target.value.toString()));
                  //           }}>
                  //           {plantas &&
                  //             plantas.map((plant) => (
                  //               <MenuItem key={plant.id} value={plant.id}>
                  //                 {plant.name}
                  //               </MenuItem>
                  //             ))}
                  //         </Select>
                  //       )}
                  //     />
                  //   </FormControl>
                  // </div>
                )}
                <SelectComponent
                  control={control}
                  inputLabel="Linea"
                  listaObjetos={linea}
                  nameSelect="linea"
                  defaultValue="0"
                  varianteEstilo="standard"
                  valueLabel={(value) => value.descripcion}
                  valueSelect={(value) => value.idLinea}
                  valueKey={(value) => value}
                  ValueSave={setLineaSelect}
                />
              </div>
            </div>
          </div>
          {(lineaSelect as number) > 0 && (
            <div className="animate__animated animate__fadeInUp">
              <div className="grid sm:grid-cols-4 grid-cols-1 gap-4">
                {!faltantesFlag && (
                  <div className="col-span-1">
                    <NumerosFaltantesTable
                      refreshProducidos={getAllProducidos}
                      producidos={producidos}
                      fecha={moment(getValues("fecha")).format("YYYY-MM-DD")}
                      turno={getValues("turnoRadioButton")}
                      codigoInicio={
                        linea.find((lane) => lane.idLinea == getValues("linea"))
                          ? linea.find((lane) => lane.idLinea == getValues("linea")).codigoInicio
                          : "0"
                      }
                      type={type}
                    />
                  </div>
                )}
                <div className="sm:col-span-3">
                  <ProducidosTable
                    inicios={producidos}
                    fecha={moment(getValues("fecha")).format("YYYY-MM-DD")}
                    turno={getValues("turnoRadioButton")}
                    codigoInicio={
                      linea.find((lane) => lane.idLinea == getValues("linea"))
                        ? linea.find((lane) => lane.idLinea == getValues("linea")).codigoInicio
                        : "0"
                    }
                    type={type}
                    refresh={getAllProducidos}
                  />
                </div>
              </div>
            </div>
          )}
        </ContainerForPages>
      </LocalizationProvider>
    </>
  );
};
