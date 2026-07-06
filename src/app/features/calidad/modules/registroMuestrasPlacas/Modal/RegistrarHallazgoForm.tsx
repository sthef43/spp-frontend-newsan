/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, IconButton, Input, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { Delete } from "@mui/icons-material";
import { CtrlPlacasSliceRequests } from "app/Middleware/reducers/CtrlPlacasSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CtrlPlacasHallazgosSliceRequests } from "app/features/calidad/slices/CtrlPlacasHallazgosSlice";
interface props {
  setOpenPopup?: any;
}

export const RegistrarHallazgoForm = ({ setOpenPopup }: props) => {
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  interface initialState {
    descripcion: string;
  }
  const initialStateVar = {
    descripcion: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({});
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Leer todos los Hallazgos
  const [listHallazgosForm, setListHallazgosForm] = useState([]);
  const getListHallazgosForm = async () => {
    try {
      const responses = unwrapResult(await dispatch(CtrlPlacasHallazgosSliceRequests.getAllRequest()));
      setListHallazgosForm(responses);
    } catch (error) {
      openNotificationUI("Error al leer hallazgos.", "error");
    }
  };
  // useEffect(() => {
  //   console.log(listHallazgos);
  // }, [listHallazgos]);

  //Guardar
  const loginSubmitForm = async (e) => {
    try {
      const result = unwrapResult(await dispatch(CtrlPlacasHallazgosSliceRequests.PostRequest(e)));
      openNotificationUI("Guardado...", "success");
      getListHallazgosForm();
      await dispatch(CtrlPlacasHallazgosSliceRequests.getAllRequest());
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  // Eliminar
  //Eliminar si no está asignado el hallazgo
  const [IdHallazgo, setIdHallazgo] = useState();
  const deleteRowAplicar = async () => {
    console.log(IdHallazgo);
    // return;
    const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(CtrlPlacasHallazgosSliceRequests.deleteRequest(IdHallazgo)));
        if (response) {
          openNotificationUI("Se elimino el registro correctamente", "success");
          getListHallazgosForm();
          await dispatch(CtrlPlacasHallazgosSliceRequests.getAllRequest());
        }
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };
  //Verificar antes is esta asignada a alguna placa
  const [eliminar, setEliminar] = useState([]);
  const deleteRow = async (row) => {
    if (eliminar) {
      console.log(row);
      setIdHallazgo(row.id);
      try {
        const response = unwrapResult(
          await dispatch(CtrlPlacasSliceRequests.getListByCtrlPlacasHallazgosIdRequest(row.id))
        );
        setEliminar(response);
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };
  useEffect(() => {
    console.log(eliminar);
    if (IdHallazgo) {
      if (eliminar && eliminar.length > 0) {
        openNotificationUI("No es posible eliminar ya que existen registros asignados al hallazgo.", "error");
      } else {
        console.log("eliminar!!!!!!!!");
        deleteRowAplicar();
      }
    }
  }, [eliminar]);

  useEffect(() => {
    getListHallazgosForm();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmitForm)} style={{ width: "100%", height: "100%" }}>
        <div className="ml-5">Descripción</div>
        <div className="my-2 mx-4 h-full p-8 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <Controller
            name="descripcion"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Input {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%", marginTop: "1%", marginBottom: "3%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>

      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          // Overflow={true}
          // buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Descripción",
              field: "descripcion"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            onClick={() => {
                              deleteRow(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={listHallazgosForm}
        />
      </div>
    </div>
  );
};
