/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { Button, Step, StepConnector, StepIconProps, StepLabel, Stepper, stepConnectorClasses } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { valuesDefaultStepper } from "../../../models/utils/ValuesDefaultStepper";
import { ForwardRounded } from "@mui/icons-material";
import { useAppSelector } from "app/core/store/store";

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
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-40% + 20px)",
    right: "calc(60% + 20px)"
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      transition: "all .5s ease",
      borderColor: "#2264f99e",
      width: "90%"
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      animation: `${processBarCompletes} .5s ease`,
      borderColor: "green",
      width: "90%"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 10
  }
}));

const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

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
    fontSize: "22px",
    backgroundColor: "green",
    padding: ".5rem 1.2rem",
    borderRadius: "100%"
  },
  ...(ownerState.shouldAnimate && {
    "& .QontoStepIcon-completedIcon": {
      color: "#ffffff",
      zIndex: 1,
      fontSize: "22px",
      backgroundColor: "green",
      padding: ".5rem 1.2rem",
      borderRadius: "100%"
    }
  }),
  "& .QontoStepIcon-IncompletedIcon": {
    color: "white",
    zIndex: 1,
    fontSize: "22px",
    padding: ".5rem 1.2rem",
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

interface Props {
  arrayItems: valuesDefaultStepper[];
  disabledButtonNext: boolean;
  pasoActivo: number;
  nextStepActive: (nextValue: valuesDefaultStepper[]) => void;
  backStepActive: () => void;
  submitForm: () => void;
}

export const StepperAuditorias: React.FC<Props> = ({
  arrayItems,
  nextStepActive,
  backStepActive,
  disabledButtonNext,
  pasoActivo,
  submitForm
}) => {
  const { listaEmails, tipoAuditoriaId, listaValores, bloques } = useAppSelector(
    (state) => state.listaDatosParaAuditorias
  );

  const arrayTextos = ["Nombre y Mails", "Tipo de Auditoria", "Bloques y Items"];

  const buttonClases = MaterialButtons();
  const [direccion, setDireccion] = useState<"next" | "back">("next");
  const activeStep = arrayItems.findIndex((item) => !item.activo);

  const validationForNextStepper = () => {
    if (listaEmails && listaEmails.length > 0 && pasoActivo == 1) {
      return true;
    }
    if (tipoAuditoriaId && listaValores.length > 0 && pasoActivo == 2) {
      return true;
    }
    if (bloques && bloques.length > 0 && pasoActivo == 3) {
      return true;
    }
    return false;
  };

  return (
    <main className="flex flex-row justify-around w-full items-center px-6">
      <Button
        onClick={() => {
          setDireccion("back");
          backStepActive();
        }}
        disabled={arrayItems.filter((item) => !item.activo).length > 1}
        className={`${buttonClases.blueButton} h-14`}
        variant="contained">
        <ForwardRounded sx={{ rotate: "180deg" }} />
      </Button>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QuontoConnector />} className="w-full">
        {arrayItems.map((elementos, index) => {
          const completo = elementos.activo;
          const mostrarAnimacion = completo && direccion === "next";
          return (
            <Step key={index} completed={completo}>
              <StepLabel
                StepIconComponent={(props) => (
                  <QontoStepIcon
                    {...props}
                    direction={direccion}
                    shouldAnimate={mostrarAnimacion}
                    elemento={elementos.pasoActivo}
                  />
                )}
              />
              <p className="text-center mt-5">{arrayTextos[elementos.pasoActivo - 1]}</p>
            </Step>
          );
        })}
      </Stepper>
      {pasoActivo !== 3 ? (
        <Button
          disabled={arrayItems.every((item) => item.activo) || disabledButtonNext || !validationForNextStepper()}
          onClick={() => {
            setDireccion("next");
            nextStepActive(arrayItems);
          }}
          className={`${buttonClases.blueButton} h-14`}
          variant="contained">
          <ForwardRounded />
        </Button>
      ) : (
        <Button
          disabled={disabledButtonNext || !validationForNextStepper()}
          onClick={(event) => {
            pasoActivo === 3 && validationForNextStepper() ? submitForm() : nextStepActive(arrayItems);
          }}
          type={pasoActivo === 3 && validationForNextStepper() ? "button" : "button"}
          className={`${buttonClases.blueButton} h-2/3 w-[10%] p-4 text-xs`}
          variant="contained">
          {pasoActivo === 3 && validationForNextStepper() ? "Finalizar" : <ForwardRounded />}
        </Button>
      )}
    </main>
  );
};
