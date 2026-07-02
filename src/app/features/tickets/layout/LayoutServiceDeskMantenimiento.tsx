import { FormatListNumberedRounded, SupervisorAccountRounded, WorkspacesRounded } from "@mui/icons-material"
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp"
import React, { useEffect, useState } from "react"
import { ListadoCategorias } from "../pages/ServiceDeskMantenimiento/ListadoCategorias"
import { ListadoGrupoProcesos } from "../pages/ServiceDeskMantenimiento/ListadoGrupoProcesos"
import { ListadoItems } from "../pages/ServiceDeskMantenimiento/ListadoItems"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const LayoutServiceDeskMantenimiento = () => {

    const { TitleChanger } = useTitleOfApp()

    const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("items")

    const cambiarMenu = (componenteSeleccionado: string) => {
        switch (componenteSeleccionado) {
            case "items":
                return (
                    <>
                        {componenteSeleccionado == "items" && (
                            <ListadoItems/>
                        )}
                    </>
                )
            case "procesos":
                return (
                    <>
                        {componenteSeleccionado == "procesos" && (
                            <ListadoGrupoProcesos />
                        )}
                    </>
                )
            case "categorias":
                return (
                    <>
                        {componenteSeleccionado == "categorias" && (
                            <ListadoCategorias />
                        )}
                    </>
                )
        }
    }

    // const listaColaboradores: IColaboradores[] = [
    //     { name: "Juan Perez", puesto: "Sistemas", estado: "aprobado" },
    //     { name: "Maria Garcia", puesto: "Calidad", estado: "ocupado" },
    //     { name: "Carlos Ruiz", puesto: "Ingenieria de testing", estado: "aprobado" },
    //     { name: "Ana Lopez", puesto: "Sistemas", estado: "ocupado" }
    // ]

    // const asignarIcono = (estado: string) => {
    //     switch (estado) {
    //         case "aprobado":
    //             return (
    //                 <CheckCircleOutline color="success" />
    //             )
    //         case "ocupado":
    //             return (
    //                 <LoopOutlined color="action" />
    //             )
    //         default:
    //             return (
    //                 <QuestionAnswerOutlined color="warning" />
    //             )
    //     }
    // }

    useEffect(() => {
        TitleChanger("Panel de Mantenimiento")
    }, [])

    return (
        <main className="w-screen h-[100vh]">
            <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md bg-secondaryNew">
                <ul className="flex flex-row items-center gap-5 h-full w-[70%]">
                    <li onClick={() => { setSubMenuSeleccionado("items") }} className={`${subMenuSeleccionado == "items" ? 'border-b border-b-blue-500 text-blue-500 hover:bg-transparent' : 'border-none'} barraNavegacionLayouts`}>
                        <FormatListNumberedRounded color={subMenuSeleccionado == "items" ? "primary" : "disabled"} />
                        <div>
                            <p>Listado Items</p>
                        </div>
                    </li>
                    <li onClick={() => { setSubMenuSeleccionado("categorias") }} className={`${subMenuSeleccionado == "categorias" ? 'border-b border-b-blue-500 text-blue-500 hover:bg-transparent' : 'border-none'} barraNavegacionLayouts`}>
                        <SupervisorAccountRounded color={subMenuSeleccionado == "categorias" ? "primary" : "disabled"} />
                        <div>
                            <p>Categorias</p>
                        </div>
                    </li>
                    <li onClick={() => { setSubMenuSeleccionado("procesos") }} className={`${subMenuSeleccionado == "procesos" ? 'border-b border-b-blue-500 text-blue-500 hover:bg-transparent' : 'border-none'} barraNavegacionLayouts`}>
                        <WorkspacesRounded color={subMenuSeleccionado == "procesos" ? "primary" : "disabled"} />
                        <div>
                            <p>Grupos Procesos</p>
                        </div>
                    </li>
                </ul>
            </header>
            <section className="flex flex-row h-full">
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
        </main >
    )
}