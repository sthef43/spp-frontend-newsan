import { Check, Upload } from "@mui/icons-material";
import { Autocomplete, Button, TextField } from "@mui/material";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { IModelos } from "app/models/IModelos";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useForm, Controller } from "react-hook-form";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ImagenAnteriorProps {
  etiquetaImagen: IEtiquetasImagen | null;
}

interface IngresarImagenFormValues {
  tipoEtiqueta: string;
  tipoUnidad: string;
  modelo: string;
}

interface CustomAutocompleteProps {
  options: IModelos[];
  value: IModelos | null;
  onChange: (event: React.SyntheticEvent, value: IModelos | null) => void;
}

// ─── Componente ImagenAnterior ────────────────────────────────────────────────

const ImagenAnterior: React.FC<ImagenAnteriorProps> = ({ etiquetaImagen }) => {
  return (
    <>
      {etiquetaImagen?.url ? (
        <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
          <TitleUIComponent title="Imagen actual" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400">
            <img
              className="max-h-[50vh] w-auto h-full"
              src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${etiquetaImagen.url}`}
              alt="Imagen actual de etiqueta"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
        </div>
      )}
    </>
  );
};

// ─── Componente CustomAutocomplete ────────────────────────────────────────────

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({ options, value, onChange }) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => `${option.codigoModelo}`}
      renderInput={(params) => <TextField {...params} fullWidth label="Modelos" variant="filled" />}
    />
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

export const IngresarImagenesEtiquetas: React.FC = () => {
  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { FetchPost } = useFetchApiMultiResults();

  // ─── React Hook Form ──────────────────────────────────────────────────────

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<IngresarImagenFormValues>({
    defaultValues: { tipoEtiqueta: "", tipoUnidad: "" }
  });

  const watchedTipoEtiqueta = watch("tipoEtiqueta");
  const watchedTipoUnidad = watch("tipoUnidad");

  // ─── Título ────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    TitleChanger("Ingresar imagenes para etiquetas");
  }, []);

  // ─── Refs y estados ────────────────────────────────────────────────────────

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [modelos, setModelos] = React.useState<IModelos[]>([]);
  const [selectModelo, setSelectModelo] = React.useState<IModelos | null>(null);
  const [valor, setValor] = React.useState<IModelos | null>(null);
  const [dataImagen, setDataImagen] = React.useState<IEtiquetasImagen | null>(null);
  const [urlImage, setUrlImage] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // ─── Fetch modelos con FetchApi ────────────────────────────────────────────

  const convertTipoUnidad = React.useMemo(() => {
    if (!watchedTipoEtiqueta) return null;
    return watchedTipoEtiqueta === "EE" ? "E" : watchedTipoUnidad;
  }, [watchedTipoEtiqueta, watchedTipoUnidad]);

  const activadorModelos = React.useMemo(() => {
    if (!watchedTipoEtiqueta) return null;
    if (watchedTipoEtiqueta === "EE") return "EE";
    if (watchedTipoUnidad) return `${watchedTipoEtiqueta}-${watchedTipoUnidad}`;
    return null;
  }, [watchedTipoEtiqueta, watchedTipoUnidad]);

  FetchApi<IModelos[]>(
    ModelosSliceRequests.getModelosByTipoUnidad,
    convertTipoUnidad,
    false,
    activadorModelos,
    undefined,
    true,
    false,
    true,
    (response) => {
      const filtered = getTipoModelo(response, watchedTipoEtiqueta, watchedTipoUnidad);
      setModelos(filtered);
    }
  );

  // ─── Fetch imagen con FetchApi (activación condicional) ────────────────────

  const activadorImagen = React.useMemo(() => {
    if (selectModelo?.codigoModelo && watchedTipoEtiqueta) {
      return `${selectModelo.codigoModelo}-${watchedTipoEtiqueta}`;
    }
    return null;
  }, [selectModelo?.codigoModelo, watchedTipoEtiqueta]);

  FetchApi<IEtiquetasImagen>(
    EtiquetasImagenSliceRequests.getByModelo,
    { modelo: selectModelo?.codigoModelo, tipoDeEtiqueta: watchedTipoEtiqueta },
    false,
    activadorImagen,
    setDataImagen,
    true,
    false,
    true,
    undefined,
    () => setDataImagen(null)
  );

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getTipoModelo = (modelosList: IModelos[], etiqueta: string, tipoUnidad: string): IModelos[] => {
    return modelosList.filter((modelo) => {
      if (etiqueta === "EM") {
        if (modelo.tipoUnidad === "I" && tipoUnidad === "I") return true;
        if (modelo.tipoUnidad === "E" && tipoUnidad === "E") return true;
        if (modelo.tipoUnidad === "P" && tipoUnidad === "P") return true;
        if (modelo.tipoUnidad === "W" && tipoUnidad === "W") return true;
      }
      if (etiqueta === "EE") {
        if (modelo.tipoUnidad !== "P") return true;
      }
      if (etiqueta === "EC") {
        if (modelo.nombre?.startsWith("S4")) {
          if (modelo.tipoUnidad === "I" && tipoUnidad === "I") return true;
          if (modelo.tipoUnidad === "E" && tipoUnidad === "E") return true;
        }
      }
      return false;
    });
  };

  // ─── Event Handlers ────────────────────────────────────────────────────────

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUrlImage(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleClick = (): void => {
    hiddenFileInput.current?.click();
  };

  const handleChangeAutocomplete = (_event: React.SyntheticEvent, value: IModelos | null): void => {
    if (value) {
      setSelectModelo(value);
      setValor(value);
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (!selectModelo) {
      openNotificationUI("Error el modelo no es valido", "error");
      return;
    }

    const confirmed = await getConfirmation(
      "Guardar imagen",
      "¿Está seguro de guardar la imagen para esta etiqueta?",
      undefined,
      "Guardar",
      "Cancelar"
    );

    if (!confirmed) return;

    setIsUploading(true);
    try {
      await FetchPost(
        EtiquetasImagenSliceRequests.Upload,
        {
          modelo: selectModelo.codigoModelo,
          tipoDeEtiqueta: watchedTipoEtiqueta,
          imageFile: imageFile
        },
        false,
        () => {
          openNotificationUI("Imagen guardada con éxito", "success");
          reset();
          setSelectModelo(null);
          setValor(null);
          setDataImagen(null);
          setUrlImage(null);
          setImageFile(null);
        }
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <div className="mx-5">
        <ContainerForPages optionsLayout="Selects">
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-4 my-5 w-full">
            <div className="col-span-2 flex gap-4 justify-center w-full">
              <div className="w-full">
                <SelectComponentForm
                  control={control}
                  name="tipoEtiqueta"
                  label="Tipo de etiqueta"
                  listItems={[
                    { value: "EM", label: "Modelo" },
                    { value: "EE", label: "Eficiencia" },
                    { value: "EC", label: "Caja" }
                  ]}
                  valueLabel={(item) => item.label}
                  valueSelect={(item) => item.value}
                  rules={{ required: "Seleccione un tipo de etiqueta" }}
                />
                {watchedTipoEtiqueta !== "EE" && (
                  <SelectComponentForm
                    control={control}
                    name="tipoUnidad"
                    label="Tipo de unidad"
                    listItems={[
                      { value: "E", label: "Exterior" },
                      { value: "I", label: "Interior" },
                      { value: "W", label: "Window" }
                    ]}
                    valueLabel={(item) => item.label}
                    valueSelect={(item) => item.value}
                    rules={{ required: "Seleccione un tipo de unidad" }}
                  />
                )}
                {modelos.length > 0 && (
                  <Controller
                    name="modelo"
                    control={control}
                    render={() => (
                      <CustomAutocomplete
                        options={modelos}
                        value={valor}
                        onChange={handleChangeAutocomplete}
                      />
                    )}
                  />
                )}
              </div>
              <Button
                onClick={handleClick}
                variant="contained"
                className={classes.blueButton}
                disabled={!watchedTipoEtiqueta || !selectModelo || !imageFile}
              >
                <Upload />
                <span className="hidden sm:block">Importar</span>
              </Button>
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="Importar"
                onChange={onFileChange}
                ref={hiddenFileInput}
                multiple={false}
                className="hidden"
              />
            </div>
          </div>
        </ContainerForPages>
        <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
          {dataImagen ? (
            <ImagenAnterior etiquetaImagen={dataImagen} />
          ) : (
            selectModelo &&
            watchedTipoEtiqueta && (
              <div className="flex justify-center">
                <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
              </div>
            )
          )}
          {urlImage && (
            <>
              <TitleUIComponent title="Preview nueva imagen de etiqueta" classNameTitle="text-base" />
              <div className="border-2 rounded-lg overflow-hidden border-red-400">
                <img
                  className="max-h-[50vh] w-auto h-full"
                  src={urlImage}
                  alt="Preview nueva imagen de etiqueta"
                />
              </div>
              <Button
                startIcon={<Check />}
                className={classes.greenButton}
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || isUploading}
              >
                Guardar
              </Button>
            </>
          )}
        </div>
      </div>
    </ContainerForPages>
  );
};
