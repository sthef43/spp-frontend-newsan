import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface Props {
    setDatePickerValue: (newValue: string) => void
}

export const DatePickerComponent: React.FC<Props> = ({ setDatePickerValue }) => {

    const [fecha, setFecha] = useState(moment().toDate() || moment().toDate())

    const handleFechaChange = (fecha: any) => {
        setFecha(fecha)
    }   

    // CUANDO SE PUEDA ACTUALIZAR A LOS TICKETS INTERPLANTA AÑADIR ESTA FUNCION DENTRO DEL FORMAT Y AGREAGR COMO PROP EL CASE
    // const formaterTipoFecha = (tipo: string) => {
    //     switch (tipo) {
    //         case "soloAño":
    //             return "MM-DD-YYYY"
    //         case "añoHora":
    //             return "MM-DD-YYYY h:mm:ss"
    //     }
    // }

    useEffect(() => {
        if (fecha) {
            const fechaFormateada = moment(fecha).format("MM-DD-YYYY")
            setDatePickerValue(fechaFormateada)
        }
    }, [fecha]);

    return (
        <DesktopDatePicker
            label=""
            value={fecha}
            inputFormat="DD/MM/YYYY"
            onChange={(e: any) => { handleFechaChange(e) }}
            renderInput={(field) => (
                <TextField {...field} variant="outlined" fullWidth />
            )}
        />
    )
}