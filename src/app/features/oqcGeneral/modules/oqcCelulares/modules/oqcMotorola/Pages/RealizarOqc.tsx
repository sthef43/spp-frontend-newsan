/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { NuevoRegistroDePalletModal } from "../Modals/NuevoRegistroDePalletModal";
import { SupervisorPlantaProducto } from "app/features/oqcGeneral/modules/oqcCelulares/modules/oqcMotorola/Components/SupervisorPlantasProductos";
import { ContextApp } from "../../../Context/Context";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { IconButton, Tooltip } from "@mui/material";
import { FormatListBulleted, Search, Visibility } from "@mui/icons-material";
import { ExaminarMuestrasDelPalletModal } from "../Modals/ExaminarMuestrasDelPalletModal";
import { MuestrasPalletModal } from "../Modals/MuestrasPalletModal";
import { ContinuarPalletModal } from "../Modals/ContinuarPalletModal";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IOQCPalet } from "app/models/IOQCPalet";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

export const RealizarOqc = () => {
  const modeloSeleccionado = useAppSelector((state) => state.oqcModelo.object);

  const contextGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [palletsCerrados, setPalletsCerrados] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [openModalExaminarMuestras, setOpenModalExaminarMuestras] = useState(false);

  const getPallets = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responsePrueba = unwrapResult(
        await dispatch(
          OQCPaletSliceRequests.getAllDatesPalletByPlantAndModelId({
            plantId: contextGlobal.plantaId,
            modeloId: modeloSeleccionado.id
          })
        )
      );
      const buscarPalet = unwrapResult(await dispatch(OQCPaletSliceRequests.searchPaletOpen(modeloSeleccionado.id)));
      if (responsePrueba) {
        contextGlobal.setPaletsExistentes(responsePrueba);
      }
      if (buscarPalet) {
        setPalletsCerrados(true);
      } else {
        setPalletsCerrados(false);
      }
    } catch (error) {
      console.log(error, "Error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const TurnoCreation = (dateTime) => {
    const turno = (createdDate) => {
      const date = new Date(createdDate);
      const hours = date.getHours();
      if (hours >= 6 && hours < 15) {
        return "Mañana";
      } else if (hours >= 15 && hours < 24) {
        return "Tarde";
      } else {
        return "modelo cargado fuera de hora";
      }
    };
    if (turno) {
      return turno(dateTime);
    } else {
      return "Sin Turno";
    }
  };

  const fechaCreacion = (dateTime) => {
    const fecha = new Date(dateTime);
    if (fecha) {
      return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    } else {
      return "Sin Fecha de creacion";
    }
  };

  const horaCreado = (dateTime) => {
    const hora = new Date(dateTime);
    return `${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`;
  };

  const auditor = (operador: IOQCPalet) => {
    return `${operador.operator.name} ${operador.operator.surname}`;
  };

  const paletCerrado = (condicionPallet) => {
    if (condicionPallet) {
      return <p className="bg-green-500 text-white text-sm- rounded-md inline-block py-1 px-4">Abierto</p>;
    } else {
      return <p className="bg-red-500 text-white text-sm- rounded-md inline-block py-1 px-4">Cerrado</p>;
    }
  };

  const palletConforme = (conformePallet) => {
    if (conformePallet) {
      return "GOOD";
    } else {
      return "NO GOOD";
    }
  };

  const verModelo = (rowData) => {
    dispatch(oqcPaletSlice.actions.setObject(rowData));
  };

  const seleecionarPallet = (pallet: IOQCPalet) => {
    console.log(pallet);
    dispatch(oqcPaletSlice.actions.setPaletSelect(pallet.id));
  };

  const openModalMostrarAyuda = (estadoModal) => {
    setMostrarAyuda(estadoModal);
  };

  useEffect(() => {
    TitleChanger("Realizar OQC Celulares");
  }, []);

  useEffect(() => {
    if (modeloSeleccionado?.id) {
      getPallets();
    }
  }, [modeloSeleccionado, contextGlobal.datosZampling, contextGlobal.eliminarMuestra]);

  useEffect(() => {
    if (contextGlobal.lineaSeleccionadaId || contextGlobal.plantaId) {
      contextGlobal.setPaletsExistentes([]);
    }
  }, [contextGlobal.lineaSeleccionadaId, contextGlobal.plantaId]);

  useEffect(() => {
    const cambiarResolucion = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", cambiarResolucion);
    return () => {
      window.removeEventListener("resize", cambiarResolucion);
    };
  });

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <section className="w-full h-full bg-secondaryNew rounded-sm shadow-shadowBox flex flex-col">
        <header className="bg-newsan text-center rounded-t-sm">
          <h2 className="text-white font-semibold text-xl py-2">Ingreso de Datos</h2>
        </header>
        <div className="flex flex-col flex-1 min-h-0 p-4">
          <div className="flex flex-row flex-wrap gap-2 mt-2">
            <SupervisorPlantaProducto palletsCerrados={palletsCerrados} />
          </div>
          <div className="mt-2 overflow-x-auto">
            <TableComponent
              Dense={windowWidth <= 1520 ? true : false}
              IDcolumn="id"
              buscar
              dataInfo={contextGlobal.paletExistentes}
              columns={[
                {
                  title: "Fecha",
                  field: "",
                  render: (rowData) => fechaCreacion(rowData.createdDate)
                },
                {
                  title: "Turno",
                  field: "",
                  render: (rowData) => TurnoCreation(rowData.createdDate)
                },
                {
                  title: "Hora",
                  field: "",
                  render: (rowData) => horaCreado(rowData.createdDate)
                },
                {
                  title: "Sales Models",
                  field: "oqcModelo.modeloNewsan"
                },
                {
                  title: "Numero Pallet",
                  field: "numeroPalet"
                },
                {
                  title: "Registro",
                  field: "registro"
                },
                {
                  title: "Auditor",
                  field: "",
                  render: (rowData) => auditor(rowData)
                },
                {
                  title: "Linea",
                  field: "oqcModelo.lineaProduccion.nombre"
                },
                {
                  title: "Cant. Master Box",
                  field: "cantidadMasterBox"
                },
                {
                  title: "Cant. Equipos",
                  field: "cantidadEquipos"
                },
                {
                  title: "Estado Pallet",
                  field: "",
                  render: (rowData) => palletConforme(rowData.conforme)
                },
                {
                  title: "Condición",
                  field: "",
                  render: (rowData) => paletCerrado(rowData.cerrado)
                },
                {
                  title: "Acción",
                  field: "",
                  render: (row) => {
                    return (
                      <div className="flex w-full justify-start gap-1">
                        <div>
                          <Tooltip title="Continuar Pallet">
                            <span>
                              <IconButton
                                disabled={!row.cerrado}
                                onClick={() => {
                                  contextGlobal.setContinuarPallet(true);
                                  verModelo(row);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Search color={`${row.cerrado ? "primary" : "disabled"}`} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Muestras De Pallet">
                            <span>
                              <IconButton
                                disabled={!row.cerrado}
                                onClick={() => {
                                  contextGlobal.setMuestrasPallet(true);
                                  verModelo(row);
                                  seleecionarPallet(row);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <FormatListBulleted color={`${row.cerrado ? "primary" : "disabled"}`} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Examinar">
                            <span>
                              <IconButton
                                onClick={() => {
                                  setOpenModalExaminarMuestras(true);
                                  verModelo(row);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Visibility color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  }
                }
              ]}></TableComponent>
          </div>
        </div>
      </section>
      {/* Modal para empezar un nuevo palet */}
      <ModalCompoment
        setOpenPopup={contextGlobal.setMasterBox}
        openPopup={contextGlobal.masterBox}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Creación de un nuevo palet para OQC"
        title="Inicio Nuevo Palet"
        onCloseDynamic>
        <NuevoRegistroDePalletModal
          refreshTable={getPallets}
          modalAyuda={mostrarAyuda}
          openModalAyuda={openModalMostrarAyuda}
        />
      </ModalCompoment>

      {/* Modal para continuar un palet */}
      <ModalCompoment
        setOpenPopup={contextGlobal.setContinuarPallet}
        openPopup={contextGlobal.continuarPallet}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Continuar con el muestreo de un palet existente"
        title="Continuar Palet"
        onCloseDynamic>
        <ContinuarPalletModal
          refreshTable={getPallets}
          modalAyuda={mostrarAyuda}
          openModalAyuda={openModalMostrarAyuda}
        />
      </ModalCompoment>
      {/* Modal para continuar un palet */}

      {/* Modal para examinar muestras */}
      <ModalCompoment
        setOpenPopup={setOpenModalExaminarMuestras}
        openPopup={openModalExaminarMuestras}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Detalle de las muestras cargadas en el palet"
        title="Examinar Muestras">
        <ExaminarMuestrasDelPalletModal
          refreshPallet={getPallets}
          openModal={openModalExaminarMuestras}
          setOpenModal={setOpenModalExaminarMuestras}
        />
      </ModalCompoment>
      {/* Modal para examinar muestras */}

      {/* Modal para examinar cantidad cargadas segun las master box*/}
      {/* Y cerrar el pallet */}
      <ModalCompoment
        setOpenPopup={contextGlobal.setMuestrasPallet}
        openPopup={contextGlobal.muestrasPallet}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Gestión de muestras pendientes y cierre de palet"
        title="Muestas En Pallet Sin Finalizar">
        <MuestrasPalletModal refreshPallet={getPallets} />
      </ModalCompoment>
      {/* Modal para examinar cantidad cargadas segun las master box*/}
      {/* Y cerrar el pallet */}
    </ContainerForPages>
  );
};
