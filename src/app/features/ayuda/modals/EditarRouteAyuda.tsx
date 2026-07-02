/* eslint-disable unused-imports/no-unused-vars */
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import React from "react";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { RoutesAyudaSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaSlice";
import { FormButtons } from "app/shared/helpers/FormButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  routeAyudaSeleccionada: IRoutesAyuda;
  setListaRoutes: (newValue: IRoutesAyuda[]) => void;
}

export const EditarRoutesAyuda: React.FC<Props> = ({
  setOpenModal,
  openModal,
  routeAyudaSeleccionada,
  setListaRoutes
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const rutaEditada = { ...routeAyudaSeleccionada, nombrePDF: data.nombreArchivo, ruta: data.rutaPdf };
      delete rutaEditada.routesAyudaPadresId;
      const response = unwrapResult(await dispatch(RoutesAyudaSliceRequest.PutRequest(rutaEditada)));
      const getRoutes = unwrapResult(await dispatch(RoutesAyudaSliceRequest.getAllRequest()));
      if (response) {
        console.log(response);
        setListaRoutes(getRoutes);
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6 w-[50vw]">
      <TextFieldComponent
        control={control}
        nameInput="nombreArchivo"
        labelInput="Ingrese el Nombre del PDF"
        index={0}
        autoFocus
        requiredBool
        errors={errors}
        typeInput="outlined"
        valueDefault={routeAyudaSeleccionada.nombrePDF}
      />
      <TextFieldComponent
        control={control}
        nameInput="rutaPdf"
        labelInput="Ingrese la ruta"
        index={2}
        requiredBool
        errors={errors}
        typeInput="outlined"
        valueDefault={routeAyudaSeleccionada.ruta}
      />
      <FormButtons
        submitName="Aceptar"
        onCancel={() => {
          setOpenModal(false);
        }}></FormButtons>
    </form>
  );
};
