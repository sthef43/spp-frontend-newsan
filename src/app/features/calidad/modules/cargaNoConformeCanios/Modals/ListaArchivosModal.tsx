/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { ContainerForItems } from "app/shared/helpers/Containers/ContainerForItems";
import { DeleteIconEdited, ImageIconEdited } from "app/shared/helpers/ComponentsMUIModify/IconsModified";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ExaminarImagenGenericModal } from "app/shared/helpers/ModalsGenerics/ExaminarImagenGenericModal";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  setFile: (newValue: any[]) => void;
  archivosSeparados?: string[];
  openModal: boolean;
  file: any[];
  edicionActiva: boolean;
  rechazoSeleccionado: IRechazoDobladora;
}

export const ListaArchivosModal: React.FC<Props> = ({
  setOpenModal,
  setFile,
  openModal,
  file,
  archivosSeparados,
  edicionActiva,
  rechazoSeleccionado
}) => {
  const [openModalExaminarImagen, setOpenModalExaminarImagen] = useState(false);
  const [fileExaminarImagen, setFileExaminarImagen] = useState<any>(null);

  const handleExaminarImagen = (item: any, typeFunction?: string) => {
    if (typeFunction === "examinarImagen") {
      setFileExaminarImagen(edicionActiva ? item : item.file.url);
      setOpenModalExaminarImagen(true);
    }
  };

  const handleEliminarImagen = (item: any) => {
    const nuevoFiltrado = file.filter((elementos) => elementos.file.name != item.file.name);
    setFile(nuevoFiltrado);
  };

  return (
    <ContainerForPages classNamePersonalized="w-[65vw]" activeEffectVisible optionsLayout="personalized">
      <ContainerForItems
        items={edicionActiva ? archivosSeparados : file}
        keyId={(item) => (edicionActiva ? item : item.file.name)}
        textItem={(item) => (
          <p className="font-medium">
            <span className="font-bold text-base">Nombre del archivo:</span> {edicionActiva ? item : item.file.name}
          </p>
        )}
        secondaryAction={(item) => (
          <div className="flex flex-row items-center">
            <TooltipComponent
              onClick={() => handleExaminarImagen(item, "examinarImagen")}
              titleTooltip="Examinar Imagen"
              typeTooltip="normal"
              componenteIcono={<ImageIconEdited size="1.5rem" colorLigth="#3ba3ff66" />}
            />
            {!edicionActiva && (
              <TooltipComponent
                onClick={() => handleEliminarImagen(item)}
                titleTooltip="Eliminar Imagen"
                typeTooltip="normal"
                componenteIcono={<DeleteIconEdited size="1.5rem" />}
              />
            )}
          </div>
        )}
      />
      <ModalCompoment
        openPopup={openModalExaminarImagen}
        setOpenPopup={setOpenModalExaminarImagen}
        title="Examinar Imagen"
        titleModalStyle="Audit"
        subTitle="Examinar imagen cargada para el rechazo"
        showModalCenterPage>
        <ExaminarImagenGenericModal
          openModal={openModalExaminarImagen}
          setOpenModal={setOpenModalExaminarImagen}
          optionCharge={edicionActiva ? "file" : "url"}
          file={edicionActiva ? `rechazoDobladora/${rechazoSeleccionado.urlImagen}` : (fileExaminarImagen as string)}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
