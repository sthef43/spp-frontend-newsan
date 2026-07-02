/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Grid,
  Input,
  SelectChangeEvent
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IReparadores } from "app/models/IReparadores";
import { ReparadoresSliceRequests } from "app/Middleware/reducers/ReparadoresSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import SendIcon from "@mui/icons-material/Send";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { IReparadoresLineaProduccion } from "app/models/IReparadoresLineaProduccion";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
interface props {
  setOpenPopup: any;
  editState?: IReparadores | null;
  refresh?: any;
  estaEditando: any;
}

export const ReparadoresForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  // console.log(editState);
  const classes = MaterialButtons();
  interface initialState {
    reparador: string;
    codigo: string;
    plantId: number;
  }
  const initialStateVar = {
    reparador: "",
    codigo: "",
    plantId: editState.plantId
  };

  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const plantId = watch("plantId");

  const [lineaSeleccionada, setLineaSeleccionada] = useState<ILineaProduccion>(null);
  const [listLineasAsignadas, setListLineasAsignadas] = useState<IReparadoresLineaProduccion[]>([]);

  const handleDeleteLinea = async (linea: IReparadoresLineaProduccion) => {
    const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
    if (!resp) {
      return;
    }
    if (linea?.id) {
      const mapping = listLineasAsignadas.map((d) => {
        if (d.id == linea.id) {
          d.deleted = true;
        }
        return d;
      });
      setListLineasAsignadas(mapping);
    } else {
      const filter = listLineasAsignadas.filter((d) => d.lineaProduccion.id != linea.lineaProduccion.id);
      console.log(filter);
      setListLineasAsignadas(filter);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const lineaProduccionId = +event.target.value;
    const lineaProduccion = listLineas.find((d) => d.id == lineaProduccionId);
    if (lineaProduccion) {
      console.log(lineaProduccion);
      setLineaSeleccionada(lineaProduccion);
    }
  };

  const asignarLinea = () => {
    console.log(lineaSeleccionada);
    if (!lineaSeleccionada) {
      return;
    }

    const find = listLineasAsignadas.find((d) => d.lineaProduccionId == lineaSeleccionada.id);
    if (find) {
      if (!find.deleted) {
        openNotificationUI("La linea ya se encuentra en la lista", "error");
      } else {
        const mapping = listLineasAsignadas.map((d) => {
          if (d.id == find.id) {
            d.deleted = false;
            d.puesto = puesto;
          }
          return d;
        });
        setListLineasAsignadas(mapping);
      }
      setLineaSeleccionada(null);
      return;
    }
    const newReparadoresLineaProduccion: IReparadoresLineaProduccion = {
      lineaProduccion: lineaSeleccionada,
      reparadorId: editState.id,
      puesto: puesto
    };
    const temp = [...listLineasAsignadas, newReparadoresLineaProduccion];
    setListLineasAsignadas(temp);
    setLineaSeleccionada(null);
  };

  //setear Lineas Asignadas

  const setLineasAsignadas = () => {
    try {
      if (!editState) return;
      if (editState?.lineas.length == 0) {
        return;
      }
      const lineasAsignadas = editState.lineas;
      setListLineasAsignadas(lineasAsignadas);
      console.log(lineasAsignadas);
    } catch (error) {
      console.log(error);
    }
  };

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    let result;
    try {
      if (estaEditando) {
        e.lineas = listLineasAsignadas;
        result = unwrapResult(await dispatch(ReparadoresSliceRequests.NestedUpdateRequest(e)));
      } else {
        result = unwrapResult(await dispatch(ReparadoresSliceRequests.PostRequest(e)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      console.log(result);
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  //Leer Lineas

  const [listLineas, setListLineas] = useState([]);

  const getLineas = async () => {
    try {
      let responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
      if (estaEditando && listLineasAsignadas.length > 0) {
        const ids = listLineasAsignadas.map((d) => d.lineaProduccionId);
        responses = responses.filter((d) => !ids.includes(d.id));
      }
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Plantas
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  const [puesto, setPuesto] = useState("P");
  const [listPuestos, setlistPuestos] = useState([]);
  const getPuesto = async () => {
    try {
      const array1 = [
        { id: 1, name: "P" },
        { id: 2, name: "M" }
      ];
      setlistPuestos(array1);
    } catch (error) {
      openNotificationUI("Error al cargar puestos.", "error");
    }
  };

  //Cargo lista inicial
  useEffect(() => {
    getPuesto();
    getPlantas();
  }, []);

  useEffect(() => {
    if (estaEditando) {
      getLineas();
      setLineasAsignadas();
    }
  }, [plantId]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="plantId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard" value={field.value || ""}>
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type !== "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type === "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="reparador"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Reparador</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="codigo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Código</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {estaEditando && (
              <Grid item xs={12}>
                <h1 className="w-full m-2 text-center">Asignar Linea</h1>
                <div className="flex flex-col md:flex-row">
                  <Select
                    defaultValue={puesto}
                    className="w-full flex-1 m-2 text-center"
                    placeholder="Seleccione Puesto"
                    variant="standard"
                    onChange={(e) => {
                      const puesto = e.target.value;
                      setPuesto(puesto);
                    }}>
                    {listPuestos &&
                      listPuestos.map((x) => (
                        <MenuItem key={x.id} value={x.name}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>

                  <Select
                    className="w-full flex-1 m-2 text-center"
                    placeholder="Seleccione Linea"
                    variant="standard"
                    onChange={handleChange}
                    value={lineaSeleccionada?.id.toString() || ""}>
                    {listLineas &&
                      listLineas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  <Button variant="outlined" startIcon={<SendIcon />} onClick={asignarLinea}>
                    Asignar Linea
                  </Button>
                </div>
                {listLineasAsignadas && listLineasAsignadas.length > 0 && (
                  <div className="p-2 mt-1 border border-slate-400 rounded-sm shadow-lg">
                    <h1 className="text-center w-full border-b-2 border-blue-300 mb-2 uppercase">Lineas Asignadas</h1>
                    <Stack direction="row" spacing={1}>
                      {listLineasAsignadas
                        .filter((d) => !d.deleted)
                        .map((linea) => (
                          <Chip
                            key={linea.lineaProduccion.id}
                            label={`${linea.lineaProduccion.nombre} - ${linea.puesto}`}
                            onDelete={() => handleDeleteLinea(linea)}
                          />
                        ))}
                    </Stack>
                  </div>
                )}
              </Grid>
            )}
          </Grid>
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%", marginTop: "3%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

// const objectSubmit = {
//   ...e,
//   planta: null,
//   linea: null,
//   modelo: null,
//   familia: null,
//   producto: null
// };
// console.log(objectSubmit);

//Watch
// const watchPlanta = watch("plantId");
// useEffect(() => {
//   if (watchPlanta) {
//     getLineas();
//   }
// }, [watchPlanta]);
