/* eslint-disable unused-imports/no-unused-vars */
import React, { FC, useState } from "react";
import { MenuItem, Menu, ListItemButton, List, ListItemText } from "@mui/material";

interface Props {
  onOptionSelect?: (data: { value: string; selectMenu: string }) => void;
  posicionSeleccionada?: (newValue: string, index: number) => void;
  agenteSeleccionado?: (newValue: string, index: number) => void;
  options: string[];
  labelSelect: string;
  indexSelected: number;
}

export const Dropdowns: FC<Props> = ({
  onOptionSelect,
  options,
  labelSelect,
  indexSelected,
  posicionSeleccionada,
  agenteSeleccionado
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    onOptionSelect({ value: options[index], selectMenu: labelSelect });
    if (labelSelect.trim() === "Posicion:") {
      posicionSeleccionada(options[index], index);
    }
    if (labelSelect.trim() === "Agente:") {
      agenteSeleccionado(options[index], index);
    }
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{
          backgroundColor: "#D1D5DB",
          borderRadius: "3rem",
          "& .MuiList-padding": {
            padding: 0
          },
          "& .MuiListItemText-root": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          "& .MuiButtonBase-root": {
            width: "15rem",
            padding: "0 12px"
          }
        }}>
        <ListItemButton
          sx={{
            padding: 0,
            "& .MuiList-padding": {
              padding: 0
            },
            "& .MuiListItemText-root": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }
          }}
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}>
          {options && options.length > 0 && <ListItemText primary={labelSelect} secondary={options[indexSelected]} />}
        </ListItemButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox"
        }}>
        {options &&
          options.length > 0 &&
          options.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === indexSelected}
              onClick={(event) => handleMenuItemClick(event, index)}>
              {option}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
