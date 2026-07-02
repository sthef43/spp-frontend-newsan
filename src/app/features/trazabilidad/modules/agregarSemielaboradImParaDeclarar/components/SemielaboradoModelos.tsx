import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SemielaboradoModelosSliceRequests } from "app/Middleware/reducers/SemielaboradoModelosSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { SemielaboradoModelosForm } from "../modal/SemielaboradoModelosForm";
import { SemielaboradoModelosTable } from "./SemielaboradoModelosTable";
interface Props {
  semielaboradoId: number;
  lineaId: number;
}
export const SemielaboradoModelos = ({ semielaboradoId, lineaId }: Props) => {
  const semielaboradosModelos = useAppSelector((state) => state.semielaboradoModelos.dataAll);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const getAllBySemielaboradoId = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoModelosSliceRequests.getAllBySemiIdRequest(semielaboradoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    semielaboradoId != 0 && getAllBySemielaboradoId();
  }, [semielaboradoId]);

  return (
    <div>
      <SemielaboradoModelosForm semielaboradoId={semielaboradoId} refresh={getAllBySemielaboradoId} lineaId={lineaId} />
      {semielaboradosModelos.length > 0 && <SemielaboradoModelosTable refresh={getAllBySemielaboradoId} />}
      {semielaboradosModelos.length == 0 && (
        <TitleUIComponent
          title="No hay modelos asignados"
          classNameDiv="w-full whitespace-wrap mx-0"
          classNameTitle="text-base"
        />
      )}
    </div>
  );
};
