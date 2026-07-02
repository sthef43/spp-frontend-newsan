/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DefectoImagenSliceRequest } from "app/Middleware/reducers/DefectoImagenSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { lineaProduccionFamiliaSlice } from "../../../../../Middleware/reducers/LineaProduccionFamiliaSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { IDefectoImagen } from "app/models/IDefectoImagen";
import { unwrapResult } from "@reduxjs/toolkit";
import { DefectoImagenTable } from "../Components/DefectoImagenTable";
import { DefectoImagenFormClone } from "../Components/DefectoImagenFormClone";

const defaultValues = {
  familia: ""
};

export const DefectoImagenPage = (): JSX.Element => {
  const { control, getValues, watch } = useForm({
    defaultValues: defaultValues
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();

  const lineaProdFamilia = useAppSelector((state) => state.lineaProduccionFamilia.dataAll);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const [tipoUnidad, setTipoUnidad] = useState("");
  const [openModalClone, setOpenModalClone] = useState(false);

  const onSubmit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(linea.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const [listaHallazgos, setListaHallazgos] = useState<IDefectoImagen[]>([]);
  const onGetAllByFamilia = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DefectoImagenSliceRequest.GetAllByFamilia(getValues("familia"))));
      if (response) {
        setListaHallazgos(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Configuracion de codigo de defecto en imagen");
  }, []);

  useEffect(() => {
    if (tipoUnidad != "") {
      onSubmit();
    }
  }, [tipoUnidad]);

  useEffect(() => {
    if (getValues("familia") != "") {
      onGetAllByFamilia();
      const linProdFam = lineaProdFamilia.find((fa) => fa.familia.nombre == getValues("familia"));
      dispatch(lineaProduccionFamiliaSlice.actions.setObject(linProdFam));
    }
  }, [watch("familia")]);

  return (
    <div className="flex flex-col justify-center p-4 ">
      <SelectOFPlantAndProducts selectLineas setTipoUnidadLinea={setTipoUnidad}>
        <Controller
          control={control}
          name="familia"
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="select-familia">Seleccione una familia</InputLabel>
              <Select labelId="select-familia" {...field} variant="standard">
                {lineaProdFamilia &&
                  linea &&
                  lineaProdFamilia.map((lineaprodFam) => (
                    <MenuItem
                      key={lineaprodFam.id}
                      value={
                        linea.id == 7 || linea.id == 10
                          ? "M" + lineaprodFam.familia.nombre
                          : lineaprodFam.familia.nombre
                      }>
                      <div className="w-full">
                        <div>
                          {linea.id == 7 || linea.id == 10
                            ? "M" + lineaprodFam.familia.nombre
                            : lineaprodFam.familia.nombre}
                        </div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
      </SelectOFPlantAndProducts>
      <div className="mt-2">
        <Button
          disabled={watch("familia") == ""}
          onClick={() => {
            setOpenModalClone(true);
          }}
          className={classes.greenButton}>
          Clonar Familia
        </Button>
      </div>
      <DefectoImagenTable
        listaDefectos={listaHallazgos}
        refresh={onGetAllByFamilia}
        tipoUnidad={tipoUnidad}
        familia={getValues("familia")}
      />
      <ModalCompoment setOpenPopup={setOpenModalClone} openPopup={openModalClone} title="Clonar Defectos">
        <DefectoImagenFormClone
          familiaDefectos={watch("familia")}
          listaHallazgos={listaHallazgos}
          openModalClone={openModalClone}
          setOpenModalClone={setOpenModalClone}
        />
      </ModalCompoment>
    </div>
  );
};
