/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { IAppUser, IEmailGroup, IPlant } from "app/models";
import { IAuditoriaTipo } from "../../../models/IAuditoriaTipo";
import FetchApi from "app/shared/helpers/FetchApi";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { AuditoriaTipoSliceRequest } from "../../../slices/AuditoriaTipoSlice";
import { ListItem, IconButton, ListItemText, Collapse, List, Button } from "@mui/material";
import { AddCircle, DeleteRounded, MailRounded } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useHistory, useParams } from "react-router-dom";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface RenderItemOptions {
  item: string;
  handleRemoveEmail: (item: string) => void;
}

function renderItem({ item, handleRemoveEmail }: RenderItemOptions) {
  return (
    <ListItem
      sx={{
        backgroundColor: "var(--background-color)",
        margin: "0rem 0 1rem",
        borderRadius: "5px",
        border: "1px solid rgb(209, 213, 219)"
      }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" title="Eliminar email" onClick={() => handleRemoveEmail(item)}>
          <DeleteRounded />
        </IconButton>
      }>
      <ListItemText primary={item} />
    </ListItem>
  );
}

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
  triggerFather: UseFormTrigger<FieldValues>;
}

export const CreacionAuditoriaPrimerPaso: React.FC<Props> = ({
  controlFather,
  setValuesFather,
  resetFather,
  errosFather,
  triggerFather
}) => {
  const auditoria = useAppSelector((state) => state.auditoriaAsignada.data as IAuditoriaAsignada);
  const { listaEmails } = useAppSelector((state) => state.auditoriasUI);
  const planta = useAppSelector((state) => state.plant.object as IPlant);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const params = useParams<{ id: string }>();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const {
    validators: { isEmail }
  } = useInputValidations(triggerFather);
  const history = useHistory();

  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | number>(
    auditoria && params ? auditoria.auditoriaMailGroup : ""
  );

  const [emails, setEmails] = useState<IEmailGroup[]>([]);

  const [activeFecth, setActiveFecth] = useState<boolean>(false);

  const [tiposAuditoria, setTiposAuditoria] = useState<IAuditoriaTipo[]>([]);

  FetchApi<IAuditoriaTipo[]>(
    AuditoriaTipoSliceRequest.GetTiposByRolId,
    infoUser.permisos.rolId,
    false,
    true,
    setTiposAuditoria,
    true,
    false,
    false
  );

  FetchApi<IEmailGroup[]>(
    EmailGroupSliceRequests.getAllByPlantIdRequest,
    planta ? planta.id : 0,
    false,
    activeFecth,
    setEmails,
    true,
    false,
    false,
    () => setActiveFecth(false)
  );

  const handleRemoveEmail = (item: string) => {
    const itemRemove = (grupoSeleccionado as string).split(";").filter((i) => i !== item);
    setGrupoSeleccionado(itemRemove.join(";"));
  };

  const handleAddEmail = () => {
    const newEmail: string = controlFather._getWatch("mailNuevo");
    const validacion = isEmail("Debe ingresar un email valido");
    const aux = validacion(newEmail);
    if (aux === true) {
      setGrupoSeleccionado((grupoSeleccionado as string) + ";" + newEmail);
      setValuesFather("mailNuevo", "");
    } else {
      openNotificationUI("Debe ingresar un email valido", "error");
    }
  };

  const cambiarListaEmails = () => {
    let listaEmailsFormateada = "";
    if (grupoSeleccionado && (grupoSeleccionado as string).length > 0) {
      listaEmailsFormateada = (grupoSeleccionado as string).split(";").join(";");
      setGrupoSeleccionado(listaEmailsFormateada);
    } else {
      const auxEmails = listaEmails.split(";").join(";");
      setGrupoSeleccionado(auxEmails);
    }
  };

  useEffect(() => {
    setActiveFecth(true);
    if (!planta) {
      history.push("/main/auditorias-v2/creacion-auditorias");
    }
  }, [planta]);

  useEffect(() => {
    if (grupoSeleccionado) {
      dispatch(auditoriasUISlice.actions.setListaEmails(grupoSeleccionado as string));
    }
  }, [grupoSeleccionado]);

  useEffect(() => {
    if (auditoria) {
      cambiarListaEmails();
    }
  }, [auditoria]);

  return (
    <main className="w-full flex flex-col justify-center items-center gap-y-6">
      <div className="w-full flex flex-row items-center gap-x-5">
        <TextFieldComponent
          control={controlFather}
          nameInput="nombreAuditoria"
          labelInput="Nombre de la auditoria"
          valueDefault={params && auditoria ? auditoria.nombre : ""}
          index={0}
          requiredBool
          errors={errosFather}
        />
        <TextFieldComponent
          control={controlFather}
          nameInput="numeroRegistro"
          labelInput="Numero de registro"
          valueDefault={params && auditoria ? auditoria.numeroRegistro : ""}
          index={1}
          requiredBool
          errors={errosFather}
        />
      </div>
      <SelectComponent
        control={controlFather}
        nameSelect="tipoAuditoria"
        inputLabel="Seleccione un tipo de auditoria"
        listaObjetos={tiposAuditoria}
        valueLabel={(value) => value.nombre}
        valueSelect={(value) => value.id}
        ValueSave={(value) => dispatch(auditoriasUISlice.actions.setTipoAuditoria(value as number))}
        defaultValue={params && auditoria ? auditoria.auditoria?.tipoAuditoriaId : ""}
        valueKey={(value) => value}
      />
      <SelectComponent
        control={controlFather}
        nameSelect="listaEmails"
        inputLabel="Seleccione un grupo de emails"
        listaObjetos={emails}
        valueLabel={(value) => value.name}
        valueSelect={(value) => value.emails}
        ValueSave={(value) => setGrupoSeleccionado(value)}
        defaultValue={auditoria && params ? auditoria.auditoriaMailGroup : ""}
        valueKey={(value) => value}
      />
      {listaEmails && (
        <div className="w-full bg-secondaryNew rounded-md shadow-sm border border-gray-300">
          <div className="flex flex-row items-center gap-x-2 justify-between bg-backgroundModalAudit p-4 border-b border-gray-300">
            <div className="w-1/2">
              <TextFieldComponent
                control={controlFather}
                nameInput="mailNuevo"
                labelInput="Agregar nuevo mail"
                activePropsInput
                inputProps={{
                  endAdornment: <MailRounded color="primary" />
                }}
                valueDefault=""
                index={2}
              />
            </div>
            <Button
              onClick={handleAddEmail}
              className={`${buttonClases.blueButton} p-[.75rem] w-1/6`}
              variant="contained">
              <AddCircle sx={{ marginRight: "10px" }} />
              Agregar
            </Button>
          </div>
          <ContainerForPages
            optionsLayout="personalized"
            classNamePersonalized="w-full h-full bg-secondaryNew p-4 rounded-md shadow-md "
            activeEffectVisible>
            <List className="overflow-auto h-[18rem] monitor:h-[50vh] py-0">
              <TransitionGroup>
                {listaEmails.split(";").map((item, index) => (
                  <Collapse key={index}>{renderItem({ item, handleRemoveEmail })}</Collapse>
                ))}
              </TransitionGroup>
            </List>
          </ContainerForPages>
        </div>
      )}
    </main>
  );
};
