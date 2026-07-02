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
import { DotaSectorSliceRequests } from "app/Middleware/reducers/DotaSectorSlice";
import { IDotaPuesto } from "app/models/IDotaPuesto";
import { DotaPuestoSliceRequests } from "app/Middleware/reducers/DotaPuestoSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IDotaFamilia } from "app/models/IDotaFamilia";
import { DotaFamiliaSliceRequests } from "app/Middleware/reducers/DotaFamiliaSlice";
import { SectorAndPuestosSelected } from "./SectorAndPuestosSelected";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";
import { DotaFamiliaLineaProduccionSliceRequests } from "app/Middleware/reducers/DotaFamiliaLineaProduccionSlice";
import { Typography } from "@mui/material";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { DotaSectorPuestoSliceRequests } from "app/Middleware/reducers/DotaSectorPuestoSlice";

interface props {
  dotaFamiliaLineaProduccion: IDotaFamiliaLineaProduccion;
  onInit: any;
}

//dotaFamiliaLineaProduccion: Es para cuando necesito editar la dotacion, tiene la informacion de los puestos asignados con los sectores.
export const DotaSectorPuestoformEdit = ({ dotaFamiliaLineaProduccion, onInit }: props) => {
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
    plantId: dotaFamiliaLineaProduccion.lineaProduccion.plantId,
    cantidad: 0,
    vigente: true,
    dotaSectorId: 0,
    dotaPuestoId: 0,
    dotaFamiliaLineaProduccionId: 0,
    lineaProduccionId: dotaFamiliaLineaProduccion.lineaProduccionId,
    dotaFamiliaId: dotaFamiliaLineaProduccion.dotaFamiliaId
  };

  const getLineasByPlanta = async (plantId: number) => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
    if (result) setLineas(result);
    else setLineas([]);
  };

  const { control, watch, getValues, setValue } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const watchSector = watch("dotaSectorId");
  const watchLinea = watch("lineaProduccionId");
  const watchFamilia = watch("dotaFamiliaId");

  useEffect(() => {
    getPlantas();
    getListDotaFamiliaByLineaProduccionId();
    setArraySectoresPuestos(dotaFamiliaLineaProduccion.dotaSectorPuesto); //Para que se muestren los sectores con los puestos
  }, []);

  const refreshSectoresPuestos = async () => {
    const result: IDotaFamiliaLineaProduccion = await getDotaFamiliaLineaProduccionByLineaAndFamilia();
    setArraySectoresPuestos(result.dotaSectorPuesto);
  };

  //Seteo la planta seleccionada
  useEffect(() => {
    if (plantas && plantas.length > 0) {
      setValue("plantId", dotaFamiliaLineaProduccion.lineaProduccion.plantId);
      getLineasByPlanta(dotaFamiliaLineaProduccion.lineaProduccion.plantId);
      getListDotaSectorByPlantId(dotaFamiliaLineaProduccion.lineaProduccion.plantId);
    }
  }, [plantas]);

  useEffect(() => {
    if (watchSector != 0) {
      getListDotaPuestoBySector();
    }
  }, [watchSector]);

  useEffect(() => {
    if (arraySectoresPuestos && arraySectoresPuestos.length > 0) calcularTotalLinea();
  }, [arraySectoresPuestos]);

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
    else setPlantas([]);
  };

  //Traigo los sectores filtrado por planta
  const getListDotaSectorByPlantId = async (plantId: number) => {
    let result = unwrapResult(await dispatch(DotaSectorSliceRequests.getAllRequest()));
    if (result) {
      result = result.filter((x) => x.plantId == plantId);
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
      setListDotaFamilia(result.filter((x) => x.lineaProduccionId == dotaFamiliaLineaProduccion.lineaProduccionId));
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
        dotaPuestoId: puestoSeleccionado.id,
        dotaFamiliaLineaProduccionId: dotaFamiliaLineaProduccion.id
      };
      guardarObjetoDotaSectorPuesto(dotaSectorPuesto);
      setArraySectoresPuestos([...arraySectoresPuestos, dotaSectorPuesto]);
    }
    calcularTotalLinea();
  };

  const guardarObjetoDotaSectorPuesto = async (dotaSectorPuesto: IDotaSectorPuesto) => {
    const result = unwrapResult(await dispatch(DotaSectorPuestoSliceRequests.PostRequest(dotaSectorPuesto)));
    if (result) {
      openNotificationUI("Agregado correctamente", "success");
      getListDotaSectorPuestoByDotaFamiliaLineaProduccionId(); //Traigo nuevamente la info, para tener los sctores con sus puestos actualizdos.
      onInit(); //Refresh del componente dotacionesPage.
    }
  };

  const getListDotaSectorPuestoByDotaFamiliaLineaProduccionId = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaFamiliaLineaProduccionSliceRequests.GetByFamiliaAndLinea({
          dotaFamiliaId: dotaFamiliaLineaProduccion.dotaFamiliaId,
          lineaProduccionId: dotaFamiliaLineaProduccion.lineaProduccionId
        })
      )
    );
    if (result) {
      setArraySectoresPuestos([...result.dotaSectorPuesto]);
    }
  };

  const calcularTotalLinea = () => {
    let sumaTotal = 0;
    for (let index = 0; index < arraySectoresPuestos.length; index++) {
      const sectorPuesto = arraySectoresPuestos[index];
      sumaTotal = sumaTotal + parseInt(sectorPuesto.cantidad.toString());
    }
    setTotalLinea(sumaTotal);
  };

  const getDotaFamiliaLineaProduccionByLineaAndFamilia = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaFamiliaLineaProduccionSliceRequests.GetByFamiliaAndLinea({
          dotaFamiliaId: watchFamilia,
          lineaProduccionId: watchLinea
        })
      )
    );
    if (result) {
      return result;
    } else return null;
  };

  return (
    <div style={{ width: "1500px" }}>
      <form className="flex flex-col justify-around p-6">
        <div className="flex justify-around m-4">
          <div style={{ width: "300px" }}>
            {plantas && (
              <Controller
                name="plantId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una planta</InputLabel>
                    <Select {...field} variant="standard" required={true} error={!!error?.types} disabled={true}>
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
                    <Select disabled={true} {...field} variant="standard">
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
            {listDotaFamilia && (
              <Controller
                name="dotaFamiliaId"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una familia</InputLabel>
                    <Select disabled={true} {...field} variant="standard">
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
          refreshSectoresPuestos={refreshSectoresPuestos}
          onInit={onInit}
          editando={true}></SectorAndPuestosSelected>
        <div className="text-center p-8">
          <Typography variant="h4">Total Linea: {totalLinea}</Typography>
        </div>
      </form>
    </div>
  );
};
