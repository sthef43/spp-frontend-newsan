/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAppUser } from "app/models";
import { IAuditoriaTipos } from "../../../models/IAuditoriaTipos";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AuditoriaTiposSliceRequest } from "../../../slices/AuditoriaTiposSlice";
import { statesForActiveFetchsSlice } from "../../../slices/StatesForActiveFetchsSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
}

export const AgregarTipoAgrupacion: React.FC<Props> = ({ setOpenModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost } = useFetchApiMultiResults<IAuditoriaTipos>();
  const { getConfirmation } = useConfirmationDialog();

  const onSubmit = async (data: any) => {
    const nuevoTipo = generarNuevoTipo(data);
    if (await getConfirmation("Agregar Tipo de Agrupacion", "¿Estas seguro de agregar este tipo?", null, "Aceptar")) {
      FetchPost(AuditoriaTiposSliceRequest.PostRequest, nuevoTipo, false, () => {
        openNotificationUI("Tipo agregado con exito!", "success");
        dispatch(statesForActiveFetchsSlice.actions.setActiveFetchTipoAgrupacion(true));
        setOpenModal(false);
      });
    }
  };

  const generarNuevoTipo = (data) => {
    const nuevoTipo: IAuditoriaTipos = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      rolId: infoUser.permisos.rolId
    };
    return nuevoTipo;
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[45vw]" activeEffectVisible>
      <form className="flex flex-col gap-4 w-full">
        <TextFieldComponent
          control={control}
          nameInput="nombre"
          labelInput="Nombre del tipo"
          errors={errors}
          requiredBool
          valueDefault=""
          index={0}
        />
        <TextFieldComponent
          control={control}
          nameInput="descripcion"
          labelInput="Descripción del tipo"
          errors={errors}
          requiredBool
          valueDefault=""
          index={1}
        />
        <div className="flex justify-center gap-x-4">
          <div className="mt-4">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className={buttonClasses.greenButton}
              type="button"
              variant="contained">
              Guardar
            </Button>
          </div>
          <div className="mt-4">
            <Button
              className={buttonClasses.redButton}
              type="button"
              variant="contained"
              onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </ContainerForPages>
  );
};
