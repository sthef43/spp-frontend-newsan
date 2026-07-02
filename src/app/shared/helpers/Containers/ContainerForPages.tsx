/* eslint-disable unused-imports/no-unused-vars */
import { Grow } from "@mui/material";
import React from "react";

interface BaseProps {
  activeEffectVisible?: boolean;
  children: React.ReactNode;
  optionsLayout: "Table" | "page" | "modal" | "Selects" | "personalized";
  tableForModalOrPageStyle?: "Modal" | "page";
}

interface ActivedClassPersonalized extends BaseProps {
  optionsLayout: "personalized";
  classNamePersonalized: string;
}

interface OptionalClassPersonalized extends BaseProps {
  optionsLayout: "Table" | "page" | "modal" | "Selects";
  classNamePersonalized?: string;
}

export type Props = ActivedClassPersonalized | OptionalClassPersonalized;

export const ContainerForPages: React.FC<Props> = ({
  children,
  classNamePersonalized,
  optionsLayout,
  tableForModalOrPageStyle,
  activeEffectVisible
}) => {
  const verifyOptionsLayout = (optionsLayout: "Table" | "page" | "modal" | "Selects" | "personalized") => {
    let classNameStyles = "";
    switch (optionsLayout) {
      case "Table":
        classNameStyles =
          tableForModalOrPageStyle == "Modal"
            ? "w-full h-full bg-background p-2 pb-4 mt-4 rounded-md shadow-md"
            : "w-full h-full bg-secondaryNew p-2 pb-4 mt-4 rounded-md shadow-md";
        break;
      case "page":
        classNameStyles = "w-full h-full p-4";
        break;
      case "modal":
        classNameStyles = "w-[35vw] h-full";
        break;
      case "Selects":
        classNameStyles =
          "flex flex-row text-center w-full gap-x-4 justify-between items-end bg-secondaryNew p-4 rounded-md shadow-md";
        break;
      case "personalized":
        classNameStyles = classNamePersonalized;
        break;
      default:
        classNameStyles = "bg-red-500 w-full h-full p-4";
        break;
    }
    return classNameStyles;
  };

  return (
    <>
      {activeEffectVisible ? (
        <Grow in timeout={500}>
          <main className={verifyOptionsLayout(optionsLayout)}>{children}</main>
        </Grow>
      ) : (
        <main className={verifyOptionsLayout(optionsLayout)}>{children}</main>
      )}
    </>
  );
};
