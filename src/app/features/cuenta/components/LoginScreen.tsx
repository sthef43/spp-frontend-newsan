/* eslint-disable unused-imports/no-unused-vars */
import { useAppDispatch } from "app/core/store/store";
import { IAuthRequest } from "app/models/IAuthRequest";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "./login.css";
import { useHistory } from "react-router-dom";
import { TextField, StyledEngineProvider, IconButton, InputAdornment, createTheme, ThemeProvider } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import jwt_decode from "jwt-decode";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { IAuthResponse } from "app/models";
import { SetInfoUser, SetTokenUserInformation } from "app/shared/helpers/userConfig";
import { FirstLoginSlice } from "app/features/cuenta/slices/FirstLoginSlice";
import { authenticationSlice } from "app/features/cuenta/slices/AuthenticationSlice";
import papaNoelGif from "../../../../assets/animated/papa_noel.json";
import { FestividadesComponent } from "app/shared/components/ui/FestividadesComponent";

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

export const LoginScreen = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [showPassword, setshowPassword] = useState(false);
  const history = useHistory();
  const stringImagen = "LOGO-NUEVO-SPP.png";

  const {
    control,
    register: loginFormValues,
    setValue: setValueLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErros }
  } = useForm<IAuthRequest>({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const verificarInputs = async (e) => {
    if (e.username == "" && e.password == "") {
      openNotificationUI("El usuario y password son obligatorios", "warning");
      return false;
    }
    return true;
  };

  const loginSubmit = async (e: IAuthRequest) => {
    const puedeLogear = verificarInputs(e);
    if (!puedeLogear) return false;
    //Si el usuario existe y esta validado, hago login, caso contrario, no logea.
    let informacionUsuario: IAuthResponse;
    try {
      informacionUsuario = unwrapResult(await dispatch(AppUserSliceRequests.LoginUser(e)));
    } catch (e) {
      informacionUsuario = null;
    }
    if (!informacionUsuario) openNotificationUI("Usuario o contraseña incorrectos", "error");
    if (informacionUsuario?.id) {
      const information: any = jwt_decode(informacionUsuario.token);
      SetTokenUserInformation(informacionUsuario.token);
      SetInfoUser(informacionUsuario);
      dispatch(FirstLoginSlice.actions.FirstLogin());
      dispatch(
        authenticationSlice.actions.SetInfoUser({
          AUTH_TOKEN: informacionUsuario.token,
          dni: informacionUsuario.dni,
          username: informacionUsuario.username,
          id: informacionUsuario.id,
          permisos: JSON.parse(information.permisos)
        })
      );
      history.go(0);
    }
  };

  return (
    <div className=" login-container z-10 fixed">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* <div className="login-form-1 glassmorphism lg:m-80 md:m-20 sm:m-10 z-20"> */}
          <div className="login-form-1 w-full max-w-xl mx-auto p-8">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10%" }}>
              <img
                style={{ width: "40%", height: "auto" }}
                src={`${import.meta.env.BASE_URL}${stringImagen}`}
                alt="Imagen descriptiva"
              />
            </div>
            <div className="login-form-1 glassmorphism w-full max-w-lg mx-auto">
              <div className="flex flex-row items-center w-full justify-center gap-x-10">
                <FestividadesComponent gifOrImage={papaNoelGif} active={false} width={90} height={80} />
                <div className="text-center text-white text-4xl mb-5" style={{ fontSize: "20px" }}>
                  SISTEMA DE PISO PLANTA
                </div>
                <FestividadesComponent gifOrImage={papaNoelGif} active={false} width={90} height={80} />
              </div>
              <form onSubmit={handleSubmitLogin(loginSubmit)} className="py-0">
                <div className="text-center mb-5">
                  <div className="text-center text-white text-4xl" style={{ fontSize: "20px" }}>
                    Usuario
                  </div>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: true, minLength: 2 }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        className="w-2/3"
                        id="outlined-basic"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "30px",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            color: "white"
                          }
                        }}
                        style={formState.errors && { borderColor: "red" }}
                      />
                    )}
                  />
                </div>
                <div className="text-center mb-5">
                  <div className="text-center text-white text-4xl" style={{ fontSize: "20px" }}>
                    Contraseña
                  </div>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true, minLength: 2 }}
                    render={({ field, formState }) => (
                      <TextField
                        id="password"
                        {...field}
                        variant="outlined"
                        className="w-2/3"
                        error={!!formState.errors}
                        type={showPassword ? "text" : "password"}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "30px",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            color: "white"
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setshowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </div>
                <div className="form-group text-center" style={{ marginTop: "10%", fontSize: "20px" }}>
                  <button type="submit" className="btnSubmit bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
                    INGRESAR
                  </button>
                </div>
              </form>
              {/* <div className=" text-white text-center"></div> */}
              <div className="text-center text-white text-4xl mb-9" style={{ fontSize: "18px", marginTop: "3%" }}>
                v.1.5.2
              </div>
            </div>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
};
