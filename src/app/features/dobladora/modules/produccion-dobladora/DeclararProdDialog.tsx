import { Button, TextField } from "@mui/material";
import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import React, { useEffect, useState } from "react";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import CheckIcon from "@mui/icons-material/Check";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobProdDeclaracionSliceRequests } from "app/Middleware/reducers/DobProdDeclaracionSlice";
import { IDobMovimientosDeclaracion } from "app/models/IDobMovimientosDeclaracion";
import moment from "moment";
import { IDobHMaquina } from "app/models/IDobHMaquina";
import { useForm } from "react-hook-form";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { DobHMaquinaSliceRequests } from "app/Middleware/reducers/DobHMaquinaSlice";

interface initialState {
  nombreMaquina: string;
}

interface Props {
  dataEBS: IXXE_WIP_OT;
  dataLocal?: IDobProdDeclaracion;
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  declaracionesHistorico?: IDobProdDeclaracion;
  familia?: string;
  onSuccessSave: () => void;
}

export const DeclararProdDIalog = ({
  dataEBS,
  dataLocal,
  openModal,
  setOpenModal,
  onSuccessSave,
  declaracionesHistorico,
  familia
}: Props): JSX.Element => {
  const { control, watch, setValue } = useForm();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const [cantProducido, setCantidadProducido] = useState<number>(0);
  const [listadoMaquinas, setListadoMaquinas] = useState<IDobHMaquina[] | undefined>(undefined);
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState<string>("");

  const totalLocal = dataLocal?.totalDeclarado ?? 0;
  const totalEBS = Number(dataEBS?.quantitY_COMPLETED ?? 0);
  const totalProgramado = Number(dataEBS?.starT_QUANTITY ?? 0);

  console.log("🕵️ ESTADOS ACTUALES:", {
    maquina: maquinaSeleccionada,
    aProducir: cantProducido,
    yaProducido: totalLocal,
    objetivo: totalProgramado
  });

  const isButtonDisabled =
    !maquinaSeleccionada ||
    cantProducido <= 0 ||
    cantProducido + totalLocal > Number(dataEBS.starT_QUANTITY) ||
    totalLocal === Number(dataEBS.starT_QUANTITY);

  const getMaquinasDob = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DobHMaquinaSliceRequests.getAllRequest()));
      if (response) {
        console.log("maquinas", response);
        setListadoMaquinas(response);
      }
    } catch (err) {
      console.error(err);
      openNotificationUI("No se pudo traer las maquinas de dobladora", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const addMovimientoProd = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result;
    const fechaActual = moment().format("YYYY-MM-DDTHH:mm:ss");

    try {
      if (declaracionesHistorico) {
        const addRegistro: IDobMovimientosDeclaracion = {
          cantDeclarada: cantProducido,
          dobProdDeclaracionId: declaracionesHistorico.id,
          fecha: fechaActual,
          nombreMaquina: maquinaSeleccionada
        };
        result = unwrapResult(
          await dispatch(DobProdDeclaracionSliceRequests.AddDeclaracionAndUpdateTotal(addRegistro))
        );
      } else {
        const newRegistro: IDobProdDeclaracion = {
          cantidadOP: Number(dataEBS.starT_QUANTITY),
          descripcion: dataEBS.description || "Sin descripción",
          familia: familia,
          semielaborado: dataEBS.segmenT1,
          totalEBS: Number(dataEBS.quantitY_COMPLETED),
          fecha: fechaActual,
          totalDeclarado: cantProducido,
          op: dataEBS?.wiP_ENTITY_NAME,
          movimientos: [
            {
              cantDeclarada: cantProducido,
              fecha: fechaActual,
              nombreMaquina: maquinaSeleccionada
            }
          ]
        };
        console.log("nestedadd por que no tengo un carajo", newRegistro);
        result = unwrapResult(await dispatch(DobProdDeclaracionSliceRequests.NestedAddRequest(newRegistro)));
      }
      if (result !== false) {
        onSuccessSave();
        openNotificationUI("Se agregó la producción correctamente", "success");
        setOpenModal(false);
      } else {
        openNotificationUI("Algo sucedio al agregar la producción", "error");
      }
    } catch (err) {
      openNotificationUI("Ocurrio un error al cargar la producción", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isButtonDisabled) {
        addMovimientoProd();
      }
    }
  };

  useEffect(() => {
    getMaquinasDob();
  }, []);
  return (
    <div className=" p-2 flex flex-col min-w-[450px]">
      {/* data de las cantidades */}
      <div className="w-full p-2 flex flex-col gap-4 bg-gray-50 rounded-lg">
        <div className="w-full flex flex-row justify-between text-center">
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold">OP</p>
            <p className="text-sm font-semibold text-gray-700">{dataEBS?.wiP_ENTITY_NAME}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold">Cantidad prog.</p>
            <p className="text-sm font-bold text-gray-800">{totalProgramado}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold">Total Producido</p>

            <p className="text-sm font-black text-green-600">{totalLocal}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="w-3/4 flex flex-col gap-4">
          <SelectComponent
            listaObjetos={listadoMaquinas}
            inputLabel="Seleccione una maquina"
            valueSelect={(value) => value.descripcion}
            control={control}
            ValueSave={(val) => setMaquinaSeleccionada(String(val))}
            nameSelect="maquinaSeleccionada"
            varianteEstilo="filled"
            valueKey={(index) => index}
            valueLabel={(value) => value.descripcion}
          />
          <TextField
            fullWidth
            label="Asignar producción"
            variant="filled"
            type="text"
            value={cantProducido === 0 ? "" : cantProducido}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9\b]+$/.test(val)) {
                setCantidadProducido(val === "" ? 0 : Number(val));
              }
            }}
          />
        </div>
        <div className="w-1/4 flex justify-center items-end">
          <Button
            type="button"
            disabled={isButtonDisabled}
            sx={{ width: "80%", height: "40px" }}
            className={buttonClases.blueButton}
            aria-label="declarar producción"
            onClick={(e) => {
              e.stopPropagation();
              addMovimientoProd();
            }}>
            <CheckIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
