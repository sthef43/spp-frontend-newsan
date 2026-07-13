import { Delete } from "@mui/icons-material";
import Done from "@mui/icons-material/Done";
import { IconButton, Tooltip } from "@mui/material";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IconButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { IPlant } from "app/models";
import { IEmailGroup } from "app/models/IEmailGroup";
import { EmailForm } from "../Modals/EmailForm";
import { ModalCompoment } from "app/shared/components/ModalComponent";

interface EmailFormValues {
  planta: string;
  grupo: string;
  mail: string;
}

interface CorreoItem {
  id: number;
  email: string;
}

const defaultFormValues: EmailFormValues = {
  planta: "",
  grupo: "",
  mail: ""
};

export const EmailCrud = (): JSX.Element => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isDirty, isValid }
  } = useForm<EmailFormValues>({
    defaultValues: defaultFormValues,
    mode: "onChange"
  });

  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults<IEmailGroup>();
  const classes = IconButtons();

  const [editState, setEditState] = useState<IEmailGroup | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const watchPlantaId = watch("planta");
  const watchGrupoId = watch("grupo");

  const [listPlantas, setListPlantas] = useState<IPlant[]>([]);
  const [listEmails, setListEmails] = useState<IEmailGroup[]>([]);
  const [listCorreos, setListCorreos] = useState<CorreoItem[]>([]);

  FetchApi<IPlant[]>(
    PlantSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => setListPlantas(data ?? [])
  );

  const plantIdParsed = watchPlantaId ? parseInt(watchPlantaId, 10) : null;
  FetchApi<IEmailGroup[]>(
    EmailGroupSliceRequests.getAllByPlantIdRequest,
    plantIdParsed,
    false,
    plantIdParsed,
    (data) => setListEmails(data ?? []),
    true
  );

  const getListadoCorreos = useCallback(() => {
    const obj = listEmails.find((item) => String(item.id) === String(watchGrupoId));
    setEditState(obj ?? null);
    if (obj?.emails) {
      const correosConID = obj.emails
        .split(";")
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .map((correo, index) => ({
          id: index + 1,
          email: correo
        }));
      setListCorreos(correosConID);
    } else {
      setListCorreos([]);
    }
  }, [listEmails, watchGrupoId]);

  const handleDeleteMail = async (rowId: number) => {
    const grupoActual = listEmails.find((correo) => String(correo.id) === String(watchGrupoId));
    if (!grupoActual) return;

    const correosFiltrados = listCorreos.filter((correo) => correo.id !== rowId);
    const cadenaDeCorreos = correosFiltrados.map((correo) => correo.email).join(";");

    await FetchPut({
      sliceRequest: EmailGroupSliceRequests.PutRequest,
      modelPut: { ...grupoActual, emails: cadenaDeCorreos },
      consoleLog: false,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Eliminar correo",
      messageUser: "Esta seguro que quiere eliminar este correo?",
      functionAdd: () => {
        openNotificationUI("Eliminado...", "success");
      }
    });
  };

  const handleAddMail = async (e: EmailFormValues) => {
    if (!editState) return;

    const objNuevo = {
      ...editState,
      emails: editState.emails === "" ? e.mail : editState.emails + ";" + e.mail
    };

    await FetchPut({
      sliceRequest: EmailGroupSliceRequests.PutRequest,
      modelPut: objNuevo,
      consoleLog: false,
      activeConfirmation: false,
      functionAdd: () => {
        openNotificationUI("Agregado...", "success");
        setValue("mail", "");
      }
    });
  };

  const agregarGrupo = () => {
    if (watchPlantaId) {
      setModalOpen(true);
    } else {
      openNotificationUI("Seleccionar Planta.", "error");
    }
  };

  useEffect(() => {
    getListadoCorreos();
  }, [getListadoCorreos]);

  useEffect(() => {
    TitleChanger("EMAIL GROUP");
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full">
          <SelectComponentForm
            name="planta"
            control={control}
            listItems={listPlantas}
            valueLabel={(item) => item.name}
            valueSelect={(item) => item.id}
            label="Planta"
            variant="standard"
            rules={{ required: "Planta es requerida" }}
          />
        </div>
        <div className="w-full">
          <SelectComponentForm
            name="grupo"
            control={control}
            listItems={listEmails}
            valueLabel={(item) => item.name ?? ""}
            valueSelect={(item) => item.id}
            label="Grupo de mails"
            variant="standard"
            disabled={!listEmails || listEmails.length === 0}
            rules={{ required: "Grupo es requerido" }}
          />
        </div>
      </ContainerForPages>

      <ContainerForPages optionsLayout="Table" activeEffectVisible>
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
            {
              title: "Acciones",
              field: "",
              render: (row: CorreoItem) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            handleDeleteMail(row.id);
                          }}
                          size="small"
                          className="relative">
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
      </ContainerForPages>

      <form onSubmit={handleSubmit(handleAddMail)} className="w-full">
        <div className="h-full p-3 mt-6 rounded-lg shadow-md bg-secondaryNew">
          <InputComponentForm
            name="mail"
            control={control}
            label="Agregar Correo"
            typeDate="text"
            variant="outlined"
            disabled={!listEmails || listEmails.length === 0}
            rules={{
              required: "Correo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingrese un correo válido"
              }
            }}
          />
          <div className="mt-2 flex justify-center">
            <Tooltip title="Agregar Correo">
              <IconButton
                className={classes.greenIcon}
                disabled={!isDirty || !isValid || !listEmails || listEmails.length === 0}
                size="large"
                type="submit">
                <Done />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </form>

      <ModalCompoment title="Agregar Grupo" openPopup={modalOpen} setOpenPopup={setModalOpen} showModalCenterPage titleModalStyle="Audit">
        <EmailForm
          setOpenPopup={setModalOpen}
          plantaIdSelect={watchPlantaId ? parseInt(watchPlantaId, 10) : 0}
          refresh={() => {
            /* refresh handled by FetchApi re-fetch on watchPlantaId change */
          }}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
