/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useForm } from "react-hook-form";
import { IAuditoriasHistorico } from "../../../models/IAuditoriasHistorico";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import moment from "moment";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AuditoriasHistoricoSliceRequest } from "../../../slices/AuditoriasHistoricoSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  auditoriaSeleccionada: IAuditoriasHistorico;
  setActiveFetch: (newValue: boolean) => void;
}

export const DarBajaAuditoria: React.FC<Props> = ({ setOpenModal, auditoriaSeleccionada, setActiveFetch }) => {
  const {
    control,
    trigger,
    handleSubmit,
    formState: { isValid, errors }
  } = useForm();

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);

  const fechaBaja = moment().format("YYYY-MM-DD HH:mm:ss");
  const { FetchPut } = useFetchApiMultiResults();
  const {
    validators: { minLength }
  } = useInputValidations(trigger);
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = (data: any) => {
    const nuevaBaja = generarNuevaBaja(data);
    FetchPut({
      consoleLog: false,
      modelPut: nuevaBaja,
      sliceRequest: AuditoriasHistoricoSliceRequest.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "¿Desea continuar con dar de baja la auditoria seleccionada?",
      titleUser: "Dar de baja auditoria",
      functionAdd: () => {
        openNotificationUI("Auditoria dada de baja exitosamente", "success");
        setActiveFetch(true);
        setOpenModal(false);
      }
    });
  };

  const generarNuevaBaja = (data: any) => {
    const clonBaja = {
      ...auditoriaSeleccionada,
      estadoAuditoria: false,
      fechaBaja: fechaBaja,
      responsableBajaId: infoUser.operatorId,
      comentarioBaja: data.comentario
    };

    delete clonBaja.plant;
    delete clonBaja.operator;
    delete clonBaja.turno;

    return clonBaja;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[40vw]">
      <TextFieldComponent
        control={control}
        nameInput="comentario"
        labelInput="Ingrese el comentario de el porque de la baja"
        typeInput="standard"
        requiredBool
        index={0}
        valueDefault=""
        validacionAdicionales={minLength(10, "El comentario debe tener al menos 10 caracteres")}
        errors={errors}
      />
      <div className="mt-6">
        <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} submitName="Aceptar" />
      </div>
    </form>
  );
};
