import { TextField } from "@mui/material";
import { IXXE_WIP_CONTROL_SERIALES } from "app/models/IXXE_WIP_CONTROL_SERIALES";
import React from "react";

interface props {
  serie: IXXE_WIP_CONTROL_SERIALES;
}

export const NumeroSerie = ({ serie }: props): JSX.Element => {
  return (
    <div className="m-1 sm:m-10 h-full animated animate__fadeIn">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
          <TextField
            id="standard-full-width"
            style={{ margin: 8 }}
            margin="normal"
            label="Serie desde"
            value={serie?.desde}
            InputLabelProps={{
              shrink: true
            }}
            disabled
            variant="standard"
          />
          <TextField
            id="standard-full-width"
            style={{ margin: 8 }}
            margin="normal"
            label="Serie hasta"
            value={serie?.hasta}
            InputLabelProps={{
              shrink: true
            }}
            disabled
            variant="standard"
          />
          <TextField
            id="standard-full-width"
            style={{ margin: 8 }}
            margin="normal"
            label="Modelo"
            value={serie?.item}
            InputLabelProps={{
              shrink: true
            }}
            disabled
            variant="standard"
          />
          <TextField
            id="standard-full-width"
            style={{ margin: 8 }}
            margin="normal"
            label="Cantidad"
            value={(parseInt(serie?.hasta) - parseInt(serie?.desde) + 1).toString()}
            InputLabelProps={{
              shrink: true
            }}
            disabled
            variant="standard"
          />
        </div>
      </div>
    </div>
  );
};
