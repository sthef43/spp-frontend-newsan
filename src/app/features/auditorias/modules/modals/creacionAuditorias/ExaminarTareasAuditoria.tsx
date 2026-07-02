import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoriaItemsResult } from "../../../models/IAuditoriaItemsResult";

interface Props {
  auditoriaSeleccionada: IAuditoriaItemsResult[];
  setOpenModal: (value: boolean) => void;
}

export const ExaminarTareasAuditoria: React.FC<Props> = ({ auditoriaSeleccionada, setOpenModal }) => {
  const generarFondo = (nombreNivel: string) => {
    switch (nombreNivel) {
      case "Critico":
        return "hover:bg-yellow-500/80 hover:text-white hover:border-yellow-500";
      case "Mayor":
        return "hover:bg-red-500 hover:text-white hover:border-red-500";
      case "Bajo":
        return "hover:bg-green-500 hover:text-white hover:border-green-500";
      default:
        return "hover:bg-primaryNew hover:text-white hover:border-primaryNew";
    }
  };

  const generarColorCiruclos = (nombreNivel: string) => {
    switch (nombreNivel) {
      case "Critico":
        return "bg-yellow-500/80";
      case "Mayor":
        return "bg-red-500 hover:text-white";
      case "Bajo":
        return "bg-green-500 hover:text-white";
      default:
        return "hover:bg-primaryNew hover:text-white hover:border-primaryNew";
    }
  };

  return (
    <ContainerForPages activeEffectVisible optionsLayout="personalized" classNamePersonalized="w-[75vw] h-full p-2">
      <section className="flex flex-col gap-5 h-full">
        {auditoriaSeleccionada.map((item, index) => (
          <article
            key={index}
            className={`flex flex-col border border-gray-400 p-4 rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out group ${generarFondo(
              item.auditoriaNivelItem.nombre
            )}`}>
            <div className="flex flex-row items-center w-full justify-between">
              <p>{item.nombre}</p>
              <span
                className={`${generarColorCiruclos(
                  item.auditoriaNivelItem.nombre
                )} w-2 h-2 rounded-full opacity-100 group-hover:opacity-0 transition-all duration-200`}></span>
            </div>
          </article>
        ))}
      </section>
    </ContainerForPages>
  );
};
