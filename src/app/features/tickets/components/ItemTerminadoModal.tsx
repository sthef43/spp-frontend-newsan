import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    setOpenModal: (newValue: boolean) => void
    openModal: boolean
    onCloseDynamic?: boolean
    title: string
    children: JSX.Element
}

export const ItemTerminadoDialog: React.FC<Props> = ({ setOpenModal, openModal, onCloseDynamic, title, children }): JSX.Element => {

    const handleCloseModal = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return
        }
        if (reason && reason === "escapeKeyDown") {
            return
        }
        setOpenModal(false)
    }

    return (
        <Dialog PaperProps={{ sx: { maxWidth: "unset", height: "fit-content", borderRadius: "12px" }}}  
            open={openModal} onClose={(e, reason) => { onCloseDynamic ? handleCloseModal(e, reason) : setOpenModal(false) }}>
            <DialogTitle className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan text-white">
                <div className="flex flex-row justify-between items-center w-full">
                    <div></div>
                    <p className="text-xl">{title}</p>
                    <button onClick={() => { setOpenModal(false) }}>
                        <CloseIcon sx={{ fill: "white" }}/>
                    </button>
                </div>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}