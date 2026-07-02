/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ComunicadoSliceRequest } from "app/Middleware/reducers/ComunicacionSlice";
import { useAppDispatch } from "app/core/store/store";
import { IComunicado } from "app/models/IComunicado";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

export const MensajesAndonPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();

  const [comunicado, setComunicado] = useState<IComunicado>(null);
  const [descripcion, setDescripcion] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const hasMsg = comunicado?.descripcion != null;
  const buttonLabel = !hasMsg ? "Enviar mensaje" : isEditing ? "Guardar cambios" : "Editar mensaje";
  const disableButton = isEditing && descripcion.trim() === "";

  const getComunicacion = async () => {
    const result = unwrapResult(await dispatch(ComunicadoSliceRequest.getList()));
    if (result && result.length > 0) {
      setComunicado(result[0]);
    } else {
      setComunicado(null);
    }
  };

  useEffect(() => {
    if (hasMsg) {
      setDescripcion(comunicado?.descripcion ?? "");
      setIsEditing(false);
    } else {
      setDescripcion("");
      setIsEditing(true);
    }
  }, [hasMsg, comunicado]);

  const guardar = async () => {
    const objGuardar = {
      ...comunicado,
      descripcion,
      tipo: 1
    };
    const result = unwrapResult(await dispatch(ComunicadoSliceRequest.put(objGuardar)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setComunicado(objGuardar);
      setIsEditing(false);
    } else {
      openNotificationUI("Error al guardar :(", "error");
    }
  };

  const limpiarComunicado = async () => {
    const objGuardar = {
      ...comunicado,
      descripcion: null,
      tipo: 0
    };
    const result = unwrapResult(await dispatch(ComunicadoSliceRequest.put(objGuardar)));
    if (result) {
      openNotificationUI("Mensaje eliminado", "success");
      setComunicado(objGuardar);
      setDescripcion("");
      setIsEditing(true);
    } else {
      openNotificationUI("Error al eliminar", "error");
    }
  };

  const onMainClick = async () => {
    if (hasMsg && !isEditing) {
      setIsEditing(true);
      return;
    }
    await guardar();
  };

  useEffect(() => {
    getComunicacion();
    TitleChanger("MENSAJES ANDÓN");
  }, []);

  return (
    <>
      <div aria-hidden="true" />
      <div className="w-full min-h-[calc(100vh-64px)]">
        <div className="mt-3 px-5">
          <h2 className="text-3xl text-subtitleTextModules font-bold">Mensajería en Pantalla</h2>
        </div>
        <div className="flex justify-center px-6 pb-10 pt-2">
          <div className="w-full max-w-[880px] flex flex-col items-center">
            <div className="w-full rounded-md px-10">
              <TextField
                id="outlined-multiline-static"
                multiline
                value={descripcion}
                disabled={hasMsg && !isEditing}
                className="shadow-Box border border-[#EAEFF4]"
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder={"ESCRIBE TU MENSAJE\nAQUÍ"}
                fullWidth
                minRows={5}
                variant="outlined"
                sx={(theme) => {
                  const dark = theme.palette.mode === "dark";
                  return {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: dark ? "#001947" : "#ffffff",
                      color: dark ? "#ffffff" : "#111827"
                    },

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    },

                    "& .MuiOutlinedInput-input": {
                      textAlign: "center",
                      fontSize: "32px",
                      lineHeight: 1.2,
                      paddingTop: "90px"
                    },

                    "&& textarea::placeholder": {
                      textAlign: "center",
                      fontSize: "45px",
                      fontWeight: 500,
                      color: dark ? "#63778bff" : "#597C9C",
                      opacity: dark ? 0.22 : 0.3
                    },

                    "& .MuiOutlinedInput-root.Mui-disabled": {
                      WebkitTextFillColor: "inherit",
                      opacity: 0.85
                    }
                  };
                }}
              />
            </div>
            <div className="mt-8 flex flex-row items-center gap-3">
              <Button
                onClick={onMainClick}
                disabled={disableButton}
                className={buttonClasses.blueButton}
                sx={{
                  "&&": {
                    backgroundColor: "#137FEC",
                    color: "#FFF",
                    width: 320,
                    height: 50,
                    transition: "transform 240ms ease, background-color 240ms ease"
                  },
                  "&&:hover": { backgroundColor: "#3f9cf9ff", transform: "scale(1.02)" },
                  "&&:Mui-disabled": {
                    backgroundColor: "#9DBEF5",
                    color: "#E6EEFF",
                    cursor: "not-allowed",
                    transform: "none"
                  }
                }}>
                {buttonLabel}
              </Button>
              {hasMsg && (
                <Button
                  onClick={limpiarComunicado}
                  className={buttonClasses.redButton}
                  sx={{
                    "&&": {
                      width: 320,
                      height: 50,
                      backgroundColor: "#FF625B",
                      color: "#FFF",
                      transition: "transform 240ms ease, background-color 240ms ease"
                    },
                    "&&:hover": { backgroundColor: "#ff5047ff", transform: "scale(1.02)" }
                  }}>
                  Eliminar Mensaje
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
