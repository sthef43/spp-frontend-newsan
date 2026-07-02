/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, ComponentType, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";

/**
 * Configuración de una ruta lazy-loaded
 */
export interface LazyRouteConfig {
  /** Ruta relativa (ej: "/calidad", "/no-conformes") */
  path: string;
  /** Función que retorna la promesa de importación del componente */
  importFn: () => Promise<any>;
  /** Nombre del export (si es named export). Si es default export, dejar vacío */
  exportName?: string;
  /** Permiso requerido para acceder a la ruta (opcional) */
  permission?: string;
  /** Props adicionales para pasar al componente (opcional) */
  componentProps?: Record<string, any>;
  /** Si es true, no envuelve en ProtectedRoute */
  isPublic?: boolean;
}

/**
 * Helper para crear un componente lazy-loaded
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<any>,
  exportName?: string
): React.LazyExoticComponent<T> => {
  if (exportName) {
    // Named export
    return lazy(() =>
      importFn().then((module) => ({
        default: module[exportName] as T
      }))
    );
  } else {
    // Default export
    return lazy(importFn);
  }
};

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

/**
 * Props para LazyRoutes
 */
interface LazyRoutesProps {
  /** Path base del router (ej: "/main/calidad") */
  basePath: string;
  /** Array de configuraciones de rutas */
  routes: LazyRouteConfig[];
  /** Contexto de rutas del usuario (para permisos) */
  userRoutesContext: string[];
  /** Componente de fallback mientras carga (opcional) */
  fallback?: React.ReactNode;
}

/**
 * Componente que renderiza múltiples rutas lazy-loaded
 *
 * @example
 * ```tsx
 * <LazyRoutes
 *   basePath={path}
 *   userRoutesContext={userRoutesContext}
 *   routes={[
 *     {
 *       path: "/calidad",
 *       importFn: () => import("../shared/Pages/calidad/CalidadPage"),
 *       exportName: "CalidadPage",
 *       permission: "calidad/calidad"
 *     },
 *     {
 *       path: "/no-conformes",
 *       importFn: () => import("app/shared/Pages/calidad/noConformes/NoConformesPage"),
 *       exportName: "NoConformesPage",
 *       permission: "calidad/no-conformes"
 *     }
 *   ]}
 * />
 * ```
 */
export const LazyRoutes: React.FC<LazyRoutesProps> = ({
  basePath,
  routes,
  userRoutesContext,
  fallback = <Cargando />
}) => {
  // Memoizar los componentes lazy para evitar re-creación en cada render
  const lazyComponents = React.useMemo(() => {
    return routes.map((route) => ({
      ...route,
      Component: createLazyComponent(route.importFn, route.exportName)
    }));
  }, [routes]);

  return (
    <>
      {lazyComponents.map((route) => {
        const { Component } = route;
        const fullPath = `${basePath}${route.path}`;

        return (
          <Route key={fullPath} path={fullPath}>
            <Suspense fallback={fallback}>
              {route.isPublic || !route.permission ? (
                <Component {...(route.componentProps || {})} />
              ) : (
                <ProtectedRoute authorized={userRoutesContext.includes(route.permission)}>
                  <Component {...(route.componentProps || {})} />
                </ProtectedRoute>
              )}
            </Suspense>
          </Route>
        );
      })}
    </>
  );
};
