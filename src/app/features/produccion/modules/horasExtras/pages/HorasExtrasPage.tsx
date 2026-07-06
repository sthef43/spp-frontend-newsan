/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { AddCircleRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { HoraExtraSliceRequests } from "app/Middleware/reducers/HoraExtraSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { HorasExtrasForm } from "app/features/produccion/modules/horasExtras/modals/HorasExtrasForm";
import { HorasExtrasProduccionTable } from "app/features/produccion/modules/horasExtras/components/HorasExtrasProduccionTable";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  desdeFecha: "",
  hastaFecha: "",
  productoId: 0
};
interface IDefaultValues {
  desdeFecha: string;
  hastaFecha: string;
  productoId: number;
}
export const HorasExtrasPage = (): JSX.Element => {
  const { watch, getValues, setValue } = useForm<IDefaultValues>({ defaultValues });

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const [error, setError] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const setproductoId = (id: number) => {
    setValue("productoId", id);
  };
  const setDesdeFecha = (fecha: string) => {
    setValue("desdeFecha", dayjs(fecha).format("YYYY-MM-DD"));
  };
  const setHastaFecha = (fecha: string) => {
    setValue("hastaFecha", dayjs(fecha).format("YYYY-MM-DD"));
  };

  const getAll = async (e: IDefaultValues) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      dispatch(
        HoraExtraSliceRequests.getAllByDateAndProductoIdRequest({
          productoId: e.productoId,
          desdeFecha: e.desdeFecha,
          hastaFecha: e.hastaFecha
        })
      );
    } catch (err) {
      openNotificationUI(err, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getLineas = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const response = await dispatch(LineaProduccionSliceRequests.getAllByProductId(getValues("productoId")));
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const getAllCL = () => {
    getAll(getValues());
  };

  useEffect(() => {
    TitleChanger("Manejo de horas extras");
  }, []);

  useEffect(() => {
    if (getValues("productoId") != 0) {
      getAll(getValues());
      getLineas();
    }
  }, [watch("productoId")]);

  useEffect(() => {
    if (getValues("productoId") != 0 && !error) {
      getAll(getValues());
    }
  }, [watch("desdeFecha"), watch("hastaFecha")]);

  return (
    <ContainerForPages optionsLayout="page">
      <div className="flex flex-row w-full justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">Gestion de Horas Extras</h2>
          <p className="text-gray-500 mt-1">
            Administra y consulta el historial de horas extras de la linea de produccion
          </p>
        </div>
        <div className="flex flex-row gap-x-4">
          <Button className={`${buttonClases.greenButton} py-2 px-5`} variant="contained">
            Exportar
          </Button>
          <Button
            className={`${buttonClases.blueButton} py-2 px-5`}
            variant="contained"
            onClick={() => setOpenModal(true)}>
            <AddCircleRounded sx={{ marginRight: "10px" }} />
            Agregar Hora Extra
          </Button>
        </div>
      </div>
      <ContainerForPages
        activeEffectVisible
        optionsLayout="personalized"
        classNamePersonalized="flex flex-col text-center w-full justify-between items-start bg-secondaryNew p-4 rounded-md shadow-md mt-6">
        <h1 className="text-xl font-bold px-2">Filtros de Busqueda</h1>
        <form className="w-full flex gap-x-4">
          <SelectOFPlantAndProducts
            notShadow
            setProductoId={setproductoId}
            deactivateStyles
            stylesForSelects="outlined"
          />
          {watch("productoId") != 0 && (
            <div className="w-full mr-3 m-auto">
              <SelectOfDate
                estilosPredeterminados
                stylesForSelects="outlined"
                setFechaDesdeProps={setDesdeFecha}
                setFechaHastaProps={setHastaFecha}
                fechaDesdeHasta
                setErrorProps={setError}
              />
            </div>
          )}
        </form>
      </ContainerForPages>
      {watch("productoId") != 0 && (
        <HorasExtrasProduccionTable refresh={getAllCL} productoId={getValues("productoId")} />
      )}
      <ModalCompoment
        subTitle="Completa los detalles para crear la solicitud de horas extras"
        showModalCenterPage
        titleModalStyle="Audit"
        title="Agregar horas extras"
        setOpenPopup={setOpenModal}
        openPopup={openModal}>
        <HorasExtrasForm
          refresh={getAllCL}
          openModal={setOpenModal}
          edicionActiva={false}
          data={null}
          productoId={getValues("productoId")}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
