import { Check } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import moment from "moment";
import { ParadasDeLineaForm } from "../modals/ParadasDeLineaForm";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

interface props {
  data: any;
  tableData: IParadasDeLinea[];
  refresh: any;
  plantId: number;
}
export const ParadasDeLineaTable = ({ data, tableData, refresh, plantId }: props) => {
  const [openModal, setOpenModal] = useState(false);
  const [dataRefresh, setDataRefresh] = useState({});
  const [editData, setEditData] = useState();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();

  const onOpenModal = () => {
    setEditData(null);
    setOpenModal(true);
  };
  const onEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };
  const onDelete = async (row) => {
    try {
      const resp = await getConfirmation(
        "Borrar una linea",
        "Esat seguro que quiere eliminar esta linea de producción?"
      );
      if (resp) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

        const response = unwrapResult(await dispatch(ParadasDeLineaSliceRequests.deleteRequest(row.id)));
        if (response) {
          openNotificationUI("Se elimino correctamente", "success");
          refresh();
        }
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      openNotificationUI(err, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    setDataRefresh(data);
    return () => {
      setDataRefresh({});
    };
  }, [data]);

  return (
    <div className="w-full">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className=" flex justify-center ">
          <TitleUIComponent title={`Paradas de linea`} classNameDiv="w-full whitespace-wrap mx-0" />
        </div>

        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Código de modelo",
              field: "modelo.nombre"
            },
            {
              title: "Desde",
              field: "horaInicio"
            },
            {
              title: "Hasta",
              field: "horaFin"
            },
            {
              title: "Fecha",
              field: "",
              render: (row: any) =>
                row.fecha != null ? <div className="w-full">{moment(row?.fecha).format("YYYY-MM-DD")}</div> : ""
            },
            {
              title: "Fecha fin",
              field: "",
              render: (row: any) =>
                row.fechaFin != null ? <div className="w-full">{moment(row?.fechaFin).format("YYYY-MM-DD")}</div> : ""
            },
            {
              title: "Causa",
              field: "causa"
            },
            {
              title: "Area",
              field: "",
              render: (row) => <h1 style={{ maxWidth: "50px!important" }}> {row.areaTraza.nombre}</h1>
            },
            {
              title: "Minutos",
              field: "minutos"
            },
            {
              title: "Supervisor",
              field: "supervisor"
            },
            {
              title: "Discontinuo?",
              field: "",
              render: (row: any) =>
                row && (
                  <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                    <div id="icono" className="col-span-2 text-right sm:text-left ">
                      {row.discontinuo ? (
                        <Tooltip title="Si">
                          <IconButton size="small">
                            <Check fontSize="small" color="success" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="No">
                          <IconButton size="small">
                            <Check fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                )
            },
            {
              title: "Acciones",
              field: "",
              render: (rowData: any) =>
                rowData && <ActionsButtons row={rowData} edit onEditProps={onEdit} eliminar onDeleteProps={onDelete} />
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
      <ModalCompoment title="Agregar una parada de linea" openPopup={openModal} setOpenPopup={setOpenModal}>
        <ParadasDeLineaForm
          plantId={plantId}
          setOpenPopup={setOpenModal}
          refresh={refresh}
          editState={editData}
          data={dataRefresh}
        />
      </ModalCompoment>
    </div>
  );
};
