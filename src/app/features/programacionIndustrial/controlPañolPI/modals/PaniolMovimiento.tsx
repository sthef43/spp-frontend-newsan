import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PaniolPISliceRequests } from "app/features/programacionIndustrial/slices/PaniolPISlice";
import { useAppDispatch } from "app/core/store/store";
import { IPaniolPI } from "app/models/IPaniolPI";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
interface Props {
  data: IPaniolPI;
  plantId: number;
  setOpenModal: any;
}
export const PaniolMovimiento = ({ data, plantId, setOpenModal }: Props) => {
  const formValues = {
    movimiento: "Ingreso",
    cantidad: 1,
    plantId: plantId,
    articulo: data.articulo,
    marca: data.marca,
    modelo: data.marca,
    detalles: "",
    userDni: GetInfoUser().dni,
    userName: "",
    conMovimiento: false
  };
  const { control, handleSubmit, formState, getValues, setValue } = useForm({ defaultValues: formValues });
  const classes = MaterialButtons();
  const { isValid, isDirty } = formState;
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [usuario, setUsuario] = useState("");
  const OnSubmitMovimiento = async (e) => {
    try {
      let valido = true;
      const movimiento = getValues("movimiento");
      if (movimiento == "Egreso") {
        const validar = data.cantidad - e.cantidad;
        valido = validar >= 0 ? true : false;
        if (valido) {
          e.cantidad = validar;
        }
      } else {
        e.cantidad = parseInt(e.cantidad) + data.cantidad;
      }
      if (valido) {
        const deleteOld = await dispatch(PaniolPISliceRequests.putChangeMovimiento(data.id));
        const response = await dispatch(PaniolPISliceRequests.PostRequest(e));
        openNotificationUI("Se realizaron los cambios correctamente", "success");
        const refresh = await dispatch(PaniolPISliceRequests.getAllByPlantId(plantId));
        setOpenModal(false);
      } else {
        openNotificationUI("La cantidada no puede ser menor a la de stock", "error");
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      setUsuario(response.name + " " + response.surname);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    getDataUser();
  }, []);
  useEffect(() => {
    setValue("userName", usuario);
  }, [usuario]);
  return (
    <div>
      <form onSubmit={handleSubmit(OnSubmitMovimiento)} style={{ gap: "10px", display: "grid" }}>
        <Controller
          name="movimiento"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel variant="filled">Seleccione el movimiento</InputLabel>
              <Select className="pt-2" {...field}>
                <MenuItem key={"M"} value={"Ingreso"}>
                  <div className="w-full">
                    <div>Ingreso</div>
                  </div>
                </MenuItem>
                <MenuItem key={"E"} value={"Egreso"}>
                  <div className="w-full">
                    <div>Egreso</div>
                  </div>
                </MenuItem>
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="detalles"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel>Detalles:</InputLabel>
              <OutlinedInput {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="cantidad"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <TextField label="Cantidad:" type={"number"} {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="pt-1 flex justify-around border-t-2 mt-2" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Agregar
          </Button>
        </div>
      </form>
    </div>
  );
};
