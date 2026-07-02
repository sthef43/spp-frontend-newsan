import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IEtiquetasIndicadoresModelo } from "app/models/IEtiquetasIndicadoresModelo";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { EtiquetasIndicadoresModeloSliceRequests } from "app/Middleware/reducers/EtiquetasIndicadoresModeloSlice";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { Autocomplete, Button, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { ZPL_ProductosSliceRequests } from "app/Middleware/reducers/ZPL_ProductosSlice";
interface Props {
  tipoModelo: string;
  tipoUnidad: string;
  setOpenModal: any;
  refresh: any;
  dataEdit: IEtiquetasIndicadoresModelo;
}
export const IndicadoresModeloINTForm = ({ tipoModelo, setOpenModal, refresh, dataEdit }: Props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const modelos = useAppSelector((data) => data.ZPL_Productos?.data);
  const schema = yup
    .object()
    .shape({
      marca: yup.string().min(2).required(),
      logoMarca: yup.string().min(2).required(),
      tipoUnidadInt: yup.string().min(2).required(),
      codigoModeloInt: yup.string().min(2).required(),
      capacidadRefrigeracion: yup.string().min(2).required(),
      capacidadCalefaccion: yup.string().min(2).required(),
      potenciaMaxRefri: yup.string().min(2).required(),
      potenciaMaxCalef: yup.string().min(2).required(),
      potenciaRefrigeracion: yup.string().min(2).required(),
      potenciaCalefaccion: yup.string().min(2).required(),
      circulacionAire: yup.string().min(2).required(),
      tensionNominal: yup.string().min(2).required(),
      frecuenciaNominal: yup.string().min(2).required(),
      valorFusible: yup.string().min(2).required(),
      nivelRuido: yup.string().min(2).required(),
      pesoNeto: yup.string().min(2).required()
    })
    .required();
  const defaultPuestoLabels = {
    marca: "Marca",
    logoMarca: "Logo marca",
    tipoUnidadInt: "Tipo de unidad interior",
    codigoModeloInt: "Código de unidad interior",
    capacidadRefrigeracion: "Capacidad refrigeración(en kW)",
    capacidadCalefaccion: "Capacidad calefacción(en kW)",
    potenciaMaxRefri: "Potencia máx. refrigeración(240V/43°C)",
    potenciaMaxCalef: "Potencia máx. calefacción (240V/43°C)",
    potenciaRefrigeracion: "Potencia refrigeración(ISO 5151)",
    potenciaCalefaccion: "Potencia calefacción(ISO 5151)",
    circulacionAire: "Circulación de aire (en m³/h)",
    tensionNominal: "Tensión nominal",
    frecuenciaNominal: "Frecuencia nominal",
    valorFusible: "Valor fusible en PCB",
    nivelRuido: "Nivel de ruido",
    pesoNeto: "Peso neto"
  };
  const defaultFormValues = {
    codigoEBS: dataEdit?.codigoEBS || "",
    marca: dataEdit?.marca || "",
    logoMarca: dataEdit?.logoMarca || "",
    tipoUnidadInt: dataEdit?.tipoUnidadInt || "",
    codigoModeloInt: dataEdit?.codigoModeloInt || "",
    capacidadRefrigeracion: dataEdit?.capacidadRefrigeracion || "",
    capacidadCalefaccion: dataEdit?.capacidadCalefaccion || "",
    potenciaMaxRefri: dataEdit?.potenciaMaxRefri || "",
    potenciaMaxCalef: dataEdit?.potenciaMaxCalef || "",
    potenciaRefrigeracion: dataEdit?.potenciaRefrigeracion || "",
    potenciaCalefaccion: dataEdit?.potenciaCalefaccion || "",
    circulacionAire: dataEdit?.circulacionAire || "",
    tensionNominal: dataEdit?.tensionNominal || "",
    frecuenciaNominal: dataEdit?.frecuenciaNominal || "",
    valorFusible: dataEdit?.valorFusible || "",
    nivelRuido: dataEdit?.nivelRuido || "",
    pesoNeto: dataEdit?.pesoNeto || ""
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
          EtiquetasIndicadoresModeloSliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            tipoDeModelo: tipoModelo
          })
        );
      }
      if (dataEdit) {
        const edit = await dispacth(
          EtiquetasIndicadoresModeloSliceRequests.PostRequest({
            ...objectForm,
            codigoEBS: modeloSelected,
            createdDate: dataEdit?.createdDate,
            tipoDeModelo: tipoModelo
          })
        );
        const deleteOld = await dispacth(EtiquetasIndicadoresModeloSliceRequests.deleteRequest(dataEdit?.id));
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
    dispacth(ZPL_ProductosSliceRequests.getAllByTipoEquipo("I"));
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
