import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { ExtintorSitioSliceRequests } from "app/Middleware/reducers/ExtintorSitioSlice";
import { ExtintorProcesoSliceRequests } from "app/Middleware/reducers/ExtintorProcesoSlice";
import { ExtintorAgenteSliceRequests } from "app/Middleware/reducers/ExtintorAgenteSlice";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { SPAEditForm } from "./SPAEditForm";
interface props {
  setOpenPopup: any;
  refresh?: any;
  planta: number;
}
export const SPAForm = ({ setOpenPopup, refresh, planta }: props) => {
  //Cargo las opciones

  const opcion = [{ nombre: "Sitio" }, { nombre: "Proceso" }, { nombre: "Agente" }];
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  interface initialState {
    opcionSelect: string; //Opcion seleccionada del desplegables
  }
  const initialStateVar = {
    opcionSelect: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Watch
  const watchOpcionSelect = watch("opcionSelect");

  //Leer
  const [form, setform] = useState(null);
  const getForm = async () => {
    try {
      if (watchOpcionSelect == "Sitio") {
        const responses = unwrapResult(await dispatch(ExtintorSitioSliceRequests.getListByPlantRequest(planta)));
        setform(responses);
      } else {
        if (watchOpcionSelect == "Proceso") {
          const responses = unwrapResult(await dispatch(ExtintorProcesoSliceRequests.getListByPlantRequest(planta)));
          setform(responses);
        } else {
          const responses = unwrapResult(await dispatch(ExtintorAgenteSliceRequests.getListRequest()));
          setform(responses);
        }
      }
      refresh();
    } catch (error) {
      openNotificationUI("Error al leer.", "error");
    }
  };

  useEffect(() => {
    if (watchOpcionSelect) {
      getForm();
    }
  }, [watchOpcionSelect]);

  //Editar
  const [editState, setEditState] = useState(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    setValue("opcionSelect", "Sitio");
  }, []);

  return (
    <>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="p-5 gap-10 overflow-auto m-2 text-center" style={{ flex: "1 1 90%" }}>
          <Controller
            name="opcionSelect"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Opción</InputLabel>
                <Select {...field} placeholder="Seleccione" variant="standard">
                  {opcion &&
                    opcion.map((x) => (
                      <MenuItem key={x.nombre} value={x.nombre}>
                        <div className="w-full">
                          <div>{x.nombre}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>

        <div className="my-2 mx-4 h-full">
          <TableComponent
            Dense={true}
            buscar
            IDcolumn={"nombre"}
            columns={[
              {
                title: "Nombre",
                field: "nombre"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => {
                              editar(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            agregar={() => {
              setEstaEditando(false);
              setEditState(null);
              setModalOpen(true);
            }}
            dataInfo={form}
          />
        </div>
        <ModalCompoment title={estaEditando ? "Editar" : "Nuevo"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <SPAEditForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getForm}
            estaEditando={estaEditando}
            tabla={watchOpcionSelect}
            planta={planta}
          />
        </ModalCompoment>
      </form>
    </>
  );
};
