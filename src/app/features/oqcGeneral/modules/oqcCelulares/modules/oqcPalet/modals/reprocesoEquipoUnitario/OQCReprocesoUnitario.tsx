/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { TextField } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OQCPuestoSeleccionLayout } from "./Layout/OQCPuestoSeleccionLayout";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const OQCReprocesoUnitario: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control, reset } = useForm();

  const paletSeleccionado = useAppSelector((state) => state.oqcPalet.object);
  const lineaSeleccionada = useAppSelector((state) => state.lineaProduccion.object);
  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);

  const [opcionesReproceso, setOpcionesReproceso] = useState<string | number>(0);

  const arrayConObjetosOpciones = [
    { id: 1, name: "Puesto Reproceso" },
    { id: 2, name: "Puesto Control" },
    { id: 3, name: "Puesto Embalaje" },
    { id: 4, name: "Puesto Embalaje (Sin Validacion)" }
  ];

  useEffect(() => {
    if (opcionesReproceso) {
      reset({
        opcionesReproceso
      });
    }
  }, [opcionesReproceso]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="personalized" classNamePersonalized="w-[80vw]">
      {infoUser && (
        <>
          <ContainerForPages optionsLayout="Selects">
            <TextField
              id="nombre-opeador"
              variant="standard"
              defaultValue={`${infoUser.operator.name} ${infoUser.operator.surname}`}
              label="Nombre"
              disabled
            />
            <TextField
              id="planta-operador"
              variant="standard"
              defaultValue={`${infoUser.operator.planta.name}`}
              label="Planta"
              disabled
            />
            <TextField
              id="modelo"
              variant="standard"
              defaultValue={paletSeleccionado.oqcModelo.modeloMoto}
              label="Modelo"
              disabled
            />
            <TextField id="linea" variant="standard" defaultValue={lineaSeleccionada.nombre} label="Linea" disabled />
          </ContainerForPages>
          <div className="my-6">
            <SelectComponent
              control={control}
              listaObjetos={arrayConObjetosOpciones}
              inputLabel="Seleccione una opcion"
              valueLabel={(item) => item.name}
              valueSelect={(item) => item.id}
              valueKey={(item) => item}
              nameSelect="opcionesReproceso"
              ValueSave={setOpcionesReproceso}
              varianteEstilo="standard"
            />
          </div>
          <OQCPuestoSeleccionLayout opcionPuesto={opcionesReproceso as number} />
        </>
      )}
    </ContainerForPages>
  );
};
