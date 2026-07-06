/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { IRechazo } from "app/models/IRechazo";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { Grow } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { SwapHorizRounded } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ReasignarNumeroTraza } from "../modals/ReasignarNumeroTraza";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { IInicio } from "app/models";

export const ReasignarNumeroSerie = () => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { formatDateHourOrMinutes } = UseUtilHooks();

  const [openModal, setOpenModal] = useState(false);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [infoTraza, setInfoTraza] = useState<IInicio>();

  const [listRechazos, setListRechazos] = useState<IRechazo[]>([]);
  const getRechazos = async () => {
    try {
      const response = unwrapResult(
        await dispatch(RechazoSliceRequests.GetListRejectionByDrain({ fechaDesde, fechaHasta }))
      );
      if (response) {
        setListRechazos(response);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`${error}`, "error");
    }
  };

  const handelOpenModal = async (barcode: string) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(await dispatch(InicioSliceRequests.getByCodigoTrazabilidad(barcode)));
      if (response) {
        setInfoTraza(response);
        setOpenModal(true);
      } else {
        openNotificationUI("No se encontro la trazabilidad", "error");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`${error}`, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    TitleChanger("Reasignar numero de serie");
  }, []);

  useEffect(() => {
    if (fechaDesde && fechaHasta) {
      getRechazos();
    }
  }, [fechaDesde, fechaHasta]);

  return (
    <main className="p-4 w-full">
      <section className="w-full bg-secondaryNew p-4 rounded-md shadow-md flex flex-row justify-between">
        <SelectOfDate fechaDesdeHasta setFechaDesdeProps={setFechaDesde} setFechaHastaProps={setFechaHasta} />
      </section>
      <Grow in={listRechazos.length > 0} timeout={200}>
        <section className="w-full bg-secondaryNew p-4 rounded-md shadow-md mt-4">
          <TableComponent
            buscar
            IDcolumn="idRechazo"
            columns={[
              {
                title: "Codigo Trazabilidad",
                field: "barcode"
              },
              {
                title: "Puesto",
                field: "puesto"
              },
              {
                title: "Estado",
                field: "estado"
              },
              {
                title: "Familia",
                field: "familia"
              },
              {
                title: "Descripcion Rechazo",
                field: "descripcionRechazo"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => (
                  <>
                    <TooltipComponent
                      titleTooltip="Reasignar Trazabilidad"
                      typeTooltip="normal"
                      sizeButton="small"
                      componenteIcono={<SwapHorizRounded color="primary" sx={{ fontSize: "2rem" }} />}
                      onClick={() => handelOpenModal(row.barcode)}
                    />
                  </>
                )
              }
            ]}
            dataInfo={listRechazos}
          />
        </section>
      </Grow>
      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title="Reasignar Trazabilidad">
        <ReasignarNumeroTraza openModal={openModal} setOpenModal={setOpenModal} infoTraza={infoTraza} />
      </ModalCompoment>
    </main>
  );
};
