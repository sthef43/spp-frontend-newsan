import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { WhatsappMsgOpcionAsignacionSliceRequest } from "app/features/admin/slices/WhatsappMsgOpcionAsignacionSlice";
import { IWhatsappMsgOpcionAsignacion } from "app/models/IWhatsappMsgOpcionAsignacion";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  plantaSeleccionadaId: number;
}

interface FormValues {
  nombre: string;
  descripcion: string;
}

const defaultValues: FormValues = {
  nombre: "",
  descripcion: ""
};

export const WhatsappMsgOpcionAsignacion: React.FC<Props> = ({ setOpenModal, openModal, plantaSeleccionadaId }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<FormValues>({
    defaultValues,
    mode: "onChange"
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { FetchPost } = useFetchApiMultiResults();

  const onSubmit = async (data: FormValues) => {
    const nuevaAsignacion: IWhatsappMsgOpcionAsignacion = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      plantId: plantaSeleccionadaId
    };
    FetchPost(WhatsappMsgOpcionAsignacionSliceRequest.PostRequest, nuevaAsignacion, false, async () => {
      await dispatch(WhatsappMsgOpcionAsignacionSliceRequest.GetOptionsByPlantId(plantaSeleccionadaId));
      openNotificationUI("Se añadio la nueva asignacion correctamente", "success");
      setOpenModal(false);
    });
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <InputComponentForm
          control={control}
          name="nombre"
          label="Ingrese el nombre de la nueva asignacion"
          rules={{ required: "Este campo es requerido" }}
        />
        <InputComponentForm
          control={control}
          name="descripcion"
          label="Ingrese una descripcion para la asignacion"
          rules={{ required: "Este campo es requerido" }}
        />
        <section className="flex justify-center gap-x-4 mt-4">
          <div>
            <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
              Agregar
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => {
                setOpenModal(false);
              }}
              className={buttonClases.redButton}>
              Cancelar
            </Button>
          </div>
        </section>
      </form>
    </main>
  );
};
