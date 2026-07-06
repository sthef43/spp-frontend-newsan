import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ITrazaProductoPuesto } from "app/models";
import { PuestoSliceRequests } from "app/features/trazabilidad/slices/PuestoSlice";
import { TrazaProductoPuestoSliceRequests } from "app/features/trazabilidad/slices/TrazaProductoPuestoSlice";

import { unwrapResult } from "@reduxjs/toolkit";
interface props {
  setOpenPopup: any;
  editState?: ITrazaProductoPuesto | null;
  refresh?: any;
  productId: number;
  puestos: any;
  plantSelect: any;
}
export const TrazabilidadProductoPuestoForm = ({
  puestos,
  productId,
  setOpenPopup,
  editState,
  refresh,
  plantSelect
}: props) => {
  const classes = MaterialButtons();
  interface initialState {
    puestoId: number;
    productoId: number;
  }
  const initialStateVar = {
    puestoId: null,
    productoId: productId
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [puestosList, setPuestosList] = React.useState([]);
  const [noContent, setNoContent] = React.useState(false);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editState || initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  const getPuestos = async () => {
    try {
      const response = unwrapResult(await dispatch(PuestoSliceRequests.getAllRequest()));
      const oldPuestos = puestos.map((p) => {
        return p.puesto;
      });
      const diferencia = response.filter((p1) => {
        const existe = oldPuestos?.find((p2) => p2.id == p1.id);
        if (!existe) {
          return p1;
        }
      });
      console.log(diferencia);
      console.log(plantSelect);
      const newArray = diferencia.filter((x) => x.plantId == plantSelect); //Filtro los puestos para la planta seleccionada
      setPuestosList(newArray);
      if (newArray.length == 0) {
        setNoContent(true);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const addProductoPuesto = async (e) => {
    let result;
    try {
      if (editState) {
        result = await dispatch(TrazaProductoPuestoSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(TrazaProductoPuestoSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    const ParamName = JSON.stringify(result.payload.ParamName == undefined); //me fijo si el paramName esta disponible
    const tieneError = ParamName == "false"; //Si es false, significa que tiene dato, entonces encontro un error.
    if (result && !tieneError) {
      openNotificationUI("Dato agregado exitosamente :)", "success");
      setOpenPopup(false);
      refresh();
    } else {
      //Tiene error, es el unique de que el producto ya tiene el puesto.
      openNotificationUI(result.payload.ParamName, "warning");
    }
  };
  useEffect(() => {
    getPuestos();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(addProductoPuesto)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            {noContent ? (
              <div className="m-2 text-center">No hay puestos disponibles.</div>
            ) : (
              <Controller
                name="puestoId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un Puesto</InputLabel>
                    <Select {...field} variant="standard">
                      {puestosList &&
                        puestosList.map((x) => (
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
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
