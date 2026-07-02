import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MQfunc } from "../../../shared/components/material-ui/breakpoints";
import { Button, IconButton, Tooltip } from "@mui/material";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { Delete } from "@mui/icons-material";

interface props {
  refresh: any; //Refresca el select2 de tipo de unidad
  setOpen: any;
}

export const CrudTipoUnidad = ({ refresh, setOpen }: props) => {
  const requiredField = "Este campo es requerido";
  const schema = yup
    .object()
    .shape({
      nombre: yup.string().required(requiredField),
      descripcion: yup.string().required(requiredField)
    })
    .required();
  const defaultValues = {
    nombre: "",
    descripcion: ""
  };
  const defaultLabels = {
    nombre: "Nombre",
    descripcion: "Descripcion"
  };

  const { control, trigger, setValue, reset, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all"
  });
  const materialButtons = MaterialButtons();

  const { openNotificationUI } = useNotificationUI();

  const dispatch = useAppDispatch();

  const guardar = async () => {
    let info;
    try {
      info = unwrapResult(await dispatch(TipoUnidadSliceRequests.postRequest(getValues())));
    } catch {
      info = null;
    }
    if (info) {
      openNotificationUI("Operacion realizada con exito", "success");
      setOpen(false);
      refresh();
    }
  };

  const [listTipoUnidad, setListTipoUnidad] = useState(null);

  const getListTipoUnidad = async () => {
    const result = unwrapResult(await dispatch(TipoUnidadSliceRequests.getAllRequest()));
    setListTipoUnidad(result);
  };

  useEffect(() => {
    getListTipoUnidad();
  }, []);

  const onDelete = async (id) => {
    const result = unwrapResult(await dispatch(TipoUnidadSliceRequests.deleteRequest(id)));
    if (result) {
      getListTipoUnidad();
      openNotificationUI("Eliminado exitosamente :)", "success");
      refresh();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <GenericFieldsGenerator
          values={defaultValues}
          control={control}
          labels={defaultLabels}
          styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
          variant="outlined"
        />
        <div className="flex md:col-span-2 justify-around mt-4 w-full">
          <Button
            variant="contained"
            className={materialButtons.greenButton}
            onClick={() => {
              guardar();
            }}
            disabled={!formState.isValid || !formState.isDirty}>
            Guardar
          </Button>
          <Button variant="contained" className={materialButtons.redButton} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </div>
      </div>
      {listTipoUnidad && (
        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "Acciones",
              field: "",
              render: (row: any) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          onDelete(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          dataInfo={listTipoUnidad}
          buscar={true}
        />
      )}
    </div>
  );
};
