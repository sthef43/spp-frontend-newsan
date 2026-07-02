import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RoutesAyudaPadresSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaPadresSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import React from "react";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshListaPadres: (newValue: IRoutesAyudaPadres[]) => void;
  listaPadre: IRoutesAyudaPadres[];
}

export const AñadirPadre: React.FC<Props> = ({ setOpenModal, refreshListaPadres, listaPadre }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  const añadirPadre = async (data) => {
    const nuevoPadre: IRoutesAyudaPadres = {
      padre: data.padre
    };

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(RoutesAyudaPadresSliceRequest.PostRequest(nuevoPadre));
      const getPadres = unwrapResult(await dispatch(RoutesAyudaPadresSliceRequest.getAllRequest()));
      if (getPadres) {
        refreshListaPadres(getPadres);
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const encontrarIngresado = (value: string, index: number) => {
    const inputs = document.querySelectorAll(".MuiFormControl");
    const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
    const encontrado = listaPadre.some((elementos) => {
      return value === elementos.padre;
    });
    if (encontrado) {
      inputActual.select();
      return "Padre Ya Ingresado";
    } else {
      return true;
    }
  };

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(añadirPadre)}>
        <TextFieldComponent
          control={control}
          nameInput="padre"
          labelInput="Ingrese El Padre"
          index={2}
          validacionAdicionales={encontrarIngresado}
          autoFocus
          requiredBool
          errors={errors}
          typeInput="outlined"
          valueDefault=""
        />
        <div className="w-full flex flex-row justify-center gap-x-6 mt-5">
          <Button disabled={!isValid} className={classes.blueButton} type="submit">
            Guardar
          </Button>
          <Button
            type="button"
            className={classes.redButton}
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
