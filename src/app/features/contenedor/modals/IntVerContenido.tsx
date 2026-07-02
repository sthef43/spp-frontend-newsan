import { useAppDispatch } from "app/core/store/store";
import { IIntRemito } from "app/models/IIntRemito";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { IIntDetalle } from "app/models/IIntDetalle";
import { IntDetalleSliceRequests } from "app/Middleware/reducers/IntDetalleSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "@mui/material";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../shared/components/Table/TableComponent";

interface props {
  setOpenPopup: any;
  intRemitoSelect?: IIntRemito | null; //Lista Completa Arreglo de objetos
}

export const IntVerContenido = ({ intRemitoSelect, setOpenPopup }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();

  //Leer
  const [listDetalles, setListDetalles] = useState<IIntDetalle[] | []>([]);
  const getListDetalles = async () => {
    try {
      const result = unwrapResult(
        await dispatch(IntDetalleSliceRequests.getAllByIntRemitoIdRequest(intRemitoSelect.id))
      );
      const agregado = result.map((row, index) => ({ ...row, numero: index + 1 }));
      setListDetalles(agregado);
    } catch (error) {
      openNotificationUI("Error al leer Registros.", "error");
    }
  };

  //Cerrar
  const cerrar = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    getListDetalles();
  }, []);

  return (
    <>
      <div style={{ height: "100%", width: "60vw", position: "relative" }}>
        {/* Primer cuadro */}
        <div style={{ margin: "20px" }}>
          N° Remito
          <div className="rounded-lg shadow-elevation-4 bg-background">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px" }}>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  margin: "10px",
                  alignContent: "center",
                  fontSize: "40px"
                }}>
                {intRemitoSelect.plantOrigen.organizationCode + intRemitoSelect.id.toString().padStart(10, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Segundo Recuadro */}
        <div className="rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px" }}>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Planta Destino: {intRemitoSelect.plantDestino.name}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Área: {intRemitoSelect.areaDestino.nombre}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Referencia: {intRemitoSelect.referenciaDestino}
            </div>
          </div>
        </div>

        {/* Tercer Recuadro - Formulario */}
        {listDetalles && (
          <TableComponent
            columns={[
              {
                title: "N°",
                field: "numero"
              },
              {
                title: "Cajas",
                field: "cajas"
              },
              {
                title: "Anexo II",
                field: "anexo"
              },
              {
                title: "Código",
                field: "codigo"
              },
              {
                title: "Descripción",
                field: "descripcion"
              },
              {
                title: "Cantidad",
                field: "cantidad"
              },
              {
                title: "Cont.",
                field: "cont"
              }
            ]}
            dataInfo={listDetalles}
            IDcolumn="id"
          />
        )}
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.redButton} onClick={cerrar} variant="contained">
            Cerrar
          </Button>
        </div>
      </div>
    </>
  );
};
