import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ISuperCargalinea } from "../../../../../models/ISuperCargalinea";
import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
interface Props {
  superCargalinea: ISuperCargalinea[];
  refresh: () => void;
}

export const ComercialDeleteAll = ({ superCargalinea, refresh }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const OnSubmit = async (e) => {
    try {
      const resp = await getConfirmation("Borrar todos los datos", "Esta seguro de borrar todos los datos?");
      if (resp) {
        const response = await dispatch(SuperCargalineaSliceRequests.multiDeleteRequest(superCargalinea));
        openNotificationUI("Se eliminaron los datos correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  return (
    <div className="pt-1 flex justify-around ">
      <Button className={buttonClasses.yellowButton} variant="contained" onClick={OnSubmit}>
        Borrar todos los datos
      </Button>
    </div>
  );
};
