import { Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { SuperCargalineaSlice, SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IOperator, IPlanProd, ISuperCargalinea } from "app/models";
import { ISupermaestro } from "app/models/ISupermaestro";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
interface Props {
  modelo?: string;
  superCargalinea?: ISuperCargalinea[];
  refresh?: () => void;
}

export const ComercialGenerador = ({ modelo, superCargalinea, refresh }: Props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const supermaestros: ISupermaestro[] = useAppSelector((data) => data.supermaestro.dataAll);
  const lineas: ILinea[] = useAppSelector<ILinea[]>((state) => state.linea.dataAll);
  const modelos = useAppSelector((state) => state.planprod.dataAll as any);
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();
  const [user, setUser] = useState<IOperator>(null);
  const [openModal, setOpenModal] = useState(false);
  const [lotes, setLotes] = useState<IPlanProd[]>([]);
  const OnGenerate = async () => {
    try {
      if (await getConfirmation("Generar comercial", "Esta seguro que quiere generar el comercial?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const fecha = new Date();
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        const horaFormateada = `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos
          .toString()
          .padStart(2, "0")}`;
        if (modelo) {
          const newSupercargalinea = superCargalinea.map((s) => {
            return {
              ...s,
              idSupercargalinea: 0,
              fecha: fecha,
              hora: horaFormateada,
              usuario: user.name + " " + user.surname,
              codigoModelo: getValues("modelo"),
              lote: getValues("lote").trim(),
              numeroOp: getValues("OP"),
              idLinea: getValues("idLinea")
            };
          });
          const response = unwrapResult(
            await dispatch(SuperCargalineaSliceRequests.multiPostNestedRequest(newSupercargalinea))
          );
        } else {
          const newSupercargalinea = supermaestros.map((s) => {
            return {
              puesto: parseInt(s.puesto) || 0,
              fecha: fecha,
              hora: horaFormateada,
              usuario: user.name + " " + user.surname,
              gaveta: parseInt(s.gaveta) || 0,
              codigoPautas: s.codigoPautas.trim(),
              codigoWip: s.bWip.trim(),
              descripSector: s.descripSector,
              descripcion: s.descripcion,
              alternativo1: s.alternativo1,
              alternativo2: s.alternativo2,
              codigoModelo: getValues("modelo"),
              lote: getValues("lote").trim(),
              numeroOp: getValues("OP"),
              generico: s.generico,
              area: s.area.trim(),
              cantidadMaterial: parseInt(s.cantidadMaterial) || 0,
              stockGaveta: parseInt(s.stockGaveta) || 0,
              stockSeguridad: parseInt(s.stockSeguridad) || 0,
              idLinea: getValues("idLinea")
            };
          });
          const response = unwrapResult(
            await dispatch(SuperCargalineaSliceRequests.multiPostNestedRequest(newSupercargalinea))
          );
        }
        refresh && refresh();
        setOpenModal(false);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };
  const { control, watch, getValues, setValue, reset } = useForm({
    defaultValues: { idLinea: 0, modelo: "", lote: "", OP: "" }
  });
  const handleModelos = async () => {
    try {
      setValue("modelo", "");
      setValue("OP", "");
      setValue("lote", "");
      dispatch(SuperCargalineaSlice.actions.clearData());
      const response = unwrapResult(
        await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(getValues("idLinea")))
      );
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onGetLotes = async () => {
    try {
      setValue("OP", "");
      setValue("lote", "");
      const response = unwrapResult(await dispatch(PlanProdSliceRequests.GetAllLotesByModelo(getValues("modelo"))));
      console.log(response);

      setLotes(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getDataUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      setUser(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    dispatch(LineaSliceRequests.getAllRequest());
    getDataUser();
    return () => {
      reset();
    };
  }, []);
  return (
    <div>
      <Button className={buttonClasses.purpleButton} variant="contained" onClick={() => setOpenModal(true)}>
        Generar comercial
      </Button>
      <ModalCompoment title="Generar modelo comercial" setOpenPopup={setOpenModal} openPopup={openModal}>
        <div className="p-4 rounded-lg shadow-elevation-4 bg-secondaryNew gap-4  w-full">
          <div className=" grid grid-rows-2 gap-4">
            <Controller
              control={control}
              name="idLinea"
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Seleccione una linea</InputLabel>
                  <Select {...field} onClick={handleModelos}>
                    {lineas &&
                      lineas.map((linea) => (
                        <MenuItem key={linea.idLinea} value={linea.idLinea}>
                          {linea.descripcion}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="modelo"
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Seleccione un modelo</InputLabel>
                  <Select {...field} onClick={onGetLotes}>
                    {modelos &&
                      modelos.map((modelo) => (
                        <MenuItem key={modelo.nombre} value={modelo.nombre}>
                          {modelo.nombre}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="lote"
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Seleccione un lote</InputLabel>
                  <Select {...field}>
                    {lotes &&
                      lotes.map((planprod) => (
                        <MenuItem
                          key={planprod.idProduccion}
                          value={planprod.lote}
                          onClick={() => setValue("OP", planprod.numeroOp)}>
                          {planprod.lote.trim()[planprod.lote.trim().length - 1] == "I"
                            ? "Lote " + planprod.lote + " - " + planprod.numeroOp + " IM"
                            : "Lote " + planprod.lote + " - " + planprod.numeroOp}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="OP"
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Número de OP</InputLabel>
                  <Input {...field} disabled />
                </FormControl>
              )}
            />
          </div>
          <div className="flex justify-center m-2">
            <Button className={buttonClasses.greenButton} variant="contained" onClick={OnGenerate}>
              Generar
            </Button>
          </div>
        </div>
      </ModalCompoment>
    </div>
  );
};
