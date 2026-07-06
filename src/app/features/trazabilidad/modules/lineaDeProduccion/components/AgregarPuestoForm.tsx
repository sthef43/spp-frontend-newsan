import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TrazaProductoPuestoSliceRequests } from "app/features/trazabilidad/slices/TrazaProductoPuestoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";

interface Props {
  filaSeleccionada: any;
  productoId: any;
  refreshList: any;
  puestos: any;
  refresh: any;
}
export const AgregarPuestoForm = ({ refresh, puestos, filaSeleccionada, productoId, refreshList }: Props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  interface initialState {
    lineaProduccionId: number;
    puestoId: number;
    tipo: string;
  }

  const initialStateVar = {
    puestoId: null,
    tipo: "PF",
    lineaProduccionId: filaSeleccionada || null
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid } = formState;

  const [listOfPuestos, setListOfPuestos] = useState([]);
  const [noContent, setNoContent] = useState(false);

  const getPuestos = async () => {
    const listadoDePuestosByProducto = unwrapResult(
      await dispatch(TrazaProductoPuestoSliceRequests.getProductoPuestoByProductoId(productoId))
    );
    const listaPuestos = listadoDePuestosByProducto?.map((p) => {
      return p.puesto;
    });
    const listaPuestos2 = puestos?.map((p) => {
      return p.puesto;
    });
    const diferencia = listaPuestos.filter((p1) => {
      const existe = listaPuestos2?.find((p2) => p2.id == p1.id);
      if (!existe) {
        return p1;
      }
    });

    setListOfPuestos(diferencia);
    if (diferencia.length == 0) {
      setNoContent(true);
    }
  };

  useEffect(() => {
    getPuestos();
  }, [puestos]);

  const [listaPuestos, setListaPuestos] = useState([]);

  const agregarLineaPuesto = async (e) => {
    console.log("DATOS A INSERTAR: " + JSON.stringify(e));
    refreshList(); //Refresca la lista de los puestos
    let result;
    try {
      result = await dispatch(LineaPuestoSliceRequest.PostRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    const ParamName = JSON.stringify(result.payload.ParamName == undefined); //me fijo si el paramName esta disponible
    const tieneError = ParamName == "false"; //Si es false, significa que tiene dato, entonces encontro un error.
    if (result && !tieneError) {
      openNotificationUI("Dato agregado exitosamente :)", "success");
      refreshList(); //Refresca la lista de los puestos
      refresh();
    } else {
      //Tiene error, es el unique de que ya tiene ese puesto asignado a la linea.
      openNotificationUI(result.payload.ParamName, "warning");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(agregarLineaPuesto)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            {noContent ? (
              <div className="m-2 text-center">No hay puestos disponibles.</div>
            ) : (
              <>
                <Controller
                  name="puestoId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Seleccione un puesto</InputLabel>
                      <Select {...field} variant="standard">
                        {listOfPuestos &&
                          listOfPuestos.map((x) => (
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
                <Controller
                  name="tipo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Seleccione un tipo</InputLabel>
                      <Select {...field} variant="standard">
                        <MenuItem value={"SP"}>
                          <div>SP</div>
                        </MenuItem>
                        <MenuItem value={"PF"}>
                          <div>PF</div>
                        </MenuItem>
                      </Select>
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </>
            )}
          </div>
          <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
