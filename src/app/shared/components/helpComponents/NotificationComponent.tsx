import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NotificationSlice } from "app/Middleware/reducers/notificationUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { AlertColor, AlertTitle } from "@mui/material";

export const NotificationComponent = () => {
  const dispatch = useAppDispatch();
  const { open, type, Mensaje } = useAppSelector((state) => state.notificationUI);

  const handleClose = (e, reason?) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(NotificationSlice.actions.notificationUIclose());
  };

  useEffect(() => {
    if (open === true) {
      setTimeout(() => {
        dispatch(NotificationSlice.actions.notificationUIclose());
      }, 4000);
    }
  }, [open]);

  const changeTitleAlert = (typeTitle: AlertColor) => {
    let titulo = "";
    switch (typeTitle) {
      case "success":
        titulo = "Correcto!";
        break;
      case "info":
        titulo = "Informacion!";
        break;
      case "warning":
        titulo = "Advertencia!";
        break;
      case "error":
        titulo = "Error!";
        break;
    }
    return titulo;
  };

  return (
    <div>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity={type} sx={{ borderRadius: "6px" }}>
          <AlertTitle>{changeTitleAlert(type)}</AlertTitle>
          {JSON.stringify(Mensaje)}
        </Alert>
      </Snackbar>
    </div>
  );
};
