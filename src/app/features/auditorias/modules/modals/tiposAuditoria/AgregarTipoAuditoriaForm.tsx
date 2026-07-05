import React from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { IAuditoriaTipo } from "../../../models/IAuditoriaTipo";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AuditoriaTipoSliceRequest } from "../../../slices/AuditoriaTipoSlice";

export interface IAuditoriaTipoFormInputs {
  nombre: string;
  descripcion: string;
  plantId: number;
}

export const defaultValues: IAuditoriaTipoFormInputs = {
  nombre: "",
  descripcion: "",
  plantId: 0
};

interface Props {
  setOpenModal: (newValue: boolean) => void;
  setActiveRefresh: (newValue: boolean) => void;
  edicionActiva?: boolean;
  tipoSeleccionado?: IAuditoriaTipo;
}

export const AgregarTipoAuditoriaForm: React.FC<Props> = ({
  setOpenModal,
  setActiveRefresh,
  edicionActiva = false,
  tipoSeleccionado
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<IAuditoriaTipoFormInputs>({
    defaultValues: edicionActiva
      ? {
          nombre: tipoSeleccionado?.nombre || "",
          descripcion: tipoSeleccionado?.descripcion || "",
          plantId: tipoSeleccionado?.plantId || 0
        }
      : defaultValues
  });

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const plants = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const { FetchPost, FetchPut } = useFetchApiMultiResults<IAuditoriaTipo>();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data: IAuditoriaTipoFormInputs) => {
    const payload: IAuditoriaTipo = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      rolId: infoUser.permisos.rolId,
      plantId: data.plantId
    };

    if (!edicionActiva) {
      FetchPost(AuditoriaTipoSliceRequest.PostRequest, payload, false, () => {
        openNotificationUI("Tipo de auditoría creado correctamente", "success");
        setActiveRefresh(true);
        setOpenModal(false);
      });
    } else {
      FetchPut({
        sliceRequest: AuditoriaTipoSliceRequest.PutRequest,
        modelPut: { ...payload, id: tipoSeleccionado?.id },
        consoleLog: false,
        functionAdd: () => {
          openNotificationUI("Tipo de auditoría actualizado correctamente", "success");
          setActiveRefresh(true);
          setOpenModal(false);
        }
      });
    }
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[40vw] h-full" activeEffectVisible>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <InputComponentForm
          name="nombre"
          control={control}
          label="Nombre del tipo de auditoría"
          placeholder="Ingrese el nombre"
          rules={{ required: "El nombre es obligatorio" }}
        />
        <InputComponentForm
          name="descripcion"
          control={control}
          label="Descripción"
          placeholder="Ingrese una descripción"
          rules={{ required: "La descripción es obligatoria" }}
        />
        <SelectComponentForm
          name="plantId"
          control={control}
          label="Planta"
          listItems={plants}
          valueLabel={(item) => item.name}
          valueSelect={(item) => item.id}
          rules={{ required: "Seleccione una planta", validate: (value) => Number(value) > 0 || "Seleccione una planta" }}
          disabled={false}
        />
        <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} />
      </form>
    </ContainerForPages>
  );
};
