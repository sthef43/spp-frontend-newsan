import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { IModelo } from "app/models/IModelo";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const EditarModeloModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //USO LOS SLICES PARA OBTENER LOS DATOS DE LOS MODALES ANTERIORES
  const familia = useAppSelector((state) => state.familia.object);
  const modelo = useAppSelector((state) => state.modelo.object);
  const tipoUnidades = useAppSelector((state) => state.tipoUnidad.dataAll);

  //SETEO EL TIPO SELECCIONADO DEL SELECT
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | number>("");

  //FUNCION QUE EJECUTA EL GUARDADO DE LA EDICION DEL MODELO SELECCIONADO
  const onSubmit = async (e) => {
    const modeloEditado = generarEdicionModelo(e);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ModeloSliceRequest.PutRequest(modeloEditado)));
      if (response) {
        openNotificationUI("Se edito con exito el modelo", "success");
        await dispatch(ModeloSliceRequest.getAllByFamiliaId(familia.id));
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un erro intentando actualzar el modelo", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //ASIGNO AL MODELO SELECCIONADO LOS DATOS QUE FUERON INGRESADOS EN LOS INPUTS
  const generarEdicionModelo = (formData) => {
    try {
      const modeloEditado: IModelo = {
        ...modelo,
        nombre: formData.codigoModelo,
        descripcion: formData.descripcion,
        tipoUnidad: tipoSeleccionado as string
      };
      delete modeloEditado.familia;

      if (modeloEditado !== null) {
        return modeloEditado;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error intentando modificar el modelo", "error");
    }
  };

  //FUNCION QUE HABILITA EL BOTON DE GUARDAR LA EDICION
  const habilitarBotonFormulario = () => {
    if (!isValid) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <main className="w-[50vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row justify-between w-full gap-x-4">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Codigo Modelo"
            nameInput="codigoModelo"
            valueDefault={modelo.nombre}
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Descripcion"
            nameInput="descripcion"
            valueDefault={modelo.descripcion}
            requiredBool
            errors={errors}
          />
          <SelectComponent
            listaObjetos={tipoUnidades}
            inputLabel="Tipo de unidad"
            nameSelect="unidad"
            valueLabel={(value) => value.descripcion}
            valueSelect={(value) => value.nombre}
            defaultValue={modelo.tipoUnidad}
            control={control}
            valueKey={(value) => value}
            ValueSave={setTipoSeleccionado}
          />
        </div>
        <div className="flex flex-row justify-between w-full gap-x-4 mt-4">
          <TextFieldComponent
            control={control}
            index={2}
            labelInput="Familia"
            nameInput="familia"
            valueDefault={familia.nombre}
            requiredBool
            disabled
            errors={errors}
          />
        </div>
        <FormButtons
          onCancel={() => {
            setOpenModal(false);
          }}
          disabledFunction={habilitarBotonFormulario}
        />
      </form>
    </main>
  );
};
