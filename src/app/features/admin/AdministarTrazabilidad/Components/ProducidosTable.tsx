/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react/display-name */
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import React from "react";
import { IInicio } from "app/models/IInicio";
import { useAppDispatch } from "app/core/store/store";
import { IconButton, Tooltip } from "@mui/material";
import { EditProducidoDialog } from "../Modals/EditProducidoDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { Delete, Edit } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface props {
  inicios: IInicio[];
  fecha: string;
  turno: string;
  codigoInicio: string;
  type: string;
  refresh: any;
}

export const ProducidosTable = ({ inicios, fecha, turno, codigoInicio, type = "N", refresh }: props): JSX.Element => {
  const [selectedProducido, setSelectedProducido] = React.useState<IInicio>(null);
  const [opsDelDia, setOpsDelDia] = React.useState<any>({});
  const [modalEditProducido, setModalEditProducido] = React.useState(false);
  const [opSelect, setOpSelect] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onInit = async () => {
    let fetchOpsDelDiaResult;
    try {
      fetchOpsDelDiaResult = unwrapResult(
        await dispatch(
          InicioSliceRequests.getAllOpsDelDiaRequest({
            fecha: fecha,
            turno: turno,
            codigoInicio: codigoInicio
          })
        )
      );
    } catch (error) {
      fetchOpsDelDiaResult = null;
    }
    if (fetchOpsDelDiaResult) {
      const resx = {};
      fetchOpsDelDiaResult.map((op) => {
        resx[op] = op;
      });
      setOpsDelDia(resx);
      setOpSelect(true);
    }
  };

  //CREO LAS ROWS DE LA TABLA LA PRIMERA VEZ
  // const createData = () => {
  //   return
  //   const varData = [];

  //   inicios.map((ini) => {
  //     // const aux = {
  //     //   ...ini,
  //     //   // codigoModelo: modelos.find((mod: IModelos) => mod.idModelo === ini.idModelo).codigoModelo
  //     //   modeloFin: modelos.find((mod: IModelos) => mod.idModelo === ini.idModelo)?.codigoModelo
  //     // };
  //     varData.push(aux);
  //   });
  //   return varData;
  // };
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const onDelete = async (row: IInicio) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(InicioSliceRequests.deleteRequest(row));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  React.useEffect(() => {
    onInit();
  }, []);

  const setRow = (id: number) => {
    setSelectedProducido(inicios.find((ini: IInicio) => ini.idInicio === id));
    setModalEditProducido(true);
  };

  return (
    <div className="w-full">
      <div className="p-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew shadow-md">
        <div className=" flex justify-center ">
          <TitleUIComponent
            title={`Trazabilidad diaria - Producidos: ${inicios.length}`}
            classNameDiv="w-full whitespace-wrap mx-0"
          />
        </div>
        <TableComponent
          IDcolumn={"idInicio"}
          excel={true}
          columns={[
            {
              title: "Código Trazabilidad",
              field: "codigoTrazabilidad"
            },
            {
              title: "Código NewSan",
              field: "codigoNewsan"
            },
            {
              title: "Hora",
              field: "horaFin"
            },
            {
              title: "Modelo",
              field: "modeloFin"
            },
            {
              title: "Número de OP",
              field: "nroOp",
              lookup: opsDelDia
            },
            {
              title: "Lote",
              field: "lote"
            },
            {
              title: "Target",
              field: "target"
            },
            {
              title: "Nombre fin",
              field: "nombreFin"
            },
            {
              title: "Turno fin",
              field: "turnoFin"
            },
            {
              title: "Acciones",
              field: "",
              render: (rowData: any) =>
                rowData &&
                type == "N" && (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            setRow(rowData?.idInicio);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            onDelete(rowData);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                )
            }
          ]}
          dataInfo={inicios}
          Dense={true}
          Overflow={true}
          filterWithSpecificValues={"Número de OP"}
          //Collapse={true}
          buscar={true}
        />
      </div>
      <ModalCompoment
        title="Edición de trazabilidad"
        openPopup={modalEditProducido}
        setOpenPopup={setModalEditProducido}>
        <EditProducidoDialog numeroEscaneado={selectedProducido} setOpenPopup={setModalEditProducido} />
      </ModalCompoment>
    </div>
  );
};
