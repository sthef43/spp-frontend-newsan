/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { IAuditRegistry } from "app/models/IAuditRegistry";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IAudit } from "app/models/IAudit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import classNames from "classnames";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  StepContent,
  StepLabel,
  TextField,
  Theme,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { IAppUser } from "app/models/IAppUser";
import CircularProgress from "@mui/material/CircularProgress";
import produce from "immer";
import { Select } from "@mui/material";
import { IAuditRegistryResult } from "app/models/IAuditRegistryResult";
import { Step } from "@mui/material";
import { Stepper } from "@mui/material";
import { StepConnector } from "@mui/material";
import { AuditTypeMatcher } from "app/features/audit/modules/global/components/AuditTypeMatcher";
import { IAuditBloq } from "app/models/IAuditBloq";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useHistory, useParams } from "react-router-dom";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { AudithAutocomplete } from "app/features/audit/modules/global/components/AudithAutocomplete";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { TodoSliceRequests } from "app/features/audit/slices/TodoSlice";
import { AuditPerformPrint } from "../components/AuditPerformPrint";
import { UploadMultipleImage } from "app/shared/helpers/UploadMultipleImage";
import { IAuditHistorico } from "app/models/IAuditHistorico";
import { IAuditValoresResult } from "app/models/IAuditValoresResult";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { AuditImagenesHistoricoSliceRequest } from "app/features/audit/slices/AuditImagenesHistoricoSlice";
import { AuditRegistryImageSliceRequests } from "app/features/audit/slices/AuditRegistryImageSlice";
import { AuditRegistrySliceRequests } from "app/features/audit/slices/AuditRegistrySlice";
import { AuditHistoricoSliceRequest } from "app/features/audit/slices/AuditResultSlice";
import { AuditSliceRequests } from "app/features/audit/slices/AuditSlice";
import { AuditValoresResultSliceRequest } from "app/features/audit/slices/AuditValoresResultSlice";
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    padding: 0,
    margin: 0
  },
  [`&.Mui-active`]: {
    marginLeft: 12
  }
}));

const sxStyles = {
  root: { padding: 1 },
  rootStrepper: { margin: 0, padding: 0 },
  button: { mt: 1, mr: 1 },
  resetContainer: { p: 3 },
  InputInfo: {
    width: "100%",
    height: "100%",
    "& .MuiInputBase-root": {
      height: "100%",
      padding: "18.5px 14px"
    },
    "& .MuiInputBase-root.Mui-disabled": {
      fontWeight: "500",
      color: "text.primary",
      WebkitTextFillColor: "text.primary"
    }
  },
  InputInfoSelector: {
    width: "100%",
    height: "100%",
    "& .MuiInputBase-root": {
      height: "100%"
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, 0px) scale(0.75)"
    },
    "& .MuiInputBase-root.Mui-disabled": {
      fontWeight: "500",
      color: "text.primary",
      WebkitTextFillColor: "text.primary"
    }
  }
};

export default function AuditPerform() {
  const InfoAppUser: IAppUser = useAppSelector((state) => state.appUser.data as any);

  const params: any = useParams();
  const fecha = moment().format("L");
  const history = useHistory();
  const dispatch = useAppDispatch();
  const initialState: IAuditRegistry = {
    operatorId: 5,
    turnoId: undefined,
    plantId: undefined,
    auditRegistryResult: [],
    codigo: "",
    auditId: undefined,
    todoId: params.todoId || 0
  };

  const buttonClasses = MaterialButtons();
  const [activeStep, setActiveStep] = React.useState(0);
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();

  const [expanded, setExpanded] = React.useState<number | false>(0);
  const [edit, setedit] = useState(false);
  const [AuditForm, setAuditForm] = useState(initialState);
  const [numberOfInputsToRender, setNumberOfInputsToRender] = useState(0);
  const [image, setImage] = useState<Array<{ id: number; image: any }>>([]);
  const [listaImages, setListaImages] = useState<Array<{ idBloq: number; file: File }>>([]);

  const handleChange = (panel: number) => (event, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  //me traigo la auditoria a realizar
  const { State: audit, setState: setLista } = useFetchApi<IAudit>(AuditSliceRequests.getByIdRequest, params.id);
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const onInit = async () => {
    TitleChanger("Realizar auditoría");
    if (params.registryId) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const resultado = unwrapResult(await dispatch(AuditRegistrySliceRequests.getByIdRequest(params.registryId)));
        if (resultado) {
          setedit(true);
          setAuditForm(resultado);
        }
        if (params.todoId) {
          const todo = unwrapResult(await dispatch(TodoSliceRequests.getByIdRequest(params.todoId)));
          setAuditForm(
            produce((draft) => {
              draft.lineaProduccionId = todo.lineaProduccionId;
              return draft;
            })
          );
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        openNotificationUI(error, "error");
      }
    }
  };

  useEffect(() => {
    onInit();
  }, []);

  //const addAllInfo = () => {};
  useEffect(() => {
    if (audit && AuditForm?.auditRegistryResult?.length === 0) {
      setAuditForm(
        produce((draft) => {
          draft.auditId = audit.id;
          draft.plantId = audit.plantId;
          audit.auditBloq?.map((bloqElement, index) => {
            bloqElement?.bloq?.itemBloq?.map((ItemElement, x) => {
              const nuevoItem: IAuditRegistryResult = {
                itemBloqId: ItemElement.id,
                valorId: 0,
                comentario: ""
              };
              draft.auditRegistryResult.push(nuevoItem);
            });
          });
        })
      );
    }
  }, [audit]);

  useEffect(() => {
    if (InfoAppUser) {
      console.log(InfoAppUser);
      setAuditForm(
        produce((draft) => {
          draft.operatorId = InfoAppUser.operatorId;
          draft.turnoId = InfoAppUser.operator.turnoId;
          return draft;
        })
      );
    }
  }, [InfoAppUser]);

  const changeComentario = (e: any, item: number) => {
    setAuditForm(
      produce((draft) => {
        const encontrado = draft.auditRegistryResult.find((x) => x.itemBloqId == item);
        encontrado[e.target.name] = e.target.value;
      })
    );
  };

  const codigoChanger = (e) => {
    setAuditForm(
      produce((draft) => {
        draft.codigo = e;
      })
    );
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    let resultado;
    const listadoFiles = listaImages.flatMap((elementos) => elementos.file);
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando Informacion"));
    try {
      resultado = unwrapResult(await dispatch(AuditRegistrySliceRequests.PostRequest(AuditForm)));
    } catch (e) {
      resultado = null;
    }
    if (resultado) {
      const newImageArray = image?.map((i) => {
        return { auditRegistryId: resultado.id, file: i.image, auditBloqId: i.id };
      });
      if (newImageArray?.length > 0) {
        await dispatch(AuditRegistryImageSliceRequests.uploadMultipleImageRequest(newImageArray));
      }
      const auditResult = generarAuditAndValueResult();
      const response = unwrapResult(await dispatch(AuditHistoricoSliceRequest.PostRequest(auditResult)));
      if (response) {
        const auditValueResultList = generateAuditValueResult(response.id);
        const listadoImagenes = {
          auditHistoricoId: response.id,
          listaImagenes: listadoFiles
        };
        console.log(listadoImagenes);
        await dispatch(AuditValoresResultSliceRequest.multiPostRequest(auditValueResultList));
        await dispatch(EmailSliceRequest.EmailProductoTerminado(resultado.id));
        //await dispatch(EmailSliceRequest.EmailAuditoria(resultado.id));
        if (listadoImagenes.listaImagenes.length > 0) {
          await dispatch(AuditImagenesHistoricoSliceRequest.UploadMultiImages(listadoImagenes));
        }
      }
      openNotificationUI("Muestra de auditoria Realizada con exito", "success");
      history.push("/main/auditoria/auditorias-para-realizar");
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const findValue = (target: string, item: number) => {
    const encontrado = AuditForm.auditRegistryResult.find((x) => x.itemBloqId == item);
    return encontrado?.[target] || null;
  };

  const whatClassNameUse = (num: number) => {
    switch (num) {
      case 1:
        return "";
      case 2:
        return "bg-yellow-400 text-gray-900";
      case 3:
        return "bg-red-700 text-gray-100";
      default:
        return "";
    }
  };

  const checkCorrectForm = (bloqElement: IAuditBloq) => {
    let finder = false;
    bloqElement?.bloq?.itemBloq?.map((ItemElement, x) => {
      const elemento = AuditForm?.auditRegistryResult?.find((f) => f.itemBloqId == ItemElement.id);
      if (elemento?.valorId === 0) {
        finder = true;
      }
    });
    return finder;
  };

  const generarAuditAndValueResult = () => {
    const approvalPercentage = generateIndexOfAprobate();
    const auditResult: IAuditHistorico = {
      nombre: audit.name,
      numeroRegistro: audit.numberRegistry,
      nombreTipoAuditoria: audit.auditType.name,
      tipoMuestra: audit.auditType.auditTable.name,
      codigo: AuditForm.codigo,
      operatorId: InfoAppUser.operatorId,
      rolId: audit.rolId,
      plantId: audit.plantId,
      lineaProduccionId: AuditForm.lineaProduccionId,
      indiceAprobacion: approvalPercentage
    };
    return auditResult;
  };

  const generateAuditValueResult = (auditHistoricoId: number) => {
    const allItems = audit.auditBloq.flatMap((elementos) => elementos.bloq.itemBloq);
    const auditValueResultList = AuditForm.auditRegistryResult.map((elementos, index) => {
      const findBloq = allItems.map((elementos) => audit.auditBloq.find((bloq) => bloq.bloqId == elementos.bloqId));
      const valorEncontrado = audit.auditType.lista.listaValores.find((value) => value.valorId == elementos.valorId);
      const indexBloque = allItems.map((elementos) =>
        audit.auditBloq.findIndex((index) => index.bloqId == elementos.bloqId)
      );
      const bloqItem = allItems.find((bloqFind) => bloqFind.id == elementos.itemBloqId);

      const auditResult: IAuditValoresResult = {
        nombreValor: valorEncontrado.valor.name,
        descripcion: valorEncontrado.valor.descripcion,
        flagCriterio: valorEncontrado.valor.flagCriterio,
        flagEmail: valorEncontrado.valor.flagMail,
        nombreLista: audit.auditType.lista.name,
        descripcionLista: audit.auditType.lista.descripcion,
        nivelItemCodigo: bloqItem.item.nivelItem.codigo,
        nivelItemNombre: bloqItem.item.nivelItem.name,
        nombreItem: bloqItem.item.name,
        auditHistoricoId: auditHistoricoId,
        comentario: elementos.comentario,
        numeroBloque: indexBloque[index] + 1,
        nombreBloque: findBloq[index].bloq.name
      };
      return auditResult;
    });
    return auditValueResultList;
  };

  const generateIndexOfAprobate = () => {
    let valuesAprobe = 0;
    const totalItems = audit.auditBloq.flatMap((elementos) => elementos.bloq.itemBloq).length;
    AuditForm.auditRegistryResult.forEach((elementos) => {
      const valueFinded = audit.auditType.lista.listaValores.find(
        (valueFind) => valueFind.valorId == elementos.valorId
      );
      if (valueFinded.valor.flagCriterio == true) {
        valuesAprobe += 1;
      }
    });
    const approvalPercentage: number = (valuesAprobe / totalItems) * 100;
    return approvalPercentage;
  };

  useEffect(() => {
    audit && setNumberOfInputsToRender(audit.auditBloq.length);
  }, [audit]);

  useEffect(() => {
    fileInputRefs.current = fileInputRefs.current.slice(0, numberOfInputsToRender);
  }, [numberOfInputsToRender]);

  return (
    <div className="p-1 sm:px-2 relative">
      <div className="grid sm:grid-cols-2 grid-col-1 px-2 gap-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="flex items-center gap-4">
          <div>Fecha </div>
          <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">{fecha}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>Auditor </div>
          <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">
            {!InfoAppUser ? (
              <CircularProgress color="secondary" />
            ) : (
              `${InfoAppUser?.operator?.name} ${InfoAppUser?.operator?.surname}`
            )}
          </div>
        </div>
      </div>
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="text-center text-xl font-bold"> Valores </div>
        <div className="sm:flex items-center justify-around w-full font-semibold">
          {audit?.auditType?.lista?.listaValores &&
            audit?.auditType?.lista?.listaValores.map((x) => (
              <div key={x.id} className="text-center sm:text-left">
                <span>{x.valor.name} : </span>
                <span>{x.valor.descripcion}</span>
              </div>
            ))}
        </div>
      </div>
      {audit?.auditType?.auditTableId && audit?.id != 33 && (
        <AuditTypeMatcher
          codigoChanger={codigoChanger}
          codigo={AuditForm?.codigo}
          auditTableId={audit?.auditType?.auditTableId}
        />
      )}
      {audit?.id == 33 && (
        <AudithAutocomplete
          auditTableId={audit?.auditType?.auditTableId}
          codigoChanger={codigoChanger}
          codigo={AuditForm?.codigo}
        />
      )}
      {audit?.auditBloq && (
        <div className="w-full px-0 sm:px-2">
          <div className="not-print-container">
            <Stepper sx={sxStyles.root} activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
              {audit.auditBloq?.map((bloqElement, index) => (
                <Step key={bloqElement.id}>
                  <StepLabel>
                    <div>
                      {index + 1} {bloqElement.bloq.name}
                    </div>
                  </StepLabel>
                  <StepContent sx={sxStyles.rootStrepper}>
                    <div className="md:flex md:flex-row mx-3 m-auto">
                      {bloqElement?.imagen != "sinImagen" && (
                        <div className="col-span-2 flex justify-center flex-col gap-2 items-center">
                          <TitleUIComponent title="Imagen de ejemplo" classNameTitle="text-base" />
                          <div className="border-2  mb-3 rounded-lg overflow-hidden border-red-400 md:transform translate-y-50  hover:scale-125  md:hover:translate-x-56 z-10 md:hover:scale-200 transition duration-1000">
                            <img
                              style={{ maxHeight: "30vh", width: "auto", height: "100%" }}
                              src={`${import.meta.env.BASE_URL}imagenes/auditBloq/${bloqElement?.imagen}`}
                            />
                          </div>
                        </div>
                      )}
                      <div className="m-auto">
                        <div className="hidden sm:grid pr-2 pl-14 grid-cols-16 font-bold w-full text-center text-lg ">
                          <div
                            className={classNames(
                              "col-span-1 border-2 text-center border-gray-700 dark:border-gray-200"
                            )}>
                            Num
                          </div>
                          <div className="col-span-8 border-2 border-gray-700 dark:border-gray-200">Item</div>
                          <div className="col-span-5 border-2 border-gray-700 dark:border-gray-200">Comentario</div>
                          <div className="col-span-2 border-2 border-gray-700 dark:border-gray-200">Valor</div>
                        </div>
                        <div className="w-full p-2 mx-2 flex relative text-lg font-medium">
                          <div
                            className=" border-red-500 text-center border-2 py-3 rounded-2xl shadow-elevation-6 transform  rotate-180"
                            style={{
                              //textOrientation: "sideways-right",
                              writingMode: "vertical-lr"
                            }}>
                            <span>{bloqElement.bloq.name}</span>
                          </div>
                          <div className="w-full px-2">
                            {bloqElement?.bloq?.itemBloq?.map((ItemElement, x) => (
                              <div
                                className="grid grid-col-1 sm:grid-cols-16 w-full text-lg my-2 sm:my-1 gap-2"
                                key={ItemElement.id}>
                                <div
                                  className={classNames(
                                    "sm:col-span-1 border-2 text-center flex items-center justify-center border-gray-700 dark:border-gray-200 sm:px-2 rounded-lg",
                                    whatClassNameUse(ItemElement.item?.nivelItem?.id)
                                  )}>
                                  {index + 1}.{x}
                                </div>
                                <div className="sm:col-span-8 border-2  flex items-center justify-start sm:px-4  border-gray-700 dark:border-gray-200 rounded-lg p-2">{`${ItemElement.item?.name}`}</div>
                                <div className="sm:col-span-5 border-2 border-gray-700 dark:border-gray-200 rounded-lg">
                                  <TextField
                                    type="text"
                                    multiline
                                    sx={sxStyles.InputInfo}
                                    size="medium"
                                    name="comentario"
                                    disabled={edit}
                                    placeholder="Comentario"
                                    value={findValue("comentario", ItemElement.id) || null}
                                    onChange={(e) => {
                                      changeComentario(e, ItemElement.id);
                                    }}
                                    variant="standard"
                                  />
                                </div>
                                <div className="sm:col-span-2 border-2 border-gray-700 dark:border-gray-200 rounded-lg">
                                  <FormControl sx={sxStyles.InputInfoSelector} fullWidth variant="outlined">
                                    <InputLabel shrink={edit}>Valor</InputLabel>
                                    <Select
                                      name="valorId"
                                      disabled={edit}
                                      defaultValue={null}
                                      value={findValue("valorId", ItemElement.id) || null}
                                      onChange={(e) => {
                                        changeComentario(e, ItemElement.id);
                                      }}
                                      variant="standard">
                                      {audit?.auditType?.lista?.listaValores &&
                                        audit?.auditType?.lista?.listaValores.map((x) => (
                                          <MenuItem key={x.id} value={x.valor.id}>
                                            <div className="w-full text-center">
                                              <div className="text-base">{x.valor.name}</div>
                                            </div>
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                            ))}
                            <div>
                              <div className="border-2 border-gray-700 dark:border-gray-200 rounded-lg m-auto p-3">
                                <FormControl sx={sxStyles.InputInfoSelector} fullWidth variant="outlined">
                                  <UploadMultipleImage
                                    listaImages={listaImages}
                                    setListaImags={setListaImages}
                                    id={bloqElement.id}
                                    setImage={setImage}
                                    image={image}
                                    edit={edit}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                      <div>
                        <Button disabled={activeStep === 0} onClick={handleBack} sx={sxStyles.button}>
                          volver
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className={buttonClasses.blueButton}
                          onClick={handleNext}
                          disabled={checkCorrectForm(bloqElement)}>
                          {"Siguiente"}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
      )}
      {activeStep === audit?.auditBloq?.length && (
        <Paper square elevation={0} sx={sxStyles.resetContainer}>
          <Typography textAlign="center">Auditoria Completada solo le falta guardar!</Typography>
          <div className="flex gap-4 w-full justify-center mt-4">
            <Button onClick={handleBack} className={buttonClasses.blueButton}>
              volver
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={edit}
              className={buttonClasses.blueButton}
              variant="contained"
              color="primary">
              Guardar
            </Button>
          </div>
        </Paper>
      )}
      <div className="print-container">
        <AuditPerformPrint
          array={audit?.auditBloq}
          audit={audit}
          changeComentarioP={changeComentario}
          findValueP={findValue}
        />
      </div>
    </div>
  );
}
