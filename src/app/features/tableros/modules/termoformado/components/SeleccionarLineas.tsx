import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ILineaProduccion } from "app/models/ILineaProduccion";

interface props {
  setearLineasFuncion: any;
  setOpenModal: any;
}
export interface LineasTermoformado {
  linea: ILineaProduccion;
  diarioLineaPuestoId: number;
  consumoLineaPuesto: number;
}

export const SeleccionarLineas = ({ setearLineasFuncion, setOpenModal }: props): JSX.Element => {
  const [lineas, setLineas] = useState<ILineaProduccion[]>([]);
  const [lineasSeleccionadas, setLineasSeleccionadas] = useState<LineasTermoformado[]>([]);
  //configuracion linea1
  const [puestos1, setPuestos1] = useState([]);
  const [puestos2, setPuestos2] = useState([]);
  const [diariolineaPuestoId1, setDiariolineaPuestoId1] = useState(0);
  const [consumolineaPuestoId1, setConsumolineaPuestoId1] = useState(0);
  //
  const { openNotificationUI } = useNotificationUI();

  const dispatch = useAppDispatch();

  const getLineas = async () => {
    // const result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    const result2 = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
    if (result2) {
      setLineas(result2);
    }
  };

  const getPuestosByLinea = async (idLinea, lineaCount) => {
    if (idLinea == getValues("idLinea1") && lineaCount > 1) {
      console.log("Linea Igual");
      setPuestos2(puestos1);
      return;
    }
    const result = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllByLineaId(idLinea)));
    if (result.length > 0) {
      if (lineaCount == 1) {
        setPuestos1(result);
      } else {
        setPuestos2(result);
      }
    } else {
      openNotificationUI("La linea seleccionada no contiene puestos", "warning");
    }
  };

  useEffect(() => {
    getLineas();
  }, []);

  interface initialState {
    idLinea1: number;
    idLinea2: number;
    diariolineaPuestoId1: number;
    consumoLineaPuestoId1: number;
    // idLinea2: number;
  }

  const initialStateVar = {
    idLinea1: 0,
    idLinea2: 0,
    diariolineaPuestoId1: 0,
    consumoLineaPuestoId1: 0
    // idLinea2: 0
  };

  const classes = MaterialButtons();

  const { control, handleSubmit, formState, getValues, reset } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid } = formState;

  const getLinea = (idLinea) => {
    return lineas.find((x) => x.id === idLinea);
  };

  //Guardo las lineas en la funciona q recibo por props.
  const guardar = () => {
    let arrayLineas = [];
    if (getValues("idLinea1") > 0) {
      if (diariolineaPuestoId1 == 0) {
        openNotificationUI("Debe seleccionar un Puesto Diario", "warning");
        return;
      }
      if (consumolineaPuestoId1 == 0) {
        openNotificationUI("Debe seleccionar un puesto de consumo", "warning");
        return;
      }
      const linea = getLinea(getValues("idLinea1"));
      const termo: LineasTermoformado = {
        linea,
        diarioLineaPuestoId: diariolineaPuestoId1,
        consumoLineaPuesto: consumolineaPuestoId1
      };
      console.log(lineasSeleccionadas.length);
      if (lineasSeleccionadas.length == 0) {
        setLineasSeleccionadas([...lineasSeleccionadas, termo]);
        setPuestos1([]);
        setPuestos2([]);
        setDiariolineaPuestoId1(0);
        setConsumolineaPuestoId1(0);
        reset();
      } else {
        setLineasSeleccionadas([...lineasSeleccionadas, termo]);
        arrayLineas = [...lineasSeleccionadas, termo];
        console.log(lineasSeleccionadas);
        console.log(arrayLineas);
        setearLineasFuncion(arrayLineas);
        setOpenModal(false);
      }
    }
    // if (getValues("idLinea1") > 0) arrayLineas.push(getLinea(getValues("idLinea1")));
    // else arrayLineas.push(null);
    // if (getValues("idLinea2") > 0) arrayLineas.push(getLinea(getValues("idLinea2")));
    // else arrayLineas.push(null);
    // setearLineasFuncion(arrayLineas);
    // setOpenModal(false);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(guardar)} style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          {/* ------------------------------------- Linea1 --------------------------------------------------------/ */}
          <div style={{ padding: 10 }}>
            <Controller
              name="idLinea1"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione una linea"
                    variant="standard"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (diariolineaPuestoId1 != 0) setDiariolineaPuestoId1(0);
                      getPuestosByLinea(e.target.value, 1);
                    }}
                    /* onClick={() => guardarLinea("linea1")} */
                  >
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          {/* ------------------------------------- Seleccion del Puesto Diario de la Linea 1 --------------------------------------------------------/ */}
          {puestos1.length > 0 && (
            <div style={{ padding: 10 }}>
              <Controller
                name="diariolineaPuestoId1"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione el Puesto a tomar el diario de la Linea 1</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un Puesto"
                      variant="standard"
                      onChange={(e) => {
                        if (e.target.value == consumolineaPuestoId1) {
                          openNotificationUI("Los Puestos no pueden ser Iguales", "warning");
                          return;
                        }
                        field.onChange(e.target.value);
                        setDiariolineaPuestoId1(+e.target.value);
                      }}>
                      {puestos1 &&
                        puestos1.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.puesto.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          )}
          {/* ------------------------------------- Linea 2 (Para el puesto de consumo) --------------------------------------------------------/ */}
          {diariolineaPuestoId1 > 0 && (
            <div style={{ padding: 10 }}>
              <Controller
                name="idLinea2"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione la Linea para el consumo</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una linea"
                      variant="standard"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (consumolineaPuestoId1 != 0) setConsumolineaPuestoId1(0);
                        getPuestosByLinea(e.target.value, 2);
                      }}
                      /* onClick={() => guardarLinea("linea1")} */
                    >
                      {lineas &&
                        lineas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          )}

          {/* ------------------------------------- Seleccion del Puesto de Consumo de la Linea 1 --------------------------------------------------------/ */}
          {puestos2.length > 0 && (
            <div style={{ padding: 10 }}>
              <Controller
                name="consumoLineaPuestoId1"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione el Puesto </InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un Puesto"
                      variant="standard"
                      onChange={(e) => {
                        if (e.target.value == diariolineaPuestoId1) {
                          openNotificationUI("Los Puestos no pueden ser Iguales", "warning");
                          return;
                        }
                        field.onChange(e.target.value);
                        setConsumolineaPuestoId1(+e.target.value);
                      }}>
                      {puestos2 &&
                        puestos2.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.puesto.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          )}
          {/* ------------------------------------- Linea2 --------------------------------------------------------/ 
          <div style={{ padding: 10 }}>
            <Controller
              name="idLinea2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea</InputLabel>
                  <Select
                    {...field}
                    placeholder="Seleccione una linea para el puesto de consumo"
                    variant="standard"                    
                  >
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          */}
          <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              ABRIR
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
