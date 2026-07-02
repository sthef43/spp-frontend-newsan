import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRol } from "app/models";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";

interface BaseProps {
  setRolSeleccionadoId: (newValue: string | number) => void;
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

type Props = ActivarControl | controlOpcional;

export const SelectRolComponent: React.FC<Props> = ({
  setRolSeleccionadoId,
  eliminarItemTodos,
  controlPadre,
  activeControl
}) => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [listaCategorias, setListaCategorias] = useState<IRol[]>([]);
  const getCategorias = async () => {
    try {
      const response = unwrapResult(await dispatch(RolSliceRequests.getAllRequest()));
      if (response) {
        if (eliminarItemTodos) {
          const itemTodosEliminado = response.filter((elementos) => {
            return elementos.name != "Todos";
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

  return (
    <>
      {activeControl ? (
        <SelectComponent
          inputLabel="Seleccione un rol"
          listaObjetos={listaCategorias}
          nameSelect="categoria"
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={activeControl ? controlPadre : undefined}
          ValueSave={setRolSeleccionadoId}
        />
      ) : (
        <SelectComponent
          inputLabel="Seleccione un rol"
          listaObjetos={listaCategorias}
          nameSelect="categoria"
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          control={control}
          ValueSave={setRolSeleccionadoId}
        />
      )}
    </>
  );
};
