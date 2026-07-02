import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasIndicadoresEESliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresEESlice";
import { useAppDispatch } from "app/core/store/store";
import { IEtiquetasIndicadoresEE } from "app/models/IEtiquetasIndicadoresEE";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IndicadoresEEForm } from "./IndicadoresEEForm";
interface Props {
  tipoModelo: string;
}
export const IndicadoresEETable = ({ tipoModelo }: Props) => {
  console.log(tipoModelo);

  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [dataTable, setDataTable] = React.useState<IEtiquetasIndicadoresEE[]>();
  const [dataEdit, setDataEdit] = React.useState<IEtiquetasIndicadoresEE>();
  const getAll = async () => {
    try {
      const response = unwrapResult(await dispatch(EtiquetasIndicadoresEESliceRequests.getAllByTipoM(tipoModelo)));
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
        const response = await dispatch(EtiquetasIndicadoresEESliceRequests.deleteRequest(id));
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
      {tipoModelo == "SP" && (
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
              title: "Logo marca acondicionador de aire",
              field: "marcaAcondicionadorAire"
            },
            {
              title: "Modelo unidad interior",
              field: "modeloInt"
            },
            {
              title: "Modelo unidad exterior",
              field: "modeloExt"
            },
            {
              title: `Modelo Tipo "On-Off" o "Inverter"`,
              field: "modeloTipo"
            },
            {
              title: "Clase de eficiencia energética (modo refrigeración)",
              field: "claseDeEE"
            },
            {
              title: "Índice de Eficiencia Energética Estacional",
              field: "indiceDeEEE"
            },
            {
              title: "Tipo de Prestación del Aparato: Solo Refrigeración",
              field: "tipoPrestacionRefri"
            },
            {
              title: "Tipo de Prestación del Aparato: Refrigeración/Calefacción",
              field: "tipoPrestacionRefriCalor"
            },
            {
              title: "Coeficiente de Performance",
              field: "coeficientePerformane"
            },
            {
              title: "Número de Certificado",
              field: "numCertificado"
            },
            {
              title: "Consumo de Energía Anual(Refriogeración)",
              field: "consumoEAnual"
            },
            {
              title: "Capacidad de Refrigeración",
              field: "capRefri"
            },
            {
              title: "Clase de Eficiencia Energética (Modo Calefacción)",
              field: "claseEE"
            },
            {
              title: "Escala Clase Eficiencia Energética Modo Calefacción",
              field: "escalaClaseEE"
            },
            {
              title: "Consumo de Energía Anual (Calefacción)",
              field: "consumoEAnualCalefaccion"
            },
            {
              title: "Capacidad de Calefacción",
              field: "capCalefaccion"
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
      )}
      {tipoModelo == "VE" && (
        <TableComponent
          columns={[
            {
              title: "Modelo Newsan",
              field: "modeloNewsan"
            },
            {
              title: "Marca",
              field: "marca"
            },
            {
              title: "Logo marca acondicionador de aire",
              field: "marcaAcondicionadorAire"
            },
            {
              title: "Modelo tipo compacto",
              field: "modeloTipoCompacto"
            },
            {
              title: "Clase de eficiencia energética (modo refrigeración)",
              field: "claseDeEE"
            },
            {
              title: "Índice de Eficiencia Energética Estacional",
              field: "indiceDeEEE"
            },
            {
              title: "Tipo de Prestación del Aparato: Solo Refrigeración",
              field: "tipoPrestacionRefri"
            },
            {
              title: "Número de Certificado",
              field: "numCertificado"
            },
            {
              title: "Consumo de Energía Anual(Refriogeración)",
              field: "consumoEAnual"
            },
            {
              title: "Capacidad de Refrigeración",
              field: "capRefri"
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
      )}
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Agregar indicadores de etiqueta de caja">
        <IndicadoresEEForm tipoModelo={tipoModelo} dataEdit={dataEdit} setOpenModal={setOpenModal} refresh={getAll} />
      </ModalCompoment>
    </div>
  );
};
