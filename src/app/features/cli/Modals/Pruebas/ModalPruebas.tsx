import React from "react"
import { TextFieldComponent } from "../../Components/TextFieldComponente"
import { useForm } from "react-hook-form"
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons"
import { Button } from "@mui/material"
import { useInputValidations } from "app/shared/hooks/useInputValidations"

interface Props {
    setOpenModal: (newValue: boolean) => void
    openModal: boolean
}

export const ModalPruebas: React.FC<Props> = ({ setOpenModal, openModal }) => {
    const { control, handleSubmit, formState: { errors }, trigger } = useForm()

    const buttonClases = MaterialButtons()

    const { nextInput, validators } = useInputValidations(trigger)

    const onSubmit = (data) => {
        console.log(data)
        setOpenModal(false) 
    }

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="flex flex-col gap-y-3">
                    <TextFieldComponent validacionAdicionales={validators.minLength(5, "Ingrese solo 5 numeros")} onKeyUpFunction onKeyUp={nextInput} index={0} autoFocus labelInput="Ingrese un valor" requiredBool errors={errors} nameInput="prueba1" control={control} valueDefault="" />
                    <TextFieldComponent onKeyUpFunction onKeyUp={nextInput} index={1} labelInput="Ingrese un valor2" requiredBool errors={errors} nameInput="prueba2" control={control} valueDefault="" />
                    <TextFieldComponent onKeyUpFunction onKeyUp={nextInput} index={2} labelInput="Ingrese un valor3" requiredBool errors={errors} nameInput="prueba3" control={control} valueDefault="" />
                </section>
                <section className="flex justify-center gap-x-4 mt-4">
                    <div>
                        <Button type="submit" className={buttonClases.greenButton}>Agregar</Button>
                    </div>
                    <div>
                        <Button type="button" onClick={() => { setOpenModal(false) }} className={buttonClases.redButton}>Cancelar</Button>
                    </div>
                </section>
            </form>
        </main>
    )
}