import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import React from "react";
interface IOQCBloqueGroupImage {
  imageUrl: string;
  edit: boolean;
  oqcBloqueGroupId: number;
}
export const OQCBloqueGroupImage = ({ imageUrl, oqcBloqueGroupId, edit }: IOQCBloqueGroupImage): JSX.Element => {
  return (
    <div>
      {imageUrl?.length > 0 ? (
        <>
          <TitleUIComponent title="Preview de la imagen del bloque" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={
                edit ? `${import.meta.env.BASE_URL}imagenes/oqc/bloque-group/${oqcBloqueGroupId}/${imageUrl}` : imageUrl
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
