/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const MensajeRechazoModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);
  const recepcion = useAppSelector((state) => state.cliContenedorItemsRecepcionBloq.object);
  const recepciones = useAppSelector(
    (state) => state.cliContenedorItemsRecepcionBloq.dataAll as ICLIContenedorItemsRecepcionBloq[]
  );

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();

  const onSubmit = async (e) => {
    const recepcionAnterior = buscarRecepcionAnterior();
    const actualizacionModelo = generarActualizacion(e);
    FetchPut({
      consoleLog: false,
      modelPut: actualizacionModelo,
      sliceRequest: CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest,
      activeConfirmation: false,
      functionAdd: async () => {
        const response = unwrapResult(
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest(recepcionAnterior))
        );
        if (response) {
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.GetLastContainerReceived(contenedor.id));
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.GetAllReceptionByContenedorId(contenedor.id));
          openNotificationUI("Se cargo con exito el mensaje", "success");
          setOpenModal(false);
        }
      }
    });
  };

  const buscarRecepcionAnterior = () => {
    try {
      const recepcionEncontrada = recepciones.findIndex((elementos) => elementos.id === recepcion.id);
      const recepcionAnterior = recepciones[recepcionEncontrada - 1];
      const recepcionAnteriorFormateado: ICLIContenedorItemsRecepcionBloq = {
        ...recepcionAnterior,
        recepcion: "Sin Recepcion"
      };

      if (recepcionEncontrada !== null) {
        delete recepcionAnteriorFormateado.cliSectores;
        delete recepcionAnteriorFormateado.cliContenedorItems;
        return recepcionAnteriorFormateado;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error volviendo al sector anterior: ${error}`, "error");
    }
  };

  const generarActualizacion = (formData) => {
    const actualizacionMensaje: ICLIContenedorItemsRecepcionBloq = {
      ...recepcion,
      mensajeRechazo: formData.razonRechazo
    };
    try {
      if (actualizacionMensaje !== null) {
        return actualizacionMensaje;
      }
    } catch (error) {
      openNotificationUI(`Se genero un error generando la actualizacion: ${error}`, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[50vw]">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese la razon por la cual se rechazo"
        nameInput="razonRechazo"
        valueDefault=""
        autoFocus
        requiredBool
        errors={errors}
      />
      <FormButtons
        onCancel={() => {
          setOpenModal(false);
        }}
        disabled={!isValid}
      />
    </form>
  );
};
