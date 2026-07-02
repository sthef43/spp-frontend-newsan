import { DoneAllOutlined, EmailOutlined } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import React, { useState } from "react"
import { INotificacionesModel } from "../../models/INotificaciones"
import { EnvioEmailModal } from "../../modals/EnvioEmailModal"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const NotificacionesPage = () => {
    //IMPORTANTE!!!
    //ESTE MODULO AUN NO ESTA EN FUNCIOAMIENTO HASTA QUE SE PUEDAN HACER LOS BACKGROUND SERVICE

    const [openModalEmail, setOpenModalEmail] = useState(false)

    //Lista de prueba hasta que tenga la base
    const [nuevasNotificaciones, setNuevaNotificaciones] = useState<INotificacionesModel[]>([
        { id: 1, estadoNotificaciones: "Nueva respuesta en el ticket #1", notificacionLeida: false, tituloNotificacion: "Hemos recibido su ticket", fechaHora: "2025-05-20 10:30" },
        { id: 2, estadoNotificaciones: "El estado del ticket #3", notificacionLeida: true, tituloNotificacion: "Cerrado", fechaHora: "2025-05-16 17:05" },
        { id: 3, estadoNotificaciones: "Se te ha asignado el ticket #2", notificacionLeida: false, tituloNotificacion: "Solicitud de nueva licencia...", fechaHora: "2025-05-18 14:00" },
    ])

    const cambiarEstadoNotificacion = (idNotificacion: number) => {
        const nuevaLista = nuevasNotificaciones.map((elementos) => {
            if (elementos.id == idNotificacion) {
                elementos.notificacionLeida = true
            }
            return elementos
        })
        setNuevaNotificaciones(nuevaLista)
    }

    const [notificacionSeleccionada, setNotificacionSeleccionada] = useState<INotificacionesModel>()
    const buscarNotificacion = (rowData: INotificacionesModel) => {
        setNotificacionSeleccionada(nuevasNotificaciones.find((elementos) => { return elementos.id === rowData.id }))
        setOpenModalEmail(true)
    }


    return (
        <main className="w-full h-full p-4">
            <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
                <div className="flex flex-col gap-y-2 justify-center w-full">
                    {nuevasNotificaciones.map((elementos) => (
                        <>
                            <figure key={elementos.id} className={`${elementos.notificacionLeida ? 'border-gray-200 bg-transparent' : 'border-red-600 bg-fondoTicketNotificacion'} flex flex-row items-center justify-between w-full border rounded-md p-4 shadow-md`}>
                                <div>
                                    <p className="text-sm mb-2">{elementos.estadoNotificaciones}: {elementos.tituloNotificacion}</p>
                                    <p className="text-xs text-gray-500">{elementos.fechaHora}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <div className={`${elementos.notificacionLeida ? 'hidden' : 'block'}`}>
                                        <Tooltip title="Marcar como leido">
                                            <span>
                                                <IconButton
                                                    onClick={() => { cambiarEstadoNotificacion(elementos.id) }}
                                                    size="small"
                                                    style={{ position: "relative" }}>
                                                    <DoneAllOutlined color="primary" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Enviar por email">
                                            <span>
                                                <IconButton
                                                    onClick={() => { buscarNotificacion(elementos) }}
                                                    size="small"
                                                    style={{ position: "relative" }}>
                                                    <EmailOutlined color="action" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </div>
                                </div>
                            </figure>
                        </>
                    ))}
                </div>
            </section>
            {openModalEmail && (
                <section>
                    <EnvioEmailModal openModal={openModalEmail} setOpenModal={setOpenModalEmail} textoModal={`${notificacionSeleccionada.estadoNotificaciones}: ${notificacionSeleccionada.tituloNotificacion}`} />
                </section>
            )}
        </main>
    )
}