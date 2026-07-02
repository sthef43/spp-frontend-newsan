/* eslint-disable unused-imports/no-unused-vars */
import { Comment, Error, Image, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobPlanoSliceRequests } from "app/Middleware/reducers/DobPlanoSlice";
import { useAppDispatch } from "app/core/store/store";
import AprobacionPlanosComentarios from "app/features/dobladora/modals/AprobacionPlanosComentarios";
import { VerImpresionesPlanosForm } from "app/features/dobladora/modals/VerImpresionesPlanosForm";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const VisualizarPlanos = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //Leer planos
  const [listPlanos, setListPlanos] = useState([]);
  const getPlanos = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobPlanoSliceRequests.getListDobPlano()));
      setListPlanos(responses);
    } catch (error) {
      openNotificationUI("Error al leer planos.", "error");
    }
  };

  //Imagen
  const [modalVerImagen, setModalVerImagen] = useState(false);
  const [stringImagen, setStringImagen] = useState("");
  const verImagen = (imagen) => {
    setModalVerImagen(true);
    setStringImagen(imagen);
  };

  //Listar Impresiones
  const [modalOpenLI, setModalOpenLI] = useState(false);
  const listadoImprimirPlano = (row) => {
    setModalOpenLI(true);
  };

  //Comentarios
  const [dobPlanoId, setDobPlanoId] = useState(0);
  const [openModalComments, setOpenModalComments] = useState(false);

  useEffect(() => {
    TitleChanger("VISUALIZAR PLANOS");
    getPlanos();
  }, []);

  return (
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
            title: "Usuario Modificación",
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
            title: "Impresiones Activas",
            field: "",
            render: (row) => {
              const lista = row.dobImpresionesPlanos.filter((num) => num.estado == "Activo");
              return lista.length;
            }
          },
          {
            title: "Impresiones Bajas",
            field: "",
            render: (row) => {
              const lista = row.dobImpresionesPlanos.filter((num) => num.estado == "Baja");
              return lista.length;
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Ver Comentarios">
                      <IconButton
                        onClick={() => {
                          setDobPlanoId(row.id);
                          setOpenModalComments(true);
                        }}
                        size="small"
                        color="success"
                        style={{ position: "relative" }}>
                        <Comment />
                      </IconButton>
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
                </div>
              );
            }
          }
        ]}
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

      <ModalCompoment title={"Observaciones"} openPopup={openModalComments} setOpenPopup={setOpenModalComments}>
        <AprobacionPlanosComentarios dobPlanoId={dobPlanoId} />
      </ModalCompoment>

      <ModalCompoment
        title={"Listado de Impresiones de una plano"}
        openPopup={modalOpenLI}
        setOpenPopup={setModalOpenLI}>
        <VerImpresionesPlanosForm dobPlanoId={dobPlanoId} />
      </ModalCompoment>
    </div>
  );
};
