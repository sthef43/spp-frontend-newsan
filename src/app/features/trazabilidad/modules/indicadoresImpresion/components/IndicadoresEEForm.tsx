import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, TextField } from "@mui/material";
import { EtiquetasIndicadoresEESliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresEESlice";
import { ZPL_ProductosSliceRequests } from "app/Middleware/reducers/ZPL_ProductosSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IEtiquetasIndicadoresEE } from "app/models/IEtiquetasIndicadoresEE";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
interface Props {
  tipoModelo: string;
  setOpenModal: any;
  refresh: any;
  dataEdit: IEtiquetasIndicadoresEE;
}
export const IndicadoresEEForm = ({ tipoModelo, setOpenModal, refresh, dataEdit }: Props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const modelos = useAppSelector((data) => data.ZPL_Productos?.dataAll);
  const schema = yup
    .object()
    .shape({
      marca: yup.string().min(2).required(),
      marcaAcondicionadorAire: yup.string().min(2).required(),
      modeloInt: yup.string().min(2).required(),
      modeloExt: yup.string().min(2).required(),
      modeloTipo: yup.string().min(2).required(),
      claseDeEE: yup.string().min(2).required(),
      indiceDeEEE: yup.string().min(2).required(),
      tipoPrestacionRefri: yup.string().min(2).required(),
      tipoPrestacionRefriCalor: yup.string().min(2).required(),
      coeficientePerformane: yup.string().min(2).required(),
      numCertificado: yup.string().min(2).required(),
      consumoEAnual: yup.string().min(2).required(),
      capRefri: yup.string().min(2).required(),
      claseEE: yup.string().min(2).required(),
      escalaClaseEE: yup.string().min(2).required(),
      consumoEAnualCalefaccion: yup.string().min(2).required(),
      capCalefaccion: yup.string().min(2).required()
    })
    .required();
  const schema2 = yup
    .object()
    .shape({
      marca: yup.string().min(2).required(),
      marcaAcondicionadorAire: yup.string().min(2).required(),
      modeloTipoCompacto: yup.string().min(2).required(),
      claseDeEE: yup.string().min(2).required(),
      indiceDeEEE: yup.string().min(2).required(),
      tipoPrestacionRefri: yup.string().min(2).required(),
      numCertificado: yup.string().min(2).required(),
      consumoEAnual: yup.string().min(2).required(),
      capRefri: yup.string().min(2).required()
    })
    .required();
  const defaultSPLabels = {
    marca: "Marca",
    marcaAcondicionadorAire: "Logo marca acondicionador de aire",
    modeloInt: "Modelo unidad interior",
    modeloExt: "Modelo unidad exterior",
    modeloTipo: `Modelo Tipo "On-Off" o "Inverter"`,
    claseDeEE: "Clase de eficiencia energética (modo refrigeración)",
    indiceDeEEE: "Indice de Eficiencia Energética Estacional",
    tipoPrestacionRefri: "Tipo de Prestación del Aparato: Solo Refrigeración",
    tipoPrestacionRefriCalor: "Tipo de Prestación del Aparato: Refrigeración/Calefacción",
    coeficientePerformane: "Coeficiente de Performance",
    numCertificado: "Número de Certificado",
    consumoEAnual: "Consumo de Energía Anual(Refriogeración)",
    capRefri: "Capacidad de Refrigeración",
    claseEE: "Clase de Eficiencia Energética (Modo Calefacción)",
    escalaClaseEE: "Escala Clase Eficiencia Energética Modo Calefacción",
    consumoEAnualCalefaccion: "Consumo de Energía Anual (Calefacción)",
    capCalefaccion: "Capacidad de Calefacción"
  };
  const defaultVELabels = {
    marca: "Marca",
    marcaAcondicionadorAire: "Logo marca acondicionador de aire",
    modeloTipoCompacto: "Modelo tipo compacto",
    claseDeEE: "Clase de eficiencia energética (modo refrigeración)",
    indiceDeEEE: "Indice de Eficiencia Energética Estacional",
    tipoPrestacionRefri: "Tipo de Prestación del Aparato: Solo Refrigeración",
    numCertificado: "Número de Certificado",
    consumoEAnual: "Consumo de Energía Anual(Refriogeración)",
    capRefri: "Capacidad de Refrigeración"
  };
  const defaultFormValues = {
    codigoEBS: dataEdit?.codigoEBS || "",
    marca: dataEdit?.marca || "",
    marcaAcondicionadorAire: dataEdit?.marcaAcondicionadorAire || "",
    modeloInt: dataEdit?.modeloInt || "",
    modeloExt: dataEdit?.modeloExt || "",
    modeloTipo: dataEdit?.modeloTipo || "",
    modeloTipoCompacto: dataEdit?.modeloTipoCompacto || "",
    claseDeEE: dataEdit?.claseDeEE || "",
    indiceDeEEE: dataEdit?.indiceDeEEE || "",
    tipoPrestacionRefri: dataEdit?.tipoPrestacionRefri || "",
    tipoPrestacionRefriCalor: dataEdit?.tipoPrestacionRefriCalor || "",
    coeficientePerformane: dataEdit?.coeficientePerformane || "",
    numCertificado: dataEdit?.numCertificado || "",
    consumoEAnual: dataEdit?.consumoEAnual || "",
    capRefri: dataEdit?.capRefri || "",
    claseEE: dataEdit?.claseEE || "",
    escalaClaseEE: dataEdit?.escalaClaseEE || "",
    consumoEAnualCalefaccion: dataEdit?.consumoEAnualCalefaccion || "",
    capCalefaccion: dataEdit?.capCalefaccion || ""
  };
  const defaultSPValues = {
    codigoEBS: dataEdit?.codigoEBS || "",
    marca: dataEdit?.marca || "",
    marcaAcondicionadorAire: dataEdit?.marcaAcondicionadorAire || "",
    modeloInt: dataEdit?.modeloInt || "",
    modeloExt: dataEdit?.modeloExt || "",
    modeloTipo: dataEdit?.modeloTipo || "",
    claseDeEE: dataEdit?.claseDeEE || "",
    indiceDeEEE: dataEdit?.indiceDeEEE || "",
    tipoPrestacionRefri: dataEdit?.tipoPrestacionRefri || "",
    tipoPrestacionRefriCalor: dataEdit?.tipoPrestacionRefriCalor || "",
    coeficientePerformane: dataEdit?.coeficientePerformane || "",
    numCertificado: dataEdit?.numCertificado || "",
    consumoEAnual: dataEdit?.consumoEAnual || "",
    capRefri: dataEdit?.capRefri || "",
    claseEE: dataEdit?.claseEE || "",
    escalaClaseEE: dataEdit?.escalaClaseEE || "",
    consumoEAnualCalefaccion: dataEdit?.consumoEAnualCalefaccion || "",
    capCalefaccion: dataEdit?.capCalefaccion || ""
  };
  const defaultVEValues = {
    codigoEBS: dataEdit?.codigoEBS || "",
    marca: dataEdit?.marca || "",
    marcaAcondicionadorAire: dataEdit?.marcaAcondicionadorAire || "",
    modeloTipoCompacto: dataEdit?.modeloTipoCompacto || "",
    claseDeEE: dataEdit?.claseDeEE || "",
    indiceDeEEE: dataEdit?.indiceDeEEE || "",
    tipoPrestacionRefri: dataEdit?.tipoPrestacionRefri || "",
    numCertificado: dataEdit?.numCertificado || "",
    consumoEAnual: dataEdit?.consumoEAnual || "",
    capRefri: dataEdit?.capRefri || ""
  };
  const { control, getValues, formState } = useForm({
    resolver: yupResolver(tipoModelo == "SP" ? schema : schema2),
    defaultValues: defaultFormValues,
    mode: "onChange"
  });
  const handleGuardar = async () => {
    try {
      const objectForm = getValues();
      if (!dataEdit) {
        const response = await dispacth(
          EtiquetasIndicadoresEESliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            tipoDeModelo: tipoModelo
          })
        );
      }
      if (dataEdit) {
        const edit = await dispacth(
          EtiquetasIndicadoresEESliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            createdDate: dataEdit?.createdDate,
            tipoDeModelo: tipoModelo
          })
        );
        const deleteOld = await dispacth(EtiquetasIndicadoresEESliceRequests.deleteRequest(dataEdit?.id));
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
          {tipoModelo == "SP" ? (
            <GenericFieldsGenerator
              values={defaultSPValues}
              control={control}
              styleDiv={"text-center mb-5"}
              styleFieldSX={{ width: "100%" }}
              labels={defaultSPLabels}
              variant="standard"
            />
          ) : (
            <GenericFieldsGenerator
              values={defaultVEValues}
              control={control}
              styleDiv={"text-center mb-5"}
              styleFieldSX={{ width: "100%" }}
              labels={defaultVELabels}
              variant="standard"
            />
          )}
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
