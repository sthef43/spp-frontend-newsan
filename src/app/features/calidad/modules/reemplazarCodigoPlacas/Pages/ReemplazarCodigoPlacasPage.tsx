import React, { useEffect, useState } from "react";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "app/core/store/store";
import { MapasRutasSliceRequest } from "app/Middleware/reducers/MapasRutasSlice";
import { ILineaProduccionRutas } from "app/models/ILineaProduccionRutas";
import { MapasRutasCamposSliceRequest } from "app/Middleware/reducers/MapasRutasCamposSlice";
import { IMapasRutas } from "app/models/IMapasRutas";
import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import { Button, TextField } from "@mui/material";
import { TrazaUnit2SliceRequest } from "app/Middleware/reducers/trazaUnit2Slice";
import { ILineaPuesto } from "app/models/ILineaPuesto";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import moment from "moment";
import { IFamilia } from "app/models/IFamilia";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { IModelo } from "app/models/IModelo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TrazaUnit_History } from "app/models/ITrazaUnit_History";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { ISemielaboradoIA } from "app/models";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { EncabezadoPlantasLineas } from "../Components/EncabezadoPlantasLineas";

export const ReemplazarCodigoPlacasPage = () => {
  const { handleSubmit } = useForm<{ codigo: string }>({
    defaultValues: { codigo: "" }
  });

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();

  const [buscoCorrecto, setBuscoCorrecto] = useState(false);
  const [cod, setCod] = useState("");
  const [lineaProduccionSelected, setLineaProduccionSelected] = useState<ILineaProduccion>();
  const [lineaProduccionRuta, setLineaProduccionRuta] = useState<ILineaProduccionRutas>();
  const [lineaPuesto, setLineaPuesto] = useState<ILineaPuesto>();
  const [familiaSelected, setFamiliaSelected] = useState<IFamilia>();
  const [semielaboradoTipoSelected, setSemielaboradoTipoSelected] = useState<ISemielaboradoTipo>();
  const [mapaRutaCampoSelected, setMapaRutaCampoSelected] = useState<IMapasRutasCampos>();
  const [modeloSelected, setModeloSelected] = useState<IModelo>();

  const fetchGeneric = async (func) => {
    let result;
    try {
      result = unwrapResult(await dispatch(func));
    } catch (error) {
      console.log(error);
    }
    if (result) return result;
    else return null;
  };

  const getData = async () => {
    //Traigo la LineaProduccionRuta
    const lineaProduccionRuta = await fetchGeneric(
      LineaProduccionRutasSliceRequest.getRutaActivaByLineaId(lineaProduccionSelected.id)
    );
    if (!lineaProduccionRuta) {
      openNotificationUI("No existe lineaProduccionRuta", "error");
      return false;
    }
    setLineaProduccionRuta(lineaProduccionRuta);
    //Traigo el MapaRuta
    const mapaRuta: IMapasRutas = await fetchGeneric(
      MapasRutasSliceRequest.GetByRutaIdAndPrimero(lineaProduccionRuta.rutasId)
    );
    if (!mapaRuta) {
      openNotificationUI("No existe mapaRuta", "error");
      return false;
    }
    //Traigo MapasrutasCamposList
    const mapaRutaCampoList: IMapasRutasCampos[] = await fetchGeneric(
      MapasRutasCamposSliceRequest.getListByMapaRutaId(mapaRuta.id)
    );
    if (!mapaRutaCampoList) {
      openNotificationUI("No existe mapaRutaCampo", "error");
      return false;
    }
    //Filtro el MapaRutaCampo con orden 1.
    const mapaRutaCampo = mapaRutaCampoList.find((x) => x.orden == 1);
    setMapaRutaCampoSelected(mapaRutaCampo);
    //Traigo el array de linea LineaPuesto filtrando por linea
    const lineaPuestoArray: ILineaPuesto[] = await fetchGeneric(
      LineaPuestoSliceRequest.getAllByLineaId(lineaProduccionSelected.id)
    );
    let lineaPuesto: ILineaPuesto = null;
    if (!lineaPuestoArray) {
      openNotificationUI("No existe lineaPuesto", "error");
      return false;
    }
    //Obtengo el lineaPuesto filtrando por puesto
    lineaPuesto = lineaPuestoArray.find((x) => x.puestoId == mapaRuta.desdePuestoId);
    if (!lineaPuesto) return false;
    setLineaPuesto(lineaPuesto);
    setBuscoCorrecto(true);
  };

  const buscarCodigo = async () => {
    if (cod == "") {
      openNotificationUI("Inserte un codigo", "info");
      return false;
    }
    const result = await fetchGeneric(TrazaUnit2SliceRequest.getByCodigo(cod));
    if (result) {
      openNotificationUI("El codigo ya existe.", "warning");
      setCod("");
      return false;
    }
    armarObjeto(cod);
  };

  //Armo los 3 objetos a guardar en la BD.
  const armarObjeto = async (codigoInput: string) => {
    //Armo objeto de TrazaUnit2;
    const trazaUnit: ITrazaUnit = {
      codigo: codigoInput,
      createdDate: moment().format("yyyy-MM-DD"),
      lastModifiedDate: moment().format("yyyy-MM-DD"),
      deleted: false,
      rechazado: false,
      alias: mapaRutaCampoSelected.nombre
    };

    //armo el objeto TrazaUnit_History2
    const trazaHistory: TrazaUnit_History = {
      lineaPuestoId: lineaPuesto.id,
      codigo: codigoInput,
      createdDate: moment().format("yyyy-MM-DD"),
      lastModifiedDate: moment().format("yyyy-MM-DD"),
      deleted: false,
      isSemiElaborado: false
    };

    const semielaboradoIA: ISemielaboradoIA = await getSemielaboradosIA();

    if (!semielaboradoIA) {
      openNotificationUI("No existe tipo semielaborado", "error");
      return false;
    }
    const trazaOperacion: TrazaOperaciones = {
      fecha: moment().format("yyyy-MM-DD"),
      ultimaRutaId: lineaProduccionRuta.id,
      codigoInit: codigoInput,
      createdDate: moment().format("yyyy-MM-DD"),
      lastModifiedDate: moment().format("yyyy-MM-DD"),
      deleted: false,
      modelo: modeloSelected.nombre,
      familia: familiaSelected.nombre,
      alias: mapaRutaCampoSelected.nombre,
      unidades: [trazaUnit],
      historial: [trazaHistory],
      semiElaborado: semielaboradoIA.valor
    };
    guardarData(trazaOperacion);
  };

  const guardarData = async (trazaOperacion: TrazaOperaciones) => {
    const result = unwrapResult(
      await dispatch(TrazaOperacionesSliceRequests.TransactionNestedAddRequest(trazaOperacion))
    );
    if (result) {
      openNotificationUI("Guardado exitosamete :)", "success");
      setCod("");
    } else {
      openNotificationUI("Hubo un problema al guardar :(", "error");
    }
  };

  const getSemielaboradosIA = async () => {
    let semielaboradoIA = null;
    const parametros = { familia: familiaSelected.nombre, tipo: semielaboradoTipoSelected.id };
    semielaboradoIA = await unwrapResult(
      await dispatch(SemielaboradoIASliceRequest.getByFamiliaAndTipoSemielaborado(parametros))
    );
    if (semielaboradoIA) return semielaboradoIA;
    else return null;
  };

  useEffect(() => {
    setBuscoCorrecto(false);
    if (lineaProduccionSelected && familiaSelected && modeloSelected && semielaboradoTipoSelected) {
      getData();
    }
  }, [lineaProduccionSelected, familiaSelected, modeloSelected, semielaboradoTipoSelected]);

  useEffect(() => {
    TitleChanger("Reemplazar codigo de placas");
  }, []);

  return (
    <div className="p-2">
      <EncabezadoPlantasLineas
        setLineaProduccionSelected={setLineaProduccionSelected}
        setFamiliaSelected={setFamiliaSelected}
        setSemielaboradoTipoSelected={setSemielaboradoTipoSelected}
        setModeloSelected={setModeloSelected}></EncabezadoPlantasLineas>
      {buscoCorrecto && (
        <div
          className="animate__animated animate__fadeInUp"
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "space-around",
            justifyContent: "space-around",
            padding: 50,
            alignItems: "stretch"
          }}>
          <form onSubmit={handleSubmit(buscarCodigo)}>
            <div style={{ width: 500 }}>
              <TextField
                fullWidth
                label="Codigo"
                value={cod}
                variant="outlined"
                type="text"
                onChange={(e) => {
                  setCod(e.target.value);
                }}
              />
            </div>
            <div style={{ textAlign: "center", padding: 3 }}>
              <Button type="submit" variant="contained" color="success" className={classes.greenButton}>
                Guardar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
