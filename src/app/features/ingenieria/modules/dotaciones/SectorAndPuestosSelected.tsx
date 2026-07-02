import React, { useEffect, useState } from "react";
import { PuestosRender } from "./PuestosRender";
import { Typography, styled } from "@mui/material";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { IDotaSector } from "app/models/IDotaSector";

interface props {
  arraySectoresPuestos: IDotaSectorPuesto[]; //listado
  setArraySectoresPuestos: any; //funcion set del state
  refreshSectoresPuestos: any; //Function que reresca los sectores y puesto, una vez que que agrega o edita.
  onInit: any;
  editando: boolean; //Para saber si esta editando o creando una nueva dotacion.
}

export const SectorAndPuestosSelected = ({
  arraySectoresPuestos,
  setArraySectoresPuestos,
  refreshSectoresPuestos,
  onInit,
  editando
}: props) => {
  const Div = styled("div")(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1)
  }));

  const [arrayCantidadTotalPorSector, setArrayCantidadTotalPorSector] = useState(null);
  const [sectores, setSectores] = useState<IDotaSector[]>([]);

  useEffect(() => {
    if (arraySectoresPuestos && arraySectoresPuestos.length > 0) {
      generarSectores();
    }
  }, [arraySectoresPuestos]);

  //Genero un array con los sectores, para despues poder renderizar cada sector con sus puestos.
  const generarSectores = () => {
    const arraySectores: IDotaSector[] = [];
    for (let index = 0; index < arraySectoresPuestos.length; index++) {
      const sectorPuesto = arraySectoresPuestos[index];
      let existeSector = arraySectores.find((x) => x.id == sectorPuesto.dotaSectorId);
      if (!existeSector) {
        arraySectores.push(sectorPuesto.dotaSector);
      }
      existeSector = null;
    }
    setSectores(arraySectores);
  };

  const calcularCantidadTotalPorSector = () => {
    const arrayTotalPorSector = [];
    let cantidadTotal = 0;
    //Recorro todos los sectores
    for (let index = 0; index < sectores.length; index++) {
      const sector = sectores[index];
      //Recorro el array de sectorpuesto, y sumando para el sector en el que eestoy parado.
      for (let index = 0; index < arraySectoresPuestos.length; index++) {
        const sectorPuesto = arraySectoresPuestos[index];
        if (sector.nombre == sectorPuesto.dotaSector.nombre)
          cantidadTotal += parseInt(sectorPuesto.cantidad.toString());
      }
      arrayTotalPorSector.push({
        sector: sector.nombre,
        cantidad: cantidadTotal
      });

      cantidadTotal = 0;
    }
    setArrayCantidadTotalPorSector(arrayTotalPorSector);
  };

  useEffect(() => {
    calcularCantidadTotalPorSector();
    onInit && onInit(); //Refresca el listado de componente dotacionesPage.
  }, [arraySectoresPuestos]);

  return (
    <div className="flex justify-around text-center p-8">
      {sectores &&
        sectores.map((sector) => (
          <div key={sector.id}>
            <div className="p-2">
              <div>
                <Typography variant={sectores.length > 3 ? "h4" : "h3"}>{"- " + sector.nombre}</Typography>
              </div>
              <div key={sector.id}>
                <PuestosRender
                  sector={sector} //el sector a renderizar
                  setArraySectoresPuestos={setArraySectoresPuestos}
                  arraySectoresPuestos={arraySectoresPuestos}
                  refreshSectoresPuestos={refreshSectoresPuestos}
                  editando={editando}></PuestosRender>
              </div>
              <div>
                {arrayCantidadTotalPorSector && (
                  <Div>Total {arrayCantidadTotalPorSector.find((x) => x.sector == sector.nombre)?.cantidad}</Div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
