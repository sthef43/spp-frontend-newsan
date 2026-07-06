import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasIndicadoresModeloSliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresModeloSlice";
import { useAppDispatch } from "app/core/store/store";
import { IEtiquetasIndicadoresModelo } from "app/models/IEtiquetasIndicadoresModelo";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { IndicadoresModeloINTForm } from "./IndicadoresModeloINTForm";
interface Props {
  tipoModelo: string;
  tipoUnidad: string;
}
export const IndicadoresModeloINTTable = ({ tipoModelo, tipoUnidad }: Props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [dataTable, setDataTable] = React.useState<IEtiquetasIndicadoresModelo[]>();
  const [dataEdit, setDataEdit] = React.useState<IEtiquetasIndicadoresModelo>();
  const getAll = async () => {
    try {
      const response = unwrapResult(
        await dispatch(EtiquetasIndicadoresModeloSliceRequests.getAllByTipoM({ tipoM: tipoModelo, tipoU: tipoUnidad }))
      );
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
        const response = await dispatch(EtiquetasIndicadoresModeloSliceRequests.deleteRequest(id));
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
            title: "Modelo Newsan",
            field: "codigoEBS"
          },
          {
            title: "Marca",
            field: "marca"
          },
          {
            title: "Logo marca",
            field: "logoMarca"
          },
          {
            title: "Código modelo unidad interior",
            field: "codigoModeloInt"
          },
          {
            title: "Tipo de unidad interior",
            field: "tipoUnidadInt"
          },
          {
            title: "Capacidad refrigeración(en kW)",
            field: "capacidadRefrigeracion"
          },
          {
            title: "Capacidad calefacción(en kW)",
            field: "capacidadCalefaccion"
          },
          {
            title: "Potencia máx. refrigeración (240V/43°C)",
            field: "potenciaMaxRefri"
          },
          {
            title: "Potencia máx. calefacción (240V/43°C)",
            field: "potenciaMaxCalef"
          },
          {
            title: "Potencia refrigeración(ISO 5151)",
            field: "potenciaRefrigeracion"
          },
          {
            title: "Potencia calefacción(ISO 5151)",
            field: "potenciaCalefaccion"
          },
          {
            title: "Circulación de aire (en m³/h)",
            field: "circulacionAire"
          },
          {
            title: "Tensión nominal",
            field: "tensionNominal"
          },
          {
            title: "Frecuencia nominal",
            field: "frecuenciaNominal"
          },
          {
            title: "Valor fusible en PCB",
            field: "valorFusible"
          },
          {
            title: "Peso neto",
            field: "pesoNeto"
          },
          {
            title: "Nivel de ruido",
            field: "nivelRuido"
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
        <IndicadoresModeloINTForm
          tipoModelo={tipoModelo}
          tipoUnidad={tipoUnidad}
          setOpenModal={setOpenModal}
          dataEdit={dataEdit}
          refresh={getAll}
        />
      </ModalCompoment>
    </div>
  );
};
