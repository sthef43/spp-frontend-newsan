/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Paper } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { IAppUser } from "app/models";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";

interface argumentosEndpoint {
  idLinea: any;
  fechaDesde: string;
  fechaHasta: string;
  numeroOp?: string;
  opcion: string;
}

interface Props {
  setOpenModal: any;
  lineaId?: number;
  setDataTable: any;
  listaArgumentos: argumentosEndpoint;
}

interface IFormInputs {
  codigoInterno: string;
}
const defaultValuesVar: IFormInputs = { codigoInterno: "" };

export const AprobarEtiquetasModal: React.FC<Props> = ({ setDataTable, setOpenModal, lineaId, listaArgumentos }) => {
  const { control, handleSubmit, reset, watch } = useForm<IFormInputs>({ defaultValues: defaultValuesVar });

  const userOperator = useAppSelector((state) => state.appUser.data as IAppUser);

  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [etiquetaImpresa, setEtiquetaImpresa] = React.useState<IImpresionEtiqueta>();
  const [dataImage, setDataImage] = React.useState<IEtiquetasImagen>();

  const fecha = moment().format("YYYY-MM-DD");
  const hora = moment().format("HH:MM:SS");

  // RFID no requiere imagen para aprobar
  const tipoDesc = (etiquetaImpresa?.tipoEtiqueta?.descripcion ?? "").trim().toUpperCase();
  const isRFID = tipoDesc === "RFID" || tipoDesc.includes("RFID");
  const hasImage = !!dataImage?.url;
  const isApproved = !!etiquetaImpresa?.usuarioAprobacion && etiquetaImpresa.usuarioAprobacion !== "";

  const codigoInternoWatch = watch("codigoInterno");
  const getImage = async (tipoDeEtiqueta, modelo) => {
    let result;
    try {
      result = unwrapResult(await dispatch(EtiquetasImagenSliceRequests.getByModelo({ modelo, tipoDeEtiqueta })));
      setDataImage(result);
    } catch (x) {
      result = null;
    }
  };

  const onSubmitCod = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    try {
      if (e.key === "Enter") {
        const response = unwrapResult(
          await dispatch(
            ImpresionEtiquetaSliceRequests.getByCodIntAndLineaId({ codInt: codigoInternoWatch, lineaId: lineaId })
          )
        );
        if (response) {
          if (response.usuarioAprobacion) {
            openNotificationUI(`La etiqueta ya fue aprobada por el usuario ${response.usuarioAprobacion}`, "warning");
            reset();
            setDataImage(null);
            return;
          }
          setEtiquetaImpresa(response);
        } else {
          reset();
          setDataImage(null);
          openNotificationUI("El codigo no se encuentra en la base de datos o no corresponde a esta linea", "error");
        }
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const onAprobeLaEtiquetaPapa = async () => {
    try {
      const response = unwrapResult(
        await dispatch(
          ImpresionEtiquetaSliceRequests.putRequest({
            ...etiquetaImpresa,
            fechaAprobacion: fecha,
            horaAprobacion: hora,
            usuarioAprobacion: `${userOperator.operator.name} ${userOperator.operator.surname}`,
            lastModifiedDate: ""
          })
        )
      );
      if (response) {
        if (listaArgumentos.numeroOp == "") {
          const responseByLinea = unwrapResult(
            await dispatch(
              ImpresionEtiquetaSliceRequests.GetAllImpresionByDateLineaAndOpcion({
                fechaDesde: listaArgumentos.fechaDesde,
                fechaHasta: listaArgumentos.fechaHasta,
                lineaId: listaArgumentos.idLinea | 0,
                opcion: listaArgumentos.opcion
              })
            )
          );
          if (responseByLinea) {
            setDataTable(responseByLinea);
            openNotificationUI("Se aprobo la etiqueta con exito!", "success");
          }
        }
      }

      if (listaArgumentos) {
        try {
          const responseByLinea = unwrapResult(
            await dispatch(
              ImpresionEtiquetaSliceRequests.GetAllImpresionByDateLineaAndOpcion({
                fechaDesde: listaArgumentos.fechaDesde,
                fechaHasta: listaArgumentos.fechaHasta,
                lineaId: listaArgumentos.idLinea | 0,
                opcion: listaArgumentos.opcion
              })
            )
          );

          if (responseByLinea) setDataTable(responseByLinea);
        } catch (error: any) {
          console.log(error);
          openNotificationUI(`${error}`, "error");
        }
      }
      setOpenModal(false);
    } catch (e: any) {
      openNotificationUI(`${e}`, "error");
    }
  };

  const formatNumeroRfid = (numero: string): string => {
    const matchNumber = numero.split("00000");
    if (matchNumber) {
      return matchNumber[1];
    }
    return "";
  };

  React.useEffect(() => {
    if (etiquetaImpresa && !isRFID && !hasImage) {
      openNotificationUI("La etiqueta no tiene imagen", "warning");
    }
  }, [dataImage, etiquetaImpresa]);

  React.useEffect(() => {
    if (etiquetaImpresa) {
      getImage(etiquetaImpresa?.tipoEtiqueta.codigo, etiquetaImpresa?.codigoModelo);
    }
  }, [etiquetaImpresa]);

  return (
    <div style={{ width: "50vw" }}>
      <div>
        <InputComponentForm
          control={control}
          functionOnchange={onSubmitCod}
          name="codigoInterno"
          label="Ingrese el codigo de la etiqueta"
          rules={{ required: { message: "Debe ingresar un codigo valido", value: true } }}
          variant="standard"
        />
      </div>
      {/* {codigoInternoWatch != "" && ( */}
      {dataImage && (
        <>
          <Paper elevation={6}>
            <div className="bg-newsanLighten text-gray-200 rounded-md mb-2 p-1 text-center text-xl font-medium">
              Validación de etiqueta del modelo {dataImage.modelo}
            </div>
          </Paper>
          {/* <ImageZoom
            src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${dataImage.url}`}
            alt="ImagenNoDisponible"
          /> */}
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={`${import.meta.env.BASE_URL}/imagenes/patron-etiquetas/${dataImage.url}`}
            />
          </div>
        </>
      )}
      {etiquetaImpresa && isRFID && (
        <Paper elevation={6} className="mt-3">
          <div className="bg-newsanLighten text-gray-200 rounded-md mb-2 p-2 text-center text-xl font-medium">
            DATOS DEL ROLLO RFID
          </div>

          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="font-semibold">MODELO</div>
            <div>{etiquetaImpresa.codigoModelo}</div>

            <div className="font-semibold">OP</div>
            <div>{etiquetaImpresa.numeroOp}</div>

            <div className="font-semibold">LOTE</div>
            <div>{etiquetaImpresa.lote}</div>

            <div className="font-semibold">DESDE</div>
            <div>{formatNumeroRfid(etiquetaImpresa.impresionEtiquetaRFID?.rfidDesde ?? "")}</div>

            <div className="font-semibold">HASTA</div>
            <div>{formatNumeroRfid(etiquetaImpresa.impresionEtiquetaRFID?.rfidHasta ?? "")}</div>
          </div>
        </Paper>
      )}
      {etiquetaImpresa && (
        <div className="flex justify-center mt-3">
          <div className="mr-3">
            <Button
              className={classes.greenButton}
              onClick={onAprobeLaEtiquetaPapa}
              variant="contained"
              disabled={isApproved}>
              Aprobar
            </Button>
          </div>
          <Button className={classes.redButton} onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};
