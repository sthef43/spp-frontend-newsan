/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { List, Collapse, IconButton, ListItem, ListItemText, Button } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useInputValidations } from "app/shared/hooks/useInputValidations";

interface RenderItemOptions {
  item: string;
  handleRemoveEmail: (item: string) => void;
}

interface Props {
  openModal: boolean;
  grupoSeleccionado: string;
  setOpenModal: (newValue: boolean) => void;
  setGrupoSeleccionado: (newValue: string) => void;
}

function renderItem({ item, handleRemoveEmail }: RenderItemOptions) {
  return (
    <ListItem
      sx={{ backgroundColor: "var(--background-color)", margin: "0.5rem 0" }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" title="Eliminar email" onClick={() => handleRemoveEmail(item)}>
          <DeleteRounded />
        </IconButton>
      }>
      <ListItemText primary={item} />
    </ListItem>
  );
}

export const HorasExtrasCargaEmails: React.FC<Props> = ({
  setOpenModal,
  openModal,
  grupoSeleccionado,
  setGrupoSeleccionado
}) => {
  const { control, watch, trigger, setValue } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const {
    validators: { isEmail }
  } = useInputValidations(trigger);
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const handleRemoveEmail = (item: string) => {
    const itemRemove = (grupoSeleccionado as string).split(";").filter((i) => i !== item);
    setGrupoSeleccionado(itemRemove.join(";"));
  };

  const handleAddEmail = () => {
    const newEmail: string = watch("emailNuevo");
    const validacion = isEmail("Debe ingresar un email valido");
    const aux = validacion(newEmail);
    if (aux === true) {
      setGrupoSeleccionado((grupoSeleccionado as string) + ";" + newEmail);
      openNotificationUI("Email agregado exitosamente", "success");
      setValue("emailNuevo", "");
    } else {
      openNotificationUI("Debe ingresar un email valido", "error");
    }
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[65vw]" activeEffectVisible>
      <div className="flex flex-row items-center gap-x-4">
        <TextFieldComponent
          control={control}
          index={0}
          nameInput="emailNuevo"
          labelInput="Agregar nuevo email"
          valueDefault=""
        />
        <Button className={buttonClases.blueButton} variant="contained" onClick={handleAddEmail}>
          <AddRounded fontSize="small" />
          Agregar
        </Button>
      </div>
      <ContainerForPages
        optionsLayout="personalized"
        classNamePersonalized="w-full h-full rounded-md"
        activeEffectVisible>
        <List className="mt-1 overflow-auto monitor:h-[50vh]">
          <TransitionGroup>
            {(grupoSeleccionado as string).split(";").map((item, index) => (
              <Collapse key={index}>{renderItem({ item, handleRemoveEmail })}</Collapse>
            ))}
          </TransitionGroup>
        </List>
      </ContainerForPages>
    </ContainerForPages>
  );
};
