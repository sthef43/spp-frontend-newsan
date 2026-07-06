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
import { IndicadoresModeloEXTForm } from "./IndicadoresModeloEXTForm";
interface Props {
  tipoModelo: string;
  tipoUnidad: string;
}
export const IndicadoresModeloEXTTable = ({ tipoModelo, tipoUnidad }: Props) => {
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
            title: "Código modelo unidad exterior",
            field: "codigoModeloExt"
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
            title: "Capacidad refrigeración(en kW)",
            field: "capacidadRefrigeracion"
          },
          {
            title: "Capacidad calefacción(en kW)",
            field: "capacidadCalefaccion"
          },
          {
            title: "Tipo refrigerante",
            field: "tipoRefrigerante"
          },
          {
            title: "Carga refrigerante(en kg)",
            field: "cargaRefrigerante"
          },
          {
            title: "Potencia máx. refrigeración/calefacción(240V/43°C)",
            field: "",
            render: (row) => (
              <div>
                Máx refrigeración:{row?.potenciaMaxRefri}, Máx calefacción:{row?.potenciaMaxCalef}
              </div>
            )
          },
          {
            title: "Potencia(ISO 5151) refrigeración/calefacción",
            field: "",
            render: (row) => (
              <div className="w-full">
                Refrigeración:{row?.potenciaRefrigeracion}, calefacción:{row?.potenciaCalefaccion}
              </div>
            )
          },
          {
            title: "Tipo climático",
            field: "tipoClimatico"
          },
          {
            title: "Corriente rotor bloqueado compresor",
            field: "corrienteRotorBloqCompesor"
          },
          {
            title: "Artefacto clase",
            field: "artefactoBase"
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
            title: "Máxima presión admisible descarga refrigerante(en Mpa)",
            field: "presionDescargaRefrigerante"
          },
          {
            title: "Máxima presión admisible succión refrigerante(en Mpa)",
            field: "presionSuccionRefrigerante"
          },
          {
            title: "Máxima presión admisible intercambiador de calor UI/UE(en Mpa)",
            field: "presionItercambiadorCalor"
          },
          {
            title: "Protección contra humedad",
            field: "proteccionHumedad"
          },
          {
            title: "Tipo de unidad exterior",
            field: "tipoUnidadExt"
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
      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        title="Agregar indicadores de etiqueta de modelo">
        <IndicadoresModeloEXTForm
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
