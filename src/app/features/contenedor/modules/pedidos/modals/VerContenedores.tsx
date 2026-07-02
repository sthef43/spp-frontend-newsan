import { Alarm, ArrowUpward, AssignmentOutlined, Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContContenedorSliceRequests } from "app/Middleware/reducers/ContContenedorSlice";
import { useAppDispatch } from "app/core/store/store";
import { IContContenedor } from "app/models/IContContenedor";
import { IContEmbarque } from "app/models/IContEmbarque";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ContenedorForm } from "app/features/contenedor/modules/pedidos/modals/ContenedorForm";
import { HistorialContenedorForm } from "app/features/contenedor/modules/pedidos/modals/HistorialContenedorForm";
import { PlanificacionForm } from "app/features/contenedor/modules/pedidos/modals/PlanificacionForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
interface IVerContenedores {
  setOpenPopup: any;
  row: IContEmbarque;
  refresh?: any;
}
export const VerContenedores = ({ setOpenPopup, row, refresh }: IVerContenedores): JSX.Element => {
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [Embarque, setEmbarque] = useState<IContEmbarque>({} as IContEmbarque);

  // Editar y Agregar Contenedores
  const [editStateContenedor, setEditStateContenedor] = useState<IContContenedor | null>(null);
  const [estaEditandoContenedor, setEstaEditandoContenedor] = useState(false);
  const [ModalOpenContenedor, setModalOpenContenedor] = useState(false);
  const editarContenedor = (rowData) => {
    setEditStateContenedor({ ...rowData });
    setEstaEditandoContenedor(true);
    setModalOpenContenedor(true);
  };
  const agregarContenedor = (rowData) => {
    setEditStateContenedor({ ...rowData });
    setEstaEditandoContenedor(false);
    setModalOpenContenedor(true);
  };

  // Historial Contenedores
  const [stateHistorial, setStateHistorial] = useState(null);
  const [ModalOpenHistorial, setModalOpenHistorial] = useState(false);
  const historial = (rowData) => {
    setStateHistorial(rowData.id);
    setModalOpenHistorial(true);
  };

  //Editar Programados
  const [editStateProgramar, setEditStateProgramar] = useState<IContContenedor | null>(null);
  const [ModalOpenProgramar, setModalOpenProgramar] = useState(false);
  const programar = (rowData) => {
    setEditStateProgramar({ ...rowData });
    setModalOpenProgramar(true);
  };

  // Eliminar Contenedor
  const deleteContContenedor = async (row) => {
    const resp = await getConfirmation("Borrar Contenedor de Embarque", "Esta seguro que quiere eliminar?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(ContContenedorSliceRequests.deleteRequest(row.id)));
        if (response) {
          openNotificationUI("Eliminado...", "success");
          refresh();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  // Leer Contenedores
  const [getPrioridad, setPrioridad] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const getContenedor = async () => {
    if (Embarque.id) {
      try {
        const response = unwrapResult(
          await dispatch(ContContenedorSliceRequests.getListByEmbarqueIdRequest(Embarque.id))
        );
        setDataTable(response);
      } catch (error) {
        openNotificationUI("Error al leer.", "error");
      }
    }
  };

  useEffect(() => {
    setPrioridad(dataTable.length);
  }, [dataTable]);

  const getRefresh = async () => {
    refresh();
  };

  useEffect(() => {
    if (row) {
      setEmbarque(row);
    }
  }, [row]);

  useEffect(() => {
    if (Embarque) {
      getContenedor();
    }
  }, [Embarque]);

  //PRIORIDAD
  const [objetosPrioridad, setObjetosPrioridad] = useState([]);
  const subirPrioridad = async (e) => {
    //Fila actual
    if (e.prioridad > 1) {
      // setObjetosPrioridad(null);
      //Fila actual
      const filaActual = {
        ...e,
        contEmbarque: null,
        prioridad: e.prioridad - 1,
        contPlantaDetalle: null,
        contDetalleContenedor: null,
        contEstado: null,
        contUbicacion: null,
        contObservacion: null
      };
      //Fila anterior
      const buscaAnterior = dataTable.find((x) => x.prioridad === e.prioridad - 1);
      const filaAnterior = {
        ...buscaAnterior,
        contEmbarque: null,
        prioridad: buscaAnterior.prioridad + 1,
        contPlantaDetalle: null,
        contDetalleContenedor: null,
        contEstado: null,
        contUbicacion: null,
        contObservacion: null
      };
      const arr = [];
      arr.push(filaActual);
      arr.push(filaAnterior);
      setObjetosPrioridad(arr);
    }
  };
  const modificarPrioridadContenedor = async () => {
    let result;
    try {
      result = unwrapResult(await dispatch(ContContenedorSliceRequests.multiPutRequest(objetosPrioridad)));
      // console.log("Objetos Prioridad se actualiza");
      // openNotificationUI("Actualización finalizada.", "success");
      getContenedor();
    } catch (x) {
      openNotificationUI("Error al actualizar.", "error");
      result = null;
    }
  };
  useEffect(() => {
    if (objetosPrioridad) {
      modificarPrioridadContenedor();
    }
  }, [objetosPrioridad]);

  return (
    <div>
      {/* <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew"> */}
      <TableComponent
        Dense={true}
        // Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Prioridad",
            field: "prioridad"
          },
          {
            title: "Subir",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Subir Prioridad">
                      <IconButton
                        onClick={() => {
                          subirPrioridad(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <ArrowUpward color="success" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          },
          {
            title: "LPN",
            field: "lpn"
          },
          {
            title: "Estado",
            field: "contEstado.detalle"
          },
          {
            title: "Programado",
            field: "",
            render: (row) => {
              return moment(row?.fechaProgramado).format("L");
            }
          },
          {
            title: "Entrega",
            field: "",
            render: (row) => {
              return moment(row?.fechaEntregado).format("L");
            }
          },
          {
            title: "Tipo",
            field: "tipo"
          },
          {
            title: "Código",
            field: "codigo"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Detalle Planta",
            field: "contPlantaDetalle.detalle"
          },
          {
            title: "Detalle Contenedor",
            field: "contDetalleContenedor.detalle"
          },
          {
            title: "Ubicación",
            field: "contUbicacion.detalle"
          },
          {
            title: "Observación",
            field: "contObservacion.observacion"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar Contenedor">
                      <IconButton
                        onClick={() => {
                          editarContenedor(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Programar">
                      <IconButton
                        onClick={() => {
                          programar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Alarm color="success" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Historial">
                      <IconButton
                        onClick={() => {
                          historial(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <AssignmentOutlined color="primary" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          deleteContContenedor(row);
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
        agregar={() => {
          agregarContenedor(row);
        }}
        dataInfo={dataTable}
      />
      <ModalCompoment title="Nuevo Contenedor" openPopup={ModalOpenContenedor} setOpenPopup={setModalOpenContenedor}>
        <ContenedorForm
          setOpenPopup={setModalOpenContenedor}
          editStateContenedor={editStateContenedor}
          getPrioridad={getPrioridad}
          refresh={getContenedor}
          refresh2={getRefresh}
          estaEditandoContenedor={estaEditandoContenedor}
        />
      </ModalCompoment>
      <ModalCompoment title="Programar Contenedor" openPopup={ModalOpenProgramar} setOpenPopup={setModalOpenProgramar}>
        <PlanificacionForm
          setOpenPopup={setModalOpenProgramar}
          editStateContenedor={editStateProgramar}
          refresh={getContenedor}
          refresh2={getRefresh}
        />
      </ModalCompoment>

      <ModalCompoment title="Historial Contenedor" openPopup={ModalOpenHistorial} setOpenPopup={setModalOpenHistorial}>
        <HistorialContenedorForm setOpenPopup={setModalOpenHistorial} stateHistorial={stateHistorial} />
      </ModalCompoment>

      {/* </div> */}
    </div>
  );
};
