/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { AssignmentTurnedIn } from "@mui/icons-material";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { WhatsappMsgappUserSliceRequests } from "app/features/admin/slices/WhatsappMsgAppUserSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { IWhatsappMsgAppUser } from "app/models/IIWhatsappMsgAppUser";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SkeletonComponent } from "app/shared/helpers/Layouts/Skeleton/SkeletonComponent";

interface Props {
  rowSelected: IWhatsappMsg;
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  opcionSeleccionada: number;
}

export const AccionAsignarUsuarios: React.FC<Props> = ({
  rowSelected,
  setOpenModal,
  openModal,
  opcionSeleccionada
}) => {
  const {
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm();

  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const plantaSeleccionada = useAppSelector((state) => state.plant.object as IPlant);

  const [selectedUser, setselectedUser] = useState<IAppUser>(null);
  const [valor, setValor] = useState();

  const [usersList, setUsersList] = useState<IAppUser[]>([]);
  FetchApi<IWhatsappMsgAppUser[]>(
    WhatsappMsgappUserSliceRequests.GetAllUsersWithNoAssigment,
    { opcionId: opcionSeleccionada, whatsappMsgId: rowSelected.id, plantId: plantaSeleccionada.id },
    false,
    opcionSeleccionada,
    setUsersList,
    false,
    true,
    true
  );

  const [dataInfo, setDataInfo] = useState<IWhatsappMsgAppUser[]>([]);
  FetchApi<IWhatsappMsgAppUser[]>(
    WhatsappMsgappUserSliceRequests.GetAllByOpcionAsign,
    { opcionId: opcionSeleccionada, whatsappMsgId: rowSelected.id },
    false,
    opcionSeleccionada,
    setDataInfo,
    true,
    false,
    false
  );

  const guardar = async (e) => {
    const cargarNuevoUsuario = generarNuevoMsgUser(e);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(WhatsappMsgappUserSliceRequests.PostRequest(cargarNuevoUsuario)));
      if (response) {
        const refreshUsers = unwrapResult(
          await dispatch(
            WhatsappMsgappUserSliceRequests.GetAllUsersWithNoAssigment({
              opcionId: opcionSeleccionada,
              whatsappMsgId: rowSelected.id,
              plantId: plantaSeleccionada.id
            })
          )
        );
        const refreshTableUsers = unwrapResult(
          await dispatch(
            WhatsappMsgappUserSliceRequests.GetAllByOpcionAsign({
              opcionId: opcionSeleccionada,
              whatsappMsgId: rowSelected.id
            })
          )
        );
        if (refreshUsers && refreshTableUsers) {
          setUsersList(refreshUsers);
          setDataInfo(refreshTableUsers);
          openNotificationUI("Se agrego el usuario", "success");
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const activarUsuario = async (row) => {
    let respuesta;
    if (row.activo) {
      respuesta = await getConfirmation(
        "Descativar mensajes",
        "¿ Seguro que desea desactivar los mensajes para esta persona ?"
      );
    } else
      respuesta = await getConfirmation(
        "Activar mensajes",
        "¿ Seguro que desea activar los mensajes para esta persona ?"
      );
    if (respuesta == false) return false;
    const objectSubmit = { ...row, activo: !row.activo, appUser: null };
    const result = unwrapResult(await dispatch(WhatsappMsgappUserSliceRequests.PutRequest(objectSubmit)));
    const refreshTableUsers = unwrapResult(
      await dispatch(
        WhatsappMsgappUserSliceRequests.GetAllByOpcionAsign({
          opcionId: opcionSeleccionada,
          whatsappMsgId: rowSelected.id
        })
      )
    );
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setDataInfo(refreshTableUsers);
    } else {
      openNotificationUI("Error al guardar :(", "error");
    }
  };

  const handleChange = (e, value) => {
    if (value) setselectedUser(usersList?.find((x) => x.id === value?.id));
  };

  const generarNuevoMsgUser = (data) => {
    try {
      const nuevoUser: IWhatsappMsgAppUser = {
        activo: false,
        appUserId: selectedUser.id,
        whatsappMsgOpcionAsignacionId: opcionSeleccionada,
        whatsappMsgId: rowSelected.id
      };
      if (nuevoUser !== null) {
        return nuevoUser;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error", "warning");
    }
  };

  const CustomAutocomplete = (options, onChange, defaultValue) => {
    return (
      <Autocomplete
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        getOptionLabel={(option) => option.operator.name + " " + option.operator.surname}
        renderInput={(props) => <TextField {...props} fullWidth label="Usuario del sistema" />}
      />
    );
  };

  return (
    <main className="w-[55vw]">
      {usersList && usersList.length == 0 ? (
        <SkeletonComponent />
      ) : (
        <>
          <form onSubmit={handleSubmit(guardar)} className="w-full">
            <div className="w-full">
              {CustomAutocomplete(
                usersList.filter((elementos) => elementos.operator.surname !== "Senior"),
                handleChange,
                valor
              )}
            </div>
            <div className="p-2 text-center">
              <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
                Guardar
              </Button>
            </div>
          </form>
          <ContainerForPages optionsLayout="Table" tableForModalOrPageStyle="Modal">
            <TableComponent
              Dense={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "User",
                  field: "appUser.username"
                },
                {
                  title: "Activo",
                  field: "",
                  render: (row) => {
                    return row.activo == true ? "SI" : "NO";
                  }
                },
                {
                  title: "Telefono",
                  field: "appUser.telefono"
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <div className="flex w-full justify-end sm:justify-start gap-4">
                        <div>
                          <IconButton
                            onClick={() => {
                              //accionAsignarUsuarios(row);
                              activarUsuario(row);
                            }}
                            size="small"
                            color={row.activo == true ? "success" : "error"}
                            style={{ position: "relative" }}>
                            <AssignmentTurnedIn />
                          </IconButton>
                        </div>
                      </div>
                    );
                  }
                }
              ]}
              dataInfo={dataInfo}
            />
          </ContainerForPages>
        </>
      )}
    </main>
  );
};
