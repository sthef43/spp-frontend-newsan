/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import {
  Button,
  keyframes,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  styled
} from "@mui/material";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";
import { Control, FieldErrors, useWatch } from "react-hook-form";
import { IAuditoriaValoresResult } from "../../../models/IAuditoriaValoresResult";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { FileUploadRounded, VisibilityRounded } from "@mui/icons-material";
import { valuesDefaultStepper } from "../../../models/utils/ValuesDefaultStepper";
import { IAuditoriaGrupoItemsHistorico } from "../../../models/IAuditoriaGrupoItemsHistorico";
import { useHistory } from "react-router-dom";
import { useFileChange } from "app/shared/hooks/useFileChange";
import { ButtonForFiles } from "app/shared/helpers/ButtonForFiles";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ExaminarImagenGenericModal } from "app/shared/helpers/ModalsGenerics/ExaminarImagenGenericModal";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

interface Props {
  listaBloqueItems: any;
  listaValores: IAuditoriaValoresResult[];
  controlPadre: Control;
  errorsPadre: FieldErrors;
  setValores: (valor: string | number) => void;
  valuesStepper: valuesDefaultStepper[];
  nextStepActive: (nextValue: valuesDefaultStepper[]) => void;
  backStepActive: () => void;
  functionSubmit: (data: any) => void;
  setListaUrlsProp: (listaUrls: ListaUrls[]) => void;
  tipoAuditoria: string;
  idAuditoriaAsignada: number;
}

interface ListaUrls {
  indexBloq: number;
  url: string | ArrayBuffer;
  file: File;
}

interface QontoStepIconPropsCustom extends StepIconProps {
  active?: boolean;
  completed?: boolean;
  direction: "next" | "back";
  shouldAnimate?: boolean;
  elemento: number;
}

const processBarCompletes = keyframes`
  0% { border-color: rgba(0, 128, 0, 0.5); }
  50% { border-color: rgba(0, 128, 0, 0.75); }
  100% { border-color: rgba(0, 128, 0, 1); }
`;

const QuontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      transition: "all .5s ease",
      borderColor: "#2264f99e"
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      animation: `${processBarCompletes} .5s ease`,
      borderColor: "green"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#bdbdbd",
    borderLeft: "3px solid #bdbdbd",
    borderRadius: 1,
    marginLeft: "3px"
  }
}));

const QontoStepIconRoot = styled("div")<{ ownerState: QontoStepIconPropsCustom }>(({ theme, ownerState }) => ({
  transition: "none",
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    fill: "#784af4",
    transition: "fill 0.4s ease"
  }),
  ...(ownerState.completed && {
    transition: "color 0.4s ease, background-color 0.4s ease, fill 0.4s ease"
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#ffffff",
    zIndex: 1,
    fontSize: "14px",
    backgroundColor: "green",
    padding: "6px 12px",
    borderRadius: "100%"
  },
  ...(ownerState.shouldAnimate && {
    "& .QontoStepIcon-completedIcon": {
      color: "#ffffff",
      zIndex: 1,
      fontSize: "14px",
      backgroundColor: "green",
      padding: "6px 12px",
      borderRadius: "100%"
    }
  }),
  "& .QontoStepIcon-IncompletedIcon": {
    color: "white",
    zIndex: 1,
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "100%",
    fill: "#2264f99e",
    backgroundColor: "#BDBDBD"
  }
}));

const QontoStepIcon = (props: QontoStepIconPropsCustom, direction: "next" | "back") => {
  const { active, completed, className, icon, shouldAnimate, elemento } = props;
  return (
    <QontoStepIconRoot ownerState={{ active, direction, icon, shouldAnimate, elemento }} className={className}>
      {completed ? (
        <p className="QontoStepIcon-completedIcon">{elemento}</p>
      ) : (
        <p className="QontoStepIcon-IncompletedIcon">{elemento}</p>
      )}
    </QontoStepIconRoot>
  );
};

export const StteperForBloqItems: React.FC<Props> = ({
  listaBloqueItems,
  listaValores,
  controlPadre,
  errorsPadre,
  setValores,
  valuesStepper,
  nextStepActive,
  backStepActive,
  functionSubmit,
  tipoAuditoria,
  setListaUrlsProp,
  idAuditoriaAsignada
}) => {
  const formValues = useWatch({ control: controlPadre });

  const buttonClases = MaterialButtons();
  const history = useHistory();
  const { selectFileChange, selectFileChangeWitFunctionAdd } = useFileChange();

  const [archivos, setArchivos] = useState<File>();
  const [listaUrls, setListaUrls] = useState<ListaUrls[]>([]);
  const [urlImage, setUrlImage] = useState<string | ArrayBuffer>();
  const [comentariosObligatorios, setComentariosObligatorios] = useState({});

  const [indexBloq, setIndexBloq] = useState<number>(0);

  const [openModalExaminarImagen, setOpenModalExaminarImagen] = useState<boolean>(false);

  const [direccion, setDireccion] = useState<"next" | "back">("next");

  const activeStep = valuesStepper.findIndex((item) => !item.activo);

  const buscarFondoColor = (nombreEstado: string): string => {
    switch (nombreEstado) {
      case "Critico":
        return "bg-[#FF625B]";
      case "Mayor":
        return "bg-[#FFCF82]";
      case "Menor":
        return "bg-transparent border border-gray-300";
      default:
        return "bg-gray-500 border border-gray-300";
    }
  };

  // Función para validar si el bloque actual está completo
  const bloqueCompleto = (indexBloque: number) => {
    const itemsDelBloque = (listaBloqueItems as IAuditoriaGrupoItemsResult[])[indexBloque]?.auditoriaItemsResult || [];
    return itemsDelBloque.every((_, indexItem) => {
      const comentarioObligatorio = comentariosObligatorios[`bloque${indexBloque}.item${indexItem}`];

      const bloque = formValues[`bloque${indexBloque}`];
      const item = bloque?.[`item${indexItem}`];
      const comentario = comentarioObligatorio ? item?.comentario : "";
      const valor = item?.valor;
      return (
        (comentarioObligatorio && comentario && comentario.trim() !== "") ||
        (!comentarioObligatorio && valor !== undefined && valor !== null && valor !== "")
      );
    });
  };

  const handleSetUrlImage = (url: string | ArrayBuffer, file: File) => {
    const indexBloque = activeStep;
    const existe = listaUrls.some((item) => item.indexBloq === indexBloque);
    if (existe) {
      const nuevaLista = listaUrls.map((item) =>
        item.indexBloq === indexBloque ? { ...item, url: url, file: file } : item
      );
      setListaUrls(nuevaLista);
      setListaUrlsProp(nuevaLista);
    } else {
      setListaUrls([...listaUrls, { indexBloq: indexBloque, url: url, file: file }]);
      setListaUrlsProp([...listaUrls, { indexBloq: indexBloque, url: url, file: file }]);
    }
  };

  const handleOpenModalExaminarImagen = (indexBloq: number, soloLectura: boolean) => {
    if (!soloLectura) {
      const url = listaUrls.find((item) => item.indexBloq === indexBloq)?.url;
      if (url) {
        setUrlImage(url);
        setOpenModalExaminarImagen(true);
      }
    } else {
      const url = listaBloqueItems.find((item) => item.id == indexBloq);
      if (url) {
        setUrlImage(url.urlArchivo as string);
        setIndexBloq(indexBloq);
        setOpenModalExaminarImagen(true);
      }
    }
  };

  const handleVerificarObligatoriedad = (valorSeleccionado, indexBloque, indexItem) => {
    const findValor = listaValores.find((elementos) => elementos.id == valorSeleccionado);
    const esNoGood = findValor?.flagCriterio == true;
    const claveItem = `bloque${indexBloque}.item${indexItem}`;
    setComentariosObligatorios((prev) => ({
      ...prev,
      [claveItem]: esNoGood
    }));
  };

  return (
    <main className="w-full h-full mt-10">
      <Stepper activeStep={activeStep} connector={<QuontoConnector />} orientation="vertical">
        {listaBloqueItems.map((item, index) => {
          const completo = valuesStepper[index].activo;
          const mostrarAnimacion = completo && direccion === "next";
          const soloLectura = tipoAuditoria === "examinar" ? true : false;
          const itemsAMapear =
            item.auditoriaItemsHistorico && item.auditoriaItemsHistorico.length > 0
              ? item.auditoriaItemsHistorico
              : item.auditoriaItemsResult;
          return (
            <Step key={index} completed={completo}>
              <StepLabel
                StepIconComponent={(props) => (
                  <QontoStepIcon
                    {...props}
                    direction={direccion}
                    shouldAnimate={mostrarAnimacion}
                    elemento={valuesStepper[index].pasoActivo}
                  />
                )}
              />
              <StepContent
                sx={{
                  marginLeft: "15px",
                  borderLeft: "3px solid #bdbdbd"
                }}>
                <section className="w-full p-4 rounded-lg flex flex-row items-stretch gap-x-4">
                  <div className="border border-gray-300 flex items-center justify-center p-2 rounded-lg w-[3%]">
                    <p className="whitespace-nowrap -rotate-90 font-bold text-textColor text-xs uppercase tracking-widest">
                      {item.nombre}
                    </p>
                  </div>
                  <section className="w-full bg-secondaryNew flex flex-col p-4 rounded-md shadow-md">
                    <div className="w-full p-4 bg-secondaryNew shadow-xl rounded-lg">
                      <div className="bg-background rounded-xl p-4 border-[1px] shadow-lg border-[#bdbdbd]">
                        <div className="w-full flex flex-row justify-between text-center gap-x-2">
                          <p className="font-semibold border border-gray-300 p-2 w-[10%]">Num</p>
                          <p className="font-semibold border border-gray-300 p-2 w-[50%]">Item</p>
                          <p className="font-semibold border border-gray-300 p-2 w-[30%]">Comentario</p>
                          <p className="font-semibold border border-gray-300 p-2 w-[20%]">Valor</p>
                        </div>
                        <div className="flex flex-col gap-y-2 mt-2">
                          {itemsAMapear.map((itemsResult, indexItem) => {
                            const inputRequerido = comentariosObligatorios[`bloque${index}.item${indexItem}`];
                            return (
                              <div className="w-full flex flex-row justify-between gap-x-2" key={indexItem}>
                                <p
                                  className={`font-semibold p-2 w-[10%] flex justify-center items-center rounded-md ${buscarFondoColor(
                                    itemsResult.auditoriaNivelItem.nombre
                                  )}`}>
                                  {index + 1}.{indexItem + 1}
                                </p>
                                <p className="font-semibold border border-gray-300 p-2 w-[50%] flex justify-start items-center">
                                  {itemsResult.nombre}
                                </p>
                                <div className="w-[30%]">
                                  <TextFieldComponent
                                    control={controlPadre}
                                    index={index}
                                    nameInput={`bloque${index}.item${indexItem}.comentario`}
                                    valueDefault={soloLectura ? itemsResult.comentario : ""}
                                    labelInput="Comentario"
                                    requiredBool={inputRequerido}
                                    disabled={soloLectura}
                                    errors={errorsPadre}
                                  />
                                </div>
                                {soloLectura ? (
                                  <div className="w-[20%]">
                                    <TextFieldComponent
                                      control={controlPadre}
                                      index={index}
                                      nameInput={`bloque${index}.item${indexItem}.valorAsignado`}
                                      valueDefault={soloLectura ? itemsResult.valorAsignado : ""}
                                      labelInput="Valor"
                                      requiredBool={inputRequerido}
                                      disabled={soloLectura}
                                      errors={errorsPadre}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-[20%]">
                                    <SelectComponent
                                      control={controlPadre}
                                      ValueSave={(e) => {
                                        setValores(e);
                                        handleVerificarObligatoriedad(e, index, indexItem);
                                      }}
                                      inputLabel="Valor"
                                      listaObjetos={listaValores}
                                      nameSelect={`bloque${index}.item${indexItem}.valor`}
                                      defaultValue={soloLectura ? itemsResult.auditoriaNivelItemId : ""}
                                      valueKey={(item) => item}
                                      valueLabel={(item) => item.nombre}
                                      valueSelect={(item) => item.id}
                                      activeRequired
                                      disabled={soloLectura}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex flex-row items-center gap-x-2 w-full">
                          <ButtonForFiles
                            disabled={soloLectura}
                            buttonMui
                            variantButton="contained"
                            classNameButton={`${buttonClases.blueButton} w-full rounded-full`}
                            textButton="AGREGAR UNA IMAGEN"
                            functionFile={(e) =>
                              selectFileChangeWitFunctionAdd(e, setArchivos, setUrlImage, handleSetUrlImage)
                            }
                            stylesContainer="w-full">
                            <FileUploadRounded sx={{ marginLeft: "10px" }} />
                          </ButtonForFiles>
                          {listaUrls.some((item) => item.indexBloq === activeStep) ? (
                            <Button
                              onClick={() => handleOpenModalExaminarImagen(activeStep, false)}
                              className={`${buttonClases.blueButton} rounded-full min-w-[38px]`}>
                              <VisibilityRounded />
                            </Button>
                          ) : (
                            <>
                              {soloLectura &&
                                listaBloqueItems.some(
                                  (items) =>
                                    (items.urlArchivo.includes(".png") || items.urlArchivo.includes(".jpg")) &&
                                    items.id === item.id
                                ) && (
                                  <Button
                                    onClick={() => handleOpenModalExaminarImagen(item.id, true)}
                                    className={`${buttonClases.blueButton} rounded-full min-w-[38px]`}>
                                    <VisibilityRounded />
                                  </Button>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-end items-center gap-x-2">
                      <div className="w-1/3 flex flex-row justify-center items-center gap-x-2 mt-6 bg-secondaryNew shadow-lg p-4 rounded-md">
                        <Button
                          disabled={activeStep === 0}
                          type="button"
                          className={`${buttonClases.redButton} rounded-md w-full`}
                          onClick={() => {
                            backStepActive();
                            setDireccion("back");
                          }}>
                          Volver
                        </Button>
                        {soloLectura ? (
                          <Button
                            className={`${buttonClases.blueButton} rounded-md w-full`}
                            onClick={() => {
                              activeStep === valuesStepper.length - 1
                                ? history.push("/main/auditorias-v2/reporte-auditorias")
                                : nextStepActive(valuesStepper);
                            }}>
                            {activeStep === valuesStepper.length - 1 ? "Finalizar" : "Continuar"}
                          </Button>
                        ) : (
                          <Button
                            disabled={!bloqueCompleto(activeStep)}
                            className={`${buttonClases.blueButton} rounded-md w-full`}
                            onClick={() => {
                              activeStep === valuesStepper.length - 1
                                ? functionSubmit(formValues)
                                : nextStepActive(valuesStepper);
                              setDireccion("next");
                            }}>
                            {activeStep === valuesStepper.length - 1 ? "Finalizar" : "Continuar"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </section>
                </section>
              </StepContent>
            </Step>
          );
        })}
        <ModalCompoment
          setOpenPopup={setOpenModalExaminarImagen}
          openPopup={openModalExaminarImagen}
          title="Imagen cargada"
          showModalCenterPage
          titleModalStyle="Audit">
          <ExaminarImagenGenericModal
            styles="w-[65vw] flex items-center justify-center"
            optionCharge={tipoAuditoria == "examinar" ? "file" : "url"}
            file={
              tipoAuditoria === "examinar"
                ? `auditoria-historico/${idAuditoriaAsignada}/${indexBloq}/${urlImage}`
                : (urlImage as string)
            }
            openModal={openModalExaminarImagen}
            setOpenModal={setOpenModalExaminarImagen}
          />
        </ModalCompoment>
      </Stepper>
    </main>
  );
};
