import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { CLIUbicacionesSliceRequests } from "app/features/cli/Middlewares/CLIUbicacionesSlice";
import { ICLIUbicaciones } from "app/features/cli/Models/ICLIUbicaciones";
import { useAppDispatch } from "app/core/store/store";
import { CLIStock_PlantaForm } from "app/features/contenedor/modules/cliUbicaciones/modals/CLIStock_PlantaForm";
import { CLIUbicacionesForm } from "app/features/contenedor/modules/cliUbicaciones/modals/CLIUbicacionesForm";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";

export const CLIUbicaciones = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  //Leer
  const [ubicaciones, setUbicaciones] = useState<ICLIUbicaciones[] | null>(null);
  const getUbicaciones = async () => {
    try {
      const responses = unwrapResult(await dispatch(CLIUbicacionesSliceRequests.getAllRequest()));
      setUbicaciones(responses);
    } catch (error) {
      openNotificationUI("Error al leer ubicaciones.", "error");
    }
  };

  //Eliminar
  const borrar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro de eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(CLIUbicacionesSliceRequests.deleteRequest(row)));
        openNotificationUI("Se elimino el registro correctamente", "success");
        getUbicaciones();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Editar
  const [ModalOpenStockPlanta, setModalOpenStockPlanta] = useState(false);
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<ICLIUbicaciones | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //General
  useEffect(() => {
    TitleChanger("CLI Ubicaciones");
    getUbicaciones();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        buscar={true}
        IDcolumn={"id"}
        excel
        columns={[
          {
            title: "Localizador",
            field: "localizador"
          },
          {
            title: "Pasillo",
            field: "pasillo"
          },
          {
            title: "Organización",
            field: "",
            render: (row) => {
              return row.organizacion.nombre;
            }
          },
          {
            title: "Tipo UBC",
            field: "",
            render: (row) => {
              return row.cliTipoUBC.nombre;
            }
          },
          {
            title: "Estado",
            field: "",
            render: (row) => {
              return row.cliEstado.nombre;
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          editar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          borrar(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Ver Contenido">
                      <IconButton
                        onClick={() => {
                          setEditState(row);
                          setModalOpenStockPlanta(true);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Visibility color="info" />
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
        dataInfo={ubicaciones}
      />
      <ModalCompoment title="Nuevo - Modificar" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <CLIUbicacionesForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getUbicaciones}
          estaEditando={estaEditando}
        />
      </ModalCompoment>

      <ModalCompoment
        title="Contenido de la Ubicación"
        openPopup={ModalOpenStockPlanta}
        setOpenPopup={setModalOpenStockPlanta}>
        <CLIStock_PlantaForm setOpenPopup={setModalOpen} editState={editState} />
      </ModalCompoment>
    </div>
  );
};
