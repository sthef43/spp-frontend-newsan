/* eslint-disable unused-imports/no-unused-vars */
import { ExpandMoreRounded } from "@mui/icons-material";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface Props<T> {
  listaObjetos: T[];
  setValueSelect: (value: string | number) => void;
  labelAndValueSelect: (item: T) => string | number;
  valueSelect: string | number;
  iconoMui?: React.ReactNode;
}

export const SelectModifyTrazaTicket = <T,>({
  listaObjetos,
  setValueSelect,
  valueSelect,
  labelAndValueSelect,
  iconoMui
}: Props<T>) => {
  const label = "Seleccione una opción";
  return (
    <main className="w-full">
      <FormControl fullWidth>
        <InputLabel id="select-modify-traza-label" sx={{ color: "gray" }}>
          {label}
        </InputLabel>
        <Select
          labelId="select-modify-traza-label"
          id="select-modify-traza"
          value={valueSelect ?? ""}
          label={label}
          onChange={(e) => setValueSelect(e.target.value)}
          sx={{
            "& .MuiSelect-select": { padding: "12px" },
            borderRadius: "2rem",
            backgroundColor: "rgb(209 213 219 / 0.5)"
          }}
          startAdornment={iconoMui ? <InputAdornment position="start">{iconoMui}</InputAdornment> : null}
          IconComponent={ExpandMoreRounded}>
          {listaObjetos?.length > 0 ? (
            listaObjetos.map((item, index) => (
              <MenuItem key={index} value={labelAndValueSelect(item)}>
                {labelAndValueSelect(item)}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value={valueSelect}>
              No hay datos
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </main>
  );
};
