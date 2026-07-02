import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { ITicketsCategoria } from "../models/ITicketsCategorias";
import { TicketsCategoriaSliceRequest } from "../reducers/TicketsCategoriaSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

interface BaseProps {
  setCategoriaSeleciconadaId: (newValue: string | number) => void;
  eliminarItemTodos?: boolean;
  filtroPorPlanta?: boolean;
  plantId?: number;
}

interface ActivarControl extends BaseProps {
  activeControl: true;
  controlPadre: Control;
}

interface controlOpcional extends BaseProps {
  activeControl?: false;
  controlPadre?: Control;
}

type Props = ActivarControl | controlOpcional;

export const SelectCategoriaComponent: React.FC<Props> = ({
  setCategoriaSeleciconadaId,
  eliminarItemTodos,
  controlPadre,
  activeControl,
  filtroPorPlanta,
  plantId
}) => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [listaCategorias, setListaCategorias] = useState<ITicketsCategoria[]>([]);
  const getCategorias = async () => {
    let response: ITicketsCategoria[] = [];
    try {
      response = unwrapResult(await dispatch(TicketsCategoriaSliceRequest.getAllRequest()));
      if (filtroPorPlanta) {
        response = unwrapResult(await dispatch(TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId(plantId)));
      } else {
        response = unwrapResult(await dispatch(TicketsCategoriaSliceRequest.getAllRequest()));
      }
      if (response) {
        if (eliminarItemTodos) {
          const itemTodosEliminado = response.filter((elementos) => {
            return elementos.nombre != "Todos";
          });
          setListaCategorias(itemTodosEliminado);
        } else {
          setListaCategorias(response);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    if (plantId) {
      getCategorias();
    }
  }, [filtroPorPlanta, plantId]);

  return (
    <>
      {activeControl ? (
        <SelectComponent
          inputLabel=""
          listaObjetos={listaCategorias}
          nameSelect="categoria"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={activeControl ? controlPadre : undefined}
          ValueSave={setCategoriaSeleciconadaId}
        />
      ) : (
        <SelectComponent
          inputLabel=""
          listaObjetos={listaCategorias}
          nameSelect="categoria"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={control}
          ValueSave={setCategoriaSeleciconadaId}
        />
      )}
    </>
  );
};
