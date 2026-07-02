import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import * as yup from "yup";
import { Button } from "@mui/material";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";

interface Props {
  dataEdit: any;
  setOpenModal: any;
  generico: string;
}
export const SupermaestroForm = ({ dataEdit, setOpenModal, generico }: Props) => {
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const defaultValues = {
    idSupermaestro: dataEdit.idSupermaestro,
    generico: "",
    bPautas: "",
    codigoPautas: "",
    bWip: "",
    codigoWip: "",
    bAlternativo1: "",
    alternativo1: "",
    bAlternativo2: "",
    alternativo2: "",
    puesto: "",
    gaveta: "",
    descripcion: "",
    descripSector: "",
    area: "",
    cantidadMaterial: "",
    stockGaveta: "",
    stockSeguridad: "",
    fecha: dataEdit?.fecha || ""
  };
  const defaultLabels = {
    generico: "Generico",
    bPautas: "BPautas",
    codigoPautas: "CodigoPautas",
    bWip: "BWip",
    codigoWip: "CodigoWip",
    bAlternativo1: "BAlternativo1",
    alternativo1: "Alternativo1",
    bAlternativo2: "BAlternativo2",
    alternativo2: "Alternativo2",
    puesto: "Puesto",
    gaveta: "Gaveta",
    descripcion: "Descripcion",
    descripSector: "DescripSector",
    area: "Area",
    cantidadMaterial: "CantidadMaterial",
    stockGaveta: "StockGaveta",
    stockSeguridad: "StockSeguridad",
    fecha: "Fecha"
  };
  const schema = yup
    .object()
    .shape({
      generico: yup.string(),
      bPautas: yup.string(),
      codigoPautas: yup.string(),
      bWip: yup.string(),
      codigoWip: yup.string(),
      bAlternativo1: yup.string(),
      alternativo1: yup.string(),
      bAlternativo2: yup.string(),
      alternativo2: yup.string(),
      puesto: yup.string(),
      gaveta: yup.string(),
      descripcion: yup.string(),
      descripSector: yup.string(),
      area: yup.string(),
      cantidadMaterial: yup.string(),
      stockGaveta: yup.string(),
      stockSeguridad: yup.string(),
      fecha: yup.string()
    })
    .required();
  const { control, formState, setValue, getValues } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });
  const onGuardar = async (e) => {
    try {
      const entity = getValues();
      const submit = { ...entity, area: entity.area.trim() };
      const response = await dispatch(SupermaestroSliceRequest.putRequest(submit));
      openNotificationUI("Se edito correctamente", "success");
      const refresh = await dispatch(SupermaestroSliceRequest.getByGenerico(generico));
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onCancel = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    if (dataEdit) {
      dataEdit.puesto && setValue("puesto", dataEdit.puesto + " ");
      dataEdit.stockGaveta && setValue("stockGaveta", dataEdit.stockGaveta + " ");
      dataEdit.stockSeguridad && setValue("stockSeguridad", dataEdit.stockSeguridad + " ");
      dataEdit.generico && setValue("generico", dataEdit.generico + " ");
      dataEdit.bPautas && setValue("bPautas", dataEdit.bPautas + " ");
      dataEdit.codigoPautas && setValue("codigoPautas", dataEdit.codigoPautas + " ");
      dataEdit.bWip && setValue("bWip", dataEdit.bWip + " ");
      dataEdit.codigoWip && setValue("codigoWip", dataEdit.codigoWip + " ");
      dataEdit.bAlternativo1 && setValue("bAlternativo1", dataEdit.bAlternativo1 + " ");
      dataEdit.alternativo1 && setValue("alternativo1", dataEdit.alternativo1 + " ");
      dataEdit.bAlternativo2 && setValue("bAlternativo2", dataEdit.bAlternativo2 + " ");
      dataEdit.alternativo2 && setValue("alternativo2", dataEdit.alternativo2 + " ");
      dataEdit.gaveta && setValue("gaveta", dataEdit.gaveta + " ");
      dataEdit.descripcion && setValue("descripcion", dataEdit.descripcion + " ");
      dataEdit.descripSector && setValue("descripSector", dataEdit.descripSector + " ");
      dataEdit.area && setValue("area", dataEdit.area);
      dataEdit.cantidadMaterial && setValue("cantidadMaterial", dataEdit.cantidadMaterial + " ");
    }
  }, []);
  return (
    <div>
      <div style={{ width: "80vw" }}>
        <div className="grid sm:grid-cols-3 sm:grid-rows-6 sm:gap-4 w-full">
          <GenericFieldsGenerator
            values={defaultValues}
            control={control}
            styleDiv={"text-center mb-5"}
            styleFieldSX={{ width: "100%", height: "100%" }}
            labels={defaultLabels}
            variant="standard"
          />
        </div>
        <div className="pt-1 flex justify-around border-t-2">
          <Button
            className={buttonClasses.blueButton}
            disabled={!formState.isValid}
            variant="contained"
            onClick={onGuardar}>
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
