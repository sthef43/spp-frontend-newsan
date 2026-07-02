/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IOperator } from "app/models";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import moment from "moment";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";

interface props {
  getValuesProp: any;
  codigosFaltantes: Array<number>;
  codigoBase: string; //Codigo base a utilizar para crear los ReprocesoLinea
  idControlLote: number; //id del controlLote que selecciono en la grilla principal.
  refreshList: any; //Refresca la lista de ReprocesadosLinea
  cualFalta: any; //Funcion que sabe que ReprocesosLinea faltan crear.
}

export const AgregarReprocesadoPorGrupo = ({
  getValuesProp,
  codigosFaltantes,
  codigoBase,
  idControlLote,
  refreshList,
  cualFalta
}: props): JSX.Element => {
  const initValue = {
    desde: 0,
    hasta: 0
  };

  const buttonClasses = MaterialButtons();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [cargando, setCargando] = React.useState(true);
  const [dataOpen, setDataOpen] = React.useState<IReprocesoLinea[]>(null);
  const [listaReprocesosLineasCrear, setListaReprocesosLineasCrear] = useState([]);
  const [desdeHasta, setDesdeHasta] = useState(initValue);
  const [puedeGuardar, setPuedeGuardar] = useState(false);

  React.useEffect(() => {
    setCargando(!cargando);
  }, [dataOpen]);

  useEffect(() => {
    guardarDesdeHasta();
  }, []);

  useEffect(() => {
    crearListado();
  }, [codigosFaltantes]);

  useEffect(() => {
    mostrarBotonGuardar();
  }, [listaReprocesosLineasCrear]);

  const guardarDesdeHasta = () => {
    const desdeHasta = {
      desde: getValuesProp("serieDesde"),
      hasta: getValuesProp("serieHasta")
    };
    setDesdeHasta(desdeHasta);
  };

  const getInfoUser = async () => {
    const user = GetInfoUser();
    let result;
    try {
      result = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(user.dni)));
    } catch (e) {
      console.log(e);
    }
    if (result) return result;
  };

  //Creo un listado con los codigos que faltan generar.
  const crearListado = () => {
    let ultimo;
    let aux = 0;
    const newArray = [];
    //Recorro todos los codigos que faltan
    for (let index = 0; index < codigosFaltantes.length; index++) {
      ultimo = codigosFaltantes[index];
      //Control para saber si estoy en el ultimo registro
      if (index + 1 != codigosFaltantes.length) {
        if (codigosFaltantes[index] + 1 == codigosFaltantes[index + 1]) {
          ultimo = codigosFaltantes[index + 1];
          aux += 1; //con esto identifico el desde.
        } else {
          const obj = {
            id: codigosFaltantes[index],
            desde: codigosFaltantes[index - aux], //vuelvo a la posicion donde comienzaz
            hasta: ultimo,
            cantidad: ultimo - codigosFaltantes[index - aux] + 1,
            seleccionado: false
          };
          newArray.push(obj);
          aux = 0;
        }
      } else {
        //Estoy parado en el anteUltimo elemento del arreglo.
        const obj = {
          id: codigosFaltantes[index],
          desde: codigosFaltantes[index - aux], //vuelvo a la posicion donde comienzaz
          hasta: codigosFaltantes[index],
          cantidad: ultimo - codigosFaltantes[index - aux] + 1,
          seleccionado: false
        };
        newArray.push(obj);
      }
    }
    console.log(newArray);
    setListaReprocesosLineasCrear(newArray);
  };

  const handleMarcarDesmarcar = (row, marcar) => {
    const listaReprocesosLineasCrearModificado = listaReprocesosLineasCrear.map(function (x) {
      if (x.id == row.id) x.seleccionado = marcar;
      return x;
    });
    setListaReprocesosLineasCrear(listaReprocesosLineasCrearModificado);
    console.log(listaReprocesosLineasCrearModificado);
  };

  const getCodigo = (desde) => {
    let codigo = "0" + codigoBase;
    const diferencia = 14 - (codigoBase + desde).length;
    //Relleno con 0 hasta que el codigo tenga 15 digitos.
    for (let index = 0; index < diferencia; index++) {
      codigo += "0";
    }
    codigo += desde;
    return codigo;
  };

  const armarObjetosReprocesoLinea = (element, user: IOperator, date) => {
    let desde = element.desde;
    const listaReturn = [];
    for (let index = 0; index < element.cantidad; index++) {
      const objeto = {
        Fecha: moment().format("YYYY-MM-DD"),
        Hora: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        IdControlLote: idControlLote,
        NombreUsuario: `${user.name} ${user.surname}`,
        //EstadoReproceso: "S", Tiene que guardar en null. Modificado el 5/12/2022
        CodigoNewsan: getCodigo(desde)
      };
      desde += 1;
      listaReturn.push(objeto);
    }
    return listaReturn;
  };

  const generarReprocesosLineas = async () => {
    const registrosSeleccionados = listaReprocesosLineasCrear.filter((x) => x.seleccionado);
    let objetos;
    const date = new Date();
    const user: IOperator = await getInfoUser();
    const reprocesosLineas = [];
    registrosSeleccionados.forEach((element) => {
      objetos = armarObjetosReprocesoLinea(element, user, date);
      objetos.forEach((elementAux) => {
        reprocesosLineas.push(elementAux);
      });
    });
    console.log("Registros genereados a guardar --- ");
    console.log(reprocesosLineas);
    return reprocesosLineas;
  };

  const guardarReprocesosLineas = async () => {
    const reprocesosLineasGuardar: IReprocesoLinea[] = await generarReprocesosLineas();
    let result;
    try {
      result = unwrapResult(await dispatch(ReprocesoLineaSliceRequests.multiPostRequest(reprocesosLineasGuardar)));
    } catch (e) {
      console.log(e);
    }
    if (result) {
      openNotificationUI("Dato guardado exitosamente :)", "success");
      refreshList();
      cualFalta();
      crearListado();
    }
  };

  const mostrarBotonGuardar = () => {
    const haySeleccionado = listaReprocesosLineasCrear.find((x) => x.seleccionado);
    if (haySeleccionado) setPuedeGuardar(true);
    else setPuedeGuardar(false);
  };

  return (
    <div>
      <div className="text-center grid-cols-2">
        <h1>
          Desde: {desdeHasta.desde} - Hasta: {desdeHasta.hasta}
        </h1>
      </div>
      <TableComponent
        IDcolumn={"id"}
        buscar={true}
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
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Accion",
            field: "",
            render: (row) => (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" checked={row.cargado} />}
                  label="Agregar"
                  onChange={() => {
                    if (!row.seleccionado) {
                      handleMarcarDesmarcar(row, true);
                    } else {
                      handleMarcarDesmarcar(row, false);
                    }
                  }}
                />
              </FormGroup>
            )
          }
        ]}
        dataInfo={listaReprocesosLineasCrear}
        Dense={true}
      />
      {puedeGuardar && (
        <div className="text-center">
          <Button
            className={buttonClasses.greenButton}
            variant="contained"
            onClick={() => {
              guardarReprocesosLineas();
            }}>
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
};
