import { AssignmentTurnedIn } from "@mui/icons-material";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import { WhatsappMsgappUserSliceRequests } from "app/features/admin/slices/WhatsappMsgAppUserSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { IWhatsappMsgAppUser } from "app/models/IIWhatsappMsgAppUser";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SkeletonComponent } from "app/shared/helpers/Layouts/Skeleton/SkeletonComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

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
  const { handleSubmit } = useForm();

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const plantaSeleccionada = useAppSelector((state) => state.plant.object as IPlant);

  const [selectedUser, setselectedUser] = useState<IAppUser | null>(null);

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

  const refreshData = async () => {
    const usersPromise = dispatch(
      WhatsappMsgappUserSliceRequests.GetAllUsersWithNoAssigment({
        opcionId: opcionSeleccionada,
        whatsappMsgId: rowSelected.id,
        plantId: plantaSeleccionada.id
      })
    );
    const tablePromise = dispatch(
      WhatsappMsgappUserSliceRequests.GetAllByOpcionAsign({
        opcionId: opcionSeleccionada,
        whatsappMsgId: rowSelected.id
      })
    );
    const [usersResult, tableResult] = await Promise.all([usersPromise, tablePromise]);
    if (usersResult.payload) setUsersList(usersResult.payload as IAppUser[]);
    if (tableResult.payload) setDataInfo(tableResult.payload as IWhatsappMsgAppUser[]);
  };

  const guardar = async () => {
    if (!selectedUser) return;
    const cargarNuevoUsuario: IWhatsappMsgAppUser = {
      activo: false,
      appUserId: selectedUser.id,
      whatsappMsgOpcionAsignacionId: opcionSeleccionada,
      whatsappMsgId: rowSelected.id
    };
    FetchPost(WhatsappMsgappUserSliceRequests.PostRequest, cargarNuevoUsuario, false, async () => {
      await refreshData();
      openNotificationUI("Se agrego el usuario", "success");
    });
  };

  const activarUsuario = async (row: IWhatsappMsgAppUser) => {
    const objectSubmit = { ...row, activo: !row.activo, appUser: null };
    FetchPut({
      sliceRequest: WhatsappMsgappUserSliceRequests.PutRequest,
      modelPut: objectSubmit,
      consoleLog: false,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "¿Está seguro de actualizar el estado del usuario?",
      titleUser: "Actualizar Usuario WhatsApp",
      functionAdd: async () => {
        const result = await dispatch(
          WhatsappMsgappUserSliceRequests.GetAllByOpcionAsign({
            opcionId: opcionSeleccionada,
            whatsappMsgId: rowSelected.id
          })
        );
        if (result.payload) setDataInfo(result.payload as IWhatsappMsgAppUser[]);
        openNotificationUI("Guardado exitosamente :)", "success");
      }
    });
  };

  const handleChange = (e: React.SyntheticEvent, value: IAppUser | null) => {
    if (value) setselectedUser(value);
  };

  return (
    <main className="w-[55vw]">
      {usersList && usersList.length == 0 ? (
        <SkeletonComponent />
      ) : (
        <>
          <form onSubmit={handleSubmit(guardar)} className="w-full">
            <div className="w-full">
              <Autocomplete
                options={usersList.filter((elementos) => elementos.operator.surname !== "Senior")}
                onChange={handleChange}
                getOptionLabel={(option: IAppUser) =>
                  option?.operator?.name + " " + option?.operator?.surname
                }
                renderInput={(props) => <TextField {...props} fullWidth label="Usuario del sistema" />}
              />
            </div>
            <div className="p-2 text-center">
              <Button className={classes.greenButton} type="submit" variant="contained" disabled={!selectedUser}>
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
                  render: (row: IWhatsappMsgAppUser) => {
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
                  render: (row: IWhatsappMsgAppUser) => {
                    return (
                      <div className="flex w-full justify-end sm:justify-start gap-4">
                        <div>
                          <IconButton
                            onClick={() => {
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
