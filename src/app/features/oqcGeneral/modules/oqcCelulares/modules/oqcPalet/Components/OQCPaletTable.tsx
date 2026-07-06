import React, { useState } from "react";
import { TableComponent } from "../../../../../../../shared/components/Table/TableComponent";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { IOQCPalet } from "app/models/IOQCPalet";
import { OQCPaletPrint } from "../../../global/modals/OQCPaletPrint";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";
import { Build, MobileFriendlyRounded, Visibility } from "@mui/icons-material";
import { OQCPaletPrintTable } from "../modals/OQCPaletPrintTable";
import { OQCReprocesoMasterBox } from "../modals/ReprocesoPallet/OQCReprocesoMasterBox";
import { OQCReprocesoUnitario } from "../modals/reprocesoEquipoUnitario/OQCReprocesoUnitario";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAppUser } from "app/models/IAppUser";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { PopperComponent } from "app/shared/helpers/ComponentsMUIModify/PopperComponent";
import { EditIconEdited, EditRestoreRounded } from "app/shared/helpers/ComponentsMUIModify/IconsModified";
import { OQCEditPalet } from "../modals/OQCEditPalet";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { limpiarPalet } from "app/features/oqcGeneral/helpers/limpiarEntidad";

interface IOQCPaletTable {
  refresh?: () => void;
}
export const OQCPaletTable = ({ refresh }: IOQCPaletTable): JSX.Element => {
  const appUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const palets = useAppSelector<IOQCPalet[]>((state) => state.oqcPalet.dataAll);

  const dispatch = useAppDispatch();
  const { FetchPut } = useFetchApiMultiResults();

  const [form, setForm] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalReprocesoMaster, setModalReprocesoMaster] = useState(false);
  const [modalReprocesoUnitario, setOpenModalReprocesoUnitario] = useState(false);
  const [openModalEditPallet, setOpenModalEditPallet] = useState(false);

  const onImpresos = (palet: IOQCPalet) => {
    dispatch(oqcPaletPrintSlice.actions.setArray(palet.oqcPaletPrint));
    setModal(true);
  };

  const volverAbrirPallet = (pallet: IOQCPalet) => {
    const palletAbierto = limpiarPalet({ ...pallet, cerrado: true });
    FetchPut({
      consoleLog: false,
      modelPut: palletAbierto,
      sliceRequest: OQCPaletSliceRequests.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: `El palet seleccionado se volvera a abrir, ¿Deseas continuar?`,
      titleUser: "Volver a abrir Pallet",
      functionAdd: () => {
        refresh && refresh();
      }
    });
  };

  const onReprocesoUnitario = (palet: IOQCPalet) => {
    dispatch(oqcPaletSlice.actions.setObject(palet));
    setOpenModalReprocesoUnitario(true);
  };

  const onEditPallet = (palet: IOQCPalet) => {
    dispatch(oqcPaletSlice.actions.setObject(palet));
    setOpenModalEditPallet(true);
  };

  const onReprocesar = (palet: IOQCPalet) => {
    dispatch(oqcPaletPrintSlice.actions.setObject(null));
    dispatch(oqcPaletSlice.actions.setObject(palet));
  };

  return (
    <ContainerForPages activeEffectVisible optionsLayout="Table">
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Numero Pallet",
            field: "numeroPalet"
          },
          {
            title: "Total Muestras",
            field: "cantidadEquipos"
          },
          {
            title: "OQC",
            field: "oqcDesignada.oqc.nombre"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => <>{moment(row.createdDate).format("L")}</>
          },
          {
            title: "Cerrado",
            field: "",
            render: (row) => (row.cerrado ? "No" : "Si")
          },
          {
            title: "Conforme",
            field: "",
            render: (row) => (row.conforme ? "GOOD" : "NG")
          },
          {
            title: "Reprocesado",
            field: "",
            render: (row) => (row.reprocesado ? "Si" : "No")
          },
          {
            title: "Acciones",
            field: "",
            render: (row: IOQCPalet) => (
              <div className="flex flex-row gap-2">
                {!row.cerrado &&
                  !row.conforme &&
                  (appUser.permisos.subrol.name.toLowerCase().includes("re") ||
                    appUser.permisos.subrol.name.toLowerCase().includes("reproceso")) && (
                    <TooltipComponent
                      titleTooltip="Reproceso unitario"
                      typeTooltip="normal"
                      componenteIcono={<MobileFriendlyRounded color="primary" />}
                      onClick={() => onReprocesoUnitario(row)}
                    />
                  )}
                {appUser.permisos.subrol.name.toLowerCase().includes("admin") && !row.cerrado && (
                  <PopperComponent elemento={row} elementoIndex={(item) => item.id}>
                    <div
                      className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        onEditPallet(row);
                      }}>
                      <EditIconEdited />
                      <p className="font-semibold">Editar Palet</p>
                    </div>
                    <div
                      className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        volverAbrirPallet(row);
                      }}>
                      <EditRestoreRounded />
                      <p className="font-semibold">Re Abrir Palet</p>
                    </div>
                  </PopperComponent>
                )}
                <Tooltip
                  title="Ver impresos"
                  onClick={() => {
                    onImpresos(row);
                    onReprocesar(row);
                  }}>
                  <IconButton color="success">
                    <Visibility />
                  </IconButton>
                </Tooltip>
                {!row.conforme && !row.cerrado && (
                  <Tooltip
                    title="Reprocesar Pallet"
                    onClick={() => {
                      onReprocesar(row);
                      setModalReprocesoMaster(true);
                    }}>
                    <IconButton color="warning" disabled={row.reprocesado}>
                      <Build />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )
          }
        ]}
        buscar
        dataInfo={palets}
      />
      {/* Modal para imprimir palet */}
      <ModalCompoment
        openPopup={form}
        setOpenPopup={setForm}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Impresión de datos del palet"
        title="Imprimir palet">
        <OQCPaletPrint closeModal={setForm} refresh={refresh} />
      </ModalCompoment>
      {/* Modal para imprimir palet */}

      {/* Modal para ver impresiones */}
      <ModalCompoment
        openPopup={modal}
        setOpenPopup={setModal}
        title="Impresiones"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Impresiones realizadas durante el uso del pallet">
        <OQCPaletPrintTable closeModal={setModal} />
      </ModalCompoment>
      {/* Modal para ver impresiones */}

      {/* Modal para buscar master box */}
      <ModalCompoment
        openPopup={modalReprocesoMaster}
        setOpenPopup={setModalReprocesoMaster}
        title="Buscar Master Box"
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Reproceso de pallet completo">
        <OQCReprocesoMasterBox
          setOpenModal={setModalReprocesoMaster}
          openModal={modalReprocesoMaster}
          refresh={refresh}
        />
      </ModalCompoment>
      {/* Modal para buscar master box */}

      {/* Modal para reproceso unitario */}
      <ModalCompoment
        setOpenPopup={setOpenModalReprocesoUnitario}
        openPopup={modalReprocesoUnitario}
        title="Reprocesar Equipo"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Reproceso de equipo individual"
        onCloseDynamic>
        <OQCReprocesoUnitario openModal={modalReprocesoUnitario} setOpenModal={setOpenModalReprocesoUnitario} />
      </ModalCompoment>
      {/* Modal para reproceso unitario */}

      {/* Modal para editar pallet */}
      <ModalCompoment
        setOpenPopup={setOpenModalEditPallet}
        openPopup={openModalEditPallet}
        title="Editar Pallet"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Edición de pallet">
        <OQCEditPalet openModal={openModalEditPallet} setOpenModal={setOpenModalEditPallet} refresh={refresh} />
      </ModalCompoment>
      {/* Modal para editar pallet */}
    </ContainerForPages>
  );
};
