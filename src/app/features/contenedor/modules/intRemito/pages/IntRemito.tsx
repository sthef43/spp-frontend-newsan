import { LocalPrintshop, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { IntDetalleSliceRequests } from "app/Middleware/reducers/IntDetalleSlice";
import { IntRemitoSliceRequests } from "app/Middleware/reducers/IntRemitoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { IIntDetalle } from "app/models/IIntDetalle";
import { IIntRemito } from "app/models/IIntRemito";
import { IntImprimirRemito } from "app/features/contenedor/components/IntImprimirRemito";
import { IntRemitoForm } from "app/features/contenedor/modules/intRemito/modals/IntRemitoForm";
import { IntVerContenido } from "app/features/contenedor/modals/IntVerContenido";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";

export const IntRemito = () => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [ModalOpen, setModalOpen] = useState(false);

  //Fecha
  const [fechaDesde, setFechaDesde] = useState(""); //mes - dia - año
  const [fechaHasta, setFechaHasta] = useState(""); //mes - dia - año
  const [fechaInvalida, setFechaInvalida] = useState(false); //true o false
  useEffect(() => {
    getIntRemito();
  }, [fechaDesde, fechaHasta]);

  //Leer Remitos
  const [intRemito, setIntRemito] = useState<IIntRemito[] | null>(null);
  const getIntRemito = async () => {
    if (!fechaInvalida && fechaDesde && fechaHasta) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const responses = unwrapResult(
          await dispatch(
            IntRemitoSliceRequests.getAllByFechaUserIdRequest({
              fechaDesde,
              fechaHasta,
              userId: infoUser.id
            })
          )
        );
        setIntRemito(responses);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (e) {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        openNotificationUI(e, "error");
      }
    }
  };

  //Ver detalle - Ojo
  const [intRemitoSelect, setIntRemitoSelect] = useState<IIntRemito | null>(null);
  const [intDetalleSelect, setIntDetalleSelect] = useState<IIntDetalle[] | null>(null);
  const [modalOpenVerContenido, setModalOpenVerContenido] = useState(false);
  const [modalOpenPrint, setModalOpenPrint] = useState(false);
  const getVerDetalle = (row) => {
    setIntRemitoSelect(row);
    setModalOpenVerContenido(true);
  };

  //Imprimir Remito
  const imprimirRemito = async (row) => {
    setIntRemitoSelect(row);
    getIntDetalleSelect(row);
  };

  //Leer Detalle
  const getIntDetalleSelect = async (row) => {
    try {
      const result = unwrapResult(await dispatch(IntDetalleSliceRequests.getAllByIntRemitoIdRequest(row.id)));
      const agregado = result.map((file, index) => ({ ...file, numero: index + 1 }));
      setIntDetalleSelect(agregado);
      setModalOpenPrint(true);
    } catch (error) {
      openNotificationUI("Error al leer Registros.", "error");
    }
  };

  const componentRef = React.useRef(null);
  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Remito`,
    copyStyles: true
  });

  const mostrarEstadoRechazo = (row: IIntRemito) => {
    if (row.rechazado) {
      return "Rechazado";
    } else {
      return "Disponible";
    }
  };

  useEffect(() => {
    if (modalOpenPrint && intDetalleSelect) {
      const timeout = setTimeout(() => {
        handleImprimir();
      }, 500); // Pequeño delay para asegurar que se renderice
      return () => clearTimeout(timeout);
    }
  }, [modalOpenPrint, intDetalleSelect]);

  //Al iniciar el formulario
  useEffect(() => {
    TitleChanger("GENERADOR DE REMITOS");
  }, []);

  return (
    <>
      <div className="my-2 mx-4 h-full">
        <div className="p-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 2, padding: "1px" }}>
              <SelectOfDate
                fechaDesdeHasta
                setFechaDesdeProps={setFechaDesde}
                setFechaHastaProps={setFechaHasta}
                setErrorProps={setFechaInvalida}
              />
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
        </div>
        {intRemito && (
          <TableComponent
            columns={[
              {
                title: "Fecha",
                field: "createdDate",
                render: (row) => moment(row.createdDate).format("L")
              },
              {
                title: "Número Remito",
                field: "id",
                render: (row) => row.plantOrigen.organizationCode + row.id.toString().padStart(10, "0")
              },
              {
                title: "Operador",
                field: "appUser.username",
                render: (row) => row.appUser.operator.name + " " + row.appUser.operator.surname
              },
              {
                title: "Planta Origen",
                field: "plantOrigen.name"
              },
              {
                title: "Planta Destino",
                field: "plantDestino.name"
              },
              {
                title: "Área Destino",
                field: "areaDestino.nombre"
              },
              {
                title: "Referente Destino",
                field: "referenciaDestino"
              },
              {
                title: "Estado",
                field: "intEstado.nombre"
              },
              {
                title: "Rechazado",
                field: "",
                render: (row: IIntRemito) => mostrarEstadoRechazo(row)
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            color="info"
                            onClick={() => {
                              getVerDetalle(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Imprimir">
                          <span>
                            <IconButton
                              onClick={() => {
                                imprimirRemito(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <LocalPrintshop />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={intRemito}
            IDcolumn="id"
            buscar
            excel
            fileNameExcel="Generador de Remitos"
            agregar={() => {
              setModalOpen(true);
            }}
          />
        )}
        <ModalCompoment title="Cargar información para remito" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <IntRemitoForm setOpenPopup={setModalOpen} refresh={getIntRemito} />
        </ModalCompoment>
        <ModalCompoment title="Ver Contenido" openPopup={modalOpenVerContenido} setOpenPopup={setModalOpenVerContenido}>
          <IntVerContenido setOpenPopup={setModalOpenVerContenido} intRemitoSelect={intRemitoSelect} />
        </ModalCompoment>
        <div style={{ display: "none" }}>
          <IntImprimirRemito parentRef={componentRef} fila={intRemitoSelect} detalle={intDetalleSelect} />
        </div>
      </div>
    </>
  );
};
