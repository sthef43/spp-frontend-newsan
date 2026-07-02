import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepContent,
  StepLabel,
  TextField,
  Theme
} from "@mui/material";
import { IAudit } from "app/models";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import classNames from "classnames";

const sxStyles = {
  root: { padding: 1 },
  rootStrepper: { margin: 0, padding: 0 },
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

interface IAuditPerformProps {
  array: any[];
  audit: IAudit;
  changeComentarioP: (e: any, item: number) => void;
  findValueP: (target: string, item: number) => any;
}
export const AuditPerformPrint = ({ array, audit, changeComentarioP, findValueP }: IAuditPerformProps) => {
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
  const changeComentario = (e: any, item: number) => {
    changeComentarioP(e, item);
  };
  const findValue = (target: string, item: number) => {
    return findValueP(target, item);
  };
  return (
    <div>
      {array?.map((bloqElement, index) => (
        <Step key={bloqElement.id}>
          <StepLabel>
            <div>
              {index + 1} {bloqElement.bloq.name}
            </div>
          </StepLabel>

          <StepContent sx={sxStyles.rootStrepper}>
            <div className="md:flex md:flex-row mx-3">
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
              <div>
                <div className="hidden sm:grid pr-2 pl-14 grid-cols-16 font-bold w-full text-center text-lg ">
                  <div className={classNames("col-span-1 border-2 text-center border-gray-700 dark:border-gray-200")}>
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
                      <div className="grid grid-col-1 sm:grid-cols-16 w-full text-lg my-2 sm:my-1" key={ItemElement.id}>
                        <div
                          className={classNames(
                            "sm:col-span-1 border-2 text-center flex items-center justify-center border-gray-700 dark:border-gray-200 sm:px-2 rounded-lg",
                            whatClassNameUse(ItemElement.item?.nivelItem?.id)
                          )}>
                          {index + 1}.{x}
                        </div>
                        <div className="sm:col-span-8 border-2  flex items-center justify-start sm:px-4  border-gray-700 dark:border-gray-200 rounded-lg">{`${ItemElement.item?.name}`}</div>
                        <div className="sm:col-span-5 border-2 border-gray-700 dark:border-gray-200 rounded-lg">
                          <TextField
                            type="text"
                            multiline
                            sx={sxStyles.InputInfo}
                            size="medium"
                            name="comentario"
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
                            <InputLabel>Valor</InputLabel>
                            <Select
                              name="valorId"
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
                  </div>
                </div>
              </div>
            </div>
          </StepContent>
        </Step>
      ))}
    </div>
  );
};
