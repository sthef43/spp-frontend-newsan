import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ICodigoRechazos } from "app/models/ICodigoRechazos";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { MQfunc } from "app/shared/components/material-ui/breakpoints";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { CodigoRechazosSliceRequest } from "app/Middleware/reducers/CodigoRechazosSlice";

interface props {
  editState: ICodigoRechazos | any;
  idLinea: number;
  setOpenModal: any;
  refresh: any;
}

export const CarrgaRechazosForm = ({ editState, idLinea, setOpenModal, refresh }: props) => {
  const { openNotificationUI } = useNotificationUI();
  const materialButtons = MaterialButtons();

  const schema = yup
    .object()
    .shape({
      descripcionRechazo: yup.string().required("Campo requerido"),
      codigoRechazo: yup.number().required("Campo requerido"),
      totaliza: yup.string().required("Campo requerido"),
      informeMensual: yup.string().required("Campo requerido")
    })
    .required();
  const defaultLabels = {
    descripcionRechazo: "Descripcion ",
    codigoRechazo: "Codigo",
    totaliza: "Totaliza",
    informeMensual: "Informe Mensual"
  };
  const defaultFormValues = {
    descripcionRechazo: "",
    codigoRechazo: 0,
    totaliza: "S",
    informeMensual: "S"
    //nombre: editState?.nombre || "",
  };
  const selectFields = {
    Totaliza: {
      array: [
        { id: "S", valor: "SI" },
        { id: "N", valor: "NO" }
      ],
      id: "id",
      column: "valor"
    },
    "Informe Mensual": {
      array: [
        { id: "S", valor: "SI" },
        { id: "N", valor: "NO" }
      ],
      id: "id",
      column: "valor"
    }
  };
  const { control, getValues, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editState != null ? editState : defaultFormValues,
    mode: "onChange"
  });

  const dispatch = useAppDispatch();

  //Verifico la existencia del codigo. si existe devuelve le objeto.
  const getCodigoRechazoByLineaIdAndCodigo = async () => {
    const params = { codigo: getValues("codigoRechazo"), lineaId: idLinea };
    const result = unwrapResult(await dispatch(CodigoRechazosSliceRequest.GetByCodigoAndLineaRequest(params)));
    if (result) {
      return result;
    } else return null;
  };

  const updetearCodigoRechazo = async () => {
    const objetoCodigoRechazo: ICodigoRechazos = await getCodigoRechazoByLineaIdAndCodigo(); //Traigo el codigo para ver si existe.

    //Si existe y no es el que estoy updeteando, no dejo editar xq ya existe el codigo.
    if (objetoCodigoRechazo) {
      if (objetoCodigoRechazo.idCodigoRechazo != getValues("idCodigoRechazo")) {
        openNotificationUI("El codigo ya existe.", "error");
        return false;
      }
    }

    const obj: ICodigoRechazos = {
      ...getValues(),
      idLinea: idLinea
    };

    let result;
    try {
      result = unwrapResult(await dispatch(CodigoRechazosSliceRequest.PutRequest(obj)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      openNotificationUI("Guardado exitosamente", "success");
      setOpenModal(false);
      refresh();
    } else {
      openNotificationUI("Hubo un error al guardar", "error");
    }
  };

  const postearCodigoRechazo = async () => {
    const objetoCodigoRechazo: ICodigoRechazos = await getCodigoRechazoByLineaIdAndCodigo();

    if (objetoCodigoRechazo) {
      openNotificationUI("El codigo ya existe.", "warning");
      return false;
    }

    const obj: ICodigoRechazos = {
      ...getValues(),
      idLinea: idLinea
    };

    let result;
    try {
      result = unwrapResult(await dispatch(CodigoRechazosSliceRequest.PostRequest(obj)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      openNotificationUI("Guardado exitosamente", "success");
      setOpenModal(false);
      refresh();
    } else {
      openNotificationUI("Hubo un error al guardar", "error");
    }
  };

  const guardar = async () => {
    if (editState) {
      //El update, tiene otra logica diferente xq si edita el codigo y ya existe, no lo debe dejar guardar.
      updetearCodigoRechazo();
    } else {
      postearCodigoRechazo();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <GenericFieldsGenerator
          values={defaultFormValues}
          control={control}
          labels={defaultLabels}
          selectFields={selectFields}
          styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
          variant="outlined"
        />
      </div>
      <div className="flex md:col-span-3 justify-around mt-4 w-full">
        <div>
          <Button
            variant="contained"
            className={materialButtons.greenButton}
            onClick={() => {
              guardar();
            }}
            disabled={!formState.isValid || !formState.isDirty}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};
