/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlanProdSppEstadoEmbarquesSliceRequest } from "../reducers/PlanProdSppEstadoEmbarquesSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { PlanProdSppEmbarqueSlice, PlanProdSppEmbarqueSliceRequest } from "../reducers/PlanProdSppEmbarqueSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IPlanProdSpp } from "../models/IPlanProdSpp";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";
import { IPlanProdSppEstadoEmbarque } from "../models/IPlanProdSppEstadoEmbarque";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AgregarEditarEmbarqueModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const edicionState = useAppSelector((state) => state.optionForm.estadoEdicionEmbarque);
  const planProduccion = useAppSelector((state) => state.planProdSpp.object as IPlanProdSpp);
  const embarque = useAppSelector((state) => state.planProdSppEmbarques.object);

  const [estadoSelecionado, setEstadoSeleccionado] = useState<string | number>(0);

  const [estadosEmbarques, setEstadosEmbarques] = useState<IPlanProdSppEstadoEmbarque[]>([]);
  FetchApi<IPlanProdSppEstadoEmbarque[]>(
    PlanProdSppEstadoEmbarquesSliceRequest.getAllRequest,
    null,
    false,
    null,
    setEstadosEmbarques,
    false
  );

  const onSubmit = async (e) => {
    const embarqueGenerado = generarNuevoEmbarque(e);
    const embarqueActualizado = actualizarEmbarque(e);
    if (!edicionState) {
      FetchPost(PlanProdSppEmbarqueSliceRequest.PostRequest, embarqueGenerado, false, async () => {
        openNotificationUI("Se creo el embarque con exito", "success");
        reset();
      });
    } else {
      FetchPut({
        sliceRequest: PlanProdSppEmbarqueSliceRequest.PutRequest,
        consoleLog: false,
        modelPut: embarqueActualizado,
        functionAdd: async () => {
          const responseEmbarques = unwrapResult(
            await dispatch(PlanProdSppEmbarqueSliceRequest.GetAllShipmentsByPlanProdId(planProduccion.id))
          );
          dispatch(PlanProdSppEmbarqueSlice.actions.setDataEmbarquesList(responseEmbarques));
          openNotificationUI("Se actualizo con exito el embarque", "success");
          setOpenModal(false);
        }
      });
    }
  };

  const generarNuevoEmbarque = (dataForm) => {
    try {
      const nuevoEmbarque: IPlanProdSppEmbarque = {
        numeroEmbarque: dataForm.numero,
        nombreEmbarque: dataForm.nombre,
        estadoEmbarqueId: estadoSelecionado as number
      };

      if (nuevoEmbarque !== null) {
        return nuevoEmbarque;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error intentando generar el nuevo embarque: ${error}`, "error");
    }
  };

  const actualizarEmbarque = (formData) => {
    try {
      const embarqueSeleccionado: IPlanProdSppEmbarque = {
        ...embarque,
        nombreEmbarque: formData.nombre,
        numeroEmbarque: formData.numero,
        estadoEmbarqueId: estadoSelecionado as number
      };
      delete embarqueSeleccionado.estadoEmbarque;

      if (embarqueSeleccionado !== null) {
        return embarqueSeleccionado;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando modificar el embarque", "error");
    }
  };

  const validadForm = () => {
    if (!isValid || estadoSelecionado === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
        <div className="flex flex-row items-center gap-x-4 w-full">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Nombre Embarque"
            nameInput="nombre"
            valueDefault={edicionState ? embarque.nombreEmbarque : ""}
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Numero Embarque"
            nameInput="numero"
            valueDefault={edicionState ? embarque.numeroEmbarque : ""}
            requiredBool
            errors={errors}
          />
          <SelectComponent
            control={control}
            inputLabel="Estado del embarque"
            listaObjetos={estadosEmbarques}
            nameSelect="estado"
            defaultValue={edicionState ? embarque.estadoEmbarqueId.toString() : ""}
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            ValueSave={setEstadoSeleccionado}
            valueKey={(value) => value}
          />
        </div>
        <FormButtons
          onCancel={() => {
            setOpenModal(false);
          }}
          disabledFunction={validadForm}
        />
      </form>
    </main>
  );
};
