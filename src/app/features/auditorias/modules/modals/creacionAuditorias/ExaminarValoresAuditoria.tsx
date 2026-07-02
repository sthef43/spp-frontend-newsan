import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { CancelRounded, MarkEmailReadRounded, UnsubscribeRounded, VerifiedRounded } from "@mui/icons-material";
import { IAuditoriaListaValoresResult } from "app/features/auditorias/models/IAuditoriaListaValoresResult";

interface Props {
  listaValores: IAuditoriaListaValoresResult;
  setOpenModal: (value: boolean) => void;
}

export const ExaminarValoresAudiutoria: React.FC<Props> = ({ listaValores, setOpenModal }) => {
  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[60vw] h-full" activeEffectVisible>
      <section className="flex flex-col gap-4 p-2">
        {listaValores?.auditoriaValoresResult.map((elementos, index) => (
          <article className="group" key={index}>
            <div className="flex flex-row items-center justify-between border-2 border-gray-500 bg-background rounded-lg p-6 cursor-pointer group-hover:border-[#146aff] group-hover:border-2 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
              <div className="flex flex-row items-center gap-x-4">
                <div className="flex flex-col">
                  <p className="text-base font-semibold">{elementos.nombre}</p>
                  <p className="text-md text-gray-500">Descripcion: {elementos.descripcion}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex flex-row items-center transition-all duration-200 ease-in-out">
                <div className="flex flex-row items-center gap-x-4">
                  <TooltipComponent
                    titleTooltip={`Envio del item en el mail: ${elementos.flagMail ? "Si" : "No"}`}
                    typeTooltip="normal"
                    componenteIcono={
                      elementos.flagMail ? (
                        <MarkEmailReadRounded color="primary" />
                      ) : (
                        <UnsubscribeRounded color="error" />
                      )
                    }
                  />
                  <TooltipComponent
                    titleTooltip={`El item es bueno: ${elementos.flagCriterio ? "Si" : "No"}`}
                    typeTooltip="normal"
                    componenteIcono={
                      elementos.flagCriterio ? <VerifiedRounded color="success" /> : <CancelRounded color="error" />
                    }
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </ContainerForPages>
  );
};
