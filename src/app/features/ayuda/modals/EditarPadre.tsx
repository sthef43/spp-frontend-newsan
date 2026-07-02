import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { RoutesAyudaPadresSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaPadresSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModalEditarPadre: (newValue: boolean) => void;
  refreshListaPadres: (newValue: IRoutesAyudaPadres[]) => void;
  listaPadres: IRoutesAyudaPadres[];
  padreSeleccionado: IRoutesAyudaPadres;
}

export const EditarPadre: React.FC<Props> = ({
  setOpenModalEditarPadre,
  padreSeleccionado,
  refreshListaPadres,
  listaPadres
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  const onSubmit = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const padreEditado = { ...padreSeleccionado, padre: data.padre };
      await dispatch(RoutesAyudaPadresSliceRequest.PutRequest(padreEditado));
      const getPadres = unwrapResult(await dispatch(RoutesAyudaPadresSliceRequest.getAllRequest()));
      if (getPadres) {
        refreshListaPadres(getPadres);
        setOpenModalEditarPadre(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const verificarValue = (value: string, _index: number) => {
    const encontrado = listaPadres.some((elementos) => {
      return elementos.padre === value;
    });
    if (encontrado) {
      return "Este Padre Ya Esta Ingresado";
    } else {
      return;
    }
  };

  return (
    <main className="w-[50vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldComponent
          control={control}
          nameInput="padre"
          labelInput="Ingrese El Padre"
          index={0}
          validacionAdicionales={verificarValue}
          autoFocus
          requiredBool
          errors={errors}
          typeInput="outlined"
          valueDefault={padreSeleccionado.padre}
        />
        <div className="w-full flex flex-row justify-center gap-x-6 mt-5">
          <Button disabled={!isValid} className={classes.blueButton} type="submit">
            Guardar
          </Button>
          <Button
            type="button"
            className={classes.redButton}
            onClick={() => {
              setOpenModalEditarPadre(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
