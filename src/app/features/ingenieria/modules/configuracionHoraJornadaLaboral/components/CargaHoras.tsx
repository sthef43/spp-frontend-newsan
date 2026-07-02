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
import { HoraSliceRequests } from "app/Middleware/reducers/HoraSlice";
import { CargaHorasform } from "app/features/ingenieria/modules/configuracionHoraJornadaLaboral/modals/CargaHorasForm";
export const CargaHoras = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  // const [horas, setHoras] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState(null);
  const { getConfirmation } = useConfirmationDialog();

  const deleteHora = async (idHora) => {
    const resp = await getConfirmation("Borrar una hora", "Está seguro que desea borrar la hora?");
    if (resp) {
      const response = unwrapResult(await dispatch(HoraSliceRequests.deleteRequest(idHora)));
      if (response) {
        openNotificationUI("Se elimino la hora correctamente", "success");
        getHoras();
      }
    }
  };
  const getHoras = async () => {
    const responses = unwrapResult(await dispatch(HoraSliceRequests.getAll()));
    // setHoras(responses);
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };
  const refresh = () => {
    getHoras();
  };

  const [estaEditando, setEstaEditando] = useState(false);
  const [tituloModal, setTituloModal] = useState("Creacion");

  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);

  useEffect(() => {
    getHoras();
  }, []);

  React.useEffect(() => {
    TitleChanger("CONFIGURACION DE HORAS Y PERIODOS");
  }, []);

  const editar = (row) => {
    setEditState({
      idHora: row.idHora,
      desdeHora: row.desdeHora,
      hastaHora: row.hastaHora,
      turno: row.turno,
      minutos: row.minutos
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
        IDcolumn={"idHora"}
        columns={[
          {
            title: "Desde",
            field: "desdeHora"
          },
          {
            title: "Hasta",
            field: "hastaHora"
          },
          {
            title: "Turno",
            field: "turno"
          },
          {
            title: "Minutos",
            field: "minutos"
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
                        deleteHora(row.idHora);
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
      <ModalCompoment title={tituloModal + " de una hora"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <CargaHorasform
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={refresh}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
