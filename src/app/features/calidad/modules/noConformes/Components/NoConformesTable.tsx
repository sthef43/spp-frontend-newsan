/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react/display-name */
import React from "react";

//import MaterialTable from "material-table";
import { useAppDispatch } from "app/core/store/store";
import { IControlLote } from "app/models/IControlLote";
import moment from "moment";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { NoConformesDialog } from "app/features/calidad/modules/noConformes/Modals/NoConformesDialog";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { IPlanProd } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { RemoveRedEye } from "@mui/icons-material";
import { ReprocesadosTable } from "app/features/calidad/modules/noConformes/Modals/ReprocesadosTable";

interface props {
  noConformes: IControlLote[];
  actualizarTabla: any;
}

export const NoConformesTable = ({ noConformes, actualizarTabla }: props): JSX.Element => {
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [cargando, setCargando] = React.useState(true);
  const [modalReprocesados, setModalReprocesadosOpen] = React.useState(false);

  const [listadoReprocesadoLinea, setListadoReprocesadoLinea] = React.useState([]);
  const [dataOpen, setDataOpen] = React.useState<IControlLote[]>(noConformes);
  const [selectedControlLote, setSelectedControlLote] = React.useState<IControlLote>(null);
  const [planProdDelRechazo, setPlanProdDelRechazo] = React.useState<IPlanProd>(null);

  const findRechazo = (id: number): IControlLote => {
    const rechazado = dataOpen.find(function (e) {
      return e.idControlLote == id;
    });
    return rechazado;
  };

  const getPlanProdDelRechazo = async (nroOp: string) => {
    let fetchPlanProdResult;
    try {
      fetchPlanProdResult = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(nroOp)));
    } catch (error) {
      fetchPlanProdResult = null;
    }
    if (fetchPlanProdResult) {
      setPlanProdDelRechazo(fetchPlanProdResult);
      console.log(
        "🚀 ~ file: NoConformesTable.tsx ~ line 46 ~ getPlanProdDelRechazo ~ fetchPlanProdResult",
        fetchPlanProdResult
      );
    }
  };

  const setRow = async (rowData: any) => {
    setSelectedControlLote(findRechazo(rowData?.idControlLote));
    await getPlanProdDelRechazo(rowData?.numeroOp);
    setModalOpen(true);
  };

  const verReprocesados = async (rowData: IControlLote) => {
    setSelectedControlLote(findRechazo(rowData?.idControlLote));
    setModalReprocesadosOpen(true);
  };

  React.useEffect(() => {
    setCargando(!cargando);
  }, [dataOpen]);

  React.useEffect(() => {
    setDataOpen(noConformes);
  }, [noConformes]);

  return (
    <div>
      <TableComponent
        IDcolumn={"idControlLote"}
        buscar={true}
        columns={[
          {
            title: "Modelo",
            field: "codigoModelo"
          },
          {
            title: "Lote",
            field: "lote"
          },
          {
            title: "OP",
            field: "numeroOp"
          },
          {
            title: "Desde",
            field: "serieDesde"
          },
          {
            title: "Hasta",
            field: "serieHasta"
          },
          {
            title: "Rechazados",
            field: "cantidadRechazos"
          },
          {
            title: "Reprocesados",
            field: "cantidadReprocesos"
          },
          {
            title: "Auditor",
            field: "nombreSupervisor"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => moment(row.fecha).format("L")
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
                        setRow(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <div>
                    <Tooltip title="Ver reprocesados">
                      <IconButton
                        onClick={() => {
                          verReprocesados(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <RemoveRedEye fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        dataInfo={dataOpen}
        Dense={true}
      />
      <ModalCompoment title="Información" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <NoConformesDialog
          controlLote={selectedControlLote}
          planProd={planProdDelRechazo}
          setOpenPopup={setModalOpen}
          actualizarTabla={actualizarTabla}
        />
      </ModalCompoment>
      <ModalCompoment title="Reprocesados" openPopup={modalReprocesados} setOpenPopup={setModalReprocesadosOpen}>
        <ReprocesadosTable
          idControlLote={selectedControlLote?.idControlLote}
          serieDesde={selectedControlLote?.serieDesde}
          serieHasta={selectedControlLote?.serieHasta}
        />
      </ModalCompoment>
    </div>
  );
};
