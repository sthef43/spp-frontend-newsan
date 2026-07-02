import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons"
import React, { useEffect, useState } from "react"

interface Props<T> {
    setOpenModal: (newValue: boolean) => void
    openModal: boolean
    title: string
    arrayWithObjects: T[]
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-container': {
        padding: theme.spacing(2),
        alignItems: "flex-start"
    },
    '& .MuiDialog-paper': {
        maxWidth: "65rem"
    }
}));

//Todavia no terminado, NO USAR!!
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ModalDeExaminarGenerico = <T,>({ setOpenModal, openModal, title, arrayWithObjects }: Props<T>) => {

    const [titlesFiltrados, setTitlesFiltrados] = useState([])
    const filtarTitles = () => {
        const baseEntinty = ["deleted", "id", "createdDate", "lastModifiedDate"]
        if (arrayWithObjects) {
            setTitlesFiltrados(arrayWithObjects.map(obj => (
                Object.fromEntries(
                    Object.entries(obj).filter(([key, value]) => !baseEntinty.includes(key) && value !== null)
                )
            )))
        }

        let array = []
        array = arrayWithObjects.map(elementos => (
            Object.fromEntries(
                Object.entries(elementos).filter(([key, value]) => !baseEntinty.includes(key) && value !== null)
            )
        ))

        console.log(array)
    }

    const buttonClases = MaterialButtons()

    const handleClose = () => {
        setOpenModal(false);
    };
    
    useEffect(() => {
        filtarTitles()
    }, [openModal])

    return (
        <React.Fragment>
            <BootstrapDialog open={openModal} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <section className="flex justify-end p-1">
                    <Tooltip title={"Cerrar Modal"}>
                        <span>
                            <IconButton size="small" style={{ position: "relative" }} onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </span>
                    </Tooltip>
                </section>
                <DialogTitle className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-lg text-center w-[90%] m-auto text-white py-2 rounded-xl"
                    id="titulo-dialog">{title}</DialogTitle>
                <DialogContent sx={{ borderBottom: "0", marginTop: "1rem" }} aria-labelledby="Cuerpo Modal" dividers>
                    <DialogContentText id="contenido-dialog">
                        <div className="h-[60%]">
                            <TableContainer component={Paper} sx={{ marginTop: "1rem", height: "100%" }}>
                                <Table sx={{ width: "100%" }} aria-label="simple table">
                                    <TableHead sx={{ backgroundColor: "#A5E7F1" }}>
                                        {titlesFiltrados.length > 0 && (
                                            <TableRow>
                                                {Object.keys(titlesFiltrados).map((elementos, index) => (
                                                    <TableCell key={index}>{elementos}</TableCell>
                                                ))}
                                            </TableRow>
                                        )}
                                    </TableHead>
                                    <TableBody>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="justify-center">
                    <Button className={buttonClases.redButton} onClick={handleClose}>Cerrar modal</Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    )
}