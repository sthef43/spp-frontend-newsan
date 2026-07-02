/* eslint-disable unused-imports/no-unused-vars */
import { Edit } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import React from "react";

interface Props {
  setOpenModalPlaca: (newValue: boolean) => void;
  openModalPlaca: boolean;
}

export const BloquearPorPlaca: React.FC<Props> = ({ setOpenModalPlaca, openModalPlaca }) => {
  return (
    <main className="w-[35vw]">
      <div className="w-full">
        <div className="w-full mt-6 pl-12">
          <p className="text-lg text-gray-400">Escanear código de placa</p>
          <TextField fullWidth id="outlined-basic" variant="outlined" />
        </div>
      </div>
      <p className="ml-12 mt-4 text-lg text-gray-400">Detalles Del Bloque</p>
      <div className="flex items-center w-full mt-2">
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
              setOpenModalPlaca(false);
            }}>
            Guardar
          </Button>
        </div>
      </div>
    </main>
  );
};
