import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LineaPuestoSlice, LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { ILineaPuesto } from "app/models/ILineaPuesto";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { LineaPuestoTableroSliceRequest } from "app/Middleware/reducers/LineaPuestoTableroSlice";
interface ISelectTableroPuesto {
  closeModal: (state: boolean) => void;
}
export const SelectTableroPuesto = ({ closeModal }: ISelectTableroPuesto): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const color = MaterialButtons();

  const [lineaPuestos, setlineaPuestos] = useState<ILineaPuesto[]>([]);

  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const getLineasPuestos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const rutaActiva = unwrapResult(
        await dispatch(LineaProduccionRutasSliceRequest.getRutaActivaByLineaIdPuestoFin(linea.id))
      );
      const response = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllByLineaId(linea.id)));
      if (rutaActiva) {
        // eslint-disable-next-line prefer-const
        let lineaPuestosArr: ILineaPuesto[] = [];
        rutaActiva.rutas.mapasRutas.forEach((mapaRuta) => {
          const lineaP = response.find((lineaPuesto) => lineaPuesto.puestoId == mapaRuta.desdePuestoId);
          if (lineaP) lineaPuestosArr.push(lineaP);
        });
        if (lineaPuestosArr.length > 0) setlineaPuestos(lineaPuestosArr);
      } else {
        openNotificationUI("No hay ruta activa", "error");
        setlineaPuestos([]);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onChangeLineaPuesto = async (id) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaPuestoTableroSliceRequest.getByLineaPuestoId(id));
      dispatch(LineaPuestoSlice.actions.selectLineaPuesto(id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onSubmit = () => {
    closeModal(false);
  };
  useEffect(() => {
    linea && getLineasPuestos();
  }, [linea]);
  useEffect(() => {
    linea && lineaPuestos.length == 0 && openNotificationUI("No hay puestos asignado a la linea", "warning");
  }, [lineaPuestos]);
  useEffect(() => {
    !lineaPuestoTablero &&
      openNotificationUI("El puesto no esta configurado, por favor comuniquese con un adminitrados", "info");
  }, [lineaPuestoTablero]);
  return (
    <div className="w-full">
      <SelectOFPlantAndProducts selectLineas col>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Seleccione el puesto</InputLabel>
          <Select variant="standard" onChange={(e) => onChangeLineaPuesto(e.target.value)}>
            {lineaPuestos &&
              lineaPuestos.map((lineaPuesto) => (
                <MenuItem key={lineaPuesto.id} value={lineaPuesto.id}>
                  <div className="w-full">
                    <div>{lineaPuesto.puesto.nombre}</div>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </SelectOFPlantAndProducts>
      <div className="flex justify-center mt-5">
        <Button className={color.greenButton} disabled={!lineaPuestoTablero} onClick={onSubmit}>
          ABRIR
        </Button>
      </div>
    </div>
  );
};
