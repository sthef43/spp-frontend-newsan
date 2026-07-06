import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { InformesPISliceRequest } from "app/features/programacionIndustrial/slices/InformesPISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IInformesPI } from "app/models/IInformesPI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import TitleUIComponent from "../../../../shared/components/helpComponents/TitleUIComponent";
import { ModalCompoment } from "../../../../shared/components/ModalComponent";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { InformesPIForm } from "../modals/InformesPIForm";
interface Props {
  refresh: any;
  plantId: number;
}
export const InformesPITable = ({ refresh, plantId }: Props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const tableData = useAppSelector((state) => state.informesPI.dataAll);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<IInformesPI>(null);
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(InformesPISliceRequest.deleteRequest(id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onOpenModal = () => {
    setEditData(null);
    setOpenModal(true);
  };
  const onEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };

  return (
    <div className="w-full">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className=" flex justify-center ">
          <TitleUIComponent title={`Informe diario`} classNameDiv="w-full whitespace-wrap mx-0" />
        </div>

        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Linea",
              field: "lineaProduccion.nombre"
            },
            {
              title: "Asunto",
              field: "asunto"
            },
            {
              title: "Descripción",
              field: "descripcion"
            },
            {
              title: "Solución",
              field: "solucion"
            },
            {
              title: "Sector",
              field: "sector.name"
            },
            {
              title: "Turno",
              field: "turno.nombre"
            },
            {
              title: "Fecha",
              field: "fecha"
            },
            {
              title: "Desde la hora",
              field: "desdeHora"
            },
            {
              title: "Hasta la hora",
              field: "hastaHora"
            },
            // {
            //   title: "Desde la hora",
            //   field: "",
            //   render: (row: any) => row && <div className="w-full">{moment(row?.desdeHora).format("hh:mm a")}</div>
            // },
            // {
            //   title: "Hasta la hora",
            //   field: "",
            //   render: (row: any) => row && <div className="w-full">{moment(row?.hastaHora).format("hh:mm a")}</div>
            // },
            {
              title: "Creado por:",
              field: "usuario"
            },
            {
              title: "Acciones",
              field: "",
              render: (rowData: any) =>
                rowData && (
                  <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                    <div id="icono" className="col-span-2 text-right sm:text-left ">
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            onEdit(rowData);
                          }}
                          size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            onDelete(rowData.id);
                          }}
                          size="small">
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                )
            }
          ]}
          agregar={(row) => {
            onOpenModal();
          }}
          buscar
          dataInfo={tableData}
          Dense={true}
          Overflow={true}
          filterWithSpecificValues={"Número de OP"}
        />
      </div>
      <ModalCompoment title="Agregar un evento" openPopup={openModal} setOpenPopup={setOpenModal}>
        <InformesPIForm dataEdit={editData} setOpenPopup={setOpenModal} refresh={refresh} plantId={plantId} />
      </ModalCompoment>
    </div>
  );
};
