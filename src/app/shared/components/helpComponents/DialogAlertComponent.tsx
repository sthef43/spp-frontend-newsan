/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlterDialogUISlice } from "app/Middleware/reducers/AlertDialogUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Button, Dialog, DialogContent, DialogTitle, Grow } from "@mui/material";
import React from "react";
import { MaterialButtons } from "../material-ui/MaterialButtons";
import { Warning } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Grow timeout={500} ref={ref} {...props} />;
});

export const DialogAlertComponent = () => {
  const distpach = useAppDispatch();

  const { Open, Mensaje, Title, Callback, Body, AceptarButton, RechazarButton } = useAppSelector(
    (state) => state.alertDialogUI
  );

  const handleClose = (bo: boolean) => {
    Callback(bo);
    distpach(AlterDialogUISlice.actions.AlterDialogUIclose());
  };

  const classes = MaterialButtons();
  return (
    <>
      <Dialog
        TransitionComponent={Transition}
        PaperProps={{ sx: { borderRadius: "10px", height: "fit-content", maxWidth: "700px", width: "500px" } }}
        open={Open}
        disableEscapeKeyDown>
        {Open && (
          <>
            <div className="flex justify-center mt-4">
              <div className="bg-[var(--warning-color)] rounded-full">
                <Warning sx={{ fontSize: "3.5rem", padding: "10px", fill: "#F59E0B" }} color="warning" />
              </div>
            </div>
            <DialogTitle id="alert-dialog-title" className="text-center w-full text-2xl py-4 font-semibold capitalize">
              {`¿${Title}?`}
            </DialogTitle>
            {Body ? (
              Body
            ) : (
              <DialogContent
                id="alert-dialog-content"
                className="text-center w-full flex items-center justify-center mb-2 p-0 flex-col">
                <p className="text-lg w-10/12 whitespace-pre-line">{Mensaje}</p>
              </DialogContent>
            )}
            <div className="m-2 pb-2 flex flex-row gap-x-3 justify-center">
              <Button
                onClick={() => {
                  handleClose(true);
                }}
                className={`${classes.blueButton} rounded-xl`}
                variant="contained">
                {AceptarButton.trim().length > 0 ? AceptarButton : "Aceptar"}
              </Button>
              <Button
                onClick={() => {
                  handleClose(false);
                }}
                className={`${classes.redButton} rounded-xl`}
                variant="contained"
                autoFocus>
                {RechazarButton.trim().length > 0 ? RechazarButton : "Cancelar"}
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};
