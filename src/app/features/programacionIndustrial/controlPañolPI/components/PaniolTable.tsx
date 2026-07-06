import { Delete, Edit, ImportExport } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PaniolPISliceRequests } from "app/features/programacionIndustrial/slices/PaniolPISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPaniolPI } from "app/models/IPaniolPI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import produce from "immer";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { PaniolForm } from "../modals/PaniolForm";
import { PaniolMovimiento } from "../modals/PaniolMovimiento";
interface Props {
  plantId: number;
}
const divofacctions =
  "w-full py-2 sm:col-span-1 items-center grid grid-cols-2 sm:grid-cols-2 sm:border-2 sm:content-center border-gray-500 rounded-md px-0 sm:px-4 gap-2 sm:gap-4";

export const PaniolTable = ({ plantId }: Props) => {
  const paniolStock = useAppSelector<IPaniolPI[]>((state) => state.paniolPI.dataAll);
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [openModal, setOpenModal] = useState(false);
  const [movimiento, setMovimiento] = useState(false);
  const [dataEdit, setDataEdit] = useState<IPaniolPI>(null);
  const [history, setHistory] = useState([]);
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(PaniolPISliceRequests.deleteRequest(id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        dispatch(PaniolPISliceRequests.getAllByPlantId(plantId));
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onOpenModal = () => {
    setDataEdit(null);
    setOpenModal(true);
  };
  const onEdit = (row) => {
    setDataEdit(row);
    setOpenModal(true);
  };
  const onMovimiento = (row) => {
    setDataEdit(row);
    setMovimiento(true);
  };
  const ExtraModulesCollapse = ({ row }: any) => {
    return (
      <>
        <div className="w-full">
          {history[row.id].length > 0 ? (
            <TableComponent
              columns={[
                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "Movimiento",
                  field: "movimiento"
                },
                {
                  title: "Detalles",
                  field: "detalles"
                },
                {
                  title: "Creado/modificado por:",
                  field: "userName"
                },
                {
                  title: "Fecha y hora",
                  field: "",
                  render: (row) => {
                    return <div>{moment(row.lastModifiedDate).format("DD/MM/YYYY hh:mm:ss")}</div>;
                  }
                }
              ]}
              IDcolumn={"id"}
              dataInfo={history[row.id]}
            />
          ) : (
            <div className="flex justify-center font-medium py-4 ">
              <h1>Articulo sin historial (:</h1>
            </div>
          )}
        </div>
      </>
    );
  };
  const getHistory = async () => {
    const newArr = paniolStock.map(async (movimiento) => {
      const history = unwrapResult(await dispatch(PaniolPISliceRequests.getAllHistoryByArticulo(movimiento.articulo)));
      setHistory(
        produce((state) => {
          state[movimiento.id] = history;
        })
      );
      return history;
    });
  };
  useEffect(() => {
    getHistory();
  }, [paniolStock]);
  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <div>
      <TableComponent
        columns={[
          {
            title: "Articulo",
            field: "articulo"
          },
          {
            title: "Marca",
            field: "marca"
          },
          {
            title: "Modelo",
            field: "modelo"
          },
          {
            title: "Detalles",
            field: "detalles"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Movimiento",
            field: "movimiento"
          },
          {
            title: "Creado/modificado por:",
            field: "userName"
          },
          {
            title: "Fecha y hora",
            field: "",
            render: (row: IPaniolPI) => {
              // eslint-disable-next-line react/prop-types
              return <div>{moment(row.lastModifiedDate).format("DD/MM/YYYY hh:mm:ss")}</div>;
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (rowData: any) =>
              rowData && (
                <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                  <div id="icono" className="col-span-2 text-right sm:text-left ">
                    <Tooltip title="Movimiento">
                      <IconButton
                        onClick={() => {
                          onMovimiento(rowData);
                        }}
                        size="small">
                        <ImportExport color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          onEdit(rowData);
                        }}
                        size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          onDelete(rowData.id);
                        }}
                        size="small">
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              )
          }
        ]}
        IDcolumn="id"
        buscar
        agregar={onOpenModal}
        dataInfo={paniolStock}
        rowStyle={(rowData) => {
          switch (rowData.cantidad) {
            case 0:
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
        Collapse
        CollapseExtraModulesBefore={ExtraModulesCollapse}
      />
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title={"Agregar un articulo al pañol"}>
        <PaniolForm setOpenModal={setOpenModal} plantId={plantId} dataEdit={dataEdit} />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setMovimiento} openPopup={movimiento} title={"Hacer un movimiento"}>
        <PaniolMovimiento setOpenModal={setMovimiento} plantId={plantId} data={dataEdit} />
      </ModalCompoment>
    </div>
  );
};
