import { useAppSelector } from "app/core/store/store";
import { IOQCTarget } from "app/models/IOQCTarget";
import React from "react";
interface ICustomToolTip {
  value: any;
  target: IOQCTarget;
  dataGraf: any[];
}
export const CustomToolTip = ({ value, target, dataGraf }: ICustomToolTip): JSX.Element => {
  const { darkMode } = useAppSelector((state) => state.colorApp);

  const { active, label } = value;
  let { payload } = value;
  if (active && payload) {
    payload = payload.filter((pld) => pld.value > 0);
    const data = dataGraf.find((d) => d.mes == label);
    if (payload.length > 0) {
      return (
        <div
          style={{
            backgroundColor: "#5b63ffe7",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "1px 2px 10px -2px #7873ffb1",
            color: darkMode ? "#fff" : "#000"
          }}>
          <h4>{label}</h4>
          <p
            key={"target"}
            style={{
              borderStyle: "solid 1px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: darkMode ? "#fff" : "#000"
            }}>
            Target: {target ? target.target : 0}
          </p>
          <p
            style={{
              borderStyle: "solid 1px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: darkMode ? "#fff" : "#000",
              textTransform: "capitalize"
            }}>
            {`Indice : ${data.oqc.toFixed(2)}`}
          </p>
          <p
            style={{
              borderStyle: "solid 1px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: darkMode ? "#fff" : "#000",
              textTransform: "capitalize"
            }}>
            {`Diferencia : ${data.oqc < target.target ? (data.oqc - target.target).toFixed(2) : "0"}`}
          </p>
          <p
            style={{
              borderStyle: "solid 1px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: darkMode ? "#fff" : "#000",
              textTransform: "capitalize"
            }}>
            {`Sobre expectativa : ${data.oqc > target.target ? (data.oqc - target.target).toFixed(2) : "0"}`}
          </p>
          <p
            style={{
              borderStyle: "solid 1px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: darkMode ? "#fff" : "#000",
              textTransform: "capitalize"
            }}>
            {`Total pruebas: ${data.total}`}
          </p>
        </div>
      );
    }
  }
  return null;
};
