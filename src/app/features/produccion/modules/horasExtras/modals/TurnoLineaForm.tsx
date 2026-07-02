import React, { useEffect, useState } from "react";
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
  TextField,
  Tooltip
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { Controller, useForm } from "react-hook-form";
import { TurnoExtrasSliceRequests } from "app/Middleware/reducers/TurnoExtrasSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ITurnoExtras } from "app/models/ITurnoExtras";
import { unwrapResult } from "@reduxjs/toolkit";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { ITurnoExtrasLineaProduccion } from "app/models/ITurnoExtrasLineaProduccion";
import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
import { Close } from "@mui/icons-material";
interface ITurnoLineaForm {
  horaExtraTurnoExtras: IHoraExtraTurnoExtras;
  changeValue: (fecha: string, turnoExtrasId: number, newValue: IHoraExtraTurnoExtras) => void;
  fecha: string;
  inx: number;
  onDeleteTurnoL: (inx: number) => void;
}
const defaultValues = {
  lineaProduccionId: 0,
  cantidad: 0,
  detalle: "",
  comedor: false,
  transporte: false
};
interface IDefaultValues {
  lineaProduccionId: number;
  cantidad: number;
  detalle: string;
  comedor: boolean;
  transporte: boolean;
}
export const TurnoLineaForm = ({
  horaExtraTurnoExtras,
  changeValue,
  fecha,
  inx,
  onDeleteTurnoL
}: ITurnoLineaForm): JSX.Element => {
  const lineas: ILineaProduccion[] = useAppSelector((state) => state.lineaProduccion.dataAll);
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const [turnoLinea, setTurnoLinea] = useState<ITurnoExtrasLineaProduccion[]>([]);
  const [turnoExtra, setTurnoExtra] = useState<ITurnoExtras>({} as ITurnoExtras);
  const [total, setTotal] = useState<number>(0);
  const { handleSubmit, control, formState, watch, getValues, setValue, clearErrors, setError } =
    useForm<IDefaultValues>({
      defaultValues
    });

  const getAllTurnosExtras = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(await dispatch(TurnoExtrasSliceRequests.getAllRequest()));
      findTurnoExtra(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  const onAddLinea = () => {
    const lineaProduccionId = getValues("lineaProduccionId");
    const cantidad = getValues("cantidad");
    const detalle = getValues("detalle");
    if (lineaProduccionId == 0) {
      setError("lineaProduccionId", { message: "Debe seleccionar una linea" });
      return;
    }
    if (turnoLinea.find((tl) => tl.lineaProduccionId == lineaProduccionId)) {
      setError("lineaProduccionId", { message: "La linea no se puede repetir" });
      return;
    }
    if (cantidad == 0 || cantidad < 0) {
      setError("cantidad", { message: "La cantidad no puede ser menor o igual a 0" });
      return;
    }
    const lineaProduccion = lineas.find((linea) => linea.id == lineaProduccionId);
    setTurnoLinea([
      ...turnoLinea,
      { lineaProduccionId, cantidad, detalle, horaExtraTurnoExtrasId: 0, lineaProduccion }
    ]);
    setValue("detalle", "");
    setValue("lineaProduccionId", 0);
    setValue("cantidad", 0);
    clearErrors();
  };

  const findTurnoExtra = (response: ITurnoExtras[]) => {
    setTurnoExtra(response.find((th) => th.id == horaExtraTurnoExtras.turnoExtrasId));
  };
  const onChangeForm = () => {
    const comedor = getValues("comedor");
    const transporte = getValues("transporte");
    const { turnoExtrasId } = horaExtraTurnoExtras;
    const newValue: IHoraExtraTurnoExtras = {
      comedor,
      transporte,
      fecha,
      turnoExtrasId,
      turnoExtrasLineaProduccion: turnoLinea
    };
    changeValue(fecha, turnoExtrasId, newValue);
  };
  const onDeleteLinea = (indx: number) => {
    const newTurnoLinea = turnoLinea.filter((tl, index) => index != indx);
    setTurnoLinea(newTurnoLinea);
  };
  const onDeleteTurnoLinea = () => {
    onDeleteTurnoL(inx);
  };
  const getTotalCantidad = () => {
    setTotal((prevState) => {
      const newTotal = prevState + turnoLinea[turnoLinea.length - 1].cantidad;
      return newTotal;
    });
  };

  useEffect(() => {
    getAllTurnosExtras();
  }, []);
  useEffect(() => {
    onChangeForm();
  }, [watch("comedor"), watch("transporte")]);
  useEffect(() => {
    onChangeForm();
  }, [turnoLinea]);
  useEffect(() => {
    turnoLinea.length > 0 && getTotalCantidad();
  }, [turnoLinea]);

  return (
    <div className="m-4 border-2 border-emerald-600 p-4">
      <div className="grid grid-cols-9 notebook:grid-cols-12 gap-4 items-center">
        <Tooltip title="Eliminar">
          <IconButton onClick={() => onDeleteTurnoLinea()}>
            <Close color="error" />
          </IconButton>
        </Tooltip>
        <div className="col-span-6 notebook:col-span-7">
          <TitleUIComponent
            title={
              turnoExtra != undefined &&
              "Turno: " +
                turnoExtra?.turno?.nombre +
                " desde: " +
                turnoExtra?.desdeHora?.slice(0, 2) +
                " hasta: " +
                turnoExtra?.hastaHora?.slice(0, 2) +
                " TOTAL PERSONAL: " +
                total
            }
            classNameTitle={window.innerWidth > 1366 ? "text-base" : "text-sm"}
          />
        </div>

        <div className="col-span-1 notebook:col-span-2">
          <Controller
            name="comedor"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <FormControlLabel label="Comedor" control={<Checkbox {...field} />} />

                {!!error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="col-span-1 notebook:col-span-2">
          <Controller
            name="transporte"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <FormControlLabel label="Transporte" control={<Checkbox {...field} />} />

                {!!error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
      </div>
      <form className="flex gap-4 mt-6">
        {lineas?.length > 0 && (
          <Controller
            name="lineaProduccionId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione una linea de producción</InputLabel>
                <Select {...field} variant="standard">
                  {lineas?.map((x) => (
                    <MenuItem key={x.id} value={x.id}>
                      <div className="w-full">
                        <div>{x.nombre}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        )}
        <Controller
          name="cantidad"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              placeholder="Cantidad:"
              label="Cantidad de personal"
              variant="outlined"
              type="number"
              onClick={(e: any) => e.target.select()}
              error={!!error?.types}
              helperText={error?.type}
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name="detalle"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Detalles:</InputLabel>
              <Input {...field} />
              {!!error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="w-full justify-center flex ">
          <Button className={classes.blueButton} onClick={onAddLinea}>
            Añadir
          </Button>
        </div>
      </form>
      {turnoLinea?.length > 0 &&
        turnoLinea.map((tL, index) => (
          <div className="flex gap-4 w-full justify-between mt-5" key={index}>
            <TextField value={tL.lineaProduccion.nombre} disabled fullWidth />
            <TextField value={tL.cantidad} disabled />
            <TextField value={tL.detalle} disabled fullWidth multiline />
            <Tooltip title="Eliminar">
              <IconButton onClick={() => onDeleteLinea(index)}>
                <Close color="error" />
              </IconButton>
            </Tooltip>
          </div>
        ))}
    </div>
  );
};
