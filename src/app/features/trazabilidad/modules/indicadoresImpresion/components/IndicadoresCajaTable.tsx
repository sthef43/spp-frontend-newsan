import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasIndicadoresCajaSliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresCajaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IEtiquetasIndicadoresCaja } from "app/models/IEtiquetasIndicadoresCaja";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IndicadoresCajaForm } from "./IndicadoresCajaForm";

interface Props {
  tipoModelo: string;
}
export const IndicadoresCajaTable = ({ tipoModelo }: Props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [dataTable, setDataTable] = React.useState<IEtiquetasIndicadoresCaja[]>();
  const [dataEdit, setDataEdit] = React.useState<IEtiquetasIndicadoresCaja>();
  const getAll = async () => {
    try {
      const response = unwrapResult(await dispatch(EtiquetasIndicadoresCajaSliceRequests.getAllByTipoM(tipoModelo)));
      setDataTable(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleEdit = (data) => {
    setDataEdit(data);
    setOpenModal(true);
  };
  const handleDelete = async (id) => {
    try {
      const confirm = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar los datos?");
      if (confirm) {
        const response = await dispatch(EtiquetasIndicadoresCajaSliceRequests.deleteRequest(id));
        openNotificationUI("Se elimino correctamente", "success");
        getAll();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  React.useEffect(() => {
    getAll();
  }, [tipoModelo]);

  return (
    <div className="p-3 mb-3">
      <TableComponent
        columns={[
          {
            title: "Código del set",
            field: "codigoDelSet"
          },
          {
            title: "Marca",
            field: "marca"
          },
          {
            title: "Código del modelo",
            field: "codigoEBS"
          },
          {
            title: "Capacidad en frio o frio calor",
            field: "capacidadFoC"
          },
          {
            title: "Descripción de unidad",
            field: "descripcion"
          },
          {
            title: "Código de barra EAN13(Serial Number LG)",
            field: "codSerialNumberLG"
          },
          {
            title: "Número serial number LG",
            field: "serialNumberLG"
          },
          {
            title: "Código de barrar EAN13(LOGICO)",
            field: "codigoBarraFisico"
          },
          {
            title: "Número EAN13 (LOGICO)",
            field: "numeroEan13Logico"
          },
          {
            title: "Código de barra EAN13(FISICO)",
            field: "codigoBarraFisico"
          },
          {
            title: "Número EAN13(FISICO)",
            field: "numeroEan13Fisico"
          },
          {
            title: "Apilado",
            field: "apilado"
          },
          {
            title: "Dimensiones(ANCHO/ALTO/PROF) mm",
            field: "dimensiones"
          },
          {
            title: "Peso neto",
            field: "pesoNeto"
          },
          {
            title: "Código del modelo",
            field: "codigoEBS"
          },
          {
            title: "Descripción de unidad",
            field: "descripcion"
          },
          {
            title: "Código de barra EAN13(FISICO)",
            field: "codigoBarraFisico"
          },
          {
            title: "Número EAN13(FISICO)",
            field: "numeroEan13Fisico"
          },
          {
            title: "Leyenda legal(FABR.-DIST.-GAR.)",
            field: "leyendaLegal"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          handleEdit(row);
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
                          handleDelete(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={(row) => {
          setDataEdit(null);
          setOpenModal(true);
        }}
        dataInfo={dataTable}
        buscar
        Dense
        IDcolumn={"Id"}
      />
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Agregar indicadores de etiqueta de caja">
        <IndicadoresCajaForm tipoModelo={tipoModelo} setOpenModal={setOpenModal} dataEdit={dataEdit} refresh={getAll} />
      </ModalCompoment>
    </div>
  );
};
