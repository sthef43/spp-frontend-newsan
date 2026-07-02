/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Cancel, Print } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCPaletPrint } from "app/models/IOQCPaletPrint";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../../shared/components/Table/TableComponent";
import { IconButton, Tooltip } from "@mui/material";
import moment from "moment";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { ModalCompoment } from "../../../../../../../shared/components/ModalComponent";
import { OQCPaletPrint } from "../../../global/modals/OQCPaletPrint";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCPaletPrintSliceRequests, oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
interface IOQCPaletPrintTable {
  closeModal: (state: boolean) => void;
}
export const OQCPaletPrintTable = ({ closeModal }: IOQCPaletPrintTable): JSX.Element => {
  const paletsPrints = useAppSelector<IOQCPaletPrint[]>((state) => state.oqcPaletPrint.dataAll);
  const paletSeleccionado = useAppSelector<IOQCPalet>((state) => state.oqcPalet.object);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openModalReimpresion, setOpenModalReimpresion] = useState(false);
  const [estadoReimpresion, setEstadoReimpresion] = useState(false);

  const onCanceled = async (paletPrint: IOQCPaletPrint) => {
    try {
      if (await getConfirmation("Dar de baja OQC", "Esta seguro de dar de baja el resultado del oqc")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const operator = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0)));
        const objectSubmit = { ...paletPrint, operatorCanceledId: operator.id, canceled: true };
        delete objectSubmit.operator;
        delete objectSubmit.oqcPalet;
        delete objectSubmit.operatorCanceled;
        delete objectSubmit.turno;
        await dispatch(OQCPaletPrintSliceRequests.PutRequest(objectSubmit));
        await dispatch(OQCPaletPrintSliceRequests.getAllByPalet(objectSubmit.oqcPaletId));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const [ultimaMuestraOQC, setUltimaMuestraOQC] = useState<IOQCDesignadaResultado>();
  const getLastMuestra = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseLastOQC = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getLastReportByPalletId(paletSeleccionado.id))
      );
      if (responseLastOQC) {
        setUltimaMuestraOQC(responseLastOQC);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const nuevaReimpresion = (rowData: IOQCPaletPrint) => {
    dispatch(oqcPaletPrintSlice.actions.setObject(rowData));
    setEstadoReimpresion(rowData.ticketConforme);
    setOpenModalReimpresion(true);
  };

  useEffect(() => {
    getLastMuestra();
  }, []);

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[90vw]">
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          IDcolumn="id"
          Dense
          columns={[
            {
              title: "Supervisor",
              field: "supervisor"
            },
            {
              title: "Motivo de rechazo",
              field: "motivoRechazo"
            },
            {
              title: "Número de OP",
              field: "numOp"
            },
            {
              title: "Número Desde",
              field: "numDesde"
            },
            {
              title: "Número Hasta",
              field: "numHasta"
            },
            {
              title: "Total",
              field: "total"
            },
            {
              title: "Master boxes",
              field: "masterBox"
            },
            {
              title: "Fecha",
              field: "",
              render: (row) => <>{moment(row.createdDate).format("L")}</>
            },
            {
              title: "Cancelado",
              field: "",
              render: (row) => (row.canceled ? "Si" : "No")
            },
            {
              title: "Estado Ticket",
              field: "",
              render: (row: IOQCPaletPrint) => (row.ticketConforme ? "CONFORME" : "NO CONFORME")
            },
            {
              title: "Usuario que cancelo",
              field: "",
              render: (row: IOQCPaletPrint) =>
                row.operatorCanceledId && row.operatorCanceled.name + " " + row.operatorCanceled.surname
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IOQCPaletPrint) => (
                <>
                  <Tooltip title="Dar de baja" onClick={() => onCanceled(row)}>
                    <IconButton color="error" disabled={row.canceled}>
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reimprimir" onClick={() => nuevaReimpresion(row)}>
                    <IconButton color="primary" disabled={row.canceled}>
                      <Print />
                    </IconButton>
                  </Tooltip>
                </>
              )
            }
          ]}
          rowStyle={(rowData: IOQCPaletPrint) => {
            switch (rowData.canceled) {
              case true:
                return { padding: 1, backgroundColor: "#fd5d60d6", fontSize: 14 };
              default:
                return { padding: 1, fontSize: 14 };
            }
          }}
          buscar
          dataInfo={paletsPrints}
        />
        {/* Modal para reimpresion */}
        <ModalCompoment
          openPopup={openModalReimpresion}
          setOpenPopup={setOpenModalReimpresion}
          title="Imprimir Ticket Reproceso">
          <OQCPaletPrint
            ultimaMuestraOQC={ultimaMuestraOQC}
            reimpresion={true}
            closeModal={setOpenModalReimpresion}
            estadoReimpresion={estadoReimpresion}
          />
        </ModalCompoment>
        {/* Modal para reimpresion */}
      </ContainerForPages>
    </ContainerForPages>
  );
};
