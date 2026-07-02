import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { DatosExtrasComponent } from "../components/PlanProdMainComponents/DatosExtrasComponent";
import { DatosModeloComponent } from "../components/PlanProdMainComponents/DatosModeloComponent";
import { DatosOpComponent } from "../components/PlanProdMainComponents/DatosOpComponent";
import { AgregarEditarEmbarqueModal } from "../modals/AgregarEditarEmbarqueModal";
import { AsignarEmbarquesPlanProdModal } from "../modals/AsignarEmbarquesPlanProdModal";
import { ActualizarPlanProdSppDTO } from "../models/DTOS/ActualizarPlanProdSppDTO";
import { OptionFormSlice } from "../reducers/OptionFormReducers";
import { PlanProdSppEmbarqueBloqueSliceRequest } from "../reducers/PlanProdSppEmbarqueBloqueSlice";
import { PlanProdSppEmbarqueSlice } from "../reducers/PlanProdSppEmbarqueSlice";
import { PlanProdSppSliceRequest } from "../reducers/PlanProdSppSlice";
import { UseFetchPlanSeparateForMonth } from "../hooks/UseFetchPlanSeparateForMonth";
import { IPlanProdSpp } from "../models/IPlanProdSpp";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";
import { IPlanProdSppEmbarquesBloque } from "../models/IPlanProdSppEmbarqueBloque";

interface Props {
  setOpenModal: (newValue: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, unused-imports/no-unused-vars
export const LayoutCrearLote: FC<Props> = ({ setOpenModal }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid, errors }
  } = useForm({ mode: "onChange", shouldUnregister: false });

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();
  const { refreshPlanByFetchComplete } = UseFetchPlanSeparateForMonth();

  const estadoFormularios = useAppSelector((state) => state.optionForm.dataAll);
  const { mesSeleccionado, mesFinSeleccionado, mesSeleccionadoEditPlan } = useAppSelector(
    (state) => state.statesFormModals
  );
  const listaEmbarques = useAppSelector((state) => state.planProdSppEmbarques.preCarga);
  const planProduccionEdit = useAppSelector((state) => state.planProdSpp.object as IPlanProdSpp);
  const planProduccionList = useAppSelector((state) => state.planProdSpp.dataAll);
  const linea = useAppSelector((state) => state.lineaProduccion.object as any);
  const modelo = useAppSelector((state) => state.modelo.object);
  const editState = useAppSelector((state) => state.optionForm.estadoEdicion);

  const [openModalNuevoEmbarque, setOpenModalNuevoEmbarque] = useState(false);
  const [openModalAsignarEmbarque, setOpenModalAsignarEmbarque] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | number>(
    editState ? planProduccionEdit.estado : 0
  );

  const [formularioIndex, setFormularioIndex] = useState(1);

  //FUNCION QUE PASA AL SIGUIENTE FORMULARIO Y PASA EL ESTADO DEL FORMULARIO A APROBADO
  const pasarSiguienteFormulario = () => {
    const clonFormularioState = [...estadoFormularios];
    const aprobarFormulario = clonFormularioState.map((elementos) => {
      const nuevoObjeto = { ...elementos };
      if (nuevoObjeto.idForm == formularioIndex) {
        nuevoObjeto.aprobeForm = true;
      }
      return nuevoObjeto;
    });
    dispatch(OptionFormSlice.actions.setNewPlanAll(aprobarFormulario));
    setFormularioIndex((prev) => prev + 1);
  };

  //FUNCION QUE GUARDA EL NUEVO PLAN EN LA BASE DE DATOS O SI EL editState ESTA EN TRUE SE ACTUALIZA EL PLAN DE PRODUCCION SELECCIONADA EN LA TABLA
  const onSubmit = (data) => {
    if (!editState) {
      const nuevoPlan = generarNuevoPlan(data);
      FetchPost(PlanProdSppSliceRequest.PostRequest, nuevoPlan, true, async (response: any) => {
        const nuevosBloques = generarBloquesPlanAndEmbarques(response.id, listaEmbarques);
        await dispatch(PlanProdSppEmbarqueBloqueSliceRequest.multiPostRequest(nuevosBloques));
        await dispatch(
          PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
            lineaProduccionId: linea.id,
            mesInicio: mesSeleccionado,
            mesFin: mesFinSeleccionado
          })
        );
        openNotificationUI("Se genero el nuevo plan de produccion con exito", "success");
        dispatch(PlanProdSppEmbarqueSlice.actions.setEmptyPreCarga());
        setOpenModal(false);
      });
    } else {
      const planCambiado = actualizarPlan(data);
      const actualizarPlanDTO: ActualizarPlanProdSppDTO = {
        entidad: planCambiado,
        mesDesde: mesSeleccionado,
        mesHasta: mesFinSeleccionado
      };
      const clonActualizar = { ...actualizarPlanDTO };
      clonActualizar.entidad.mes = mesSeleccionadoEditPlan;
      FetchPut({
        sliceRequest: PlanProdSppSliceRequest.PutPlanProdSpp,
        modelPut: actualizarPlanDTO,
        consoleLog: false,
        titleUser: "Actualizar plan de produccion",
        mensajePersonalizado: true,
        messageUser: "Se actualizara el plan de produccion con todos sus valores nuevos y se calculara un nuevo plan",
        functionAdd: async () => {
          const nuevosBloques = generarBloquesPlanAndEmbarques(planProduccionEdit.id, listaEmbarques);
          if (nuevosBloques && nuevosBloques.length > 0) {
            await dispatch(PlanProdSppEmbarqueBloqueSliceRequest.multiPostRequest(nuevosBloques));
          }
          const response = unwrapResult(
            await dispatch(
              PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
                lineaProduccionId: linea.id,
                mesInicio: mesSeleccionado,
                mesFin: mesFinSeleccionado
              })
            )
          );
          refreshPlanByFetchComplete(response, setOpenModal);
        }
      });
    }
  };

  //FUNCION QUE VUELVE AL FORMULARIO ANTERIOR Y PASA EL ESTADO DEL FORMULARIO A DESAPROBADO
  const volverFormularioAnterior = () => {
    const clonFormularioState = [...estadoFormularios];
    const aprobarFormulario = clonFormularioState.map((elementos) => {
      const nuevoObjeto = { ...elementos };
      if (nuevoObjeto.idForm == formularioIndex) {
        nuevoObjeto.aprobeForm = false;
        nuevoObjeto.estadoForm = 0;
      }
      return nuevoObjeto;
    });
    dispatch(OptionFormSlice.actions.setNewPlanAll(aprobarFormulario));
    setFormularioIndex((prev) => prev - 1);
  };

  //GENERO EL NUEVO PLAN DE PRODUCCION CON TODOS LOS DATOS DE LOS FORMULARIOS
  const generarNuevoPlan = (formData) => {
    try {
      const nuevoPlan: IPlanProdSpp = {
        empresa: "Newsan",
        cantidad: formData.cantidad,
        estado: formData.estados,
        lineaProduccionId: linea.id,
        observaciones: formData.observacion,
        plantId: linea.plant.id,
        po: formData.po,
        modeloId: modelo.id,
        ritmo: formData.ritmo,
        lote: formData.lote,
        remanente: formData.remanente,
        opImDisplay: formData.opDisplay !== "" ? `OP-${formData.opDisplay}` : "",
        opImMain: formData.opMain !== "" ? `OP-${formData.opMain}` : "",
        opMontaje: formData.opMontaje !== "" ? `OP-${formData.opMontaje}` : "",
        opSub: formData.opSub !== "" ? `OP-${formData.opSub}` : "",
        organizationCode: linea.plant.organizationCode,
        mes: mesSeleccionado,
        position: planProduccionList.length + 1,
        produciendo: false
      };

      if (nuevoPlan !== null) {
        return nuevoPlan;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se produjo un error al generar el nuevo plan: ${error}`, "error");
    }
  };

  //GENERO EL PLAN DE PRODUCCION CON TODOS LOS DATOS DE LOS FORMULARIOS PARA ACTUALIZAR
  const actualizarPlan = (formData) => {
    try {
      const nuevoPlan: IPlanProdSpp = {
        ...planProduccionEdit,
        empresa: "Newsan",
        cantidad: formData.cantidad,
        estado: formData.estados,
        lineaProduccionId: linea.id,
        observaciones: formData.observacion,
        plantId: linea.plant.id,
        po: formData.po,
        modeloId: planProduccionEdit.modeloId,
        ritmo: formData.ritmo,
        lote: formData.lote,
        remanente: formData.remanente,
        opImDisplay: formData.opDisplay,
        opImMain: formData.opMain,
        opMontaje: formData.opMontaje,
        opSub: formData.opSub,
        organizationCode: linea.plant.organizationCode,
        mes: mesSeleccionadoEditPlan,
        position: planProduccionEdit.position
      };

      delete nuevoPlan.planProdSppEmbarqueBloque;
      delete nuevoPlan.modelo;

      if (nuevoPlan !== null) {
        return nuevoPlan;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se produjo un error al generar el nuevo plan: ${error}`, "error");
    }
  };

  //GENERO LOS NUEVOS BLOQUES PARA CONECTAR EL PLAN DE PRODUCCION CON LOS EMBARQUES Y LE PASO COMO ARGUMENTO EL PLAN DE PRODUCCION CREADO
  const generarBloquesPlanAndEmbarques = (responseId: any, listaEmbarques: IPlanProdSppEmbarque[]) => {
    try {
      let listaEmbarquesAux: IPlanProdSppEmbarque[] = [];
      if (!editState) {
        listaEmbarquesAux = listaEmbarques;
      } else {
        listaEmbarquesAux = buscarEmbarquesYaIngresados();
      }
      const listaBloques: IPlanProdSppEmbarquesBloque[] = [];
      listaEmbarquesAux.forEach((elementos) => {
        const nuevosBloques: IPlanProdSppEmbarquesBloque = {
          planProdSppId: responseId,
          planProdSppEmbarqueId: elementos.id
        };
        listaBloques.push(nuevosBloques);
      });

      if (listaBloques.length > 0) {
        return listaBloques;
      }
    } catch (error) {
      openNotificationUI(`Se produjo un error intentando generar los bloques de embarques: ${error}`, "error");
    }
  };

  const buscarEmbarquesYaIngresados = () => {
    const embarquesAgregados = planProduccionEdit.planProdSppEmbarqueBloque.map((elementos) => {
      return elementos.planProdSppEmbarqueId;
    });
    const embarquesSinAgregar = listaEmbarques.filter((elementos) => !embarquesAgregados.includes(elementos.id));
    return embarquesSinAgregar;
  };

  //HANDLE QUE USO PARA PASAR EL setOpenModalNuevoEmbarque al hijo para que desde el hijo me de el valor para abrir o cerrar el modal
  const handleOpenModalNuevoEmbarque = (newValueBoolean) => {
    dispatch(OptionFormSlice.actions.setModeEditionEmbarque(false));
    setOpenModalNuevoEmbarque(newValueBoolean);
  };

  //HANDLE QUE USO PARA PASAR EL setOpenModalAsignarEmbarque al hijo para que desde el hijo me de el valor para abrir o cerrar el modal
  const handleOpenModalAsignarEmbarque = (newValueBoolean) => {
    setOpenModalAsignarEmbarque(newValueBoolean);
  };

  //HANDLE QUE USO PARA PASAR EL setEstadoSeleccionado al hijo para que desde el hijo me de el valor del estado que tengo para el plan
  const verificarEstadoSelecionado = (valueEstado) => {
    setEstadoSeleccionado(valueEstado);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-x-hidden">
        <ul className="flex flex-row items-start gap-x-4 w-[300%]">
          <li
            className={`${
              formularioIndex != 1 ? "-translate-x-[105%]" : "-translate-x-0"
            } transition-all duration-300 w-[35%]`}>
            <DatosModeloComponent
              errosFather={errors}
              controlFather={control}
              setValuesFather={setValue}
              resetFather={reset}
            />
          </li>
          <li
            className={`${
              formularioIndex == 2 ? "-translate-x-[100%]" : ""
            } w-[35.4%] duration-300 transition-all mt-[2%]`}>
            {formularioIndex == 2 && (
              <DatosOpComponent
                errosFather={errors}
                controlFather={control}
                setValuesFather={setValue}
                resetFather={reset}
              />
            )}
          </li>
          <li
            className={`${
              formularioIndex == 3 ? "-translate-x-[200%]" : ""
            } w-[35.4%] duration-300 transition-all mt-9 px-6`}>
            {formularioIndex == 3 && (
              <DatosExtrasComponent
                setValueEstado={verificarEstadoSelecionado}
                setOpenModalAsignarEmbarque={handleOpenModalAsignarEmbarque}
                setOpenNuevoEmbarque={handleOpenModalNuevoEmbarque}
                errosFather={errors}
                controlFather={control}
                setValuesFather={setValue}
                resetFather={reset}
                watchFather={watch}
              />
            )}
          </li>
        </ul>
        <div className="w-full justify-end flex flex-row items-center gap-x-4">
          <div className={`${formularioIndex !== 1 ? "flex" : "hidden"} justify-end`}>
            <Button
              onClick={() => {
                volverFormularioAnterior();
              }}
              variant="contained"
              className={buttonClases.redButton}>
              Atras
            </Button>
          </div>
          <div className={`${formularioIndex !== 3 ? "flex" : "hidden"} justify-end`}>
            <Button
              onClick={() => {
                pasarSiguienteFormulario();
              }}
              disabled={!isValid}
              variant="contained"
              className={buttonClases.blueButtonTickets}>
              Siguiente
            </Button>
          </div>
          <div className={`${formularioIndex === 3 ? "flex" : "hidden"} justify-end`}>
            <Button
              type="submit"
              disabled={!isValid || estadoSeleccionado === 0}
              variant="contained"
              className={buttonClases.blueButtonTickets}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
      <ModalCompoment
        setOpenPopup={setOpenModalNuevoEmbarque}
        openPopup={openModalNuevoEmbarque}
        title="Crear Nuevo Embarque">
        <AgregarEditarEmbarqueModal openModal={openModalNuevoEmbarque} setOpenModal={setOpenModalNuevoEmbarque} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAsignarEmbarque}
        openPopup={openModalAsignarEmbarque}
        title="Asignar Embarques">
        <AsignarEmbarquesPlanProdModal
          controlFather={control}
          setValuesFather={setValue}
          watchFather={watch}
          openModal={openModalAsignarEmbarque}
          setOpenModal={setOpenModalAsignarEmbarque}
        />
      </ModalCompoment>
    </>
  );
};
