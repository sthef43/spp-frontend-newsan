/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { ContextApp } from "../../../Context/Context";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { OQCSupervisoresMotorolaSliceRequest } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { unwrapResult } from "@reduxjs/toolkit";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  edicionActiva: boolean;
  datosSupervisor: IOQCSupervisoresMotorola;
  setListaSupervisores: (newValue: IOQCSupervisoresMotorola[]) => void;
}

export const AgregarEditarSupervisoresModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  edicionActiva,
  datosSupervisor,
  setListaSupervisores
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const contextGlobal = useContext(ContextApp);

  const { openNotificationUI } = useNotificationUI();
  const { FetchPost, FetchPut } = useFetchApiMultiResults<IOQCSupervisoresMotorola>();
  const dispatch = useAppDispatch();

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(
    edicionActiva ? datosSupervisor.plantId : 0
  );

  const onSubmit = async (data: unknown) => {
    const supervisor = edicionActiva ? getSupervisorData(data) : getSupervisorData(data);
    if (!edicionActiva) {
      FetchPost(OQCSupervisoresMotorolaSliceRequest.PostRequest, supervisor, false, async () => {
        openNotificationUI("Supervisor agregado correctamente", "success");
        setOpenModal(false);
        const response = unwrapResult(
          await dispatch(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId(contextGlobal.plantaId))
        );
        contextGlobal.setListaOperarios(response);
        setListaSupervisores(response);
      });
    } else {
      FetchPut({
        consoleLog: false,
        modelPut: supervisor,
        sliceRequest: OQCSupervisoresMotorolaSliceRequest.PutRequest,
        functionAdd: async () => {
          openNotificationUI("Supervisor editado correctamente", "success");
          const response = unwrapResult(
            await dispatch(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId(contextGlobal.plantaId))
          );
          contextGlobal.setListaOperarios(response);
          setListaSupervisores(response);
          setOpenModal(false);
        }
      });
    }
  };

  const getSupervisorData = (data: any): IOQCSupervisoresMotorola => {
    const { plant, ...rest } = edicionActiva ? datosSupervisor : ({} as any);
    return {
      ...rest,
      nombre: data.nombreApellido,
      plantId: plantaSeleccionada as number
    };
  };

  return (
    <ContainerForPages optionsLayout="modal">
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <TextFieldComponent
          control={control}
          nameInput="nombreApellido"
          labelInput="Ingrese el nombre y apellido del supervisor"
          index={0}
          autoFocus
          requiredBool
          errors={errors}
          valueDefault={edicionActiva ? datosSupervisor.nombre : ""}
        />
        <SelectComponent
          inputLabel="Selecicone la planta del supervisor"
          control={control}
          nameSelect="plantaId"
          listaObjetos={contextGlobal.listaPlantas}
          defaultValue={edicionActiva ? datosSupervisor.plantId.toString() : ""}
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          ValueSave={setPlantaSeleccionada}
          valueKey={(value) => value}
        />
        <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid || plantaSeleccionada === (0 as number)} />
      </form>
    </ContainerForPages>
  );
};
