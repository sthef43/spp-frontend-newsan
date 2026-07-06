/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { DeleteRounded, EditRounded, PrintRounded } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RangoRechazosModal } from "../Modals/RangoRechazosModal";
import { NoConformePDFImpresion } from "../Components/NoConformePDFImpresion";
import FetchApi from "app/shared/helpers/FetchApi";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import { RechazoDobladoraSliceRequest } from "../Middleware/RechazoDobladoraSlice";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { useReactToPrint } from "react-to-print";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

/**
 * Componente principal para la gestión de "Carga No Conforme de Caños".
 * Permite listar, agregar, editar, eliminar e imprimir reportes de rechazos.
 */
export const CargaNoConformeCanios = () => {
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  // Hooks personalizados para UI y utilidades
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { FetchDelete } = useFetchApiMultiResults();

  // Estados para el control del modal de Edición/Creación
  const [openModalEditAdd, setOpenModalEditAdd] = useState<boolean>(false);
  const [activarEdicion, setActivarEdicion] = useState<boolean>(false);

  // Estados para almacenar el rechazo seleccionado (edición) y el objeto a imprimir
  const [rechazoSeleccionado, setRechazoSeleccionado] = useState<IRechazoDobladora>();
  const [rechazoParaImprimir, setRechazoParaImprimir] = useState<IRechazoDobladora>();

  // Estados para el filtro de fechas
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  // Estados para el control de la carga de datos (Fetch) y la lista de resultados
  const [activarFetch, setActivarFetch] = useState<boolean>(false);
  const [listaRechazos, setListaRechazos] = useState<IRechazoDobladora[]>([]);

  // Referencia para el componente de impresión
  const componenteRef = useRef();

  // Hook personalizado para obtener la lista de rechazos según las fechas seleccionadas
  FetchApi<IRechazoDobladora[]>(
    RechazoDobladoraSliceRequest.GetAllRejectionByDates,
    { fechaDesde: fechaDesde, fechaHasta: fechaHasta },
    false, // No mostrar el resultado por consola
    activarFetch, // Trigger para ejecutar la búsqueda
    setListaRechazos, // Setter para guardar los datos
    true, // Solo si el trigger es true se ejecuta
    false, // No mostrar skeleton de carga
    true, // Mostar el loader mientras se ejecuta el fetch
    () => setActivarFetch(false) // Callback que se ejecuta al finalizar la operación
  );

  /**
   * Maneja la eliminación de un rechazo.
   * Utiliza FetchDelete para mostrar confirmación y ejecutar la baja lógica/física.
   * @param row Elemento a eliminar
   */
  const handleDelete = async (row: IRechazoDobladora) => {
    FetchDelete({
      consoleLog: false,
      deleteId: row.id,
      sliceRequest: RechazoDobladoraSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "Se eliminara el rechazo seleccionado, ¿desea continuar?",
      titleUser: "Eliminar Rechazo",
      functionAdd: () => {
        openNotificationUI("Se elimino el rechazo con exito", "success");
        setActivarFetch(true); // Recargar la lista
      }
    });
  };

  /**
   * Abre el modal en modo "Agregar".
   * Resetea el rechazo seleccionado y desactiva la bandera de edición.
   */
  const handelOpenModalAdd = () => {
    setActivarEdicion(false);
    setRechazoSeleccionado(null);
    setOpenModalEditAdd(true);
  };

  /**
   * Abre el modal en modo "Editar".
   * @param rechazo El objeto rechazo que se va a editar.
   */
  const handleOpenModalEditAdd = (rechazo: IRechazoDobladora) => {
    setRechazoSeleccionado(rechazo);
    setActivarEdicion(true);
    setOpenModalEditAdd(true);
  };

  /**
   * Obtiene los datos completos del rechazo por ID y prepara la impresión.
   * @param row El rechazo seleccionado de la tabla.
   */
  const handleImprimir = async (row: IRechazoDobladora) => {
    const response = unwrapResult(await dispatch(RechazoDobladoraSliceRequest.GetRejectionById(row.id)));
    if (response) {
      setRechazoParaImprimir(response);
      configurarImpresion();
    }
  };

  /**
   * Configuración de la funcionalidad de impresión (react-to-print).
   * Imprime el contenido referenciado por `componenteRef`.
   */
  const configurarImpresion = useReactToPrint({
    content: () => componenteRef.current,
    documentTitle: `Hoja de rechazo`,
    copyStyles: true
  });

  // Efecto para actualizar el título y recargar datos cuando cambian las fechas (con debounce)
  useEffect(() => {
    TitleChanger("Carga No Conforme Caños");
    const handler = setTimeout(() => {
      setActivarFetch(true);
    }, 500);
    return () => clearTimeout(handler);
  }, [fechaDesde, fechaHasta]);

  return (
    <ContainerForPages optionsLayout="page">
      <header className="flex flex-row items-center gap-x-4">
        <ContainerForPages optionsLayout="Selects">
          <SelectOfDate fechaDesdeHasta setFechaDesdeProps={setFechaDesde} setFechaHastaProps={setFechaHasta} />
        </ContainerForPages>
        <Button className={buttonClases.blueButton} onClick={() => setActivarFetch(true)} variant="contained">
          Buscar
        </Button>
      </header>
      {listaRechazos && listaRechazos.length > 0 && rechazoParaImprimir && (
        <div className="my-4">
          <div ref={componenteRef} className="hidden print:block">
            <NoConformePDFImpresion componentRef={componenteRef} datosNoConforme={rechazoParaImprimir} />
          </div>
        </div>
      )}
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          IDcolumn="id"
          buscar
          agregar={() => handelOpenModalAdd()}
          dataInfo={listaRechazos}
          columns={[
            {
              title: "Pieza",
              field: "articulo"
            },
            {
              title: "Familia",
              field: "familia"
            },
            {
              title: "Cantidad Rechazada",
              field: "cantidadRechazada"
            },
            {
              title: "Acción de Contención",
              field: "accionContencion"
            },
            {
              title: "Acción Correctiva",
              field: "accionCorrectiva"
            },

            {
              title: "Fecha Rechazo",
              field: "",
              render: (row) =>
                formatDateHourOrMinutes({
                  optionDate: "fullDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: row.createdDate
                })
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => (
                <div className="flex flex-row items-center">
                  <TooltipComponent
                    onClick={() => handleImprimir(row)}
                    titleTooltip="Imprimir Hoja de Rechazo"
                    typeTooltip="normal"
                    componenteIcono={<PrintRounded color="primary" />}
                  />
                  <TooltipComponent
                    onClick={() => handleOpenModalEditAdd(row)}
                    titleTooltip="Editar Rechazo"
                    typeTooltip="normal"
                    componenteIcono={<EditRounded color="action" />}
                  />
                  <TooltipComponent
                    onClick={() => handleDelete(row)}
                    titleTooltip="Eliminar Rechazo"
                    typeTooltip="normal"
                    componenteIcono={<DeleteRounded color="error" />}
                  />
                </div>
              )
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        onCloseDynamic
        openPopup={openModalEditAdd}
        setOpenPopup={setOpenModalEditAdd}
        title="Rango a Rechazar"
        titleModalStyle="Audit"
        subTitle="Cargar Nuevo Rechazo de Caños"
        showModalCenterPage>
        <RangoRechazosModal
          refreshList={() => setActivarFetch(true)}
          openModal={openModalEditAdd}
          setOpenModal={setOpenModalEditAdd}
          edicionActiva={activarEdicion}
          rechazoSeleccionado={rechazoSeleccionado}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
