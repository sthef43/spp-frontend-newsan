/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Delete } from "@mui/icons-material";
import Done from "@mui/icons-material/Done";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IconButtons } from "app/shared/components/material-ui/MaterialButtons";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EmailForm } from "../Modals/EmailForm";

interface initialState {
  planta: string;
  grupo: string;
  mail: string;
}
const initialStateVar = {
  planta: "",
  grupo: "",
  mail: ""
};

export const EmailCrud = (): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = IconButtons();

  const [editState, setEditState] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);

  const watchPlantaId = watch("planta");
  const watchGrupoId = watch("grupo");

  //Leer
  const [listPlantas, setListPlantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  //Leer Emails por Planta
  const [listEmails, setEmails] = useState([]);
  const getEmails = async () => {
    if (watchPlantaId) {
      try {
        const responses = unwrapResult(
          await dispatch(EmailGroupSliceRequests.getAllByPlantIdRequest(parseInt(watchPlantaId)))
        );
        setEmails(responses);
      } catch (error) {
        openNotificationUI("Error al leer Emails.", "error");
      }
    }
  };

  //Leer Emails por Planta
  const [listCorreos, setCorreos] = useState([]);
  const getListadoCorreos = async () => {
    const obj = listEmails.find((item) => item.id === watchGrupoId);
    setEditState(obj);
    if (obj && obj.emails) {
      const cadenaCorreos = obj.emails;
      const correos = cadenaCorreos.split(";");
      const correosConID = correos.map((correo, index) => ({
        id: index + 1,
        email: correo
      }));
      setCorreos(correosConID);
    } else {
      setCorreos([]);
    }
  };

  // Eliminar Mail
  const deleteMail = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar?");
    if (resp) {
      const correosFiltrados = listCorreos.filter((correo) => correo.id !== row);
      const correos = correosFiltrados.map((correo) => correo.email);
      const cadenaDeCorreos = correos.join(";");
      const listEmailsFiltrados = listEmails.map((correo) => {
        if (correo.id === watchGrupoId) {
          return {
            ...correo,
            emails: cadenaDeCorreos
          };
        }
        return correo;
      });
      const listEmailsFiltrados2 = listEmailsFiltrados.filter((correo) => correo.id == watchGrupoId);
      const objectSubmit = {
        id: listEmailsFiltrados2[0].id,
        name: listEmailsFiltrados2[0].name,
        emails: listEmailsFiltrados2[0].emails,
        rolId: 5,
        rol: null,
        plantId: listEmailsFiltrados2[0].plantId,
        plant: null,
        lineId: null,
        line: null,
        auditId: null,
        deleted: listEmailsFiltrados2[0].deleted,
        createdDate: listEmailsFiltrados2[0].createdDate
      };
      try {
        const result = unwrapResult(await dispatch(EmailGroupSliceRequests.PutRequest(objectSubmit)));
        openNotificationUI("Eliminado...", "success");
        getEmails();
      } catch (x) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  // Agregar Mail
  const loginSubmit = async (e) => {
    const objNuevo = {
      ...editState,
      emails: editState.emails == "" ? e.mail : editState.emails + ";" + e.mail
    };
    try {
      const result = unwrapResult(await dispatch(EmailGroupSliceRequests.PutRequest(objNuevo)));
      openNotificationUI("Agregado...", "success");
      getEmails();
      setValue("mail", "");
    } catch (x) {
      openNotificationUI("Error al agregar.", "error");
    }
  };

  const agregarGrupo = () => {
    if (watchPlantaId) {
      setModalOpen(true);
    } else {
      openNotificationUI("Seleccionar Planta.", "error");
    }
  };

  //Habilitar Lista de Mails
  useEffect(() => {
    setCorreos([]);
    getEmails();
  }, [watchPlantaId]);

  useEffect(() => {
    getListadoCorreos();
  }, [listEmails]);

  useEffect(() => {
    getListadoCorreos();
  }, [watchGrupoId]);

  useEffect(() => {
    TitleChanger("EMAIL GROUP");
    getPlantas();
  }, []);

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit(loginSubmit)} className="w-full h-full p-4">
        <div className="h-full rounded-lg shadow-lg bg-secondaryNew flex flex-row gap-x-4 p-4">
          <div className="w-full">
            <Controller
              name="planta"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="standard" error={!!error}>
                  <InputLabel>Planta</InputLabel>
                  <Select {...field} placeholder="Seleccione Planta" variant="standard">
                    {listPlantas &&
                      listPlantas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div>{x.name}</div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="grupo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="standard" error={!!error}>
                  <InputLabel>Grupo de mails</InputLabel>
                  <Select {...field} placeholder="Seleccione Grupo" variant="standard">
                    {listEmails &&
                      listEmails.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
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
        </div>

        {/* Visualizo tipo form */}
        <div className="h-full bg-secondaryNew p-2 pb-4 mt-4 rounded-md shadow-md">
          <TableComponent
            Dense={true}
            Overflow={false}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Mail",
                field: "email"
              },
              // {
              //   title: "Fecha Creación",
              //   field: "",
              //   render: (row) => {
              //     return moment(row.createdDate).format("L");
              //   }
              // },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              deleteMail(row.id);
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
            agregar={() => {
              agregarGrupo();
            }}
            dataInfo={listCorreos}
          />
        </div>

        {/* Aregar un mail */}
        <div className="h-full p-3 mt-6 rounded-lg shadow-md bg-secondaryNew">
          {/* <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid }>
              Agregar Mail
            </Button> */}
          <Controller
            name="mail"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl variant="outlined" error={!!error} style={{ width: "100%" }}>
                <Box display="flex" alignItems="center">
                  <TextField
                    label="Agregar Correo"
                    // defaultValue="@newsan.com.ar"
                    variant="outlined"
                    type="email"
                    error={!!error?.types}
                    // helperText={error?.type}
                    {...field}
                    disabled={!listEmails}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{ width: "60%" }}
                  />
                  <div className="ml-2">
                    <Tooltip title="Agregar Correo">
                      <IconButton
                        className={classes.greenIcon}
                        disabled={!isDirty && !isValid && !listEmails}
                        size="large"
                        type="submit"
                        // style={{ width: "5%" }}
                      >
                        <Done />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Box>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <ModalCompoment title="Agregar Grupo" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <EmailForm setOpenPopup={setModalOpen} plantaIdSelect={parseInt(watchPlantaId)} refresh={getEmails} />
        </ModalCompoment>
      </form>
    </div>
  );
};
