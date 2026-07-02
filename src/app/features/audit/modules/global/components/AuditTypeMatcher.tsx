import React, { useMemo, useState } from "react";
import { TextField } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";
import { IAuditDispositivo } from "app/models/IAuditDispositivo";
import { IProduccionInicio } from "app/models/IProduccionInicio";
import { ProduccionInicioSliceRequests } from "app/Middleware/reducers/ProduccionInicioSlice";
import { AuditDispositivoSliceRequests } from "app/features/audit/slices/AuditDispositivoSlice";

interface Props {
  auditTableId: number;
  codigoChanger: any;
  codigo: string;
}

const Producto = (props: { debo: any; codigo: string; changeInfo: any; informationOfCode: IProduccionInicio }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-8 w-full">
        <div className="font-semibold">Codigo Producto</div>
        <TextField
          type="text"
          multiline
          variant="outlined"
          size="medium"
          label="Codigo"
          error={!props.informationOfCode}
          value={props?.codigo}
          placeholder="Codigo"
          onChange={(e) => {
            props.changeInfo(e);
            props.debo(e.target.value);
          }}
        />
      </div>
      {props.informationOfCode && (
        <div>
          <div className="p-2 hidden md:block">
            <div className="grid grid-cols-3 gap-2 md:gap-8 font-semibold shadow-elevation-4 text-lg text-center rounded-lg bg-blue-600 text-gray-100 ">
              <div>Lote </div>
              <div>Numero op</div>
              <div>Modelo </div>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-8 font-medium text-center">
              <div>{props.informationOfCode.lote}</div>
              <div>{props.informationOfCode.nroOp}</div>
              <div>{props.informationOfCode.modeloFin}</div>
            </div>
          </div>
          <div className="p-2 block md:hidden">
            <div className="grid grid-cols-4 w-full">
              <div className="font-semibold">Lote:</div>
              <div className="col-span-3">{props.informationOfCode.lote}</div>
              <div className="font-semibold">Numero op: </div>
              <div className="col-span-3"> {props.informationOfCode.nroOp}</div>
              <div className="font-semibold">modelo:</div>
              <div className="col-span-3"> {props.informationOfCode.modeloFin}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SegHiginie = (props: { debo: any; codigo: string; changeInfo: any; informationOfCode: IAuditDispositivo }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-8 w-full">
        <div className="font-semibold">Codigo</div>
        <TextField
          type="text"
          multiline
          variant="outlined"
          size="medium"
          label="Codigo"
          value={props?.codigo}
          placeholder="Codigo"
          onChange={(e) => {
            props.changeInfo(e);
            props.debo(e.target.value);
          }}
        />
      </div>

      {props.informationOfCode && (
        <div>
          <div className="p-2 hidden md:block">
            <div className="grid grid-cols-4 gap-2 md:gap-8 font-semibold text-lg text-center shadow-elevation-4 rounded-lg bg-blue-600 text-gray-100 ">
              <div>Nombre</div>
              <div>Marca</div>
              <div>Modelo</div>
              <div>año</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 font-medium text-center">
              <div>{props.informationOfCode.nombre}</div>
              <div>{props.informationOfCode.marca}</div>
              <div>{props.informationOfCode.modelo}</div>
              <div>{props.informationOfCode.ano}</div>
            </div>
          </div>
          <div className="p-2 block md:hidden">
            <div className="grid grid-cols-4 w-full">
              <div className="font-semibold">Nombre:</div>
              <div className="col-span-3">{props.informationOfCode.nombre}</div>
              <div className="font-semibold">Marca: </div>
              <div className="col-span-3"> {props.informationOfCode.marca}</div>
              <div className="font-semibold">Modelo:</div>
              <div className="col-span-3"> {props.informationOfCode.modelo}</div>
              <div className="font-semibold">año: </div>
              <div className="col-span-3"> {props.informationOfCode.ano}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const Proceso = (props: any) => {
  return (
    <div className="font-semibold text-center">
      <div>Auditoria de proceso</div>
      <div> no se requiere codigo</div>
    </div>
  );
};

const Ninguno = () => {
  return <div></div>;
};

export const AuditTypeMatcher = ({ codigoChanger, auditTableId, codigo }: Props) => {
  const changeInfo = (e) => {
    codigoChanger(e.target.value.trim());
  };
  const handleInformation = async (e: string) => {
    let info;
    try {
      if (auditTableId == 1) {
        info = unwrapResult(await dispatch(ProduccionInicioSliceRequests.getByCodigoRequest(e)));
      } else {
        info = unwrapResult(
          await dispatch(AuditDispositivoSliceRequests.GetbyTableAndCodigo({ table: auditTableId, codigo: e }))
        );
      }
    } catch (e) {
      info = null;
    }
    if (info) {
      setinformationOfCode(info);
    } else {
      setinformationOfCode(null);
    }
  };
  const debo = useMemo(() => _.debounce(handleInformation, 1000), []);
  const [informationOfCode, setinformationOfCode] = useState(null);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (codigo?.length > 1) {
      debo(codigo);
    }
  }, []);
  console.log(auditTableId);
  const type = (auditTableId) => {
    switch (auditTableId) {
      case 1:
        return <Producto debo={debo} codigo={codigo} changeInfo={changeInfo} informationOfCode={informationOfCode} />;
      case 2:
        return <SegHiginie debo={debo} codigo={codigo} changeInfo={changeInfo} informationOfCode={informationOfCode} />;
      case 3:
        return <Proceso changeInfo={changeInfo} debo={debo} />;
      default:
        return <Ninguno />;
    }
  };
  return (
    <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">{auditTableId && type(auditTableId)}</div>
  );
};
