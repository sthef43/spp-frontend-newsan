import React from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IGenerico, IInstpuesto, IColor, IAtornilladoraAlim, IAtornilladoraFormato } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import EditIcon from "@mui/icons-material/Edit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { InstpuestoSliceRequests } from "app/Middleware/reducers/InstpuestoSlice";
import { ILimites } from "app/models/ILimites";
import { ColorSliceRequests } from "app/Middleware/reducers/ColorSlice";
import { AtornilladoraAlimSliceRequests } from "app/Middleware/reducers/AtornilladoraAlimSlice";
import { AtornilladoraFormatoSliceRequests } from "app/Middleware/reducers/AtornilladoraFormatoSlice";
import { LimitesSliceRequests } from "app/Middleware/reducers/LimitesSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

interface props {
  limite: ILimites;
  callback: any;
  refreshTable: any;
}

export const LimiteDialog = ({ limite, callback, refreshTable }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [editable, setEditable] = React.useState<boolean>(true);
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]);
  const [puestos, setPuestos] = React.useState<IInstpuesto[]>([]);
  const [colores, setColores] = React.useState<IColor[]>([]);
  const [alims, setAlims] = React.useState<IAtornilladoraAlim[]>([]);
  const [formatos, setFormatos] = React.useState<IAtornilladoraFormato[]>([]);
  const [valores, setValores] = React.useState({});
  const textColorSx = { color: darkMode ? "rgba(250, 250, 250, 0.9)" : "#c80f4d" };

  const defaultLimiteLabels = {
    idGenerico: "Genérico",
    instpuestoId: "Puesto",
    idAtornilladoraAlim: "Alimentacion",
    idAtornilladoraFormato: "Formato",
    idColor: "Color",
    atornilladoraModelo: "Atornilladora Modelo",
    numeroPuesto: "Número Puesto",
    version: "Número de Versión",
    codigoPuesto: "Código Puesto",
    torque: "Torque"
  };

  const defaultLimiteValues = {
    id: limite?.id || 0,
    codigoTrazabilidad: limite?.codigoTrazabilidad || "",
    numeroPuesto: limite?.numeroPuesto || 0,
    identificadorLinea: limite?.identificadorLinea || 0,
    idGenerico: limite?.idGenerico || 0,
    instpuestoId: limite?.instpuestoId || 0,
    torque: limite?.torque || 0,
    torqueMinimo: limite?.torqueMinimo || 0,
    torqueMaximo: limite?.torqueMaximo || 0,
    tolerancia: limite?.tolerancia || 0,
    idColor: limite?.idColor || 0,
    idAtornilladoraAlim: limite?.idAtornilladoraAlim || 0,
    idAtornilladoraFormato: limite?.idAtornilladoraFormato || 0,
    atornilladoraModelo: limite?.atornilladoraModelo || "",
    codigoPuesto: limite?.codigoPuesto || "",
    version: limite?.version || 0,
    descripcion: limite?.descripcion || "",
    observaciones: limite?.observaciones || "",
    createdDate: limite?.createdDate,
    deleted: false
  };
  interface IDefaultLimiteValues {
    id: number;
    codigoTrazabilidad: string;
    numeroPuesto: number;
    identificadorLinea: number;
    idGenerico: number;
    instpuestoId: number;
    torque: number;
    torqueMinimo: number;
    torqueMaximo: number;
    tolerancia: number;
    idColor: number;
    idAtornilladoraAlim: number;
    idAtornilladoraFormato: number;
    atornilladoraModelo: string;
    codigoPuesto: string;
    version: number;
    descripcion: string;
    observaciones: string;
    createdDate: string;
    deleted: boolean;
  }

  React.useEffect(() => {
    setValores({
      Alimentacion: {
        array: alims,
        id: "idAtornilladoraAlim",
        column: "tipoAlimentacion",
        type: "Autocomplete"
      },
      Formato: {
        array: formatos,
        id: "idAtornilladoraFormato",
        column: "formato",
        type: "Autocomplete"
      },
      Puesto: {
        array: puestos,
        id: "id",
        column: "descripcion",
        type: "Autocomplete"
      },
      Genérico: {
        array: genericos,
        id: "id",
        column: "codigo",
        type: "Autocomplete"
      },
      Color: {
        array: colores,
        id: "idColor",
        column: "color1"
      }
    });
  }, [genericos, puestos, colores, formatos, alims]);

  const { control, getValues, setValue, watch } = useForm<IDefaultLimiteValues>({
    defaultValues: defaultLimiteValues
  });

  //me traigo toda la data que necesito para crear un nuevo limite
  const getData = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let fetchPuestoResult: IInstpuesto[];
    let fetchColorResult: IColor[];
    let fetchGenericoResult: IGenerico[];
    let fetchAlimResult: IAtornilladoraAlim[];
    let fetchFormatosResult: IAtornilladoraFormato[];
    try {
      fetchPuestoResult = unwrapResult(await dispatch(InstpuestoSliceRequests.getAllRequest()));
      fetchColorResult = unwrapResult(await dispatch(ColorSliceRequests.getAllRequest()));
      fetchGenericoResult = unwrapResult(await dispatch(GenericoSliceRequests.getAllRequest()));
      fetchAlimResult = unwrapResult(await dispatch(AtornilladoraAlimSliceRequests.getAllRequest()));
      fetchFormatosResult = unwrapResult(await dispatch(AtornilladoraFormatoSliceRequests.getAllRequest()));
      setPuestos(fetchPuestoResult);
      setColores(fetchColorResult);
      setGenericos(fetchGenericoResult);
      setGenericos(fetchGenericoResult);
      setGenericos(fetchGenericoResult);
      setAlims(fetchAlimResult);
      setFormatos(fetchFormatosResult);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const handleCancelar = () => {
    callback(false);
  };

  const borrarLimite = async () => {
    try {
      const fetchEliminarLimite = unwrapResult(await dispatch(LimitesSliceRequests.deleteRequest(limite.id)));
      openNotificationUI("Limite borrado correctamente.", "success");
      refreshTable();
      callback(false);
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };

  const handleEliminar = async () => {
    const response = await getConfirmation("Borrar limite", "Está seguro que desea borrar el limite?");
    if (response) {
      borrarLimite();
    }
  };

  const handleGuardar = async () => {
    try {
      setValue("torqueMaximo", getMaximo());
      setValue("torqueMinimo", getMinimo());
      const response = await dispatch(LimitesSliceRequests.PutRequest(getValues()));
      refreshTable(); //actualizo la tabla
      openNotificationUI("Datos del limite actualizados.", "success");
      callback(false);
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };
  const handleEditar = () => {
    setEditable(!editable);
  };
  const getMaximo = (): number => {
    const torque: number = getValues("torque");
    const tolerancia: number = colores.find((col) => col.idColor === getValues("idColor")).tolerancia;
    return torque + tolerancia;
  };
  const getMinimo = (): number => {
    const torque: number = getValues("torque");
    const tolerancia: number = colores.find((col) => col.idColor === getValues("idColor")).tolerancia;
    return torque - tolerancia;
  };
  return (
    <div>
      <div className="text-right space-x-3">
        <Button size="small" sx={textColorSx} variant="text" onClick={handleEditar}>
          <EditIcon />
          Editar
        </Button>
      </div>
      {limite && (
        <div>
          <div style={{ width: "80vw" }}>
            <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
              <GenericFieldsGenerator
                values={defaultLimiteValues}
                control={control}
                styleDiv={"text-center mb-5"}
                styleFieldSX={{ width: "100%" }}
                labels={defaultLimiteLabels}
                selectFields={valores}
                // selectFields={state}
                variant="standard"
                disabled={editable}
              />
            </div>
            <div className="flex justify-center mt-4 sm:grid-cols-4 gap-4">
              <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
                Guardar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button className={buttonClasses.purpleButton} variant="contained" onClick={handleEliminar}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
