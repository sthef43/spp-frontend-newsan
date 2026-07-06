import { Info } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";
import { LineaSfcsplusSliceRequests } from "app/Middleware/reducers/sfcsplus/LineaSfcsPlusSlice";
import { PlantaSfcsplusSliceRequests } from "app/Middleware/reducers/sfcsplus/PlantaSfcsplusSlice";
import { SPDashboard_GetPanelDataSfcsplusSliceRequests } from "app/Middleware/reducers/sfcsplus/SpDashboardPanelDataSlice";
import { useAppDispatch } from "app/core/store/store";
import { IMotivo } from "app/models/IMotivo";
import { ILineaSfcsplus } from "app/models/sfcsplus/ILineaSfcsplis";
import { IPlantaSfcsplus } from "app/models/sfcsplus/IPlantaSfcsplis";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CargaMotivosAccion } from "app/features/produccion/modules/controlParadas/modals/CargaMotivosAccion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ControlParadas = () => {
  const [objetoMotivo, setObjetoMotivo] = useState<IMotivo>(null); //Para guardar el motivo que justifican los minutos.
  const [dataOpen, setdataOpen] = useState([]);
  const dispatch = useAppDispatch();
  const [plantas, setPlantas] = useState([]);
  const [openModalAccionMotivos, setOpenModalAccionMotivos] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [plantaSelected, setPlantaSelected] = useState(null);
  interface initialState {
    plantaId: number;
    fecha: Date;
  }
  const initialStateVar = {
    plantaId: 0,
    fecha: moment().toDate()
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const watchPlanta = watch("plantaId");
  const fecha = watch("fecha");

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) {
      setPlantas(result);
    }
  };

  useEffect(() => {
    getPlantas();
  }, []);

  const getPlantaSelected = () => {
    if (watchPlanta > 0) {
      const plantaSeleccionada = plantas.find((x) => x.id == watchPlanta);
      setPlantaSelected(plantaSeleccionada);
      return plantaSeleccionada != null ? plantaSeleccionada : null;
    }
    return null;
  };

  const actualizarListado = () => {
    const plantaSeleccionada = getPlantaSelected();
    if (!plantaSeleccionada) {
      alert("no existe planta");
      return;
    }
    if (
      plantaSeleccionada.name == "Planta 3" ||
      plantaSeleccionada.name == "Planta 4" ||
      plantaSeleccionada.name == "Planta 5"
    ) {
      //Busco los datos del servidor Sfcsplus, Primero la planta, luego las lineas.
      getInfoByPlanta3or4(plantaSeleccionada);
    } else if (plantaSeleccionada.name == "Planta 6") {
      getDataByPlanta6();
    }
  };

  const getDataByPlanta6 = async () => {
    const result = unwrapResult(
      await dispatch(InicioSliceRequests.GetProducidosPorLinea(moment(getValues("fecha")).format("YYYY-MM-DD")))
    );
    if (result) {
      const list = [];
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      for (let index = 0; index < result.length; index++) {
        const objeto = result[index];
        objeto.minutos = calcularMinutosPerdidos(objeto);
        //consultaSP.lineaId = linea.id;
        const tieneParada = await getParada(objeto); //Verifico si tiene guardada la parada.
        objeto.pintarColor = pintarColor(objeto, tieneParada);
        objeto.planta = plantaSelected.name;
        list.push(objeto);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setdataOpen(list);
    }
  };

  const getPlantaSfcsplusByNombre = async (nombrePlanta) => {
    const result = unwrapResult(await dispatch(PlantaSfcsplusSliceRequests.GetByNombre(nombrePlanta)));
    if (result) {
      return result;
    } else return null;
  };

  const getInfoByPlanta3or4 = async (plantaSeleccionada) => {
    //Primero traigo la planta del servidor Sfcsplus.
    const planta: IPlantaSfcsplus = await getPlantaSfcsplusByNombre(plantaSeleccionada.name);

    if (!planta) {
      console.log("error al obtener planta. No existe ! ");
      return false;
    }
    const lineas = await getLineasSfcsplusByPlantaSfcsplus(planta.id);
    if (lineas) {
      armarListado(lineas);
    } else {
      alert("No hay lineas");
    }
  };

  const armarListado = async (lineas: ILineaSfcsplus[]) => {
    const list = [];
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    for (let index = 0; index < lineas.length; index++) {
      const linea = lineas[index];
      let consultaSP = await getInfoSp(linea.id);
      if (consultaSP) {
        /*  if (consultaSP.lineName == "Motorola - Empaque LINEA 10") {
          consultaSP.declaredQuantity = consultaSP.declaredQuantity + 30;
        } */
        consultaSP.minutos = calcularMinutosPerdidos(consultaSP);
        consultaSP.lineaId = linea.id;
        const tieneParada = await getParada(consultaSP); //Verifico si tiene guardada la parada.
        consultaSP.pintarColor = pintarColor(consultaSP, tieneParada);
        list.push(consultaSP);
        consultaSP = null;
      }
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    setdataOpen(list);
  };

  //Obtiene la parada por linea, planta y fecha. Puede no tener.
  const getParada = async (obj) => {
    const result = unwrapResult(
      await dispatch(
        ParadaSliceRequests.getByLineaPlantaFechaRequest({
          linea: obj.lineName,
          planta: plantaSelected.name,
          fecha: moment(getValues("fecha")).format("YYYY-MM-DD")
        })
      )
    );
    if (result) return result;
    else return null;
  };

  const pintarColor = (consultaSP, tieneParada) => {
    if (tieneParada) {
      //Si tiene parada y no llego a la producicon, pintamos de amarillo el renglon.
      if (consultaSP.declaredQuantity < consultaSP.expectedQuantity) {
        return "amarillo";
      } else {
        //Si se llego a la produccion y tiene parada, pintamos de verde el renglon.
        if (consultaSP.declaredQuantity >= consultaSP.expectedQuantity) return "verde";
      }
    } //Cuando no tiene parada, pintarColor = "". Con eso, no pinto de color. Por que tine que cargar la parada.
    else return "";
  };

  const getInfoSp = async (idLineaSfcsplus: number) => {
    let result;
    try {
      result = unwrapResult(
        await dispatch(
          SPDashboard_GetPanelDataSfcsplusSliceRequests.GetListByPlantaId({
            lineaId: idLineaSfcsplus,
            fecha: moment(getValues("fecha")).format("YYYY-MM-DD")
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) return result;
    else return null;
  };

  const getLineasSfcsplusByPlantaSfcsplus = async (plantaId) => {
    const result = unwrapResult(await dispatch(LineaSfcsplusSliceRequests.GetListByPlantaId(plantaId)));
    return result ?? null;
  };

  //Calculo los minutos perdidos, siempre que no se alla(halla, aya):P, llegado a la produccion. Regla de 3 simples.
  const calcularMinutosPerdidos = (row) => {
    if (row.expectedQuantity <= row.declaredQuantity) {
      return 0;
    } else {
      return Math.trunc((row.declaredQuantity * 540) / row.expectedQuantity);
    }
  };

  useEffect(() => {
    if (watchPlanta > 0) {
      const planta = getPlantaSelected();
      setPlantaSelected(planta);
    }
  }, [watchPlanta]);

  return (
    <div>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          {plantas && (
            <Controller
              name="plantaId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Planta</InputLabel>
                  <Select {...field} placeholder="Seleccione una Planta" variant="standard">
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
          <div className="text-center sm:text-left p-2">
            <Controller
              name="fecha"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  label="Fecha"
                  value={fecha}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              )}
            />
          </div>
          <Button className="btn btn-success" onClick={actualizarListado}>
            Buscar
          </Button>
        </div>
      </form>

      <div>
        <TableComponent
          Dense={true}
          IDcolumn={"productName"}
          buscar
          excel
          columns={[
            {
              title: "Planta",
              field: "planta"
            },
            {
              title: "Linea",
              field: "lineName"
            },
            {
              title: "Fecha",
              field: "fecha"
            },
            {
              title: "Turno",
              field: "turno"
            },
            {
              title: "Modelo",
              field: "productName"
            },
            {
              title: "Objetivo",
              field: "expectedQuantity"
            },
            {
              title: "Producido",
              field: "declaredQuantity"
            },
            {
              title: "Minutos",
              field: "minutos"
            },

            {
              title: "Acciones",
              field: "",
              render: (rowData) => {
                //if (rowData.expectedQuantity > rowData.declaredQuantity)
                if (rowData.pintarColor == "")
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <IconButton
                          onClick={() => {
                            setRowSelected(rowData);
                            setOpenModalAccionMotivos(true);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Info />
                        </IconButton>
                      </div>
                    </div>
                  );
              }
            }
          ]}
          dataInfo={dataOpen}
          rowStyle={(rowData) => {
            if (rowData.pintarColor == "verde") return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            else if (rowData.pintarColor == "amarillo") return { padding: 1, backgroundColor: "yellow", fontSize: 14 };
            else return { padding: 1, fontSize: 14 };
          }}
        />
      </div>
      <ModalCompoment
        title={"Carga de datos"}
        openPopup={openModalAccionMotivos}
        setOpenPopup={setOpenModalAccionMotivos}>
        <CargaMotivosAccion
          rowSelected={rowSelected}
          plantaSelected={plantaSelected != null ? plantaSelected.name : ""}
          fecha={getValues("fecha")}
          refresh={actualizarListado}
          setOpenModalAccionMotivos={setOpenModalAccionMotivos}></CargaMotivosAccion>
      </ModalCompoment>
    </div>
  );
};
