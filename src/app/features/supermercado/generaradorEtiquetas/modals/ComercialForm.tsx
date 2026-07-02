import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { ISuperCargalinea } from "app/models";
import moment from "moment";
import { GetInfoUser } from "app/shared/helpers/userConfig";
interface Props {
  idLinea: number;
  modelo: string;
  setOpenModal: any;
  refresh: any;
  dataEdit: ISuperCargalinea;
}
export const ComercialForm = ({ idLinea, modelo, setOpenModal, dataEdit, refresh }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  console.log(idLinea);
  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const objectSubmit = getValues();
      if (dataEdit) {
        const response = await dispatch(SuperCargalineaSliceRequests.putRequest(objectSubmit));
        openNotificationUI("Se edito correctamente", "success");
      } else {
        const response = await dispatch(SuperCargalineaSliceRequests.postRequest(objectSubmit));
        openNotificationUI("Se agrego correctamente", "success");
      }
      refresh && refresh();
      setOpenModal(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onCancel = () => {
    setOpenModal(false);
  };

  const defaultValues = {
    idSupercargalinea: dataEdit?.idSupercargalinea || 0,
    puesto: 0,
    gaveta: 0,
    codigoPautas: "",
    codigoWip: "",
    descripSector: "",
    descripcion: "",
    alternativo1: " ",
    alternativo2: " ",
    fecha: dataEdit?.fecha || new Date(),
    hora: dataEdit?.hora || moment().format("hh:mm:ss"),
    codigoModelo: modelo,
    lote: "",
    numeroOp: "",
    generico: "",
    usuario: dataEdit?.usuario || GetInfoUser().username,
    area: "",
    cantidadMaterial: 0,
    stockGaveta: 0,
    stockSeguridad: 0,
    idLinea: idLinea
  };
  const defaultLabels = {
    puesto: "Puesto",
    gaveta: "Gaveta",
    codigoPautas: "Código de pautas",
    codigoWip: "Código wip",
    descripSector: "Descripción del sector",
    descripcion: "Descripción",
    alternativo1: "Alternativo 1",
    alternativo2: "Alternativo 2",
    codigoModelo: "Código del modelo",
    lote: "Lote",
    numeroOp: "Número de OP",
    generico: "Génerico",
    area: "Area",
    cantidadMaterial: "Cantidad de material",
    stockGaveta: "Stock de gaveta",
    stockSeguridad: "Stock de seguridad"
  };
  const schema = yup
    .object()
    .shape({
      puesto: yup.number(),
      gaveta: yup.number(),
      codigoPautas: yup.string(),
      codigoWip: yup.string(),
      descripSector: yup.string(),
      descripcion: yup.string(),
      alternativo1: yup.string().nullable(),
      alternativo2: yup.string().nullable(),
      codigoModelo: yup.string(),
      lote: yup.string(),
      numeroOp: yup.string(),
      generico: yup.string(),
      area: yup.string(),
      cantidadMaterial: yup.number(),
      stockGaveta: yup.number(),
      stockSeguridad: yup.number()
    })
    .required();
  const { control, formState, getValues, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });
  useEffect(() => {
    dataEdit && reset(dataEdit);

    return () => {
      reset();
    };
  }, [dataEdit]);
  useEffect(() => {
    console.log(getValues());
  }, [formState]);

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
            onClick={onSubmit}>
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
