import { IIntRemito } from "app/models/IIntRemito";
import React from "react";
import "../styles/IntImprimirRemito.css"; // Estilos específicos para impresión
import { QRCode } from "react-qrcode-logo";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";

interface props {
  parentRef?: any;
  fila: IIntRemitoPadre | null;
  detalle: IIntRemito[] | null;
}

export const IntImprimirRemitoPadre = ({ parentRef, fila, detalle }: props): JSX.Element => {
  if (!fila) return null;

  return (
    <>
      {fila && detalle && (
        <div ref={parentRef} className="remito-container">
          {/* ENCABEZADO */}

          <div className="remito-header">
            {/* Logo newsan */}
            <div className="empresa-info">
              <img
                src={`${import.meta.env.BASE_URL}imagenes/newsan/LogoNewsanRojo.svg`}
                alt="logoNewsan"
                style={{ maxHeight: "110px" }}
              />
              <h1>Movimiento Inter Planta</h1>
            </div>
            {/* Numero Remito + QR */}
            <div className="remito-info">
              <div style={{ marginBottom: "5px" }}>
                <QRCode
                  value={`${fila.id}`}
                  size={128}
                  ecLevel="H"
                  qrStyle="squares"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  quietZone={4}
                />
              </div>
              <h2 style={{ marginTop: "5px" }}>N° RP{fila.id.toString().padStart(10, "0")}</h2>
            </div>
          </div>

          {/* DATOS DEL OPERADOR Y DESTINATARIO */}
          <div
            style={{
              display: "flex"
            }}>
            {/* Origen */}
            <div style={{ flex: 1, border: "1px solid black", textAlign: "left", padding: "2%" }}>
              <div>
                <strong>Origen</strong>
              </div>
              <div>
                <strong>Planta origen:</strong> {fila.plantOrigen.name}
              </div>
              {/* <div>
                <strong>Operador:</strong> {fila.appUser.operator.name} {fila.appUser.operator.surname}
              </div> */}
              <div>
                <strong>Fecha:</strong> {new Date(fila.createdDate).toLocaleDateString()}
              </div>
            </div>
            {/* Destino */}
            <div
              style={{
                flex: 1,
                border: "1px solid black",
                marginLeft: "2%",
                textAlign: "left",
                padding: "2%"
              }}>
              <div>
                <strong>Destino</strong>
              </div>
              <div>
                <strong>Planta destino:</strong> {fila.plantDestino.name}
              </div>
              {/* <div>
                <strong>Área Destino:</strong> {fila.areaDestino.nombre}
              </div>
              <div>
                <strong>Referente:</strong> {fila.referenciaDestino}
              </div> */}
            </div>
          </div>

          {/* TABLA DE DETALLES */}
          <h2 style={{ marginTop: "30px" }}>Detalle</h2>
          <table className="remito-tabla">
            <thead>
              <tr>
                <th>Ítem</th>
                <th>N° Remito</th>
                <th>Destino</th>
                <th>Área</th>
                <th>Referente</th>
              </tr>
            </thead>
            <tbody>
              {detalle?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {item.plantOrigen.organizationCode} {item.id.toString().padStart(10, "0")}
                  </td>
                  <td>{item.plantDestino.name}</td>
                  <td>{item.areaDestino.nombre}</td>
                  <td>{item.referenciaDestino}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Observación */}
          <h2>Observación</h2>
          <div style={{ flex: 1, border: "1px solid black", textAlign: "left", padding: "2%" }}>{fila.observacion}</div>

          {/* Recorte de tijera */}
          <div className="recorte">
            <span className="tijera">✂</span>
            <div className="linea-punteada"></div>
          </div>
        </div>
      )}
    </>
  );
};
