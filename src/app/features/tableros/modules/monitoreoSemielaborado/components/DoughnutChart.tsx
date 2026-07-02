import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
interface Props {
  porcentaje: number;
}

export const DoughnutChart = ({ porcentaje }: Props) => {
  // console.log(porcentaje);
  const data = {
    datasets: [
      {
        data: [porcentaje, 100 - porcentaje],
        backgroundColor: ["#5DC90A", "#BDBDBD"],
        hoverBackgroundColor: ["#5DC90A", "#BDBDBD"],
        borderWidth: 0,
        borderRadius: 10, // Redondea las puntas de la parte verde
        circumference: 360, // Asegura que el arco cubra toda la circunferencia
      },
    ],
  };
  const options = {
    cutout: "70%", // Tamaño del agujero central
    // rotation: -90, // Empieza desde la parte superior
    plugins: {
      tooltip: {
        enabled: false, // Habilitar tooltip si es necesario
      },
    },
  };

  return (
    <div style={{marginBottom:"5%", marginLeft:"5%"}}>
      <div style={{ position: "relative", width: "150px", height: "150px" }}>
        {/* <h6 style={{ textAlign:"center"}}>Consumido</h6> */}
        
        <Doughnut data={data} options={options} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "25px",
            fontWeight: "bold",
          }}
        >
          {`${porcentaje}%`}
        </div>
      </div>
    </div>
  );
};
