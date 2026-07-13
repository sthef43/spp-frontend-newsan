import React, { useEffect, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";
import { useAppDispatch } from "app/core/store/store";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ICLISectores } from "../Models/ICLISectores";
import { EditSectores } from "../Modals/CreacionSectoresModal/EditSectores";
import { AgregarSector } from "../Modals/CreacionSectoresModal/AgregarSector";
import { CLISectoresSliceRequest } from "../Middlewares/CliSectoresSlice";

export const CreacionSectores: React.FC = () => {
  const { TitleChanger } = useTitleOfApp();

  const [openModalEditarSector, setOpenModalEditarSector] = useState<boolean>(false);
  const [openModalAgregarSector, setOpenModalAgregarSector] = useState<boolean>(false);

  const [sectoresData, setSectoresData] = useState<ICLISectores[]>([]);

  const dispatch = useAppDispatch();
  const { FetchDelete } = useFetchApiMultiResults<ICLISectores>();
  const { openNotificationUI } = useNotificationUI();

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, undefined, false, undefined, setSectoresData);

  const [sectorSeleccionado, setSectorSeleccionado] = useState<ICLISectores | undefined>();
  const editarModal = (rowData: ICLISectores) => {
    setOpenModalEditarSector(true);
    setSectorSeleccionado(rowData);
  };

  useEffect(() => {
    TitleChanger("Creación de sectores");
  }, [TitleChanger]);

  const eliminarSector = (id: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: id,
      sliceRequest: CLISectoresSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      titleUser: "Eliminar Sector",
      messageUser: "Se eliminará el sector seleccionado, ¿desea continuar?",
      functionAdd: () => {
        openNotificationUI("Se eliminó el sector correctamente", "success");
        // Recargar la lista después de eliminar
        dispatch(CLISectoresSliceRequest.getAllRequest()).then((responseLista) => {
          const result = unwrapResult(responseLista);
          setSectoresData(result);
        });
      }
    });
  };

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          agregar={() => {
            setOpenModalAgregarSector(true);
          }}
          IDcolumn="id"
          buscar
          dataInfo={sectoresData}
          columns={[
            {
              title: "Nombre del Sector",
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
                        <IconButton
                          size="small"
                          className="relative"
                          aria-label="Editar sector"
                          onClick={() => {
                            editarModal(row);
                          }}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar sector">
                        <IconButton
                          size="small"
                          className="relative"
                          aria-label="Eliminar sector"
                          onClick={() => eliminarSector(row.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment setOpenPopup={setOpenModalEditarSector} openPopup={openModalEditarSector} title="Editar sector" showModalCenterPage titleModalStyle="Audit" subTitle="Formulario para editar un sector existente">
        <EditSectores
          refreshLista={setSectoresData}
          setOpenModal={setOpenModalEditarSector}
          sectorSeleccionado={sectorSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarSector}
        openPopup={openModalAgregarSector}
        title="Agregar sector"
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Formulario para agregar un nuevo sector">
        <AgregarSector refreshLista={setSectoresData} setOpenModal={setOpenModalAgregarSector} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
