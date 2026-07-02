import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IGenerico } from "app/models";
import { ISupermaestro } from "app/models/ISupermaestro";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
interface Props {
  generico: string;
}
export const SupermaestroDataTansfer = ({ generico }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const genericos: IGenerico[] = useAppSelector((data) => data.generico.dataAll);
  const supermaestros: ISupermaestro[] = useAppSelector((data) => data.supermaestro.dataAll);
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();
  const [openModal, setOpenModal] = useState(false);
  const OnTranfer = () => {
    setOpenModal(true);
  };
  const { control, watch, getValues } = useForm({
    defaultValues: { generico: "" }
  });
  const dispatch = useAppDispatch();
  const OnSubmit = async (e) => {
    try {
      if (getValues("generico") == generico) {
        openNotificationUI("El generico seleccionado es el mismo que tiene los datos", "error");
      } else {
        const genericoNuevo = getValues("generico");
        const submit = supermaestros.map((maestro) => {
          return { ...maestro, generico: genericoNuevo, idSupermaestro: 0 };
        });
        const response = await dispatch(SupermaestroSliceRequest.multiPostNested(submit));
        openNotificationUI("Se completo la transferencia correctamente", "success");
        const refresh = await dispatch(SupermaestroSliceRequest.getByGenerico(generico));
        setOpenModal(false);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  return (
    <div className="pt-1 flex justify-around ">
      <Button className={buttonClasses.greenButton} variant="contained" onClick={OnTranfer}>
        Tranferir
      </Button>
      <ModalCompoment title="Tranferir datos a otro generico" setOpenPopup={setOpenModal} openPopup={openModal}>
        <div className="p-4 m-2 flex gap-4 items-center flex-col">
          <FormControl fullWidth variant="filled">
            <InputLabel variant="filled">Seleccione un generico</InputLabel>
            <Controller
              name="generico"
              control={control}
              rules={{ required: "Seleccione un generico." }}
              render={({ field }) => (
                <Select {...field}>
                  {genericos &&
                    genericos.map((generico) => (
                      <MenuItem key={generico.id} value={generico.codigo}>
                        <div className="w-full">
                          <div>{generico.codigo}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
          <Button className={buttonClasses.greenButton} variant="contained" onClick={OnSubmit}>
            Tranferir
          </Button>
        </div>
      </ModalCompoment>
    </div>
  );
};
