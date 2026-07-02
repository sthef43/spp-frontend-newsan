/* eslint-disable unused-imports/no-unused-vars */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { SelectComponent } from "../../Components/SelectComponent";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { useForm } from "react-hook-form";
import { ICLIContendorItems } from "../../Models/ICLIContenedorItems";

interface Props {
  contenedorSeleccionado: ICLIContendorItems;
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const ImprimirEtiquetaPadre: React.FC<Props> = ({ contenedorSeleccionado, setOpenModal, openModal }) => {
  const { control } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const [impresoraSeleccionada, setImpresoraSeleccionada] = useState<string | number>(0);

  const [listaImpresoras, setListaImpresoras] = useState([]);

  const fechaActual = moment().format("YYYY/MM/DD");

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

  const imprimirEtiqueta = async () => {
    const zplCode = generarEtiqueta();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
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

  const generarEtiqueta = () => {
    let zplCode = "";
    zplCode += `CT~~CD,~CC^~CT~
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
                        ^FT151,149^A0N,34,33^FH^FD^FS
                        ^FT515,84^A0N,45,33^FH^FD^FS
                        ^BY2,3,57^FT583,94^BCN,,N,N
                        ^FD>:^FS
                        ^FT21,150^A0N,28,28^FH^FDARTICULO^FS
                        ^FT21,306^A0N,36,31^FH^FDLPN ${contenedorSeleccionado.lpnGenerada}^FS
                        ^FT14,50^A0N,45,45^FH^FD${fechaActual}^FS
                        ^FT17,85^A0N,26,26^FH^FDRECEPCION^FS
                        ^BY2,3,63^FT151,222^BCN,,N,N
                        ^FD^FS
                        ^FT20,258^A0N,31,28^FH^FD^FS
                        ^BY3,3,66^FT67,381^BCN,,N,N
                        ^FD>:${contenedorSeleccionado.lpnGenerada}^FS
                        ^FT244,34^A0N,20,19^FH^FDSECTOR^FS
                        ^PQ1,0,1,Y^XZ
                        ^XA^ID000.GRF^FS^XZ
                        ^XA^ID001.GRF^FS^XZ
                        ^XA^ID002.GRF^FS^XZ`;
    if (zplCode != "") {
      return zplCode;
    }
  };

  useEffect(() => {
    if (openModal) {
      CheckImpresoras();
    }
  }, [openModal]);

  return (
    <main>
      <section>
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
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button
            onClick={() => {
              imprimirEtiqueta();
            }}
            type="submit"
            disabled={impresoraSeleccionada == 0}
            className={buttonClases.greenButton}>
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
    </main>
  );
};
