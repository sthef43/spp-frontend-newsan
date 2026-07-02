/* eslint-disable unused-imports/no-unused-vars */
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useState } from "react";
import { SelectComponent } from "../../Components/SelectComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { ICLIItems } from "../../Models/ICLIItems";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  listaItems: ICLIItems;
}

export const ImprimirEtiquetaModal: React.FC<Props> = ({ setOpenModal, listaItems }) => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [listaNumeroLPN, setListaNumerosLPN] = useState([]);
  const [listaImpresoras, setListaImpresoras] = useState([]);

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  const [sectorFiltrado, setSectorFiltrado] = useState<ICLISectores>();

  const [impresoraSeleccionada, setImpresoraSeleccionada] = useState<string | number>(0);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | number>("");

  const cantidadEtiquetas = watch("cantidadEtiquetas");
  const cantidadUnitaria = watch("cantidad");

  const fechaActual = moment().format("YYYY/MM/DD");
  const formatoImpresion = ["Imprimir Cantidad de Etiquetas", "Imprimir Etiqueta Unica"];

  FetchApi(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores);

  const imprimirEtiqueta = async () => {
    const nuevosRegistrosDeImpresion = crearDatosImpresiones();
    const zplCode = crearTextoZPL();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const agregarImpresiones = unwrapResult(
        await dispatch(CLIImpresionEtiquetasSliceRequests.multiPostRequest(nuevosRegistrosDeImpresion))
      );
      const response = unwrapResult(
        await dispatch(
          ImpresionEtiquetaSliceRequests.imprimir({ impresora: impresoraSeleccionada.toString(), zpl: zplCode })
        )
      );
      console.log("Enviado correctamente");
    } catch (error) {
      console.error("Error al imprimir", error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const crearDatosImpresiones = () => {
    let objetoImprimir: ICLIImpresionEtiquetas;
    const arrayObjetos = [];
    listaNumeroLPN.forEach((elementos) => {
      objetoImprimir = {
        lpnGenerada: elementos,
        articulo: listaItems.articulo,
        cliItemsId: listaItems.id,
        cliSectoresId: sectorFiltrado.id,
        cantidad: parseInt(cantidadUnitaria)
      };
      arrayObjetos.push(objetoImprimir);
    });
    if (arrayObjetos != null) {
      return arrayObjetos;
    }
  };

  const crearTextoZPL = () => {
    let zplCode = "";
    listaNumeroLPN.forEach((elementos) => {
      zplCode +=
        `CT~~CD,~CC^~CT~
                        ^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD28^JUS^LRN^CI0^XZ
                        ~DG000.GRF,03456,036,
                        ,::::::::J0iKFE,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::,::::::~DG001.GRF,06144,064,
                        ,::H03FlIFC:H020lI0C::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::H03FlIFC:,:~DG002.GRF,39936,096,
                        ,::H07FoKFC,:::H0780oI03C,:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::H07FoKFC,:::,::::::::::::::::::::::::::^XA
                        ^MMT
                        ^PW799
                        ^LL0400
                        ^LS0
                        ^FT224,96^XG00.GRF,1,1^FS
                        ^FT0,96^XG001.GRF,1,1^FS
                        ^FT0,416^XG002.GRF,1,1^FS
                        ^FO235,3^GB4,90,4^FS
                        ^FO12,268^GB740,0,1^FS
                        ^FT515,37^A0N,20,14^FH^FDCANTIDAD^FS
                        ^FT151,149^A0N,34,33^FH^FD${listaItems.articulo}^FS
                        ^FT515,84^A0N,45,33^FH^FD${parseInt(cantidadUnitaria)}^FS
                        ^BY2,3,57^FT583,94^BCN,,N,N
                        ^FD>:${parseInt(cantidadUnitaria)}^FS
                        ^FT21,150^A0N,28,28^FH^FDARTICULO^FS
                        ^FT21,306^A0N,36,31^FH^FDLPN ${elementos}^FS
                        ^FT14,50^A0N,45,45^FH^FD${fechaActual}^FS
                        ^FT17,85^A0N,26,26^FH^FDRECEPCION^FS
                        ^BY2,3,63^FT151,222^BCN,,N,N
                        ^FD>:${listaItems.articulo}^FS
                        ^FT20,258^A0N,31,28^FH^FD${listaItems.descripcion}^FS
                        ^BY3,3,66^FT67,381^BCN,,N,N
                        ^FD>:${elementos}^FS
                        ^FT242,83^A0N,20,26^FH^FD${listaItems.descripcion}^FS
                        ^FT244,34^A0N,20,19^FH^FD${sectorFiltrado.nombreSector}^FS
                        ^PQ1,0,1,Y^XZ
                        ^XA^ID000.GRF^FS^XZ
                        ^XA^ID001.GRF^FS^XZ
                        ^XA^ID002.GRF^FS^XZ` + "\n";
    });
    if (zplCode != "") {
      return zplCode;
    }
  };

  const CheckImpresoras = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.chechServer()));
      if (response) {
        listaImpresorasService();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const listaImpresorasService = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.getListaImpresoras()));
      if (response) {
        setListaImpresoras(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNumerosLpn = () => {
    const cantidadNumeros = opcionSeleccionada == "Imprimir Etiqueta Unica" ? 1 : parseInt(watch("cantidadEtiquetas"));
    let numerolpn = "0";
    const arrayNumerosLpn = [];
    for (let index = 0; index < cantidadNumeros; index++) {
      numerolpn = "0";
      for (let index = 0; index < 14; index++) {
        const numeroRandom = Math.floor(Math.random() * 10);
        numerolpn = numerolpn += numeroRandom;
      }
      arrayNumerosLpn.push(numerolpn);
    }
    if (arrayNumerosLpn != null) {
      setListaNumerosLPN(arrayNumerosLpn);
      return arrayNumerosLpn;
    }
  };

  useEffect(() => {
    if (cantidadUnitaria || cantidadEtiquetas) {
      generarNumerosLpn();
    }
  }, [cantidadUnitaria, cantidadEtiquetas]);

  useEffect(() => {
    setSectorFiltrado(listaSectores.find((elementos) => elementos.id == sectorSeleccionado));
  }, [sectorSeleccionado]);

  useEffect(() => {
    if (setOpenModal) {
      CheckImpresoras();
    }
  }, [setOpenModal]);

  return (
    <form onSubmit={handleSubmit(imprimirEtiqueta)} className="w-[45vw]">
      <section className="my-4">
        <SelectComponent
          control={control}
          listaObjetos={formatoImpresion}
          nameSelect="formatoImpresion"
          inputLabel="Seleccione una opcion de impresion"
          valueLabel={(item) => item}
          valueSelect={(item) => item}
          valueKey={(item) => item}
          ValueSave={setOpcionSeleccionada}
        />
      </section>
      <section className="flex flex-row gap-x-4">
        <SelectComponent
          control={control}
          listaObjetos={listaImpresoras}
          inputLabel="Seleccione una impresora"
          nameSelect="selectImpresora"
          valueLabel={(item) => item}
          valueSelect={(item) => item}
          valueKey={(item) => item}
          ValueSave={setImpresoraSeleccionada}
        />
        <SelectComponent
          control={control}
          listaObjetos={listaSectores}
          inputLabel="Seleccione un sector"
          nameSelect="sector"
          valueLabel={(item) => item.nombreSector}
          valueSelect={(item) => item.id}
          valueKey={(item) => item}
          ValueSave={setSectorSeleccionado}
        />
      </section>
      <section className={`${opcionSeleccionada == "" ? "hidden" : "flex"} w-full`}>
        {opcionSeleccionada == "Imprimir Etiqueta Unica" ? (
          <div className="mt-4 w-full">
            <Controller
              control={control}
              name="cantidad"
              defaultValue=""
              rules={{ required: "Debe ingresar una cantidad", pattern: /^[0-9]+$/ }}
              render={({ field }) => (
                <TextField
                  {...register("cantidad")}
                  fullWidth
                  label="Ingrese de cuanto es la cantidad de material"
                  error={!!errors.cantidad}
                  helperText={errors.cantidad?.message}
                  variant="outlined"
                />
              )}
            />
          </div>
        ) : (
          <section className="flex flex-row gap-x-4 w-full">
            <div className="mt-4 w-full">
              <Controller
                control={control}
                name="cantidadEtiquetas"
                defaultValue=""
                rules={{ required: "Debe ingresar cuantas etiquetas desea imprimir", pattern: /^[0-9]+$/ }}
                render={({ field }) => (
                  <TextField
                    {...register("cantidadEtiquetas")}
                    fullWidth
                    label="Ingrese cuantas etiquetas desea imprimir"
                    error={!!errors.cantidadEtiquetas}
                    helperText={errors.cantidadEtiquetas?.message}
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="mt-4 w-full">
              <Controller
                control={control}
                name="cantidad"
                defaultValue=""
                rules={{ required: "Debe ingresar una cantidad", pattern: /^[0-9]+$/ }}
                render={({ field }) => (
                  <TextField
                    {...register("cantidad")}
                    fullWidth
                    label="Ingrese de cuanto es la cantidad de material"
                    error={!!errors.cantidad}
                    helperText={errors.cantidad?.message}
                    variant="outlined"
                  />
                )}
              />
            </div>
          </section>
        )}
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button type="submit" disabled={impresoraSeleccionada == 0} className={buttonClases.greenButton}>
            Agregar
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className={buttonClases.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </form>
  );
};
