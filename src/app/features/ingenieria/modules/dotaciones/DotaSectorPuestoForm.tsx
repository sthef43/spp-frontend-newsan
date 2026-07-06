import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IPlant } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDotaSector } from "app/models/IDotaSector";
import { DotaSectorSliceRequests } from "app/features/ingenieria/slices/DotaSectorSlice";
import { IDotaPuesto } from "app/models/IDotaPuesto";
import { DotaPuestoSliceRequests } from "app/features/ingenieria/slices/DotaPuestoSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IDotaFamilia } from "app/models/IDotaFamilia";
import { DotaFamiliaSliceRequests } from "app/features/ingenieria/slices/DotaFamiliaSlice";
import { SectorAndPuestosSelected } from "./SectorAndPuestosSelected";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";
import { DotaFamiliaLineaProduccionSliceRequests } from "app/Middleware/reducers/DotaFamiliaLineaProduccionSlice";
import { Typography } from "@mui/material";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { DotaSectorPuestoSliceRequests } from "app/features/ingenieria/slices/DotaSectorPuestoSlice";

//dotaFamiliaLineaProduccion: Es para cuando necesito editar la dotacion, tiene la informacion de los puestos asignados con los sectores.
export const DotaSectorPuestoform = ({ setOpenModal, refresh }: any) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [plantas, setPlantas] = useState<IPlant[]>();
  const [listDotaSector, setListDotaSector] = useState<IDotaSector[]>();
  const [listDotaPuesto, setListDotaPuesto] = useState<IDotaPuesto[]>();
  const [lineas, setLineas] = useState<ILineaProduccion[]>();
  const [listDotaFamilia, setListDotaFamilia] = useState<IDotaFamilia[]>();
  const [arraySectoresPuestos, setArraySectoresPuestos] = useState<IDotaSectorPuesto[]>([]);
  const [totalLinea, setTotalLinea] = useState(0);

  interface initialState {
    plantId: number;
    cantidad: number;
    vigente: boolean;
    dotaSectorId: number;
    dotaPuestoId: number;
    dotaFamiliaLineaProduccionId: number;
    lineaProduccionId: number;
    dotaFamiliaId: number;
  }

  const initialStateVar = {
    plantId: 0,
    cantidad: 0,
    vigente: true,
    dotaSectorId: 0,
    dotaPuestoId: 0,
    dotaFamiliaLineaProduccionId: 0,
    lineaProduccionId: 0,
    dotaFamiliaId: 0
  };

  const getLineas = async () => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlanta)));
    if (result) setLineas(result);
    else setLineas([]);
  };

  const { control, handleSubmit, watch, formState, getValues } = useForm<initialState>({
    //defaultValues: dotaFamiliaLineaProduccion != null ? dotaFamiliaLineaProduccion : initialStateVar
    defaultValues: initialStateVar
  });

  const { isDirty, isValid } = formState;

  const watchPlanta = watch("plantId");
  const watchSector = watch("dotaSectorId");
  const watchLinea = watch("lineaProduccionId");
  const watchFamilia = watch("dotaFamiliaId");

  useEffect(() => {
    getPlantas();
    getListDotaFamiliaByLineaProduccionId();
  }, []);

  useEffect(() => {
    if (watchSector != 0) {
      getListDotaPuestoBySector();
    }
  }, [watchSector]);

  useEffect(() => {
    if (watchLinea != 0) {
      getListDotaFamiliaByLineaProduccionId();
    }
  }, [watchLinea]);

  useEffect(() => {
    if (watchPlanta != 0) {
      getLineas();
      getListDotaSectorByPlantId();
    }
  }, [watchPlanta]);

  useEffect(() => {
    if (arraySectoresPuestos && arraySectoresPuestos.length > 0) calcularTotalLinea();
  }, [arraySectoresPuestos]);

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
    else setPlantas([]);
  };

  //Traigo los sectores filtrado por planta
  const getListDotaSectorByPlantId = async () => {
    let result = unwrapResult(await dispatch(DotaSectorSliceRequests.getAllRequest()));
    if (result) {
      result = result.filter((x) => x.plantId == watchPlanta);
      setListDotaSector(result);
    }
  };

  const getListDotaPuestoBySector = async () => {
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.getAllRequest()));
    if (result) setListDotaPuesto(result.filter((x) => x.dotaSectorId == watchSector));
  };

  const getListDotaFamiliaByLineaProduccionId = async () => {
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.getAllRequest()));
    if (result) {
      setListDotaFamilia(result.filter((x) => x.lineaProduccionId == watchLinea));
    }
  };

  const puestoAgregado = (puestoSeleccionado: IDotaPuesto) => {
    for (let index = 0; index < arraySectoresPuestos.length; index++) {
      const sectorPuesto = arraySectoresPuestos[index];
      if (sectorPuesto.dotaPuestoId == puestoSeleccionado.id) return true;
    }

    return false;
  };

  //Agregar el sector con el puesto, en la tabla dotaSectorPuesto.
  const addSectorAndPuesto = () => {
    if (getValues("dotaSectorId") != 0 && getValues("dotaPuestoId") != 0 && getValues("cantidad") != 0) {
      const sectorSeleccionado: IDotaSector = listDotaSector.find((x) => x.id == getValues("dotaSectorId"));
      const puestoSeleccionado: IDotaPuesto = listDotaPuesto.find((x) => x.id == getValues("dotaPuestoId"));

      //Logica para no agregar 2 veces el mismo puesto.
      if (puestoAgregado(puestoSeleccionado)) {
        openNotificationUI("El puesto ya existe", "warning");
        return false;
      }

      const dotaSectorPuesto: IDotaSectorPuesto = {
        cantidad: getValues("cantidad"),
        dotaSector: sectorSeleccionado,
        dotaPuesto: puestoSeleccionado,
        dotaSectorId: sectorSeleccionado.id,
        dotaPuestoId: puestoSeleccionado.id
      };

      setArraySectoresPuestos([...arraySectoresPuestos, dotaSectorPuesto]);
    }
    calcularTotalLinea();
  };

  const calcularTotalLinea = () => {
    let sumaTotal = 0;
    for (let index = 0; index < arraySectoresPuestos.length; index++) {
      const sectorPuesto = arraySectoresPuestos[index];
      sumaTotal = sumaTotal + parseInt(sectorPuesto.cantidad.toString());
    }
    setTotalLinea(sumaTotal);
  };

  //PAra saber si completo la informacion antes de guardar.
  const verificarDatos = () => {
    if (getValues("lineaProduccionId") == 0 || getValues("dotaFamiliaId") == 0 || arraySectoresPuestos.length == 0) {
      openNotificationUI("Falta cargar datos", "warning");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    const puedeGuardar = verificarDatos(); //PAra saber si completo todos los campos antes de guardar.

    if (!puedeGuardar) return false;

    //Guardo la dotacion como trabajando
    const objectDotaFamiliaLineaProduccion: IDotaFamiliaLineaProduccion = {
      dotaFamiliaId: getValues("dotaFamiliaId"),
      lineaProduccionId: getValues("lineaProduccionId"),
      vigente: false,
      trabajando: true
    };

    const objectGuardadoDotaFamiliaLineaProduccion = await guardarDotaFamiliaLineaProduccion(
      objectDotaFamiliaLineaProduccion
    );

    const guardoCorrecto = await guardarDotaSectorPuesto(objectGuardadoDotaFamiliaLineaProduccion.id);
    if (guardoCorrecto) {
      openNotificationUI("guardado exitosamente", "success");
      setOpenModal(false);
      refresh(); //Refresca el listado principal de las dotaciones
    }
  };

  //Guardo todos los dotaSectorPuesto para ese dotaFamiliaLineaProduciconId
  const guardarDotaSectorPuesto = async (dotaFamiliaLineaProduccionId: number) => {
    //Guardo el dotaFamiliaLineaProduccionId en cada dotasectorPuesto. Son los puestos con los sectores que tiene asignada la dotacion.
    const newArray = arraySectoresPuestos.map((x) => {
      const object = {
        ...x,
        dotaFamiliaLineaProduccionId: dotaFamiliaLineaProduccionId,
        dotaPuesto: null,
        dotaSector: null
      };
      return object;
    });

    const result = unwrapResult(await dispatch(DotaSectorPuestoSliceRequests.multiPostRequest(newArray)));
    if (result) {
      return true;
    } else return false;
  };

  //Post de DotaFamiliaLineaProduccion
  const guardarDotaFamiliaLineaProduccion = async (objectDotaFamiliaLineaProduccion: IDotaFamiliaLineaProduccion) => {
    const result = unwrapResult(
      await dispatch(DotaFamiliaLineaProduccionSliceRequests.PostRequest(objectDotaFamiliaLineaProduccion))
    );
    if (result) {
      return result;
    } else return null;
  };

  //------------Logica para traer la estructura una vez que selecciona la linea y familia.
  useEffect(() => {
    if (watchLinea != 0 && watchFamilia != 0) {
      getDotaFamiliaLineaProduccionByLineaAndFamilia();
    }
  }, [watchLinea, watchFamilia]);

  const getDotaFamiliaLineaProduccionByLineaAndFamilia = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaFamiliaLineaProduccionSliceRequests.GetByFamiliaAndLinea({
          dotaFamiliaId: watchFamilia,
          lineaProduccionId: watchLinea
        })
      )
    );
    if (!result) {
      setExisteEstructura(false); //Si no existe estructura, puede seguir cargando datos y guardar informacion nueva.
      return false;
    } else {
      openNotificationUI("Ya existe una estructura. Valla a editarla.", "warning");
      setExisteEstructura(true); //Si existe estructura, no puede hacer nada, tiene que ir a editarla.
    }
  };
  const [existeEstructura, setExisteEstructura] = useState(false);
  return (
    <div style={{ width: "1500px" }}>
      <form onSubmit={handleSubmit(guardar)} className="flex flex-col justify-around p-6">
        <div className="flex justify-around m-4">
          <div style={{ width: "300px" }}>
            {plantas && (
              <Controller
                name="plantId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una planta</InputLabel>
                    <Select {...field} variant="standard" required={true} error={!!error?.types}>
                      {plantas?.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div style={{ width: "300px" }}>
            {lineas && lineas.length > 0 ? (
              <Controller
                name="lineaProduccionId"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una linea</InputLabel>
                    <Select {...field} variant="standard">
                      {lineas?.map((x) => (
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
            ) : (
              <TextField value="Sin lineas asignadas" disabled />
            )}
          </div>
          <div style={{ width: "300px" }}>
            {listDotaSector && (
              <Controller
                name="dotaFamiliaId"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una familia</InputLabel>
                    <Select {...field} variant="standard">
                      {listDotaFamilia?.map((x) => (
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
            )}
          </div>
        </div>
        <div className="flex justify-around m-4 p-4">
          <div style={{ width: "300px" }}>
            {listDotaSector && (
              <Controller
                name="dotaSectorId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un sector</InputLabel>
                    <Select {...field} variant="standard">
                      {listDotaSector?.map((x) => (
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
            )}
          </div>
          <div style={{ width: "300px" }}>
            {listDotaPuesto && (
              <Controller
                name="dotaPuestoId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un puesto</InputLabel>
                    <Select {...field} variant="standard">
                      {listDotaPuesto?.map((x) => (
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
            )}
          </div>
          <div>
            <Controller
              name="cantidad"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Cantidad"
                  label="Cantidad"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <Button className={classes.yellowButton} onClick={addSectorAndPuesto}>
              Add sector y puesto
            </Button>
          </div>
        </div>
        <SectorAndPuestosSelected
          arraySectoresPuestos={arraySectoresPuestos}
          setArraySectoresPuestos={setArraySectoresPuestos}
          refreshSectoresPuestos={null}
          onInit={null}
          editando={false}></SectorAndPuestosSelected>
        <div className="text-center p-8">
          <Typography variant="h4">Total Linea: {totalLinea}</Typography>
        </div>
        <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button
            className={classes.greenButton}
            type="submit"
            variant="contained"
            disabled={(!isDirty && !isValid) || existeEstructura}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
