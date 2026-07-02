import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import { Drawer } from "../ui/Drawer";
import { ThemeToggle } from "../themeToggle";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { authenticationSlice } from "app/Middleware/reducers/AuthenticationSlice";
import { LogOutUser } from "app/shared/helpers/userConfig";
import { useHistory } from "react-router-dom";
import papaNoelGif from "../../../../assets/animated/papa_noel.json";
import { FestividadesComponent } from "./FestividadesComponent";

//-------------------------------------------INICIO DE CLASE ---------------------------------
export const NavBar = (): JSX.Element => {
  const [auth] = React.useState(true);
  const ocultar = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const { Title } = useAppSelector((state) => state.titleOfApp);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    dispatch(authenticationSlice.actions.deleteInfoUser());
    LogOutUser();
    history.push("/auth/login");
  };

  return (
    <Box
      className={ocultar ? "hidden" : ""}
      sx={{
        marginBottom: "0",
        height: Title == "Inicio" ? "3rem" : "100%",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 999,
        "@media (min-width: 960px)": {
          position: "static"
        }
      }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(270deg, #001134 0%, #2B46AE 98.36%)"
        }}>
        <Toolbar sx={{ minHeight: "0px" }} className="shadow-elevation-4 p-0 md:px-4 min-h-0">
          {/* MENU DESPLEGABLE ACA */}
          <Drawer />

          <div className="flex items-center w-full justify-center">
            <div className="w-[5.5rem] md:w-36">
              <Typography variant="h6" className="text-xs md:text-base md:col-span-1" sx={{ flexGrow: 1 }}>
                SPP v.1.5.2
              </Typography>
            </div>

            <div className="flex w-full text-md items-center uppercase text-center justify-center md:text-xl font-medium">
              {/* EN CASO DE QUERER ELIMINAR EL GIF, PONER EL ACTIVE EN FALSE ASI SE DESACTIVA */}
              {Title && <FestividadesComponent gifOrImage={papaNoelGif} active={false} width={60} height={50} />}
              {Title}
              {Title && <FestividadesComponent gifOrImage={papaNoelGif} active={false} width={60} height={50} />}
            </div>

            {auth && (
              <div className="flex items-center justify-end">
                <img
                  src={`${import.meta.env.BASE_URL}LOGO-NUEVO-SPP.png`}
                  className="cursor-pointer max-w-12 md:max-w-16"
                  onClick={() => {
                    history.push(`/main`);
                  }}
                  alt="Workspace"
                />
                <ThemeToggle />
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                        background: "linear-gradient(270deg, #001134 0%, #2B46AE 98.36%)"
                      }
                    }
                  }}>
                  <MenuItem onClick={handleClose}>
                    <div className="text-gray-200">Profile</div>
                  </MenuItem>
                  <MenuItem className="text-gray-200" onClick={handleClose}>
                    <div className="text-gray-200">My account</div>
                  </MenuItem>
                  <MenuItem className="text-gray-200" onClick={handleLogOut}>
                    <div className="text-gray-200">Salir</div>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
