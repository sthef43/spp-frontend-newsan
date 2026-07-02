/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { ValidarQrLgSliceRequests } from "app/Middleware/reducers/ValidarQrLgSlice";
import { ValidadosQrLgSliceRequests } from "app/Middleware/reducers/ValidadosQrLgSlice";
interface props {
  setOpenPopup: any;
  refresh?: any;
  editState?: any;
}

export const ValidarCodigoQrLgForm = ({ setOpenPopup, editState, refresh }: props) => {
  //Traigo planta - Linea - Producto. Filtrar por modelo.
  const [first, setfirst] = useState(false);
  const classes = MaterialButtons();
  interface initialState {
    modeloId: number;
    codigoInit: string;
  }
  const initialStateVar = {
    modeloId: 0,
    codigoInit: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState, setFocus } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Actualizo o Guardo
  const [listTrazaOperaciones, setListTrazaOperaciones] = useState([]);
  const onSubmit = async (e) => {
    // console.log(e);
    setfirst(true);
    const params = {
      plantaId: editState.plantaId,
      lineaId: editState.lineaId,
      productoId: editState.productoId,
      modeloId: e.modeloId,
      codigo: e.codigoInit
    };
    // console.log(params);
    try {
      const result = unwrapResult(await dispatch(ValidarQrLgSliceRequests.getListByPLPMCRequest(params)));
      setListTrazaOperaciones(result);
    } catch (error) {
      console.log(error);
    }
  };
  const actualizarGood = async () => {
    // console.log("ACTUALIZAR");
    // console.log(listTrazaOperaciones);
    if (listTrazaOperaciones) {
      const objectSubmit = {
        validarQrLg: null,
        validarQrLgId: listTrazaOperaciones[0].id,
        valido: true
      };
      // console.log(objectSubmit);
      try {
        const result = unwrapResult(await dispatch(ValidadosQrLgSliceRequests.PostRequest(objectSubmit)));
        openNotificationUI("GOOD...", "success");
        refresh();
        setValue("codigoInit", "");
        setFocus("codigoInit");
      } catch (x) {
        openNotificationUI("Error al guardar.", "error");
      }
    }
  };

  const [listTrazaOperaciones2, setListTrazaOperaciones2] = useState([]);
  const determinarNotGood = async () => {
    const params = {
      plantaId: editState.plantaId,
      lineaId: editState.lineaId,
      productoId: editState.productoId,
      modeloId: watchModelo,
      codigo: "0"
    };
    console.log(params);
    try {
      const result = unwrapResult(await dispatch(ValidarQrLgSliceRequests.getListByPLPMCRequest(params)));
      setListTrazaOperaciones2(result);
    } catch (error) {
      console.log(error);
    }
  };
  const actualizarNotGood = async () => {
    // console.log("ACTUALIZAR");
    // console.log(listTrazaOperaciones2);
    if (listTrazaOperaciones) {
      const objectSubmit = {
        validarQrLg: null,
        validarQrLgId: listTrazaOperaciones2[0]?.id,
        valido: false
      };
      // console.log(objectSubmit);
      try {
        const result = unwrapResult(await dispatch(ValidadosQrLgSliceRequests.PostRequest(objectSubmit)));
        openNotificationUI("NO GOOD...", "error");
        refresh();
        setValue("codigoInit", "");
        setFocus("codigoInit");
      } catch (x) {
        openNotificationUI("Error al guardar.", "error");
      }
    }
  };
  useEffect(() => {
    // console.log(listTrazaOperaciones2);
    if (listTrazaOperaciones2 && listTrazaOperaciones2.length > 0) {
      actualizarNotGood();
    }
  }, [listTrazaOperaciones2]);

  useEffect(() => {
    // console.log(listTrazaOperaciones);
    if (listTrazaOperaciones) {
      if (listTrazaOperaciones.length > 0) {
        actualizarGood();
      } else {
        determinarNotGood();
      }
    }
  }, [listTrazaOperaciones]);

  //Leer ValidarQrLg por planta, linea y producto
  const [listValidarQrLg, setListValidarQrLg] = useState([]);
  const [listModelo, setListModelo] = useState([]);
  const getValidarQrLg = async () => {
    //plantaId: watchPlanta, lineaId: watchLinea, productoId
    try {
      const params = {
        plantaId: editState.plantaId,
        lineaId: editState.lineaId,
        productoId: editState.productoId
      };
      const responses = unwrapResult(
        await dispatch(ValidarQrLgSliceRequests.getListByPlantaLineaProductoRequest(params))
      );
      setListValidarQrLg(responses);
    } catch (error) {
      openNotificationUI("Error al leer validar Qr Lg.", "error");
    }
  };
  useEffect(() => {
    getValidarQrLg();
  }, [editState]);

  useEffect(() => {
    // Eliminar duplicados basados en modeloId
    const modelosUnicos = [...new Set(listValidarQrLg.map((modelo) => modelo.modeloId))].map((modeloId) =>
      listValidarQrLg.find((modelo) => modelo.modeloId === modeloId)
    );
    setListModelo(modelosUnicos);
  }, [listValidarQrLg]);
  useEffect(() => {
    console.log(listModelo);
  }, [listModelo]);

  //Watch
  const watchModelo = watch("modeloId");

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="my-2 mx-4 h-full p-8 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <Controller
            name="modeloId"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Modelo</InputLabel>
                <Select {...field} placeholder="Seleccione Modelo" variant="standard">
                  {listModelo &&
                    listModelo.map((x) => (
                      <MenuItem key={x.id} value={x.modeloId}>
                        <div className="w-full">
                          <div>{x.modelo.nombre}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="ml-5">Escanear código de placa</div>
        <div className="my-2 mx-4 h-full p-8 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <Controller
            name="codigoInit"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Input {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%", marginTop: "3%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
