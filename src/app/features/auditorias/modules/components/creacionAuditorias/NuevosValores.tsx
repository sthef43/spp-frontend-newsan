/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoriaValores } from "../../../models/IAuditoriaValores";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
}

export const NuevosValores: React.FC<Props> = ({ setOpenModal }) => {
  const {
    control,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const { tipoProductoId } = useAppSelector((state) => state.auditoriasUI);

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const {
    validators: { isNumeric }
  } = useInputValidations(trigger);
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [cantidadInputs, setCantidadInputs] = useState(0);

  const cargarInputs = () => {
    const getCantidadInputs = getValues("cantidadValores");
    const validacionNumerica = isNumeric("Debe ingresar solo numeros");
    const auxFuncion = validacionNumerica(getCantidadInputs);
    if (auxFuncion === true) {
      setCantidadInputs(getCantidadInputs);
    } else {
      openNotificationUI("Debe ingresar solo numeros", "error");
    }
  };

  const onSubmit = async (data: any) => {
    const listaItems = generarListaItems(data);
    if (
      await getConfirmation(
        "Crear Lista de Valores",
        "Desea continuar con la creacion de la lista de valores",
        null,
        "Aceptar",
        "Cancelar"
      )
    ) {
      dispatch(auditoriasUISlice.actions.setListaValoresPreview(listaItems));
      dispatch(auditoriasUISlice.actions.setMostrarListaValores(true));
      setOpenModal(false);
    }
  };

  const generarListaItems = (data: any): IAuditoriaValores[] => {
    const listado = Array.from({ length: cantidadInputs }, (_, index) => {
      return {
        nombre: data[`valor${index}`],
        descripcion: data[`descripcion${index}`],
        flagCriterio: false,
        flagMail: false
      };
    });
    return listado;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerForPages
        optionsLayout="personalized"
        classNamePersonalized="flex flex-col gap-y-6 w-full"
        activeEffectVisible>
        {cantidadInputs == 0 ? (
          <div className="flex flex-row items-center gap-x-10 mt-6">
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Cantidad de nuevos valores"
              nameInput="cantidadValores"
              valueDefault=""
              requiredBool
              errors={errors}
            />
            <Button
              onClick={cargarInputs}
              className={`${buttonClases.blueButton} p-[.75rem] w-1/4`}
              variant="contained">
              Agregar Valores
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-row w-full gap-x-6 mt-6">
              <div className="flex flex-col gap-y-2 w-1/3">
                {Array.from({ length: cantidadInputs }, (_, index) => (
                  <TextFieldComponent
                    key={index}
                    control={control}
                    index={index}
                    labelInput="Valor"
                    nameInput={`valor${index}`}
                    valueDefault=""
                    requiredBool
                    errors={errors}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-y-2 w-full">
                {Array.from({ length: cantidadInputs }, (_, index) => (
                  <TextFieldComponent
                    key={index}
                    control={control}
                    index={index}
                    labelInput="Descripcion"
                    nameInput={`descripcion${index}`}
                    valueDefault=""
                    requiredBool
                    errors={errors}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full justify-center mt-2">
              <Button disabled={!isValid} className={buttonClases.blueButton} type="submit" variant="contained">
                Agregar
              </Button>
            </div>
          </>
        )}
      </ContainerForPages>
    </form>
  );
};
