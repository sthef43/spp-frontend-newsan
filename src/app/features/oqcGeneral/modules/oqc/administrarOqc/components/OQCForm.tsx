/* eslint-disable @typescript-eslint/no-explicit-any */
import { Visibility } from "@mui/icons-material";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Zoom
} from "@mui/material";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IEmailGroup, IPlant, IProducto } from "app/models";
import { IOQC } from "app/models/IOQC";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OQCBloqueForm } from "./OQCBloqueForm";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { unwrapResult } from "@reduxjs/toolkit";
import { OQCSliceRequests } from "app/features/oqcGeneral/slices/OQCSlice";
import { OQCBloqueGroupSliceRequests } from "app/features/oqcGeneral/slices/OQCBloqueGroupSlice";

interface IOQCForm {
  closeModal: (state: boolean) => void;
  edicionActiva: boolean;
  oqcSeleccionado: IOQC;
}

export interface defaultValues {
  nombre: string;
  numeroRegistro: string;
  versionado: string;
  oqcBloqueGroup?: any[];
  emailGroupId: number;
  productoId: number;
  validarNumSerie: boolean;
  email: boolean;
  emailNG: boolean;
  botonBloque: boolean;
}

const defaultValuesVar = {
  nombre: "",
  numeroRegistro: "",
  versionado: "",
  oqcBloqueGroup: [],
  emailGroupId: 0,
  productoId: 0,
  validarNumSerie: true,
  email: true,
  emailNG: false,
  botonBloque: false
};

export const OQCForm = ({ closeModal, edicionActiva, oqcSeleccionado }: IOQCForm): JSX.Element => {
  const oqc = useAppSelector<IOQC>((state) => state.oqc.object as IOQC);
  const { control, handleSubmit, setValue, watch } = useForm<defaultValues>({
    defaultValues: edicionActiva ? oqcSeleccionado : defaultValuesVar
  });

  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const planta = useAppSelector<IPlant>((state) => state.plant.object);
  const emails = useAppSelector<IEmailGroup[]>((state) => state.emailGroup.dataAll);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [images, setImages] = useState<Array<{ oqcBloqueId: number; image: unknown }>>([]);
  const [oqcBloqueGroupRemove, setOQCBloqueGroupRemove] = useState<number[]>([]);

  const watchOqcBloqueGroup: any[] = watch("oqcBloqueGroup");
  const watchEmail: boolean = watch("email");

  const onGetEmails = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      planta && (await dispatch(EmailGroupSliceRequests.getAllByPlantIdRequest(planta.id)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onSubmit = async (e: defaultValues) => {
    const nuevoRegistro = getOqcData(e);
    try {
      if (watchOqcBloqueGroup.length == 0) {
        openNotificationUI("Tiene que agregar al menos un bloque", "error");
        return;
      }
      if (watchOqcBloqueGroup.find((blg: IOQCBloqueGroup) => blg.oqcBloqueId == 0)) {
        openNotificationUI("Tiene un bloque sin asignar", "error");
        return;
      }
      if (!watchEmail) {
        e.emailNG = false;
      }
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      console.log(nuevoRegistro);
      // Edicion
      let response: IOQC;
      if (oqc) {
        response = unwrapResult(await dispatch(OQCSliceRequests.PutRequest(nuevoRegistro)));
        if (oqcBloqueGroupRemove.length > 0 && oqc) {
          for (const oqcBloqueG in oqcBloqueGroupRemove) {
            const oqcBloqueGroupRemoveId = oqcBloqueGroupRemove[oqcBloqueG];
            await dispatch(OQCBloqueGroupSliceRequests.deleteRequest(oqcBloqueGroupRemoveId));
          }
        }
        // Posteo
      } else {
        response = unwrapResult(await dispatch(OQCSliceRequests.NestedAddRequest(nuevoRegistro)));
      }
      if (images.length > 0) {
        const oqcBloquesId: number[] = images.map((image) => image.oqcBloqueId);
        const newImages: Array<{ oqcBloqueGroupId: number; image: unknown }> = [];
        response.oqcBloqueGroup.forEach((oqc) => {
          if (oqcBloquesId.includes(oqc.oqcBloqueId)) {
            const image = images.find((img) => img.oqcBloqueId == oqc.oqcBloqueId).image;
            newImages.push({ oqcBloqueGroupId: oqc.id, image });
          }
        });
        await dispatch(OQCBloqueGroupSliceRequests.uploadMultipleImageRequest(newImages));
      }
      await dispatch(OQCSliceRequests.getAllByProductoIdRequest(producto.id));
      closeModal(false);
      openNotificationUI("Se agrego con éxito", "success");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getOqcData = (data: defaultValues): defaultValues => {
    const { ...rest } = edicionActiva ? oqcSeleccionado : data;
    return {
      ...rest,
      emailGroupId: data.emailGroupId,
      validarNumSerie: data.validarNumSerie,
      email: data.email,
      emailNG: data.emailNG,
      botonBloque: data.botonBloque,
      versionado: data.versionado,
      nombre: data.nombre,
      numeroRegistro: data.numeroRegistro,
      productoId: producto.id
    };
  };

  useEffect(() => {
    planta && onGetEmails();
  }, [planta]);

  useEffect(() => {
    if (!watchEmail) {
      console.log("watchEmail", watchEmail);
    }
  }, [watchEmail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Nombre" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="numeroRegistro"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Numero de registro" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="versionado"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Versión" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="emailGroupId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione un grupo de emails</InputLabel>
            <Select
              sx={{ "& .MuiSelect-select": { display: "flex", alignItems: "center" } }}
              {...field}
              label="Seleccione un grupo de emails"
              fullWidth>
              {emails?.map((email) => (
                <MenuItem value={email.id} key={email.id}>
                  <ListItemText>{email.name}</ListItemText>
                  <Tooltip
                    sx={{ justifyContent: "center" }}
                    TransitionComponent={Zoom}
                    title={email.emails.split(";").join(" - ")}>
                    <ListItemIcon>
                      <Visibility fontSize="small" />
                    </ListItemIcon>
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="validarNumSerie"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar número de serie"
              control={<Checkbox {...field} defaultChecked={oqc ? oqc.validarNumSerie : true} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Envio de email"
              control={<Checkbox {...field} defaultChecked={oqc ? oqc.email : true} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      {watch("email") && (
        <Controller
          control={control}
          name="emailNG"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <FormControlLabel
                label="Envio de email solo en caso de NG?"
                control={<Checkbox {...field} defaultChecked={oqc ? oqc.emailNG : false} />}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <Divider />
      <OQCBloqueForm
        setValueBloqueGroup={(value) => setValue("oqcBloqueGroup", value)}
        imagenes={images}
        setImages={setImages}
        setOQCBloqueGroupRemove={setOQCBloqueGroupRemove}
        closeModal={closeModal}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
