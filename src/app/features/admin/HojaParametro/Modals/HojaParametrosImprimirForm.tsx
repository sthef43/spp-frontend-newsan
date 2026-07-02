import React, { useEffect } from "react";
import { IHojaParametro } from "app/models/IHojaParametro";

interface props {
  parentRef: React.RefObject<HTMLDivElement>;
  fila?: IHojaParametro | null;
}

export const HojaParametrosImprimirForm = ({ parentRef, fila }: props): JSX.Element => {
  useEffect(() => {
    const printStyle = document.createElement("style");
    printStyle.type = "text/css";
    printStyle.media = "print";
    printStyle.innerHTML = `@page { size: A4; margin: 0; background-color: #002b36 !important; }`;
    document.head.appendChild(printStyle);
  }, []);

  return (
    <div
      ref={parentRef}
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", font: "Roboto" }}>
      {fila && (
        <div
          style={{
            textAlign: "center",
            color: "black",
            border: "1px solid gray",
            padding: "3%",
            borderRadius: "10px",
            width: "90%"
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
              fontSize: "20px"
            }}>
            <div>Modelo: {fila.modelo.nombre}</div>
          </div>
          <div>
            <div>Marca: {fila.marca.descripcion}</div>
            <div>Proveedor: {fila.proveedores.descripcion}</div>
            <div>Versión: {fila.version}</div>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "50rem" }}>
            <img
              src={`${import.meta.env.BASE_URL}imagenes/HojaParametros/${fila.imagen}`}
              alt="Imagen"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
          <div style={{ fontSize: "15px", marginTop: "2rem" }}>
            Aprobador de Calidad: {fila.userCalidad.operator.name} {fila.userCalidad.operator.surname}. Fecha:{" "}
            {fila.fechaCalidad}
          </div>
          <div style={{ fontSize: "15px" }}>
            Aprobador de Sector: {fila.userSector.operator.name} {fila.userSector.operator.surname}. Fecha:{" "}
            {fila.fechaSector}
          </div>
        </div>
      )}
    </div>
  );
};
