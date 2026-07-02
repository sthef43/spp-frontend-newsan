/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { ITicketsTrazabilidad } from "../models/ITicketsTrazabilidad";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  stepConnectorClasses,
  StepIconProps
} from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { Check, AdjustRounded, PersonRounded } from "@mui/icons-material";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";

interface QontoStepIconPropsCustom extends StepIconProps {
  active?: boolean;
  completed?: boolean;
  shouldAnimate?: boolean;
}

interface Props {
  trazaTicket: ITicketsTrazabilidad[];
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
    marginLeft: "7px"
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
    fontSize: 30,
    backgroundColor: "green",
    padding: "0.2rem",
    borderRadius: "100%"
  },
  ...(ownerState.shouldAnimate && {
    "& .QontoStepIcon-completedIcon": {
      color: "#ffffff",
      zIndex: 1,
      fontSize: 30,
      backgroundColor: "green",
      padding: "0.2rem",
      borderRadius: "100%"
    }
  }),
  "& .QontoStepIcon-IncompletedIcon": {
    color: "#ffffff",
    zIndex: 1,
    fontSize: 40,
    padding: "0.2rem",
    borderRadius: "100%",
    fill: "#2264f99e"
  }
}));

const QontoStepIcon = (props: QontoStepIconPropsCustom) => {
  const { active, completed, className, icon, shouldAnimate } = props;
  return (
    <QontoStepIconRoot ownerState={{ active, icon, shouldAnimate }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <AdjustRounded className="QontoStepIcon-IncompletedIcon" />
      )}
    </QontoStepIconRoot>
  );
};

export const StepperTrazaTicket: React.FC<Props> = ({ trazaTicket }) => {
  const { formatDateHourOrMinutes } = UseUtilHooks();

  return (
    <main className="w-full h-full">
      <Stepper connector={<QuontoConnector />} orientation="vertical">
        {trazaTicket.map((elementos, index) => {
          return (
            <Step key={elementos.id}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                sx={{
                  "& .MuiStepLabel-label.Mui-active": { color: "white" },
                  "& .MuiStepLabel-labelContainer": { color: "white" }
                }}>
                {elementos.id}
              </StepLabel>
              <StepContent
                sx={{
                  marginLeft: "19px",
                  borderLeft: "3px solid #bdbdbd",
                  "& .MuiCollapse-root": {
                    backgroundColor: "var(--background-color)",
                    padding: "1rem",
                    borderRadius: "10px",
                    boxShadow: "0px 8px 10px 0px rgb(56 56 56 / 12%);"
                  }
                }}
                TransitionProps={{ in: true, unmountOnExit: false }}>
                <div className="flex flex-row justify-between w-full">
                  <p className="capitalize font-semibold text-xl">{elementos.accion}</p>
                  <p className="capitalize font-extralight text-sm">
                    {formatDateHourOrMinutes({
                      optionDate: "fullDate",
                      optionHour: "fechaBaseDatos",
                      fechaIngresada: elementos.createdDate
                    })}
                  </p>
                </div>
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <div className="mt-4">
                    <p>{elementos.mensajeAccion}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-row items-center gap-x-2">
                  <PersonRounded />
                  <div className="flex flex-col">
                    <p>
                      Agente: {elementos.operator.name} {elementos.operator.surname}{" "}
                    </p>
                    <p>Cargo: {elementos.operator.position}</p>
                  </div>
                </div>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </main>
  );
};
