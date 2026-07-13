import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { AjusteSliceRequests } from "app/Middleware/reducers/AjusteSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IPlant } from "app/models";
import { IAjuste } from "app/models/IAjuste";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { AjusteTable } from "../Components/AjusteTable";
import { AjusteForm } from "../Modals/AjusteForm";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

interface AjusteLineaForm {
  linea: number;
  plantId: number;
}

const defaultValuesForm: AjusteLineaForm = {
  linea: 0,
  plantId: 0
};

export const AjusteLineaPage = () => {
  const { control, watch, setValue } = useForm<AjusteLineaForm>({ defaultValues: defaultValuesForm });

  const plantas = useAppSelector((state) => state.plant.dataAll ?? []);
  const ajuste = useAppSelector((s) => s.ajuste?.object);
  const loading = useAppSelector((state) => state.ajuste?.loading);

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openModal, setOpenModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<IAjuste>();
  const [lineas, setLineas] = useState<ILinea[]>([]);
  const lineaWatch = useWatch({ control, name: "linea" });

  const getAjusteLinea = useCallback(async () => {
    try {
      await dispatch(AjusteSliceRequests.getByLineaId(lineaWatch)).unwrap();
    } catch (e) {
      openNotificationUI(e as string, "error");
    }
  }, [dispatch, lineaWatch, openNotificationUI]);

  const getLineas = useCallback(
    async (plantId: number) => {
      try {
        const result = await dispatch(LineaSliceRequests.getAllRequest()).unwrap();
        if (result) setLineas(result.filter((x) => x.plantId === plantId));
      } catch (e) {
        openNotificationUI(e as string, "error");
      }
    },
    [dispatch, openNotificationUI]
  );

  const handleReset = async () => {
    try {
      if (!ajuste) return;

      if (ajuste.ajuste1 !== 0) {
        const confirm = await getConfirmation("Quitar ajuste", "Esta seguro de quitar el ajuste?");
        if (confirm) {
          const objectSubmit = { ...ajuste, ajuste1: 0 };
          await dispatch(AjusteSliceRequests.putRequest(objectSubmit)).unwrap();
          openNotificationUI("Se quito el ajuste correctamente", "success");
          await getAjusteLinea();
        }
      } else {
        openNotificationUI("El ajuste esta en 0", "warning");
      }
    } catch (e) {
      openNotificationUI(e as string, "error");
    }
  };

  const handleEdit = () => {
    if (!ajuste) return;
    setDataEdit(ajuste);
    setOpenModal(true);
  };

  useEffect(() => {
    TitleChanger("Ajuste de linea");
    dispatch(PlantSliceRequests.getAllRequest())
      .unwrap()
      .catch((e) => {
        openNotificationUI(String(e), "error");
      });
  }, [TitleChanger, dispatch, openNotificationUI]);

  useEffect(() => {
    if (lineaWatch !== 0) {
      getAjusteLinea();
    }
  }, [lineaWatch, getAjusteLinea]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Selects">
        <FormControl fullWidth variant="standard">
          <InputLabel>Planta</InputLabel>
          <Controller
            name="plantId"
            control={control}
            rules={{ required: "Seleccione una planta." }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.toString());
                    field.onChange(value);
                    setValue("linea", 0);
                    getLineas(value);
                  }}>
                  {plantas.map((plant) => (
                    <MenuItem key={plant.id} value={plant.id}>
                      {plant.name}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <Typography variant="caption" color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </FormControl>

        <FormControl fullWidth variant="standard">
          <InputLabel variant="standard">Seleccione una linea</InputLabel>
          <Controller
            name="linea"
            control={control}
            rules={{ required: "Seleccione una línea." }}
            render={({ field, fieldState }) => (
              <>
                <Select {...field}>
                  {lineas.map((linea) => (
                    <MenuItem key={linea.idLinea} value={linea.idLinea}>
                      <div className="w-full">
                        <div>{linea.descripcion}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <Typography variant="caption" color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </FormControl>
      </ContainerForPages>

      {lineaWatch !== 0 && (
        <ContainerForPages optionsLayout="Table">
          {loading === "pending" ? (
            <div className="flex justify-center items-center h-[200px]">
              <span className="text-textNew text-[14px]">Cargando ajuste...</span>
            </div>
          ) : ajuste ? (
            <AjusteTable handleEdit={handleEdit} handleReset={handleReset} />
          ) : (
            <div className="py-8 text-center text-textNew text-[12px]">
              No se encontró ajuste para esta línea
            </div>
          )}
        </ContainerForPages>
      )}

      <ModalCompoment setOpenPopup={setOpenModal} title="Editar ajuste" openPopup={openModal}>
        <AjusteForm ajuste={dataEdit} setOpenModal={setOpenModal} refresh={getAjusteLinea} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
