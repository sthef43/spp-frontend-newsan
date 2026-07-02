import { Grid, TextField } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { IControlLote } from "app/models";
import { AprobacionReprocesosForm } from "./AprobacionReprocesosForm";

interface props {
  controlLoteSelected: IControlLote;
  setOpenPopup: any;
  getListByControlLoteId: any;
  refreshList: any;
  lineaModeloProp: any;
}

export const AccionAprobacionReprocesos = ({
  controlLoteSelected,
  setOpenPopup,
  getListByControlLoteId,
  refreshList,
  lineaModeloProp
}: props) => {
  const [listCodigos, setListCodigos] = useState([]);
  const [dataOpen, setDataOpen] = useState([]);
  const [cantidadTotal, setCantidadTotal] = useState(0);

  useEffect(() => {
    cualFalta();
  }, []);

  useEffect(() => {
    crearListado();
  }, [listCodigos]);

  useEffect(() => {
    generarCantidadTotal();
  }, [dataOpen]);

  //Obtengo un listado con los codigos que faltan.
  const cualFalta = async () => {
    const responseOrder = _.orderBy(controlLoteSelected.reprocesoLinea, "codigoNewsan");
    console.log(responseOrder);
    const listadoCod = [];
    //creo una lista de los codigos donde el estadoReproceso = null, pero sacandole los primeros 5 digitos q son estaticos y los 0. Quedandome con los ultimos numeros
    responseOrder.forEach((element) => {
      if (element.estadoReproceso == null) {
        const codigoSinPrimerosdigitos = parseInt(element.codigoNewsan.substring(5));
        const codigoSinCeros = Number(codigoSinPrimerosdigitos);
        listadoCod.push(codigoSinCeros);
      }
    });
    setListCodigos(listadoCod);
  };

  //Creo un listado con los codigos que faltan generar.
  const crearListado = () => {
    let ultimo;
    let aux = 0;
    const newArray = [];
    //Recorro todos los codigos
    for (let index = 0; index < listCodigos.length; index++) {
      ultimo = listCodigos[index];
      //Control para saber si estoy en el ultimo registro
      if (index + 1 != listCodigos.length) {
        if (listCodigos[index] + 1 == listCodigos[index + 1]) {
          ultimo = listCodigos[index + 1];
          aux += 1; //con esto identifico el desde.
        } else {
          const obj = {
            id: listCodigos[index],
            desde: listCodigos[index - aux], //vuelvo a la posicion donde comienzaz
            hasta: ultimo,
            cantidad: ultimo - listCodigos[index - aux] + 1,
            fecha: moment(controlLoteSelected.fecha).format("L")
          };
          newArray.push(obj);
          aux = 0;
        }
      } else {
        //Estoy parado en el anteUltimo elemento del arreglo.
        const obj = {
          id: listCodigos[index],
          desde: listCodigos[index - aux], //vuelvo a la posicion donde comienzaz
          hasta: listCodigos[index],
          cantidad: ultimo - listCodigos[index - aux] + 1,
          fecha: moment(controlLoteSelected.fecha).format("L")
        };
        newArray.push(obj);
      }
    }
    setDataOpen(newArray);
  };

  const generarCantidadTotal = () => {
    let suma = 0;
    dataOpen.forEach((element) => {
      suma += element.cantidad;
    });
    setCantidadTotal(suma);
  };

  return (
    <div>
      <form noValidate autoComplete="off" style={{ width: "80vw" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              placeholder="Placeholder"
              multiline
              fullWidth
              id="observaciones"
              label="Defecto"
              variant="standard"
              disabled={true}
              value={controlLoteSelected.observaciones}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              id="cant"
              label="Cantidad Total"
              variant="standard"
              value={cantidadTotal}
              disabled={true}
            />
          </Grid>
        </Grid>
      </form>
      <TableComponent
        IDcolumn={"id"}
        buscar={false}
        columns={[
          {
            title: "Desde",
            field: "desde"
          },
          {
            title: "Hasta",
            field: "hasta"
          },
          {
            title: "Fecha",
            field: "fecha"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          }
        ]}
        dataInfo={dataOpen}
        Dense={true}
      />
      <AprobacionReprocesosForm
        idControlLote={controlLoteSelected.idControlLote}
        cantidadTotal={cantidadTotal}
        getListByControlLoteId={getListByControlLoteId}
        reprocesosLineasDesdeHasta={dataOpen}
        refreshList={refreshList}
        setOpenPopup={setOpenPopup}
        lineaModeloProp={lineaModeloProp}></AprobacionReprocesosForm>
    </div>
  );
};
