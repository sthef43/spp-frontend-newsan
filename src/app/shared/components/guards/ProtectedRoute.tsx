import React from "react";
import { AccesoDenegado } from "./AccesoDenegado";

interface props {
  children: any; //Componente a renderizar si es que tiene acceso authorizado a la ruta.
  authorized: boolean; //Para saber si tiene autirozacion a la pagina que esta queriendo acceder.
}
//componente que se encarga de mostrar o no la pantalla segun si tiene permiso.
export const ProtectedRoute = ({ children, authorized = true }: props) => {
  return authorized ? children : <AccesoDenegado />;
};
