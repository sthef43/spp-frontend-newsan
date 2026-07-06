import { Button, Input, InputLabel, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotaSectorPuestoSliceRequests } from "app/features/ingenieria/slices/DotaSectorPuestoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";

interface props {
  sectorPuestoEdit: IDotaSectorPuesto;
  setOpenModal: any;
  refreshSectoresPuestos: any; //Refresa los sectores y puestos, para cuando agregas o editas, o eliminas
}
export const DotacionEditCantidad = ({ sectorPuestoEdit, setOpenModal, refreshSectoresPuestos }: props) => {
  const { openNotificationUI } = useNotificationUI();
  const [cantidad, setCantidad] = useState(sectorPuestoEdit.cantidad);
  const dispatch = useAppDispatch();
  const colorButton = MaterialButtons();

  const guardar = async () => {
    const objectSubmit = { ...sectorPuestoEdit, cantidad, dotaPuesto: null, dotaSector: null };
    const result = unwrapResult(await dispatch(DotaSectorPuestoSliceRequests.PutRequest(objectSubmit)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenModal(false);
      refreshSectoresPuestos();
    }
  };

  return (
    <div className="p-2 flex flex-col">
      <Typography variant="h3">{"Puuesto - " + sectorPuestoEdit.dotaPuesto.nombre}</Typography>

      <InputLabel>Cantidad</InputLabel>
      <Input
        type="number"
        aria-label="cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(parseInt(e.target.value))}></Input>

      <Button className={colorButton.greenButton} onClick={guardar}>
        Guardar
      </Button>
    </div>
  );
};
