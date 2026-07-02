import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { MarcaSliceRequests } from "app/Middleware/reducers/MarcaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IMarca } from "app/models/IMarca";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MarcaForm } from "app/features/trazabilidad/modules/marca/modal/MarcaForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const Marca = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  //Leer
  const [listMarcas, setListMarcas] = useState([]);
  const getMarcas = async () => {
    try {
      const responses = unwrapResult(await dispatch(MarcaSliceRequests.getAllRequest()));
      setListMarcas(responses);
    } catch (error) {
      openNotificationUI("Error al leer marcas.", "error");
    }
  };
  useEffect(() => {
    console.log(listMarcas);
  }, [listMarcas]);

  //Eliminar
  const deleteMarca = async (row) => {
    const resp = await getConfirmation("Borrar marca", "Esta seguro que quiere eliminar esta marca?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(MarcaSliceRequests.deleteRequest(row.id)));
        openNotificationUI("Se elimino la marca correctamente", "success");
        getMarcas();
      } catch (error) {
        openNotificationUI("Error al eliminar marca.", "error");
      }
    }
  };

  //Editar
  const [editState, setEditState] = useState<IMarca | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("MARCA");
    getMarcas();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        // Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Id",
            field: "id"
          },
          {
            title: "Descripción",
            field: "descripcion"
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
                          deleteMarca(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
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
        dataInfo={listMarcas}
      />
      <ModalCompoment title="Nueva Marca" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <MarcaForm setOpenPopup={setModalOpen} editState={editState} refresh={getMarcas} estaEditando={estaEditando} />
      </ModalCompoment>
    </div>
  );
};
