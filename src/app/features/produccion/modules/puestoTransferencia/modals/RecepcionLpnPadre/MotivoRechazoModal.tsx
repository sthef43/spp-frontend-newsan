/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const MotivoRechazoModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control } = useForm();

  const buttonClases = MaterialButtons();

  const recepcion = useAppSelector((state) => state.cliContenedorItemsRecepcionBloq.object);

  return (
    <main className="w-[65vw] flex flex-col">
      <section className="flex flex-row mb-4 gap-x-4">
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Sector de Rechazo"
          nameInput="sectorRechazado"
          valueDefault={recepcion.cliSectores.nombreSector}
          disabled
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Motivo Rechazo"
          nameInput="motivo"
          valueDefault={recepcion.mensajeRechazo === null ? "Se rechazo el lpn" : recepcion.mensajeRechazo}
          disabled
        />
        <TextFieldComponent
          control={control}
          index={2}
          labelInput="Persona que Rechazo"
          nameInput="operatorRechazo"
          valueDefault={`${recepcion.operator.name} ${recepcion.operator.surname}`}
          disabled
        />
      </section>
      <div className="flex flex-col justify-center w-full items-center">
        <Button
          onClick={() => {
            setOpenModal(false);
          }}
          className={buttonClases.redButton}>
          Atras
        </Button>
      </div>
    </main>
  );
};
