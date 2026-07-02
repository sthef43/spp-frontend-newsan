import React from "react";
import TitleUIComponent from "../../../../../../shared/components/helpComponents/TitleUIComponent";
import { useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
interface IOQCDesignadaResultadoImage {
  imageUrl: any;
  edit: boolean;
  oqcDesignadaResultadoId: number;
}
export const OQCDesignadaResultadoImage = ({
  edit,
  imageUrl,
  oqcDesignadaResultadoId
}: IOQCDesignadaResultadoImage): JSX.Element => {
  const oqcDesginadaResultado = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);
  return (
    <div>
      {imageUrl?.length > 0 ? (
        <>
          <TitleUIComponent title="Preview de la imagen del bloque" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={
                edit
                  ? `${import.meta.env.BASE_URL}imagenes/oqc/designada-resultado/${
                      oqcDesginadaResultado.id
                    }/${oqcDesignadaResultadoId}/${imageUrl}`
                  : imageUrl
              }
            />
          </div>
        </>
      ) : (
        <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
      )}
    </div>
  );
};
