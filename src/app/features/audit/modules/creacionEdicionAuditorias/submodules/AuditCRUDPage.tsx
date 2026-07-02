import React, { useState, useEffect, useCallback } from "react";
import { IAudit } from "app/models/IAudit";
import { ArrAuditBloqSelector } from "app/features/audit/modules/creacionEdicionAuditorias/submodules/AuditListaValores";
import { AuditTypeSelector } from "app/features/audit/modules/creacionEdicionAuditorias/submodules/AuditTypeSelector";
import { IAuditType } from "app/models/IAuditType";
import produce from "immer";
import { CSSTransition } from "react-transition-group";
import { Button, colors, Step, StepConnector, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IAuditBloq } from "app/models/IAuditBloq";
import { AuditNameAndInfo } from "app/features/auditorias/modules/components/reporteAuditoria/AuditNameInfoAndGroup";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useHistory, useParams } from "react-router-dom";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IAuditMail } from "app/models/IAuditMail";
import clsx from "clsx";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IListaValores } from "app/models";
import { AuditBloqSliceRequests } from "app/features/audit/slices/AuditBloqSlice";
import { AuditSliceRequests } from "app/features/audit/slices/AuditSlice";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-alternativeLabel`]: {
    top: 22
  },
  [`&.Mui-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)"
    }
  },
  [`&.Mui-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)"
    }
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1
  }
}));

const ColorlibStepIconRoot = styled("div")<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage: "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
    }),
    ...(ownerState.completed && {
      backgroundImage: "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)"
    })
  })
);

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ active, completed }} className={className}>
      {props.icon}
    </ColorlibStepIconRoot>
  );
}

export const AuditCRUDPage = (): JSX.Element => {
  const Rol = useAppSelector((state) => state.appUser.data as any).permisos.rol;
  const planta = useAppSelector((state) => state.plant.object);
  const auditDefault: IAudit = {
    deleted: false,
    name: "",
    auditType: { id: 1, name: "" },
    auditMail: [],
    groupOfEmails: "",
    auditBloq: [],
    rolId: Rol.id,
    plantId: planta.id,
    numberRegistry: "",
    auditTypeId: 0
  };
  const params: any = useParams();

  const buttonClasses = MaterialButtons();
  const history = useHistory();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [AuditState, setAuditState] = useState<IAudit>(null);
  const [caseState, setCaseState] = useState([true, false, false, false, false, false]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [edit, setedit] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCaseState(
      produce((draft) => {
        draft.map((x, index) => (draft[index] = false));
      })
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCaseState(
      produce((draft) => {
        draft.map((x, index) => (draft[index] = false));
      })
    );
  };

  const { TitleChanger } = useTitleOfApp();
  const onInit = async () => {
    let result;
    try {
      result = unwrapResult(await dispatch(AuditSliceRequests.getByIdRequest(params?.id)));
    } catch (e) {
      result = null;
    }
    if (result) {
      setAuditState(result);
    } else {
      setAuditState(auditDefault);
    }
  };
  useEffect(() => {
    if (params?.id > 0) setedit(true);
    onInit();
  }, []);
  const callbackInfoAndRegistry = useCallback(
    (info: { name: string; numberRegistry: string }, groupOfEmails: string) => {
      setAuditState(
        produce((state) => {
          state.name = info.name;
          state.numberRegistry = info.numberRegistry;
          state.groupOfEmails = groupOfEmails;
        })
      );
    },
    []
  );
  const callbackEmail = (auditMail: IAuditMail[]) => {
    setAuditState(
      produce((state) => {
        state.auditMail = auditMail;
      })
    );
  };
  const callbackValores = (valores: IListaValores[]) => {
    setAuditState(
      produce((state) => {
        state.auditType.lista.listaValores = valores;
      })
    );
  };
  const handleClick = useCallback((auditType: IAuditType) => {
    setAuditState(
      produce((state) => {
        state.auditType = auditType;
        state.auditTypeId = auditType.id;
      })
    );
  }, []);
  const handleBloqItem = useCallback((auditBloq: IAuditBloq[]) => {
    const selectedAuditType: IAuditBloq[] = JSON.parse(JSON.stringify(auditBloq));
    setAuditState(
      produce((state) => {
        state.auditBloq = selectedAuditType;
      })
    );
  }, []);

  const renderSwitchExit = (int: number) => {
    setCaseState(
      produce((state) => {
        state[int] = true;
      })
    );
  };
  const nextFunction = (index: number) => {
    switch (index) {
      case 0:
        return AuditState?.name?.length > 2 && AuditState?.numberRegistry?.length > 2;

      case 1:
        return AuditState?.auditType?.lista ? true : false;

      case 2:
        return AuditState?.auditBloq?.length > 0 ? true : false;
      default:
        return true;
    }
  };
  const finalizar = async () => {
    let auditToSend: IAudit = JSON.parse(JSON.stringify(AuditState));

    //*** Arreglo para agregar todos los AuditBloq
    const arregloAuditBloq = [];
    auditToSend?.auditBloq.map((x) => {
      arregloAuditBloq.push(x);
      delete x?.audit;
      delete x?.bloq?.itemBloq;
    });

    try {
      if (edit) {
        //console.log("Esta editando");
        unwrapResult(await dispatch(AuditSliceRequests.PutRequest(auditToSend)));
        openNotificationUI("Auditoria finalizada", "success");
        history.push("/main/auditoria/table-of-audits");
      } else {
        //console.log("Esta agregando uno nuevo!!!!!!!!!!!!!!");
        delete auditToSend?.id;
        delete auditToSend?.auditMail;
        delete auditToSend?.auditType;
        delete auditToSend?.auditBloq; //Este hay que eliminar si o si.
        auditToSend = { ...auditToSend, emailGroupId: null };
        const resp = unwrapResult(await dispatch(AuditSliceRequests.PostRequest(auditToSend)));
        agregarAuditBlog(resp, arregloAuditBloq);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const agregarAuditBlog = async (idAudit, arregloAuditBloq) => {
    //console.log(idAudit); //el .id trae el id guardado en Audit.
    //console.log(arregloAuditBloq); //Arreglos de objets a impactar en AuditBloq.
    const nuevoAuditBloq = arregloAuditBloq?.map((x) => {
      return {
        imagen: x.imagen,
        bloqId: x.bloq.id,
        auditId: idAudit.id,
        rolId: idAudit.rolId
      };
    });
    //console.log(nuevoAuditBloq);
    try {
      unwrapResult(await dispatch(AuditBloqSliceRequests.multiPostRequest(nuevoAuditBloq)));
      openNotificationUI("Auditoria finalizada", "success");
      history.push("/main/auditoria/table-of-audits");
    } catch (error) {
      console.log(error);
      history.push("/main/auditoria/table-of-audits");
    }
  };

  useEffect(() => {
    TitleChanger("CREACIÓN DE NUEVA AUDITORÍA");
  }, []);
  return (
    <div>
      {AuditState && (
        <div className="mx-4 mt-2">
          <div>
            <TitleUIComponent
              title="Para la creacion de la auditoria se necesita realizar una serie de pasos"
              classNameTitle="text-base"
            />
            <div className="bg-secondaryNew shadow-elevation-4 rounded-lg flex justify-around px-4 items-center w-full gap-8">
              <Button
                color="primary"
                variant="contained"
                className={buttonClasses.blueButton}
                onClick={handleBack}
                disabled={activeStep <= 0}>
                atras
              </Button>

              <Stepper activeStep={activeStep} alternativeLabel className="w-full" connector={<ColorlibConnector />}>
                {[...Array(3)].map((x, index) => (
                  <Step key={index}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Button
                color="primary"
                variant="contained"
                className={buttonClasses.blueButton}
                onClick={() => {
                  activeStep == 2 ? finalizar() : handleNext();
                }}
                disabled={activeStep >= 3 || !nextFunction(activeStep)}>
                {activeStep < 2 ? "siguiente" : "Finalizar"}
              </Button>
            </div>
          </div>
          <CSSTransition
            in={caseState[0]}
            timeout={500}
            className="animate__animated"
            classNames={{
              enter: "animate__fadeInRight animate__superfaster",
              exit: "animate__fadeOutLeft animate__superfaster"
            }}
            unmountOnExit
            onExited={() => renderSwitchExit(activeStep)}>
            <div>
              <AuditNameAndInfo
                callback={callbackInfoAndRegistry}
                showButton={true}
                info={{ name: AuditState?.name, numberRegistry: AuditState?.numberRegistry }}
                selectedGroupOfEmails={AuditState?.groupOfEmails || ""}
              />
            </div>
          </CSSTransition>

          <CSSTransition
            in={caseState[1]}
            timeout={500}
            className="animate__animated"
            classNames={{
              enter: "animate__fadeInRight animate__superfaster",
              exit: "animate__fadeOutLeft animate__superfaster"
            }}
            unmountOnExit
            onExited={() => renderSwitchExit(activeStep)}>
            <div>
              <AuditTypeSelector
                AuditEmails={AuditState?.auditMail || []}
                callbackEmail={callbackEmail}
                callback={handleClick}
                showButton={true}
                AuditType={AuditState?.auditType || null}
                Valores={AuditState?.auditType.lista?.listaValores || null}
                callbackValores={callbackValores}
              />
            </div>
          </CSSTransition>

          <CSSTransition
            in={caseState[2]}
            timeout={500}
            className="animate__animated"
            classNames={{
              enter: "animate__fadeInRight animate__superfaster",
              exit: "animate__fadeOutLeft animate__superfaster"
            }}
            unmountOnExit
            onExited={() => renderSwitchExit(activeStep)}>
            <div>
              <ArrAuditBloqSelector
                callback={handleBloqItem}
                showButton={true}
                ArrAuditBloq={AuditState?.auditBloq || null}
              />
            </div>
          </CSSTransition>
        </div>
      )}
    </div>
  );
};
