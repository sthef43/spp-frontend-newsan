import React, { useMemo } from "react";
import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

// Eliminamos la dependencia de react-hook-form y UseControllerProps
interface Props<TItem> {
  listItems: TItem[];
  valueLabel: (item: TItem) => string;
  valueSelect: (item: TItem) => string | number;
  value: string | number | Array<string | number>;
  onChange: (newValue: string | number | Array<string | number>) => void;
  activeMultiple?: boolean;
  label: string;
  variant?: "standard" | "outlined" | "filled";
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  MenuProps?: Partial<import("@mui/material").SelectProps["MenuProps"]>;
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
  helperText = " ",
  MenuProps: externalMenuProps
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

  const defaultMenuProps = useMemo(() => {
    const baseProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: "auto",
          minWidth: 250
        }
      }
    };
    if (activeMultiple) {
      return { ...baseProps, disablePortal: true };
    }
    return baseProps;
  }, [activeMultiple]);

  const mergedMenuProps = useMemo(() => {
    const base = { ...defaultMenuProps, ...externalMenuProps };
    if (externalMenuProps?.PaperProps) {
      base.PaperProps = {
        ...defaultMenuProps.PaperProps,
        style: {
          ...defaultMenuProps.PaperProps.style,
          ...externalMenuProps.PaperProps.style
        }
      };
    }
    return base;
  }, [defaultMenuProps, externalMenuProps]);

  const handleChange = (event: SelectChangeEvent<typeof selectValue>) => {
    const newValue = event.target.value;
    onChange(newValue);
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
        MenuProps={mergedMenuProps}
        renderValue={
          activeMultiple
            ? (selected) => {
              const selectedArray = selected as Array<string | number>;
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedArray.map((val) => (
                    <Chip key={val} label={itemMap.get(val) || val} size="small" />
                  ))}
                </Box>
              );
            }
            : undefined
        }>
        {listItems.map((elements) => {
          const itemVal = valueSelect(elements);
          const itemText = valueLabel(elements);
          return (
            <MenuItem key={itemVal} value={itemVal}>
              {itemText}
            </MenuItem>
          );
        })}
      </Select>
      {error && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
