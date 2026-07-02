/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { Button } from "@mui/material";

export const FormGestionEmpresas: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-x-2 w-full">
      <div className="flex flex-row gap-x-2 w-full">
        <div className="flex flex-col items-start w-full gap-y-1">
          <p>Nombre de la Empresa</p>
          <TextFieldComponent
            index={0}
            control={control}
            nameInput="nombreEmpresa"
            labelInput=""
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-col items-start w-full gap-y-1">
          <p>Correo Electronico</p>
          <TextFieldComponent
            index={1}
            control={control}
            nameInput="correoElectronico"
            labelInput=""
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-col items-start w-full gap-y-1">
          <p>Nombre Contacto</p>
          <TextFieldComponent
            index={2}
            control={control}
            nameInput="nombreContacto"
            labelInput=""
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-col items-start w-full gap-y-1">
          <p>Telefono</p>
          <TextFieldComponent
            index={3}
            control={control}
            nameInput="telefono"
            labelInput=""
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-row w-full justify-end mt-4">
        <Button variant="contained" type="submit" disabled={!isValid} className={buttonClases.blueButton}>
          Registrar Empresa
        </Button>
      </div>
    </form>
  );
};
