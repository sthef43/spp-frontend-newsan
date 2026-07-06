import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoria } from "../../../models/IAuditoria";
import { DragIndicatorRounded, FormatListNumberedRounded } from "@mui/icons-material";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useState } from "react";
import { ExaminarTareasAuditoria } from "./ExaminarTareasAuditoria";
import { IAuditoriaItemsResult } from "../../../models/IAuditoriaItemsResult";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";

interface Props {
  auditoriaSeleccionada: IAuditoria;
  gruposAuditoria: IAuditoriaGrupoItemsResult[];
  setOpenModal: (value: boolean) => void;
}

export const ExaminarBloquesAuditoria: React.FC<Props> = ({ auditoriaSeleccionada, gruposAuditoria, setOpenModal }) => {
  const [openModaTareas, setOpenModaTareas] = useState<boolean>(false);
  const [listaTareas, setListaTareas] = useState<IAuditoriaItemsResult[]>([]);

  const handlerOpenModalTareas = (value: boolean, listaTareas?: IAuditoriaItemsResult[]) => {
    setOpenModaTareas(value);
    if (listaTareas) setListaTareas(listaTareas);
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[60vw] h-full p-2" activeEffectVisible>
      <section className="flex flex-col gap-5 h-full">
        {gruposAuditoria?.map((elementos, index) => (
          <article className="group">
            <div
              className="flex flex-row items-center justify-between border-2 border-gray-500 bg-background rounded-lg p-6 cursor-pointer group-hover:border-[#146aff] group-hover:border-2 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
              key={index}>
              <div className="flex flex-row items-center gap-x-4">
                <DragIndicatorRounded className="fill-gray-500 group-hover:fill-[#146aff]" />
                <div className="flex flex-col">
                  <p className="text-base font-semibold">{elementos.nombre}</p>
                  <p className="text-md text-gray-500">{elementos.auditoriaItemsResult.length} Preguntas</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex flex-row items-center transition-all duration-200 ease-in-out">
                <div>
                  <TooltipComponent
                    onClick={() => handlerOpenModalTareas(true, elementos.auditoriaItemsResult)}
                    titleTooltip="Examinar Preguntas"
                    typeTooltip="normal"
                    componenteIcono={<FormatListNumberedRounded color="primary" />}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModaTareas}
        openPopup={openModaTareas}
        showButtons
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Modal exclusivamente para poder examinar tareas no editar"
        title={`Tareas del bloque: ${auditoriaSeleccionada.nombre}`}
        functionButtonSave={() => setOpenModaTareas(false)}>
        <ExaminarTareasAuditoria setOpenModal={setOpenModaTareas} auditoriaSeleccionada={listaTareas} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
