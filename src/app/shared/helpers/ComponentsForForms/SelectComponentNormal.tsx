import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useMemo } from "react";

// Eliminamos la dependencia de react-hook-form y UseControllerProps
interface Props<TItem> {
  listItems: TItem[];
  valueLabel: (item: TItem) => string;
  valueSelect: (item: TItem) => string | number;
  value: string | number | Array<string | number>;
  onChange: (newValue: string | number | Array<string | number> | TItem) => void;
  activeMultiple?: boolean;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const SelectComponentNormal = <TItem,>({
  listItems = [],
  valueLabel,
  valueSelect,
  value,
  onChange,
  activeMultiple = false,
  label,
  variant = "outlined",
  disabled = false,
  error = false,
  helperText = " "
}: Props<TItem>) => {
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
    const resolvedValue = typeof newValue === "string" && activeMultiple ? newValue.split(",") : newValue;
    onChange(resolvedValue);
  };

  return (
    <FormControl fullWidth variant={variant} error={error}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        multiple={activeMultiple}
        labelId={`select-label-${label}`}
        label={label}
        value={selectValue}
        onChange={handleChange}
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
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};
