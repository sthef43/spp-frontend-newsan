import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import React from "react";
interface IAuditImage {
  imageUrl: string;
  edit: boolean;
  auditBloqId: number;
}
export const AuditImage = ({ imageUrl, auditBloqId, edit }: IAuditImage): JSX.Element => {
  return (
    <div>
      {imageUrl?.length > 0 ? (
        <>
          <TitleUIComponent title="Preview de la imagen de la auditoria" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={edit ? `${import.meta.env.BASE_URL}imagenes/audit-registry/${auditBloqId}/${imageUrl}` : imageUrl}
            />
          </div>
        </>
      ) : (
        <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
      )}
    </div>
  );
};
