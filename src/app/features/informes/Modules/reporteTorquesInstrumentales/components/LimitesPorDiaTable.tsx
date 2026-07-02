import React from "react";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { ILimitesTraza } from "app/models";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import moment from "moment";
import { LimitesTrazaDialog } from "app/features/calidad/modules/limitesDeTorqueInstrumental/Components/LimitesTrazaDialog";

interface props {
  limites: ILimitesTraza[];
  refresh?: () => void;
}

export const LimitesPorDiaTable = ({ limites, refresh }: props): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedLimite, setSelectedLimite] = React.useState<ILimitesTraza>(null);

  const setRow = (limite: ILimitesTraza) => {
    setSelectedLimite(limite);
    setModalOpen(true);
  };

  React.useEffect(() => {
    if (limites && limites.length > 0) {
      console.log("ROW 0 (loaded)", limites[0], "FAMILIA:", (limites[0] as any)?.familia);
    }
  }, [limites]);

  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Hora",
            field: "",
            render: (row: ILimitesTraza) => {
              return moment(row?.createdDate).format("H:mm:ss");
            }
          },
          {
            title: "Sector",
            field: "",
            render: (row: ILimitesTraza) => {
              return row?.limites?.instpuesto?.sector;
            }
          },
          {
            title: "Descripción",
            field: "",
            render: (row: ILimitesTraza) => {
              return row?.limites?.instpuesto?.descripcion;
            }
          },

          // NUEVA COLUMNA: FAMILIA
          {
            title: "Familia",
            field: "",
            render: (row: ILimitesTraza) => {
              const familia = (row as any)?.familia as string | undefined;
              return familia && familia.trim().length > 0 ? familia : "-";
            }
          },

          {
            title: "Puesto",
            field: "",
            render: (row: ILimitesTraza) => {
              return row?.limites?.codigoPuesto;
            }
          },
          {
            title: "Color",
            field: "",
            render: (row: ILimitesTraza) => {
              return row?.limites?.idColorNavigation?.color1;
            }
          },
          {
            title: "Usuario",
            field: "userName"
          },
          {
            title: "Fecha",
            field: "",
            render: (row: ILimitesTraza) => moment(row?.fecha).format("L")
          },
          {
            title: "Acciones",
            field: "",
            render: (row: ILimitesTraza) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <IconButton
                      onClick={() => {
                        setRow(row);
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
        dataInfo={limites}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
      />

      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <LimitesTrazaDialog limite={selectedLimite} callback={setModalOpen} refreshTable={refresh} />
      </ModalCompoment>
    </div>
  );
};
