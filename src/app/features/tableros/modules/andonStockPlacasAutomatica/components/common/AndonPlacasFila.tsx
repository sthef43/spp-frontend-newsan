import React from "react";

import type { IAndonPlacas } from "../../models/IAndonPlacas";

export default function AndonPlacasFila(props: IAndonPlacas) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center bg-[#86d4c9] p-4 mx-0 my-[10px] w-full text-3xl font-bold">
      <p className=" text-center">{props.modelo}</p>
      <p className=" text-center">{props.im ?? "0"}</p> {/* IM */}
      <p className=" text-center">{props.prod}</p>
      {/* PROD */}
      <p className=" text-center">{props.cli}</p>
      {/* CLI */}
    </div>
  );
}
