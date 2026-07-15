/* eslint-disable unused-imports/no-unused-vars */
import React, { useMemo, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFormContext } from "react-hook-form";
import { ImageRounded, VisibilityRounded } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { ButtonForFiles } from "app/shared/helpers/ButtonForFiles";
import FetchApi from "app/shared/helpers/FetchApi";
import { CausaDobladuraSoldaduraSliceRequest } from "../Middleware/CausaDobladuraSoldaduraSlice";
import { GrupoFallaSliceRequest } from "../Middleware/GrupoFallaSlice";
import { ICausaDobladuraSoldadura } from "../Models/ICausaDobladuraSoldadura";
import { IGrupoFalla } from "../Models/IGrupoFalla";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFileChange } from "app/shared/hooks/useFileChange";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";

/**
 * Componente funcional que renderiza los campos del formulario de rechazo.
 * Se utiliza tanto para crear como para editar un rechazo.
 * @param {Props} props Propiedades del componente
 */
interface Props {
  rechazoSeleccionado: IRechazoDobladora;
  edicionActiva: boolean;
  openModal: boolean;
  setFile: (file: File[]) => void;
  file: File[];
  setOpenModalExaminarImagen: (newValue: boolean) => void;
}

interface IFormInputs {
  multiplesDescripcionRechazo: string[];
  multiplesCausas: string[];
  cantidadRechazada: number;
  accionContencion: string;
  accionCorrectiva: string;
  descripcionRechazoOperador: string;
}

const initialValues: IFormInputs = {
  multiplesDescripcionRechazo: [],
  multiplesCausas: [],
  cantidadRechazada: 0,
  accionContencion: "",
  accionCorrectiva: "",
  descripcionRechazoOperador: ""
};

/**
 * Formulario de inputs para la carga de datos del rechazo.
 * Maneja la selección de imagen, causas y descripciones.
 */
export const InputsForm: React.FC<Props> = ({
  rechazoSeleccionado,
  edicionActiva,
  openModal,
  setOpenModalExaminarImagen,
  setFile,
  file
}) => {
  /**
   * Hooks
   */
  const { control } = useFormContext<IFormInputs>();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { multiSelectFileChange } = useFileChange();

  /**
   * Listas de datos
   */
  const [listadoCausas, setListadoCausas] = useState<Array<string | number>>([]);
  const [listadoDescripcionesSeleccionadas, setListadoDescripcionesSeleccionadas] = useState<Array<string | number>>(
    []
  );

  const [grupoFallas, setGrupoFallas] = useState<IGrupoFalla[]>([]);
  const [causaDobladuraSoldadura, setCausaDobladuraSoldadura] = useState<ICausaDobladuraSoldadura[]>([]);

  /**
   * Obtiene la lista de grupo de fallas
   */
  FetchApi<IGrupoFalla[]>(
    GrupoFallaSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    setGrupoFallas,
    true,
    false,
    false
  );

  /**
   * Obtiene la lista de causas de dobladura/soldadura segun el grupo de falla seleccionado
   */
  FetchApi<ICausaDobladuraSoldadura[]>(
    CausaDobladuraSoldaduraSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    setCausaDobladuraSoldadura,
    true,
    false,
    false
  );

  const listaCausasVisible = useMemo(() => {
    if (!listadoCausas || listadoCausas.length === 0) {
      return causaDobladuraSoldadura;
    }

    const idsGruposSeleccionados = grupoFallas
      .filter((elemento) => listadoCausas.includes(elemento.grupo))
      .map((elemento) => elemento.id);

    return causaDobladuraSoldadura.filter((elemento) => idsGruposSeleccionados.includes(elemento.grupoFallaId));
  }, [listadoCausas, grupoFallas, causaDobladuraSoldadura]);

  return (
    <section className="flex flex-row justify-between w-full gap-x-4 my-4">
      <div className="flex flex-col gap-y-2 w-full">
        <SelectComponentForm
          control={control}
          listItems={grupoFallas}
          valueLabel={(e) => e.grupo}
          valueSelect={(e) => e.grupo}
          name="multiplesCausas"
          label="Seleccione una o mas causas"
          activeMultiple={true}
          onMultipleChange={setListadoCausas}
          variant="standard"
        />
        <InputComponentForm
          control={control}
          name="cantidadRechazada"
          label="Cantidad a Rechazar"
          defaultValue={edicionActiva ? rechazoSeleccionado.cantidadRechazada.toString() : ""}
          variant="standard"
        />
        <InputComponentForm
          control={control}
          name="accionContencion"
          label="Acción de Contención"
          defaultValue={edicionActiva ? rechazoSeleccionado.accionContencion : ""}
          variant="standard"
        />
      </div>
      <figure className="w-[30vw] flex flex-col justify-center gap-y-4 items-center">
        <ButtonForFiles
          disabled={edicionActiva}
          functionFile={(event) => {
            multiSelectFileChange(event, setFile);
            openNotificationUI("Se cargo una imagen para examinar", "info");
          }}
          textButton="Agregar Imagen"
          multipleFiles={true}
          styles={`${
            !edicionActiva
              ? "bg-background p-2 rounded-lg flex flex-col items-center gap-y-2 hover:bg-blue-500 transition-colors duration-150 group hover:text-white"
              : "bg-gray-300 p-2 rounded-lg flex flex-col items-center gap-y-2 text-gray-200 cursor-not-allowed"
          }`}>
          <ImageRounded className="group-hover:text-white" sx={{ fontSize: "4rem", color: "gray" }} />
        </ButtonForFiles>
        {(file.length > 0 || (edicionActiva && rechazoSeleccionado.urlImagen)) && (
          <Tooltip title="Ver Imagen">
            <Button
              className={`${buttonClases.blueButton} rounded-full min-w-0 shadow-2xl`}
              onClick={() => setOpenModalExaminarImagen(true)}>
              <VisibilityRounded />
            </Button>
          </Tooltip>
        )}
      </figure>
      <div className="flex flex-col gap-y-2 w-full">
        <SelectComponentForm
          control={control}
          listItems={listaCausasVisible}
          valueLabel={(e) => e.falla}
          valueSelect={(e) => e.falla}
          name="multiplesDescripcionRechazo"
          label="Seleccione las descripciones de las causas"
          activeMultiple={true}
          onMultipleChange={(e) => {
            setListadoDescripcionesSeleccionadas(e);
          }}
          variant="standard"
        />
        <InputComponentForm
          control={control}
          name="accionCorrectiva"
          label="Acción Correctiva"
          defaultValue={edicionActiva ? rechazoSeleccionado.accionCorrectiva : ""}
          variant="standard"
        />
        <InputComponentForm
          control={control}
          name="descripcionRechazoOperador"
          label="Descripción del Rechazo"
          defaultValue={edicionActiva ? rechazoSeleccionado.descripcionRechazoOperador : ""}
          variant="standard"
        />
      </div>
    </section>
  );
};
