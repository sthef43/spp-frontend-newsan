/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";

interface BaseProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  optionCharge: "url" | "file";
  styles?: string;
}

interface OptionUrl extends BaseProps {
  optionCharge: "url";
  file: string | ArrayBuffer;
}

interface OptionFile extends BaseProps {
  optionCharge: "file";
  file: string;
}

type Props = OptionUrl | OptionFile;

export const ExaminarImagenGenericModal: React.FC<Props> = ({
  optionCharge,
  file,
  openModal,
  setOpenModal,
  styles
}) => {
  return (
    <main className={styles}>
      {optionCharge === "url" ? (
        <img src={file as string} alt="" />
      ) : (
        <img src={`${import.meta.env.BASE_URL}imagenes/${file}`} alt="" />
      )}
    </main>
  );
};
