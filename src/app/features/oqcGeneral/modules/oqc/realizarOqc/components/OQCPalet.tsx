import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCModelo } from "app/models/IOQModelo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { OQCModeloSliceRequests, oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

interface IOQCPaletProps {
  closeModal: (state: boolean) => void;
}
const defaultValues = {
  oqcModeloId: 0,
  oqcDesignadaId: 0,
  lpn: "",
  cerrado: false,
  conforme: false
};
export const OQCPalet = ({ closeModal }: IOQCPaletProps): JSX.Element => {
  const oqcsDes = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);
  const linea = useAppSelector<ILineaProduccion>((state) => state.lineaProduccion.object);
  const oqcsModelos = useAppSelector<IOQCModelo[]>((state) => state.oqcModelo.dataAll);
  const oqcPalet = useAppSelector<IOQCPalet>((state) => state.oqcPalet.object);

  const [cerrar, setCerrar] = useState(false);
  const [numSerie, setNumSerie] = useState(null);

  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const color = MaterialButtons();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { control, setValue, watch, getValues } = useForm({
    defaultValues: defaultValues
  });

  const onChangeSerie = (e) => {
    e.preventDefault();
    const {
      target: { value }
    } = e;
    setNumSerie(value);
  };
  const onGetModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(linea.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetPalet = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(
        OQCPaletSliceRequests.getByOQCandModelo({ oqcDesiId: oqcsDes.id, modeloId: getValues("oqcModeloId") })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getGenericLPN = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const lpn = unwrapResult(await dispatch(OQCPaletSliceRequests.getLPNGeneric()));
      setValue("lpn", lpn);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onClosePalet = async (conforme: boolean) => {
    try {
      if (await getConfirmation("Cerrar palet condicional", "Seguro que quiere cerra el palet?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const lpn = oqcPalet.lpn + (conforme ? "A" : "D");
        const palet: IOQCPalet = {
          ...oqcPalet,
          cerrado: true,
          conforme,
          oqcDesignada: null,
          oqcDesignadaResultado: null,
          lpn
        };
        await dispatch(OQCPaletSliceRequests.PutRequest(palet));
        openNotificationUI("Se cerro el palet con exito", "success");
        onGetPalet();
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onSearchModelo = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const modelo = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.getModeloBySerieRequest(numSerie)));
      const modeloId = oqcsModelos.find((model) => model.modeloNewsan == modelo)?.id;
      if (modeloId) {
        setValue("oqcModeloId", modeloId);
      } else {
        openNotificationUI(
          "El modelo no esta cargado en la base de datos, por favor comuniquese con un administrador.",
          "error"
        );
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onRealizarOQC = async () => {
    const oqcModelo = oqcsModelos.find((oqcm) => oqcm.id == getValues("oqcModeloId"));
    dispatch(oqcModeloSlice.actions.setObject(oqcModelo));
    history.push(`oqc-realizar-designada/${numSerie}`);
  };
  const onSetPalet = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const palet = unwrapResult(await dispatch(OQCPaletSliceRequests.PostRequest(getValues())));
      dispatch(oqcPaletSlice.actions.setObject(palet));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      onRealizarOQC();
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getStateGOOD = (): boolean => {
    let state = false;
    oqcPalet.oqcDesignadaResultado.forEach((oqcDR) => {
      oqcDR.oqcHallazgoResult.forEach((oqcHR) => {
        if (!oqcHR.state) state = true;
      });
    });
    return state;
  };
  const getStateNG = (): boolean => {
    let state = true;
    oqcPalet.oqcDesignadaResultado.forEach((oqcDR) => {
      oqcDR.oqcHallazgoResult.forEach((oqcHR) => {
        if (!oqcHR.state) state = false;
      });
    });
    return state;
  };
  useEffect(() => {
    linea && onGetModelos();
  }, [linea]);
  useEffect(() => {
    oqcsDes && setValue("oqcDesignadaId", oqcsDes.id);
  }, [oqcsDes]);
  useEffect(() => {
    getValues("oqcModeloId") != 0 && onGetPalet();
    setCerrar(false);
  }, [watch("oqcModeloId")]);
  useEffect(() => {
    oqcPalet && setValue("lpn", oqcPalet.lpn);
    console.log(oqcPalet);

    !oqcPalet && getGenericLPN();
  }, [oqcPalet]);
  return (
    <form className="flex justify-center m-4 gap-5 flex-col">
      <div className="flex gap-5">
        <FormControl>
          <TextField value={numSerie} label="Escanee el número de serie" onChange={onChangeSerie} />
        </FormControl>
        <Button color="info" variant="contained" onClick={onSearchModelo}>
          Buscar modelo
        </Button>
      </div>
      <Controller
        control={control}
        name="oqcModeloId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Modelo</InputLabel>
            <Select {...field} fullWidth disabled>
              {oqcsModelos?.map((modelo) => (
                <MenuItem value={modelo.id} key={modelo.id}>
                  <ListItemText>{modelo.modeloNewsan}</ListItemText>
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      {getValues("oqcModeloId") != 0 && oqcPalet && (
        <div className="flex gap-5 flex-col">
          <Controller
            control={control}
            name="lpn"
            rules={{ required: "El campo es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <TextField {...field} label="LPN del palet" disabled />
                {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Divider />
          <Typography align="center">
            Realizadas {oqcPalet.oqcDesignadaResultado.length}/{oqcPalet.oqcDesignada.cantidad}
          </Typography>
          <Divider />
          {!cerrar && (
            <div className="flex gap-5">
              <Button
                color="success"
                variant="contained"
                onClick={onRealizarOQC}
                disabled={oqcPalet.oqcDesignadaResultado.length == oqcPalet.oqcDesignada.cantidad}>
                Realizar prueba OQC
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => setCerrar(true)}
                disabled={oqcPalet.oqcDesignadaResultado?.length == 0}>
                Cerrar palet
              </Button>
            </div>
          )}
          {cerrar && (
            <div className="flex justify-center gap-5">
              <Button className={color.blueButton} onClick={() => onClosePalet(true)} disabled={getStateGOOD()}>
                Cerrar GOOD
              </Button>
              <Button className={color.redButton} onClick={() => onClosePalet(false)} disabled={getStateNG()}>
                Cerrar NO GOOD
              </Button>
            </div>
          )}
        </div>
      )}
      {getValues("oqcModeloId") != 0 && !oqcPalet && (
        <div className="flex gap-5 flex-col">
          <Controller
            control={control}
            name="lpn"
            rules={{ required: "El campo es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <TextField {...field} label="LPN del palet nuevo" disabled />
                {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Button color="success" disabled={watch("lpn").length == 0} variant="contained" onClick={onSetPalet}>
            Realizar prueba OQC
          </Button>
        </div>
      )}
    </form>
  );
};
