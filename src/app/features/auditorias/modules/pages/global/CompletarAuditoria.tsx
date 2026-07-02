/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import FetchApi from "app/shared/helpers/FetchApi";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAppUser } from "app/models/IAppUser";
import { IAuditoriaListaValoresResult } from "../../../models/IAuditoriaListaValoresResult";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { StteperForBloqItems } from "../../components/realizarAuditorias/StteperForBloqItems";
import { IAuditoriaValoresResult } from "../../../models/IAuditoriaValoresResult";
import { valuesDefaultStepper } from "../../../models/utils/ValuesDefaultStepper";
import { AuditoriaAsignadaSliceRequest } from "../../../slices/AuditoriaAsignadaSlice";
import { IAuditoriaItemsHistorico } from "../../../models/IAuditoriaItemsHistorico";
import { IAuditoriasHistorico } from "../../../models/IAuditoriasHistorico";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AuditoriasHistoricoSliceRequest } from "../../../slices/AuditoriasHistoricoSlice";
import { AuditoriaGrupoItemsHistoricoSliceRequest } from "../../../slices/AuditoriaGrupoItemsHistoricoSlice";
import { IAuditoriaGrupoItemsHistorico } from "../../../models/IAuditoriaGrupoItemsHistorico";
import moment from "moment";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";

interface Params {
  id: string;
  estado: string;
}

interface ListaUrls {
  indexBloq: number;
  url: string | ArrayBuffer;
  file: File;
}

interface NuevasImagenes {
  auditoriaHistoricoId: number;
  idsGrupos: number[];
  listaArchivos: File[];
}

export const CompletarAuditoria: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);

  const params = useParams<Params>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const fechaActual = moment().format("YYYY-MM-DD HH:mm:ss");
  const { getConfirmation } = useConfirmationDialog();
  const { FetchPost } = useFetchApiMultiResults<
    IAuditoriasHistorico | IAuditoriaGrupoItemsHistorico[] | NuevasImagenes
  >();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const [auditResult, setAuditResult] = useState<IAuditoriaAsignada | IAuditoriasHistorico>();
  const [listaValores, setListaValores] = useState<IAuditoriaListaValoresResult>();
  const [valores, setValores] = useState<IAuditoriaValoresResult[]>([]);
  const [listaItems, setListaItems] = useState<IAuditoriaGrupoItemsResult[] | IAuditoriaGrupoItemsHistorico[]>([]);
  const [valuesStepper, setValuesStepper] = useState<valuesDefaultStepper[]>();
  const [listaUrls, setListaUrls] = useState<ListaUrls[]>([]);

  const [valoresSeleccionados, setValoresSeleccionados] = useState<string | number>(0);

  FetchApi<IAuditoriaAsignada>(
    AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById,
    params.id,
    false,
    params.estado === "realizar",
    setAuditResult,
    true,
    false,
    false,
    (response) => {
      setearValoresAndItems(response);
    },
    () => {
      history.push("/main/auditorias-v2/realizar-auditorias");
    }
  );

  FetchApi<IAuditoriasHistorico>(
    AuditoriasHistoricoSliceRequest.GetAuditById,
    params.id,
    false,
    params.estado === "examinar",
    setAuditResult,
    true,
    false,
    false,
    (response) => {
      setearValoresAndItemsHistorico(response);
    },
    () => {
      history.push("/main/auditorias-v2/reporte-auditorias");
    }
  );

  const onSubmit = async (data: any) => {
    const nuevaAuditoriaHistorico = generateAuditoriaHistorico(data);
    if (await getConfirmation("Completar Auditoria", "¿Estas seguro de completar la auditoria?")) {
      FetchPost(AuditoriasHistoricoSliceRequest.PostRequest, nuevaAuditoriaHistorico, false, async (response) => {
        const { nuevoGrupoItems } = generateGrupoItems(data, (response as IAuditoriasHistorico).id);
        FetchPost(
          AuditoriaGrupoItemsHistoricoSliceRequest.MultiPostReturnList,
          nuevoGrupoItems,
          false,
          async (responseGrupoHistorico) => {
            const { nuevasImagenes } = generateGrupoItems(
              data,
              (responseGrupoHistorico as IAuditoriasHistorico).id,
              (responseGrupoHistorico as IAuditoriaGrupoItemsHistorico[]).map((elementos) => elementos.id)
            );
            if (nuevasImagenes.listaArchivos.length > 0) {
              FetchPost(
                AuditoriaGrupoItemsHistoricoSliceRequest.MultiPostWithImages,
                {
                  auditoriaHistoricoId: (response as IAuditoriasHistorico).id,
                  idsGrupos: nuevasImagenes.idsGrupos,
                  listaArchivos: nuevasImagenes.listaArchivos
                },
                false
              );
            }
            await dispatch(EmailSliceRequest.SendMailAuditoriaNew((response as IAuditoriasHistorico).id));
            history.push("/main/auditorias-v2/realizar-auditorias");
            openNotificationUI("Auditoria completada exitosamente", "success");
          }
        );
      });
    }
  };

  const generateAuditoriaHistorico = (data: any) => {
    const ponderacionFinal = generarPonderacionFinal(data);
    const auditoriaHistorico: IAuditoriasHistorico = {
      operatorId: infoUser.operatorId,
      rolId: infoUser.permisos.rolId,
      subRolId: infoUser.permisos.subrolId,
      turnoId: infoUser.operator.turnoId,
      lineaProduccionId: auditResult.lineaProduccionId,
      auditoriaAsignadaId: Number(params.id),
      nombre: auditResult.nombre,
      numeroRegistro: auditResult.numeroRegistro,
      codigoProducto: data.codigoProducto,
      plantId: auditResult.plantId,
      estadoAuditoria: true,
      ponderacion: ponderacionFinal
    };
    return auditoriaHistorico;
  };

  const generarPonderacionFinal = (data: any) => {
    let itemsGood = 0;
    const listaValores = (auditResult as IAuditoriaAsignada).auditoria.auditoriaListaValoresResult
      .auditoriaValoresResult;
    const listaItemsHistorico = generarItemsHistorico(data);
    listaItemsHistorico.forEach((items) => {
      const valorItemGood = listaValores.find((valor) => valor.nombre == items.valorAsignado);
      if (valorItemGood.flagCriterio) {
        itemsGood++;
      }
    });
    const ponderacionFinal = (itemsGood / listaItemsHistorico.length) * 100;
    return Number(ponderacionFinal.toFixed(2));
  };

  const generateGrupoItems = (data: any, auditoriaAsignadaId: number, auditoriasHistoricoId?: number[]) => {
    const arrayItemsHistoricos = generarItemsHistorico(data);
    let listaArchivosFormateada = [];
    if (listaUrls && listaUrls.length > 0) {
      listaArchivosFormateada = listaItems.map((_, index) => {
        const archivoEncontrado = listaUrls.find((u) => u.indexBloq === index);
        if (archivoEncontrado && archivoEncontrado.file) {
          return archivoEncontrado.file;
        } else {
          return new File([""], `sin_archivo_${index}.txt`, { type: "text/plain" });
        }
      });
    }

    const arrayGrupoItems = listaItems.map((item, index) => {
      const nuevoGrupo = {
        nombre: item.nombre,
        descripcion: item.descripcion,
        urlArchivo: "",
        auditoriasHistoricoId: auditoriaAsignadaId,
        auditoriaItemsHistorico: arrayItemsHistoricos.filter((elementos) => elementos.idAgrupadorPorGrupos === item.id)
      };
      return nuevoGrupo;
    });
    const nuevasImagenes = {
      auditoriaHistoricoId: auditoriaAsignadaId,
      listaArchivos: listaArchivosFormateada,
      idsGrupos: auditoriasHistoricoId ? auditoriasHistoricoId : []
    };
    return {
      nuevoGrupoItems: arrayGrupoItems,
      nuevasImagenes: nuevasImagenes
    };
  };

  const generarItemsHistorico = (data: any) => {
    const arrayItems = separarItemsDeFormulario(data);
    const listadoItems = listaItems.flatMap((item) => item.auditoriaItemsResult);
    const itemsHistorico: IAuditoriaItemsHistorico[] = arrayItems.map((items, index) => {
      const nuevoItemHistorico: IAuditoriaItemsHistorico = {
        nombre: listadoItems[index].nombre,
        auditoriaGrupoItemsHistoricoId: 0,
        descripcion: listadoItems[index].descripcion,
        valorAsignado: valores.find((elementos) => elementos.id === items.valor)?.nombre,
        auditoriaNivelItemId: listadoItems[index].auditoriaNivelItemId,
        comentario: items.comentario,
        idAgrupadorPorGrupos: listadoItems[index].auditoriaGrupoItemsResultId,
        createdDate: moment().format("MM-DD-YYYY HH:mm:ss"),
        lastModifiedDate: moment().format("MM-DD-YYYY HH:mm:ss")
      };
      return nuevoItemHistorico;
    });
    return itemsHistorico;
  };

  const separarItemsDeFormulario = (data: any) => {
    const arrayItems = [];
    listaItems.forEach((elementos, index) => {
      const bloque = elementos.auditoriaItemsResult;
      const bloqueData = data[`bloque${index}`];
      bloque.forEach((_elementos, index) => {
        arrayItems.push(bloqueData[`item${index}`]);
      });
    });
    return arrayItems;
  };

  const nextStepActive = (arrayItems: valuesDefaultStepper[]) => {
    const siguienteStep = arrayItems.find((elementos) => elementos.activo == false);
    if (siguienteStep) {
      siguienteStep.activo = true;
      setValuesStepper([...arrayItems]);
    }
  };

  const backStepActive = () => {
    const siguienteStep = valuesStepper.filter((elementos) => elementos.activo == true);
    siguienteStep[siguienteStep.length - 1].activo = false;
    setValuesStepper([...valuesStepper]);
  };

  const setearValoresAndItems = (auditResult: IAuditoriaAsignada) => {
    const listaValores = auditResult.auditoriaListaValoresResult;
    const listaItems = auditResult.auditoriaGrupoItemsResult;
    const valores = auditResult.auditoriaListaValoresResult.auditoriaValoresResult;
    const initialValuesStepper = listaItems.map((item, index) => {
      return {
        pasoActivo: index + 1,
        activo: false
      };
    });
    setListaValores(listaValores);
    setListaItems(listaItems);
    setValores(valores);
    setValuesStepper(initialValuesStepper);
  };

  const setearValoresAndItemsHistorico = (auditResult: IAuditoriasHistorico) => {
    const listaValores = auditResult.auditoriaAsignada.auditoria.auditoriaListaValoresResult;
    const listaItems = auditResult.auditoriaGrupoItemsHistorico;
    const valores = auditResult.auditoriaAsignada.auditoria.auditoriaListaValoresResult.auditoriaValoresResult;
    const initialValuesStepper = listaItems.map((item, index) => {
      return {
        pasoActivo: index + 1,
        activo: false
      };
    });
    setListaValores(listaValores);
    setListaItems(listaItems);
    setValores(valores);
    setValuesStepper(initialValuesStepper);
  };

  const setearUrls = (urls: ListaUrls[]) => {
    setListaUrls(urls);
  };

  useEffect(() => {
    if (params.estado === "realizar") {
      TitleChanger("Completar Auditoría");
    } else {
      TitleChanger("Examinar Auditoría");
    }
  }, [params.estado]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {auditResult && valuesStepper && (
        <ContainerForPages optionsLayout="page" activeEffectVisible>
          <header>
            <ContainerForPages optionsLayout="Selects">
              <div className="flex flex-row justify-between w-full">
                <div className="w-full flex flex-col items-start justify-start p-4">
                  <p>
                    <span className="font-semibold">Nombre:</span> {auditResult.nombre}
                  </p>
                  <p>
                    <span className="font-semibold">Numero de Registro:</span> {auditResult.numeroRegistro}
                  </p>
                </div>
                <div className="w-full flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-400">Fecha</p>
                    <p className="text-base font-semibold">{fechaActual}</p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-400">Auditor</p>
                    <p className="text-base font-semibold">
                      {infoUser.operator.name} {infoUser.operator.surname}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-400">Linea</p>
                    <p className="text-base font-semibold">{auditResult.lineaProduccion.nombre}</p>
                  </div>
                </div>
              </div>
            </ContainerForPages>
          </header>
          <section className="flex flex-row justify-between mt-8">
            <div className="w-1/2 flex-row items-center gap-y-2">
              <h3 className="text-xl font-semibold">Valores</h3>
              <div className="flex flex-row w-full justify-start mt-2 gap-x-10">
                {listaValores &&
                  listaValores.auditoriaValoresResult.map((value) => (
                    <div
                      key={value.id}
                      className="px-3 py-2 flex flex-row items-center bg-secondaryNew gap-x-2 rounded-md shadow-md ">
                      <p className="font-semibold text-primaryNew text-lg">{value.nombre}:</p>
                      <p>{value.descripcion}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-1/2">
              <ContainerForPages optionsLayout="Selects">
                <TextFieldComponent
                  control={control}
                  index={0}
                  nameInput="codigoProducto"
                  labelInput="Ingresar Codigo de Producto"
                  valueDefault={
                    params.estado === "examinar" ? (auditResult as IAuditoriasHistorico).codigoProducto : ""
                  }
                  disabled={params.estado === "examinar"}
                  typeInput="standard"
                  estilosPersonalizados={{
                    "& .MuiInput-underline": {
                      "&::before": {
                        borderBottom: "none"
                      }
                    },
                    "& .MuiInputLabel-formControl": {
                      color: "green"
                    }
                  }}
                />
              </ContainerForPages>
            </div>
          </section>
          <StteperForBloqItems
            idAuditoriaAsignada={parseInt(params.id)}
            setListaUrlsProp={setearUrls}
            tipoAuditoria={params.estado}
            nextStepActive={nextStepActive}
            backStepActive={backStepActive}
            valuesStepper={valuesStepper}
            listaBloqueItems={listaItems}
            controlPadre={control}
            errorsPadre={errors}
            listaValores={valores}
            setValores={setValoresSeleccionados}
            functionSubmit={onSubmit}
          />
        </ContainerForPages>
      )}
    </form>
  );
};
