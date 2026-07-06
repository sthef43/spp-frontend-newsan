import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OQCReprocesoSampling } from "./OQCReprocesoSampling";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Check, Close } from "@mui/icons-material";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { XXE_WIP_ITF_SERIE_HistorySliceRequest } from "app/Middleware/reducers/XXE_WIP_ITF_SERIE_History";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

interface Props {
  refresh: () => void;
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const OQCReprocesoMasterBox: React.FC<Props> = ({ setOpenModal, openModal, refresh }) => {
  const {
    watch,
    control,
    register,
    setValue,
    formState: { errors }
  } = useForm();

  const planta = useAppSelector((state) => state.plant.object);
  const paletSeleccionado = useAppSelector<IOQCPalet>((state) => state.oqcPalet.object);

  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const inputMaster = useRef<HTMLInputElement | null>(null);
  const inputImeis = useRef<HTMLTextAreaElement | null>(null);

  const [openModalSamplin, setOpenModalSamplin] = useState<boolean>(false);
  const [dobleImei, setDobleImei] = useState<boolean>(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [codigosCorrectos, setCodigosCorrectos] = useState(false);

  const [listaCodigosMsn, setListaCodigosMsn] = useState<string[]>([]);
  const [numerosReferencia, setNumerosReferencia] = useState([]);
  const [cantidadImeisIngresados, setCantidadImeisIngresados] = useState([]);

  const [masterEncontrada, setMasterEncontrada] = useState<IXXE_WIP_ITF_SERIE[]>([]);
  const [datosGuardados, setDatosGuardados] = useState<IOQCNuevoPallet[]>([]);

  const watchImeis: string = watch("codesIMEI");
  const watchCodigoMasterBox: string = watch("masterBox");

  const goodIcon = <Check sx={{ color: "green" }}></Check>;
  const noGoodIcoon = <Close sx={{ color: "red" }}></Close>;

  const rechazosDelPalet = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCPaletSliceRequests.getPalletWithRechazos(paletSeleccionado.id)));
      if (response) {
        dispatch(oqcPaletSlice.actions.setObject(response));
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buscarMasterBox = async (event) => {
    if (event.key === "Enter") {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(watchCodigoMasterBox)));
        const responseHistory = unwrapResult(
          await dispatch(XXE_WIP_ITF_SERIE_HistorySliceRequest.GetByLpn(watchCodigoMasterBox))
        );
        if (response.length > 0) {
          guardadNumerosReferencia(response);
          openNotificationUI("Se Encontro una Master Box", "success");
          setMasterEncontrada(response);
          manejarEnter(event, 0);
        } else {
          if (responseHistory.length > 0) {
            guardadNumerosReferencia(responseHistory);
            openNotificationUI("Se Encontro una Master Box", "success");
            setMasterEncontrada(responseHistory);
            manejarEnter(event, 0);
          } else {
            inputMaster.current?.select();
            guardadNumerosReferencia([]);
            setMasterEncontrada([]);
            openNotificationUI("No se Encontro una Master Box", "warning");
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  const guardadNumerosReferencia = (response: IXXE_WIP_ITF_SERIE[]) => {
    if (response.length > 0) {
      response.map((elementos) => {
        if (elementos.referenciA_1.length !== numerosReferencia.length && elementos.referenciA_2 == null) {
          setNumerosReferencia((prev) => [
            ...prev,
            {
              Referencia_1: elementos.referenciA_1,
              state: false
            }
          ]);
        } else if (elementos.referenciA_1.length !== numerosReferencia.length && elementos.referenciA_2 !== null) {
          setNumerosReferencia((prev) => [
            ...prev,
            {
              Referencia_1: elementos.referenciA_1,
              state: false
            }
          ]);
          setNumerosReferencia((prev) => [
            ...prev,
            {
              Referencia_2: elementos.referenciA_2,
              state: false
            }
          ]);
        }
      });
    } else {
      setNumerosReferencia([]);
    }
  };

  const buscarDobleImei = () => {
    setDobleImei(
      masterEncontrada.some((elementos) => {
        return elementos.referenciA_2 != null;
      })
    );
    setOpenModalSamplin(true);
  };

  const verificarImeis = () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const cambiarFormatoImei = watchImeis.split("\n").filter((elemento) => elemento !== "");
    const codigosMsn = cambiarFormatoImei.filter((msn) => msn.length <= 12);
    const imeisIngresadosFiltrados = cambiarFormatoImei.filter((imei) => imei.length >= 14);

    if (cambiarFormatoImei.length > 0) {
      setCantidadImeisIngresados(imeisIngresadosFiltrados);
    }

    if (imeisIngresadosFiltrados.length == numerosReferencia.length) {
      codigosMsn.map((elementos) => {
        if (elementos != null) {
          imeisIngresadosFiltrados.forEach((imeisIngresados) => {
            numerosReferencia.forEach((imeisGuardados) => {
              if (imeisGuardados.Referencia_1 == imeisIngresados || imeisGuardados.Referencia_2 == imeisIngresados) {
                imeisGuardados.state = true;
              }
            });
          });
          setMostrarTabla(true);
        } else {
          openNotificationUI("Se encontraron valores nullos en el codigo QR", "warning");
        }
      });
      setListaCodigosMsn(codigosMsn);
    }

    const datosCorrectos = numerosReferencia.filter((elementos) => elementos.state == false);
    setCodigosCorrectos(datosCorrectos.length > 0 ? false : true);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const manejarEnter = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const input = document.querySelectorAll(".inputNuevoPallet");
      const siguienteInput = input[index + 1] as HTMLInputElement;
      if (siguienteInput && siguienteInput instanceof HTMLElement) {
        siguienteInput.focus();
      }
    }
  };

  const asignarNuevosDatos = () => {
    const nuevosElementos: IOQCNuevoPallet[] = [];
    masterEncontrada.forEach((elementos, index) => {
      if (elementos.referenciA_2 == null) {
        nuevosElementos.push({
          lpn: elementos.lpn,
          codigoProducto: elementos.codigO_PRODUCTO,
          referencia1: elementos.referenciA_1,
          referencia2: null,
          numeroSerie: elementos.nrO_SERIE,
          nroOp: elementos.nrO_OP,
          lpnCant: masterEncontrada.length,
          partNumber: elementos.parT_NUMBER,
          oem: elementos.oem,
          organizationCode: elementos.organizatioN_CODE,
          eanCode: paletSeleccionado.oqcModelo.eanCode,
          msn: listaCodigosMsn[index]
        });
      } else if (elementos.referenciA_2 != null) {
        nuevosElementos.push({
          lpn: elementos.lpn,
          codigoProducto: elementos.codigO_PRODUCTO,
          referencia1: elementos.referenciA_1,
          referencia2: elementos.referenciA_2,
          numeroSerie: elementos.nrO_SERIE,
          nroOp: elementos.nrO_OP,
          lpnCant: masterEncontrada.length,
          partNumber: elementos.parT_NUMBER,
          oem: elementos.oem,
          organizationCode: elementos.organizatioN_CODE,
          eanCode: paletSeleccionado.oqcModelo.eanCode,
          msn: listaCodigosMsn[index]
        });
      }
    });

    if (nuevosElementos.length > 0) {
      return nuevosElementos;
    }
  };

  const guardarDatos = () => {
    const nuevosDatos = asignarNuevosDatos();
    setDatosGuardados(nuevosDatos);
    console.log(nuevosDatos);
  };

  const resetearImeis = () => {
    setNumerosReferencia([]);
    setCantidadImeisIngresados([]);
    setMostrarTabla(false);
    inputMaster.current?.focus();
    setValue("codesIMEI", "");
    setValue("masterBox", "");
  };

  useEffect(() => {
    if (openModal) {
      rechazosDelPalet();
      inputMaster.current?.focus();
    }
  }, [openModal]);

  useEffect(() => {
    if (watchImeis) {
      verificarImeis();
    }
  }, [watchImeis]);

  return (
    <main className="w-[40vw]">
      <Controller
        control={control}
        name="masterBox"
        defaultValue=""
        render={({ field }) => (
          <TextField
            fullWidth
            {...field}
            id="master-box"
            inputRef={inputMaster}
            label="Ingrese una master box"
            autoComplete={"off"}
            className="inputNuevoPallet w-full"
            variant="outlined"
            onKeyUp={(event) => {
              buscarMasterBox(event);
            }}
          />
        )}
      />
      <div
        className={`${
          mostrarTabla ? "absolute left-0 opacity-0 -top-40" : "flex flex-row justify-center items-center"
        } w-full mt-4`}>
        <div className="flex-col items-center w-full">
          <Controller
            name="codesIMEI"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                ref={inputImeis}
                {...field}
                placeholder="TODOS LOS NUMEROS DE IMEI"
                rows={5}
                className="inputNuevoPallet w-full"
                style={{ border: "1px solid #d1d5db", textAlign: "left" }}
                onKeyUp={(event) => {
                  manejarEnter(event, 1);
                }}
                {...register("codesIMEI", {
                  required: {
                    value: true,
                    message: "Ingrese los codigos IMEI"
                  },
                  validate: () => {
                    if (codigosCorrectos) {
                      return true;
                    } else if (numerosReferencia.length !== cantidadImeisIngresados.length) {
                      return "Faltan imeis";
                    } else {
                      return "Codigos incorrectos";
                    }
                  }
                })}
              />
            )}
          />
        </div>
      </div>
      <div className={`${mostrarTabla ? "flex" : "hidden"} flex flex-col justify-center items-center w-full mt-4`}>
        <div
          className={`${
            mostrarTabla ? "flex" : "hidden"
          } px-2 w-[60%] flex-col overflow-scroll h-32 overflow-x-hidden border border-gray-400`}>
          <p className="text-center text-sm">TODOS LOS NUMEROS DE IMEI</p>
          <div className="w-full flex flex-col">
            {numerosReferencia.map((elementos, index) => (
              <div key={index} className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-textColor">{elementos.Referencia_1}</p>
                  <p className="text-sm text-textColor">{elementos.Referencia_2}</p>
                </div>
                <p className="text-center" key={index + 1}>
                  {elementos.state ? goodIcon : noGoodIcoon}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="bg-purple-500 text-white px-2 py-2 rounded-lg font-semibold mt-3 shadow-md"
          onClick={() => {
            resetearImeis();
          }}>
          Volver a ingresar imeis
        </button>
      </div>
      {errors.codesIMEI && <p className="-my-4 text-xs font-semibold text-red-600">{errors.codesIMEI?.message}</p>}
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button
            type="submit"
            disabled={!codigosCorrectos}
            onClick={() => {
              buscarDobleImei();
              guardarDatos();
            }}
            className={buttonClases.greenButton}>
            Agregar
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className={buttonClases.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
      {/* Modal para reproceso sampling */}
      <ModalCompoment
        openPopup={openModalSamplin}
        setOpenPopup={setOpenModalSamplin}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Reproceso de muestreo de equipos"
        title="Reproceso Sampling">
        <OQCReprocesoSampling
          plantaId={planta.id}
          setOpenModalZampling={setOpenModalSamplin}
          openModal={openModalSamplin}
          equiposMaster={datosGuardados}
          dobleImei={dobleImei}
          listaCodigosMsn={listaCodigosMsn}
          refresh={refresh}
        />
      </ModalCompoment>
      {/* Modal para reproceso sampling */}
    </main>
  );
};
