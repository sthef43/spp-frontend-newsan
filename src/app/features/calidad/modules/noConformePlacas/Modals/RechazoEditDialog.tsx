import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { useAppDispatch } from "app/core/store/store";
import { IControlLote } from "app/models/IControlLote";
import { IEstadoLote } from "app/models/IEstadoLote";
import { IPlanProd } from "app/models/IPlanProd";
import { existeRechazoExcluido } from "app/shared/helpers/existeRechazoExluido";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Theme } from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { EstadoLoteSliceRequests } from "app/features/calidad/slices/EstadoLoteSlice";

interface props {
  controlLote: IControlLote;
  rechazados: IControlLote[];
  setOpenPopup: any;
  onInitRechazosTable: any;
  planProd: IPlanProd;
}
const sxStyles = {
  edit: {
    width: "70vw",
    textAlign: "center" as const
  },
  formControl: {
    minWidth: 170
  },
  selectEmpty: {
    marginTop: 2
  }
};

export const RechazoEditDialog = ({
  controlLote,
  rechazados,
  setOpenPopup,
  onInitRechazosTable,
  planProd
}: props): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const initialState: IControlLote = controlLote;
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const { getConfirmation } = useConfirmationDialog();

  const { control, getValues, setValue, handleSubmit, watch } = useForm({
    defaultValues: initialState
  });
  const [causaList, setCausaList] = React.useState<IEstadoLote[]>([]);
  const watchNroHasta = watch("serieHasta");
  const watchNroDesde = watch("serieDesde");

  const handleNroDesdeChange = (numero: number, der: boolean) => {
    let rechazado = false;
    if (der) {
      if (numero >= planProd?.desde && numero <= planProd?.hasta && numero >= getValues("serieDesde") && der === true) {
        rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
        console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 254 ~ handleNroDesdeChange ~ rechazado", rechazado);
        if (rechazado) {
          setErrorDerecha("Número de serie inválido");
          return numero;
        }
        setErrorDerecha("");
        return numero;
      }
      setErrorDerecha("Número de serie inválido");
    } else {
      if (watchNroHasta === 0) {
        if (numero >= planProd?.desde && numero <= planProd?.hasta) {
          rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
          console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 269 ~ handleNroDesdeChange ~ rechazado", rechazado);
          if (rechazado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      } else {
        if (numero >= planProd?.desde && numero <= planProd?.hasta && numero <= getValues("serieHasta")) {
          rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
          console.log(rechazado);
          if (rechazado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      }
      setErrorIzq("Número de serie inválido");
    }

    return numero;
  };

  const onInit = async () => {
    let fetchEstadoLoteResult: IEstadoLote[];
    try {
      fetchEstadoLoteResult = unwrapResult(await dispatch(EstadoLoteSliceRequests.getAllRequest()));
    } catch (error) {
      fetchEstadoLoteResult = null;
    }
    if (fetchEstadoLoteResult) {
      console.log("🚀 ~ file: Rechazos.tsx ~ line 70 ~ onInit ~ fetchEstadoLoteResult", fetchEstadoLoteResult);

      setCausaList(fetchEstadoLoteResult);
    }
  };

  React.useEffect(() => {
    onInit();
    console.log("rechazos", rechazados);
    console.log("planprod del rechazo", planProd);
  }, []);

  const handleCancelar = () => {
    setOpenPopup(false);
  };

  const borrarRechazo = async () => {
    let fetchEliminarRechazo;
    try {
      fetchEliminarRechazo = unwrapResult(
        await dispatch(ControlLoteSliceRequests.deleteRequest(controlLote.idControlLote))
      );
    } catch (error) {
      fetchEliminarRechazo = null;
    }
    if (fetchEliminarRechazo) {
      console.log("🚀 ~ file: Rechazos.tsx ~ line 70 ~ onInit ~ fetchEliminarRechazo", fetchEliminarRechazo);
      openNotificationUI("Rechazo borrado correctamente.", "success");
      onInitRechazosTable(); //actualizo la tabla
      setOpenPopup(false);
    }
  };

  const handleEliminar = async () => {
    const response = await getConfirmation("Borrar rechazo", "Está seguro que desea borrar el rechazo?");
    if (response) {
      borrarRechazo();
    }
  };

  const handleGuardar = async () => {
    let result;
    try {
      result = await dispatch(ControlLoteSliceRequests.putRequest(getValues()));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del rechazo actualizados.", "success");
      onInitRechazosTable(); //actualizo la tabla
      setOpenPopup(false);
    }
  };

  const actualizarCantidad = () => {
    setValue("cantidadRechazos", getValues("serieHasta") - getValues("serieDesde") + 1);
  };

  React.useEffect(() => {
    actualizarCantidad();
  }, [watchNroHasta, watchNroDesde]);

  return (
    <div style={sxStyles.edit}>
      <form onSubmit={handleSubmit(handleGuardar)}>
        <div className="inline-grid sm:inline-flex  sm:gap-x-36 gap-x-10">
          {/* ----------------MODELO---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="codigoModelo"
              control={control}
              defaultValue={controlLote?.codigoModelo}
              render={({ field }) => <TextField disabled label="Modelo" {...field} variant="standard" />}
            />
          </div>
          {/* ----------------NUMERO OP---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="numeroOp"
              control={control}
              defaultValue={controlLote?.numeroOp}
              render={({ field }) => <TextField disabled label="Número de OP" {...field} variant="standard" />}
            />
          </div>
          {/* ----------------CANTIDAD RECHAZADOS---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="cantidadRechazos"
              control={control}
              defaultValue={controlLote?.cantidadRechazos}
              render={({ field }) => <TextField disabled label="Cantidad Rechazados" {...field} variant="standard" />}
            />
          </div>
        </div>
        <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
          {/* ----------------SERIE DESDE---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="serieDesde"
              control={control}
              defaultValue={controlLote?.serieDesde}
              render={({ field }) => (
                <TextField
                  label="Serie Desde"
                  {...field}
                  type="number"
                  inputProps={{ inputMode: "numeric", pattern: "[1-9]*" }}
                  error={errorIzq.length > 0}
                  helperText={errorIzq}
                  onChange={(e: any) => {
                    field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), false)); //acá teiene que devolver un string
                  }}
                  variant="standard"
                />
              )}
            />
          </div>
          {/* ----------------SERIE HASTA---------------*/}
          <div className="text-center sm:text-left p-2">
            <Controller
              name="serieHasta"
              control={control}
              defaultValue={controlLote?.serieHasta}
              render={({ field }) => (
                <TextField
                  label="Serie Hasta"
                  {...field}
                  type="number"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  error={errorDerecha.length > 0}
                  helperText={errorDerecha}
                  onChange={(e: any) => {
                    field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), true)); //acá teiene que devolver un string
                  }}
                  variant="standard"
                />
              )}
            />
          </div>
        </div>
        <div className="content-center mt-4">
          {/* ----------------CAUSA---------------*/}
          <FormControl sx={sxStyles.formControl}>
            <InputLabel>Causa</InputLabel>
            <Controller
              name="idEstadoLote"
              control={control}
              rules={{ required: true }}
              defaultValue={null}
              render={({ field }) => (
                <Select {...field} variant="standard">
                  {causaList &&
                    causaList.map((lote) => (
                      <MenuItem key={lote.idEstadoLote} value={lote.idEstadoLote}>
                        {lote.descripcion}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
        </div>
        <div className=" sm:p-8">
          {/* ----------------CONTENIDO DEFECTUOSO---------------*/}
          <div className="text-center sm:text-left p-2 w-full">
            <Controller
              name="contenidoDefectuoso"
              control={control}
              rules={{ required: true }}
              defaultValue={controlLote?.contenidoDefectuoso}
              render={({ field }) => (
                <TextField
                  label="Contenido Defectuoso"
                  {...field}
                  className="w-full"
                  autoComplete="off"
                  variant="standard"
                />
              )}
            />
          </div>
          {/* ----------------ACCIÓN CORRECTIVA---------------*/}
          <div className="text-center sm:text-left p-2 w-full">
            <Controller
              name="accioncorrectiva"
              control={control}
              rules={{ required: true }}
              defaultValue={controlLote?.accioncorrectiva}
              render={({ field }) => (
                <TextField
                  label="Acción Correctiva"
                  {...field}
                  className="w-full"
                  autoComplete="off"
                  variant="standard"
                />
              )}
            />
          </div>
          {/* ----------------CAUSA RAÍZ---------------*/}
          <div className="text-center sm:text-left p-2 w-full">
            <Controller
              name="planmejora"
              control={control}
              rules={{ required: true }}
              defaultValue={controlLote?.planmejora}
              render={({ field }) => (
                <TextField
                  label="Contenido Defectuoso"
                  {...field}
                  className="w-full"
                  autoComplete="off"
                  variant="standard"
                />
              )}
            />
          </div>
          {/* ----------------OBSERVACIONES---------------*/}
          <div className="text-center sm:text-left p-2 w-full">
            <Controller
              name="observaciones"
              control={control}
              rules={{ required: true }}
              defaultValue={controlLote?.observaciones}
              render={({ field }) => (
                <TextField label="Observaciones" {...field} className="w-full" autoComplete="off" variant="standard" />
              )}
            />
          </div>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
          Guardar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleEliminar}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};
