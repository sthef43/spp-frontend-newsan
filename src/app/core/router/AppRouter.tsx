import React from "react";
import { useAppSelector } from "app/core/store/store";
import { NotificationComponent } from "app/shared/components/helpComponents/NotificationComponent";
import { StyledEngineProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { DialogAlertComponent } from "app/shared/components/helpComponents/DialogAlertComponent";
import { LoaderComponent } from "app/shared/components/helpComponents/LoaderComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DashboardScreen } from "app/shared/components/dashboard/DashboardScreen";
import { esES } from "@mui/x-date-pickers/locales";
import AuthRouter from "./AuthRouter";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.locale("es");
export const AppRouter = (): JSX.Element => {
  const { data } = useAppSelector((state) => state.authentification);
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const darkTheme = createTheme(
    {
      palette: {
        mode: "dark",
        background: {
          default: "#001134",
          paper: "#001134"
        },
        text: {
          primary: "rgba(250, 250, 250,0.90)",
          secondary: "rgba(250, 250, 250,0.60)"
        },
        primary: {
          main: "#2495c8"
        },
        success: {
          main: "#29c824"
        }
      }
    },
    esES
  );

  const lightTheme = createTheme(
    {
      palette: {
        mode: "light",
        background: {
          default: "rgb(240, 241, 242)",
          paper: "rgb(248, 249, 250)"
        },
        text: {
          primary: "#181818",
          secondary: "#181818e0"
        }
      }
    },
    esES
  );

  return (
    <StyledEngineProvider injectFirst>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {data && (
            <Router>
              <Switch>
                <Route path="/auth">
                  <AuthRouter authenficate={data.AUTH_TOKEN.length > 0} />
                </Route>
                <PrivateRoute path="/main" isAuthenficated={data.AUTH_TOKEN.length > 0} Children={DashboardScreen} />
                <Redirect to="/main" />
              </Switch>
            </Router>
          )}
          <NotificationComponent />
          <DialogAlertComponent />
          <LoaderComponent />
        </ThemeProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  );
};
