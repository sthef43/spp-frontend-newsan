/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { useAppDispatch } from "app/core/store/store";
import { IModelos, IPlant } from "app/models";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BlqouearPlacaPorStocker } from "../Components/BloquearPlacaPorStocker";
import { BloquearPorPlaca } from "../Components/BloquearPorPlaca";

interface defaultValue {
  plantaId: number;
  modeloId: number;
  fecha: string;
  opcionBloque: string;
}

const initialValue = {
  plantaId: 0,
  modeloId: 0,
  fecha: "",
  opcionBloque: ""
};

export const BloqueoDePlacas = () => {
  const { TitleChanger } = useTitleOfApp();
  const { control, watch, setValue, getValues } = useForm<defaultValue>({ defaultValues: initialValue });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [openModalStocker, setOpenModalStocker] = useState(false);
  const [openModalPlaca, setOpenModalPlaca] = useState(false);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [fechaInvalida, setFechaInvalida] = useState(false);

  const watchPlantaId = watch("plantaId");

  const [listaPlantas, setListaPlantaAux] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setListaPlantaAux(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const [listaModelos, setListaModelos] = useState<IModelos[]>([]);
  const getModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTipoUnidad("I")));
      if (response) {
        setListaModelos(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const openModal = (event) => {
    setValue("opcionBloque", event.target.value);
    if (getValues("opcionBloque").toLowerCase() == "locker") {
      setOpenModalStocker(true);
    } else if (getValues("opcionBloque").toLocaleLowerCase() == "unidad") {
      setOpenModalPlaca(true);
    }
  };

  useEffect(() => {
    TitleChanger("Bloqueo de Placas");
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlantaId) {
      getModelos();
    }
  }, [watchPlantaId]);

  useEffect(() => {
    if (openModalStocker || openModalPlaca) {
      setValue("opcionBloque", "");
    }
  }, [openModalStocker, openModalPlaca]);

  return (
    <main className="w-screen h-screen relative px-4">
      <section className="mt-10 flex w-full gap-x-4">
        <div className="w-1/4 p-2">
          <Controller
            name="plantaId"
            control={control}
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard">
                <InputLabel id="seleccionPlanta">Seleccione una planta</InputLabel>
                <Select {...field} labelId="seleccionPlanta" label="Seleccione una planta">
                  {listaPlantas.map((elementos) => (
                    <MenuItem key={elementos.id} value={elementos.id}>
                      <div className="w-full">
                        <div>{elementos.name}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="w-1/4 p-2">
          <Controller
            name="modeloId"
            control={control}
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard">
                <InputLabel id="seleccionModelo">Seleccione un modelo</InputLabel>
                <Select {...field} labelId="seleccionModelo" label="Seleccione un modelo">
                  {listaModelos.map((elementos) => (
                    <MenuItem key={elementos.idModelo} value={elementos.idModelo}>
                      <div className="w-full">
                        <div>{elementos.codigoModelo}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <SelectOfDate
          fechaDesdeHasta
          setFechaDesdeProps={setFechaDesde}
          setFechaHastaProps={setFechaHasta}
          setErrorProps={setFechaInvalida}
        />
      </section>
      <section className="w-full mt-8 flex justify-center flex-row">
        <div className="w-1/3">
          <Controller
            name="opcionBloque"
            control={control}
            defaultValue={""}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard">
                <InputLabel id="elegirBloque">Bloquear Placa Por: </InputLabel>
                <Select {...field} labelId="elegirBloque" label="Bloquera Placa Por" onChange={openModal}>
                  {["Unidad", "Locker"].map((elementos, index) => (
                    <MenuItem key={index} value={elementos}>
                      <div className="w-full">
                        <div>{elementos}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
      </section>
      <section className="w-full mt-28">
        <TableComponent
          IDcolumn="id"
          buscar
          columns={[
            {
              title: "Fecha",
              field: ""
            },
            {
              title: "Codigo de placa/Stocker",
              field: ""
            },
            {
              title: "Detalles del bloque",
              field: ""
            },
            {
              title: "Auditor",
              field: ""
            },
            {
              title: "Estado",
              field: ""
            },
            {
              title: "Acción",
              field: ""
            }
          ]}
        />
      </section>
      <ModalCompoment
        openPopup={openModalStocker}
        setOpenPopup={setOpenModalStocker}
        title="Bloquear Placa Por Stocker"
        onCloseDynamic
        showModalCenterPage
        titleModalStyle="New">
        <BlqouearPlacaPorStocker openModalStocker={openModalStocker} setOpenModalStocker={setOpenModalStocker} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalPlaca}
        setOpenPopup={setOpenModalPlaca}
        title="Bloquear Placa Por Unidad"
        onCloseDynamic
        showModalCenterPage
        titleModalStyle="New">
        <BloquearPorPlaca openModalPlaca={openModalPlaca} setOpenModalPlaca={setOpenModalPlaca} />
      </ModalCompoment>
    </main>
  );
};
