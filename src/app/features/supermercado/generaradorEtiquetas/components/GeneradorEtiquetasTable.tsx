/* eslint-disable no-useless-escape */
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ZPL_EtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetasSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ISuperCargalinea } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { jspmWSStatusFunt } from "app/shared/helpers/SelectOfPrinter";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ClientPrintJob, InstalledPrinter } from "jsprintmanager";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface IGeneradorEtiquetasTable {
  material?: ISuperCargalinea;
  materiales?: ISuperCargalinea[];
  impresora: string;
  closeModal: (state: boolean) => void;
}
interface initialState {
  cantidad: number;
}
const initialStateVar = {
  cantidad: 1
};
export const GeneradorEtiquetasTable = ({
  material,
  impresora,
  closeModal,
  materiales
}: IGeneradorEtiquetasTable): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const linea = useAppSelector((state) => state.lineaProduccion.object as ILineaProduccion);

  const codigosZPL: IZPL_Etiquetas[] = useAppSelector((state) => state.zpl_Etiquetas.dataAll);

  const { control, getValues, handleSubmit } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const getAllZPL = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(ZPL_EtiquetasSliceRequests.getListByTipoEtiquetaId(99));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const findCodigo = (descripcion: string): any => {
    return codigosZPL.find((zpl) => zpl.descripcionEtiqueta === descripcion);
  };

  const replaceZPL = (lineaNombre, material, codigo, codigoModelo, zpl): string => {
    let newCodigo: string = codigo.trim();
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regexAlfaNum: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d-]+$/;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regexNotNumber: RegExp = /^[^0-9]*[a-zA-Z][^0-9]*$/;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const alfa: RegExp = /[a-zA-Z]/;
    if (regexNotNumber.test(codigo.slice(0, 3))) {
      newCodigo = newCodigo.slice(0, 3) + newCodigo.slice(3);
      return (zpl = zpl
        .replace("NombreLinea", lineaNombre)
        .replace("NombreMaterial", material)
        .replace("NombreCodigo2", newCodigo)
        .replace("Modelo", codigoModelo)
        .replace("NombreCodigo", newCodigo));
    }
    if (regexAlfaNum.test(codigo)) {
      const resultado = codigo.search(alfa);
      newCodigo = newCodigo.slice(0, resultado) + newCodigo.slice(resultado);
    } else if (codigo.indexOf("9") != -1) {
      const resultado2 = codigo.indexOf("9");
      if (codigo[resultado2] != 1) {
        newCodigo = newCodigo.slice(0, resultado2) + newCodigo.slice(resultado2);
      }
    }
    return (zpl = zpl
      .replace("NombreLinea", lineaNombre)
      .replace("NombreMaterial", material)
      .replace("NombreCodigo2", newCodigo)
      .replace("Modelo", codigoModelo)
      .replace("NombreCodigo", newCodigo));
  };

  const getZPLCode = (material, descripcionCodigo) => {
    const codigo = findCodigo(descripcionCodigo);
    debugger;
    return replaceZPL(
      linea.nombre,
      material.descripcion,
      material.codigoPautas.trim(),
      material.codigoModelo,
      codigo.zpl
    );
  };

  const onEtiqueta = () => {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regex: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*-)[a-zA-Z\d-]+$/;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regexAlfaNum: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d-]+$/;
    const codigoPautasLength = material.codigoPautas.length;
    const descripcionLength = material.descripcion.length;
    if (regex.test(material.codigoPautas.trim())) {
      // if (descripcionLength > 24) {
      //onPrint(getZPLCode(material, "AlfaNumEsp-MaterialLargo"));
      onPrint(getZPLCode(material, "Material"));
      // } else {
      //   onPrint(getZPLCode(material, "AlfaNumEsp-MaterialCorto"));
      // }
    } else if (regexAlfaNum.test(material.codigoPautas.trim())) {
      // if (descripcionLength > 24) {
      // onPrint(getZPLCode(material, "AlfaNum-MaterialLargo"));
      onPrint(getZPLCode(material, "Material"));
      // } else {
      //   onPrint(getZPLCode(material, "AlfaNum-MaterialCorto"));
      // }
      // } else if (codigoPautasLength < 8) {
    } else {
      onPrint(getZPLCode(material, "Material"));
    }
  };
  const onEtiquetaMultiple = () => {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regex: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*-)[a-zA-Z\d-]+$/;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const regexAlfaNum: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d-]+$/;
    let codigo = "";
    for (const mate of materiales) {
      const codigoPautasLength = mate.codigoPautas.length;
      const descripcionLength = mate.descripcion.length;
      if (regex.test(mate.codigoPautas)) {
        // if (descripcionLength > 24) {
        codigo = codigo + getZPLCode(mate, "Material") + "\n";
        // } else {
        //   codigo = codigo + getZPLCode(mate, "AlfaNumEsp-MaterialCorto") + "\n";
        // }
      } else if (regexAlfaNum.test(mate.codigoPautas)) {
        // if (descripcionLength > 24) {
        codigo = codigo + getZPLCode(mate, "Material") + "\n";
        // } else {
        //   codigo = codigo + getZPLCode(mate, "AlfaNum-MaterialCorto") + "\n";
        // }
        // } else if (codigoPautasLength < 8) {
      } else {
        //se agrego esta parte
        // if (descripcionLength > 24) {
        //  codigo = codigo + getZPLCode(mate, "NumCorto-MaterialLargo") + "\n";
        // } else {
        //   codigo = codigo + getZPLCode(mate, "NumCorto-MaterialCorto") + "\n";
        // }
        // } else {
        // if (descripcionLength > 24) {
        codigo = codigo + getZPLCode(mate, "Material") + "\n";
        // } else {
        //   codigo = codigo + getZPLCode(mate, "NumLargo-MaterialCorto") + "\n";
        // }
      }
    }
    onPrint(codigo);
  };

  const onPrint = (codigo: string) => {
    if (jspmWSStatusFunt()) {
      //Create a ClientPrintJob
      const cpj = new ClientPrintJob();
      //Set Printer type (Refer to the help, there many of them!)
      cpj.clientPrinter = new InstalledPrinter(impresora);
      //Set content to print...
      //Create Zebra ZPL commands for sample label
      cpj.printerCommands = getValues("cantidad") > 0 ? repeat(codigo) : codigo;
      //Send print job to printer!
      cpj.sendToClient();
      openNotificationUI("Se envio la impresion", "success");
      closeModal(false);
    }
  };

  const repeat = (zpl: string) => {
    return (zpl + "\n").repeat(getValues("cantidad"));
  };

  const onSubmit = () => {
    if (materiales?.length > 0) {
      onEtiquetaMultiple();
    } else {
      onEtiqueta();
    }
  };

  useEffect(() => {
    getAllZPL();
  }, []);

  return (
    <div className="flex justify-center m-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {materiales.length == 0 && (
          <Controller
            name="cantidad"
            control={control}
            rules={{ min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <TextField label="Cantidad a imprimir" focused fullWidth {...field} variant="standard" />
                {!!error && <FormHelperText className="text-red-500">El valor tiene que ser mayor a 0</FormHelperText>}
              </FormControl>
            )}
          />
        )}
        <FormButtons onCancel={() => closeModal(false)} submitName="Imprimir" />
      </form>
    </div>
  );
};
