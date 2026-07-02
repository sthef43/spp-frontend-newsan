/* eslint-disable unused-imports/no-unused-vars */
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import React from "react";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  hallazgo: IOQCHallazgo;
}

export const OQCVerImagenAyudaHallazgo: React.FC<Props> = ({ setOpenModal, openModal, hallazgo }) => {
  return (
    <main className="w-[70vw]">
      <section className="flex justify-center items-center">
        <figure>
          <img src={`${import.meta.env.BASE_URL}imagenes/oqc/hallazgos/${hallazgo.id}/${hallazgo.urlImage}`} alt="" />
        </figure>
      </section>
    </main>
  );
};
