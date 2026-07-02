
import { Box } from "@mui/system";
import { IDobMovimientosDeclaracion } from "app/models/IDobMovimientosDeclaracion";
import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion"
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import React from "react"
interface Props{
  dataDeclarada:IDobProdDeclaracion
}



export const TablaMovimientosDeclaradosDobladora = ({dataDeclarada}:Props):JSX.Element => {

return (
    
    <div className="min-w-[650px] p-2 flex flex-col gap-4">
      
      {/* Resumen de la declaracion */}
      <div className="w-full flex flex-row justify-between items-center bg-[#F8FAFB] p-3 rounded-lg border border-[#E9EDF3]">
        <div>
          <p className="font-semibold text-xs text-gray-700">{dataDeclarada.descripcion}</p>
        </div>
        <div>
          <p className="font-semibold text-xs text-gray-700">{dataDeclarada.op}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-700">Programado: {dataDeclarada.cantidadOP} unid.</p>
        </div>
        <div>
          <p className="font-black text-xs text-gray-700">Producido: {dataDeclarada.totalDeclarado} unid.</p>
        </div>
      </div>

      <div className="w-full">
      <Box sx={{
      
      "& th[role='columnheader']": {
        textAlign: "center !important",
      },
      
    
    }}>
      <TableComponent
        IDcolumn={"id"}
        headerBackgroundColor="#F8FAFB" 
        columns={[
          {
            title: "Fecha",
            field: "fecha", 
            render: (row: IDobMovimientosDeclaracion) => {
              return (
                <div className="w-full font-medium text-gray-600">
                  {moment(row.fecha).format("DD/MM/YYYY")}
                </div>
              );
            }
          },
          {
            title: "Hora",
            field: "fecha_hora", 
            render: (row: IDobMovimientosDeclaracion) => {
              return (
                <div className="w-full font-medium text-gray-600">
                  {moment(row.fecha).format("HH:mm")}
                </div>
              );
            }
          },
          {
            title: "Producido",
            field: "cantDeclarada",
            render: (row: IDobMovimientosDeclaracion) => {
              return (
                <div className="w-full font-semibold text-gray-800">
                  {row.cantDeclarada}
                </div>
              );
            }
          },
          {
            title:"Maquina",
            field:"maquina",
            render: (row:IDobMovimientosDeclaracion) => {
              return (
                <div className="w-full font-semibold text-gray-800">
                  {row.nombreMaquina}
                </div>
              );
            }
          }
        ]}
        dataInfo={dataDeclarada.movimientos}
      />
    </Box>

      </div>

      
    </div>
  );
}