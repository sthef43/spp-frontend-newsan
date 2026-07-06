/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";
import { TrazaUnit2SliceRequest } from "app/Middleware/reducers/trazaUnit2Slice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { ArrowCircleUpRounded } from "@mui/icons-material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ITrazaUnit2 } from "app/models/ITrazaUnit2";
import { unwrapResult } from "@reduxjs/toolkit";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { ReporteProduccionAutomotriz } from "app/models/Stored Procdure/ReporteProduccionAutomotriz";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { Button } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AltaPlacasMasivamenteModal } from "../Modals/AltaPlacasMasivamenteModal";

export const AltaAutomotriz: React.FC = () => {
  const buttonClases = MaterialButtons();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { FetchPut } = useFetchApiMultiResults();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [placasRechazadas, setPlacasRechazadas] = useState<ITrazaUnit2[]>([]);
  const [reporteProduccionAutomotriz, setReporteProduccionAutomotriz] = useState<ReporteProduccionAutomotriz[]>([]);

  FetchApi<ITrazaUnit2[]>(
    TrazaUnit2SliceRequest.getAllPlatesRejected,
    null,
    false,
    null,
    setPlacasRechazadas,
    false,
    false,
    false
  );

  FetchApi<ReporteProduccionAutomotriz[]>(
    TrazaUnit2SliceRequest.getReportProductionByPosition,
    null,
    false,
    null,
    setReporteProduccionAutomotriz,
    false,
    false,
    false
  );

  const darAltaPlaca = (placa: ITrazaUnit2) => {
    const clonPlaca: ITrazaUnit2 = { codigo: placa.codigo, rechazado: false };
    FetchPut({
      consoleLog: false,
      modelPut: clonPlaca,
      sliceRequest: TrazaUnit2SliceRequest.actualizarRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "La placa seleccionada se dara de alta, desea continuar?",
      titleUser: "Cambiar estado de placa",
      functionAdd: async (response) => {
        if (response) {
          await dispatch(RechazoSliceRequests.multiDeleteRequest(placa.codigo));
          openNotificationUI("La placa se dio de alta correctamente", "success");
          const responsePlacasRechazadas = unwrapResult(await dispatch(TrazaUnit2SliceRequest.getAllPlatesRejected()));
          setPlacasRechazadas(responsePlacasRechazadas);
        }
      }
    });
  };

  useEffect(() => {
    TitleChanger("Alta Placas Automotriz");
  }, []);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <section className="flex flex-row items-center gap-x-4">
        <Button variant="contained" className={buttonClases.blueButton} onClick={() => setOpenModal(true)}>
          Dar de alta masivamente
        </Button>
        <ExportExcel
          title="Reporte Produccion Por Puesto"
          titleButton="Exportar Produccion"
          stylesButton="m-0"
          data={reporteProduccionAutomotriz}
          columns={[
            {
              title: "Cantidad",
              field: "cantidad"
            },
            {
              title: "Nombre Puesto",
              field: "nombrePuesto"
            }
          ]}
        />
      </section>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={placasRechazadas}
          columns={[
            {
              title: "Codigo Placa",
              field: "codigo"
            },
            {
              title: "Fecha",
              field: "",
              render: (row: ITrazaUnit2) =>
                formatDateHourOrMinutes({
                  optionDate: "onlyDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: row.createdDate
                })
            },
            {
              title: "Hora",
              field: "",
              render: (row: ITrazaUnit2) =>
                formatDateHourOrMinutes({
                  optionDate: "onlyHourAndDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: row.createdDate
                })
            },
            {
              title: "Estado",
              field: "",
              render: (row) => {
                return row.rechazado ? "Rechazado" : "Aprobado";
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row: ITrazaUnit2) => {
                return (
                  <TooltipComponent
                    onClick={() => darAltaPlaca(row)}
                    typeTooltip="normal"
                    titleTooltip="Dar de alta placa"
                    componenteIcono={<ArrowCircleUpRounded color="primary" />}
                  />
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        showModalCenterPage
        title="Alta Masivamente"
        subTitle="Dar de alta placas de forma masiva"
        titleModalStyle="Audit">
        <AltaPlacasMasivamenteModal setOpenModal={setOpenModal} openModal={openModal} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
