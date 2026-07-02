import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IProducto, ITurno } from "app/models";
import { IOQC } from "app/models/IOQC";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { Info } from "@mui/icons-material";
import { OQCDesignadaSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";
interface IOQCAsignarForm {
  closeModal: (state: boolean) => void;
  refresh?: () => void;
}

interface initialState {
  lineaProduccionId: number;
  turnoId: number;
  cantidad: number;
  oqcId: number;
  celulares: boolean;
  imei2: boolean;
  paletiza: boolean;
  lpn: boolean;
  chkManual: boolean;
  chkFichaTecnica: boolean;
  chkFichaGarantia: boolean;
  chkAccesoGuiado: boolean;
  chkEtiquetaEE: boolean;
  chkEtiquetaCNC: boolean;
  chkEtiquetaEAN: boolean;
  chkFeDeErratas: boolean;
  chkGuiaMagicControl: boolean;
  chkEtiquetaFuenteAlimentacion: boolean;
  chkEtiquetaCableUSB: boolean;
  chkEtiquetaFilmProtector: boolean;
  chkEtiquetaQr: boolean;
}
const defaultValues = {
  lineaProduccionId: 0,
  turnoId: 0,
  cantidad: 0,
  oqcId: 0,
  celulares: false,
  imei2: false,
  paletiza: false,
  lpn: false,
  chkManual: false,
  chkFichaTecnica: false,
  chkFichaGarantia: false,
  chkAccesoGuiado: false,
  chkEtiquetaEE: false,
  chkEtiquetaCNC: false,
  chkEtiquetaEAN: false,
  chkFeDeErratas: false,
  chkGuiaMagicControl: false,
  chkEtiquetaFuenteAlimentacion: false,
  chkEtiquetaCableUSB: false,
  chkEtiquetaFilmProtector: false,
  chkEtiquetaQr: false
};

export const OQCAsignarForm = ({ closeModal, refresh }: IOQCAsignarForm): JSX.Element => {
  const oqcsDes = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);
  const { control, handleSubmit, setValue, watch, getValues } = useForm<initialState>({
    defaultValues: oqcsDes ? oqcsDes : defaultValues
  });

  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const turnos = useAppSelector<ITurno[]>((state) => state.turno.dataAll);
  const lineas = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const oqc = useAppSelector<IOQC>((state) => state.oqc.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [disabledTurno, setDisabledTurno] = useState(false);

  const onSubmit = async (e) => {
    if (e.celulares & e.lpn) {
      openNotificationUI(
        "Está seleccionado: * Validar # de la Interface sin LPN y * Validar número de serie en la interface de EBS",
        "error"
      );
    } else {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        if (oqcsDes) {
          delete e.turno;
          delete e.lineaProduccion;
        }
        oqcsDes
          ? await dispatch(OQCDesignadaSliceRequests.PutRequest(e))
          : await dispatch(OQCDesignadaSliceRequests.PostRequest(e));
        refresh && refresh();
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        closeModal(false);
      } catch (e) {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        openNotificationUI(e, "error");
      }
    }
  };
  const onGetLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaProduccionSliceRequests.getAllByProductId(producto.id));
      await dispatch(TurnoSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    producto && onGetLineas();
  }, [producto]);

  useEffect(() => {
    oqc && setValue("oqcId", oqc.id);
  }, [producto]);
  useEffect(() => {
    if (getValues("paletiza")) {
      setValue("turnoId", turnos.find((t) => t.abreviatura.trim() == "A").id);
      setDisabledTurno(true);
    } else {
      setDisabledTurno(false);
    }
  }, [watch("paletiza")]);

  useEffect(() => {
    if (!getValues("celulares")) setValue("imei2", false);
  }, [watch("celulares")]);

  return (
    <form className="flex justify-center m-4 gap-5 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="lineaProduccionId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione una linea</InputLabel>
            <Select {...field} fullWidth label="Seleccione una linea">
              {lineas?.map((linea) => (
                <MenuItem value={linea.id} key={linea.id}>
                  <ListItemText>{linea.nombre}</ListItemText>
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="turnoId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione un turno</InputLabel>
            <Select {...field} fullWidth disabled={disabledTurno} label="Seleccione un turno">
              {turnos?.map((turno) => (
                <MenuItem value={turno.id} key={turno.id}>
                  <ListItemText>{turno.nombre}</ListItemText>
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="cantidad"
        rules={{ required: "El campo es requerido", min: { message: "La cantidad minima es de 1", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Cantidad" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      {oqc?.validarNumSerie && (
        <Controller
          control={control}
          name="lpn"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <FormControlLabel
                // label={watch("lpn") ? "Validar con LPN" : "Validar sin LPN"}
                label={"Validar número de la Interface sin LPN"}
                control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.lpn : false} />}
                // control={<Checkbox {...field} defaultChecked={checkLpn} />}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      {oqc?.validarNumSerie && (
        <Controller
          control={control}
          name="celulares"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <FormControlLabel
                label={"Validar número de serie en la interface de EBS"}
                control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.celulares : false} />}
                // control={<Checkbox {...field} defaultChecked={checkCelulares} />}
              />
              <Tooltip title="Chequear si desea validar el número de serie en la interface de EBS. Por ejemplo celulares valida en dicha interface ya que no tenemos acceso a sus declaraciones en la DB.">
                <Info color="info" />
              </Tooltip>
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      {watch("celulares") && (
        <Controller
          control={control}
          name="imei2"
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <FormControlLabel
                label="Validar dos imei"
                control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.imei2 : false} />}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <Controller
        control={control}
        name="paletiza"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Hacer pruebas oqc por palets"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.paletiza : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Divider />
      <Controller
        control={control}
        name="chkManual"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Manual"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkManual : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkFichaTecnica"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Ficha Técnica"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkFichaTecnica : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkFichaGarantia"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Ficha de Garantía"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkFichaGarantia : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkAccesoGuiado"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Acceso Guiado"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkAccesoGuiado : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaEE"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta EE"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaEE : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaCNC"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta CNC"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaCNC : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaEAN"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta EAN"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaEAN : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkFeDeErratas"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Fe De Erratas"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkFeDeErratas : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkGuiaMagicControl"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Guia Magic Control"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkGuiaMagicControl : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaFuenteAlimentacion"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta Fuente Alimentacion"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaFuenteAlimentacion : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaCableUSB"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta Cable USB"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaCableUSB : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaFilmProtector"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta Etiqueta Film Protector"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaFilmProtector : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="chkEtiquetaQr"
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormControlLabel
              label="Validar Etiqueta QR"
              control={<Checkbox {...field} defaultChecked={oqcsDes ? oqcsDes.chkEtiquetaQr : false} />}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
