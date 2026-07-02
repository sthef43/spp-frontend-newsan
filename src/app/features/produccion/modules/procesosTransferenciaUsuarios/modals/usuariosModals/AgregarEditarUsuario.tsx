import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { ITransferenciaUsuariosPermitidos } from "../../models/ITransferenciaUsuariosPermitidos";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { TransferenciaUsuariosPermitidosSliceRequest } from "../../slices/TransferenciaUsuariosPermitidosSlice";
import { FormButtons } from "app/shared/helpers/FormButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  modoEdicion: boolean;
  usuarioSeleccionado: ITransferenciaUsuariosPermitidos;
}

export const AgregarEditarUsuario: React.FC<Props> = ({ setOpenModal, modoEdicion, usuarioSeleccionado }) => {
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
      FetchPost(TransferenciaUsuariosPermitidosSliceRequest.PostRequest, modeloUsuario, false, async () => {
        openNotificationUI("Se creo el usuario con exito", "success");
        await dispatch(TransferenciaUsuariosPermitidosSliceRequest.getAllRequest());
        setOpenModal(false);
      });
    } else {
      FetchPut({
        consoleLog: false,
        modelPut: modeloUsuario,
        sliceRequest: TransferenciaUsuariosPermitidosSliceRequest.PutRequest,
        activeConfirmation: false,
        functionAdd: async () => {
          openNotificationUI("Se actualizo el usuario con exito", "success");
          await dispatch(TransferenciaUsuariosPermitidosSliceRequest.getAllRequest());
          setOpenModal(false);
        }
      });
    }
  };

  const generarUsuario = (formData) => {
    let usuario: ITransferenciaUsuariosPermitidos;
    try {
      if (!modoEdicion) {
        usuario = {
          dni: formData.dni,
          apellido: formData.apellido,
          nombre: formData.nombre
        };
      } else {
        const clonUsuario: ITransferenciaUsuariosPermitidos = {
          ...usuarioSeleccionado,
          dni: formData.dni,
          apellido: formData.apellido,
          nombre: formData.nombre
        };
        usuario = clonUsuario;
      }

      if (usuario !== null) {
        return usuario;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando el nuevo usuario", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[45vw] flex flex-col gap-y-4">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese el nombre el usuario"
        nameInput="nombre"
        valueDefault={modoEdicion ? usuarioSeleccionado.nombre : ""}
        requiredBool
        errors={errors}
      />
      <TextFieldComponent
        control={control}
        index={1}
        labelInput="Ingrese el apellido el usuario"
        nameInput="apellido"
        valueDefault={modoEdicion ? usuarioSeleccionado.apellido : ""}
        requiredBool
        errors={errors}
      />
      <TextFieldComponent
        control={control}
        index={2}
        labelInput="Ingrese el dni el usuario"
        nameInput="dni"
        valueDefault={modoEdicion ? usuarioSeleccionado.dni : ""}
        requiredBool
        errors={errors}
      />
      <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} />
    </form>
  );
};
