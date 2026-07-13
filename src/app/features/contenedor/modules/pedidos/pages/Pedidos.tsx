import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ContEmbarqueSliceRequests } from "app/Middleware/reducers/ContEmbarqueSlice";
import { ContPlanProduccionSliceRequests } from "app/Middleware/reducers/ContPlanProduccionSlice";
import { ContPlantaSliceRequests } from "app/Middleware/reducers/ContPlantaSlice";
import { IContEmbarque } from "app/models/IContEmbarque";
import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { IContPlanta } from "app/models/IContPlanta";
import { IContContenedor } from "app/models/IContContenedor";
import { ModalComponent } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { PedidosForm } from "app/features/contenedor/modules/pedidos/modals/PedidosForm";
import FetchApi from "app/shared/helpers/FetchApi";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import moment from "moment";
import { EmbarqueForm } from "../modals/EmbarqueForm";
import { VerContenedores } from "../modals/VerContenedores";
import { ExtraModulesCollapseEmbarque } from "../components/ExtraModulesCollapseEmbarque";

interface PedidosFormValues {
  plantas: string;
  lineas: string;
}

const defaultFormValues: PedidosFormValues = {
  plantas: "",
  lineas: ""
};

export const Pedidos = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut, FetchDelete } = useFetchApiMultiResults<any>();

  const { control, watch } = useForm<PedidosFormValues>({
    defaultValues: defaultFormValues
  });

  const watchPlantaId = watch("plantas");
  const watchLineaId = watch("lineas");

  const [listLineas, setListLineas] = useState<{ linea: string }[]>([]);
  const [listContPlanProduccion, setContPlanProduccion] = useState<IContPlanProduccion[]>([]);
  const [listPlantas, setListPlantas] = useState<IContPlanta[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  FetchApi<IContPlanta[]>(
    ContPlantaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => setListPlantas(data ?? [])
  );

  const plantIdParsed = watchPlantaId ? parseInt(watchPlantaId, 10) : null;

  FetchApi<IContPlanProduccion[]>(
    ContPlanProduccionSliceRequests.getListByPlantaIdRequest,
    plantIdParsed,
    false,
    plantIdParsed,
    (data) => {
      setListLineas(
        Array.from(new Set((data ?? []).map((o) => o.linea))).map((linea) => ({ linea }))
      );
    },
    true
  );

  const lineasParams = plantIdParsed ? { contPlantaId: plantIdParsed, linea: watchLineaId } : null;
  const planActivator = watchLineaId ? `${watchLineaId}-${refreshKey}` : null;

  FetchApi<IContPlanProduccion[]>(
    ContPlanProduccionSliceRequests.getListByPlantaLineaIdRequest,
    lineasParams,
    false,
    planActivator,
    (data) => setContPlanProduccion(data ?? []),
    true
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    setContPlanProduccion([]);
  }, [watchPlantaId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeletePlan = useCallback(async (row: any) => {
    await FetchDelete({
      sliceRequest: ContPlanProduccionSliceRequests.deleteRequest,
      deleteId: row.id,
      consoleLog: false,
      mensajePersonalizado: true,
      titleUser: "Borrar Línea de Plan de Producción",
      messageUser: "Esta seguro que quiere eliminar?",
      functionAdd: () => {
        openNotificationUI("Eliminado...", "success");
        handleRefresh();
      }
    });
  }, [FetchDelete, handleRefresh]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteEmbarque = useCallback(async (row: any) => {
    await FetchDelete({
      sliceRequest: ContEmbarqueSliceRequests.deleteRequest,
      deleteId: row.id,
      consoleLog: false,
      mensajePersonalizado: true,
      titleUser: "Borrar Embarque de Línea de Plan de Producción",
      messageUser: "Esta seguro que quiere eliminar?",
      functionAdd: () => {
        openNotificationUI("Eliminado...", "success");
        handleRefresh();
      }
    });
  }, [FetchDelete, handleRefresh]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEndPlan = useCallback(async (row: any) => {
    const modiFin = {
      ...row,
      abierto: false,
      contPlanta: null,
      contEmbarque: null
    };

    await FetchPut({
      sliceRequest: ContPlanProduccionSliceRequests.PutRequest,
      modelPut: modiFin,
      consoleLog: false,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "FINALIZAR",
      messageUser: "Esta seguro que quiere finalizar Línea de Plan de Producción?",
      functionAdd: () => {
        openNotificationUI("Actualización Finalizada...", "success");
        handleRefresh();
      }
    });
  }, [FetchPut, handleRefresh]);

  const [editState, setEditState] = useState<IContPlanProduccion | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditar = useCallback((rowData: any) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exportToExcel = useCallback((): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flattenedData: any[] = [];
    listContPlanProduccion.forEach((plan) => {
      let flattenedItem: Record<string, unknown> = {
        Planta: plan.contPlanta?.nombre,
        LineaExcel: plan.lineaExcel,
        Linea: plan.linea,
        Modelo: plan.modelo,
        Lote: plan.lote,
        Cantidad: plan.cantidad,
        PO: plan.po,
        Embarque: null,
        Número: null,
        Lpn: null,
        Tipo: null,
        Código: null,
        Descripción: null,
        CantidadLPN: null,
        Prioridad: null,
        DetallePlanta: null,
        DetalleContenedor: null,
        Estado: null,
        Ubicacion: null,
        Observacion: null,
        Programado: null,
        Entregado: null
      };
      if (!plan.contEmbarque || plan.contEmbarque.length === 0) {
        flattenedData.push(flattenedItem);
      } else {
        plan.contEmbarque.forEach((embarque) => {
          flattenedItem = {
            ...flattenedItem,
            Embarque: embarque.detalle,
            Número: embarque.numero,
            Lpn: null,
            Tipo: null,
            Código: null,
            Descripción: null,
            CantidadLPN: null,
            Prioridad: null,
            DetallePlanta: null,
            DetalleContenedor: null,
            Estado: null,
            Ubicacion: null,
            Observacion: null,
            Programado: null,
            Entregado: null
          };
          if (!embarque.contContenedor || embarque.contContenedor.length === 0) {
            flattenedData.push(flattenedItem);
          } else {
            embarque.contContenedor.forEach((contenedor: IContContenedor) => {
              flattenedItem = {
                ...flattenedItem,
                Lpn: contenedor.lpn,
                Tipo: contenedor.tipo,
                Código: contenedor.codigo,
                Descripción: contenedor.descripcion,
                CantidadLPN: contenedor.cantidad,
                Prioridad: contenedor.prioridad,
                DetallePlanta: contenedor.contPlantaDetalle?.detalle,
                DetalleContenedor: contenedor.contDetalleContenedor?.detalle,
                Estado: contenedor.contEstado?.detalle,
                Ubicacion: contenedor.contUbicacion?.detalle,
                Observacion: contenedor.contObservacion?.observacion,
                Programado: contenedor.fechaProgramado ? moment(contenedor.fechaProgramado).format("L") : null,
                Entregado: contenedor.fechaEntregado ? moment(contenedor.fechaEntregado).format("L") : null
              };
              flattenedData.push(flattenedItem);
            });
          }
        });
      }
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "SPP-PedidosContenedores.xlsx";

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }, [listContPlanProduccion]);

  const [estaEditandoEmbarque, setEstaEditandoEmbarque] = useState(false);
  const [editStateEmbarque, setEditStateEmbarque] = useState<IContEmbarque | null>(null);
  const [ModalOpenEmbarque, setModalOpenEmbarque] = useState(false);

  const handleEditarEmbarque = useCallback((embarque: IContEmbarque) => {
    setEditStateEmbarque(embarque);
    setEstaEditandoEmbarque(true);
    setModalOpenEmbarque(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAgregarEmbarque = useCallback((plan: any) => {
    setEditStateEmbarque(plan as IContEmbarque);
    setEstaEditandoEmbarque(false);
    setModalOpenEmbarque(true);
  }, []);

  const [openContenedores, setOpenContenedores] = useState(false);
  const [Embarque, setEmbarque] = useState<IContEmbarque>({} as IContEmbarque);

  const handleVerContenedores = useCallback((embarque: IContEmbarque) => {
    setOpenContenedores(true);
    setEmbarque(embarque);
  }, []);

  const collapseRender = useCallback(
    ({ row }: { row: IContPlanProduccion }) => (
      <ExtraModulesCollapseEmbarque
        row={row}
        onEditarEmbarque={handleEditarEmbarque}
        onEliminarEmbarque={handleDeleteEmbarque}
        onAgregarEmbarque={handleAgregarEmbarque}
        onVerContenedores={handleVerContenedores}
      />
    ),
    [handleEditarEmbarque, handleDeleteEmbarque, handleAgregarEmbarque, handleVerContenedores]
  );

  useEffect(() => {
    TitleChanger("PEDIDOS");
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full">
          <SelectComponentForm
            name="plantas"
            control={control}
            listItems={listPlantas}
            valueLabel={(item) => item.nombre ?? ""}
            valueSelect={(item) => item.id}
            label="Planta"
            variant="standard"
            rules={{ required: "Planta es requerida" }}
          />
        </div>
        {listLineas.length > 0 && (
          <div className="w-full">
            <SelectComponentForm
              name="lineas"
              control={control}
              listItems={listLineas}
              valueLabel={(item) => item.linea}
              valueSelect={(item) => item.linea}
              label="Línea"
              variant="standard"
              rules={{ required: "Línea es requerida" }}
            />
          </div>
        )}
        {listContPlanProduccion.length > 0 && (
          <div className="text-center">
            <Button className={classes.blueButton} variant="contained" onClick={exportToExcel}>
              Exportar a excel
            </Button>
          </div>
        )}
      </ContainerForPages>

      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Id Excel",
              field: "lineaExcel"
            },
            {
              title: "Línea",
              field: "linea"
            },
            {
              title: "Modelo",
              field: "modelo"
            },
            {
              title: "Lote",
              field: "lote"
            },
            {
              title: "Cantidad",
              field: "cantidad"
            },
            {
              title: "PO",
              field: "po"
            },
            {
              title: "Acciones",
              field: "",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render: (row: any) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Finalizar">
                        <IconButton
                          onClick={() => { handleEndPlan(row); }}
                          size="small"
                          className="relative">
                          <CheckCircle color="success" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => { handleEditar(row); }}
                          size="small"
                          className="relative">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => { handleDeletePlan(row); }}
                          size="small"
                          className="relative">
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
            setEstaEditando(false);
            setEditState(null);
            setModalOpen(true);
          }}
          dataInfo={listContPlanProduccion}
          Collapse
          CollapseExtraModulesBefore={collapseRender}
        />
      </ContainerForPages>

      <ModalComponent title="Nueva Línea de Plan de Producción" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <PedidosForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={handleRefresh}
          estaEditando={estaEditando}
        />
      </ModalComponent>

      <ModalComponent title="Nuevo Embarque" openPopup={ModalOpenEmbarque} setOpenPopup={setModalOpenEmbarque}>
        <EmbarqueForm
          setOpenPopup={setModalOpenEmbarque}
          editStateEmbarque={editStateEmbarque}
          refresh={handleRefresh}
          estaEditandoEmbarque={estaEditandoEmbarque}
        />
      </ModalComponent>

      <ModalComponent title="Ver Contenedores" openPopup={openContenedores} setOpenPopup={setOpenContenedores}>
        <VerContenedores setOpenPopup={setOpenContenedores} row={Embarque} refresh={handleRefresh} />
      </ModalComponent>
    </ContainerForPages>
  );
};
