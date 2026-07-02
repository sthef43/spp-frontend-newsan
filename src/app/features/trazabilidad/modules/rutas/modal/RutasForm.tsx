import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Select,
  MenuItem,
  IconButton,
  FormLabel
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IRutas } from "app/models/IRutas";
// import { PuestoSliceRequests } from "app/Middleware/reducers/PuestoSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Delete } from "@mui/icons-material";
// import { unwrapResult } from "@reduxjs/toolkit";
import { RutasSliceRequest } from "app/Middleware/reducers/RutasSlice";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { IPuesto } from "app/models/IPuesto";
interface props {
  setOpenPopup: any;
  editState?: IRutas | null;
  refresh?: any;
  soloVista?: boolean;
  addPuesto?: IPuesto[];
  lineaProduccionId: number;
}
export const RutasForm = ({ lineaProduccionId, setOpenPopup, editState, refresh, soloVista, addPuesto }: props) => {
  console.log(editState);
  const classes = MaterialButtons();
  interface initialState {
    nombre: string;
    descripcion: string;
    desdePuestoId: number;
    hastaPuestoId: number;
    orden: number;
    esUltimo: boolean;
  }
  const initialStateVar = {
    nombre: "",
    descripcion: "",
    desdePuestoId: 0,
    hastaPuestoId: 0,
    orden: 1,
    esUltimo: false
  };
  console.log(soloVista);
  const dispatch = useAppDispatch();
  const [rutas, setRutas] = useState([]);
  const [data, setData] = useState([]);
  const [orden, setOrden] = useState(0);
  const [eligio, setEligio] = useState(false);
  // const [puestosMain, setPuestosMain] = useState([]);
  const [puestos, setPuestos] = useState(addPuesto);
  const [puestos2, setPuestos2] = useState(addPuesto);
  const [rutasPost, setRutasPost] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [editando, setEditando] = useState(false);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editState || initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  React.useEffect(() => {
    if (rutas?.length > 0) {
      setData(rutas);
    }
  }, [rutas]);
  const setRow = (row) => {
    const deleteRutas = rutas.filter((r) => r.id != row.id);
    if (deleteRutas.length === 0) {
      setEligio(false);
      setPuestos(addPuesto);
      setPuestos2(addPuesto);
      setData([]);
      setRutas([]);
      setOrden(0);
    } else {
      const getPuesto = addPuesto.find((p) => p.nombre == row.desde);
      console.log(getPuesto);
      setRutas(deleteRutas);
    }
    console.log(data);
  };
  const addRutas = async (e) => {
    let result;
    try {
      if (editState) {
        const rutaEdit = {
          id: editState.id,
          nombre: getValues("nombre"),
          descripcion: getValues("descripcion")
        };
        result = await dispatch(RutasSliceRequest.PutRequest(rutaEdit));
      } else {
        const ultPuestoId = rutasPost[rutasPost.length - 1].hastaPuestoId;
        const ultimoPuesto = {
          desdePuestoId: ultPuestoId,
          hastaPuestoId: ultPuestoId,
          orden: orden,
          rutaId: 0,
          esUltimo: true
        };
        const post = [...rutasPost, ultimoPuesto];
        const ruta = {
          rutasId: 0,
          lineaProduccionId: lineaProduccionId,
          rutas: {
            nombre: getValues("nombre"),
            descripcion: getValues("descripcion"),
            mapasRutas: post
          }
        };
        result = await dispatch(LineaProduccionRutasSliceRequest.NestedAddRequest(ruta));
      }
    } catch (x) {
      result = null;
      console.log(x);
      openNotificationUI("Occurrio un error", "error");
    }
    if (result) {
      openNotificationUI("Se agrego la ruta correctamente", "success");
      setOpenPopup(false);
      refresh();
    }
  };
  const filterPuestos = (dId, hId) => {
    if (data.length == 0) {
      const filtro3 = puestos.filter((f) => f.id !== dId);
      const filtro4 = puestos2.filter((f) => f.id !== dId && f.id !== hId);
      setPuestos(filtro3);
      setPuestos2(filtro4);
      setEligio(true);
    } else {
      const filtro = puestos.filter((f) => f.id !== dId);
      const filtro2 = puestos2.filter((f) => f.id !== hId);
      setPuestos(filtro);
      setPuestos2(filtro2);
    }
    setValue("desdePuestoId", hId);
    setValue("hastaPuestoId", 0);
  };
  const agregarRuta = () => {
    const desdeId = getValues("desdePuestoId");
    const hastaId = getValues("hastaPuestoId");
    if (desdeId == 0 || hastaId == 0) {
      openNotificationUI("No se puede agregar un puesto vacio", "error");
    } else {
      if (desdeId == hastaId) {
        openNotificationUI("No se pueden seleccionar dos puestos iguales", "error");
      } else {
        const desde = addPuesto.find((p) => p.id == desdeId);
        const hasta = addPuesto.find((p) => p.id == hastaId);
        filterPuestos(desdeId, hastaId);
        console.log(hastaId, desdeId);
        setOrden(orden + 1);
        const ojb = {
          desdePuestoId: desdeId,
          hastaPuestoId: hastaId,
          orden: orden,
          rutaId: 0,
          esUltimo: false
        };
        setRutasPost([...rutasPost, ojb]);
        console.log(desde, hasta);
        const rutasAdd = {
          id: orden,
          desde: desde.nombre,
          hasta: hasta.nombre
        };
        setRutas([...rutas, rutasAdd]);
        console.log(rutas);
      }
    }
  };

  useEffect(() => {
    if (editState) {
      setEligio(true);
      setEditando(true);
      console.log(editState);
      const editData = editState.mapasRutas?.map((puestos) => {
        return {
          id: puestos.orden,
          desde: puestos.desdePuesto.nombre,
          hasta: puestos.hastaPuesto.nombre,
          orden: puestos.orden
        };
      });
      console.log(editData);
      setData(editData);
    }
    return () => {
      setEligio(false);
      setEditando(false);
    };
  }, []);
  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(addRutas)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Nombre</InputLabel>
                  <Input {...field} readOnly={soloVista} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="descripcion"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Descripción</InputLabel>
                  <Input {...field} readOnly={soloVista} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <FormLabel>Eliga los puestos: </FormLabel>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "40%" }}>
                <Controller
                  name="desdePuestoId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Desde</InputLabel>
                      <Select {...field} variant="standard" disabled={eligio}>
                        {puestos &&
                          puestos.map((x) => (
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
              <div style={{ width: "40%" }}>
                <Controller
                  name="hastaPuestoId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Hasta</InputLabel>
                      <Select {...field} variant="standard" disabled={editando}>
                        {puestos2 &&
                          puestos2.map((x) => (
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
            </div>
            <div className="pt-1 pb-3 flex justify-around " style={{ flex: "1 1 10%" }}>
              <Button
                className={classes.blueButton}
                type="button"
                variant="contained"
                onClick={agregarRuta}
                disabled={editando}>
                Agregar ruta
              </Button>
            </div>
            <div className="my-2 mx-4 h-full">
              <TableComponent
                IDcolumn={"id"}
                columns={[
                  {
                    title: "Desde ",
                    field: "desde"
                  },
                  {
                    title: "Hasta ",
                    field: "hasta"
                  },
                  {
                    title: "Acciones",
                    field: "",
                    render: (row) => {
                      return (
                        <div className="flex w-full justify-end sm:justify-start gap-4">
                          <IconButton
                            onClick={() => {
                              setRow(row);
                            }}
                            size="small"
                            disabled={editando}
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                          <div></div>
                        </div>
                      );
                    }
                  }
                ]}
                dataInfo={data}
              />
            </div>
          </div>
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button
              className={classes.greenButton}
              type="submit"
              variant="contained"
              disabled={(!isDirty && !isValid) || soloVista}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
