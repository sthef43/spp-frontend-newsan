/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { StepperAuditorias } from "../components/creacionAuditorias/StepperAuditorias";
import { valuesDefaultStepper } from "../../models/utils/ValuesDefaultStepper";
import { LayoutCrudCreacionAuditoria } from "../layouts/LayoutCrudCreacionAuditoria";
import { AuditoriaEditDTO, AuditoriaEntidadesDTO } from "../../models/DTO/AuditoriaEntidadesDTO";
import { IAuditoria } from "../../models/IAuditoria";
import { IAppUser } from "app/models";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IAuditoriaGrupoItemsResult } from "../../models/IAuditoriaGrupoItemsResult";
import { IAuditoriaItemsResult } from "../../models/IAuditoriaItemsResult";
import { AuditoriaSliceRequest } from "../../slices/AuditoriaSlice";
import { useHistory } from "react-router-dom";
import { IAuditoriaAsignada } from "../../models/IAuditoriaAsignada";
import { AuditoriaAsignadaSliceRequest } from "../../slices/AuditoriaAsignadaSlice";
import { IAuditoriaGrupoItems } from "../../models/IAuditoriaGrupoItems";
import { AuditoriaValoresResultSliceRequest } from "../../slices/AuditoriaValoresResult.slice";
import { auditoriasUISlice } from "../../slices/auditoriasUISlice";

const initialValues: valuesDefaultStepper[] = [
  {
    pasoActivo: 1,
    activo: true
  },
  {
    pasoActivo: 2,
    activo: false
  },
  {
    pasoActivo: 3,
    activo: false
  }
];

export const CrudCreacionAuditorias: React.FC = () => {
  const {
    control,
    reset,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const infoUser: IAppUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const {
    listaValores,
    listaValoresResult,
    bloques,
    listaValoresPadre,
    listaEmails,
    tipoAuditoriaId,
    modoEdicionGlobal,
    listaAuditoriasAsignadasGlobal,
    cantidadAuditoriasAfectadas
  } = useAppSelector((state) => state.auditoriasUI);
  const auditoria = useAppSelector((state) => state.auditoriaAsignada.data as IAuditoriaAsignada);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { TitleChanger } = useTitleOfApp();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const [arrayItems, setArrayItems] = useState<valuesDefaultStepper[]>(initialValues);
  const [pasoActivoNumber, setPasoActivoNumber] = useState<number>(1);

  const nextStepActive = (arrayItems: valuesDefaultStepper[]) => {
    const siguienteStep = arrayItems.find((elementos) => elementos.activo == false);
    if (siguienteStep) {
      siguienteStep.activo = true;
      setArrayItems([...arrayItems]);
      setPasoActivoNumber(siguienteStep.pasoActivo);
    }
  };

  const backStepActive = () => {
    const siguienteStep = arrayItems.filter((elementos) => elementos.activo == true);
    if (siguienteStep.length > 1) {
      siguienteStep[siguienteStep.length - 1].activo = false;
      setPasoActivoNumber(siguienteStep[siguienteStep.length - 1].pasoActivo - 1);
      setArrayItems([...arrayItems]);
    }
  };

  const handleBatchUpdate = async () => {
    const data = {} as any;
    const edicionAuditoriaDTO = generarAuditoriaConResultsParaEdicion(data);
    const updates = listaAuditoriasAsignadasGlobal.map(async (asignacion) => {
      const dtoActualizado: AuditoriaEditDTO = {
        ...edicionAuditoriaDTO,
        auditoriaAsignada: {
          ...edicionAuditoriaDTO.auditoriaAsignada,
          id: asignacion.id,
          auditoriaId: asignacion.auditoriaId
        }
      };
      return dispatch(AuditoriaAsignadaSliceRequest.updateAuditWithResults(dtoActualizado));
    });
    await Promise.all(updates);
    await dispatch(AuditoriaValoresResultSliceRequest.multiPutRequest(listaValoresResult));
    openNotificationUI(`Se actualizaron ${listaAuditoriasAsignadasGlobal.length} auditorías con éxito`, "success");
    dispatch(auditoriasUISlice.actions.setModoEdicionGlobal(false));
    dispatch(auditoriasUISlice.actions.setListaAuditoriasAsignadasGlobal([]));
    dispatch(auditoriasUISlice.actions.setCantidadAuditoriasAfectadas(0));
    history.push("/main/auditorias-v2/creacion-auditorias");
  };

  const onSubmit = async (data: any) => {
    let edicionAuditoriaDTO: AuditoriaEditDTO;
    let nuevaAuditoriaEntidadesDTO: AuditoriaEntidadesDTO;

    if (auditoria === null) {
      nuevaAuditoriaEntidadesDTO = generarAuditoriaConResults(data);
    } else {
      edicionAuditoriaDTO = generarAuditoriaConResultsParaEdicion(data);
    }
    if (auditoria !== null && modoEdicionGlobal && listaAuditoriasAsignadasGlobal.length > 0) {
      if (await getConfirmation("Edición Global", `Se actualizarán ${listaAuditoriasAsignadasGlobal.length} auditorías asignadas. ¿Desea continuar?`)) {
        await handleBatchUpdate();
      }
      return;
    }
    if (await getConfirmation("Crear Auditoria", "Desea crear la auditoria")) {
      if (auditoria === null) {
        FetchPost(AuditoriaSliceRequest.createAuditWithResults, nuevaAuditoriaEntidadesDTO, false, () => {
          openNotificationUI("Auditoria creada exitosamente", "success");
          history.push("/main/auditorias-v2/creacion-auditorias");
        });
      } else {
        FetchPut({
          consoleLog: false,
          modelPut: edicionAuditoriaDTO,
          sliceRequest: AuditoriaAsignadaSliceRequest.updateAuditWithResults,
          functionAdd: async () => {
            await dispatch(AuditoriaValoresResultSliceRequest.multiPutRequest(listaValoresResult));
            openNotificationUI("Se actualizo la auditoria con exito", "success");
            history.push("/main/auditorias-v2/realizar-auditorias");
          }
        });
      }
    }
  };

  const generarAuditoriaConResults = (data: any) => {
    const nuevaAuditoriaGeneral = generarAuditoria(data) as IAuditoria;
    const clonListaValoresPadre = { ...listaValoresPadre };
    const clonListaValores = [...listaValores];
    const clonBloques = [...(bloques as IAuditoriaGrupoItems[])];

    const grupoItemsResult: IAuditoriaGrupoItemsResult[] = clonBloques.map((bloque) => {
      const itemsClonados: IAuditoriaItemsResult[] = bloque.auditoriaGrupoItemsBloq.map((vínculo) => {
        const item = vínculo.auditoriaItems;
        return {
          nombre: item.nombre,
          descripcion: item.descripcion,
          auditoriaNivelItemId: item.auditoriaNivelItemId,
          auditoriaGrupoItemsResultId: 0,
          deleted: false
        };
      });
      return {
        nombre: bloque.nombre,
        descripcion: bloque.descripcion,
        urlArchivo: bloque.urlArchivo,
        auditoriaItemsResult: itemsClonados
      };
    });

    const clonNuevo = clonListaValores.map((elementos) => {
      const clonElementos = { ...elementos };
      delete clonElementos.auditoriaValoresListaBloq;
      delete clonElementos.id;
      return clonElementos;
    });

    delete clonListaValoresPadre.auditoriaTipos;
    delete clonListaValoresPadre.auditoriaValoresListaBloq;
    delete clonListaValoresPadre.id;

    const auditoriaEntidadesDTO: AuditoriaEntidadesDTO = {
      auditoria: nuevaAuditoriaGeneral,
      auditoriaValores: clonNuevo,
      auditoriaListaValores: clonListaValoresPadre,
      auditoriaGrupoItems: grupoItemsResult
    };
    return auditoriaEntidadesDTO;
  };

  const generarAuditoriaConResultsParaEdicion = (data: any) => {
    const nuevaAuditoriaGeneral = generarAuditoria(data) as IAuditoriaAsignada;

    const clonListaValoresPadre = { ...listaValoresPadre };
    const clonListaValores = [...listaValoresResult];
    const clonBloques = [...(bloques as IAuditoriaGrupoItemsResult[])].filter((item) => item.auditoriaId !== null);

    const grupoItemsResult: IAuditoriaGrupoItemsResult[] = clonBloques.map((bloque: any) => {
      const itemsClonados: IAuditoriaItemsResult[] = bloque.auditoriaGrupoItemsBloq.map((item) => {
        return {
          nombre: item.auditoriaItems.nombre,
          descripcion: item.auditoriaItems.descripcion,
          auditoriaNivelItemId: item.auditoriaItems.auditoriaNivelItemId,
          auditoriaGrupoItemsResultId: 0,
          deleted: false
        };
      });
      return {
        id: bloque.id,
        nombre: bloque.nombre,
        descripcion: bloque.descripcion,
        urlArchivo: bloque.urlArchivo,
        auditoriaItemsResult: itemsClonados,
        auditoriaAsignadaId: auditoria.id
      };
    });

    delete clonListaValoresPadre.auditoriaTipos;
    delete clonListaValoresPadre.auditoriaValoresListaBloq;

    const auditoriaEntidadesDTO: AuditoriaEditDTO = {
      auditoriaAsignada: nuevaAuditoriaGeneral,
      auditoriaValores: clonListaValores,
      auditoriaGrupoItems: grupoItemsResult
    };
    return auditoriaEntidadesDTO;
  };

  const generarAuditoria = (data): IAuditoria | IAuditoriaAsignada => {
    const { nombreAuditoria, tipoAuditoria, numeroRegistro } = data;
    const nuevaAuditoria: IAuditoria | IAuditoriaAsignada = {
      nombre: nombreAuditoria,
      auditoriaTiposId: tipoAuditoriaId,
      numeroRegistro: numeroRegistro,
      rolId: infoUser.permisos.rolId,
      plantId: infoUser.operator.plantaId,
      auditoriaMailGroup: listaEmails,
      auditoriaId: auditoria ? auditoria.id : 0 //Uso este id para simular la edicion de la auditoria asignada
    };
    return nuevaAuditoria;
  };

  useEffect(() => {
    TitleChanger("Creacion de Auditorias");
    const arrayFormateado = initialValues.map((item, index) => {
      return {
        ...item,
        activo: index !== 0 ? false : true
      };
    });
    setArrayItems(arrayFormateado);
    setPasoActivoNumber(1);
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 w-full flex flex-row justify-center">
          <StepperAuditorias
            submitForm={handleSubmit(onSubmit)}
            disabledButtonNext={!isValid}
            arrayItems={arrayItems}
            nextStepActive={nextStepActive}
            backStepActive={backStepActive}
            pasoActivo={pasoActivoNumber}
          />
        </div>
        <LayoutCrudCreacionAuditoria
          triggerFather={trigger}
          controlFather={control}
          setValuesFather={setValue}
          resetFather={reset}
          errosFather={errors}
          pasoActivo={pasoActivoNumber}
          modoEdicionGlobal={modoEdicionGlobal}
          cantidadAuditoriasAfectadas={cantidadAuditoriasAfectadas}
        />
      </form>
    </ContainerForPages>
  );
};
