import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IAuditTracking } from "app/models/IAuditTracking";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { AuditComentarios } from "../../components/reporteAuditoria/AuditComentarios";
import { AuditComentarioSliceRequest } from "app/features/audit/slices/AuditComentarioSlice";
import { AuditTrackingSliceRequest } from "app/features/audit/slices/AuditTrackingSlice";
interface Props {
  auditTracker: IAuditTracking;
  setOpenModal: any;
  rolId?: number;
}
export const AuditTrackerResol = ({ auditTracker, setOpenModal, rolId }: Props) => {
  //Lo viejo************
  // const auditTrackers: IAuditTracking[] = useAppSelector((state) => state.auditTracking.dataAll);
  // const { control, formState, watch, getValues, reset } = useForm({
  //   defaultValues: { comentario: "", userDni: GetInfoUser().dni || 0, auditTrackingId: auditTracker?.id }
  // });
  // const classesButton = MaterialButtons();
  // const { openNotificationUI } = useNotificationUI();
  // const [tracker, setTracker] = useState(null);
  // const dispatch = useAppDispatch();
  // const onSubmit = async () => {
  //   try {
  //     dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
  //     const objectSubmit = getValues();
  //     const response = await dispatch(AuditComentarioSliceRequest.PostRequest(objectSubmit));
  //     dispatch(LoadingUISlice.actions.LoadingUIClose());
  //     openNotificationUI("Se agrego el comentario correctamente", "success");
  //     const refresh = await dispatch(AuditTrackingSliceRequest.getAllByRolIdRequest(rolId));
  //     reset();
  //   } catch (e) {
  //     dispatch(LoadingUISlice.actions.LoadingUIClose());
  //     openNotificationUI(e, "error");
  //   }
  // };
  // //   Esto es para que actualice el estado cuando manda un nuevo msj
  // useEffect(() => {
  //   if (auditTrackers) {
  //     const newTracker = auditTrackers.find((t) => t?.id == auditTracker?.id);
  //     setTracker(newTracker);
  //   }
  // }, [auditTrackers]);

  //Lo nuevo************

  const { control, formState, watch, getValues, reset, handleSubmit } = useForm({
    defaultValues: { comentario: "", userDni: GetInfoUser().dni || 0, auditTrackingId: auditTracker?.id }
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const classesButton = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //Guardar Comentario
  const onSubmit = async () => {
    try {
      await dispatch(AuditComentarioSliceRequest.PostRequest(getValues()));
      openNotificationUI("Se agrego el comentario correctamente", "success");
      reset();
      getTracker();
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  //Leer
  const [tracker, setTracker] = useState(null);
  const getTracker = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const refresh = await dispatch(AuditTrackingSliceRequest.getByIdRequest(auditTracker.id));
      setTracker(refresh.payload);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    if (auditTracker) {
      getTracker();
    }
  }, [auditTracker]);

  return (
    <div className="m-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="p-5"
          style={{
            minHeight: "400px",
            minWidth: "400px",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "600px",
            background: "#25545c",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
          {tracker?.auditComentario.map((comentario) => {
            return (
              <AuditComentarios key={comentario?.id} mensaje={comentario?.comentario} userDni={comentario?.userDni} />
            );
          })}
        </div>
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          {/* Codigo anterior */}
          {/* <Controller
            name="comentario"
            control={control}
            rules={{ required: true, minLength: 2 }}
            render={({ field }) => {
              return (
                <FormControl className="col-8 my-2 mx-1" fullWidth>
                  <Input {...field} placeholder="Escriba un comentario..." multiline fullWidth />
                </FormControl>
              );
            }}
          /> */}
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Controller
                name="comentario"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormControl fullWidth error={!!error}>
                      <TextField
                        fullWidth
                        label="Escriba un comentario..."
                        multiline
                        type="text"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  );
                }}
              />
            </Grid>
            <Grid item xs={2} className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
              <Button
                className={classesButton.blueButton}
                type="submit"
                variant="contained"
                disabled={!isDirty && !isValid}>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </div>
      </form>
      <div className="my-2 flex justify-center">
        <Button className={classesButton.redButton} onClick={() => setOpenModal(false)}>
          Salir
        </Button>
      </div>
    </div>
  );
};
