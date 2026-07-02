import { Button } from "@mui/material";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ISupermaestro } from "app/models/ISupermaestro";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
interface Props {
  generico: string;
}

export const SupermaestroDeleteAll = ({ generico }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();
  const supermaestros: ISupermaestro[] = useAppSelector<ISupermaestro[]>((data) => data.supermaestro.dataAll);
  const dispatch = useAppDispatch();
  const OnSubmit = async (e) => {
    try {
      const resp = await getConfirmation("Borrar todos los datos", "Esta seguro de borrar todos los datos?");
      if (resp) {
        const response = await dispatch(SupermaestroSliceRequest.multiDeleteRequest(supermaestros));
        openNotificationUI("Se eliminaron los datos correctamente", "success");
        const refresh = await dispatch(SupermaestroSliceRequest.getByGenerico(generico));
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
