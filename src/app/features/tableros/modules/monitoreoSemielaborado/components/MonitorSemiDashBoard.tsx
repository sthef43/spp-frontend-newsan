import { IPlanProd } from "app/models";
import React, { useEffect, useState } from "react";
import { DoughnutChart } from "./DoughnutChart";
import { BarChart } from "./BarChart";
interface Props {
  planProdMain: IPlanProd[] | null;
}

export const MonitorSemiDashBoard = ({ planProdMain }: Props): JSX.Element => {
  // console.log(planProdMain);
  useEffect(() => {
    if (planProdMain){
      getData();
    }
  }, []);
  useEffect(() => {
    if (planProdMain){
      getData();
    }
  }, [planProdMain]);

  const [data, setdata] = useState(null);
  const getData = () => {
    const familiaFilter = planProdMain.reduce((acc, item) => {
      // Si la categoría (capacidad) no existe en el acumulador, la creamos como un array vacío
      if (!acc[item.capacidad]) {
        acc[item.capacidad] = [];
      }
      // Calculamos el promedio cantidad/producido
      const promedio = (parseInt(item.cantidadProducida) * 100) / item.cantidad;
      // Agregamos el objeto actual al array de su categoría correspondiente, incluyendo el nombre del semielaborado y el promedio
      acc[item.capacidad].push({
        ...item,
        promedio
      });

      return acc;
    }, {} as Record<string, Array<(typeof planProdMain)[number] & { promedio: number }>>);
    // console.log(familiaFilter);
    // Ahora sumamos las cantidades por categoría y calculamos el promedio total por categoría
    const sumasPorCategoria = Object.keys(familiaFilter).map((categoria) => {
      // Recolectamos todas las OPs
      const productos = familiaFilter[categoria];
      const ordenesProduccion = productos.map((producto) => ({
        numeroOp: producto.numeroOp, // Suponiendo que "OP" sea el campo del número de orden de producción
        cantidadProducida: producto.cantidadProducida
      }));
      const totalCantidad = familiaFilter[categoria].reduce((sum, producto) => sum + producto.cantidad, 0);
      // Calculamos el promedio total por categoría
      const promedioTotal = (
        familiaFilter[categoria].reduce((sum, producto) => sum + producto.promedio, 0) / familiaFilter[categoria].length
      ).toFixed(2);
      // const semielaborado = familiaFilter[categoria][0].semielaborado.nombre;
      const semielaborado = familiaFilter[categoria][0].tipoSemiElaborado;
      return {
        categoria,
        semielaborado,
        totalCantidad,
        promedioTotal,
        ordenesProduccion // Añadimos todas las OPs aquí
      };
    });
    // console.log(sumasPorCategoria);
    setdata(sumasPorCategoria);
  };

  return (
    <div>
      {data &&
        data.slice(0, 2).map((result, index) => (
          <div key={index}>
            <div className="p-1 m-1 rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ textAlign: "center", fontSize: "17px" }}>
              Familia: {result.categoria} - Semi: {result.semielaborado} - Total: {result.totalCantidad}
            </div>
            {/* <h6 style={{ textAlign:"left", marginLeft:"5%"}}>Consumido</h6> */}
            <h6 style={{ textAlign:"left", marginLeft:"5%"}}>Declarado</h6>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row", // para alinear los gráficos uno al lado del otro
                gap: "3rem" // espacio entre los gráficos
              }}>
              <DoughnutChart porcentaje={result.promedioTotal} />
              <BarChart ordenes={result.ordenesProduccion} />
            </div>
          </div>
        ))}
    </div>
  );
};
