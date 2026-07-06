import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IAudit } from "app/models/IAudit";
import { ITurno } from "app/models/ITurno";
import { LineSliceRequests } from "app/features/audit/slices/LineSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { TodoSliceRequests } from "app/features/audit/slices/TodoSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IAppUser } from "app/models/IAppUser";
import { ITodo } from "app/models/ITodo";
import { IPermisos } from "app/models/IPermisos";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IPlant } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { AuditSliceRequests } from "app/features/audit/slices/AuditSlice";
interface props {
  setOpenPopup: any;
  editState?: ITodo | null;
  refresh: () => void;
}
export const AuditTodoForm = ({ setOpenPopup, editState, refresh }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    auditId: number;
    lineId: number;
    lineaProduccionId: number;
    subRolId: number;
    rolId: number;
    turnoId: number;
    cantSample: number;
  }
  const permisosUser: IPermisos = useAppSelector<IAppUser>((state) => state.authentification.data.permisos as any);
  const initialStateVar = {
    auditId: null,
    lineId: null,
    lineaProduccionId: null,
    subRolId: null,
    rolId: permisosUser?.rolId,
    turnoId: null,
    cantSample: 1
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, handleSubmit, formState } = useForm<initialState>({
    defaultValues: editState || initialStateVar
  });

  const { State: ListOfTurno } = useFetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest);
  const audits = useAppSelector<IAudit[]>((state) => state.audit.dataAll);
  const lineas = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const planta = useAppSelector<IPlant>((state) => state.plant.object);
  const onGets = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const infoUser = unwrapResult(await dispatch(AppUserSliceRequests.getInfoUserById(GetInfoUser().id | 0)));
      await dispatch(
        AuditSliceRequests.getAllByPlantIdAndRolRequest({ plantId: planta.id, rolId: infoUser?.permisos?.rol?.id })
      );
      await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(planta.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const Persimos = (ListOfPermisos: IPermisos[]) => {
    return ListOfPermisos.filter((x) => x.rolId == permisosUser.rolId);
  };
  const { State: ListOfPermisos } = useFetchApi<IPermisos[]>(PermisosSliceRequests.getAllRequest, undefined, Persimos);
  const { isDirty, isValid } = formState;
  const getAllLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineSliceRequests.getAllUnrelatedRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const loginSubmit = async (e) => {
    let result;
    try {
      if (editState) {
        result = await dispatch(TodoSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(TodoSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      refresh();
      openNotificationUI("Nueva auditoria añadida a la lista de pendientes", "success");
      setOpenPopup(false);
    }
  };
  useEffect(() => {
    getAllLineas();
  }, []);
  useEffect(() => {
    planta && onGets();
  }, [planta]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="auditId"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Lista De Auditorias disponibles</InputLabel>
                  <Select {...field} variant="standard">
                    {audits &&
                      audits.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="cantSample"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Cantidad de muestras"
                  label="Cantidad de muestras"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              name="lineaProduccionId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea (Opcional)</InputLabel>
                  <Select {...field} variant="standard">
                    {lineas &&
                      lineas.map((x) => (
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
              name="rolId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Rol"
                  label="Rol"
                  variant="outlined"
                  type="Text"
                  disabled={true}
                  value={permisosUser?.rol?.name}
                />
              )}
            />

            <Controller
              name="subRolId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Sub Rol</InputLabel>
                  <Select {...field} variant="standard">
                    {ListOfPermisos &&
                      ListOfPermisos.map((x) => (
                        <MenuItem key={x.id} value={x.subrol?.id}>
                          <div className="w-full">
                            <div>{x.subrol?.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="turnoId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Turno</InputLabel>
                  <Select {...field} variant="standard">
                    {ListOfTurno &&
                      ListOfTurno.map((x) => (
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
