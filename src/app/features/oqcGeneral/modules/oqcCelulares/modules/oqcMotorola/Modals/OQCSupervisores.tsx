/* eslint-disable unused-imports/no-unused-vars */
import { OQCSupervisoresMotorolaSliceRequest } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import React, { useContext, useState } from "react";
import { ContextApp } from "../../../Context/Context";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { Delete, Edit } from "@mui/icons-material";
import { AgregarEditarSupervisoresModal } from "./AgregarEditarSupervisoresModal";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const EditarSupervisores: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const contextGlobal = useContext(ContextApp);

  const { FetchDelete } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [openModalAgregarSupervisores, setOpenModalAgregarSupervisores] = useState(false);
  const [edicionActiva, setEdicionActiva] = useState(false);

  const [activeFetch, setActiveFetch] = useState(true);

  const [datosSupervisor, setDatosSupervisor] = useState<IOQCSupervisoresMotorola>();
  const [listaSupervisores, setListaSupervisores] = useState<IOQCSupervisoresMotorola[]>([]);

  FetchApi<IOQCSupervisoresMotorola[]>(
    OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId,
    contextGlobal.plantaId,
    false,
    activeFetch,
    setListaSupervisores,
    true,
    false,
    false,
    () => {
      setActiveFetch(false);
    }
  );

  //Con esta funcion que me trae el supervisor seleccionado extraigo el id de ese supervisor y si lo encuentra lo borra de la base de datos
  const eliminarSupervisor = async (datosSupervisor: IOQCSupervisoresMotorola) => {
    const supervisorEliminado = { ...datosSupervisor };
    delete supervisorEliminado.plant;
    FetchDelete({
      consoleLog: false,
      deleteId: supervisorEliminado.id,
      sliceRequest: OQCSupervisoresMotorolaSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "Se eliminar el supervisor seleccionado, ¿Desea continuar?",
      titleUser: "Eliminar Supervisor",
      functionAdd: async () => {
        openNotificationUI("Se elimino el supervisor seleccionado", "success");
        setActiveFetch(true);
        const response = unwrapResult(
          await dispatch(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId(contextGlobal.plantaId))
        );
        contextGlobal.setListaOperarios(response);
      }
    });
  };

  const manageSupervisorModal = (row?: IOQCSupervisoresMotorola) => {
    setOpenModalAgregarSupervisores(true);
    setEdicionActiva(row ? true : false);
    setDatosSupervisor(row);
  };

  return (
    <main className="w-[80vw]">
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          dataInfo={listaSupervisores}
          IDcolumn="id"
          buscar={true}
          agregar={() => manageSupervisorModal()}
          columns={[
            {
              title: "Nombre Supervisor",
              field: "nombre"
            },
            {
              title: "Planta",
              field: "plant.name"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <main className="flex flex-row justify-start gap-x-2">
                    <TooltipComponent
                      onClick={() => eliminarSupervisor(row)}
                      titleTooltip="Eliminar Supervisor"
                      typeTooltip="normal"
                      componenteIcono={<Delete color="error" />}
                    />
                    <TooltipComponent
                      titleTooltip="Editar Supervisor"
                      typeTooltip="normal"
                      onClick={() => manageSupervisorModal(row)}
                      componenteIcono={<Edit color="primary" />}
                    />
                  </main>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarSupervisores}
        openPopup={openModalAgregarSupervisores}
        title={`${edicionActiva ? "Editar Supervisor" : "Agregar Supervisor"}`}>
        <AgregarEditarSupervisoresModal
          setListaSupervisores={setListaSupervisores}
          datosSupervisor={datosSupervisor}
          openModal={openModalAgregarSupervisores}
          setOpenModal={setOpenModalAgregarSupervisores}
          edicionActiva={edicionActiva}
        />
      </ModalCompoment>
    </main>
  );
};
