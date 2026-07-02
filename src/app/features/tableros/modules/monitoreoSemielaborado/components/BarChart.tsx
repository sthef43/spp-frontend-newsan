import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
interface Props {
  ordenes: {
    numeroOp: string;
    cantidadProducida: string;
  }[];
}
export const BarChart = ({ ordenes }: Props) => {
  // console.log(ordenes);
  // Extraemos las etiquetas (numeroOp) y los datos (cantidadProducida)
  const labels = ordenes.map((orden) => orden.numeroOp); // Extraemos los valores de 'numeroOp' para usar como etiquetas
  const dataValues = ordenes.map((orden) => parseInt(orden.cantidadProducida)); // Extraemos los valores de 'cantidadProducida' para usar como datos
  const data = {
    labels, // Etiquetas dinámicas de 'numeroOp' Etiquetas para cada barra en el eje X
    datasets: [
      {
        data: dataValues, // Datos dinámicos de 'cantidadProducida' Valores para las dos barras
        backgroundColor: "#B2EA1B", // Color de las barras
        borderRadius: 1, // Puntas redondeadas para la barra
        barThickness: 40 // Grosor de la barra
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Ocultar la leyenda superior
      },
      tooltip: {
        enabled: false // Deshabilitar tooltip
      }
    },
    scales: {
      x: {
        //OP
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF" // Color de las etiquetas del eje X
        },
        grid: {
          display: false // Deshabilitar las líneas de la cuadrícula en X
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF" // Color de las etiquetas del eje Y
        },
        grid: {
          color: "#FFFFFF" // Color de las líneas divisorias de la cuadrícula en Y
        }
      }
    }
  };

  return (
    <div style={{ width: "300px", height: "200px", alignContent:"center" }}>
      {/* <h6 style={{ textAlign:"center"}}></h6> */}
      <Bar data={data} options={options} />
    </div>
  );
};
