import { Check, Error, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Dictionary, unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

interface IDefaultValues {
  password: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const requirements = [
  {
    test: /(?=.*[A-Z])/,
    text: "Tiene que tener una mayúscula."
  },
  {
    test: /(?=.*[a-z])/,
    text: "Tiene que tener una minúscula."
  },
  {
    test: /(?=.*\d)/,
    text: "Tiene que tener un número."
  },
  {
    test: /(?=.*[@$!%*?&])/,
    text: "Tiene que tener un carácter especial."
  },
  {
    test: /^[A-Za-z\d@$!%*?&]{12,}$/,
    text: "Tiene que tener al menos 12 carácteres."
  }
];
const defaultValues = {
  password: "",
  newPassword: "",
  newPasswordRepeat: ""
};
export const ResetPasswordPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const history = useHistory();

  const [changePassword, setChangePassword] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<Dictionary<boolean>>({
    password: false,
    newPassword: false,
    newPasswordRepeat: false
  });

  const onShowPassword = (e, name: string) => {
    const state = showPassword[name];
    setShowPassword({ ...showPassword, [name]: !state });
  };
  const onMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { control, handleSubmit, watch, getValues } = useForm<IDefaultValues>({
    defaultValues
  });

  const onPasswordChange = (value: string): boolean | string => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(value)
      ? true
      : "La contraseña no es válida.";
  };

  const onSubmit = async (e: IDefaultValues) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(AppUserSliceRequests.LoginUser({ username: GetInfoUser().username, password: e.password }))
      );
      if (response?.token.length > 0) {
        const response = unwrapResult(await dispatch(AppUserSliceRequests.nuevaContrasenia(e.newPassword)));
        response && openNotificationUI("Se cambio la contraseña correctamente", "success");
        !response && openNotificationUI("Ocurrio un problema al actualizar la contraseña", "error");
        response && setChangePassword(true);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch ({
      response: {
        data: { message }
      }
    }) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(message, "error");
    }
  };
  const validateConfirmPassword = (value) => {
    return value === getValues("newPassword") || "Las contraseñas no coinciden";
  };
  const onChange = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    TitleChanger("");
  }, []);

  return changePassword ? (
    <div className="m-auto  max-w-fit h-screen flex justify-center items-center flex-col">
      <TitleUIComponent title="Se cambio la contraseña correctamente:)" />
      <Button color="success" onClick={() => history.push("/main")}>
        Ir al inicio
      </Button>
    </div>
  ) : (
    <div className="m-auto shadow-elevation-4 bg-secondaryNew max-w-fit items-center flex flex-col justify-center h-screen ">
      <TitleUIComponent title="Cambiar la contraseña" classNameTitle="text-base" />
      <form className="flex justify-center flex-col gap-5 p-10 w-full" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          rules={{ required: "El campo es obligatorio" }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel>Contraseña actual:</InputLabel>
              <Input
                id="outlined-adornment-password"
                type={showPassword["password"] ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => onShowPassword(e, "password")}
                      onMouseDown={onMouseDownPassword}
                      edge="end">
                      {showPassword["password"] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...field}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="newPassword"
          rules={{ required: "El campo es obligatorio", validate: onPasswordChange }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel>Contraseña nueva:</InputLabel>
              <Input
                id="outlined-adornment-password"
                type={showPassword["newPassword"] ? "text" : "password"}
                onCut={onChange}
                onCopy={onChange}
                onPaste={onChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => onShowPassword(e, "newPassword")}
                      onMouseDown={onMouseDownPassword}
                      edge="end">
                      {showPassword["newPassword"] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...field}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <List dense>
          {watch("newPassword") != undefined &&
            requirements.map((requirement, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {requirement.test.test(getValues("newPassword")) ? (
                    <Check color="success" />
                  ) : (
                    <Error color="error" />
                  )}
                </ListItemIcon>
                <ListItemText primary={requirement.text} />
              </ListItem>
            ))}
        </List>
        <Controller
          name="newPasswordRepeat"
          rules={{ required: "El campo es obligatorio", validate: validateConfirmPassword }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel>Repita la contraseña:</InputLabel>
              <Input
                id="outlined-adornment-password"
                type={showPassword["newPasswordRepeat"] ? "text" : "password"}
                onCut={onChange}
                onCopy={onChange}
                onPaste={onChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => onShowPassword(e, "newPasswordRepeat")}
                      onMouseDown={onMouseDownPassword}
                      edge="end">
                      {showPassword["newPasswordRepeat"] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...field}
              />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <FormButtons submitName="Cambiar" onCancel={() => history.push("/main")} />
      </form>
    </div>
  );
};
