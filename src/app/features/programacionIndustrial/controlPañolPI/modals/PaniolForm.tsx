import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { PaniolPISliceRequests } from "app/Middleware/reducers/PaniolPISlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";

interface Props {
  plantId: number;
  setOpenModal: any;
  dataEdit: any;
}
export const PaniolForm = ({ plantId, setOpenModal, dataEdit }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const [usuario, setUsuario] = useState("");
  const schema = yup
    .object()
    .shape({
      articulo: yup.string().min(1).required(),
      marca: yup.string().min(1).required(),
      modelo: yup.string().min(1).required(),
      detalles: yup.string().min(1).required(),
      cantidad: yup.number().positive("La cantidad debe ser mayor a 0").required()
    })
    .required();
  const defaultValues = {
    articulo: "",
    marca: "",
    modelo: "",
    detalles: "",
    cantidad: 0,
    userDni: GetInfoUser().dni,
    userName: "",
    plantId: plantId,
    movimiento: "Entrada",
    conMovimiento: false
  };
  const { control, setValue, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dataEdit ? dataEdit : defaultValues,
    mode: "onChange"
  });
  const { isDirty, isValid } = formState;

  const onAddStock = async (e) => {
    try {
      const response = dataEdit
        ? await dispatch(PaniolPISliceRequests.PutRequest(e))
        : await dispatch(PaniolPISliceRequests.PostRequest(e));
      dataEdit
        ? openNotificationUI("Se edito correctamente", "success")
        : openNotificationUI("Se agrego correctamente", "success");
      const refresh = await dispatch(PaniolPISliceRequests.getAllByPlantId(plantId));
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      console.log(response);
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
      <form onSubmit={handleSubmit(onAddStock)} style={{ display: "grid", gap: "5px" }}>
        <Controller
          name="articulo"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <TextField label="Articulo:" {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="marca"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <TextField label="Marca:" {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="modelo"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <TextField label="Modelo:" {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="detalles"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <TextField label="Detalles:" {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="cantidad"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <TextField label="Cantidad:" type={"number"} {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="pt-1 flex justify-around border-t-2 mt-2" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
