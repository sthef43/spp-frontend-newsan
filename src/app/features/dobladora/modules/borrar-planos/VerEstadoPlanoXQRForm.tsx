import React, { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { isEmpty, isObject } from "lodash";
import { DobImpresionesPlanosSliceRequests } from "app/Middleware/reducers/DobImpresionesPlanosSlice";
import { FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
import { ChangeCircle, Delete } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IAppUser } from "app/models";
import { Controller, useForm } from "react-hook-form";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";

export const VerEstadoPlanoXQRForm = () => {
  interface initialState {
    dobPlanoId: number;
    appUserCreaId: number;
    appUserId: number;
    estado: string;
    codigo: string;
  }
  const initialStateVar = {
    dobPlanoId: 0,
    appUserCreaId: 0,
    appUserId: 0,
    estado: "",
    codigo: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { TitleChanger } = useTitleOfApp();
  // const params: any = useParams();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [estadoPlano, setestadoPlano] = useState([]);
  const { getConfirmation } = useConfirmationDialog();

  // getCodigoPlano();
  const getCodigoPlano = async (codigo) => {
    try {
      getEstadoPlano(codigo.value);
    } catch (error) {
      openNotificationUI("Error al leer el código del plano.", "error");
    }
  };

  //buscar Impresion Plano
  const getEstadoPlano = async (codigo) => {
    if (codigo === "") {
      openNotificationUI("Error en el código de impresión del plano", "error");
    } else {
      try {
        const response = unwrapResult(await dispatch(DobImpresionesPlanosSliceRequests.getByIdRequest(codigo)));
        const arreglo = [];
        if (isEmpty(response)) {
          openNotificationUI("Impresión del plano dado de Baja", "error");
        } else {
          arreglo.push(response);
        }
        setestadoPlano(arreglo);
      } catch (error) {
        openNotificationUI("Error al buscar impresión del plano.", "error");
      }
    }
  };

  //Cambio de estado del plano
  const cambioEstadoImpresion = async (row) => {
    let oCambio = {
      id: row.id,
      dobPlanoId: row.dobPlanoId,
      appUserCreaId: row.appUserCreaId,
      appUserId: infoUser.id,
      estado: "Baja",
      createdDate: row.createdDate,
      lastModifiedDate: row.lastModifiedDate,
      deleted: row.deleted
    };
    if (row.estado == "Baja") {
      oCambio = {
        ...oCambio,
        estado: "Activo"
      };
    }
    const resp = await getConfirmation(
      "Modificar estado de impresión",
      "Está seguro que desea cambiar el estado del registro de impresión?"
    );
    if (!isObject(resp)) {
      if (resp) {
        try {
          const response = await dispatch(
            DobImpresionesPlanosSliceRequests.PutRequest(JSON.parse(JSON.stringify(oCambio)))
          );
          if (response) {
            openNotificationUI("Se modificó el estado del registro de impresión", "success");
            getEstadoPlano(row.id);
          }
        } catch (error) {
          openNotificationUI("Error al  modificar el estado del registro de impresión.", "error");
        }
      }
    }
  };

  //Eliminar
  const deleteImpresionPlano = async (row) => {
    const resp = await getConfirmation(
      "Borrar impresión",
      "Esta seguro que desea eliminar el registro de impresión del plano?"
    );
    if (!isObject(resp)) {
      if (resp) {
        try {
          const response = unwrapResult(await dispatch(DobImpresionesPlanosSliceRequests.deleteRequest(row)));
          if (response) {
            openNotificationUI("Se elimino el registro de impresión correctamente", "success");
            getEstadoPlano(row);
          }
        } catch (error) {
          openNotificationUI("Error al eliminar el regitro de impresión.", "error");
        }
      }
    }
  };

  React.useEffect(() => {
    TitleChanger("BAJA DE PLANOS");
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Controller
          name="codigo"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <TextField
                fullWidth
                label="Identificador"
                variant="standard"
                type="text"
                // inputProps={{ maxLength: 1, style: { textTransform: "uppercase" } }}
                {...field}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    getCodigoPlano(event.target);
                  }
                }}
              />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
      </div>
      <div className="my-2 mx-4 h-full">
        {estadoPlano && (
          <TableComponent
            Dense={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Id Impresión",
                field: "id"
              },
              {
                title: "Id Plano",
                field: "dobPlanoId"
              },
              {
                title: "Estado",
                field: "estado"
              },
              {
                title: "Fecha de Impresión",
                field: "",
                render: (row) => {
                  return moment(row.createdDate).format("YYYY-MM-DD HH:mm");
                }
              },
              {
                title: "Fecha de Modificación",
                field: "",
                render: (row) => {
                  return moment(row.lastModifiedDate).format("YYYY-MM-DD HH:mm");
                }
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Cambiar Estado">
                          <span>
                            <IconButton
                              // disabled={!esCalidad}
                              onClick={() => {
                                cambioEstadoImpresion(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <ChangeCircle color="warning" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Eliminar">
                          <IconButton
                            // disabled={!esCalidad}
                            onClick={() => {
                              deleteImpresionPlano(row.id);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={estadoPlano}
          />
        )}
      </div>
    </div>
  );
};
