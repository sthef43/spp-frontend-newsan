/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormControlLabel, Switch } from "@mui/material";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

export const FormGestionFlota: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();

  const ListaEmpresas = [
    {
      id: 1,
      nombre: "Empresa 1"
    },
    {
      id: 2,
      nombre: "Empresa 2"
    }
  ];

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-x-2 w-full items-end">
      <div className="flex flex-col items-start w-full gap-y-1">
        <p>Empresa</p>
        <SelectComponent
          control={control}
          nameSelect="empresa"
          listaObjetos={ListaEmpresas}
          activeRequired
          inputLabel=""
          valueKey={(e) => e}
          valueSelect={(e) => e.id}
          valueLabel={(e) => e.nombre}
        />
      </div>
      <div className="flex flex-col items-start w-full gap-y-1">
        <p>Tipo de Vehiculo</p>
        <SelectComponent
          control={control}
          nameSelect="tipoVehiculo"
          listaObjetos={ListaEmpresas}
          activeRequired
          inputLabel=""
          valueKey={(e) => e}
          valueSelect={(e) => e.id}
          valueLabel={(e) => e.nombre}
        />
      </div>
      <div className="flex flex-col items-start w-full gap-y-1">
        <p>Patente</p>
        <TextFieldComponent
          index={3}
          control={control}
          nameInput="patente"
          labelInput=""
          valueDefault=""
          requiredBool
          errors={errors}
        />
      </div>
      <div className="flex flex-row items-center w-full gap-x-3 justify-center">
        <div className="flex flex-col items-start gap-y-1">
          <p>Disponibilidad?</p>
          <p className="text-xs text-gray-500">Listo para operar?</p>
        </div>
        <Controller
          name={`disponibilidad`}
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
            <FormControl>
              <FormControlLabel
                label=""
                control={
                  <Switch size="medium" {...field} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
                }
              />
              {!!error && <p className="text-red-500 text-sm">{error.message}</p>}
            </FormControl>
          )}
        />
      </div>
      <div className="flex flex-row w-full justify-end mt-4">
        <Button variant="contained" type="submit" disabled={!isValid} className={buttonClases.blueButton}>
          Registrar Flota
        </Button>
      </div>
    </form>
  );
};
