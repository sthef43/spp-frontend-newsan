/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Theme
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { ILinea } from "app/models/ILinea";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { TurnoExtrasSliceRequests } from "app/Middleware/reducers/TurnoExtrasSlice";
import { IPlanProd, IPlant, ITurno } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
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

const initialState = {
  fecha: moment().toDate(),
  turnoRadioButton: "M",
  linea: 0,
  plantId: 0,
  op: ""
};

export const AdministrarTrazaPlacas = (props: any): JSX.Element => {
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  let type = props.type;
  if (type == undefined) {
    type = "M";
  }

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const [linea, setLinea] = React.useState<ILinea[]>([]); //lista de las lineas
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const turnos = useAppSelector((state) => state.turno.dataAll as ITurno[]);

  const watchOp = watch("op");
  const watchPlanta = watch("plantId");
  const watchLinea = watch("linea");
  const watchFecha = watch("fecha");
  const watchTurno = watch("turnoRadioButton");

  const onInit = async (plantId: number) => {
    let fetchLineaResult: ILinea[];
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult.filter((x) => x.plantId == plantId));
    }
  };
  const getAllTurnosAndExtra = async () => {
    try {
      await dispatch(TurnoSliceRequests.getAllRequest());
      await dispatch(TurnoExtrasSliceRequests.getAllRequest());
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const [listDeclarados, setListDeclarados] = useState([]);
  const [listDeclaradosFiltrar, setListDeclaradosFiltrar] = useState([]);
  const getAllProducidos = async () => {
    try {
      const params = {
        org: plantaNombre,
        fecha: moment(watchFecha).format("DD-MM-YYYY"),
        turno: watchTurno
      };
      const responses = unwrapResult(
        await dispatch(empq_declarationsSliceRequests.getListByOrgFechaTurnoRequest(params))
      );
      setListDeclaradosFiltrar(responses);
    } catch (error) {
      openNotificationUI("Error al leer declarados.", "error");
    }
  };

  const [listaNumerosOpUnicos, setListaNumerosOpUnicos] = useState(null);
  const getListDeclarados = async () => {
    // Filtrar listDeclaradosFiltrar por la propiedad nro_Op que esté en listOp
    const resultadoFiltrado = listDeclaradosFiltrar.filter((objDeclarado) => {
      // Verificar si existe algún objeto en listOp con el mismo numeroOp
      return listOp.some((objOp) => objOp.numeroOp === objDeclarado.nro_Op);
    });
    // resultadoFiltrado contendrá solo los objetos de listDeclaradosFiltrar que cumplen la condición
    setListDeclarados(resultadoFiltrado);
    // selecciono todos los numeros de op y elimino los duplicados
    if (resultadoFiltrado) {
      const resx = {};
      const numerosOp = resultadoFiltrado.map((elementos) => elementos.nro_Op);
      const numerosOpUnicos = [...new Set(numerosOp)];
      numerosOpUnicos.map((elementos) => {
        resx[elementos] = elementos;
      });
      setListaNumerosOpUnicos(resx);
    }
  };

  //Leer EMPQ_Declarations
  const [listOp, setlistOp] = React.useState<IPlanProd[]>([]);
  const getOp = async () => {
    if (watchLinea != 0) {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      try {
        //GetListByLineaId
        const responses = unwrapResult(await dispatch(PlanProdSliceRequests.getAllByLineaIdRequest(watchLinea)));
        // const responses = unwrapResult(await dispatch(PlanProdSliceRequests.getListByLineaIdRequest(watchLinea)));
        setlistOp(responses);
      } catch (error) {
        openNotificationUI("Error al leer EMPQ_Declarations.", "error");
      }
    } else {
      openNotificationUI("Seleccione OP.", "error");
    }
  };

  const formatHoraInserccion = (row) => {
    if (row.fecha_Insercion) {
      const fechaInserccionforma = moment(row.fecha_Insercion).format("HH:mm");
      return `${fechaInserccionforma}`;
    }
  };

  React.useEffect(() => {
    if (listOp) {
      getAllProducidos();
    }
  }, [listOp]);

  React.useEffect(() => {
    if (watchLinea && watchFecha && watchTurno) {
      getOp();
    }
  }, [watchLinea, watchFecha, watchTurno]);

  const [plantaNombre, setplantaNombre] = useState(null);
  React.useEffect(() => {
    if (watchPlanta) {
      const nombre = plantas.find((planta) => planta.id == watchPlanta)?.organizationCode;
      setplantaNombre(nombre);
    }
  }, [watchPlanta]);

  useEffect(() => {
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  }, [listDeclarados]);

  useEffect(() => {
    if (listDeclaradosFiltrar) {
      getListDeclarados();
    }
  }, [listDeclaradosFiltrar]);

  React.useEffect(() => {
    TitleChanger("ADMINISTRACIÓN DE TRAZABILIDAD DE PLACAS");
    dispatch(PlantSliceRequests.getAllRequest());
    getAllTurnosAndExtra();
  }, []);

  // React.useEffect(() => {
  //   if (watchOp != "") {
  //     getAllProducidos();
  //   }
  // }, [watchOp, watchFecha, watchTurno]);

  return (
    // <div>
    <div style={{ height: "100%", width: "100vw", position: "relative" }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center ">
              <TitleUIComponent
                title="PLANTAS DE NEWSAN"
                classNameDiv="w-min whitespace-nowrap"
                classNameTitle="text-2xl"
              />
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              {/* ----------------FECHA---------------*/}
              <div className="text-center sm:text-left p-2">
                <DesktopDatePicker
                  label="Fecha"
                  value={watchFecha}
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
              {/* ----------------Planta---------------*/}
              {plantas && (
                <div className="text-center sm:text-left p-2">
                  <FormControl sx={sxStyles.formControl} variant="standard">
                    <InputLabel>Planta</InputLabel>
                    <Controller
                      name="plantId"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={null}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(e) => {
                            setValue("plantId", parseInt(e.target.value.toString()));
                            onInit(parseInt(e.target.value.toString()));
                          }}>
                          {plantas &&
                            plantas.map((plant) => (
                              <MenuItem key={plant.id} value={plant.id}>
                                {plant.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </div>
              )}
              {/* ----------------Línea---------------*/}
              <div className="text-center sm:text-left p-2">
                <FormControl sx={sxStyles.formControl} variant="standard">
                  <InputLabel>Linea</InputLabel>
                  <Controller
                    name="linea"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {linea &&
                          linea.map((lane) => (
                            <MenuItem key={lane.idLinea} value={lane.idLinea}>
                              {lane.descripcion}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              {/* ----------------OP---------------*/}
              {/* <div className="text-center sm:text-left p-2">
                <FormControl className={classes.formControl} variant="standard">
                <InputLabel>Op</InputLabel>
                <Controller
                name="op"
                control={control}
                rules={{ required: true }}
                defaultValue={null}
                render={({ field }) => (
                  <Select {...field}>
                  {listOp &&
                    listOp.map((lane) => (
                      <MenuItem key={lane.idProduccion} value={lane.numeroOp}>
                      {lane.numeroOp}
                      </MenuItem>
                          ))}
                      </Select>
                      )}
                      />
                      </FormControl>
                    </div> */}
            </div>
          </div>
          <Divider />
        </div>
        <TitleUIComponent title={`Trazabilidad Diaria - Produccion diaria: ${listDeclarados.length}`} />
        <div className="my-2 mx-4 h-full">
          <TableComponent
            Dense={true}
            // Overflow={true}
            buscar={true}
            excel
            IDcolumn={"id"}
            columns={[
              {
                title: "Id",
                field: "id"
              },
              {
                title: "OP",
                field: "nro_Op",
                lookup: listaNumerosOpUnicos
              },
              {
                title: "Producto",
                field: "codigo_Producto"
              },
              {
                title: "Fecha Inserción",
                field: "fecha_Insercion",
                render: (row) => {
                  return moment(row.fecha_Insercion).format("DD-MM-YYYY");
                }
              },
              {
                title: "Hora Inserción",
                field: "",
                render: (row) => formatHoraInserccion(row)
              },
              {
                title: "Modelo",
                field: "modelo"
              }
            ]}
            dataInfo={listDeclarados}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

// const getAllProducidos = async () => {
//   console.log(plantaNombre); //ok
//   console.log(watchOp); //ok
//   console.log(moment(watchFecha).format("DD-MM-YYYY")); //ok
//   console.log(watchTurno); //ok
//   try {
//     const params = {
//       org: plantaNombre,
//       op: watchOp,
//       fecha: moment(watchFecha).format("DD-MM-YYYY"),
//       turno: watchTurno
//     };
//     const responses = unwrapResult(
//       await dispatch(empq_declarationsSliceRequests.getListByOrgOpFechaTurnoRequest(params))
//     );
//     setListDeclarados(responses);
//   } catch (error) {
//     openNotificationUI("Error al leer declarados.", "error");
//   }
// };
