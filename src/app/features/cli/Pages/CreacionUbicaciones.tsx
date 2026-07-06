import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { EditarUbicacion } from "../Modals/CreacionUbicacionModals/EditarUbicacion";
import { AgregarUbicacion } from "../Modals/CreacionUbicacionModals/AgregarUbicacion";
import { useAppDispatch } from "app/core/store/store";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import { CLIUbicacionSectoresSliceRequest, cliUbicacionSectoresSlice } from "../Middlewares/CLIUbiacacionSectorSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CreacionUbicaciones = () => {
  const { TitleChanger } = useTitleOfApp();

  const dispatch = useAppDispatch();

  const [openModalEditarUbicacion, setOpenModalEditarUbicacion] = useState<boolean>(false);
  const [openModalAgregarUbicacion, setOpenaModalAgregarUbicacion] = useState<boolean>(false);

  const [listaUbicaciones, setListaUbicaciones] = useState<ICLIUbicacionSector[]>([]);

  FetchApi<ICLIUbicacionSector[]>(
    CLIUbicacionSectoresSliceRequest.getAllRequest,
    null,
    false,
    null,
    setListaUbicaciones
  );

  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState();
  const editarModal = (rowData) => {
    setOpenModalEditarUbicacion(true);
    setUbicacionSeleccionada(rowData);
  };

  useEffect(() => {
    TitleChanger("Creación de ubicaciones");
  }, []);

  return (
    <main className="p-4">
      <section>
        <TableComponent
          agregar={() => {
            setOpenaModalAgregarUbicacion(true);
            dispatch(cliUbicacionSectoresSlice.actions.setDataAll(listaUbicaciones));
          }}
          IDcolumn="id"
          buscar
          dataInfo={listaUbicaciones}
          columns={[
            {
              title: "Localizador",
              field: "localizador"
            },
            {
              title: "Tipo UBC",
              field: "cliTipoUBC.nombre"
            },
            {
              title: "Organizacion",
              field: "cliOrganizacion.nombre"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <section className="flex flex-row gap-1 justify-start">
                    <div>
                      <Tooltip title="Editar sector">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              editarModal(row);
                            }}>
                            <Edit color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Editar sector">
                        <span>
                          <IconButton size="small" style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalEditarUbicacion}
        openPopup={openModalEditarUbicacion}
        title="Editar Ubicacion">
        <EditarUbicacion
          openModal={openModalEditarUbicacion}
          ubicacionSeleccionada={ubicacionSeleccionada}
          setOpenModal={setOpenModalEditarUbicacion}
          refreshLista={setListaUbicaciones}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenaModalAgregarUbicacion}
        openPopup={openModalAgregarUbicacion}
        title="Agregar Nueva Ubicacion">
        <AgregarUbicacion setOpenModal={setOpenaModalAgregarUbicacion} refreshList={setListaUbicaciones} />
      </ModalCompoment>
    </main>
  );
};
