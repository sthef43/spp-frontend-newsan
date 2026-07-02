import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { IIntDarsena } from "app/models/IIntDarsena";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { IntRemitoPadreSliceRequests } from "app/Middleware/reducers/IntRemitoPadreSlice";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { IntDarsenaSliceRequests } from "app/Middleware/reducers/IntDarsenaSlice";

interface props {
  setOpenPopup: any;
  intDarsenaSelect?: IIntDarsena | null; //Lista Completa Arreglo de objetos
  refresh?: any;
  listDarsenas?: IIntDarsena[];
}
export const IntDarsenaProgramar = ({ intDarsenaSelect, setOpenPopup, refresh, listDarsenas }: props) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();

  //Form
  interface initialState {
    appUserId?: number | 0;
    plantOrigenId?: number | 0;
    plantDestinoId?: number | 0;
    intEstadoId?: number | 0;
    patente?: string | null;
    chofer?: string | null;
    precintoCandado?: string | null;
    contenedor?: string | null;
    observacion?: string | null;
  }
  const initialStateVar = {
    appUserId: 0,
    plantOrigenId: 0,
    plantDestinoId: 0,
    intEstadoId: 0,
    patente: "",
    chofer: "",
    precintoCandado: "",
    contenedor: "",
    observacion: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Cargo ComboBox con las Selecciones de Tablas
  useEffect(() => {
    getListPlantas();
  }, []);

  //Leer
  const [listPlantas, setListPlantas] = useState<IPlant[] | []>([]);
  const getListPlantas = async () => {
    try {
      const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(result);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  //Watch
  const watchPatente = watch("patente");

  //Buscar un remito padre a Descargar
  const [listRemitoADescargar, setListRemitoADescargar] = useState<IIntRemitoPadre[] | null>(null);
  const buscar = async () => {
    try {
      const objeto = {
        patente: watchPatente,
        intEstadoId: 3 //Enviado es decir listo para descargar
      };
      const result = unwrapResult(await dispatch(IntRemitoPadreSliceRequests.getByPatenteEstadoRequest(objeto)));
      if (result.length > 0) {
        //Si existe la patente
        //Verifico que Planta Descarga del transporte es igual a la Planta de la Darsena
        if (result[0].plantDestinoId == intDarsenaSelect.plantId) {
          //Verificar que ya no esta descargando el camion en otra Darsena
          const resultFiltrado = listDarsenas.filter((x) => x.intRemitoPadreId == result[0].id);
          if (resultFiltrado.length > 0) {
            openNotificationUI("Dicho transporte ya se está descargando.", "error");
          } else {
            setListRemitoADescargar(result);
          }
        } else {
          openNotificationUI("Error en descarga. El transporte pertenece a " + result[0].plantDestino.name, "error");
        }
      } else {
        openNotificationUI("Patente inexistente.", "error");
      }
    } catch (error) {
      openNotificationUI("Error al leer patente.", "error");
    }
  };
  const cargarCajas = () => {
    setValue("plantDestinoId", listRemitoADescargar[0].plantDestinoId);
    setValue("precintoCandado", listRemitoADescargar[0].precintoCandado);
    setValue("contenedor", listRemitoADescargar[0].contenedor);
    setValue("chofer", listRemitoADescargar[0].chofer);
    setValue("observacion", listRemitoADescargar[0].observacion);
  };
  useEffect(() => {
    if (listRemitoADescargar) {
      cargarCajas();
    }
  }, [listRemitoADescargar]);

  //Cancelar
  const cancelar = () => {
    setOpenPopup(false);
  };

  //Guardar
  const loginSubmit = async (e) => {
    if (listRemitoADescargar) {
      //Seleccion de remito para descargar
      actualizarDarsena(listRemitoADescargar[0].id);
    } else {
      //Cargar Remito Padre Nuevo
      if (intDarsenaSelect.plantId == e.plantDestinoId) {
        openNotificationUI("Planta Origen es igual a Planta Destino.", "error");
      } else {
        const objectSubmit = {
          ...e,
          appUserId: infoUser.id,
          plantOrigenId: intDarsenaSelect.plantId,
          intEstadoId: 1
        };
        try {
          const result = unwrapResult(await dispatch(IntRemitoPadreSliceRequests.PostRequest(objectSubmit)));
          actualizarDarsena(result.id);
        } catch (error) {
          openNotificationUI("Error al guardar remito padre", "error");
        }
      }
    }
  };

  const actualizarDarsena = async (padreId) => {
    const updatedList = { ...intDarsenaSelect, intRemitoPadreId: padreId };
    delete updatedList.intRemitoPadre;
    delete updatedList.plant;
    try {
      unwrapResult(await dispatch(IntDarsenaSliceRequests.PutRequest(updatedList)));
    } catch (error) {
      openNotificationUI("Error al actualizar darsena", "error");
    }
    refresh();
    setOpenPopup(false);
  };

  return (
    <div style={{ height: "100%", width: "50vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        {/* Primer cuadro */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px"
          }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 4 }}>
                Ingrese la patente aquí
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="patente"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div style={{ flex: 1, alignContent: "center", textAlign: "center" }}>
                <Button className={classes.greenButton} onClick={buscar} variant="contained">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Segundo Cuadro */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px"
          }}>
          <div style={{ flex: 2 }}>
            <div style={{ display: "flex", padding: "10px" }}>
              <div
                style={{
                  flex: 1,
                  alignContent: "center"
                }}>
                <Controller
                  name="plantDestinoId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Planta Destino</InputLabel>
                      <Select {...field} placeholder="Seleccione Planta Destino" variant="standard">
                        {listPlantas &&
                          listPlantas.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.name}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", padding: "10px" }}>
                <div style={{ flex: 3 }}>
                  Código Precinto/Candado
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="precintoCandado"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="text" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ flex: 4 }}>
            <div style={{ display: "flex", padding: "10px" }}>
              <div style={{ flex: 3 }}>
                Contenedor
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="contenedor"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth type="text" {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", padding: "10px" }}>
              <div style={{ flex: 3 }}>
                Chofer
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="chofer"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth type="text" {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", padding: "10px" }}>
              <div style={{ flex: 3 }}>
                Observación
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="observacion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth type="text" {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <div style={{ flex: 1, alignContent: "center", textAlign: "center" }}>
                <Button
                  className={classes.redButton}
                  onClick={cancelar}
                  variant="contained"
                  disabled={!isDirty && !isValid}>
                  Cancelar
                </Button>
              </div>

              <div style={{ flex: 1, alignContent: "center", textAlign: "center" }}>
                <Button
                  className={classes.blueButton}
                  type="submit"
                  variant="contained"
                  disabled={!isDirty && !isValid}>
                  {listRemitoADescargar ? "Descargar" : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
