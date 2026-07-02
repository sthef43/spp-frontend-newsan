import React, { useState } from "react";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
interface props {
  setOpenPopup: any;
  editState?: any;
}

export const MailForm = ({ setOpenPopup, editState }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();

  const sendEmail = async () => {
    console.log(editState);
    const props = {
      // fecha: moment(editState[0].fechaProgramado).format('DD-MM-YYYY'),
      fecha: "DD-MM-YYYY",
      prioridad: editState[0].prioridad,
      planta: "5",
      // planta: editState.contEmbarque.contPlanProduccion.contPlanta.nombre,
      contenedor: editState[0].lpn,
      emailsDestiners: emails
    };
    console.log(props);

    try {
      const enviado = await dispatch(EmailSliceRequest.EmailPlanificacionContenedores(props));
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al enviar mails." + x, "error");
    }
  };

  //Email
  const [emails, setEmails] = useState("");
  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <div style={{ flex: "1 1 100%" }}>
        <GroupEmailForm callback={callbackEmails}></GroupEmailForm>
      </div>

      <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
        <Button onClick={sendEmail} sx={{ marginLeft: 3 }} className={buttonClasses.greenButton} variant="contained">
          Enviar
        </Button>
      </div>
    </div>
  );
};
