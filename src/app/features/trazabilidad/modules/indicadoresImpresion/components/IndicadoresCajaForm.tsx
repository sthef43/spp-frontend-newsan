import { Autocomplete, Button, TextField } from "@mui/material";
import { EtiquetasIndicadoresCajaSliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresCajaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { IEtiquetasIndicadoresCaja } from "app/models/IEtiquetasIndicadoresCaja";
import { ZPL_ProductosSliceRequests } from "app/Middleware/reducers/ZPL_ProductosSlice";

interface Props {
  tipoModelo: string;
  setOpenModal: any;
  refresh: any;
  dataEdit: IEtiquetasIndicadoresCaja;
}
export const IndicadoresCajaForm = ({ tipoModelo, setOpenModal, refresh, dataEdit }: Props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const modelos = useAppSelector((data) => data.ZPL_Productos?.dataAll);
  const schema = yup
    .object()
    .shape({
      codigoDelSet: yup.string().min(2).required(),
      marca: yup.string().min(2).required(),
      capacidadFoC: yup.string().min(2).required(),
      descripcion: yup.string().min(2).required(),
      codSerialNumberLG: yup.string().min(2).required(),
      serialNumberLG: yup.string().min(2).required(),
      codigoBarraLogico: yup.string().min(2).required(),
      numeroEan13Logico: yup.string().min(2).required(),
      codigoBarraFisico: yup.string().min(2).required(),
      numeroEan13Fisico: yup.string().min(2).required(),
      apilado: yup.string().min(2).required(),
      dimensiones: yup.string().min(2).required(),
      pesoNeto: yup.string().min(2).required(),
      leyendaLegal: yup.string().min(2).required()
    })
    .required();
  const defaultPuestoLabels = {
    codigoDelSet: "Código del set",
    marca: "Marca",
    capacidadFoC: "Capacidad en frio o frio calor",
    descripcion: "Descripción de unidad",
    codSerialNumberLG: "Código de barra EAN13(Serial Number LG)",
    serialNumberLG: "Número serial number LG",
    codigoBarraLogico: "Código de barrar EAN13(LOGICO)",
    numeroEan13Logico: "Número EAN13 (LOGICO)",
    codigoBarraFisico: "Código de barra EAN13(FISICO)",
    numeroEan13Fisico: "Número EAN13(FISICO)",
    apilado: "Apilado",
    dimensiones: "Dimensiones(ANCHO/ALTO/PROF) mm",
    pesoNeto: "Peso neto",
    leyendaLegal: "Leyenda legal(FABR.-DIST.-GAR.)"
  };
  const defaultFormValues = {
    codigoDelSet: dataEdit?.codigoDelSet || "",
    marca: dataEdit?.marca || "",
    codigoEBS: dataEdit?.codigoEBS || "",
    capacidadFoC: dataEdit?.capacidadFoC || "",
    descripcion: dataEdit?.descripcion || "",
    codSerialNumberLG: dataEdit?.codSerialNumberLG || "",
    serialNumberLG: dataEdit?.serialNumberLG || "",
    codigoBarraLogico: dataEdit?.codigoBarraLogico || "",
    numeroEan13Logico: dataEdit?.numeroEan13Logico || "",
    codigoBarraFisico: dataEdit?.codigoBarraFisico || "",
    numeroEan13Fisico: dataEdit?.numeroEan13Fisico || "",
    apilado: dataEdit?.apilado || "",
    dimensiones: dataEdit?.dimensiones || "",
    pesoNeto: dataEdit?.pesoNeto || "",
    leyendaLegal: dataEdit?.leyendaLegal || ""
  };
  const { control, getValues, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultFormValues,
    mode: "onChange"
  });
  const handleGuardar = async () => {
    try {
      const objectForm = getValues();
      if (!dataEdit) {
        const response = await dispacth(
          EtiquetasIndicadoresCajaSliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            tipoDeModelo: tipoModelo
          })
        );
      }
      if (dataEdit) {
        const edit = await dispacth(
          EtiquetasIndicadoresCajaSliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            createdDate: dataEdit?.createdDate,
            tipoDeModelo: tipoModelo
          })
        );
        const deleteOld = await dispacth(EtiquetasIndicadoresCajaSliceRequests.deleteRequest(dataEdit?.id));
      }
      dataEdit
        ? openNotificationUI("Se edito correctamente", "success")
        : openNotificationUI("Se agrego correctamente", "success");
      refresh();
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const CustomAutocomplete = (options, onChange, defaultValue) => {
    return (
      <Autocomplete
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        getOptionLabel={(option) => `${option.codigoEBS}`}
        renderInput={(props) => <TextField {...props} fullWidth label="Modelo newsan" variant="standard" />}
      />
    );
  };

  const [valor, setValor] = React.useState(dataEdit || null);
  const [modeloSelected, setModeloSelected] = React.useState(null);

  const handleChange = (e, value) => {
    // what to do here?
    console.log(value);
    if (value) setModeloSelected(value.codigoEBS);
  };
  const handleCancelar = async () => {
    setOpenModal(false);
  };
  React.useEffect(() => {
    dispacth(ZPL_ProductosSliceRequests.getAllRequest());
  }, []);
  React.useEffect(() => {
    if (dataEdit) setModeloSelected(dataEdit.codigoEBS);
  }, [dataEdit]);

  return (
    <div>
      <div style={{ width: "80vw" }}>
        <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
          {modelos && CustomAutocomplete(modelos, handleChange, valor)}
          <GenericFieldsGenerator
            values={defaultFormValues}
            control={control}
            styleDiv={"text-center mb-5"}
            styleFieldSX={{ width: "100%" }}
            labels={defaultPuestoLabels}
            variant="standard"
          />
        </div>
        <div className="pt-1 flex justify-around border-t-2">
          <Button
            className={buttonClasses.blueButton}
            disabled={!formState.isValid}
            variant="contained"
            onClick={handleGuardar}>
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
