import { yupResolver } from "@hookform/resolvers/yup";
import { IRoutes } from "app/models/IRoutes";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { RoutesSliceRequests } from "app/features/manejoSistema/slices/RoutesSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
interface IManejoSistemaForm {
  editState: IRoutes;
  setOpenModal: (state: boolean) => void;
}
export const ManejoSistemaForm = ({ editState, setOpenModal }: IManejoSistemaForm): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const editObject = {
        ...e,
        id: editState?.id,
        createdDate: editState?.createdDate,
        lastModifiedDate: editState?.lastModifiedDate,
        deleted: false
      };
      const response = editState
        ? await dispatch(RoutesSliceRequests.PutRequest(editObject))
        : await dispatch(RoutesSliceRequests.PostRequest(e));
      openNotificationUI("Se agrego la ruta correctamente", "success");
      const refresh = await dispatch(RoutesSliceRequests.getAllRequest());
      setOpenModal(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const onCancel = () => {
    setOpenModal(false);
  };

  const defaultValues = {
    nombre: editState?.nombre || "",
    padre: editState?.padre || "",
    ruta: editState?.ruta || ""
  };
  const defaultLabels = {
    nombre: "Nombre",
    padre: "Padre",
    ruta: "Ruta"
  };
  const schema = yup
    .object()
    .shape({
      nombre: yup.string(),
      padre: yup.string(),
      ruta: yup.string()
    })
    .required();
  const { control, formState, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });

  return (
    <div>
      <div style={{ width: "40vw" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full">
            <GenericFieldsGenerator
              values={defaultValues}
              control={control}
              styleDiv={"text-center mb-5"}
              styleFieldSX={{ width: "100%", height: "100%" }}
              labels={defaultLabels}
              variant="standard"
            />
          </div>
          <div className="pt-1 flex justify-around border-t-2">
            <Button
              className={buttonClasses.blueButton}
              disabled={!formState.isValid}
              variant="contained"
              type="submit">
              Guardar
            </Button>
            <Button className={buttonClasses.redButton} variant="contained" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
