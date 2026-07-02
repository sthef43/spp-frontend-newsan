import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ICompresor } from "app/models/ICompresor";
import { CompresorForm } from "../Components/CompresorForm";
import { CompresorSliceRequests } from "app/Middleware/reducers/CompresorSlice";

export const Compresor = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [ModalOpen, setModalOpen] = useState(false);
  const [estaEditando, setEstaEditando] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [editState, setEditState] = useState<ICompresor | null>(null);
  const [tituloModal, setTituloModal] = useState("Creacion");

  const actionDelete = async (row) => {
    const resp = await getConfirmation("Borrar", "Está seguro que desea borrar?");
    if (resp) {
      const response = unwrapResult(await dispatch(CompresorSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Eliminado correctamente", "success");
        getList();
      }
    }
  };

  const getList = async () => {
    const responses = unwrapResult(await dispatch(CompresorSliceRequests.getAllRequest()));
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };

  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);

  useEffect(() => {
    getList();
    TitleChanger("COMPRESOR");
  }, []);

  const editar = (row) => {
    setEditState({
      IdCompresor: row.idCompresor,
      compresor: row.compresor,
      descripcion: row.descripcion ?? "",
      referencia: row.referencia
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"idCompresor"}
        columns={[
          {
            title: "Compresor",
            field: "compresor"
          },
          {
            title: "Descripcion",
            field: "descripcion"
          },
          {
            title: "Referencia",
            field: "referencia"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <IconButton
                      onClick={() => {
                        editar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton
                      onClick={() => {
                        actionDelete(row.idCompresor);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setEstaEditando(false);
          setModalOpen(true);
        }}
        dataInfo={dataSource}
      />
      <ModalCompoment title={tituloModal + " de un compresor"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <CompresorForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getList}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
