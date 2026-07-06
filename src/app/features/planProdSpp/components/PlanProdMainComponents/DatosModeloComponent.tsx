/* eslint-disable unused-imports/no-unused-vars */
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { familiaSlice } from "app/Middleware/reducers/FamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { modeloSlice, ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlanProd } from "app/models";
import { IModelo } from "app/models/IModelo";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { FC, useEffect, useState } from "react";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue } from "react-hook-form";
import { AgregarNuevoModeloModal } from "../../modals/AgregarNuevoModeloModal";
import { IPlanProdSpp } from "../../models/IPlanProdSpp";

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
}

export const DatosModeloComponent: FC<Props> = ({ controlFather, setValuesFather, resetFather, errosFather }) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const linea = useAppSelector((state) => state.lineaProduccion.object as any);
  const planProduccionEdit = useAppSelector((state) => state.planProdSpp.object as IPlanProdSpp);
  const edicionState = useAppSelector((state) => state.optionForm.estadoEdicion);

  const [openModalAgregarModelo, setOpenModalAgregarModelo] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string | number>("");

  //HAGO UNA PETICION PARA TRAER TODOS LOS MODELOS QUE ESTAN INPUTADOS A ESA LINEA
  const [modelos, setModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.GetAllModelsByFamiliasOfLines, linea.id, false, null, setModelos, false);

  //HAGO LA PETICION A EL PLAN DE PRODUCCION DE LA BASE(08) PARA SABER LOS DATOS DEL ULTIMO REGISTRO DEL MODELO CON SU REMANENTE INCLUIDO
  const [datosPlanProd, setDatosPlanProd] = useState<IPlanProd>();
  FetchApi<IPlanProd>(
    PlanProdSliceRequests.GetLastPlanProdByModeloWithRemanent,
    { modelo: modeloSeleccionado, nombreLinea: linea.nombre },
    true,
    modeloSeleccionado,
    setDatosPlanProd,
    true
  );

  //HAGO UNA PETICION PARA QUE ME TRAIGA LOS DATOS DEL MODELO SELECCIONADO
  const getPlanProd = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseModelo = unwrapResult(
        await dispatch(ModeloSliceRequest.GetModelById(modeloSeleccionado as string))
      );
      if (responseModelo) {
        setInputs(responseModelo);
        dispatch(modeloSlice.actions.setObject(responseModelo));
        dispatch(familiaSlice.actions.setObject(responseModelo.familia));
      } else {
        setValuesFather("lote", "101");
        setValuesFather("remanente", "0");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //SETEO EL PROVEEDOR CON LOS DATOS DEL MODELO
  const setInputs = (responseModelo: IModelo) => {
    setValuesFather("cantidad", "");
    setValuesFather("po", "");
    setValuesFather("proveedor", responseModelo.familia.proveedores.descripcion);
    setValuesFather("familia", responseModelo ? responseModelo.familia.nombre : "");
  };

  //USO ESTE UseEffect PARA QUE SI ENCUENTRA ALGO CON EL MODELO SELECCIONADO ME SETEO LOS INPUTS Y SI NO ENCUENTRA QUE LOS PASE A VACIO
  useEffect(() => {
    if (datosPlanProd && modeloSeleccionado) {
      setValuesFather("lote", datosPlanProd ? datosPlanProd.lote.trim() : "");
      setValuesFather("remanente", datosPlanProd ? datosPlanProd.pendiente.toString() : "");
      getPlanProd();
    } else {
      setValuesFather("lote", "101");
      setValuesFather("remanente", "0");
    }
  }, [datosPlanProd, modeloSeleccionado]);

  return (
    <main className="w-full mt-6">
      <form className="w-full flex flex-col">
        <div className="flex flex-row justify-around gap-x-4 items-center h-64">
          <div className="flex flex-col gap-y-4 w-[30%]">
            <div className="flex flex-row items-center gap-x-4">
              <SelectComponent
                inputLabel="Modelo"
                listaObjetos={modelos}
                nameSelect="modelo"
                disabled={edicionState}
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.nombre}
                defaultValue={edicionState ? planProduccionEdit.modelo.nombre : ""}
                control={controlFather}
                valueKey={(value) => value}
                ValueSave={setModeloSeleccionado}
                varianteEstilo="standard"
              />
              {!edicionState && (
                <Tooltip title="Agregar modelo">
                  <IconButton
                    disabled={modeloSeleccionado === ""}
                    onClick={() => {
                      setOpenModalAgregarModelo(true);
                    }}
                    style={{ position: "relative", backgroundColor: modeloSeleccionado === "" ? "#4b5563" : "#59B7F7" }}
                    size="small">
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <TextFieldComponent
              control={controlFather}
              index={0}
              labelInput="Cantidad"
              nameInput="cantidad"
              valueDefault={edicionState ? planProduccionEdit.cantidad.toString() : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={1}
              labelInput="PO"
              nameInput="po"
              valueDefault={edicionState ? planProduccionEdit.po : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
          </div>
          <div className="w-1/2 grid grid-cols-2 content-center items-center gap-8 bg-background pt-8 pb-14 px-9 rounded-lg">
            <TextFieldComponent
              control={controlFather}
              index={2}
              labelInput="Proveedor"
              nameInput="proveedor"
              valueDefault={edicionState ? planProduccionEdit.modelo.familia.proveedores.descripcion : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={3}
              labelInput="Familia"
              nameInput="familia"
              valueDefault={edicionState ? planProduccionEdit.modelo.familia.nombre : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={4}
              labelInput="Lote"
              nameInput="lote"
              valueDefault={edicionState ? planProduccionEdit.lote : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={5}
              labelInput="Remanente"
              nameInput="remanente"
              valueDefault={edicionState ? planProduccionEdit.remanente : ""}
              requiredBool
              errors={errosFather}
              typeInput="standard"
            />
          </div>
        </div>
      </form>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarModelo}
        openPopup={openModalAgregarModelo}
        title="Crear Nuevo Modelo">
        <AgregarNuevoModeloModal openModal={openModalAgregarModelo} setOpenModal={setOpenModalAgregarModelo} />
      </ModalCompoment>
    </main>
  );
};
