import { AlterDialogUISlice } from "app/Middleware/reducers/AlertDialogUISlice";
import { useAppDispatch } from "app/core/store/store";

export const useConfirmationDialog = () => {
  // const { openDialog } = React.useContext(ConfirmationDialogContext);
  const dispatch = useAppDispatch();

  const getConfirmation = (
    Title: string,
    Mensaje: string,
    Body?: JSX.Element,
    AceptarButton?: string,
    RechazarButton?: string
  ) =>
    new Promise((res) => {
      dispatch(
        AlterDialogUISlice.actions.AlterDialogUIopen({
          Callback: res,
          Mensaje: Mensaje,
          Title: Title,
          AceptarButton: AceptarButton,
          RechazarButton: RechazarButton,
          Body: Body
        })
      );
    });
  return { getConfirmation };
};
