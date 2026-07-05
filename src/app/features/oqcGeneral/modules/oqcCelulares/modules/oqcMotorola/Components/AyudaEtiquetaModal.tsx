import React from "react";
import imagenEtiqueta from "../../../images/image.png";

export const AyudaEtiquetaModal: React.FC = () => {
  return (
    <>
      <div className="relative w-full">
        <span className="bg-green-500 absolute top-12 left-56 rounded-full px-4 py-2 text-white font-bold text-xl">
          1
        </span>
        <span className="bg-green-500 absolute top-[5rem] left-[12rem] rounded-full px-4 py-2 text-white font-bold text-xl">
          2
        </span>
        <span className="bg-green-500 absolute top-[8.5rem] left-[9.5rem] rounded-full px-4 py-2 text-white font-bold text-xl">
          3
        </span>
        <span className="bg-green-500 absolute top-[30rem] left-[17.5rem] rounded-full px-4 py-2 text-white font-bold text-xl">
          4
        </span>
      </div>
      <figure className="w-[78%]">
        <img src={imagenEtiqueta} alt="" />
      </figure>
    </>
  );
};
