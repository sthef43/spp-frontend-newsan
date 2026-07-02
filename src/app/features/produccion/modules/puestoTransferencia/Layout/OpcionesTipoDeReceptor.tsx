/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { OutboxRounded } from "@mui/icons-material";
import { PuestoTransferenciaSupervisor } from "../Pages/PuestoTrasnferenciaSupervisor";

export const OpcionesTipoDeReceptor = () => {
  const { control } = useForm();

  const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("supervisor");

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const cambiarMenu = (componenteSeleccionado: string) => {
    switch (componenteSeleccionado) {
      case "supervisor":
        return <>{componenteSeleccionado == "supervisor" && <PuestoTransferenciaSupervisor />}</>;
    }
  };

  return (
    <main>
      <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md bg-secondaryNew text-textColor">
        <ul className="flex flex-row items-center gap-5 h-full w-full justify-evenly">
          <li
            onClick={() => {
              setSubMenuSeleccionado("supervisor");
            }}
            className={`${
              subMenuSeleccionado == "supervisor"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <OutboxRounded color={subMenuSeleccionado == "supervisor" ? "primary" : "disabled"} />
            <div>
              <p>Comienzo</p>
            </div>
          </li>
          {/* <li onClick={() => { setSubMenuSeleccionado("operario") }} className={`${subMenuSeleccionado == "operario" ? 'border-b border-b-blue-500 text-blue-500 hover:bg-transparent' : 'border-none'} barraNavegacionLayouts w-[22%]`}>
                        <MoveToInboxRounded color={subMenuSeleccionado == "operario" ? "primary" : "disabled"} />
                        <div>
                            <p>Fin</p>
                        </div>
                    </li> */}
        </ul>
      </header>
      <section className="flex flex-col p-4">{cambiarMenu(subMenuSeleccionado)}</section>
    </main>
  );
};
