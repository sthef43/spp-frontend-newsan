import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AjusteSliceRequests } from "app/Middleware/reducers/AjusteSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IPlant } from "app/models";
import { IAjuste } from "app/models/IAjuste";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { AjusteTable } from "../Components/AjusteTable";
import { AjusteForm } from "../Modals/AjusteForm";

const defaultValuesForm = {
  linea: 0,
  plantId: 0
};

export const AjusteLineaPage = () => {
  const { control, watch, setValue } = useForm({ defaultValues: defaultValuesForm });

  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const ajuste = useAppSelector((s) => s.ajuste?.object);

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openModal, setOpenModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<IAjuste>();
  const [lineas, setLineas] = useState<ILinea[]>([]);
  const lineaWatch = watch("linea");

  const handleReset = async () => {
    try {
      if (ajuste.ajuste1 != 0) {
        const confirm = await getConfirmation("Quitar ajuste", "Esta seguro de quitar el ajuste?");
        if (confirm) {
          const objectSubmit = { ...ajuste, ajuste1: 0 };
          const response = await dispatch(AjusteSliceRequests.putRequest(objectSubmit));
          response && openNotificationUI("Se quito el ajuste correctamente", "success");
          getAjusteLinea();
        }
      } else {
        openNotificationUI("El ajuste esta en 0", "warning");
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const handleEdit = () => {
    setDataEdit(ajuste);
    setOpenModal(true);
  };

  const getAjusteLinea = async () => {
    try {
      await dispatch(AjusteSliceRequests.getByLineaId(lineaWatch));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const getLineas = async (plantId: number) => {
    const result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    if (result) setLineas(result.filter((x) => x.plantId == plantId));
  };

  useEffect(() => {
    TitleChanger("Ajuste de linea");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);

  useEffect(() => {
    lineaWatch != 0 && getAjusteLinea();
  }, [lineaWatch]);

  return (
    <div className="h-full p-4">
      <div className="p-4 my-4 rounded-lg bg-secondaryNew flex gap-4 shadow-md">
        {plantas && (
          <FormControl fullWidth variant="standard">
            <InputLabel>Planta</InputLabel>
            <Controller
              name="plantId"
              control={control}
              rules={{ required: "Seleccione una planta." }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={(e) => {
                    setValue("plantId", parseInt(e.target.value.toString()));
                    getLineas(parseInt(e.target.value.toString()));
                  }}>
                  {plantas &&
                    plantas.map((plant) => (
                      <MenuItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
        )}
        {/* ----------------LINEA---------------*/}
        {lineas && (
          <FormControl fullWidth variant="standard">
            <InputLabel variant="standard">Seleccione una linea</InputLabel>
            <Controller
              name="linea"
              control={control}
              rules={{ required: "Seleccione una línea." }}
              render={({ field }) => (
                <Select {...field}>
                  {lineas &&
                    lineas.map((linea) => (
                      <MenuItem key={linea.idLinea} value={linea.idLinea}>
                        <div className="w-full">
                          <div>{linea.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
        )}
      </div>
      {lineaWatch != 0 && (
        <div className="animate__animated animate__backInLeft">
          <AjusteTable handleEdit={handleEdit} handleReset={handleReset} />
        </div>
      )}
      <ModalCompoment setOpenPopup={setOpenModal} title="Editar ajuste" openPopup={openModal}>
        <AjusteForm ajuste={dataEdit} setOpenModal={setOpenModal} refresh={getAjusteLinea} />
      </ModalCompoment>
    </div>
  );
};
