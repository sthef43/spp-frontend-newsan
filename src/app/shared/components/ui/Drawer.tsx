/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Accordion, AccordionDetails, AccordionSummary, Icon, ListItemIcon } from "@mui/material";
// import Images from "../../../../assets/images/fondo.jpg";
import { useHistory } from "react-router-dom";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { authenticationSlice } from "app/Middleware/reducers/AuthenticationSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOperator, IPermisos } from "app/models";

import { IPermisosRoutes } from "app/models/IPermisosRoutes";
import { PermisosRoutesSliceRequests } from "app/features/manejoSistema/slices/PermisosRoutesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import Paper from "@mui/material/Paper";
const SwipeableDrawer2 = SwipeableDrawer;

const ItemOfAcordion = ({ route, hitoryPush }: any) => {
  return (
    <div className="flex items-center hover:bg-[#a8cce880]">
      {/* <ChevronRightIcon className="text-gray-50" /> */}
      <ListItem
        button
        onClick={() => {
          hitoryPush(`/main/${route.ruta}`);
        }}>
        <ListItemText primary={route.nombre} className="text-gray-50" />
      </ListItem>
    </div>
  );
};
const AcordionRoutes = ({ routes, hitoryPush, routeName, icon }: any) => {
  return (
    <>
      {routes?.some((x) => x.route.padre == routeName) && (
        <Accordion
          component={Paper}
          sx={{
            padding: 0,
            boxShadow: "none",
            background: "transparent",
            border: 0,
            "&.Mui-expanded": {
              margin: 0,
              minHeight: "24px"
            },
            "&:before": {
              display: "none"
            }
          }}>
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon className="text-gray-50" />}
            // expandIcon={<ExpandMoreIcon className="text-gray-50" />}
            className="hover:bg-[#a8cce880]"
            sx={{
              padding: 0,
              minHeight: "auto",
              flexDirection: "row-reverse",
              "& .MuiAccordionSummary-content": {
                margin: 0
              },
              "& .MuiAccordionSummary-expandIcon": {
                color: "white"
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0
              },
              "& .MuiListItem-root:hover": {
                backgroundColor: "transparent"
              }
            }}
            // expandIcon={<ExpandMoreIcon className="text-gray-50" />}
          >
            <ListItem button>
              <ListItemIcon>
                <Icon className="text-gray-50 text-center" style={{ fontSize: "1.75rem" }}>
                  <img className="h-full" src={`${import.meta.env.BASE_URL}icons/logos_spp_nuevos/${icon}`} />
                </Icon>
              </ListItemIcon>
              <ListItemText className="text-gray-50" primary={routeName} />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: "0 0 0 24px",
              minHeight: "auto",
              flexDirection: "column",
              "& .MuiAccordionSummary-content": {
                margin: 1
              }
            }}>
            {routes &&
              routes.map(
                (x: IPermisosRoutes, index) =>
                  x.route.padre == routeName && (
                    <React.Fragment key={index}>
                      <ItemOfAcordion route={x.route} hitoryPush={hitoryPush} />
                    </React.Fragment>
                  )
              )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Drawer = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [InfoUsuario, setInfoUsuario] = useState<IOperator>();
  const permisos: IPermisos = useAppSelector((state) => state.authentification.data.permisos as any);
  const [permisosRutas, setpermisosRutas] = React.useState<IPermisosRoutes[]>([]);
  const history = useHistory();
  const [acordionRoutes] = useState<Array<{ routeName: string; icon: string }>>([
    {
      routeName: "Programación Industrial",
      icon: "PROGRAMACION_INDUSTRIAL_1.svg"
    },
    {
      routeName: "Admin",
      icon: "ADMIN.svg"
    },
    {
      routeName: "Auditorías",
      icon: "AUDITORIAS.svg"
    },
    {
      routeName: "Auditorías-V2",
      icon: "AUDITORIAS.svg"
    },
    {
      routeName: "Producción",
      icon: "PRODUCCION_1.svg"
    },
    {
      routeName: "Gerencia",
      icon: "GERENTE.svg"
    },
    {
      routeName: "Informes",
      icon: "INFORMES.svg"
    },
    {
      routeName: "EBS",
      icon: "EBS.svg"
    },
    {
      routeName: "Calidad",
      icon: "CALIDAD.svg"
    },
    {
      routeName: "Cuenta",
      icon: "CUENTA.svg"
    },
    {
      routeName: "Baterías",
      icon: "BATERIA.svg"
    },
    {
      routeName: "Supermercado",
      icon: "SUPERMERCADO_1.svg"
    },
    {
      routeName: "Trazabilidad",
      icon: "Trazabilidad.svg"
    },
    {
      routeName: "Seguridad e higiene",
      icon: "SEGURIDAD_E_HIGIENE_1.svg"
    },
    {
      routeName: "SGI",
      icon: "SGI_1.svg"
    },
    {
      routeName: "Ingenieria",
      icon: "Ingenieria.svg"
    },
    {
      routeName: "Etiquetas",
      icon: "Etiqueta.svg"
    },
    {
      routeName: "Dobladora",
      icon: "DOBLADORA.svg"
    },
    {
      routeName: "Contenedor",
      icon: "contenedores.svg"
    },
    {
      routeName: "Manejo sistema",
      icon: "MANEJO_DE_SISTEMA.svg"
    },
    {
      routeName: "OQC",
      icon: "OQC_1.svg"
    },
    {
      routeName: "OQC Celulares",
      icon: "OQC_1.svg"
    },
    {
      routeName: "Tickets",
      icon: "Ticket.svg"
    },
    {
      routeName: "Otras funciones",
      icon: "OTRAS_FUNCIONES_1.svg"
    },
    {
      routeName: "Tableros",
      icon: "TABLERO_1.svg"
    },
    {
      routeName: "Soldadura",
      icon: "SOLDADURA_1.svg"
    },
    {
      routeName: "Cli",
      icon: "CLI.svg"
    },
    {
      routeName: "Ayuda",
      icon: "ayuda.svg"
    },
    {
      routeName: "Camiones",
      icon: "ayuda.svg"
    },
    {
      routeName: "Plan Produccion Spp",
      icon: "PlanProduccion.svg"
    }
  ]);
  const handleLogOut = () => {
    dispatch(authenticationSlice.actions.ForceLogOut());
  };
  const getInfo = async () => {
    if (permisos?.id) {
      const info = unwrapResult(await dispatch(PermisosRoutesSliceRequests.getAllByIdRequest(permisos.id)));
      setpermisosRutas(_.orderBy(info, "route.nombre"));
    }
  };
  const getInfoUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      setInfoUsuario(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  React.useEffect(() => {
    //setTokenService();
    getInfo();
    getInfoUser();
  }, []);
  const hitoryPush = (page: string) => {
    history.push(page);
    setIsOpen(false);
  };

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Menu"
        onClick={() => {
          setIsOpen(true);
        }}
        size="large">
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer2
        anchor="left"
        open={isOpen}
        SwipeAreaProps={{ width: 0 }}
        onClose={() => {
          setIsOpen(false);
        }}
        onOpen={() => {
          setIsOpen(true);
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#001134",
            background: `linear-gradient(0deg, rgba(22, 45, 85, 1) 0%, rgba(1, 56, 128, 0.8) 100%))`,
            backgroundSize: "cover",
            backgroundPositionX: "center"
          }
        }}
        sx={{
          "& NoSsr SwipeArea": {
            width: 0
          }
        }}>
        <Box
          className="text-gray-50"
          sx={{
            width: 250,
            "@media (min-width: 600px)": {
              width: 350
            }
          }}>
          <Box className="text-2xl font-sans py-2" textAlign="center">
            <div className="flex flex-col justify-center w-full justify-items-center">
              {/* <Avatar alt={InfoUsuario?.name} className={classNames(classes.small, "col-span-1 w-full")}>
                {InfoUsuario && InfoUsuario?.name[0] + " " + InfoUsuario.surname[0]}
              </Avatar> */}
              <div className="col-span-4 ml-4 text-gray-50 text-sm font-medium text-left">
                <div className="text-center">{InfoUsuario?.name + " " + InfoUsuario?.surname}</div>
                <div className="text-center">{permisos?.rol?.name}</div>
                <div className="text-center">{permisos?.subrol?.name}</div>
              </div>
            </div>
          </Box>
          <Divider />
          {_.orderBy(acordionRoutes, "routeName").map((acord, index) => (
            <AcordionRoutes
              key={index}
              hitoryPush={hitoryPush}
              routes={permisosRutas}
              routeName={acord.routeName}
              icon={acord.icon}
            />
          ))}
          <ListItem
            button
            onClick={() => {
              handleLogOut();
            }}>
            <ListItemIcon>
              <ExitToAppIcon className="text-gray-50" />
            </ListItemIcon>
            <ListItemText primary={"Salir"} />
          </ListItem>
        </Box>
      </SwipeableDrawer2>
    </div>
  );
};
