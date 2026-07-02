import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { TableOfEtiquetasFijas } from "../components/TableOfEtiquetasFijas";
import { ZPL_EtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetaFijaSlice";
import { IZPL_EtiquetaFija } from "app/models/IZPL_EtiquetaFija";

interface props {
  setOpenPopup: any;
  callback: any; //Refresca el select2 de Modelos. etiquetas fijas.
}
export const CargaEtiquetasHibridasForm = ({ setOpenPopup, callback }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    ZPL_TipoEtiquetasId: number;
    modelo: string;
    zpl: string;
    tipoUnidad: string;
    modelosId: number;
    id: number;
    preFijo: string;
  }
  const initialStateVar = {
    ZPL_TipoEtiquetasId: 0,
    modelo: "",
    zpl: "",
    tipoUnidad: "",
    modelosId: 0,
    id: 0,
    preFijo: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    getListTipoEtiquetas();
    getListModelos();
    getEtiquetasFijas(); //Trae las etiquetasFijas para el listado.
  }, []);

  const { isDirty, isValid, errors } = formState;

  const loginSubmit = async (e) => {
    console.log(e);
    let result;
    try {
      if (etiquetaFijaEditar)
        result = await dispatch(ZPL_EtiquetaFijaSliceRequests.putRequest(JSON.parse(JSON.stringify(e))));
      else result = await dispatch(ZPL_EtiquetaFijaSliceRequests.postRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente ", "success");
      callback(true); //Refresca el select2 de "etiqueta Fija"
      getEtiquetasFijas(); //refresco el listado.
      limpiarCampos();
    }
  };

  const [tipoEtiquetas, setTipoEtiquetas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  const getListTipoEtiquetas = async () => {
    const result = unwrapResult(await dispatch(ZPL_TipoEtiquetasSliceRequests.getListByEstadoRequest("hibrido")));
    if (result) setTipoEtiquetas(result);
  };

  //Trae todos los modelos de PlanProd. Retorna PlanProd[]. Pero solo me interesa el codigoModelo y IdModelo.
  const getListModelos = async () => {
    let result = unwrapResult(await dispatch(PlanProdSliceRequests.getListByGroupByModelosRequest()));
    if (result) {
      let i = 0;
      //Le agrego un idGenerico por que tira error en consola
      result = result.map((x) => {
        i += 1;
        return { ...x, idAux: i };
      });
      setModelos(result);
    }
  };

  const filtrarModelos = () => {
    let models = [...modelos];
    models = models.filter((x) => x.tipoUnidad == getValues("tipoUnidad")); //Filtro los modelos por tipo de unidad.
    setModelosFiltrados(models);
  };

  //Cada vez que cambia el modelo, almaceno el codigo del modelo en el campo modelo de ZPL_EtiquetaFija.
  const handleChangeModelo = () => {
    const modeloSeleccionado = modelosFiltrados.find((x) => x.idModelo == getValues("modelosId"));
    setValue("modelo", modeloSeleccionado.codigoModelo);
  };

  const [listEtiquetasFijas, setListEtiquetasFijas] = useState([]);

  const getEtiquetasFijas = async () => {
    let result = unwrapResult(await dispatch(ZPL_EtiquetaFijaSliceRequests.getAllRequest()));
    result = result.filter((z) => z.zpL_TipoEtiquetas.estado == "hibrido");
    setListEtiquetasFijas(result);
  };

  const [etiquetaFijaEditar, setEtiquetaFijaEditar] = useState(null);

  useEffect(() => {
    if (etiquetaFijaEditar) {
      cargarDatosParaEditar(etiquetaFijaEditar);
    }
  }, [etiquetaFijaEditar]);

  const cargarDatosParaEditar = (objetoEtiquetaFija: IZPL_EtiquetaFija) => {
    setValue("ZPL_TipoEtiquetasId", objetoEtiquetaFija.zpL_TipoEtiquetasId);
    setValue("tipoUnidad", objetoEtiquetaFija.tipoUnidad);
    setValue("zpl", objetoEtiquetaFija.zpl);
    filtrarModelos();
    setValue("id", objetoEtiquetaFija.id);
    setValue("modelo", objetoEtiquetaFija.modelo);
    setValue("preFijo", objetoEtiquetaFija.preFijo);
  };

  useEffect(() => {
    if (etiquetaFijaEditar) {
      const result = modelosFiltrados.find((x) => x.idModelo == etiquetaFijaEditar.modelosId);
      setValue("modelosId", etiquetaFijaEditar.modelosId);
    }
  }, [modelosFiltrados]);

  const limpiarCampos = () => {
    setValue("ZPL_TipoEtiquetasId", 0);
    setValue("tipoUnidad", "");
    setValue("zpl", "");
    setValue("modelosId", 0);
    setValue("id", 0);
    setValue("modelo", "");
    setEtiquetaFijaEditar(null);
    setValue("preFijo", "");
  };

  const eliminarEtiquetaFija = async (idEtiquetaFija) => {
    const result = unwrapResult(await dispatch(ZPL_EtiquetaFijaSliceRequests.deleteRequest(idEtiquetaFija)));
    if (result) {
      openNotificationUI("Registro eliminado exitosamente :)", "success");
      callback(true); //Refresca el select2 de "etiqueta Fija"
      getEtiquetasFijas(); //refresco el listado.
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-4 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <div>
              <Controller
                name="ZPL_TipoEtiquetasId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo Etiqueta</InputLabel>
                    <Select {...field} variant="standard">
                      {tipoEtiquetas &&
                        tipoEtiquetas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcionTipoEtiqueta}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />{" "}
            </div>
            <div>
              <Controller
                name="tipoUnidad"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo Unidad</InputLabel>
                    <Select {...field} variant="standard" onClick={filtrarModelos}>
                      {["I", "E"].map((x) => (
                        <MenuItem key={x} value={x}>
                          <div className="w-full">
                            <div>{x}</div>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <Controller
              name="modelosId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Modelo</InputLabel>
                  <Select {...field} variant="standard" onClick={handleChangeModelo}>
                    {modelosFiltrados &&
                      modelosFiltrados.map((x) => (
                        <MenuItem key={x.idModelo} value={x.idModelo}>
                          <div className="w-full">
                            <div>{x.codigoModelo}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="preFijo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField id="outlined-multiline-flexible" {...field} label="Pre fijo" />
                </FormControl>
              )}
            />
          </div>
          <div>
            <Controller
              name="zpl"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField id="outlined-multiline-flexible" {...field} label="Codigo ZPL" multiline maxRows={6} />
                </FormControl>
              )}
            />
          </div>
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
            <Button
              onClick={limpiarCampos}
              className={classes.purpleButton}
              type="button"
              variant="contained"
              disabled={etiquetaFijaEditar == null}>
              Limpiar
            </Button>
          </div>
        </div>
      </form>
      <TableOfEtiquetasFijas
        listEtiquetasFijas={listEtiquetasFijas}
        setEtiquetaFijaEditar={setEtiquetaFijaEditar}
        callbackEliminar={eliminarEtiquetaFija}></TableOfEtiquetasFijas>
    </div>
  );
};
