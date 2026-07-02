import { Print } from "@mui/icons-material";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISuperCargalinea } from "app/models";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ComercialTable } from "app/features/supermercado/generaradorEtiquetas/components/ComercialTable";
import { GeneradorEtiquetasTable } from "app/features/supermercado/generaradorEtiquetas/components/GeneradorEtiquetasTable";
import { SelectModelo } from "app/shared/helpers/SelectModelo";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SelectOfPrinter } from "app/shared/helpers/SelectOfPrinter";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _, { Dictionary } from "lodash";
import React, { useEffect, useState } from "react";

export const GeneradorEtiquetasPage = (): JSX.Element => {
  const [codigoNewsan, setCodigoNewsan] = useState("");
  const [modelo, setModelo] = useState("");
  const [key, setKey] = useState("");
  const [superCargalineaGroup, setSupercargaLineaGroup] = useState<Dictionary<ISuperCargalinea[]>>(null);
  const [numerosOp, setNumerosOp] = useState<Array<{ numOp: string; numLote: string }>>(null);
  const [impresora, setImpresora] = useState("");
  const [modalImpresoras, setModalImpresoras] = useState(true);
  const [print, setPrint] = useState(false);

  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const handleGetComercial = async (key?) => {
    try {
      const response = unwrapResult(await dispatch(SuperCargalineaSliceRequests.getByModeloRequest(modelo)));
      setKey("");
      const orderByPosicion = _.orderBy(response, "descripSector");
      const groupByOp = _.groupBy(orderByPosicion, "numeroOp");
      setNumerosOp(
        Object.keys(groupByOp).map((op) => {
          return { numOp: op, numLote: groupByOp[op][0].lote };
        })
      );
      setSupercargaLineaGroup(groupByOp);
      if (key) {
        setKey(key);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const handleGetComercialByOp = async (op: string) => {
    setKey(op);
  };

  const onModelo = (nombre: string) => {
    setModelo(nombre);
  };

  useEffect(() => {
    if (modelo.length > 0) {
      handleGetComercial();
    }
  }, [modelo]);
  useEffect(() => {
    TitleChanger("Generar etiquetas supermercado");
  }, []);
  useEffect(() => {
    if (codigoNewsan != "") {
      setKey("");
      setNumerosOp([]);
    }
  }, [codigoNewsan]);
  return impresora == "" ? (
    <ModalCompoment title="Seleccione una impresora" setOpenPopup={setModalImpresoras} openPopup={modalImpresoras}>
      <SelectOfPrinter closeModal={setModalImpresoras} setNameOfPrinter={setImpresora} />
    </ModalCompoment>
  ) : (
    <div className="m-4 flex justify-center flex-col shadow-elevation-4 bg-secondaryNew">
      <div className="grid grid-cols-2 w-full">
        <SelectOFPlantAndProducts notShadow selectLineas setCodigoErrorProps={setCodigoNewsan} />
        {codigoNewsan && (
          <div className="w-full grid grid-cols-3">
            <SelectModelo notShadow codigoNewsan={codigoNewsan} onGetProps={onModelo} />
            <FormControl fullWidth variant="outlined" className="m-auto">
              <InputLabel>Seleccione un lote y numero OP</InputLabel>
              <Select variant="standard" disabled={!numerosOp} value={key}>
                {numerosOp?.map((op, index) => (
                  <MenuItem key={index} value={op.numOp} onClick={() => handleGetComercialByOp(op.numOp)}>
                    <div className="w-full">
                      <div>{`Lote ${op.numLote} - Número ${op.numOp}`}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              color="info"
              disabled={key == "" || superCargalineaGroup[key]?.length == 0}
              onClick={() => setPrint(true)}>
              <Print />
              Imprimir lote completo
            </Button>
          </div>
        )}
      </div>
      <ModalCompoment title="Imprimir lote completo de etiquetas?" setOpenPopup={setPrint} openPopup={print}>
        {key != "" && (
          <GeneradorEtiquetasTable closeModal={setPrint} impresora={impresora} materiales={superCargalineaGroup[key]} />
        )}
      </ModalCompoment>
      {key != "" && (
        <ComercialTable
          view
          data={superCargalineaGroup[key]}
          etiquetas
          impresora={impresora}
          // onEditProps={onEdit}
          modelo={modelo}
          refresh={handleGetComercial}
        />
      )}
    </div>
  );
};
