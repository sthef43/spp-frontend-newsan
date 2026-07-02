import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { PeopleAltRounded, WorkspacesRounded } from "@mui/icons-material";
import { ProcesosTransferenciaUsuariosMain } from "../pages/UsuariosPages/ProcesosTransferenciaUsuariosMain";
import { ProcesosUsuariosMain } from "../pages/ProcesosPages/ProcesosUsuariosMain";

export const LayoutProcesosAndUsuarios = () => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("usuarios");

  const cambiarMenu = (componenteSeleccionado: string) => {
    switch (componenteSeleccionado) {
      case "usuarios":
        return <>{componenteSeleccionado == "usuarios" && <ProcesosTransferenciaUsuariosMain />}</>;
      case "procesos":
        return <>{componenteSeleccionado == "procesos" && <ProcesosUsuariosMain />}</>;
    }
  };

  useEffect(() => {
    TitleChanger("Crear Usuarios y Procesos");
  }, []);

  return (
    <main className="w-screen h-[100vh]">
      <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md bg-secondaryNew">
        <ul className="flex flex-row items-center gap-5 h-full w-full justify-evenly">
          <li
            onClick={() => {
              setSubMenuSeleccionado("usuarios");
            }}
            className={`${
              subMenuSeleccionado == "usuarios"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <PeopleAltRounded color={subMenuSeleccionado == "usuarios" ? "primary" : "disabled"} />
            <div>
              <p>Usuarios</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("procesos");
            }}
            className={`${
              subMenuSeleccionado == "procesos"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <WorkspacesRounded color={subMenuSeleccionado == "procesos" ? "primary" : "disabled"} />
            <div>
              <p>Procesos</p>
            </div>
          </li>
        </ul>
      </header>
      <section className="flex flex-row h-full p-4">
        {cambiarMenu(subMenuSeleccionado)}
        {/* <div className="w-1/4 px-6 border-l border-l-gray-300 shadow-md"> //Esto es por si algun dia se necesita que se muestren los colaboradores
                    <h2 className="text-xl my-4">Colaboradores</h2>
                    {listaColaboradores.map((elementos, index) => (
                        <div key={index} className="flex flex-col my-4">
                            <figure className="flex flex-row items-center gap-x-4 bg-secondaryNew rounded-md shadow-sm p-2">
                                <PersonOutline color="error" />
                                <div>
                                    <p className="text-textColor">{elementos.name}</p>
                                    <p className="text-xs text-gray-500">{elementos.puesto}</p>
                                </div>
                                {asignarIcono(elementos.estado)}
                            </figure>
                        </div>
                    ))}
                </div> */}
      </section>
    </main>
  );
};
