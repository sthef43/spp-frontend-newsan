import React from "react";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, TextField } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLIItems } from "../../Models/ICLIItems";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { CLIItemsSliceRequest } from "../../Middlewares/CLIItemsSlice";

interface Props {
  setCloseModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLIItems[]) => void;
}

export const AgregarItems: React.FC<Props> = ({ setCloseModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { generateArticleCode } = UseGeneratorCodesForLabels();

  const descripcion: string = watch("descripcion");

  const onSubmit = async (data) => {
    const itemAgregado = setearNuevoItem(data.nombreItem, data.descripcion);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CLIItemsSliceRequest.PostRequest(itemAgregado)));
      const refreshListaItems = unwrapResult(await dispatch(CLIItemsSliceRequest.getAllRequest()));
      if (response) {
        openNotificationUI("Se agrego correctamente el nuevo item.", "success");
        refreshLista(refreshListaItems);
        setCloseModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
  };

  const setearNuevoItem = (nombreItemIngresado, descripcionItem) => {
    const articuloGenerado = generarArticulo();
    const nuevoItem: ICLIItems = {
      nombreItem: nombreItemIngresado,
      descripcion: descripcionItem,
      articulo: articuloGenerado
    };
    if (nuevoItem === undefined || nuevoItem === null) {
      openNotificationUI("Ocurrio un error", "warning");
    }
    return nuevoItem;
  };

  const generarArticulo = () => {
    const articuloGenerado = generateArticleCode(["A", "B", "C", "D", "E", "F"], 12, 3);
    if (articuloGenerado != "") {
      return articuloGenerado;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[45vw]">
      <section className="mt-4 flex flex-row gap-x-4 justify-between">
        <div className="w-full">
          <Controller
            control={control}
            name="nombreItem"
            defaultValue=""
            rules={{ required: "Ingrese el nombre del item" }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                label="Ingrese el nombre del item"
                error={!!errors.nombreItem}
                helperText={errors.nombreItem?.message}
                variant="outlined"
              />
            )}
          />
        </div>
      </section>
      <section className="mt-4">
        <div className="w-full">
          <Controller
            control={control}
            name="descripcion"
            defaultValue=""
            rules={{ required: "Ingrese una descripcion" }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                label="Ingrese una descripcion"
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                variant="outlined"
              />
            )}
          />
        </div>
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button disabled={descripcion == undefined} type="submit" className={buttonClases.greenButton}>
            Agregar
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              setCloseModal(false);
            }}
            className={buttonClases.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </form>
  );
};
