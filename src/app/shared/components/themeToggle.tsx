//import * as React from "react";
import { useDarkModeClass } from "app/shared/hooks/useDarkMode";
import { colorAppSlice } from "app/Middleware/reducers/ColorAppSlice";
import { useDispatch } from "react-redux";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import React from "react";

export const ThemeToggle = (): JSX.Element => {
  const [isDark, setIsDark] = useDarkModeClass();
  const dispatch = useDispatch();

  const handleChange = () => {
    setIsDark(!isDark);
    dispatch(colorAppSlice.actions.changeColor(!isDark));
  };

  return (
    <>
      <Switch
        checked={isDark}
        onChange={handleChange}
        name="derecha"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
      <IconButton size="small">
        {!isDark ? (
          <Brightness7Icon htmlColor="white"></Brightness7Icon>
        ) : (
          <Brightness4Icon htmlColor="white"></Brightness4Icon>
        )}
      </IconButton>
    </>
  );
};
