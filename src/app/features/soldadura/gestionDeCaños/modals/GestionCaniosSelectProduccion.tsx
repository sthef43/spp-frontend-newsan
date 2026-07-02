import React, { useState } from "react";
import { ModalCompoment } from "../../../../shared/components/ModalComponent";
import { GestionCaniosForm } from "./GestionCaniosForm";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/material";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { IPlant } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";

interface Props {
  setOpenModalSeleccionProduccion: (newValue: boolean) => void;
  refresh: () => void;
  data: IDobCaniosSub;
}

interface defaultValue {
  plantaId: number;
  lineaId: number;
}

const initialValue = {
  plantaId: 0,
  lineaId: 0
};

export const GetionCaniosSelectProduccion: React.FC<Props> = ({ setOpenModalSeleccionProduccion, data, refresh }) => {
  const { control } = useForm<defaultValue>({ defaultValues: initialValue });
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setListaPlantas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaLineas, setListaLineas] = useState<ILineaProduccion[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
      if (response) {
        setListaLineas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="">
      <section className="flex gap-x-48 px-24 border-b-2 border-textColor pb-8">
        <div className="flex items-center flex-col ">
          <p className="text-4xl font-semibold rounded-full border border-primaryNew px-6 py-2 mb-4 text-primaryNew">
            1
          </p>
          <p className="text-primaryNew">Selección de Producción</p>
        </div>
        <div className="flex items-center flex-col ">
          <p className="text-4xl font-semibold rounded-full border border-textColor px-6 py-2 mb-4">2</p>
          <p className="">Ingreso de Stock</p>
        </div>
      </section>
      <section>
        <div>
          <Controller
            control={control}
            name="lineaId"
            defaultValue={0}
            render={({ field, fieldState }) => <FormControl></FormControl>}
          />
        </div>
      </section>
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Cargue la información">
        <GestionCaniosForm data={data} refresh={refresh} setModal={setOpenModal} />
      </ModalCompoment>
    </main>
  );
};
