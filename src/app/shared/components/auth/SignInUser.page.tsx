import React, { useEffect, useState } from "react";
import { Button, createTheme, Theme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { IAuthResponse, IPlant, ITurno } from "app/models";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { PlantSliceRequests } from "app/Middleware/reducers/PlantSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useHistory } from "react-router-dom";
import { MaterialButtons } from "../material-ui/MaterialButtons";
const theme = createTheme({
  palette: {
    mode: "dark"
  }
});
const emailIsUnique = async (email: number) => {
  const { State: Plantas } = useFetchApi<IPlant[]>(OperatorSliceRequests.getAllRequest);
  await wait(1000);
  return email !== 39391421;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const schema = yup
  .object()
  .shape({
    username: yup.string().min(4).max(32).required("El nombre debe contener minimo caracteres."),
    email: yup.string().email().required(),

    password: yup
      .string()
      .required("Ingrese una contraseña valida")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Debe contener 8 caracteres, una minuscula, una mayuscula y un numero"
      ),
    // .test("exist", "este dni existe", (value) => {
    //   return emailIsUnique(value);
    // }),
    operator: yup.object().shape({
      dni: yup.number().required().positive().integer(),
      name: yup.string().min(1).required(),
      plantaId: yup.number().min(1).required().default(4),
      surname: yup.string().min(1).required(),
      turnoId: yup.number().min(1).required().positive().integer(),
      position: yup.string().min(1).required()
    }),
    permisosId: yup.number().default(1)
  })
  .required();
const defaultState = {
  username: "",
  email: "",
  password: "",
  operator: {
    dni: 1,
    name: "",
    plantaId: 4,
    surname: "",
    turnoId: 1,
    position: ""
  },
  permisosId: 1,
  validado: false //Cada vez que se crea un user, entra como no validado.
};
const defaultAppUser = {
  username: "",
  email: "",
  password: "",
  permisosId: 1
};
const defaultOperator = {
  operator: {
    dni: 1,
    name: "",
    plantaId: 4,
    surname: "",
    turnoId: 1,
    position: ""
  }
};
const defaultLabels = {
  username: "Nombre de usuario",
  email: "Email",
  operator: {
    name: "Nombre",
    plantaId: "Planta",
    surname: "Apellido",
    turnoId: "Turno",
    position: "Posicion"
  },
  permisosId: "hidden"
};
const defaultLabelsAppUser = {
  username: "Nombre de usuario",
  email: "Email",

  password: "Contraseña",
  permisosId: "hidden"
};
const defaultLabelsOperator = {
  operator: {
    dni: "DNI",
    name: "Nombre",
    plantaId: "Planta",
    surname: "Apellido",
    turnoId: "Turno",
    position: "Posicion"
  }
};
export const SignInUser = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 2;
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const history = useHistory();
  const handleGuardar = async () => {
    let informacionUsuario: IAuthResponse;
    const appUser = { ...info, validado: false };
    try {
      informacionUsuario = unwrapResult(await dispatch(AppUserSliceRequests.registerRequest(_.cloneDeep(appUser))));
    } catch (e) {
      informacionUsuario = null;
    }
    if (informacionUsuario?.id) {
      //cOMENTO ESTO PARA QUE NO S ELOGUEE UNA VEZ QUE SE CREO EL USER.
      /*  const information: any = jwt_decode(informacionUsuario.token);
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
      */
      openNotificationUI("Usuario creado con exito", "success");
      history.push("/auth/login");
      /*
      setTimeout(() => {
        history.go(0);
      }, 4000); */
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const { State: Plantas } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);

  const { State: Turnos } = useFetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest);
  const dispatch = useAppDispatch();
  const [state, setstate] = useState({});
  const { control, setValue, register, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultState,
    mode: "onChange"
  });

  const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  useEffect(() => {
    console.log("esta sucio " + formState.isDirty);
    if (
      getValues("username").length >= 4 &&
      emailRegex.test(getValues("email")) &&
      passwordRegex.test(getValues("password"))
    ) {
      setCompletoDatos(true);
    } else {
      setCompletoDatos(false);
    }
  }, [formState]);

  const [completoDatos, setCompletoDatos] = useState(false);

  const info = watch();
  /*   useEffect(() => {
    console.log(info);
  }, [info]); */
  useEffect(() => {
    setstate({
      Turno: { array: Turnos, id: "id", column: "nombre" },
      Planta: { array: Plantas, id: "id", column: "name" }
    });
  }, [Turnos, Plantas]);
  return (
    <div>
      <div className=" login-container z-10 fixed">
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <div className="container">
              <div className="login-form-1 glassmorphism lg:m-80 md:m-40 sm:m-20 z-40">
                <div className="text-center  text-white text-4xl font-medium mb-9"> NEWSAN SPP </div>
                <div className="text-center text-white text-4xl font-medium mb-9"> Registro de usuario </div>
                {/* <TitleUIComponent title="Registro" /> */}
                <div className="text-center text-white text-4xl font-medium">
                  {activeStep === 0 && (
                    <>
                      <GenericFieldsGenerator
                        values={defaultAppUser}
                        control={control}
                        styleDiv={"text-center mb-5"}
                        styleFieldSX={{}}
                        labels={defaultLabelsAppUser}
                        variant="filled"
                      />
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <GenericFieldsGenerator
                        values={defaultOperator}
                        control={control}
                        styleDiv={"text-center mb-5"}
                        styleFieldSX={{}}
                        labels={defaultLabelsOperator}
                        selectFields={state}
                        variant="filled"
                      />
                    </>
                  )}
                </div>
                <div className="flex gap-4 justify-around">
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="contained"
                    className={classes.greenButton}
                    color="success">
                    Atras
                  </Button>
                  <Button
                    size="small"
                    onClick={activeStep < 1 ? handleNext : handleGuardar}
                    variant="contained"
                    className={classes.greenButton}
                    /* disabled={activeStep == 1 && !formState.isValid} */
                    disabled={!completoDatos}
                    color="success">
                    {activeStep < 1 ? "Siguiente" : "Guardar"}
                  </Button>
                </div>
                <div className=" text-white text-center mt-4">
                  <button
                    onClick={() => {
                      history.push("/auth/login");
                    }}>
                    ya tengo un usuario
                  </button>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
    </div>
  );
};
