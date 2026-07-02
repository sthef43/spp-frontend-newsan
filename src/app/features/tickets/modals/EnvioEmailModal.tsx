import { Button, Dialog, DialogActions, DialogContent, DialogContentText, useMediaQuery, useTheme } from "@mui/material"
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons"
import React from "react"

interface Props {
    openModal: boolean;
    setOpenModal: (newValue: boolean) => void
    textoModal: string
}

export const EnvioEmailModal: React.FC<Props> = ({ openModal, setOpenModal, textoModal }) => {
    const buttonClases = MaterialButtons()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Dialog fullScreen={fullScreen} open={openModal} onClose={setOpenModal}>
                <DialogContent>
                    <DialogContentText>
                        {textoModal}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-col justify-center items-center">
                        <Button className={buttonClases.redButton} onClick={() => { setOpenModal(false) }}>Cerrar</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}