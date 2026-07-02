import { Divider } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import React from "react";
import { OQCBloqGroupAccord } from "./OQCBloqGroupAccord";
interface IOQCRealizarDesignadaBody {
  view: boolean;
  envioDatos: boolean;
}
export const OQCRealizarDesignadaBody = ({ view, envioDatos }: IOQCRealizarDesignadaBody): JSX.Element => {
  const oqcDesignada = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);

  return (
    <div className="flex justify-center flex-col">
      <Divider />
      {oqcDesignada &&
        oqcDesignada.oqc &&
        oqcDesignada.oqc.oqcBloqueGroup?.map((bloGroup: IOQCBloqueGroup, index) => (
          <OQCBloqGroupAccord envioDatos={envioDatos} bloGroup={bloGroup} index={index} key={bloGroup.id} view={view} />
        ))}
    </div>
  );
};
