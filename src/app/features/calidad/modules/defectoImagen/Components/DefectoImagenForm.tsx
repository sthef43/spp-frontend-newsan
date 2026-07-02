import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";
import { DefectoImagenSliceRequest } from "app/Middleware/reducers/DefectoImagenSlice";
import { DefectoSliceRequest } from "app/Middleware/reducers/DefectoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OrigenesSliceRequest } from "app/Middleware/reducers/OrigenSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IDefecto } from "app/models/IDefecto";
import { IDefectoImagen } from "app/models/IDefectoImagen";
import { IOrigenes } from "app/models/IOrigen";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface IDefectoImagenForm {
  closeModal: (state: boolean) => void;
  refresh: () => void;
  tipoUnidad: string;
  familia: string;
}
const defaultValues = {
  codigoDefecto: "",
  numImagen: "",
  codigoOrigen: "",
  generico: "",
  idDefecto: 0
};
export const DefectoImagenForm = ({ closeModal, refresh, tipoUnidad, familia }: IDefectoImagenForm): JSX.Element => {
  const defectoImagen = useAppSelector<IDefectoImagen>((state) => state.defectoImagen.object);
  const defectosImagenes = useAppSelector<IDefectoImagen[]>((state) => state.defectoImagen.dataAll);
  const lineaProdFamilia = useAppSelector((state) => state.lineaProduccionFamilia.object);
  const defectos = useAppSelector<IDefecto[]>((state) => state.defecto.dataAll);
  const origenes = useAppSelector<IOrigenes[]>((state) => state.origenes.dataAll);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defectoImagen ? defectoImagen : defaultValues
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onSubmit = async (e) => {
    const objE = { ...e, generico: familia };
    try {
      if (defectosImagenes.find((di) => di.idDefecto == e.idDefecto && di.numImagen == e.numImagen)) {
        openNotificationUI("El codigo de defecto ya existe con el numero de imagen", "error");
        return;
      }
      if (
        defectosImagenes.some(
          (di) =>
            (!defectoImagen && di.idDefecto === e.idDefecto) ||
            (defectoImagen && di.idDefecto === e.idDefecto && defectoImagen.idDefectoImagen !== di.idDefectoImagen)
        )
      ) {
        openNotificationUI("El código de defecto ya existe con otro número de imagen", "error");
        return;
      }
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      defectoImagen
        ? await dispatch(DefectoImagenSliceRequest.PutRequest(e))
        : await dispatch(DefectoImagenSliceRequest.PostRequest(objE));
      openNotificationUI(`Se ${defectoImagen ? "edito" : "agrego"} correctamente`, "success");
      refresh();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      closeModal(false);
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(DefectoSliceRequest.GetAllRequest());
      await dispatch(OrigenesSliceRequest.GetAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    if (lineaProdFamilia) setValue("generico", lineaProdFamilia.familia.nombre);
  }, [lineaProdFamilia]);

  useEffect(() => {
    onGetAll();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
      <Controller
        control={control}
        name="numImagen"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Número en la imagen" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      {defectoImagen && (
        <Controller
          control={control}
          name="codigoDefecto"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField disabled {...field} label="Codigo defecto actual" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <Autocomplete
        options={defectos ? defectos : []}
        getOptionLabel={(defecto) =>
          typeof defecto === "string" ? "" : defecto.codigoDefecto + " - " + defecto.descripcion
        }
        onChange={(e, newvalue: any) => {
          if (newvalue?.idDefecto) {
            setValue("codigoDefecto", newvalue.codigoDefecto);
            setValue("idDefecto", newvalue.idDefecto);
          }
        }}
        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Código defecto" />}
      />
      {defectoImagen && (
        <Controller
          control={control}
          name="codigoOrigen"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField disabled {...field} label="Codigo origen actual" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <Autocomplete
        options={origenes ? origenes : []}
        getOptionLabel={(origen) =>
          typeof origen === "string" ? "" : origen.codigoOrigen + " - " + origen.descripcion
        }
        onChange={(e, newvalue: any) => {
          if (newvalue?.idOrigen) {
            setValue("codigoOrigen", newvalue.codigoOrigen);
          }
        }}
        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Código origen" />}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
