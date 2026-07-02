/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import React, { useEffect, useState } from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { AgregarReprocesadoIndividual } from "../../../components/AgregarReprocesadoIndividual";
import { AgregarReprocesadoPorGrupo } from "../../../components/AgregarReprocesadoPorGrupo";
interface IProps {
  idControlLote: number;
  serieDesde: number;
  serieHasta: number;
}
export const ReprocesadosTable = ({ idControlLote, serieDesde, serieHasta }: IProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const [listadoReprocesadoLinea, setListadoReprocesadoLinea] = useState<IReprocesoLinea[]>([]);
  const [value, setValue] = React.useState("");
  const [codigosFaltantes, setCodigosFaltantes] = useState([]);
  const [codigoBase, setCodigoBase] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const getReprocesoLineaByControlLoteId = async () => {
    let result: IReprocesoLinea[] = [];
    try {
      result = unwrapResult(await dispatch(ReprocesoLineaSliceRequests.getListByControlLoteId(idControlLote)));
    } catch (e) {
      console.log(e);
    }
    if (result) {
      if (result.length > 0) {
        setListadoReprocesadoLinea(result);
      }
    }
  };

  const cualFalta = () => {
    const faltantes = [];
    const cantReprocesados = serieHasta - serieDesde + 1; //Cantidad de reprocesados que tienen que haber
    const listadoCod = [];
    //creo una lista de los codigos reprocesados que existen, pero sacandole los primeros 5 digitos q son estaticos y los 0. Quedandome con los ultimos numeros
    listadoReprocesadoLinea.forEach((element) => {
      const codigoSinPrimerosdigitos = parseInt(element.codigoNewsan.substring(5));
      const codigoSinCeros = Number(codigoSinPrimerosdigitos);
      listadoCod.push(codigoSinCeros);
    });
    let desdeAux = serieDesde;
    //Creo un listado con los codigos faltantes por reprocesar
    for (let index = 0; index < cantReprocesados; index++) {
      if (!listadoCod.includes(desdeAux)) faltantes.push(desdeAux);
      desdeAux += 1;
    }
    setCodigosFaltantes(faltantes);
  };

  const getValuesProp = (value: string) => {
    if (value == "serieDesde") {
      return serieDesde;
    } else {
      return serieHasta;
    }
  };

  useEffect(() => {
    if (idControlLote) getReprocesoLineaByControlLoteId();
  }, [idControlLote]);
  useEffect(() => {
    if (listadoReprocesadoLinea.length > 0) cualFalta();
  }, [listadoReprocesadoLinea]);

  return (
    <div>
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
          refreshList={getReprocesoLineaByControlLoteId}
          idControlLote={idControlLote}
          codigosFaltantes={codigosFaltantes}></AgregarReprocesadoIndividual>
      ) : value == "Grupo" ? (
        <AgregarReprocesadoPorGrupo
          getValuesProp={getValuesProp}
          codigosFaltantes={codigosFaltantes}
          codigoBase={codigoBase}
          idControlLote={idControlLote}
          refreshList={getReprocesoLineaByControlLoteId}
          cualFalta={cualFalta}></AgregarReprocesadoPorGrupo>
      ) : (
        ""
      )}
    </div>
  );
};
