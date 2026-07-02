import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { PermissionsRoutesPage } from "app/features/manejoSistema/permisosUsuarios/pages/permissionsRoutes.pages";
import { PermissionsUserPage } from "app/features/manejoSistema/permisosUsuarios/pages/PermissionsUserPage";
import { AltaOperariosPage } from "app/features/manejoSistema/altaOperarios/pages/AltaOperariosPage";
import { AdministrarRutasPage } from "app/features/manejoSistema/administarRutas/pages/AdministrarRutasPage";
import { RolesYSubrolesPage } from "app/features/manejoSistema/rolesAndSubroles/pages/RolesYSubrolesPage";
export const ManejoSistemaRouter = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();

  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/admin-rutas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("manejo-sistema/admin-rutas")}>
            <AdministrarRutasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/alta-operario`}>
          <ProtectedRoute authorized={userRoutesContext.includes("manejo-sistema/alta-operario")}>
            <AltaOperariosPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/permisos-usuarios`}>
          <ProtectedRoute authorized={userRoutesContext.includes("manejo-sistema/permisos-usuarios")}>
            <PermissionsUserPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/permisos-rutas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("manejo-sistema/permisos-rutas")}>
            <PermissionsRoutesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/roles-y-subroles`}>
          <ProtectedRoute authorized={userRoutesContext.includes("manejo-sistema/roles-y-subroles")}>
            <RolesYSubrolesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
