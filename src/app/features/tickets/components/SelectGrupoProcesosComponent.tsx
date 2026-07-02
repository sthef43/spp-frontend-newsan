import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { ITicketsGrupoProcesos } from "../models/iTicketsGrupoProcesos";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TicketsGrupoProcesosSliceRequest } from "../reducers/TicketsGrupoProcesosSlice";

interface BaseProps {
  setGrupoSeleccionado: (newValue: string | number) => void;
  controlPadre?: Control;
  valueCategoriaId: number;
}

interface ActivarControl extends BaseProps {
  activeControl: true;
  controlPadre: Control;
}

interface controlOpcional extends BaseProps {
  activeControl?: false;
  controlPadre?: Control;
}

interface activarSeteoInput extends BaseProps {
  activarInputSeteado: true;
  valorSeteo: string;
}

interface seteoInputOpcional extends BaseProps {
  activarInputSeteado?: false;
  valorSeteo?: string;
}

type Props = (ActivarControl | controlOpcional) & (activarSeteoInput | seteoInputOpcional);

export const SelectGrupoItemsComponent: React.FC<Props> = ({
  setGrupoSeleccionado,
  controlPadre,
  activeControl,
  activarInputSeteado,
  valorSeteo,
  valueCategoriaId
}) => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [listaEstados, setListaEstados] = useState<ITicketsGrupoProcesos[]>([]);

  const getCategorias = async () => {
    try {
      const response = unwrapResult(
        await dispatch(TicketsGrupoProcesosSliceRequest.GetAllGroupsByCategoriaId(valueCategoriaId))
      );
      if (response) {
        setListaEstados(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose);
    }
  };

  useEffect(() => {
    if (valueCategoriaId) {
      getCategorias();
    }
  }, [valueCategoriaId]);

  return (
    <>
      {activeControl ? (
        <SelectComponent
          inputLabel={activarInputSeteado ? valorSeteo : ""}
          listaObjetos={listaEstados}
          nameSelect="grupos"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={activeControl ? controlPadre : undefined}
          ValueSave={setGrupoSeleccionado}
        />
      ) : (
        <SelectComponent
          inputLabel=""
          listaObjetos={listaEstados}
          nameSelect="grupos"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={control}
          ValueSave={setGrupoSeleccionado}
        />
      )}
    </>
  );
};
