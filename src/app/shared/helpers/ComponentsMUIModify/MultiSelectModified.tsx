/* eslint-disable unused-imports/no-unused-vars */
import { Box, Chip, FormControl, MenuItem, Select, SelectChangeEvent, InputLabel } from "@mui/material";
import React from "react";

interface Props<T> {
  labelSelect: string;
  listValuesSelected: string[];
  varianteEstilo?: "standard" | "outlined" | "filled";
  options: T[];
  setValues: (newValue: string[]) => void;
  valueSelect: (value: T) => string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export const MultiSelectModified = <T,>({
  labelSelect,
  listValuesSelected,
  varianteEstilo = "outlined",
  options,
  setValues,
  valueSelect
}: Props<T>) => {
  const handleChangeValues = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;
    setValues(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <main className="w-full">
      <FormControl fullWidth variant={varianteEstilo}>
        <InputLabel id="select-multiple-chip-label">{labelSelect}</InputLabel>
        <Select
          labelId="select-multiple-chip-label"
          id="multiple-select"
          multiple
          label={labelSelect}
          value={listValuesSelected}
          onChange={handleChangeValues}
          renderValue={(seleccionados) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {seleccionados.map((value, index) => (
                <Chip key={index} label={value} sx={{ fontSize: "16px" }} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}>
          {options.map((option) => {
            const val = valueSelect(option);
            return (
              <MenuItem key={val} value={val} sx={{ fontWeight: listValuesSelected.includes(val) ? "bold" : "normal" }}>
                {val}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </main>
  );
};
