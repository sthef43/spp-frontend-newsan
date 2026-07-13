/* eslint-disable @typescript-eslint/no-explicit-any */

import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useMemo, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { ICLIItems } from "../../Models/ICLIItems";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";

interface IImprimirEtiquetaForm {
  cantidad: string;
  cantidadEtiquetas: string;
  formatoImpresion: string;
  selectImpresora: string;
  sector: number;
}

interface Props {
  setOpenModal: (newValue: boolean) => void;
  listaItems?: ICLIItems;
}

const defaultFormValues: IImprimirEtiquetaForm = { cantidad: "", cantidadEtiquetas: "", formatoImpresion: "", selectImpresora: "", sector: 0 };

export const ImprimirEtiquetaModal: React.FC<Props> = ({ setOpenModal, listaItems }) => {
  const {
    watch,
    handleSubmit,
    control,
    formState: { isValid, isSubmitting }
  } = useForm<IImprimirEtiquetaForm>({
    defaultValues: defaultFormValues
  });

  const { FetchPost } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClases = MaterialButtons();

  const [listaNumeroLPN, setListaNumerosLPN] = useState([]);
  const [listaImpresoras, setListaImpresoras] = useState([]);
  const [checkServerDone, setCheckServerDone] = useState(false);

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);

  const cantidadEtiquetas = watch("cantidadEtiquetas");
  const cantidadUnitaria = watch("cantidad");
  const opcionSeleccionada = watch("formatoImpresion");
  const impresoraSeleccionada = watch("selectImpresora");
  const sectorSeleccionado = watch("sector");
  const sectorFiltrado = useMemo(
    () => listaSectores.find((elementos) => elementos.id == sectorSeleccionado),
    [listaSectores, sectorSeleccionado]
  );

  const fechaActual = moment().format("YYYY/MM/DD");
  const formatoImpresion = ["Imprimir Cantidad de Etiquetas", "Imprimir Etiqueta Unica"];

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores);

  FetchApi<any>(
    ImpresionEtiquetaSliceRequests.chechServer,
    undefined,
    false,
    null,
    undefined,
    false,
    false,
    false,
    () => setCheckServerDone(true)
  );

  FetchApi<any>(
    ImpresionEtiquetaSliceRequests.getListaImpresoras,
    undefined,
    false,
    checkServerDone,
    setListaImpresoras,
    true,
    false,
    true
  );
  
  const imprimirEtiqueta = async () => {
    const nuevosRegistrosDeImpresion = crearDatosImpresiones();
    const zplCode = crearTextoZPL();

    if (await getConfirmation("Imprimir Etiqueta", "Se imprimira la etiqueta, desea continuar?")) {
      FetchPost(
        CLIImpresionEtiquetasSliceRequests.multiPostRequest,
        nuevosRegistrosDeImpresion,
        false,
        () => {
          FetchPost(
            ImpresionEtiquetaSliceRequests.imprimir,
            { impresora: impresoraSeleccionada.toString(), zpl: zplCode },
            false,
            () => {
              openNotificationUI("Impresion realizada con exito", "success");
            }
          );
        }
      );
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

  return (
    <form onSubmit={handleSubmit(imprimirEtiqueta)} className="w-[45vw]">
      <section className="my-4">
        <SelectComponentForm
          control={control}
          name="formatoImpresion"
          label="Seleccione una opcion de impresion"
          listItems={formatoImpresion}
          rules={{ required: "Seleccione un formato de impresion", validate: (e: string | number) => e === "" ? "Seleccione un formato de impresion" : true }}
          valueLabel={(item: string) => item}
          valueSelect={(item: string) => item}
        />
      </section>
      <section className="flex flex-row gap-x-4">
        <SelectComponentForm
          control={control}
          name="selectImpresora"
          label="Seleccione una impresora"
          listItems={listaImpresoras}
          rules={{ required: "Seleccione una impresora", validate: (e: string | number) => e === "" ? "Seleccione una impresora" : true }}
          valueLabel={(item: any) => item}
          valueSelect={(item: any) => item}
        />
        <SelectComponentForm
          control={control}
          name="sector"
          label="Seleccione un sector"
          listItems={listaSectores}
          rules={{ required: "Seleccione un sector", validate: (e: string | number) => (typeof e === "number" && e <= 0) ? "Seleccione un sector" : true }}
          valueLabel={(item: ICLISectores) => item.nombreSector}
          valueSelect={(item: ICLISectores) => item.id}
        />
      </section>
      <section className={`${opcionSeleccionada == "" ? "hidden" : "flex"} w-full`}>
        {opcionSeleccionada == "Imprimir Etiqueta Unica" ? (
          <div className="mt-4 w-full">
            <InputComponentForm
              control={control}
              name="cantidad"
              label="Ingrese de cuanto es la cantidad de material"
              rules={{ required: "Debe ingresar una cantidad", pattern: /^[0-9]+$/ }}
            />
          </div>
        ) : (
          <section className="flex flex-row gap-x-4 w-full">
            <div className="mt-4 w-full">
              <InputComponentForm
                control={control}
                name="cantidadEtiquetas"
                label="Ingrese cuantas etiquetas desea imprimir"
                rules={{ required: "Debe ingresar cuantas etiquetas desea imprimir", pattern: /^[0-9]+$/ }}
              />
            </div>
            <div className="mt-4 w-full">
              <InputComponentForm
                control={control}
                name="cantidad"
                label="Ingrese de cuanto es la cantidad de material"
                rules={{ required: "Debe ingresar una cantidad", pattern: /^[0-9]+$/ }}
              />
            </div>
          </section>
        )}
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button type="submit" disabled={!impresoraSeleccionada || !isValid || isSubmitting} className={buttonClases.greenButton}>
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
