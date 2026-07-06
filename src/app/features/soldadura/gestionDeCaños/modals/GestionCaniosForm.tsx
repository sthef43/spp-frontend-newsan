import { FormControl, FormHelperText, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobCaniosSubSliceRequests } from "app/Middleware/reducers/DobCaniosSubSlice";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { IDobMaestroPieza } from "app/models/IDobMaestroPieza";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
interface IGestionCaniosForm {
  refresh: () => void;
  data: IDobCaniosSub;
  setModal: (state: boolean) => void;
}
export const GestionCaniosForm = ({ data, refresh, setModal }: IGestionCaniosForm): JSX.Element => {
  const initalState = {
    generico: data?.dobMaestroPieza?.generico || "",
    dobMaestroPiezaId: 0,
    cantDob: 0,
    cantSol: 0,
    lpn: "",
    diferencia: false
  };

  console.log(data);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const dobMaestroPiezas = useAppSelector((state) => state.dobMaestroPieza.dataAll);
  const dobCaniosSubs = useAppSelector((state) => state.dobCaniosSub.dataAll);
  const [genericos, setGenericos] = useState<Array<string>>([]);
  const [lpn, setLPN] = useState<Array<string>>([]);
  const [maestroPieza, setMaestroPieza] = useState<IDobMaestroPieza>(data?.dobMaestroPieza || null);
  const [maestroPiezas, setMaestroPiezas] = useState<IDobMaestroPieza[]>([] as IDobMaestroPieza[]);
  const [articulo, setArticulo] = useState(data?.dobMaestroPieza.articulo || null);
  const { control, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: data ? data : initalState
  });
  const onSubmit = async (e) => {
    try {
      const result = await dispatch(DobCaniosSubSliceRequests.getListByLpnRequest(e.lpn));
      try {
        result.payload[0].length;
        openNotificationUI("El Lpn ya existe!!!", "error");
      } catch (error) {
        guardar(e);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const guardar = async (e) => {
    try {
      if (!maestroPieza) {
        openNotificationUI("Ingrese Un codigo de articulo", "error");
        return;
      }
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      data && delete e.dobMaestroPieza;
      const obj = { ...e, lpn: e.lpn.toUpperCase() };
      const response = data
        ? unwrapResult(
            await dispatch(
              DobCaniosSubSliceRequests.PutRequest({
                ...e,
                id: data.id,
                createdDate: data.createdDate,
                lpn: e.lpn.toUpperCase()
              })
            )
          )
        : unwrapResult(await dispatch(DobCaniosSubSliceRequests.PostRequest(obj)));
      if (getValues("diferencia")) {
        const resp = await dispatch(EmailSliceRequest.SendMailDiferencia(response));
      }
      setModal(false);
      openNotificationUI(`Se ${data ? "agrego" : "edito"} correctamente`, "success");
      refresh();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getMaestroPiezas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DobMaestroPiezaliceRequests.getAllRequest()));
      onSetGenericos(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onSetGenericos = (maestroPieza: IDobMaestroPieza[]) => {
    setGenericos(Object.keys(_.groupBy(maestroPieza, "generico")));
    data && onSetMaestroPiezas(data?.generico);
  };
  const onSetMaestroPiezas = (generico: string) => {
    onSetLPN(generico);
    setMaestroPiezas(_.groupBy(dobMaestroPiezas, "generico")[generico]);
  };
  const onSetLPN = (generico: string) => {
    setLPN(
      dobCaniosSubs
        .filter((dbCanios) => dbCanios.dobMaestroPieza.generico == generico)
        .map((dbCaniosF) => dbCaniosF.lpn)
    );
  };
  const onValidateCant = () => {
    setValue("diferencia", getValues("cantDob") != getValues("cantSol"));
  };
  const onValidateLPN = (value: string): boolean => {
    if (data?.lpn == getValues("lpn")) {
      return true;
    }
    return lpn?.find((l) => l.toLocaleLowerCase().trim() == value.toLocaleLowerCase().trim()) ? false : true;
  };

  useEffect(() => {
    getMaestroPiezas();
  }, []);

  useEffect(() => {
    onValidateCant();
  }, [watch("cantDob"), watch("cantSol")]);

  useEffect(() => {
    if (genericos.length != 0 && data) onSetMaestroPiezas(data?.generico);
  }, [genericos]);

  useEffect(() => {
    if (getValues("generico") != "") onSetMaestroPiezas(getValues("generico"));
  }, [watch("generico")]);

  // useEffect(() => {
  //   console.log(lpn);
  // }, [lpn]);

  const getDobMaestroPieza = async (articulo: string) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Buscando Articulo..."));
      const response = unwrapResult(await dispatch(DobMaestroPiezaliceRequests.GetByArticulo(articulo)));
      if (response) {
        setValue("dobMaestroPiezaId", response.id);
        setMaestroPieza(response);
      } else {
        openNotificationUI("No se encontro el articulo", "error");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI("Ocurrio un Error al obtener la pieza", "error");
      console.error(e);
    }
  };

  const handleKeyPress = async (e) => {
    // console.log(e);
    if ((e.code == "Backspace" || e.code == "Delete") && maestroPieza) {
      setMaestroPieza(null);
      setValue("dobMaestroPiezaId", 0);
      return;
    }
    if (e.code == "Enter" || e.code == "NumpadEnter" || e.type == "blur") {
      const articulo = e.target.value;
      if (!articulo) {
        openNotificationUI("Ingrese Un codigo de articulo", "error");
        return;
      }
      getDobMaestroPieza(articulo);
    }
  };

  const handleOnChange = (e) => {
    // console.log(e)
    setArticulo(e.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-5">
        <TextField
          label="ARTICULO"
          onKeyDown={handleKeyPress}
          onChange={(e) => handleOnChange(e)}
          value={articulo}
          disabled={data && data?.id != null}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* <Controller
          name="generico"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione un generico</InputLabel>
              <Select {...field} variant="standard">
                {genericos &&
                  genericos.map((ge) => (
                    <MenuItem key={ge} value={ge}>
                      <div className="w-full">
                        <div>{ge}</div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        /> */}

          {/* <Controller
          name="dobMaestroPieza.articulo"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error} >
              <TextField label="ARTICULO" {...field}  onKeyDown={handleKeyPress}/>
              {!!error && error.type != "validate" && <FormHelperText>{error.type}</FormHelperText>}
              {!!error && error.type == "validate" && (
                <FormHelperText>El lpn ya existe con ese generico</FormHelperText>
              )}
            </FormControl>
          )}
        /> */}

          {maestroPieza && (
            <>
              <TextField label="Generico" disabled={true} value={maestroPieza.generico} />
              <TextField label="Descripcion" disabled={true} value={maestroPieza.descripcion} />
            </>
          )}
          {/* <Controller
          name="dobMaestroPiezaId"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione un articulo</InputLabel>
              <Select {...field} variant="standard" disabled={maestroPiezas?.length == 0}>
                {maestroPiezas &&
                  maestroPiezas.map((dobM) => (
                    <MenuItem key={dobM.id} value={dobM.id}>
                      <div className="w-full">
                        <div>{dobM.articulo}</div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        /> */}
          <Controller
            name="lpn"
            control={control}
            rules={{ required: true, validate: onValidateLPN }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <TextField label="LPN" {...field} disabled={watch("dobMaestroPieza.articulo") == ""} />
                {!!error && error.type != "validate" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "validate" && (
                  <FormHelperText>El lpn ya existe con ese generico</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <div className="flex gap-10 justify-between">
            <Controller
              name="cantDob"
              control={control}
              rules={{ required: true, min: { value: 1, message: "El valor tiene que ser mayor a 0" } }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField label="Cantidad Dobladora" {...field} type="number" />
                  {!!error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="cantSol"
              control={control}
              rules={{ required: true, min: { value: 1, message: "El valor tiene que ser mayor a 0" } }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField label="Cantidad Soldadura" {...field} type="number" />
                  {!!error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="text-center">
            {watch("diferencia") ? (
              <TextField label="Diferencia?" variant="filled" color="error" focused value="Hay diferencia" />
            ) : (
              <TextField label="Diferencia?" variant="filled" color="success" focused value="No hay diferencia" />
            )}
          </div>
          <FormButtons onCancel={() => setModal(false)} />
        </form>
      </div>
    </div>
  );
};
