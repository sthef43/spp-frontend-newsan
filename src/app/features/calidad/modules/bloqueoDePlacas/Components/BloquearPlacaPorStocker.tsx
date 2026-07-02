/* eslint-disable unused-imports/no-unused-vars */
import { Edit } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import React from "react";

interface Props {
  setOpenModalStocker: (newValue: boolean) => void;
  openModalStocker: boolean;
}

export const BlqouearPlacaPorStocker: React.FC<Props> = ({ setOpenModalStocker, openModalStocker }) => {
  return (
    <main className="w-[35vw]">
      <div className="w-full">
        <div className="w-full mt-6 pl-12">
          <p className="text-lg text-gray-400">Escanear código de Stocker</p>
          <TextField fullWidth id="outlined-basic" variant="outlined" />
          <p className="text-sm mt-1">Codigos de las placas que le pertenecen al stocker</p>
        </div>
      </div>
      <p className="text-lg text-gray-400 mt-4 ml-12">Detalles del Bloqueo</p>
      <div className="flex items-center w-full">
        <IconButton size="small" style={{ position: "relative" }}>
          <Edit color="inherit" />
        </IconButton>
        <div className="flex w-full ml-4 items-center">
          <TextField sx={{ width: "80%" }} multiline rows={3} />
          <Button
            sx={{ marginLeft: "3rem" }}
            variant="contained"
            color="success"
            onClick={() => {
              setOpenModalStocker(false);
            }}>
            Guardar
          </Button>
        </div>
      </div>
    </main>
  );
};
