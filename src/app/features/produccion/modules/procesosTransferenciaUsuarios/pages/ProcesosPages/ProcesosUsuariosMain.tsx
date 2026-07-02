import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { CLISectoresSliceRequest } from "app/features/cli/Middlewares/CliSectoresSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TransferenciaUsuariosProcesosSliceRequest } from "../../slices/TransferenciaUsuariosProcesosSlice";
import { ITransferenciaUsuariosProcesos } from "../../models/ITransferenciaUsuariosProcesos";
import { AgregarEditarProcesos } from "../../modals/procesosModals/AgregarEditarProcesos";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";

export const ProcesosUsuariosMain = () => {
  const { control } = useForm();

  const usuarios = useAppSelector(
    (state) => state.transferenciaUsuariosProcesos.dataAll as ITransferenciaUsuariosProcesos[]
  );

  const { FetchDelete } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [openModalAgregarUsuario, setOpenModalAgregarUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>(0);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<ITransferenciaUsuariosProcesos>();

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores, false);

  FetchApi<ITransferenciaUsuariosProcesos[]>(
    TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId,
    sectorSeleccionado,
    false,
    sectorSeleccionado,
    null,
    true
  );

  const eliminarUsuario = async (usuarioId: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: usuarioId,
      sliceRequest: TransferenciaUsuariosProcesosSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      titleUser: "Eliminar el Proceso",
      messageUser: "Desea eliminar el procesos seleccionado?",
      functionAdd: async () => {
        openNotificationUI("Se elimino el procesos con exito", "success");
        await dispatch(TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId(sectorSeleccionado as number));
      }
    });
  };

  const handleOpenModal = (opcion: string, usuarioSeleccionado?: ITransferenciaUsuariosProcesos) => {
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

  return (
    <main className="w-full">
      <SelectComponent
        control={control}
        inputLabel="Seleccione un sector"
        listaObjetos={listaSectores}
        nameSelect="sector"
        valueLabel={(value) => value.nombreSector}
        valueSelect={(value) => value.id}
        ValueSave={setSectorSeleccionado}
        valueKey={(value) => value}
      />
      {sectorSeleccionado !== 0 && (
        <TableComponent
          IDcolumn="id"
          buscar
          agregar={() => handleOpenModal("agregar")}
          dataInfo={usuarios}
          columns={[
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <ActionsButtons
                    row={row}
                    edit
                    onEditProps={() => handleOpenModal("editar", row)}
                    eliminar
                    onDeleteProps={() => eliminarUsuario(row.id)}
                  />
                );
              }
            }
          ]}
        />
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarUsuario}
        openPopup={openModalAgregarUsuario}
        hiddenButtonClose
        title={`${modoEdicion ? "Editar" : "Crear"} Proceso`}>
        <AgregarEditarProcesos
          setOpenModal={setOpenModalAgregarUsuario}
          openModal={openModalAgregarUsuario}
          modoEdicion={modoEdicion}
          usuarioSeleccionado={usuarioSeleccionado}
          sectorId={sectorSeleccionado as number}
        />
      </ModalCompoment>
    </main>
  );
};
