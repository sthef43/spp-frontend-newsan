import React, { Suspense, useState, createContext, useEffect } from "react";
import { NavBar } from "../ui/NavBar";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FirstLoginSlice } from "app/features/cuenta/slices/FirstLoginSlice";
import * as _ from "lodash";

// import { onValue, ref } from "firebase/database";
// import { db } from "app/firebase/config";
import { AuditoriasRoute } from "app/core/router/AuditoriasRouter";
import { AuditRoute } from "app/core/router/AuditRoute";
import { RutasPadre } from "app/core/router/LazyLoadingRoutes/RutasPadre";

const Cargando = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando Informacion"));
    return () => {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    };
  }, []);
  return <div></div>;
};

export const RoutesUserContext = createContext([]);

export const DashboardScreen = (): JSX.Element => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const firstLoading = useAppSelector((state) => state.firstLogin.estado);
  const [AppUserInfo, setAppUserInfo] = useState(null);

  const init = async () => {
    let result;
    if (!firstLoading) {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando Informacion"));
      try {
        result = unwrapResult(await dispatch(AppUserSliceRequests.getInfoUserById(GetInfoUser().id || 0)));
      } catch {
        result = null;
      }
      if (result) {
        const permisosRoutes = result.permisos.permisosRoutes;
        const routes = permisosRoutes.map((x) => {
          return x.route.ruta;
        });
        setRoutesUser(_.orderBy(routes));
        setAppUserInfo(result);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    dispatch(FirstLoginSlice.actions.changeToFalse());
  };

  //State para guardar las rutas que tiene acceso el usuario logeado. Lo guardo en un Context.
  const [routesUser, setRoutesUser] = useState(null);

  React.useEffect(() => {
    init();
  }, []);

  //Prueba Firebase

  useEffect(() => {
    console.log("aca?");

    //   const dbRef = ref(db, "prueba");
    //   onValue(dbRef, (snapshot) => {
    //     console.log(snapshot.val());
    //   });
    // const tasksRef = ref(db, 'tasks');
    // console.log(tasks)
    // // 2. Establece el oyente en tiempo real (onValue)
    // const unsubscribe = onValue(tasksRef, (snapshot) => {
    //   setIsLoading(false);
    //   const data = snapshot.val();
    //   const loadedTasks = [];

    //   setTasks(loadedTasks);
    // }, (error) => {
    //     // Manejo de errores (ej. problemas de permisos)
    //     console.error("Error al leer datos:", error);
    //     setIsLoading(false);
    // });

    // // 4. Función de limpieza: desvincula el oyente cuando el componente se desmonta.
    // // ESTO ES CRUCIAL para evitar pérdidas de memoria (memory leaks).
    // return () => {
    //   unsubscribe();
    // };
  }, []);

  return (
    <RoutesUserContext.Provider value={routesUser}>
      <div>
        <NavBar />
        {AppUserInfo && (
          <div>
            <Suspense fallback={<Cargando />}>
              <SwitchTransition>
                <CSSTransition
                  timeout={{ enter: 800, exit: 800 }}
                  classNames={{
                    enter: "animate__animated animate__fadeIn animate__faster",
                    exit: "animate__animated animate__fadeOut animate__faster"
                  }}
                  key={location.pathname}>
                  <Switch location={location}>
                    {/* HOME */}
                    <Route exact path={`${path}`}>
                      <RutasPadre routeSelected="main" />
                    </Route>

                    {/*ADMIN*/}
                    <Route path={`${path}/admin`}>
                      <RutasPadre routeSelected="admin" />
                    </Route>

                    {/*AUDITORIAS*/}
                    <Route path={`${path}/auditoria`}>
                      {/* <AuditoriasRoute /> */}
                      <AuditRoute />
                    </Route>

                    {/*AUDITORIAS V2.0*/}
                    <Route path={`${path}/auditorias-v2`}>
                      <AuditoriasRoute />
                    </Route>

                    {/* BATERIAS */}
                    <Route path={`${path}/baterias`}>
                      <RutasPadre routeSelected="baterias" />
                    </Route>

                    {/* CALIDAD */}
                    <Route path={`${path}/calidad`}>
                      <RutasPadre routeSelected="calidad" />
                    </Route>

                    {/* CUENTA */}
                    <Route path={`${path}/cuenta`}>
                      <RutasPadre routeSelected="cuenta" />
                    </Route>

                    {/* CONTENEDORES */}
                    <Route path={`${path}/contenedor`}>
                      <RutasPadre routeSelected="contenedor" />
                    </Route>

                    {/* DOBLADORA */}
                    <Route path={`${path}/dobladora`}>
                      <RutasPadre routeSelected="dobladora" />
                    </Route>

                    {/* EBS */}
                    <Route path={`${path}/ebs`}>
                      <RutasPadre routeSelected="ebs" />
                    </Route>

                    {/* ETIQUETAS */}
                    <Route path={`${path}/etiquetas`}>
                      <RutasPadre routeSelected="etiquetas" />
                    </Route>

                    {/* GERENCIA */}
                    <Route path={`${path}/gerencia`}>
                      <RutasPadre routeSelected="gerencia" />
                    </Route>

                    {/* INFORMES */}
                    <Route path={`${path}/informes`}>
                      <RutasPadre routeSelected="informes" />
                    </Route>

                    {/* INGENIERIA */}
                    <Route path={`${path}/ingenieria`}>
                      <RutasPadre routeSelected="ingenieria" />
                    </Route>

                    {/* MANEJO DEL SISTEMA */}
                    <Route path={`${path}/manejo-sistema`}>
                      <RutasPadre routeSelected="manejo-sistema" />
                    </Route>

                    {/* MATERIALES */}
                    <Route path={`${path}/materiales`}>
                      <RutasPadre routeSelected="materiales" />
                    </Route>

                    {/* MES */}
                    <Route path={`${path}/mes`}>
                      <RutasPadre routeSelected="mes" />
                    </Route>

                    {/* OQC */}
                    <Route path={`${path}/oqc`}>
                      <RutasPadre routeSelected="oqc" />
                    </Route>

                    {/* OQC CELULARES  */}
                    <Route path={`${path}/oqc-celulares`}>
                      <RutasPadre routeSelected="oqc-celulares" />
                    </Route>

                    {/* OTRAS FUNCIONES */}
                    <Route path={`${path}/otras-funciones`}>
                      <RutasPadre routeSelected="otras-funciones" />
                    </Route>

                    {/* PRODUCCION */}
                    <Route path={`${path}/produccion`}>
                      <RutasPadre routeSelected="produccion" />
                    </Route>

                    {/* PROGRAMACIÓN INDUSTRIAL*/}
                    <Route path={`${path}/piroute`}>
                      <RutasPadre routeSelected="piroute" />
                    </Route>

                    {/* SEGURIDAD E HIGIENE */}
                    <Route path={`${path}/segehig`}>
                      <RutasPadre routeSelected="seguridad-e-higiene" />
                    </Route>

                    {/* SOLDADURA */}
                    <Route path={`${path}/soldadura`}>
                      <RutasPadre routeSelected="soldadura" />
                    </Route>

                    {/* SGI */}
                    <Route path={`${path}/sgi`}>
                      <RutasPadre routeSelected="sgi" />
                    </Route>

                    {/* TABLEROS */}
                    <Route path={`${path}/tableros`}>
                      <RutasPadre routeSelected="tableros" />
                    </Route>

                    {/* TRAZABILIDAD */}
                    <Route path={`${path}/trazabilidad`}>
                      <RutasPadre routeSelected="trazabilidad" />
                    </Route>

                    {/* CLI */}
                    <Route path={`${path}/cli`}>
                      <RutasPadre routeSelected="cli" />
                    </Route>

                    {/* TICKETS */}
                    <Route path={`${path}/tickets`}>
                      <RutasPadre routeSelected="tickets" />
                    </Route>

                    {/* PLAN PRODUCCION */}
                    <Route path={`${path}/plan-produccion-spp`}>
                      <RutasPadre routeSelected="plan-produccion-spp" />
                    </Route>

                    {/* INFORMACION */}
                    <Route path={`${path}/ayuda`}>
                      <RutasPadre routeSelected="ayuda" />
                    </Route>

                    {/* AUDITORIAS */}
                    <Route path={`${path}/auditorias-v2`}>
                      <RutasPadre routeSelected="auditorias-v2" />
                    </Route>

                    {/* CAMIONES */}
                    <Route path={`${path}/camiones`}>
                      <RutasPadre routeSelected="camiones" />
                    </Route>

                    {/* ACCESO DENEGADO */}
                    <Route path={`${path}/acceso-denegado`}>
                      <RutasPadre routeSelected="acceso-denegado" />
                    </Route>
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            </Suspense>
          </div>
        )}
      </div>
    </RoutesUserContext.Provider>
  );
};
