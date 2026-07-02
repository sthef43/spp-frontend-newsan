/* eslint-disable react/display-name */
import React from "react";

//import MaterialTable from "material-table";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { IControlLoteMateriales } from "app/models";
import { IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ExportExcel } from "../../../../../shared/components/helpComponents/ExportExcel";

interface props {
  materiales: IControlLoteMateriales[];
  refresh: any;
}

export const MateriablesTable = ({ materiales, refresh }: props): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [cargando, setCargando] = React.useState(true);
  const [dataOpen, setDataOpen] = React.useState<IControlLoteMateriales[]>(materiales);

  const deleteRow = async (rowData: any) => {
    let fetchResult;
    try {
      fetchResult = unwrapResult(
        await dispatch(ControlLoteMaterialesSliceRequests.deleteRequest(rowData.idControlLoteMateriales))
      );
    } catch (e) {
      console.log(e);
    }
    if (fetchResult) {
      openNotificationUI("Eliminado exitosamente :)", "success");
      refresh();
    }
  };
  const columns = [
    {
      title: "Modelo",
      field: "codigoModelo"
    },
    {
      title: "Pauta",
      field: "codigoPautas"
    },
    {
      title: "OP",
      field: "numeroOp"
    },
    {
      title: "Cantidad",
      field: "cantidad"
    },
    {
      title: "Descripcion",
      field: "descripcion"
    }
  ];

  React.useEffect(() => {
    setCargando(!cargando);
  }, [dataOpen]);

  React.useEffect(() => {
    setDataOpen(materiales);
  }, [materiales]);

  return (
    <div>
      <ExportExcel title="Materiales no conformes" data={dataOpen} columns={columns} />
      <TableComponent
        IDcolumn={"idControlLoteMateriales"}
        buscar={true}
        columns={[
          ...columns,
          {
            title: "Auditor",
            field: "nombreSupervisor"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          deleteRow(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete fontSize="small" color="error" />
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
    </div>
  );
};
