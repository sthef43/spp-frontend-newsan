import { useAppDispatch } from "app/core/store/store";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { IntRemitoPadreSliceRequests } from "app/Middleware/reducers/IntRemitoPadreSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IIntRemito } from "app/models/IIntRemito";
import { Button } from "@mui/material";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";

interface props {
  setOpenPopup: any;
  intRemitoPadre?: IIntRemitoPadre; //Remito Padre seleccionado de Darsena
}
export const IntVerContenidoRemitoPadre = ({ setOpenPopup, intRemitoPadre }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();

  //Leer
  const [listRemitos, setListRemitos] = useState<IIntRemito[] | null>(null);
  const getListRemitos = async () => {
    try {
      const result = unwrapResult(
        await dispatch(IntRemitoPadreSliceRequests.getByIdRemitoPadreRequest(intRemitoPadre.id))
      );
      const agregado = result[0].intRemitos.map((row, index) => ({ ...row, numero: index + 1 }));
      setListRemitos(agregado);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };
  useEffect(() => {
    if (intRemitoPadre) {
      getListRemitos();
    }
  }, []);

  //Cerrar
  const cerrar = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <div style={{ height: "100%", width: "60vw", position: "relative" }}>
        {/* Primer cuadro */}
        <div style={{ margin: "20px" }}>
          N° Remito Padre
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
                {"RP" + intRemitoPadre.id.toString().padStart(10, "0")}
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
              Planta origen: {intRemitoPadre.plantOrigen.name}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Patente: {intRemitoPadre.patente}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Chofer: {intRemitoPadre.chofer}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              Contenedor: {intRemitoPadre.contenedor}
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "center",
                margin: "10px",
                alignContent: "center"
              }}>
              N° Precinto/Candado: {intRemitoPadre.precintoCandado}
            </div>
          </div>
        </div>

        {/* Tercer Recuadro - Formulario */}
        {listRemitos && (
          <TableComponent
            columns={[
              {
                title: "N°",
                field: "numero"
              },
              {
                title: "N° Remito",
                field: "",
                render: (row) => row.plantOrigen.organizationCode + row.id.toString().padStart(10, "0")
              },
              {
                title: "Operador",
                field: "",
                render: (row) => row.appUser.operator.name + " " + row.appUser.operator.surname
              },
              {
                title: "Destino",
                field: "plantDestino.name"
              },
              {
                title: "Área",
                field: "areaDestino.nombre"
              },
              {
                title: "Referente",
                field: "referenciaDestino"
              }
            ]}
            dataInfo={listRemitos}
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
