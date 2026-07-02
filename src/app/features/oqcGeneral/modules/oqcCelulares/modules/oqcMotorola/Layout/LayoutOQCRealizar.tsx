import React from "react";
import { MyProvider } from "../../../Context/Context";
import { RealizarOqc } from "../Pages/RealizarOqc";

export const LayoutOQCRealizar = () => {
  return (
    //Este layout es para que todo lo que esta dentro del context funcione y se puedan usar en los componentes las variables
    <MyProvider>
      <RealizarOqc></RealizarOqc>
    </MyProvider>
  );
};
