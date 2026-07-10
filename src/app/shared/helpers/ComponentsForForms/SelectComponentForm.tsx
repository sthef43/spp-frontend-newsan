import React, { useMemo } from "react";
import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";

interface Props<T extends FieldValues, TItem> extends UseControllerProps<T> {
  listItems: TItem[];
  valueLabel: (item: TItem) => string;
  valueSelect: (item: TItem) => string | number;
  setMultiplesValues?: (item: Array<string | number>) => void;
  activeMultiple?: boolean;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  disabled?: boolean;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const SelectComponentForm = <T extends FieldValues, TItem>({
  listItems = [],
  valueLabel,
  valueSelect,
  setMultiplesValues,
  activeMultiple = false,
  label,
  name,
  control,
  disabled,
  rules,
  variant = "outlined"
}: Props<T, TItem>) => {
  const {
    field: { value, onChange, ...restField },
    fieldState: { invalid },
    formState: { errors }
  } = useController({ name, control, rules });

  const itemMap = useMemo(() => {
    const map = new Map<string | number, string>();
    listItems.forEach((item) => {
      map.set(valueSelect(item), valueLabel(item));
    });
    return map;
  }, [listItems, valueSelect, valueLabel]);

  const selectValue = useMemo(() => {
    if (activeMultiple) {
      return Array.isArray(value) ? value : [];
    }
    return value !== undefined && value !== null ? value : "";
  }, [value, activeMultiple]);

  const handleChange = (event: SelectChangeEvent<typeof selectValue>) => {
    const newValue = event.target.value;
    const resolvedValue = typeof newValue === "string" ? newValue.split(",") : newValue;
    onChange(resolvedValue);
    if (setMultiplesValues) {
      setMultiplesValues(resolvedValue as Array<string | number>);
    }
  };

  const handleChangeUnique = (event: SelectChangeEvent<typeof selectValue>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  //"Console para poder debugear los select, valul y items"
  // console.log("🔍 Diagnóstico del Select:", {
  //   valorGuardado: value,
  //   tipoDeValorGuardado: typeof value, // Veremos si es 'string' o 'number'
  //   primerItemDeLaLista: listItems?.[0], // Veremos qué estructura tiene el objeto realmente
  //   pruebaDeLabel: listItems?.length ? valueLabel(listItems[0]) : "Lista vacía", // Veremos si da undefined
  //   pruebaDeValue: listItems?.length ? valueSelect(listItems[0]) : "Lista vacía",
  //   tipoDeValueEnLista: listItems?.length ? typeof valueSelect(listItems[0]) : "Lista vacía"
  // });

  return (
    <FormControl fullWidth variant={variant} error={invalid}>
      <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
      <Select
        {...restField}
        multiple={activeMultiple}
        labelId={`select-label-${name}`}
        label={label}
        value={selectValue}
        onChange={activeMultiple ? handleChange : handleChangeUnique}
        disabled={disabled}
        MenuProps={
          activeMultiple
            ? {
                disablePortal: true,
                PaperProps: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: "auto",
                    minWidth: 250
                  }
                }
              }
            : undefined
        }
        renderValue={
          activeMultiple
            ? (selected) => {
                const selectedArray = selected as Array<string | number>;
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedArray.map((val, index) => (
                      <Chip key={index} label={itemMap.get(val) || val} size="small" />
                    ))}
                  </Box>
                );
              }
            : undefined
        }>
        {listItems.map((elements, index) => {
          const itemVal = valueSelect(elements);
          const itemText = valueLabel(elements);
          return (
            <MenuItem key={index} value={itemVal}>
              {itemText}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText error={invalid}>{(errors[name]?.message as string) || " "}</FormHelperText>
    </FormControl>
  );
};
