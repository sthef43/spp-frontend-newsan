/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { unwrapResult } from "@reduxjs/toolkit";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import FetchApi from "app/shared/helpers/FetchApi";
import { IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { PlacasBateasModal } from "./PlacasBateasModal";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";
import { CLIContenedorItemsSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { IBateasDTO } from "../../models/IBateasDTO";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AsignarBateasModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    trigger,
    formState: { errors }
  } = useForm();

  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);
  const datosEmpaque = useAppSelector((state) => state.empq_declaration.data as any);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPut } = useFetchApiMultiResults();

  const [openModalExaminarPlacas, setOpenModalExaminarPlacas] = useState<boolean>(false);

  const [codigoBatea, setCodigoBatea] = useState("");

  const [listaBateas, setListaBateas] = useState<IBateasDTO[]>([]);
  FetchApi<IBateasDTO[]>(
    TrazaOperacionesSliceRequests.GetAllPuntIntoContainerById,
    contenedor.id,
    false,
    contenedor.modelo !== null,
    setListaBateas,
    true
  );

  const [bloqueCreado, setBloqueCreado] = useState<ICLIContenedorItemsRecepcionBloq>();
  FetchApi<ICLIContenedorItemsRecepcionBloq>(
    CLIContenedorItemsRecepcionBloqSliceRequest.GetFirsBloqCreatByContenedorId,
    contenedor.id,
    false,
    openModal,
    setBloqueCreado,
    true
  );

  const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let responseTrazas: TrazaOperaciones[];
    let responsesOp;

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      responseTrazas = unwrapResult(
        await dispatch(TrazaOperacionesSliceRequests.GetAllTracesByPunt(inputActual.value))
      );
      responsesOp = unwrapResult(
        await dispatch(empq_declarationsSliceRequests.getByCodigo(responseTrazas[0].codigoInit))
      );
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
        if (responseTrazas) {
          const listaNuevasTrazas = actualizarTrazas(responseTrazas);
          FetchPut({
            consoleLog: false,
            sliceRequest: TrazaOperacionesSliceRequests.multiPutRequest,
            modelPut: listaNuevasTrazas,
            activeConfirmation: false,
            functionAdd: async () => {
              actualizarContenedor(responseTrazas[0], responsesOp, listaNuevasTrazas.length);
              openNotificationUI("Se Asigno la batea con exito", "success");
              const response = unwrapResult(
                await dispatch(TrazaOperacionesSliceRequests.GetAllPuntIntoContainerById(contenedor.id))
              );
              setListaBateas(response);
              inputActual.select();
              return;
            }
          });
        }
      }
    }
  };

  const actualizarContenedor = (itemTraza: TrazaOperaciones, datosEmpaque, cantidadTrazas) => {
    const nuevoBloque = crearBloqueItemRecepcion();
    const clonContenedo = { ...contenedor };
    const nuevosDatosContenedor: ICLIContendorItems = {
      ...contenedor,
      modelo: itemTraza.modelo !== null ? itemTraza.modelo : "SP",
      semiElaborado: itemTraza.semiElaborado !== null ? itemTraza.semiElaborado : "SP",
      numeroOp: datosEmpaque.nro_Op !== null ? datosEmpaque.nro_Op : "SP",
      cliSectoresId: 8,
      cantidadBateas: (clonContenedo.cantidadBateas += 1),
      cantidadTotalItems: (clonContenedo.cantidadTotalItems += cantidadTrazas)
    };
    FetchPut({
      consoleLog: false,
      sliceRequest: CLIContenedorItemsSliceRequest.PutRequest,
      modelPut: nuevosDatosContenedor,
      functionAdd: async () => {
        if (!bloqueCreado) {
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.PostRequest(nuevoBloque));
        }
        await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("PROD"));
        await dispatch(CLIContenedorItemsSliceRequest.GetContainerByLPN(clonContenedo.lpnGenerada));
      }
    });
  };

  const crearBloqueItemRecepcion = () => {
    try {
      const nuevoBloque: ICLIContenedorItemsRecepcionBloq = {
        cliContenedorItemsId: contenedor.id,
        recepcion: "",
        cliSectoresId: 8
      };

      if (nuevoBloque !== null) {
        return nuevoBloque;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error generando el bloque principal: ${error}`, "error");
    }
  };

  const actualizarTrazas = (listaTrazas: TrazaOperaciones[]) => {
    try {
      const nuevasTrazas = listaTrazas.map((elementos) => {
        elementos.cliContenedorItemsId = contenedor.id;
        return elementos;
      });

      if (nuevasTrazas && nuevasTrazas.length > 0) {
        return nuevasTrazas;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se encontro un error, ${error}`, "error");
    }
  };

  const verLongitud = (value: string, index: number) => {
    if (listaBateas && listaBateas.length > 0) {
      const bateaIngresada = listaBateas.some((elementos) => elementos.bateas == value);
      if (bateaIngresada && index == 0) {
        return "Batea ya ingresada";
      } else if (datosEmpaque.nro_Op !== contenedor.numeroOp) {
        return "La OP de la batea es diferente";
      } else {
        return true;
      }
    }
  };

  const handlePlacasBateasModal = (codigoBatea: string) => {
    setCodigoBatea(codigoBatea);
    setOpenModalExaminarPlacas(true);
  };

  return (
    <main className="w-[60vw]">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese la lpn de una batea"
        nameInput="lpnBatea"
        valueDefault=""
        autoFocus
        errors={errors}
        requiredBool
        onKeyUpFunction
        validacionAdicionales={verLongitud}
        onKeyUp={handleKey}
      />
      {listaBateas && listaBateas.length > 0 && (
        <section className="flex flex-col mt-4 gap-y-2">
          {listaBateas.map((elementos, index) => (
            <figure
              key={index}
              className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors cursor-pointer">
              <div>
                <h2 className="mb-2">{elementos.bateas}</h2>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <div>
                  <Tooltip title="Examinar Placas">
                    <span>
                      <IconButton
                        size="small"
                        style={{ position: "relative" }}
                        onClick={() => {
                          handlePlacasBateasModal(elementos.bateas);
                        }}>
                        <Visibility color="primary" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </div>
            </figure>
          ))}
        </section>
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalExaminarPlacas}
        openPopup={openModalExaminarPlacas}
        title="Placas En la batea">
        <PlacasBateasModal
          openModal={openModalExaminarPlacas}
          setOpenModal={setOpenModalExaminarPlacas}
          codigoBatea={codigoBatea}
        />
      </ModalCompoment>
    </main>
  );
};
