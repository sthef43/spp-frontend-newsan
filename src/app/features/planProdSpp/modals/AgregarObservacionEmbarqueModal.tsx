import React from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { NumeroEmbarqueDTO } from "../models/DTOS/NumeroEmbarqueDTO";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useForm } from "react-hook-form";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { PlanProdSppEmbarqueSliceRequest } from "../reducers/PlanProdSppEmbarqueSlice";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

interface IFormValues {
  observacion: string;
}

const defaultValues: IFormValues = {
  observacion: ""
};

interface Props {
  setOpenMoal: (newValue: boolean) => void;
  embarqueSeleccionado: NumeroEmbarqueDTO | null;
  refreshList: () => void;
}

export const AgregarObservacionEmbarqueModal = ({
  setOpenMoal,
  embarqueSeleccionado,
  refreshList
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<IFormValues>({
    values: {
      observacion: embarqueSeleccionado?.observacion || ""
    }
  });

  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();

  const onSubmit = (data: IFormValues) => {
    const actualizarEmbarque: IPlanProdSppEmbarque = {
      ...embarqueSeleccionado,
      observacion: data.observacion
    };
    delete actualizarEmbarque.estadoEmbarque;
    FetchPut({
      consoleLog: false,
      modelPut: actualizarEmbarque,
      sliceRequest: PlanProdSppEmbarqueSliceRequest.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "Se actualizara el comentario por el que se ingreso ¿Desea continuar?",
      titleUser: "Actualizar observacion",
      functionAdd: () => {
        openNotificationUI("Se actualizara el comentario por el que se ingreso", "success");
        refreshList();
        setOpenMoal(false);
      }
    });
  };

  return (
    <ContainerForPages optionsLayout="modal" activeEffectVisible={true}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <InputComponentForm
          name="observacion"
          control={control}
          label="Observación"
          rules={{ required: "Se debe ingresar una observacion" }}
        />
        <FormButtons
          disabled={!isValid}
          onCancel={() => {
            setOpenMoal(false);
          }}
        />
      </form>
    </ContainerForPages>
  );
};
