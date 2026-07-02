import { CircularProgress } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch } from "app/core/store/store";
import { OPsDetalles } from "app/services/planProd.service";

import React, { useEffect, useState } from "react";

interface ModelosProducidosProps {
  identificadorLinea: number;
}

const ModelosProducidos: React.FC<ModelosProducidosProps> = ({ identificadorLinea }) => {
  const [modelos, setModelos] = useState<OPsDetalles[]>();
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const getOps = async () => {
    setLoading(true);
    const result = unwrapResult(await dispatch(PlanProdSliceRequests.GetOPsDelDia(identificadorLinea)));

    setModelos(result);
    setLoading(false);
  };

  useEffect(() => {
    getOps();
  }, [identificadorLinea]);

  if (loading) {
    return (
      <div className="w-full h-[60px] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left ">
      <thead className="text-xs text-white capitalize">
        <tr className="text-lg">
          <th className="px-6 py-2">Modelo</th>
          <th className="px-6 py-2 uppercase">OP</th>
          <th className="px-6 py-2">Restan</th>
        </tr>
      </thead>
      <tbody>
        {modelos &&
          modelos.map((modelo) => (
            <tr key={modelo.nroOP} className="text-[#73EEFF] font-semibold">
              <td className="px-6 py-1">{modelo.modelo}</td>
              <td className="px-6 py-1">{modelo.nroOP}</td>
              <td className="px-6 py-1">{modelo.cantidad - modelo.producido}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ModelosProducidos;
