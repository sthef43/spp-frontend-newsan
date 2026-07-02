/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Select,
  MenuItem,
  Grid,
  TextField
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOrganizacion } from "app/models/IOrganizacion";
import { OrganizacionSliceRequests } from "app/Middleware/reducers/OrganizacionSlice";
import { CLIEstadoSliceRequests } from "app/features/cli/Middlewares/CLIEstadoSlice";
import { CLITipoUBCSliceRequests } from "app/features/cli/Middlewares/CLITipoUBCSlice";
import { CLIUbicacionesSliceRequests } from "app/features/cli/Middlewares/CLIUbicacionesSlice";
import { ICLIEstado } from "app/features/cli/Models/ICLIEstado";
import { ICLITipoUBC } from "app/features/cli/Models/ICLITipoUBC";
import { ICLIUbicaciones } from "app/features/cli/Models/ICLIUbicaciones";
interface props {
  setOpenPopup: any;
  editState?: ICLIUbicaciones | null;
  refresh?: any;
  estaEditando: any;
}

export const CLIUbicacionesForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    localizador: string;
    pasillo: string;
    organizacionId: number;
    cliTipoUBCId: number;
    cliEstadoId: number;
  }
  const initialStateVar = {
    localizador: "",
    pasillo: "",
    organizacionId: 0,
    cliTipoUBCId: 0,
    cliEstadoId: 0
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Leer listas
  useEffect(() => {
    getListCLIEstado();
    getListCLITipoUBC();
    getListOrganizacion();
  }, []);

  const [listOrganizacion, setlistOrganizacion] = useState<IOrganizacion[]>(null);
  const getListOrganizacion = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(OrganizacionSliceRequests.getAllRequest()));
      setlistOrganizacion(result);
    } catch (error) {
      openNotificationUI("Error al leer Organización.", "error");
    }
  };
  const [listCLIEstado, setlistCLIEstado] = useState<ICLIEstado[]>(null);
  const getListCLIEstado = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(CLIEstadoSliceRequests.getAllRequest()));
      setlistCLIEstado(result);
    } catch (error) {
      openNotificationUI("Error al leer CLIEstado.", "error");
    }
  };
  const [listCLITipoUBC, setlistCLITipoUBC] = useState<ICLITipoUBC[]>(null);
  const getListCLITipoUBC = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(CLITipoUBCSliceRequests.getAllRequest()));
      setlistCLITipoUBC(result);
    } catch (error) {
      openNotificationUI("Error al leer TipoUBC.", "error");
    }
  };

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    const objectSubmit = {
      ...e,
      organizacion: null,
      cliEstado: null,
      cliTipoUBC: null
    };
    console.log(objectSubmit);
    console.log(editState);
    try {
      if (editState) {
        unwrapResult(await dispatch(CLIUbicacionesSliceRequests.PutRequest(objectSubmit)));
      } else {
        unwrapResult(await dispatch(CLIUbicacionesSliceRequests.PostRequest(objectSubmit)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Formato de Localizador
  const formatLocalizador = (value) => {
    // Elimina cualquier carácter que no sea alfanumérico
    const cleaned = value.replace(/[^A-Z0-9]/g, "");
    // Aplica el formato dinámico --.--.--
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      formatted += cleaned[i];
      if (i === 1 || i === 3) formatted += "."; // Agrega punto después de los primeros dos grupos de caracteres
    }
    return formatted.slice(0, 8); // Limita a 8 caracteres para el formato correcto
  };

  return (
    <div style={{ height: "100%", width: "40vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-3 h-full">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <Controller
                  name="localizador"
                  control={control}
                  rules={{ required: true, minLength: 8 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Localizador A#.##.##</InputLabel>
                      <Input
                        {...field}
                        value={formatLocalizador(field.value || "")} // Aplica el formato
                        onChange={(e) => field.onChange(formatLocalizador(e.target.value))}
                      />
                      {!!error && error.type != "min" && <FormHelperText>Mayúsculas y Formato ##.##.##</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
          </Grid>

          <div className="mt-8 mb-5">
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <Controller
                  name="organizacionId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Organización</InputLabel>
                      <Select {...field} placeholder="Seleccione Organización" variant="standard">
                        {listOrganizacion &&
                          listOrganizacion.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="cliTipoUBCId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Tipo UBC</InputLabel>
                      <Select {...field} placeholder="Seleccione Tipo UBC" variant="standard">
                        {listCLITipoUBC &&
                          listCLITipoUBC.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="cliEstadoId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Estado</InputLabel>
                      <Select {...field} placeholder="Seleccione Estado" variant="standard">
                        {listCLIEstado &&
                          listCLIEstado.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.nombre}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="pasillo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField
                        fullWidth
                        label="Pasillo"
                        variant="standard"
                        type="text"
                        inputProps={{ maxLength: 5, style: { textTransform: "uppercase" } }}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </div>

          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
