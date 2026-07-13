import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { EditarUbicacion } from "../Modals/CreacionUbicacionModals/EditarUbicacion";
import { AgregarUbicacion } from "../Modals/CreacionUbicacionModals/AgregarUbicacion";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import { CLIUbicacionSectoresSliceRequest } from "../Middlewares/CLIUbiacacionSectorSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CreacionUbicaciones: React.FC = () => {
  const { TitleChanger } = useTitleOfApp();

  const [openModalEditarUbicacion, setOpenModalEditarUbicacion] = useState<boolean>(false);
  const [openModalAgregarUbicacion, setOpenModalAgregarUbicacion] = useState<boolean>(false);

  const [listaUbicaciones, setListaUbicaciones] = useState<ICLIUbicacionSector[]>([]);

  FetchApi<ICLIUbicacionSector[]>(
    CLIUbicacionSectoresSliceRequest.getAllRequest,
    null,
    false,
    null,
    setListaUbicaciones
  );

  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<ICLIUbicacionSector | undefined>();
  const editarModal = (rowData: ICLIUbicacionSector) => {
    setOpenModalEditarUbicacion(true);
    setUbicacionSeleccionada(rowData);
  };

  const handleAgregar = () => {
    setOpenModalAgregarUbicacion(true);
  };

  useEffect(() => {
    TitleChanger("Creación de ubicaciones");
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <section>
          <TableComponent
            agregar={handleAgregar}
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
                              onClick={() => editarModal(row)}>
                              <Edit color="primary" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Eliminar sector">
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
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModalEditarUbicacion}
        openPopup={openModalEditarUbicacion}
        title="Editar Ubicacion"
        showModalCenterPage
        titleModalStyle="Audit">
        <EditarUbicacion
          openModal={openModalEditarUbicacion}
          ubicacionSeleccionada={ubicacionSeleccionada}
          setOpenModal={setOpenModalEditarUbicacion}
          refreshLista={setListaUbicaciones}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarUbicacion}
        openPopup={openModalAgregarUbicacion}
        title="Agregar Nueva Ubicacion"
        showModalCenterPage
        titleModalStyle="Audit">
        <AgregarUbicacion setOpenModal={setOpenModalAgregarUbicacion} refreshList={setListaUbicaciones} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
