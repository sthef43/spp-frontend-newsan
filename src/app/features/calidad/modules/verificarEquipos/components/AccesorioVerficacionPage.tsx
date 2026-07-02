/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

export const AccesorioVerficacionPage = () => {
  const {
    control,
    formState: { errors }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  return (
    <main className="m-3 pb-3">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese el codigo de accesorio"
        nameInput="codigoAccesorio"
        valueDefault=""
        requiredBool
        errors={errors}
      />
    </main>
  );
};
