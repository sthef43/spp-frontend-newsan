/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import FetchApi from "app/shared/helpers/FetchApi";
import { ITrazaUnit2 } from "app/models/ITrazaUnit2";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { Button } from "@mui/material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { unwrapResult } from "@reduxjs/toolkit";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TrazaUnit2SliceRequest } from "app/features/calidad/slices/trazaUnit2Slice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AltaPlacasMasivamenteModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { FetchPut } = useFetchApiMultiResults();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { openNotificationUI } = useNotificationUI();

  const [activeFetch, setActiveFetch] = useState<boolean>(false);

  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [placasRechazadas, setPlacasRechazadas] = useState<ITrazaUnit2[]>([]);

  FetchApi<ITrazaUnit2[]>(
    TrazaUnit2SliceRequest.GetAllPLatesRejectedByDates,
    { fechaDesde: fechaDesde, fechaHasta: fechaHasta },
    false,
    activeFetch,
    setPlacasRechazadas,
    true,
    false,
    true,
    () => {
      setActiveFetch(false);
    }
  );

  const darAltaPlacaMasivamente = () => {
    FetchPut({
      consoleLog: false,
      modelPut: placasRechazadas,
      sliceRequest: TrazaUnit2SliceRequest.DischargeAllPlates,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "Las placas que se encuentran en la lista se daran de alta, ¿desea continuar?",
      titleUser: "Dar de alta placas masivamente",
      functionAdd: async () => {
        const barcdoes = placasRechazadas.map((item) => item.codigo);
        const responseDelete = unwrapResult(await dispatch(RechazoSliceRequests.deleteMultiBarcode(barcdoes)));
        if (responseDelete) {
          openNotificationUI("Placas dadas de alta correctamente", "success");
          setOpenModal(false);
        }
      }
    });
  };

  useEffect(() => {
    if (fechaDesde || fechaHasta) {
      setActiveFetch(true);
    }
  }, [fechaDesde, fechaHasta]);

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[80vw]" activeEffectVisible>
      <div>
        <SelectOfDate fechaDesdeHasta setFechaDesdeProps={setFechaDesde} setFechaHastaProps={setFechaHasta} />
      </div>
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
            }
          ]}
        />
      </ContainerForPages>
      <div className="flex w-full justify-center items-center gap-x-4 mt-4">
        <Button variant="contained" className={buttonClases.blueButton} onClick={darAltaPlacaMasivamente}>
          Dar Alta
        </Button>
        <Button variant="contained" className={buttonClases.redButton} onClick={() => setOpenModal(false)}>
          Cancelar
        </Button>
      </div>
    </ContainerForPages>
  );
};
