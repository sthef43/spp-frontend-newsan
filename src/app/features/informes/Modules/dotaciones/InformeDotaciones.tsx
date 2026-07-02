import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotaFamiliaLineaProduccionSliceRequests } from "app/Middleware/reducers/DotaFamiliaLineaProduccionSlice";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Typography } from "@mui/material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { DotacionesFilter } from "app/features/ingenieria/modules/dotaciones/DotacionesFilter";

export const InformeDotaciones = () => {
  const { TitleChanger } = useTitleOfApp();

  const datosFiltroInterface = {
    plantId: 0,
    lineaProduccionId: 0,
    dotaFamiliaId: 0
  };
  const dispatch = useAppDispatch();
  const [dotaFamiliaLineaProduccion, setDotaFamiliaLineaProduccion] = useState<IDotaFamiliaLineaProduccion>(null);
  const [listSectorAndPuestos, setListSectorAndPuestos] = useState([]);
  const [datosFiltro, setDatosFiltro] = useState(datosFiltroInterface);
  const [cantTotalGeneral, setCantTotalGeneral] = useState(0);

  useEffect(() => {
    const { plantId, dotaFamiliaId, lineaProduccionId } = datosFiltro;
    if (plantId != 0 && dotaFamiliaId != 0 && lineaProduccionId != 0) {
      getDotaFamiliaLineaProduccion();
    }
  }, [datosFiltro]);

  useEffect(() => {
    TitleChanger("INFORME DOTACIONES");
  }, []);

  //Traigo la info para mostrar.
  const getDotaFamiliaLineaProduccion = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaFamiliaLineaProduccionSliceRequests.GetByFamiliaAndLinea({
          dotaFamiliaId: datosFiltro.dotaFamiliaId,
          lineaProduccionId: datosFiltro.lineaProduccionId
        })
      )
    );
    if (result) {
      //Filtro solamente el que es vigente, solo tiene que haber uno
      //const resultNew = result.find((x) => x.vigente == true);
      setDotaFamiliaLineaProduccion(result);
      //console.log(resultNew);
    } else setDotaFamiliaLineaProduccion(null);
  };

  useEffect(() => {
    if (dotaFamiliaLineaProduccion) {
      generarPuestosPorSectores();
    } else {
      setListSectorAndPuestos([]);
      setCantTotalGeneral(0);
    }
  }, [dotaFamiliaLineaProduccion]);

  //Genera un arrar con los sectores y sus puestos.
  const generarPuestosPorSectores = () => {
    const sectores = generarArraySectores();

    const listDotaSectorPuesto = dotaFamiliaLineaProduccion.dotaSectorPuesto;
    let arrayPuestos = [];
    const arraySectorAndPuestos = [];
    let cantTotal = 0;
    let cantTotalGeneral = 0;
    //Recorro los sectores
    for (let index = 0; index < sectores.length; index++) {
      const sector = sectores[index];
      //Recorro todos los puestos, y voy armando los puestos por sector.
      for (let index = 0; index < listDotaSectorPuesto.length; index++) {
        const dotaSectorPuesto = listDotaSectorPuesto[index];
        if (sector == dotaSectorPuesto.dotaSector.nombre) {
          cantTotal += dotaSectorPuesto.cantidad;
          let obj = { nombreSector: dotaSectorPuesto.dotaPuesto.nombre, cantidad: dotaSectorPuesto.cantidad };
          arrayPuestos.push({ ...obj });
          obj = null;
        }
      }
      arraySectorAndPuestos.push({
        sector: sector,
        puestos: [...arrayPuestos],
        cantidadTotal: cantTotal
      });
      cantTotalGeneral += cantTotal;
      cantTotal = 0;
      arrayPuestos = []; //Nulleo la data
    }
    setListSectorAndPuestos(arraySectorAndPuestos);
    setCantTotalGeneral(cantTotalGeneral);
  };

  const generarArraySectores = () => {
    const listSectoresAux = [];
    const listDotaSectorPuesto = [...dotaFamiliaLineaProduccion.dotaSectorPuesto];
    //Me quedo con un array de solamente los sectores seleccionados.
    listDotaSectorPuesto.forEach((dotaSectorPuesto) => {
      if (!listSectoresAux.includes(dotaSectorPuesto.dotaSector.nombre))
        listSectoresAux.push(dotaSectorPuesto.dotaSector.nombre);
    });
    return listSectoresAux;
  };

  useEffect(() => {
    if (listSectorAndPuestos && listSectorAndPuestos.length > 0) {
      listSectorAndPuestos;
    }
  }, [listSectorAndPuestos]);

  return (
    <div>
      <div className="my-2 h-full">
        <div className="flex justify-around rounded-lg px-4 w-full my-2 bg-secondaryNew shadow-elevation-4">
          <DotacionesFilter
            setDatosFiltro={setDatosFiltro}
            datosFiltro={datosFiltro}
            refreshFamilia={null}></DotacionesFilter>
        </div>
        <div className="w-full" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          {listSectorAndPuestos &&
            listSectorAndPuestos.length > 0 &&
            listSectorAndPuestos.map((element) => (
              <div key={element.sector} className="flex flex-col content-aorund items-center p-4">
                <Typography variant="h4">{element.sector}</Typography>
                <TableComponent
                  Dense={true}
                  Overflow={false}
                  buscar={false}
                  IDcolumn={"id"}
                  columns={[
                    {
                      title: "Puesto",
                      field: "nombreSector"
                    },
                    {
                      title: "Cantidad",
                      field: "cantidad"
                    }
                  ]}
                  dataInfo={element.puestos}
                />
                <Typography variant="h4"> {"TOTAL - " + element.cantidadTotal}</Typography>
              </div>
            ))}
        </div>
        <div className="text-center">
          <Typography variant="h4"> {"TOTAL FINAL - " + cantTotalGeneral}</Typography>
        </div>
      </div>
    </div>
  );
};
