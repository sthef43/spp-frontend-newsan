/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";

interface Bateas {
  bateas: string;
  numeroOp?: string;
}

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const ImprimirLpnPadreModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control, handleSubmit } = useForm();

  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { FetchPost } = useFetchApiMultiResults();

  const [impresoraSeleccionada, setImpresoraSeleccionada] = useState<string | number>(0);

  const [listaImpresoras, setListaImpresoras] = useState([]);
  FetchApi(ImpresionEtiquetaSliceRequests.getListaImpresoras, null, false, openModal, setListaImpresoras, true);

  const [listaBateas, setListaBateas] = useState<Bateas[]>([]);
  FetchApi<Bateas[]>(
    TrazaOperacionesSliceRequests.GetAllPuntIntoContainerById,
    contenedor.id,
    false,
    openModal,
    setListaBateas,
    true
  );

  const [cantidadPlacas, setCantidadPlacas] = useState(0);
  FetchApi(
    TrazaOperacionesSliceRequests.GetAllCountTracesByContainerId,
    contenedor.id,
    false,
    openModal,
    setCantidadPlacas
  );

  const imprimirEtiqueta = () => {
    const codigoEtiqueta = generarEtiqueta();
    const impresionObjeto = { impresora: impresoraSeleccionada.toString(), zpl: codigoEtiqueta };
    FetchPost(ImpresionEtiquetaSliceRequests.imprimir, impresionObjeto, true, async () => {
      openNotificationUI("Se imprimio con exito la etiqueta", "success");
    });
  };

  const generarEtiqueta = () => {
    try {
      let zplCode = "";
      zplCode += `CT~~CD,~CC^~CT~
                        ^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD34^JUS^LRN^CI0^XZ
                        ~DG000.GRF,39936,096,
                        ,:::::::H0oJF,:::H0F0oG0F,::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::H0oJF,:::,::::::::::::::::::::^XA
                        ^MMT
                        ^PW750
                        ^LL0400
                        ^LS0
                        ^FT0,416^XG000.GRF,1,1^FS
                        ^FO10,68^GB733,0,8^FS
                        ^FT208,51^A0N,28,33^FH^FDLPN PADRE - PLACAS^FS
                        ^FT19,151^A0N,56,28^FH^FDModelo: ${contenedor.modelo}^FS
                        ^FT19,222^A0N,56,28^FH^FD${contenedor.numeroOp}^FS
                        ^FT19,293^A0N,56,24^FH^FDSemielaborado: ${contenedor.semiElaborado}^FS
                        ^FT19,364^A0N,56,28^FH^FDCantidad: ${listaBateas.length} Bateas - ${cantidadPlacas} placas^FS
                        ^FT489,365^BQN,2,10
                        ^FDLA,${contenedor.lpnGenerada}\0D\0A^FS
                        ^PQ1,0,1,Y^XZ
                        ^XA^ID000.GRF^FS^XZ
                    `;
      if (zplCode !== "") {
        return zplCode;
      }
      console.log(zplCode);
    } catch (error) {
      openNotificationUI("Ocurrio un error generando el codig zpl", "error");
    }
  };

  console.log(contenedor);

  return (
    <main className="w-[65vw]">
      <form onSubmit={handleSubmit(imprimirEtiqueta)}>
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
        <FormButtons
          disabled={impresoraSeleccionada === 0}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
      </form>
    </main>
  );
};
