import React, { useEffect, useState } from "react";
import TitleUIComponent from "../components/helpComponents/TitleUIComponent";

interface IImagenProps {
  url: string;
  folderUrl: string;
}
export const Imagen = ({ url = "", folderUrl }: IImagenProps) => {
  const [Url, setUrl] = useState<string>("");
  useEffect(() => {
    setUrl(url);
  }, [url]);
  useEffect(() => {
    console.log(Url);
  }, [Url]);
  return (
    <>
      {Url?.length > 0 && (
        <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
          <TitleUIComponent title="Imagen actual" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={`${import.meta.env.BASE_URL}${folderUrl}/${Url}`}
            />
          </div>
        </div>
      )}
      {Url?.length == 0 ||
        (Url == null && (
          <div className="flex justify-center">
            <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
          </div>
        ))}
    </>
  );
};
