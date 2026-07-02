/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, FormControl, InputLabel, Select, FormHelperText, MenuItem, Input } from "@mui/material";
import { RechazoImagenSliceRequests } from "app/Middleware/reducers/RechazoImagenSlice";
import _ from "lodash";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppSelector, useAppDispatch } from "app/core/store/store";
import { IFamilia } from "app/models/IFamilia";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IRechazoImagen } from "app/models/IRechazoImagen";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
interface IRPuestoFormProps {
  refresh: () => void;
  editState: IRechazoImagen;
  rPuestoId: number;
  closeModal: (state) => void;
}
interface initialState {
  rechazoPuestoId: number;
  lineaProduccionId: number;
  familiaId: number;
  codigoRechazo: number;
  numerosColumnas: string;
}
export const RechazoImagenForm = ({ refresh, editState, rPuestoId, closeModal }: IRPuestoFormProps) => {
  const initialStateVar = {
    rechazoPuestoId: rPuestoId,
    lineaProduccionId: 0,
    familiaId: 0,
    codigoRechazo: 0,
    numerosColumnas: ""
  };
  const familias = useAppSelector<IFamilia[]>((state) => state.familia.dataAll);
  const lineas = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const puestosImagen = useAppSelector<IRechazoImagen[]>((state) => state.rechazoImagen.dataAll);
  const [familiasFilter, setFamiliasFilter] = useState<IFamilia[]>([]);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editState ? editState : initialStateVar
  });
  const { isDirty, isValid } = formState;
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (editState) {
        delete e.lineaProduccion;
        delete e.familia;
        delete e.rechazoPuesto;
      }
      const response = editState
        ? await dispatch(RechazoImagenSliceRequests.PutRequest(e))
        : await dispatch(RechazoImagenSliceRequests.PostRequest(e));
      editState
        ? openNotificationUI("Se edito correctamente", "success")
        : openNotificationUI("Se agrego correctamente", "success");
      closeModal(false);
      refresh();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onChangeLinea = () => {
    const codigoRechazo = lineas.find((linea) => linea.id === getValues("lineaProduccionId")).identificadorLinea;
    setValue("codigoRechazo", codigoRechazo);
  };
  const onNumerosColValidacion = (value): boolean => {
    // eslint-disable-next-line no-useless-escape
    const regex = /\d+(-\d+)+$/;
    return regex.test(value);
  };

  // const removeElementFromArray = (arr1: IFamilia[], arr2: IFamilia[]) => {
  const removeElementFromArray = (arr1: IFamilia[]) => {
    // const filteredArr = arr1.filter((item) => !arr2.some((item2) => item2.id === item.id));
    // const familiaNow = familias.find((f) => f.id == editState?.familiaId);
    // const arrOrder = _.orderBy(filteredArr, (a) => a.nombre);
    const arrOrder = _.orderBy(arr1, (a) => a.nombre);
    setFamiliasFilter([...arrOrder]);
    // if (familiaNow) setFamiliasFilter([...arrOrder, familiaNow]);
  };

  useEffect(() => {
    if (familias.length > 0) {
      // const familiaNow = puestosImagen.map((pI) => pI.familia);
      // removeElementFromArray(familias, familiaNow);
      removeElementFromArray(familias);
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={`py-4 grid gap-10 mx-2 grid-rows-4 w-50vw`}>
        <Controller
          name="familiaId"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione una familia</InputLabel>
              <Select {...field} variant="standard">
                {familiasFilter &&
                  familiasFilter.map((x) => (
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
          name="lineaProduccionId"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione una linea de producción</InputLabel>
              <Select {...field} variant="standard" onClick={onChangeLinea}>
                {lineas &&
                  lineas.map((linea) => (
                    <MenuItem key={linea.id} value={linea.id}>
                      <div className="w-full">
                        <div>{linea.nombre}</div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="numerosColumnas"
          control={control}
          rules={{ required: true, validate: onNumerosColValidacion }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Números que figuran en la imagen</InputLabel>
              <Input
                {...field}
                placeholder={"Los numeros deben ir separador por '-', por ejemplo: '1-5-9-10'"}
                fullWidth
              />
              {!!error && error.type != "validate" && <FormHelperText>{error.type}</FormHelperText>}
              {!!error && error.type == "validate" && <FormHelperText>No cumple con el formato</FormHelperText>}
            </FormControl>
          )}
        />

        <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
