import React from "react";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IPlanProd } from "app/models";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { ProduccionDialog } from "../../../../produccion/modules/gestionProduccion/modals/ProduccionDialog";
import moment from "moment";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
// import { ModalCompoment } from "../ModalComponent";

interface props {
  lotes: IPlanProd[];
}

export const ReportePorDiaTableFecha = ({ lotes }: props): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPlanProd, setSelectedPlanProd] = React.useState(0);

  const setRow = (id: number) => {
    setSelectedPlanProd(id);
    setModalOpen(true);
  };

  return (
    <ContainerForPages optionsLayout="Table" activeEffectVisible>
      <TableComponent
        excel
        IDcolumn={"idProduccion"}
        columns={[
          {
            title: "Modelo",
            field: "codigoModelo"
          },
          {
            title: "Prefijo",
            field: "ultimoNewsan",
            render: (row) => {
              return "0" + row?.ultimoNewsan;
            }
          },
          {
            title: "Lote",
            field: "lote"
          },
          {
            title: "Numero-OP",
            field: "numeroOp"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Producidos",
            field: "cantidadProducida"
          },
          {
            title: "Pendiente",
            field: "pendiente"
          },
          {
            title: "No conformes",
            field: "cantidadRechazos"
          },
          {
            title: "Fecha Inicio",
            field: "fechaInicio",
            render: (row) => {
              return moment(row.fechaInicio).format("L");
            }
          },
          {
            title: "Fecha Final",
            field: "fechaFinal",
            render: (row) => {
              return moment(row.fechaFinal).format("L");
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <IconButton
                      onClick={() => {
                        setRow(row?.idProduccion);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Info />
                    </IconButton>
                  </div>
                </div>
              );
            }
          }
        ]}
        dataInfo={lotes}
        //Collapse={true}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
      />
      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ProduccionDialog id={selectedPlanProd} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
