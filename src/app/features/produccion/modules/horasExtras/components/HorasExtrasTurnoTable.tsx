import React from "react";
import moment from "moment";
import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TurnoLineaForm } from "../modals/TurnoLineaForm";
interface IHorasExtrasTurnoTable {
  horaExtraTurno: IHoraExtraTurnoExtras[];
  fecha: string;
  changeValue: (fecha: string, turnoExtrasId: number, newValue: IHoraExtraTurnoExtras) => void;
  onDeleteTurnoL: (key: string, inx: number) => void;
}

export const HorasExtrasTurnoTable = ({
  horaExtraTurno,
  fecha,
  changeValue,
  onDeleteTurnoL
}: IHorasExtrasTurnoTable): JSX.Element => {
  const onDeleteTL = (inx) => {
    onDeleteTurnoL(fecha, inx);
  };

  return (
    <div className="mt-4 border-2 border-gray-400  p-4 w-66vw">
      <TitleUIComponent title={moment(fecha).format("L")} classNameTitle="m-4" />
      {horaExtraTurno.map((horaET, index) => (
        <TurnoLineaForm
          key={index}
          inx={index}
          horaExtraTurnoExtras={horaET}
          changeValue={changeValue}
          fecha={fecha}
          onDeleteTurnoL={onDeleteTL}
        />
      ))}
    </div>
  );
};
