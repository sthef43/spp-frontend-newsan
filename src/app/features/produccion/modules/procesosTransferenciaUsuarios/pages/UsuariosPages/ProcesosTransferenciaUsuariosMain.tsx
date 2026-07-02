/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { CLISectoresSliceRequest } from "app/features/cli/Middlewares/CliSectoresSlice";
import { ITransferenciaUsuariosPermitidos } from "../../models/ITransferenciaUsuariosPermitidos";
import { TransferenciaUsuariosPermitidosSliceRequest } from "../../slices/TransferenciaUsuariosPermitidosSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarEditarUsuario } from "../../modals/usuariosModals/AgregarEditarUsuario";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AgregarProcesosUsuarios } from "../../modals/usuariosModals/AgregarProcesosUsuarios";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";

export const ProcesosTransferenciaUsuariosMain = () => {
  const { control } = useForm();

  const usuarios = useAppSelector(
    (state) => state.transferenciaUsuariosPermitidos.dataAll as ITransferenciaUsuariosPermitidos[]
  );

  const { FetchDelete } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [openModalAgregarUsuario, setOpenModalAgregarUsuario] = useState(false);
  const [openModalAgregarProcesos, setOpenModalAgregarProcesos] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<ITransferenciaUsuariosPermitidos>();

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores, false);

  FetchApi<ITransferenciaUsuariosPermitidos[]>(
    TransferenciaUsuariosPermitidosSliceRequest.getAllRequest,
    null,
    false,
    null,
    null,
    false
  );

  const eliminarUsuario = async (usuarioId: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: usuarioId,
      sliceRequest: TransferenciaUsuariosPermitidosSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      titleUser: "Eliminar Usuario",
      messageUser: "Desea eliminar el usuario seleccionado?",
      functionAdd: async () => {
        openNotificationUI("Se elimino el usuario con exito", "success");
      }
    });
  };

  const handleOpenModalAgregarEditarUsuario = (
    opcion: string,
    usuarioSeleccionado?: ITransferenciaUsuariosPermitidos
  ) => {
    if (opcion == "agregar") {
      setOpenModalAgregarUsuario(true);
      setModoEdicion(false);
    }
    if (opcion == "editar") {
      setOpenModalAgregarUsuario(true);
      setModoEdicion(true);
      setUsuarioSeleccionado(usuarioSeleccionado);
    }
  };

  const handleOpenModalExaminarProceso = (usuarioSeleccionadoId: ITransferenciaUsuariosPermitidos) => {
    setOpenModalAgregarProcesos(true);
    setUsuarioSeleccionado(usuarioSeleccionadoId);
  };

  return (
    <main className="w-full">
      {/* <SelectComponent
                control={control}
                inputLabel="Seleccione un sector"
                listaObjetos={listaSectores}
                nameSelect="sector"
                valueLabel={(value) => value.nombreSector}
                valueSelect={(value) => value.id}
                ValueSave={setSectorSeleccionado}
                valueKey={(value) => value}
            /> */}
      <TableComponent
        IDcolumn="id"
        buscar
        agregar={() => handleOpenModalAgregarEditarUsuario("agregar")}
        dataInfo={usuarios}
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Apellido",
            field: "apellido"
          },
          {
            title: "DNI",
            field: "dni"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <ActionsButtons
                  row={row}
                  edit
                  eliminar
                  info
                  infoTitle="Examinar Proceso"
                  onInfoProps={() => handleOpenModalExaminarProceso(row)}
                  onEditProps={() => handleOpenModalAgregarEditarUsuario("editar", row)}
                  onDeleteProps={() => eliminarUsuario(row.id)}
                />
              );
            }
          }
        ]}
      />
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarUsuario}
        openPopup={openModalAgregarUsuario}
        hiddenButtonClose
        title={`${modoEdicion ? "Editar" : "Crear"} Usuario`}>
        <AgregarEditarUsuario
          setOpenModal={setOpenModalAgregarUsuario}
          openModal={openModalAgregarUsuario}
          modoEdicion={modoEdicion}
          usuarioSeleccionado={usuarioSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarProcesos}
        openPopup={openModalAgregarProcesos}
        title="Agregar Proceso"
        hiddenButtonClose>
        <AgregarProcesosUsuarios
          openModal={openModalAgregarProcesos}
          setOpenModal={setOpenModalAgregarProcesos}
          usuarioSeleccionado={usuarioSeleccionado}
        />
      </ModalCompoment>
    </main>
  );
};
