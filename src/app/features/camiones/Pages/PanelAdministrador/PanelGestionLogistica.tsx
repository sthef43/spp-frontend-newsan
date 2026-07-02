/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { Divider } from "@mui/material";
import { EnterpriseIconEdited, ShippingIconEdited } from "app/shared/helpers/ComponentsMUIModify/IconsModified";
import { FormGestionEmpresas } from "../../components/panelAdministrador/FormGestionEmpresas";
import { FormGestionFlota } from "../../components/panelAdministrador/FormGestionFlota";

export const PanelGestionLogistica = () => {
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("Panel de Administrador");
  }, []);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <h2 className="text-2xl font-bold mb-3">Panel de Gestion Logistica</h2>
      <Divider />
      <section className="flex flex-col w-full mt-6 px-2">
        <div className="flex flex-row w-full gap-x-2">
          <EnterpriseIconEdited size="2.5rem" />
          <div>
            <h3 className="text-xl font-bold">Gestion de Empresas</h3>
            <p className="text-sm text-gray-500">Registre y admninistre las compañias transportistas</p>
          </div>
        </div>
        <div className="mt-4">
          <ContainerForPages
            optionsLayout="personalized"
            classNamePersonalized="flex flex-col text-center w-full gap-x-4 justify-between items-end bg-secondaryNew p-4 rounded-md shadow-md">
            <FormGestionEmpresas />
          </ContainerForPages>
        </div>
      </section>
      <section className="flex flex-col w-full mt-6 px-2">
        <div className="flex flex-row w-full gap-x-2">
          <ShippingIconEdited size="2.5rem" />
          <div>
            <h3 className="text-xl font-bold">Gestion de Flota</h3>
            <p className="text-sm text-gray-500">Registre y administre los vehiculos</p>
          </div>
        </div>
        <div className="mt-4">
          <ContainerForPages
            optionsLayout="personalized"
            classNamePersonalized="flex flex-col w-full gap-x-4 justify-between items-end bg-secondaryNew p-4 rounded-md shadow-md">
            <FormGestionFlota />
          </ContainerForPages>
        </div>
      </section>
    </ContainerForPages>
  );
};
