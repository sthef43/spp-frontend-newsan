import React from "react";
import { IHojaParametro } from "app/models/IHojaParametro";
import Grid from "@mui/material/Grid";

interface props {
  fila?: IHojaParametro | null;
}

export const HojaParametrosImageAprobadaForm = ({ fila }: props): JSX.Element => {
  return (
    <div style={{ justifyContent: "center", alignItems: "center", width: "95vh", height: "83vh", font: "Roboto" }}>
      {fila && (
        <div style={{ alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "20px" }}>
            <div>Modelo: {fila.modelo.nombre}</div>
            <Grid container spacing={2} columns={3}>
              <Grid item xs={1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "15px" }}>
                  Marca: {fila.marca.descripcion}
                </div>
              </Grid>
              <Grid item xs={1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "15px" }}>
                  Proveedor: {fila.proveedores.descripcion}
                </div>
              </Grid>
              <Grid item xs={1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "15px" }}>
                  Versión: {fila.version}
                </div>
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              margin: "2%",
              textAlign: "center",
              border: "1px solid grey",
              borderRadius: "10px",
              width: "95%"
            }}></div>
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "46rem" }}>
            <img
              src={`${import.meta.env.BASE_URL}imagenes/HojaParametros/${fila.imagen}`}
              alt="Imagen"
              style={{ maxWidth: "95%", maxHeight: "95%", margin: "auto" }}
            />
          </div>
          <div
            style={{
              margin: "2%",
              textAlign: "center",
              border: "1px solid grey",
              borderRadius: "10px",
              width: "95%"
            }}></div>
          <div style={{ marginLeft: "10%" }}>
            <Grid container spacing={10} columns={2}>
              <Grid item xs={1}>
                <div style={{ display: "flex", flexDirection: "column", fontSize: "15px" }}>
                  <div>Aprobado x Calidad:</div>
                  <div>
                    {fila.userCalidad.operator.name} {fila.userCalidad.operator.surname}
                  </div>
                  <div>Fecha: {fila.fechaCalidad}</div>
                </div>
              </Grid>
              <Grid item xs={1}>
                <div style={{ display: "flex", flexDirection: "column", fontSize: "15px" }}>
                  <div>Aprobado x Sector Etiquetas: </div>
                  <div>
                    {fila.userSector.operator.name} {fila.userSector.operator.surname}
                  </div>
                  <div>Fecha: {fila.fechaSector}</div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
};
