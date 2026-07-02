import { Button, FormControl, TextField } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OQCSliceRequests } from "app/features/oqcGeneral/slices/OQCSlice";
import { OQCBloqueSliceRequests } from "app/features/oqcGeneral/slices/OQCBloqueSlice";
import { OQCBloqueHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCBloqueHallazgoSlice";

interface Props {
  closeModal: (state: boolean) => void;
  hallazgo: IOQCBloqueHallazgo;
  bloqueConHallazgos: IOQCBloqueGroup;
  productoId: number;
  openModalPosition: boolean;
}

export const OQCPosicionHallazgo: React.FC<Props> = ({
  closeModal,
  openModalPosition,
  productoId,
  bloqueConHallazgos
}) => {
  const { control, watch, setValue, handleSubmit } = useForm();
  const { openNotificationUI } = useNotificationUI();
  const color = MaterialButtons();
  const dispatch = useAppDispatch();

  const agregarCambios = async (data) => {
    const datosInput: string[] = Object.values(data);
    const datosInputEnteros = datosInput.map((elementos) => parseInt(elementos, 10));
    const nuevaListaPosition = datosInputEnteros
      .map((elementos, index) => {
        const itemBloque = bloqueConHallazgos.oqcBloque.oqcBloqueHallazgo[index];
        return itemBloque ? { ...itemBloque, position: elementos } : null;
      })
      .filter(Boolean);
    nuevaListaPosition.forEach((elementos) => {
      delete elementos.oqcHallazgo;
    });
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(OQCBloqueHallazgoSliceRequests.multiPutRequest(nuevaListaPosition));
      console.log("hlooa");
      console.log(response);
      await dispatch(OQCBloqueSliceRequests.getAllByProductoIdRequest(productoId));
      await dispatch(OQCSliceRequests.getAllByProductoIdRequest(productoId));
      openNotificationUI("Se cambio la posicion correctamente", "success");
      if (response) {
        console.log(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (erorr) {
      console.log(erorr);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[25rem]">
      <form onSubmit={handleSubmit(agregarCambios)} className="w-full flex flex-col gap-y-4">
        {bloqueConHallazgos.oqcBloque.oqcBloqueHallazgo.map((elementos) => (
          <div key={elementos.id} className="w-full flex flex-col gap-y-4">
            <p>
              Hallazgo: <strong>{elementos.oqcHallazgo.nombre}</strong>
            </p>
            <Controller
              control={control}
              name={`${elementos.oqcHallazgo.id}`}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl>
                  <TextField fullWidth {...field} label="Ingrese un numero de position para el hallazgo" />
                </FormControl>
              )}
            />
          </div>
        ))}
        <div className="flex gap-5 justify-center mt-4">
          <Button className={color.greenButton} type="submit">
            Guardar
          </Button>
          <Button
            className={color.redButton}
            onClick={() => {
              closeModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
