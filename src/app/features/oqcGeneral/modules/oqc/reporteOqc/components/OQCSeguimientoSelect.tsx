import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { OQCHallazgoResultBloq } from "../../realizarOqc/components/OQCHallazgoResultBloq";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { Button, Divider } from "@mui/material";
import { oqcSeguimientoSlice } from "app/features/oqcGeneral/slices/OQCSeguimientoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { OQCSeguimientoForm } from "./OQCSeguimientoForm";
import {
  oqcHallazgoResultSlice,
  OQCHallazgoResultSliceRequests
} from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";

interface IOQCSeguimientoSelect {
  closeModal: (state: boolean) => void;
  refresh: () => void;
}
export const OQCSeguimientoSelect = ({ closeModal, refresh }: IOQCSeguimientoSelect): JSX.Element => {
  const buttonColor = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [seguimientoForm, setSeguimientoForm] = useState(false);
  const oqcHallazgoResult = useAppSelector<IOQCHallazgoResult[]>((state) => state.oqcHallazgoResult.dataAll);
  const oqcDesRes = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);

  const onSeguimiento = (bloqueHallazgoResult: IOQCHallazgoResult): void => {
    dispatch(oqcHallazgoResultSlice.actions.setObject(bloqueHallazgoResult));
    if (bloqueHallazgoResult.oqcSeguimiento) {
      dispatch(oqcSeguimientoSlice.actions.setObject(bloqueHallazgoResult.oqcSeguimiento));
    } else {
      dispatch(oqcSeguimientoSlice.actions.setObject(null));
    }
    setSeguimientoForm(true);
  };
  const onRefresh = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCHallazgoResultSliceRequests.getAllByOQCDesResIdRequest(oqcDesRes.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    return () => {
      dispatch(oqcHallazgoResultSlice.actions.setClear());
      refresh();
    };
  }, []);
  return (
    <div>
      {oqcHallazgoResult
        .filter((blq) => blq.state == false)
        .map((bloHa, index) => (
          <div key={bloHa.id} className="w-full p-5 flex flex-row  gap-5">
            <Divider key={index} />
            <OQCHallazgoResultBloq bloHa={bloHa.oqcBloqueHallazgo} view />
            <div className="m-auto">
              <Button
                className={bloHa.oqcSeguimiento ? buttonColor.greenButton : buttonColor.blueButton}
                onClick={() => onSeguimiento(bloHa)}>
                {bloHa.oqcSeguimiento ? "Ver seguimiento" : "Dar seguimiento"}
              </Button>
            </div>
          </div>
        ))}
      <ModalCompoment
        title="Dar seguimiento a un hallazo NG"
        openPopup={seguimientoForm}
        setOpenPopup={setSeguimientoForm}>
        <OQCSeguimientoForm closeModal={setSeguimientoForm} refresh={refresh} />
      </ModalCompoment>
    </div>
  );
};
