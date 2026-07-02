/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { FC } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { GenerarLpnPadre } from "../Pages/GenerarLpnPadre";
import { TransferenciaLpnPadre } from "../Pages/TransferenciaLpnPadre";
import { Fade } from "@mui/material";
import { RecepcionLpnPadre } from "../Pages/RecepcionLpnPadre";

interface Props {
  opcionId: number;
}

//ESTE COMPONENTE POR CAMBIOS DE LOGICA
export const OpcionesDeTransferencia: FC<Props> = ({ opcionId }) => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const Seleccion = (opcionId: number) => {
    switch (opcionId) {
      case 1:
        return <GenerarLpnPadre />;
      case 2:
        return <TransferenciaLpnPadre />;
      case 3:
        return <RecepcionLpnPadre />;
    }
  };

  return (
    <Fade timeout={1000} in={opcionId !== 0}>
      <section key={opcionId}>{Seleccion(opcionId)}</section>
    </Fade>
  );
};
