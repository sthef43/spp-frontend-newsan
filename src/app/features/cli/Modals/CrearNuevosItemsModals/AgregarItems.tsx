import React from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ICLIItems } from "../../Models/ICLIItems";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { CLIItemsSliceRequest } from "../../Middlewares/CLIItemsSlice";

interface IAgregarItemsForm {
  nombreItem: string;
  descripcion: string;
}

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshLista: React.Dispatch<React.SetStateAction<ICLIItems[] | null>>;
}

const defaultFormValues: IAgregarItemsForm = { nombreItem: "", descripcion: "" };

export const AgregarItems: React.FC<Props> = ({ setOpenModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting }
  } = useForm<IAgregarItemsForm>({
    defaultValues: defaultFormValues
  });

  const { FetchPost } = useFetchApiMultiResults<ICLIItems>();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { generateArticleCode } = UseGeneratorCodesForLabels();

  const onSubmit = async (data: IAgregarItemsForm) => {
    const itemAgregado = setearNuevoItem(data.nombreItem, data.descripcion);
    FetchPost(
      CLIItemsSliceRequest.PostRequest,
      itemAgregado,
      false,
      (response: ICLIItems) => {
        openNotificationUI("Se agrego correctamente el nuevo item.", "success");
        refreshLista(prev => prev ? [...prev, response] : [response]);
        setOpenModal(false);
      }
    );
  };

  const onError = () => {
    openNotificationUI("Complete los campos requeridos", "warning");
  };

  const setearNuevoItem = (nombreItemIngresado: string, descripcionItem: string) => {
    const articuloGenerado = generarArticulo();
    const nuevoItem: ICLIItems = {
      nombreItem: nombreItemIngresado,
      descripcion: descripcionItem,
      articulo: articuloGenerado
    };
    return nuevoItem;
  };

  const generarArticulo = (): string => {
    const articuloGenerado = generateArticleCode(["A", "B", "C", "D", "E", "F"], 12, 3);
    return articuloGenerado !== "" ? articuloGenerado : "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-[45vw]">
      <section className="mt-4 flex flex-row gap-x-4 justify-between">
        <div className="w-full">
          <InputComponentForm
            control={control}
            name="nombreItem"
            label="Ingrese el nombre del item"
            rules={{ required: "Ingrese el nombre del item" }}
          />
        </div>
      </section>
      <section className="mt-4">
        <div className="w-full">
          <InputComponentForm
            control={control}
            name="descripcion"
            label="Ingrese una descripcion"
            rules={{ required: "Ingrese una descripcion" }}
          />
        </div>
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button disabled={!isValid || isSubmitting} type="submit" className={buttonClasses.greenButton}>
            Agregar
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setOpenModal(false)}
            className={buttonClasses.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </form>
  );
};
