/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { IOQCPalet } from "app/models/IOQCPalet";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { OQCPaletSliceRequests } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { limpiarPalet } from "app/features/oqcGeneral/helpers/limpiarEntidad";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  refresh: () => void;
}

export const OQCEditPalet: React.FC<Props> = ({ setOpenModal, openModal, refresh }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const palet = useAppSelector((state) => state.oqcPalet.object as IOQCPalet);

  const { FetchPut } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = (data: any) => {
    const clonPalet = limpiarPalet({
      ...palet,
      cantidadEquipos: data.cantidadEquipos,
      cantidadMasterBox: data.cantidadMasterBox
    } as IOQCPalet);
    FetchPut({
      consoleLog: false,
      modelPut: clonPalet,
      sliceRequest: OQCPaletSliceRequests.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: `Se editara la informacion del palet ${clonPalet.numeroPalet}, ¿Deseas continuar?`,
      titleUser: "Editar Pallet",
      functionAdd: () => {
        openNotificationUI("Palet editado correctamente", "success");
        refresh();
        setOpenModal(false);
      }
    });
  };

  return (
    <ContainerForPages
      activeEffectVisible
      optionsLayout="personalized"
      classNamePersonalized="w-[65vw] flex flex-col gap-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-4">
          <TextFieldComponent
            control={control}
            valueDefault={palet.cantidadEquipos.toString()}
            nameInput="cantidadEquipos"
            labelInput="Cantidad Equipos"
            typeDate="number"
            typeInput="standard"
            requiredBool
            errors={errors}
            index={0}
          />
          <TextFieldComponent
            control={control}
            valueDefault={palet.cantidadMasterBox.toString()}
            nameInput="cantidadMasterBox"
            labelInput="Cantidad Master Box"
            typeDate="number"
            typeInput="standard"
            requiredBool
            errors={errors}
            index={1}
          />
        </div>
        <FormButtons disabled={!isValid} onCancel={() => setOpenModal(false)} />
      </form>
    </ContainerForPages>
  );
};
