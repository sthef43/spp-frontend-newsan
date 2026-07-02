/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { CausaSliceRequest } from "app/Middleware/reducers/CausaSlice";
import { DefectoSliceRequest } from "app/Middleware/reducers/DefectoSlice";
import { OrigenesSliceRequest } from "app/Middleware/reducers/OrigenSlice";
import { PuestosParametroSliceRequests } from "app/Middleware/reducers/PuestosParametroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";

interface props {
  setOpenPopup: any;
  editState: any;
  rechazo: string;
  OnGetAll: any;
  nombreCampo: string;
  codRep: number;
  codigos: any;
}
interface initialState {
  codigo: string;
  descripcion: string;
  puesto: string;
  idLinea: number;
}

export const CodRechazoForm = ({
  setOpenPopup,
  editState,
  rechazo,
  OnGetAll,
  nombreCampo,
  codRep,
  codigos
}: props): JSX.Element => {
  const initialStateVar = {
    codigo: editState?.codigoCausa || editState?.codigoDefecto || editState?.codigoOrigen || "",
    Descripcion: editState?.descripcion || "",
    Puesto: editState?.puesto || editState?.tipoDefecto || "",
    idLinea: editState?.idLinea || ""
  };

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const lineas = useAppSelector((state) => state.linea.dataAll);

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const [puestos, setPuestos] = useState([]);

  const getPuestos = async () => {
    try {
      const fetchResultPuestos = unwrapResult(await dispatch(PuestosParametroSliceRequests.getAllRequest()));
      setPuestos(fetchResultPuestos);
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const getLineas = async () => {
    try {
      const response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const addCodigoValores = async (e) => {
    try {
      let response;
      const formValues = getValues();
      const defecto = editState
        ? {
            ...formValues,
            idDefecto: editState.idDefecto,
            codigoDefecto: formValues.codigo.trim(),
            tipoDefecto: formValues.puesto
          }
        : { ...formValues, codigoDefecto: formValues.codigo.trim(), tipoDefecto: formValues.puesto };
      const origenes = editState
        ? { ...formValues, idOrigen: editState.idOrigen, codigoOrigen: formValues.codigo.trim() }
        : { ...formValues, codigoOrigen: formValues.codigo.trim() };
      const causa = editState
        ? { ...formValues, idCausa: editState.idCausa, codigoCausa: formValues.codigo.trim() }
        : { ...formValues, codigoCausa: formValues.codigo.trim() };
      if (rechazo == "defecto") {
        response = editState
          ? await dispatch(DefectoSliceRequest.PutRequest(defecto))
          : await dispatch(DefectoSliceRequest.PostRequest(defecto));
      } else if (rechazo == "origenes") {
        response = editState
          ? await dispatch(OrigenesSliceRequest.PutRequest(origenes))
          : await dispatch(OrigenesSliceRequest.PostRequest(origenes));
      } else {
        response = editState
          ? await dispatch(CausaSliceRequest.PutRequest(causa))
          : await dispatch(CausaSliceRequest.PostRequest(causa));
      }
      editState
        ? openNotificationUI("Se edito el codigo correctamente", "success")
        : openNotificationUI("Se agregro el codigo correctamente", "success");
      OnGetAll();
      setOpenPopup(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const validateCodigo = (value) => {
    const codigo = editState?.codigoCausa || editState?.codigoDefecto || editState?.codigoOrigen || "";
    if (getValues("codigo") == codigo) {
      return true;
    }
    const existe = codigos?.find((codigo) => codigo[nombreCampo]?.toLowerCase().trim() == value?.toLowerCase().trim());
    return existe ? false : true;
  };

  useEffect(() => {
    getLineas();
    getPuestos();
  }, []);

  useEffect(() => {
    if (lineas.length > 0) {
      if (codRep) {
        setValue("idLinea", lineas.find((l) => l.codigoReparacion == codRep.toString())?.idLinea || 0);
      } else {
        setValue("idLinea", null);
      }
    }
  }, [lineas]);

  return (
    <div>
      <form onSubmit={handleSubmit(addCodigoValores)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto border-b-2 pb-2" style={{ flex: "1 1 90%" }}>
            <Controller
              name="codigo"
              control={control}
              rules={{ required: true, maxLength: 10, minLength: 1, validate: validateCodigo }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel> Código </InputLabel>
                  <Input {...field} />
                  {!!error && (
                    <FormHelperText>
                      {error.type == "maxLength" && <h1>El codigo debe tener 3 caracteres como máximo</h1>}
                      {error.type == "validate" && <h1>El codigo ya existe</h1>}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Descripción</InputLabel>
                  <Input {...field} />
                  {!!error && (
                    <FormHelperText>
                      {error.type == "minLength" && <h1>La descripción debe tener 2 caracteres como minimmo</h1>}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="puesto"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione un puesto</InputLabel>
                  <Select {...field} variant="standard">
                    {puestos &&
                      puestos.map((x) => (
                        <MenuItem key={x.id} value={x.alias.trim()}>
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
              name="idLinea"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una linea *opcional</InputLabel>
                  <Select {...field} placeholder="Línea" variant="standard">
                    {lineas &&
                      lineas.map((linea) => (
                        <MenuItem key={linea.idLinea} value={linea.idLinea}>
                          <div className="w-full">
                            <div>{linea.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="pt-1 flex justify-around mt-3" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
