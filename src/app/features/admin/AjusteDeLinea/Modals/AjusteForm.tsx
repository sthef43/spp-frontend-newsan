import { Button } from "@mui/material";
import { AjusteSliceRequests } from "app/Middleware/reducers/AjusteSlice";
import { useAppDispatch } from "app/core/store/store";
import { IAjuste } from "app/models/IAjuste";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  ajuste?: IAjuste;
  setOpenModal: (open: boolean) => void;
  refresh: () => void;
}

const ajusteSchema = yup
  .object()
  .shape({
    ajuste1: yup
      .number()
      .positive("El numero tiene que ser mayor a 0")
      .integer("El numero tiene que ser entero")
      .required("El ajuste es requerido")
  })
  .required();

export const AjusteForm = ({ ajuste, setOpenModal, refresh }: Props) => {
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const defaultFormValues = {
    ajuste1: ajuste?.ajuste1 || 0
  };

  const defaultPuestoLabels = {
    ajuste1: "Ajuste"
  };

  const { control, handleSubmit, formState } = useForm({
    defaultValues: defaultFormValues,
    resolver: yupResolver(ajusteSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: { ajuste1: number }) => {
    try {
      const objecto = { ...ajuste, ajuste1: data.ajuste1 };
      await dispatch(AjusteSliceRequests.putRequest(objecto)).unwrap();
      openNotificationUI("Se edito el ajuste correctamente", "success");
      refresh();
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(String(e), "error");
    }
  };

  const handleCancelar = () => {
    setOpenModal(false);
  };

  return (
    <>
      <GenericFieldsGenerator
        values={defaultFormValues}
        control={control}
        styleDiv={"text-center mb-5"}
        styleFieldSX={{ width: "100%" }}
        labels={defaultPuestoLabels}
        variant="standard"
      />
      <div className="pt-1 flex justify-around gap-3 mt-3">
        <Button
          className={buttonClasses.blueButton}
          disabled={!formState.isValid}
          variant="contained"
          onClick={handleSubmit(onSubmit)}>
          Guardar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </>
  );
};
