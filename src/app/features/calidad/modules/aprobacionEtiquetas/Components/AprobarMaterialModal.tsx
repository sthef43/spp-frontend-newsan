import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlanProd } from "app/models";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import { TipoEtiquetaSliceRequests } from "app/Middleware/reducers/TipoEtiquetaSlice";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  setDataTable: (newValue: IImpresionEtiqueta[]) => void;
  openModal: boolean;
}

export const AprobarMaterialModal: React.FC<Props> = ({ setOpenModal, setDataTable, openModal }) => {
  const modelo = useAppSelector((state) => state.planprod.object as IPlanProd);

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm({ mode: "all" });

  const watchCodigoEtiqueta = watch("codigoEtiqueta");
  const watchCantidadEtiquetas = watch("cantidadEtiquetas");

  const [supervisor, setSupervisor] = useState("");
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      console.log(response);
      setSupervisor(response.name + " " + response.surname);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const [imagen, setImagen] = useState<IEtiquetasImagen>();
  const [descripcionEtiqueta, setDescripcionEtiqueta] = useState<ITipoEtiqueta>();
  const [tipoEtiqueta, setTipoEtiqueta] = useState("");
  const getImagen = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(
        await dispatch(
          EtiquetasImagenSliceRequests.getByModelAndCodelabel({
            modelo: modelo.codigoModelo,
            codigoEtiqueta: watchCodigoEtiqueta
          })
        )
      );
      const tipoEtiqueta = unwrapResult(await dispatch(TipoEtiquetaSliceRequests.GetByIdLinea(modelo.idLinea)));
      if (!response || Object.keys(response).length == 0) {
        openNotificationUI("No se encontro una imagen asignada a este codigo", "warning");
      } else {
        console.log(response);
        if (response.tipoDeEtiqueta.substring(0, 1) == "C") {
          setTipoEtiqueta("Circuito Eléctrico");
        } else if (response.tipoDeEtiqueta.substring(0, 1) == "B") {
          setTipoEtiqueta("Bornera");
        }
        setImagen(response);
        console.log(tipoEtiqueta);
        setDescripcionEtiqueta(tipoEtiqueta.find((elementos) => elementos.codigo?.trim() == response.tipoDeEtiqueta));
        console.log(tipoEtiqueta);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const submit = async () => {
    const fecha = moment().format("YYYY-MM-DD");
    const hora = moment().format("hh:MM:SS");
    const nuevaImpresion: IImpresionEtiqueta = {
      codigoModelo: modelo.codigoModelo,
      lote: modelo.lote,
      numeroOp: modelo.numeroOp,
      cantidadImpresa: watchCantidadEtiquetas,
      usuarioAprobacion: supervisor,
      idLinea: modelo.idLinea,
      codigoInterno: watchCodigoEtiqueta,
      fechaAprobacion: fecha,
      horaAprobacion: hora,
      estadoEtiqueta: "1",
      idImpresionEtiqueta: 0,
      nombreUsuario: supervisor,
      fechaImpresion: null,
      idTipoEtiqueta: descripcionEtiqueta.idTipoEtiqueta
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.postRequest(nuevaImpresion)));
      const refresh = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.getByOP(modelo.numeroOp)));
      if (response) {
        console.log(response);
        setOpenModal(false);
        setDataTable(refresh);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      openNotificationUI("Este codigo de etiqueta ya se encuentra ingresado", "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const manejarEnter = async () => {
    const inputSelecionado = document.querySelector("#codigoEtiqueta");
    const aux = inputSelecionado as HTMLInputElement;
    const esValido = await trigger(aux.name);
    if (!esValido) {
      aux.focus();
      setImagen(null);
      console.log("Invalido");
      return;
    }
    getImagen();
  };

  useEffect(() => {
    if (openModal) {
      getDataUser();
    }
  }, [openModal]);

  console.log(descripcionEtiqueta);

  return (
    <main className="w-[40vw]">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-4">
        <div>
          <Controller
            name="codigoEtiqueta"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="codigoEtiqueta"
                label="Ingrese el código de la etiqueta"
                variant="outlined"
                onKeyUp={() => {
                  manejarEnter();
                }}
                {...register("codigoEtiqueta", {
                  required: {
                    value: true,
                    message: "Ingrese un codigo correcto"
                  },
                  pattern: {
                    value: /^\d-\d{3}-[A-Za-z0-9]\d{4}[A-Za-z0-9]-UX$/,
                    message: "Formato del codigo incorrecto"
                  }
                })}
              />
            )}
          />
        </div>
        {errors.codigoEtiqueta && (
          <p className="text-xs font-semibold text-red-600">{errors.codigoEtiqueta?.message}</p>
        )}
        {imagen != null && (
          <div>
            <div>
              <Controller
                name="cantidadEtiquetas"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="codigoEtiqueta"
                    label="Ingrese la cantidad total de etiquetas"
                    variant="outlined"
                    {...register("cantidadEtiquetas", {
                      required: {
                        value: true,
                        message: "Ingrese un codigo correcto"
                      },
                      minLength: {
                        value: 3,
                        message: "Ingrese una cantidad valida"
                      }
                    })}
                  />
                )}
              />
              {errors.cantidadEtiquetas && (
                <p className="text-xs font-semibold text-red-600">{errors.cantidadEtiquetas?.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="mb-4 w-full py-2 bg-[#b10000] px-2 rounded-sm">
                <p className="text-white font-semibold">Validacion de Etiqueta de {tipoEtiqueta}</p>
              </div>
              <img
                style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
                src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${imagen?.url}`}
              />
            </div>
            <div className="w-full flex justify-evenly">
              <Button
                onClick={() => {
                  submit();
                }}
                className={classes.greenButton}>
                APROBAR MATERIAL
              </Button>
              <Button
                onClick={() => {
                  setOpenModal(false);
                }}
                className={classes.redButton}>
                CANCELAR
              </Button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
};
