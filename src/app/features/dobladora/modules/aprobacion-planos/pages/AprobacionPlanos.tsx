import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Comment, Error, Image, LocalPrintshop } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, ListAlt, Visibility } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { DobPlanoSliceRequests } from "app/Middleware/reducers/DobPlanoSlice";
import moment from "moment";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { IDobPlano } from "app/models/IDobPlano";
import AprobacionPlanosComentarios from "app/features/dobladora/modals/AprobacionPlanosComentarios";
import { AprobacionPlanosEstadoForm } from "app/features/dobladora/modules/aprobacion-planos/modal/AprobacionPlanosEstadoForm";
import { AprobacionPlanosForm } from "app/features/dobladora/modules/aprobacion-planos/modal/AprobacionPlanosForm";
import { IAppUser } from "app/models";
import { DobImpresionesPlanosSliceRequests } from "app/Middleware/reducers/DobImpresionesPlanosSlice";
import { ImpresionPlanosFormDocument } from "app/features/dobladora/modules/aprobacion-planos/modal/ImpresionPlanosFormDocument";
import { VerImpresionesPlanosForm } from "app/features/dobladora/modals/VerImpresionesPlanosForm";

export const AprobacionPlanos = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { TitleChanger } = useTitleOfApp();
  const [listPlanos, setListPlanos] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = useState(false);
  const { getConfirmation } = useConfirmationDialog();

  // Determina si es ingeniero
  const [esIngeniero, setEsIngeniero] = useState(null);
  const getEsIngeniero = () => {
    infoUser.permisos.rol.name.toUpperCase().includes("ingenier".toUpperCase())
      ? setEsIngeniero(true)
      : setEsIngeniero(false);
  };

  //Leer planos
  const getPlanos = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(DobPlanoSliceRequests.getListByRolIdRequest(infoUser.permisos.rolId))
      );
      setListPlanos(responses);
    } catch (error) {
      console.log(error);
    }
  };

  //Borrar Plano
  const eliminar = async (row) => {
    const resp = await getConfirmation("Borrar un plano", "Está seguro que desea borrar el plano?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(DobPlanoSliceRequests.deleteRequest(row)));
        if (response) {
          openNotificationUI("Se eliminó el plano correctamente", "success");
          getPlanos();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Imagen
  const [stringImagen, setStringImagen] = useState(null);
  const [modalVerImagen, setModalVerImagen] = useState(false);
  const verImagen = (row) => {
    setStringImagen(row);
    setModalVerImagen(true);
  };

  //Cambiar Estado
  const [estadoPlano, setEstadoPlano] = useState<IDobPlano | null>(null);
  const [modalOpenEstadoPlano, setModalOpenEstadoPlano] = useState(false);
  const cambiarEstado = (row) => {
    setEstadoPlano({ ...row });
    setModalOpenEstadoPlano(true);
  };

  //Observaciones
  const [dobPlanoId, setDobPlanoId] = useState(0);
  const [openModalComments, setOpenModalComments] = useState(false);
  const observaciones = (row) => {
    setDobPlanoId(row.id);
    setOpenModalComments(true);
  };

  const [lineaSeleccionada, setLineaSeleccionada] = useState(null); //IDobPlano

  const [impresionPlano, setImpresionPlano] = useState(null); //IDobImpresionesPlanos
  const imprimirPlano = async (row) => {
    const resp = await getConfirmation(
      "Imprimir un plano",
      "Se contabilizará la impresión del plano, desea continuar?"
    );
    if (resp) {
      setLineaSeleccionada({ ...row });
    }
  };

  useEffect(() => {
    if (lineaSeleccionada) {
      registra();
    }
  }, [lineaSeleccionada]);

  const registra = async () => {
    let result;
    const objectSubmit = {
      dobPlanoId: lineaSeleccionada.id,
      appUserCreaId: infoUser.id,
      appUserId: infoUser.id,
      Estado: "Activo"
    };
    try {
      result = unwrapResult(await dispatch(DobImpresionesPlanosSliceRequests.PostRequest(objectSubmit)));
      setImpresionPlano(result);
    } catch (x) {
      openNotificationUI("Error al registrar impresión del Plano.", "error");
      result = null;
    }
  };

  const [modalOpenPrint, setModalOpenPrint] = useState(false);
  useEffect(() => {
    if (impresionPlano) {
      getPlanos();
      setModalOpenPrint(true);
    }
  }, [impresionPlano]);

  //Listar Impresiones
  const [modalOpenLI, setModalOpenLI] = useState(false);
  const listadoImprimirPlano = (row) => {
    setDobPlanoId(row.id);
    setModalOpenLI(true);
  };

  useEffect(() => {
    TitleChanger("APROBACIÓN DE PLANOS");
    getEsIngeniero();
    getPlanos();
  }, []);

  return (
    <div>
      <div className="my-2 mx-4 h-full">
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
              title: "Código",
              field: "dobSemi.codigo"
            },
            {
              title: "Estado",
              field: "dobEstadoPlano.descripcion"
            },
            {
              title: "Rol",
              field: "rol.name"
            },
            {
              title: "Observación",
              field: "descripcion"
            },
            {
              title: "Usuario",
              field: "",
              render: (row) => {
                return row.appUser.operator.surname + " " + row.appUser.operator.name;
              }
            },
            {
              title: "Plano",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Ver Plano">
                        {row.imagen != "" && row.imagen != null ? (
                          <IconButton
                            onClick={() => {
                              verImagen(row.imagen);
                            }}
                            size="small"
                            color="success"
                            style={{ position: "relative" }}>
                            <Image />
                          </IconButton>
                        ) : (
                          <IconButton size="small" color="error" style={{ position: "relative" }}>
                            <Error />
                          </IconButton>
                        )}
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            },
            {
              title: "Fecha Creación",
              field: "",
              render: (row) => {
                return moment(row.createdDate).format("L");
              }
            },
            {
              title: "Fecha Modificación",
              field: "",
              render: (row) => {
                return moment(row.lastModifiedDate).format("L");
              }
            },
            {
              title: "Impresiones",
              field: "dobImpresionesPlanos.length"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Cambio de Estados">
                        <IconButton
                          color="warning"
                          onClick={() => {
                            cambiarEstado(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <ListAlt />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Ver Observaciones">
                        <IconButton
                          onClick={() => {
                            observaciones(row);
                          }}
                          size="small"
                          color="success"
                          style={{ position: "relative" }}>
                          <Comment />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir">
                        <span>
                          <IconButton
                            disabled={!esIngeniero || row.dobEstadoPlano.descripcion != "Aprobado"}
                            onClick={() => {
                              // alternativaImprimir(row);
                              imprimirPlano(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <LocalPrintshop />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Ver Impresiones">
                        <IconButton
                          color="info"
                          onClick={() => {
                            listadoImprimirPlano(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            color="error"
                            disabled={row.dobComentario != ""}
                            onClick={() => {
                              eliminar(row.id);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            if (esIngeniero) {
              setModalOpen(true);
            } else {
              openNotificationUI("No tiene privilegios de ingeniería", "warning");
            }
          }}
          dataInfo={listPlanos}
        />
        <ModalCompoment title="Vista previa del plano" openPopup={modalVerImagen} setOpenPopup={setModalVerImagen}>
          <>
            <div className=" flex-col gap-30 " style={{ height: "100%" }}>
              <div style={{ height: "83vh", width: "90vw", position: "relative" }}>
                <div className=" flex-col gap-30 " style={{ width: "100%", height: "100%" }}>
                  <>
                    <iframe
                      style={{ width: "100%", height: "100%" }}
                      src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/Planos/${stringImagen}`}
                    />
                  </>
                </div>
              </div>
            </div>
          </>
        </ModalCompoment>

        <ModalCompoment
          title={"Estado de una plano"}
          openPopup={modalOpenEstadoPlano}
          setOpenPopup={setModalOpenEstadoPlano}>
          <AprobacionPlanosEstadoForm
            setOpenPopup={setModalOpenEstadoPlano}
            estadoPlano={estadoPlano}
            refresh={getPlanos}
          />
        </ModalCompoment>

        <ModalCompoment title={"Observaciones"} openPopup={openModalComments} setOpenPopup={setOpenModalComments}>
          <AprobacionPlanosComentarios dobPlanoId={dobPlanoId} />
        </ModalCompoment>

        <ModalCompoment title={"Imprimir Plano"} openPopup={modalOpenPrint} setOpenPopup={setModalOpenPrint}>
          <ImpresionPlanosFormDocument
            setOpenPopup={setModalOpenPrint}
            fila={lineaSeleccionada}
            impresion={impresionPlano?.id}
          />
        </ModalCompoment>

        <ModalCompoment title={"Creación de una plano"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <AprobacionPlanosForm setOpenPopup={setModalOpen} refresh={getPlanos} />
        </ModalCompoment>

        <ModalCompoment
          title={"Listado de Impresiones de una plano"}
          openPopup={modalOpenLI}
          setOpenPopup={setModalOpenLI}>
          <VerImpresionesPlanosForm dobPlanoId={dobPlanoId} />
        </ModalCompoment>
      </div>
    </div>
  );
};
