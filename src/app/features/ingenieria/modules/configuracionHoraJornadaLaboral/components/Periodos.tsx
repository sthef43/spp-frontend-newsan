import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, LineAxis, WatchLater } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { PeriodoSliceRequests } from "app/Middleware/reducers/periodoSlice";
import { PeriodoForm } from "app/features/ingenieria/modules/configuracionHoraJornadaLaboral/forms/PeriodoForm";
import { AccionAsignarHoras } from "app/features/ingenieria/modules/configuracionHoraJornadaLaboral/modals/AccionAsignarHoras";
import { AccionAsignarLineas } from "app/features/ingenieria/modules/configuracionHoraJornadaLaboral/modals/AccionAsignarLineas";

export const Periodos = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState(null);
  const [modalOpenAsignarHora, setModalOpenAsignarHora] = useState(false);
  const [modalOpenAsignarLineas, setModalOpenAsignarLineas] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(0);
  const [nombreRegistroSeleccionado, setNombreRegistroSeleccionado] = useState("");
  const [turnoAsignado, setTurnoAsignado] = useState("");

  const { getConfirmation } = useConfirmationDialog();

  const deleteRow = async (row) => {
    const resp = await getConfirmation("Borrar una hora", "Está seguro que desea borrar la hora?");
    if (resp) {
      const response = unwrapResult(await dispatch(PeriodoSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getList();
      }
    }
  };
  const getList = async () => {
    const responses = unwrapResult(await dispatch(PeriodoSliceRequests.getAllRequest()));
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };
  const refresh = () => {
    getList();
  };

  const [estaEditando, setEstaEditando] = useState(false);
  const [tituloModal, setTituloModal] = useState("Creacion");

  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);

  React.useEffect(() => {
    TitleChanger("CARGA DE HORA");
    getList();
  }, []);

  const editar = (row) => {
    setEditState({
      id: row.id,
      nombre: row.nombre,
      turno: row.turno
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  const asignarHoras = (row) => {
    setRegistroSeleccionado(row.id);
    setNombreRegistroSeleccionado(row.nombre);
    setTurnoAsignado(row.turno);
    setModalOpenAsignarHora(true);
  };

  const asignarLineas = (row) => {
    setRegistroSeleccionado(row.id);
    setNombreRegistroSeleccionado(row.nombre);
    setModalOpenAsignarLineas(true);
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
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Turno",
            field: "turno"
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
                          deleteRow(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Asignar Horas">
                      <IconButton
                        onClick={() => {
                          asignarHoras(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <WatchLater color="success" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Asignar Lineas">
                      <IconButton
                        onClick={() => {
                          asignarLineas(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <LineAxis color="success" />
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
          setModalOpen(true);
        }}
        dataInfo={dataSource}
      />
      <ModalCompoment title={tituloModal + " de un periodo"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <PeriodoForm setOpenPopup={setModalOpen} editState={editState} refresh={refresh} estaEditando={estaEditando} />
      </ModalCompoment>

      <ModalCompoment
        title={"Asignacion de horas para: " + nombreRegistroSeleccionado}
        openPopup={modalOpenAsignarHora}
        setOpenPopup={setModalOpenAsignarHora}>
        <AccionAsignarHoras
          setModalOpenAsignarHora={setModalOpenAsignarHora}
          periodoId={registroSeleccionado}
          refresh={refresh}
          turno={turnoAsignado}
        />
      </ModalCompoment>

      <ModalCompoment
        title={"Asignacion de lineas para: " + nombreRegistroSeleccionado}
        openPopup={modalOpenAsignarLineas}
        setOpenPopup={setModalOpenAsignarLineas}>
        <AccionAsignarLineas
          setModalOpenAsignarLineas={setModalOpenAsignarLineas}
          periodoId={registroSeleccionado}
          refresh={refresh}
        />
      </ModalCompoment>
    </div>
  );
};
