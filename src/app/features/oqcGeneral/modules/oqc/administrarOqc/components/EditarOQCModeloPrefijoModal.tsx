import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IOQCModeloPrefijo } from "app/models/IOQCModeloPrefijo";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { OQCModeloPrefijoSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloPrefijoSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  modeloPrefijoSeleccionado: IOQCModeloPrefijo;
  refreshList: (newValue: IOQCModeloPrefijo[]) => void;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const EditarOQCModeloPrefijoModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  modeloPrefijoSeleccionado,
  refreshList
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const classes = MaterialButtons();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const editarPrefijoModelo = async (data) => {
    const modeloPrefijoEditado = generarEdicion(data);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCModeloPrefijoSliceRequests.PutRequest(modeloPrefijoEditado)));
      if (response) {
        const responses = unwrapResult(await dispatch(OQCModeloPrefijoSliceRequests.getAllRequest()));
        refreshList(responses);
        openNotificationUI("Se edito correctamente el prefijo del modelo", "success");
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarEdicion = (data) => {
    try {
      const nuevaEdiicion: IOQCModeloPrefijo = {
        id: modeloPrefijoSeleccionado.id,
        prefijo: data.prefijo,
        fichaTecnica: data.fichaTecnica,
        etiquetaCNC: data.etiquetaCnc,
        etiquetaFuenteAlimentacion: data.etiquetaFuenteAlimentacion,
        modelo: data.modelo,
        fichaGarantia: data.fichaGarantia,
        etiquetaEAN: data.etiquetaEAN,
        etiquetaCableUSB: data.etiquetaCableUsb,
        manual: data.manual,
        accesoGuiado: data.accesoGuiado,
        feDeErratas: data.feDeErratas,
        etiquetaFilmProtector: data.etiquetaFilmProtector,
        etiquetaEE: data.etiquetaEE,
        guiaMagicControl: data.guiaMagicControl,
        etiquetaQr: data.etiquetaQr
      };

      if (nuevaEdiicion != null) {
        return nuevaEdiicion;
      }
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  return (
    <main className="w-[70vw]">
      <form onSubmit={handleSubmit(editarPrefijoModelo)} className="grid grid-cols-3 gap-x-24">
        <TextFieldComponent
          control={control}
          index={0}
          nameInput="prefijo"
          labelInput="Ingrese el prefijo"
          valueDefault={modeloPrefijoSeleccionado.prefijo ? modeloPrefijoSeleccionado.prefijo : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={1}
          nameInput="fichaTecnica"
          labelInput="Ingrese la ficha técnica"
          valueDefault={modeloPrefijoSeleccionado.fichaTecnica ? modeloPrefijoSeleccionado.fichaTecnica : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={2}
          nameInput="etiquetaCnc"
          labelInput="Ingrese la etiqueta CNC"
          valueDefault={modeloPrefijoSeleccionado.etiquetaCNC ? modeloPrefijoSeleccionado.etiquetaCNC : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={3}
          nameInput="etiquetaFuenteAlimentacion"
          labelInput="Ingrese la etiqueta de fuente de alimentacion"
          valueDefault={
            modeloPrefijoSeleccionado.etiquetaFuenteAlimentacion
              ? modeloPrefijoSeleccionado.etiquetaFuenteAlimentacion
              : "-"
          }
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={4}
          nameInput="modelo"
          labelInput="Ingrese el modelo"
          valueDefault={modeloPrefijoSeleccionado.modelo ? modeloPrefijoSeleccionado.modelo : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={5}
          nameInput="fichaGarantía"
          labelInput="Ingrese la ficha de garantia"
          valueDefault={modeloPrefijoSeleccionado.fichaGarantia ? modeloPrefijoSeleccionado.fichaGarantia : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={6}
          nameInput="etiquetaEAN"
          labelInput="Ingrese la etiqueta EAN"
          valueDefault={modeloPrefijoSeleccionado.etiquetaEAN ? modeloPrefijoSeleccionado.etiquetaEAN : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={7}
          nameInput="etiquetaCableUsb"
          labelInput="Ingrese la etiqueta del cable USB"
          valueDefault={modeloPrefijoSeleccionado.etiquetaCableUSB ? modeloPrefijoSeleccionado.etiquetaCableUSB : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={8}
          nameInput="manual"
          labelInput="Ingrese el manual"
          valueDefault={modeloPrefijoSeleccionado.manual ? modeloPrefijoSeleccionado.manual : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={9}
          nameInput="accesoGuiado"
          labelInput="Ingrese el acceso guiado"
          valueDefault={modeloPrefijoSeleccionado.accesoGuiado ? modeloPrefijoSeleccionado.accesoGuiado : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={10}
          nameInput="feDeErratas"
          labelInput="Ingrese la fe de erratas"
          valueDefault={modeloPrefijoSeleccionado.feDeErratas ? modeloPrefijoSeleccionado.feDeErratas : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={11}
          nameInput="etiquetaFilmProtector"
          labelInput="Ingrese la etiqueta del film protector"
          valueDefault={
            modeloPrefijoSeleccionado.etiquetaFilmProtector ? modeloPrefijoSeleccionado.etiquetaFilmProtector : "-"
          }
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={12}
          nameInput="etiquetaEE"
          labelInput="Ingrese la etiqueta EE"
          valueDefault={modeloPrefijoSeleccionado.etiquetaEE ? modeloPrefijoSeleccionado.etiquetaEE : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={13}
          nameInput="guiaMagicControl"
          labelInput="Ingrese la guia de magic control"
          valueDefault={modeloPrefijoSeleccionado.guiaMagicControl ? modeloPrefijoSeleccionado.guiaMagicControl : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <TextFieldComponent
          control={control}
          index={14}
          nameInput="etiquetaQr"
          labelInput="Ingrese la etiqueta QR"
          valueDefault={modeloPrefijoSeleccionado.etiquetaQr ? modeloPrefijoSeleccionado.etiquetaQr : "-"}
          typeInput="standard"
          errors={errors}
          requiredBool
        />
        <div className="grid justify-self-center grid-flow-col col-start-2 gap-x-4 mt-4">
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isValid}>
            Agregar
          </Button>
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
            className={classes.redButton}
            type="submit"
            variant="contained">
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
