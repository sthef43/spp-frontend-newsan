/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { NuevosValores } from "../../components/creacionAuditorias/NuevosValores";
import { ValoresExistentes } from "../../components/creacionAuditorias/ValoresExistentes";
import { AddCircleRounded, PlaylistAddCheckOutlined } from "@mui/icons-material";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AgregarAsignarValores: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const [tabSeleccionada, setTabSeleccionada] = useState(1);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabSeleccionada(newValue);
  };

  const renderLabelIcon = (label: string) => {
    return (
      <div className="flex flex-row items-center gap-x-2">
        {label === "Item existente" ? <PlaylistAddCheckOutlined /> : <AddCircleRounded />}
        <p>{label}</p>
      </div>
    );
  };

  return (
    <main className="w-[65vw]">
      <Tabs
        sx={{
          "& .MuiTabs-flexContainer": { justifyContent: "space-evenly" },
          backgroundColor: "var(--background-color)",
          borderRadius: "16px"
        }}
        value={tabSeleccionada}
        onChange={handleChangeTab}>
        <Tab sx={{ width: "100%" }} label={renderLabelIcon("Item existente")} />
        <Tab sx={{ width: "100%" }} label={renderLabelIcon("Nuevo item")} />
      </Tabs>
      {tabSeleccionada === 1 && <NuevosValores setOpenModal={setOpenModal} />}
      {tabSeleccionada === 0 && <ValoresExistentes setOpenModal={setOpenModal} />}
    </main>
  );
};
