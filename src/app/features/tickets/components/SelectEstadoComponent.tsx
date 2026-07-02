import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { ITicketsEstados } from "../models/ITicketsEstado";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TicketEstadosSliceRequets } from "../reducers/TicketsEstado.service";

interface BaseProps {
  setEstadoSeleccionado: (newValue: string | number) => void;
  eliminarItemTodos?: boolean;
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

export const SelectEstadoComponent: React.FC<Props> = ({
  setEstadoSeleccionado,
  eliminarItemTodos,
  controlPadre,
  activeControl,
  activarInputSeteado,
  valorSeteo
}) => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [listaEstados, setListaEstados] = useState<ITicketsEstados[]>([]);

  const getCategorias = async () => {
    try {
      const response = unwrapResult(await dispatch(TicketEstadosSliceRequets.getAllRequest()));
      if (response) {
        if (eliminarItemTodos) {
          const itemTodosEliminado = response.filter((elementos) => {
            return elementos.nombre != "Todos";
          });
          setListaEstados(itemTodosEliminado);
        } else {
          setListaEstados(response);
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

  return (
    <>
      {activeControl ? (
        <SelectComponent
          inputLabel={activarInputSeteado ? valorSeteo : ""}
          listaObjetos={listaEstados}
          nameSelect="estados"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={activeControl ? controlPadre : undefined}
          ValueSave={setEstadoSeleccionado}
        />
      ) : (
        <SelectComponent
          inputLabel=""
          listaObjetos={listaEstados}
          nameSelect="estados"
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={control}
          ValueSave={setEstadoSeleccionado}
        />
      )}
    </>
  );
};
