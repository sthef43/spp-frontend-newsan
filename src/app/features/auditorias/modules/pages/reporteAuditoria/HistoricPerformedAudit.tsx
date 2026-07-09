import React, { useEffect, useState } from "react";
import { IAuditRegistry } from "app/models/IAuditRegistry";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import classNames from "classnames";
import { Button, CircularProgress, Paper, StepContent, StepLabel, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { Step } from "@mui/material";
import { Stepper } from "@mui/material";
import { StepConnector } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { RegistrySliceRequests } from "app/Middleware/reducers/RegistrySlice";
import { IRegistry } from "app/models/IRegistry";
import { IAppUser } from "app/models/IAppUser";
import { AuditTypeMatcher } from "app/features/audit/modules/global/components/AuditTypeMatcher";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
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
  actionsContainer: { mb: 2 },
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
      borderBottomStyle: "none !important",
      color: "text.primary",
      WebkitTextFillColor: "text.primary"
    },
    "& .MuiInput-underline.Mui-disabled:before": {
      borderBottomStyle: "none !important"
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

export default function HistoricPerformedAudit() {
  const params: any = useParams();
  const buttonClasses = MaterialButtons();
  const fecha = moment().format("L");
  const history = useHistory();
  const { RolId } = useAppSelector((state) => state.appUser.data as any).permisos.rol;
  const dispatch = useAppDispatch();
  const initialState: IAuditRegistry = {
    operatorId: RolId,
    turnoId: undefined,
    plantId: undefined,
    auditRegistryResult: [],
    codigo: "",
    auditId: undefined
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const { TitleChanger } = useTitleOfApp();
  const [expanded, setExpanded] = React.useState<number | false>(0);
  const handleChange = (panel: number) => (event, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { State: registry, setState: setLista } = useFetchApi<IRegistry>(
    RegistrySliceRequests.getByIdRequest,
    params.id
  );
  const InfoAppUser: IAppUser = useAppSelector((state) => state.appUser.data as any);

  const [isProduct, setisProduct] = useState(false);

  useEffect(() => {
    if (registry) {
      if (registry.finalProduct?.length > 0) {
        setisProduct(true);
      }
    }
  }, [registry]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const findValue = (target: string, item: number) => {
    let encontrado;
    if (!isProduct) {
      encontrado = registry.registryResult.find((x) => x.itemId == item);
    } else {
      encontrado = registry.finalProduct.find((x) => x.itemId == item);
    }
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
  // const checkCorrectForm = (bloqElement: IAuditBloq) => {
  //   let finder = false;
  //   bloqElement?.bloq?.itemBloq?.map((ItemElement, x) => {
  //     const elemento = AuditForm?.auditRegistryResult?.find((f) => f.itemBloqId == ItemElement.id);

  //     if (elemento?.valorId === 0) {
  //       finder = true;
  //     }
  //   });
  //   return finder;
  // };
  return (
    <div className="p-1 sm:px-2 relative">
      <div className="grid sm:grid-cols-2 grid-col-1 px-2 gap-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="flex items-center gap-4">
          <div>Fecha </div>
          <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">{fecha}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>Auditór </div>
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
          {registry?.audit?.auditType?.lista?.listaValores &&
            registry?.audit?.auditType?.lista?.listaValores.map((x) => (
              <div key={x.id} className="text-center sm:text-left">
                <span>{x.valor.name} : </span>
                <span>{x.valor.descripcion}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 grid-col-1 px-2 gap-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="flex items-center gap-4">
          <div>Planta </div>
          <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">
            {registry?.plant?.name}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>linea </div>
          <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">
            {registry?.line?.name}
          </div>
        </div>
        {isProduct && (
          <div className="flex items-center gap-4">
            <div>Serial number </div>
            <div className=" border-2 w-full border-gray-600 dark:border-gray-200 rounded-md p-2">
              {registry?.finalProduct?.[0]?.serialNumber}
            </div>
          </div>
        )}
      </div>
      {registry?.audit?.auditType?.auditTableId && (
        <AuditTypeMatcher
          codigoChanger={() => {
            console.log("nothing");
          }}
          codigo={registry?.finalProduct[0]?.serialNumber.toString()}
          auditTableId={1}
        />
      )}
      {registry?.audit?.auditBloq && (
        <div className="w-full px-0 sm:px-2">
          <Stepper sx={sxStyles.root} activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
            {registry.audit?.auditBloq?.map((bloqElement, index) => (
              <Step key={bloqElement.id}>
                <StepLabel>
                  <div>
                    {index + 1} {bloqElement.bloq.name}
                  </div>
                </StepLabel>

                <StepContent sx={sxStyles.rootStrepper}>
                  <div>
                    <div className="hidden sm:grid pr-2 pl-14 grid-cols-16 font-bold w-full text-center text-lg ">
                      <div
                        className={classNames("col-span-1 border-2 text-center border-gray-700 dark:border-gray-200")}>
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
                            className="grid grid-col-1 sm:grid-cols-16 w-full items-stretch text-lg my-2 sm:my-1"
                            key={ItemElement.id}>
                            <div
                              className={classNames(
                                "sm:col-span-1 border-2 text-center flex items-center justify-center border-gray-700 dark:border-gray-200 sm:px-2 rounded-lg",
                                whatClassNameUse(ItemElement.item?.nivelItem?.id)
                              )}>
                              {index + 1}.{x}
                            </div>
                            <div className="sm:col-span-8 border-2  flex items-center justify-start sm:px-4  border-gray-700 dark:border-gray-200 rounded-lg">
                              {`${ItemElement.item?.name}`}
                            </div>
                            <div className="sm:col-span-5 border-2 border-gray-700 dark:border-gray-200 rounded-lg">
                              <TextField
                                type="text"
                                multiline
                                sx={sxStyles.InputInfo}
                                size="medium"
                                name="comentario"
                                disabled={true}
                                placeholder="Comentario"
                                // onChange={(e) => {
                                //   changeComentario(e, ItemElement.id);
                                // }}
                                value={findValue("comentario", ItemElement.itemId) || undefined}
                                variant="standard"
                              />
                            </div>
                            <div className="sm:col-span-2 border-2 border-gray-700 dark:border-gray-200 rounded-lg">
                              {/* <FormControl className={classes.InputInfoSelector} fullWidth variant="outlined">
                                <InputLabel>Valor</InputLabel>
                                <Select
                                  name="valorId"
                                  disabled={true}
                                  value={findValue("valorId", ItemElement.id) || undefined}>
                                  {registry?.audit?.auditType?.lista?.listaValores &&
                                    registry?.audit?.auditType?.lista?.listaValores.map((x) => (
                                      <MenuItem key={x.id} value={x.valor.name}>
                                        <div className="w-full">
                                          <div className="col-span-1">{x.valor.name}</div>
                                        </div>
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl> */}
                              <TextField
                                type="text"
                                sx={sxStyles.InputInfo}
                                size="medium"
                                placeholder="Valor"
                                name="valorId"
                                disabled={true}
                                value={findValue("value", ItemElement.itemId) || undefined}
                                variant="standard"
                              />
                            </div>
                          </div>
                        ))}
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
                        // disabled={checkCorrectForm(bloqElement)}
                      >
                        {"Siguiente"}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      )}
      {activeStep === registry?.audit?.auditBloq?.length && (
        <Paper square elevation={0} sx={sxStyles.resetContainer}>
          <Typography>Auditoria Completada solo le falta guardar!</Typography>
          <div>
            <Button onClick={handleBack} className={buttonClasses.blueButton}>
              volver
            </Button>
            <Button
              // onClick={handleSubmit}
              disabled={true}
              variant="contained"
              className={buttonClasses.blueButton}
              color="primary">
              Guardar
            </Button>
          </div>
        </Paper>
      )}
    </div>
  );
}
