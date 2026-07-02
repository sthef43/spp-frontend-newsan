import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OQCSeguimientoSliceRequests } from "app/features/oqcGeneral/slices/OQCSeguimientoSlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { IOQCSeguimiento } from "app/models/IOQCSeguimiento";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, TextField } from "@mui/material";
import { FormButtons } from "app/shared/helpers/FormButtons";
interface IOQCSeguimientoForm {
  closeModal: (state: boolean) => void;
  refresh: () => void;
}
const defaultValues = {
  causaRaiz: "",
  solucionInmediata: "",
  correccionFinal: "",
  resuelto: false,
  operatorId: 0,
  oqcHallazgoResultId: 0,
  enviarEmail: false
};
export const OQCSeguimientoForm = ({ closeModal, refresh }: IOQCSeguimientoForm): JSX.Element => {
  const oqcSeg = useAppSelector<IOQCSeguimiento>((state) => state.oqcSeguimiento.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const { control, handleSubmit, setValue, getValues, watch, reset } = useForm({
    defaultValues: oqcSeg ? oqcSeg : defaultValues
  });

  const oqcHallazgoResult = useAppSelector<IOQCHallazgoResult>((state) => state.oqcHallazgoResult.object);
  const oqcDesign = useAppSelector((state) => state.oqcDesignada.object);

  const [activarEnvio, setActivarEnvio] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActivarEnvio(event.target.checked);
  };

  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const operator = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0)));
      e.operatorId = operator.id;
      e.oqcHallazgoResultId = oqcHallazgoResult.id;
      if (oqcSeg) {
        delete e.operator;
      }
      if (e.correccionFinal.length > 0) {
        e.resuelto = true;
      }
      oqcSeg
        ? await dispatch(OQCSeguimientoSliceRequests.PutRequest(e))
        : await dispatch(OQCSeguimientoSliceRequests.PostRequest(e));
      closeModal(false);
      refresh();
      openNotificationUI("Se agrego con éxito", "success");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
      <Controller
        control={control}
        name="causaRaiz"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Causa raíz" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="solucionInmediata"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Solución inmediata" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="correccionFinal"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Acción resolutiva final" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <FormControlLabel
        control={<Checkbox checked={activarEnvio} onChange={handleChange} />}
        label="Enviar email de aviso de seguimiento"
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
