import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { EditSectores } from "../Modals/CreacionSectoresModal/EditSectores";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AgregarSector } from "../Modals/CreacionSectoresModal/AgregarSector";
import FetchApi from "app/shared/helpers/FetchApi";
import { ICLISectores } from "../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../Middlewares/CliSectoresSlice";

export const CreacionSectores = () => {
  const { TitleChanger } = useTitleOfApp();

  const [openModalEditarSector, setOpenModalEditarSector] = useState<boolean>(false);
  const [openModalAgregarSector, setOpenaModalAgregarSector] = useState<boolean>(false);

  const [pasarData, setPasarData] = useState<ICLISectores[]>([]);

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setPasarData);

  const [sectorSeleccionado, setSectorSeleccionado] = useState();
  const editarModal = (rowData) => {
    setOpenModalEditarSector(true);
    setSectorSeleccionado(rowData);
  };

  useEffect(() => {
    TitleChanger("Creacion de sectores");
  }, []);

  return (
    <main className="p-4">
      <section>
        <TableComponent
          agregar={() => {
            setOpenaModalAgregarSector(true);
          }}
          IDcolumn="id"
          buscar
          dataInfo={pasarData}
          columns={[
            {
              title: "Nomnbre del Sector",
              field: "nombreSector"
            },
            {
              title: "Jefe Sector",
              field: "jefeSector"
            },
            {
              title: "Cantidad Stacks",
              field: "cantidadStacks"
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
      <ModalCompoment setOpenPopup={setOpenModalEditarSector} openPopup={openModalEditarSector} title="Editar Sector">
        <EditSectores
          refreshLista={setPasarData}
          setOpenModal={setOpenModalEditarSector}
          sectorSeleccionada={sectorSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenaModalAgregarSector}
        openPopup={openModalAgregarSector}
        title="Agregar sector">
        <AgregarSector refreshLista={setPasarData} setOpenModal={setOpenaModalAgregarSector} />
      </ModalCompoment>
    </main>
  );
};
