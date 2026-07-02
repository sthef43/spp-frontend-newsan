import { AddCircleOutlineOutlined, MessageOutlined, NotificationsOutlined } from "@mui/icons-material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { DotacionManteminientoSectores } from "../pages/DotacionMantenimientoTareas/DotacionManteminientoSectores";
import { DotacionMantenimientoGrupoSectores } from "../pages/DotacionMantenimientoTareas/DotacionMantenimientoGrupoSectores";
import { DotacionMantenimientoTareas } from "../pages/DotacionMantenimientoTareas/DotacionMantenimientoTareas";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const LayoutDotacionMantenimiento = () => {
  const { TitleChanger } = useTitleOfApp();

  const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("grupo");

  const cambiarMenu = (componenteSeleccionado: string) => {
    switch (componenteSeleccionado) {
      case "grupo":
        return <>{componenteSeleccionado == "grupo" && <DotacionMantenimientoGrupoSectores />}</>;
      case "tareas":
        return <>{componenteSeleccionado == "tareas" && <DotacionMantenimientoTareas />}</>;
      case "puestos":
        return <>{componenteSeleccionado == "puestos" && <DotacionManteminientoSectores />}</>;
    }
  };

  useEffect(() => {
    TitleChanger("Mantenimiento Dotacion");
  }, []);

  return (
    <main className="w-screen">
      <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md">
        <ul className="flex flex-row items-center gap-5 h-full w-[70%]">
          <li
            onClick={() => {
              setSubMenuSeleccionado("tareas");
            }}
            className={`${
              subMenuSeleccionado == "tareas"
                ? "border-b border-b-blue-500 text-blue-500 font-semibold hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <MessageOutlined color={subMenuSeleccionado == "tareas" ? "primary" : "disabled"} />
            <div>
              <p>Puestos</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("puestos");
            }}
            className={`${
              subMenuSeleccionado == "puestos"
                ? "border-b border-b-blue-500 text-blue-500 font-semibold hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <NotificationsOutlined color={subMenuSeleccionado == "puestos" ? "primary" : "disabled"} />
            <div>
              <p>Sectores</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("grupo");
            }}
            className={`${
              subMenuSeleccionado == "grupo"
                ? "border-b border-b-blue-500 text-blue-500 font-semibold hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <AddCircleOutlineOutlined color={subMenuSeleccionado == "grupo" ? "primary" : "disabled"} />
            <div>
              <p>Grupo De Sectores</p>
            </div>
          </li>
        </ul>
      </header>
      <section className="flex flex-row h-full">{cambiarMenu(subMenuSeleccionado)}</section>
    </main>
  );
};
