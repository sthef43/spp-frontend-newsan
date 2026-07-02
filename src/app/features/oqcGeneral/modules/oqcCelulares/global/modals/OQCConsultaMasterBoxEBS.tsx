import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { XXE_WIP_ITF_SERIE_HistorySliceRequest } from "app/Middleware/reducers/XXE_WIP_ITF_SERIE_History";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const OQCConsultaMasterBoxEBS: React.FC<Props> = ({ setOpenModal }) => {
  const {
    control,
    watch,
    formState: { errors }
  } = useForm();
  const modelo = useAppSelector((state) => state.oqcModelo.object);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();

  const inputLpn = useRef<HTMLInputElement | null>(null);

  const [datosEbs, setDatosEbs] = useState<IXXE_WIP_ITF_SERIE[]>([]);
  const [dobleImei, setDobleImei] = useState(false);
  const watchCodigoLpn: string = watch("LpnMaster");
  const getInfoEbs = async (event) => {
    try {
      if (event.key === "Enter") {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(watchCodigoLpn)));
        const responseHistory = unwrapResult(
          await dispatch(XXE_WIP_ITF_SERIE_HistorySliceRequest.GetByLpn(watchCodigoLpn))
        );
        if (response.length > 0) {
          verificarDatosEbs(response);
        } else {
          if (responseHistory.length > 0) {
            setDatosEbs(responseHistory);
          } else {
            inputLpn.current?.select();
            openNotificationUI("No se Encontro una Master Box", "warning");
          }
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const verificarDatosEbs = (infoDatos: IXXE_WIP_ITF_SERIE[]) => {
    let codigo: string;
    let codigoModelo: string = modelo.modeloMoto;
    console.log(codigoModelo);
    try {
      if (infoDatos[0].codigO_PRODUCTO.substring(0, 2) == "91") {
        codigo = infoDatos[0].codigO_PRODUCTO.slice(2);
      }
      if (codigoModelo.substring(0, 2) == "91") {
        codigoModelo = modelo.modeloMoto.slice(2);
      }
      console.log(codigoModelo);
      if (codigo == codigoModelo) {
        setDatosEbs(infoDatos);
        if (infoDatos[0].referenciA_2 != null) {
          setDobleImei(true);
        }
      } else {
        setDatosEbs([]);
        openNotificationUI("El lpn no corresponde al modelo", "warning");
        inputLpn.current?.select();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    inputLpn.current?.focus();
  }, []);

  console.log(datosEbs);
  console.log(modelo);

  return (
    <main className="w-[75vw]">
      <section className="w-full">
        <div className="w-full">
          <Controller
            control={control}
            name="LpnMaster"
            defaultValue=""
            rules={{ required: "Ingrese un numero LPN" }}
            render={({ field }) => (
              <TextField
                inputRef={inputLpn}
                {...field}
                onKeyUp={() => {
                  getInfoEbs(event);
                }}
                fullWidth
                label={"Ingrese un LPN"}
                error={!!errors.LpnMaster}
                helperText={errors.LpnMaster?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div>
          <TableContainer component={Paper} sx={{ marginTop: "1rem", height: "100%", border: "1px solid gray" }}>
            <Table sx={{ width: "100%" }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "var(--secondary-color)" }}>
                <TableRow>
                  <TableCell>Codigo Producto</TableCell>
                  <TableCell>Master Box</TableCell>
                  <TableCell>Numero OP</TableCell>
                  <TableCell>Numero Serie</TableCell>
                  <TableCell>OEM</TableCell>
                  <TableCell>Organization Code</TableCell>
                  <TableCell>Part Number</TableCell>
                  <TableCell>IMEI 1</TableCell>
                  {dobleImei && <TableCell className={`${dobleImei ? "" : "hidden"}`}>IMEI 2</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {datosEbs.map((elementos) => (
                  <TableRow key={elementos.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{elementos.codigO_PRODUCTO}</TableCell>
                    <TableCell>{elementos.lpn}</TableCell>
                    <TableCell>{elementos.nrO_OP}</TableCell>
                    <TableCell>{elementos.nrO_SERIE}</TableCell>
                    <TableCell>{elementos.oem}</TableCell>
                    <TableCell>{elementos.organizatioN_CODE}</TableCell>
                    <TableCell>{elementos.parT_NUMBER}</TableCell>
                    <TableCell>{elementos.referenciA_1}</TableCell>
                    {dobleImei && (
                      <TableCell className={`${dobleImei ? "" : "hidden"}`}>{elementos.referenciA_2}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            setOpenModal(false);
          }}
          className={buttonClases.redButton}
          variant="contained">
          Cerrar
        </Button>
      </div>
    </main>
  );
};
