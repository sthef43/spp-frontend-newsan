import React, { useEffect, useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
//import { GestionCaniosForm } from "./GestionCaniosForm";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { Tooltip } from "@mui/material";
import { Cancel, Check } from "@mui/icons-material";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { DobCaniosSubSliceRequests } from "app/Middleware/reducers/DobCaniosSubSlice";
import _ from "lodash";
import moment from "moment";
import "animate.css";
import { GestionCaniosFormV3 } from "../modals/GestionCaniosFormV3";
import { GestionCaniosFormModifV3 } from "../modals/GestionCaniosFormModifV3";
//import { GetionCaniosSelectProduccion } from "./GestionCaniosSelectProduccion";

interface IGestionCaniosTable {
  refresh: () => void;
  informe?: boolean;
}
export const GestionCaniosTable = ({ refresh, informe = false }: IGestionCaniosTable): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const dobCaniosSubs = useAppSelector((state) => state.dobCaniosSub.dataAll);
  // const [openModalSeleccionProduccion, setOpenModalSeleccionProduccion] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [data, setData] = useState({} as IDobCaniosSub);
  const [dataTable, setDataTable] = useState<IDobCaniosSub[]>([]);

  const onOpenModal = (row?) => {
    row ? setData({ ...row, generico: row.dobMaestroPieza.generico }) : setData(null);
    setOpenModal(true);
  };

  const onDelete = async (row: IDobCaniosSub) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(DobCaniosSubSliceRequests.deleteRequest(row?.id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "Con diferencia";
      case "2":
        return "Sin diferencia";
    }
  };
  const setEstado = (data) => {
    const varData = [];
    data.map((x) => {
      const aux = _.cloneDeep(x);
      if (x.diferencia) {
        aux.estado = "1";
      } else {
        aux.estado = "2";
      }
      aux.estadoString = verEstado(aux.estado);
      varData.push(aux);
    });
    console.log(varData);
    return varData;
  };
  useEffect(() => {
    if (dobCaniosSubs.length > 0) {
      setDataTable(setEstado(dobCaniosSubs));
    }
  }, [dobCaniosSubs]);
  return (
    <div className="animate__animated animate__fadeInUp">
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Genérico",
            field: "dobMaestroPieza.generico"
          },
          {
            title: "Pieza",
            field: "dobMaestroPieza.articulo"
          },
          {
            title: "LPN",
            field: "lpn"
          },
          {
            title: "Cantidad dobladora",
            field: "cantDob"
          },
          {
            title: "Cantidad soldadura",
            field: "cantSol"
          },
          {
            title: "Diferencia",
            field: "",
            render: (row: IDobCaniosSub) => (
              <>
                <h1>{row.cantSol - row.cantDob}</h1>
              </>
            )
          },
          {
            title: "Estado",
            field: "estado",
            render: (row: IDobCaniosSub) => {
              return verEstado(row.diferencia ? "1" : "2") != "Con diferencia" ? (
                <Tooltip title="No hay diferencia">
                  <Check color="success" />
                </Tooltip>
              ) : (
                <Tooltip title="Hay diferencia">
                  <Cancel color="error" />
                </Tooltip>
              );
            },
            lookup: {
              "1": "Con diferencia",
              "2": "Sin diferencia"
            }
          },
          {
            title: "Fecha",
            field: "",
            render: (row: IDobCaniosSub) => (
              <>
                <h1>{moment(row.createdDate).format("L") + " " + moment(row.createdDate).format("HH:mm")}</h1>
              </>
            )
          },
          {
            title: "OP",
            field: "numeroOP"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <ActionsButtons
                eliminar
                edit
                row={row}
                //onEditProps={setOpenModalSeleccionProduccion}
                onEditProps={onOpenModal}
                onDeleteProps={onDelete}
                disabled={informe}
              />
            )
          }
        ]}
        // rowStyle={(row: IDobCaniosSub) => {
        //   return row.diferencia ? { backgroundColor: "#61D864" } : { backgroundColor: "#FF625B" };
        // }}
        dataInfo={dataTable}
        buscar
        Dense
        agregar={informe ? null : () => setOpenModalAdd(true)}
        filterWithSpecificValues={"Estado"}
        excel
      />
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Modificar Información">
        <GestionCaniosFormModifV3 data={data} refresh={refresh} setModal={setOpenModal} />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalAdd} openPopup={openModalAdd} title="Carga de Información">
        <GestionCaniosFormV3 refresh={refresh} setModal={setOpenModalAdd} />
      </ModalCompoment>
    </div>
  );
};
