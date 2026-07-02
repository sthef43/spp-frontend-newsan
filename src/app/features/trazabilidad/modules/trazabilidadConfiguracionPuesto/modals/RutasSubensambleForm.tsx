import { Delete } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { MapasRutasCamposSliceRequest } from "app/Middleware/reducers/MapasRutasCamposSlice";
import { MapasRutasSliceRequest } from "app/Middleware/reducers/MapasRutasSlice";
import { SubensambleSPPSliceRequests } from "app/Middleware/reducers/SubensambleSlice";
import { SubTipoDetalleSliceRequests } from "app/Middleware/reducers/SubTipoDetalleSlice";
import { useAppDispatch } from "app/core/store/store";
import { IFamilia } from "app/models/IFamilia";
import { IMapasRutas } from "app/models/IMapasRutas";
import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  setOpenPopup: any;
  refresh: any;
  campo: IMapasRutasCampos | null;
  mapaRuta: IMapasRutas | null;
  familia: IFamilia;
  puestoId: number;
  lineaId: number;
}
export const RutasSubensambleForm = ({ lineaId, puestoId, setOpenPopup, refresh, campo, mapaRuta, familia }: props) => {
  interface initialState {
    subTipoId: string;
    subTipoDetalleId: number;
    lineaProduccionId: number;
    ruta: number;
    puesto: number;
    validarSemielaborado: boolean;
    nombreSemielaborado: string;
  }
  const initialStateVar = {
    subTipoId: "Ninguno",
    subTipoDetalleId: null,
    lineaProduccionId: null,
    ruta: 0,
    puesto: null,
    validarSemielaborado: null,
    nombreSemielaborado: null
  };
  console.log(campo);
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const { control, getValues, setValue, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { openNotificationUI } = useNotificationUI();
  const [listOfDetalles, setListOfDetalles] = useState([]);
  const [rutas, setRutas] = useState(null);
  const [rutaAVerificar, setRutaAVerificar] = useState([]);
  const [validar, setValidar] = useState(false);
  const [puestos, setPuestos] = useState(null);
  const [subensamble, setSubensamble] = useState([]);
  const [count, setCount] = useState(1);
  const [lineaProd, setLineaProd] = useState([]);
  const [validarSemi, setValidarSemi] = useState([]);
  const { isDirty, isValid, errors } = formState;
  const onGetAllSubDetalles = async () => {
    try {
      const response = unwrapResult(await dispatch(SubTipoDetalleSliceRequests.getAllRequest()));
      console.log(response);
      if (response) {
        setListOfDetalles(response);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getRutas = async () => {
    let rutasResult;
    try {
      rutasResult = unwrapResult(
        await dispatch(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId(getValues("lineaProduccionId")))
      );
    } catch (e) {
      rutasResult = null;
    }
    if (rutasResult) {
      rutasResult = JSON.parse(JSON.stringify(rutasResult));
      setRutas(rutasResult);
      setValue("ruta", rutasResult.rutasId);
    }
  };
  const getPuestosByRuta = async () => {
    let mapasRutas;
    try {
      mapasRutas = unwrapResult(await dispatch(MapasRutasSliceRequest.getAllRequest())); //traigo todos los mapas rutas
      let puestosFilter = mapasRutas.filter((x) => x.rutasId == rutas.rutasId); //Filtro por la ruta que selecciono
      if (getValues("lineaProduccionId") == lineaId) {
        puestosFilter = puestosFilter.filter((p) => p.desdePuestoId != puestoId);
      }
      if (puestosFilter) {
        setPuestos(JSON.parse(JSON.stringify(puestosFilter)));
      }
    } catch (e) {
      console.log("error" + e);
    }
  };
  const getLineasProd = async () => {
    let lineaProdResult;
    try {
      lineaProdResult = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getAllByProductId(familia.productoId))
      );
      if (lineaProdResult) {
        setLineaProd(JSON.parse(JSON.stringify(lineaProdResult)));
      }
    } catch (e) {
      console.log("error" + e);
    }
  };
  const onHandlerAddSemi = () => {
    console.log("Entre a agregar");
    const addValidarSemi = { mapasRutasCamposId: campo.id, valor: getValues("nombreSemielaborado") };
    setValidarSemi([...validarSemi, addValidarSemi]);
    setValue("nombreSemielaborado", "");
    console.log(validarSemi);
  };
  const onAddRutaVer = () => {
    const lineaProduccion = lineaProd.find((f) => f.id == getValues("lineaProduccionId"));
    const puestoNombre = puestos.find((p) => p.desdePuestoId == getValues("puesto"));
    setCount(count + 1);
    const validacion = rutaAVerificar.find((r) => r.puesto.desdePuesto.id == getValues("puesto"));
    if (validacion) {
      openNotificationUI("Seleccione otro puesto", "error");
    } else {
      const rutaAdd = { id: count, lineaProduccion: lineaProduccion, ruta: rutas, puesto: puestoNombre };
      const rutaAdd2 = {
        mapasRutasId: puestoNombre.id,
        mapasRutasCamposId: campo.id,
        puestoId: puestoNombre.desdePuestoId,
        lineaProduccionId: lineaProduccion.id,
        rutasId: rutas.rutas.id
      };
      console.log(rutaAdd2);
      console.log(rutaAdd);
      setRutaAVerificar([...rutaAVerificar, rutaAdd]);
      setSubensamble([...subensamble, rutaAdd2]);
    }
  };
  const onAddSubensamble = async () => {
    try {
      debugger;
      let externo = false;
      let objectSubmit: IMapasRutasCampos | null = null;
      if (subTipoWatch == "Externo") externo = true;
      if (subTipoWatch == "Ninguno") {
        objectSubmit = {
          id: campo.id,
          mapasRutasId: campo.mapasRutasId,
          expRegularValoresId: campo.expRegularValoresId,
          subTipoDetalleId: null,
          validarSemiValor: null,
          validarSemi: false,
          subensambleSPP: null,
          externo: externo,
          nombre: campo.nombre,
          orden: campo.orden,
          persiste: null,
          serie: campo.serie,
          expRegular: campo.expRegular,
          createdDate: campo.createdDate,
          identificador: campo.identificador,
          validarCalidad: campo.validarCalidad,
          validarBatea: campo.validarBatea,
          autoGenerado: campo.autoGenerado
        };
        campo.subensambleSPP.forEach((s) => {
          deleteSubemsamble(s.id);
        });
      } else {
        objectSubmit = {
          id: campo.id,
          mapasRutasId: campo.mapasRutasId,
          expRegularValoresId: campo.expRegularValoresId,
          subTipoDetalleId: getValues("subTipoDetalleId"),
          validarSemiValor: validarSemi,
          validarSemi: getValues("validarSemielaborado"),
          subensambleSPP: subensamble,
          externo: externo,
          nombre: campo.nombre,
          orden: campo.orden,
          persiste: campo.persiste,
          serie: campo.serie,
          expRegular: campo.expRegular,
          createdDate: campo.createdDate,
          identificador: campo.identificador,
          validarCalidad: campo.validarCalidad,
          validarBatea: campo.validarBatea,
          autoGenerado: campo.autoGenerado
        };
      }
      const response = await dispatch(MapasRutasCamposSliceRequest.NestedUpdateRequest(objectSubmit));
      if (response) {
        setOpenPopup(false);
        refresh();
        openNotificationUI("Se agrego el subensamble correctamente", "success");
      }
      console.log(objectSubmit);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const deleteSubemsamble = async (id) => {
    try {
      const deleteSubPP = await dispatch(SubensambleSPPSliceRequests.deleteRequest(id));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handlerSubDelete = async (ruta) => {
    const confirm = await getConfirmation(
      "Eliminar",
      "Esta seguro que quiere eliminar le verificacion permanentemente?"
    );
    if (confirm) {
      const newRuta = rutaAVerificar.filter((r) => r.id != ruta.id);
      if (campo) deleteSubemsamble(ruta.id);
      const newRuta2 = subensamble.filter((r) => r.puestoId != ruta.puesto.desdePuesto.id);
      if (newRuta.length == 0) {
        setRutaAVerificar([]);
        setSubensamble([]);
      } else {
        setRutaAVerificar(newRuta);
        setSubensamble(newRuta2);
      }
    }
  };
  const subTipoWatch = watch("subTipoId");
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  useEffect(() => {
    getLineasProd();
    onGetAllSubDetalles();
  }, []);
  useEffect(() => {
    if (rutas) getPuestosByRuta();
  }, [rutas]);
  useEffect(() => {
    if (getValues("subTipoId") == "Externo") {
      setRutaAVerificar([]);
      setSubensamble([]);
    } else if (getValues("subTipoId") == "SPP") {
      setValidarSemi([]);
      setValidar(false);
      setValue("validarSemielaborado", false);
    } else {
      setValidarSemi([]);
      setValidar(false);
      setValue("validarSemielaborado", false);
      setRutaAVerificar([]);
      setSubensamble([]);
    }
  }, [getValues("subTipoId")]);
  useEffect(() => {
    if (campo.externo) {
      setValue("subTipoId", "Externo");
      setValue("subTipoDetalleId", campo.subTipoDetalleId);
    } else if (campo.subensambleSPP.length != 0) {
      setValue("subTipoId", "SPP");
      const newSubemsable = campo.subensambleSPP.map((c) => {
        const rutaEdit = {
          id: c.id,
          lineaProduccion: c.lineaProduccion,
          ruta: { rutas: c.rutas },
          puesto: { desdePuesto: c.puesto }
        };
        return rutaEdit;
      });
      setRutaAVerificar(newSubemsable);
      setSubensamble(campo.subensambleSPP);
    }
    if (campo.validarSemi) {
      setValidar(true);
      setValidarSemi(campo.validarSemiValor);
      setValue("validarSemielaborado", true);
    }
  }, []);
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <form style={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onAddSubensamble)}>
        <div className="flex flex-col" style={{ height: "100%", margin: "20px" }}>
          <Controller
            name="subTipoId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Tipo de subensamble</InputLabel>
                <Select {...field} variant="standard">
                  <MenuItem value="Ninguno">
                    <div className="w-full">
                      <div>Ninguno</div>
                    </div>
                  </MenuItem>
                  <MenuItem value="SPP">
                    <div className="w-full">
                      <div>SPP</div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Externo">
                    <div className="w-full">
                      <div>Externo</div>
                    </div>
                  </MenuItem>
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          {subTipoWatch != "Ninguno" && subTipoWatch == "Externo" && (
            <div>
              <Controller
                name="subTipoDetalleId"
                control={control}
                rules={{ required: true }}
                defaultValue={null}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error} className="mt-3">
                    <InputLabel>Seleccione el tipo de externo</InputLabel>
                    <Select {...field} variant="standard" className="mt-2">
                      {listOfDetalles &&
                        listOfDetalles.map((x) => (
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
              <FormControlLabel
                label="Validar semielaborado?*"
                control={
                  <Controller
                    name={"validarSemielaborado"}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <Checkbox
                        className="mt-3"
                        checked={validar}
                        onClick={() => {
                          setValidar(!validar);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
          )}
          {getValues("validarSemielaborado") == true && subTipoWatch == "Externo" && (
            <div className="mt-2">
              <div className="flex ">
                <Controller
                  name="nombreSemielaborado"
                  control={control}
                  defaultValue={null}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Valor</InputLabel>
                      <Input {...field} className="col-8" />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
                <div className="col-4">
                  <Button
                    className={classes.blueButton}
                    type="button"
                    variant="contained"
                    onClick={onHandlerAddSemi}
                    disabled={!isDirty && !isValid}>
                    Agregar
                  </Button>
                </div>
              </div>
              <ul className="mt-2">
                {validarSemi &&
                  validarSemi.map((x) => (
                    <MenuItem key={x.valor} value={x} divider={true}>
                      <div className="flex justify-around w-full">
                        <div className="m-auto">
                          <h3>{x.valor}</h3>
                        </div>
                        <div>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => {
                                const newValidar = validarSemi.filter((v) => v != x);
                                if (newValidar.length == 0) {
                                  setValidarSemi([]);
                                } else {
                                  setValidarSemi(newValidar);
                                }
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </MenuItem>
                  ))}
              </ul>
            </div>
          )}
          {subTipoWatch == "SPP" && (
            <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
              <div className="w-full text-textColor text-xl mt-3 text-center">Configuración de la ruta a verificar</div>
              <div>
                {lineaProd && (
                  <Controller
                    name="lineaProduccionId"
                    control={control}
                    defaultValue={null}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Linea de producción</InputLabel>
                        <Select {...field} variant="standard" onClick={() => getRutas()}>
                          {lineaProd &&
                            lineaProd.map((x) => (
                              <MenuItem key={x.id} value={x.id} divider={true}>
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
                )}
              </div>
              <div>
                {rutas && (
                  <Controller
                    name="ruta"
                    control={control}
                    defaultValue={null}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Ruta</InputLabel>
                        <Select {...field} variant="standard" disabled>
                          {rutas && (
                            <MenuItem key={rutas.rutasId} value={rutas.rutasId}>
                              <div className="w-full">
                                <div>{rutas.rutas.nombre}</div>
                              </div>
                            </MenuItem>
                          )}
                        </Select>
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                )}
              </div>
              <div>
                {puestos && (
                  <Controller
                    name="puesto"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Seleccione un puesto</InputLabel>
                        <Select {...field} variant="standard">
                          {puestos &&
                            puestos.map((x) => (
                              <MenuItem key={x.id} value={x.desdePuesto.id}>
                                <div className="w-full">
                                  <div>{x.desdePuesto.nombre}</div>
                                </div>
                              </MenuItem>
                            ))}
                        </Select>
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                )}
                {puestos && (
                  <div className="pt-1 flex justify-around mt-2" style={{ flex: "1 1 10%" }}>
                    <Button
                      className={classes.blueButton}
                      type="button"
                      variant="contained"
                      onClick={() => onAddRutaVer()}
                      disabled={!isDirty && !isValid}>
                      Agregar
                    </Button>
                  </div>
                )}
              </div>
              <hr />
              <ul>
                {rutaAVerificar &&
                  rutaAVerificar?.map((ruta) => (
                    <MenuItem key={ruta.id} value={ruta.id} divider={true}>
                      <div className="w-full flex justify-between">
                        <div className="m-auto">Linea de producción : {ruta.lineaProduccion.nombre}</div>
                        <div className="m-auto">Ruta: {ruta.ruta.rutas.nombre}</div>
                        <div className="m-auto">Puesto: {ruta.puesto.desdePuesto.nombre}</div>
                        <div>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => {
                                handlerSubDelete(ruta);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </MenuItem>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button
            className={classes.greenButton}
            type="submit"
            variant="contained"
            disabled={(!isDirty && !isValid) || subTipoWatch == null}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
