import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { ITransferenciaUsuariosProcesos } from "../../models/ITransferenciaUsuariosProcesos";
import { TransferenciaUsuariosProcesosSliceRequest } from "../../slices/TransferenciaUsuariosProcesosSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  modoEdicion: boolean;
  usuarioSeleccionado: ITransferenciaUsuariosProcesos;
  sectorId: number;
}

export const AgregarEditarProcesos: React.FC<Props> = ({
  setOpenModal,
  modoEdicion,
  usuarioSeleccionado,
  sectorId
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const onSubmit = (data) => {
    const nuevoUsuario = generarUsuario(data);
    crearUsuario(nuevoUsuario);
  };

  const crearUsuario = (modeloUsuario) => {
    if (!modoEdicion) {
      FetchPost(TransferenciaUsuariosProcesosSliceRequest.PostRequest, modeloUsuario, false, async () => {
        openNotificationUI("Se creo el proceso con exito", "success");
        await dispatch(TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId(sectorId));
        setOpenModal(false);
      });
    } else {
      FetchPut({
        consoleLog: false,
        modelPut: modeloUsuario,
        sliceRequest: TransferenciaUsuariosProcesosSliceRequest.PutRequest,
        activeConfirmation: false,
        functionAdd: async () => {
          openNotificationUI("Se actualizo el proceso con exito", "success");
          await dispatch(TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId(sectorId));
          setOpenModal(false);
        }
      });
    }
  };

  const generarUsuario = (formData) => {
    let usuario: ITransferenciaUsuariosProcesos;
    try {
      if (!modoEdicion) {
        usuario = {
          cliSectoresId: sectorId,
          descripcion: formData.descripcion,
          nombre: formData.nombre
        };
      } else {
        const clonUsuario: ITransferenciaUsuariosProcesos = {
          ...usuarioSeleccionado,
          cliSectoresId: sectorId,
          descripcion: formData.descripcion,
          nombre: formData.nombre
        };
        usuario = clonUsuario;
      }

      if (usuario !== null) {
        return usuario;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando el nuevo procesos", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[45vw] flex flex-col gap-y-4">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese el nombre del procesos"
        nameInput="nombre"
        valueDefault={modoEdicion ? usuarioSeleccionado.nombre : ""}
        requiredBool
        errors={errors}
      />
      <TextFieldComponent
        control={control}
        index={1}
        labelInput="Ingrese la descripcion del proceso"
        nameInput="descripcion"
        valueDefault={modoEdicion ? usuarioSeleccionado.descripcion : ""}
        requiredBool
        errors={errors}
      />
      <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} />
    </form>
  );
};
