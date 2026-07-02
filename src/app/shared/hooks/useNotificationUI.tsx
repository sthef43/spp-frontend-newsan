import { NotificationSlice } from "app/Middleware/reducers/notificationUISlice";
import { useAppDispatch } from "app/core/store/store";
import { AlertColor } from "@mui/material/Alert";

export const useNotificationUI = () => {
  // const { openDialog } = React.useContext(ConfirmationDialogContext);
  const dispatch = useAppDispatch();
  function openNotificationUI(mensaje: string, type: AlertColor): void {
    dispatch(NotificationSlice.actions.notificationUIopen({ Mensaje: mensaje, type: type }));
  }

  return { openNotificationUI };
};
