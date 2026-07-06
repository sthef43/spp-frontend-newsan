import React, { useEffect, useState } from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import moment from "moment";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { AgregarReprocesadoIndividual } from "app/features/calidad/components/AgregarReprocesadoIndividual";
import { AgregarReprocesadoPorGrupo } from "app/features/calidad/components/AgregarReprocesadoPorGrupo";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";

interface props {
  listado: IReprocesoLinea[]; //Listado de ReprocesoLinea que existen
  getValuesProp: any;
  refreshList?: any; //Refresca la lista con los ReprocesoLineas creados
  idControlLote: number;
  prefijoPlanProd: any;
}

export const ReprocesadosModal = ({
  listado,
  getValuesProp,
  refreshList,
  idControlLote,
  prefijoPlanProd
}: props): JSX.Element => {
  const [cargando, setCargando] = React.useState(true);
  const [dataOpen, setDataOpen] = React.useState<IReprocesoLinea[]>(null);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = React.useState("");
  const [codigosFaltantes, setCodigosFaltantes] = useState([]);
  const [codigoBase, setCodigoBase] = useState("");

  // console.log("hola q ace<");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  React.useEffect(() => {
    setCargando(!cargando);
  }, [dataOpen]);

  useEffect(() => {
    setDataOpen(listado);
    cualFalta();
    generarCodigoBase();
  }, []);

  useEffect(() => {
    setDataOpen(listado);
    cualFalta();
  }, [listado]);

  const generarCodigoBase = () => {
    setCodigoBase(prefijoPlanProd);
  };

  //Obtengo un listado con los codigos que faltan.
  const cualFalta = () => {
    const faltantes = [];
    const hasta = getValuesProp("serieHasta");
    const desde = getValuesProp("serieDesde");
    const cantReprocesados = hasta - desde + 1; //Cantidad de reprocesados que tienen que haber
    const listadoCod = [];
    //creo una lista de los codigos reprocesados que existen, pero sacandole los primeros 5 digitos q son estaticos y los 0. Quedandome con los ultimos numeros
    listado.forEach((element) => {
      const codigoSinPrimerosdigitos = parseInt(element.codigoNewsan.substring(5));
      const codigoSinCeros = Number(codigoSinPrimerosdigitos);
      listadoCod.push(codigoSinCeros);
    });
    let desdeAux = desde;
    //Creo un listado con los codigos faltantes por reprocesar
    for (let index = 0; index < cantReprocesados; index++) {
      if (!listadoCod.includes(desdeAux)) faltantes.push(desdeAux);
      desdeAux += 1;
    }
    console.log(faltantes);
    setCodigosFaltantes(faltantes);
    // console.log("faltan los codigos: " + faltantes);
  };

  return (
    <div>
      <div className="text-right">
        <Button
          onClick={(e) => {
            setOpenModal(true);
          }}>
          Agregar
        </Button>
      </div>
      <TableComponent
        IDcolumn={"IdReprocesoLinea"}
        buscar={true}
        excel
        columns={[
          {
            title: "Codigo",
            field: "codigoNewsan"
          },
          {
            title: "Fecha",
            field: "fecha",
            render: (row) => moment(row.fecha).format("L")
          },
          {
            title: "Hora",
            field: "hora"
          },
          {
            title: "Nombre",
            field: "nombreUsuario"
          },
          {
            title: "Estado Proceso",
            field: "estadoReproceso"
          }
        ]}
        dataInfo={dataOpen}
        Dense={true}
      />
      {
        <ModalCompoment title="Agregar Reprocesado" openPopup={openModal} setOpenPopup={setOpenModal}>
          <>
            <div className="text-center">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Selecciona una forma de agregar</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                  row>
                  <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                  <FormControlLabel value="Grupo" control={<Radio />} label="Grupo" />
                </RadioGroup>
              </FormControl>
            </div>
            {value == "Individual" ? (
              <AgregarReprocesadoIndividual
                refreshList={refreshList}
                idControlLote={idControlLote}
                codigosFaltantes={codigosFaltantes}></AgregarReprocesadoIndividual>
            ) : value == "Grupo" ? (
              <AgregarReprocesadoPorGrupo
                getValuesProp={getValuesProp}
                codigosFaltantes={codigosFaltantes}
                codigoBase={codigoBase}
                idControlLote={idControlLote}
                refreshList={refreshList}
                cualFalta={cualFalta}></AgregarReprocesadoPorGrupo>
            ) : (
              ""
            )}
          </>
        </ModalCompoment>
      }
    </div>
  );
};
