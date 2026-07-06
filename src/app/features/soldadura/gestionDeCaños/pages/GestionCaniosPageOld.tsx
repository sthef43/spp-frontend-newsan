import { Group, Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import React, { useEffect, useState } from "react";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { DobCaniosSubSliceRequests, dobCaniosSubSlice } from "app/Middleware/reducers/DobCaniosSubSlice";
import { GestionCaniosTable } from "app/features/soldadura/gestionDeCaños/components/GestionCaniosTable";
import moment from "moment";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import "animate.css";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import _ from "lodash";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";

interface IGestionCaniosPage {
  informe?: boolean;
}
// Cuando se pasa informe en true se desabilitan varias funciones para solo vista
export const GestionCaniosPageOld = ({ informe = false }: IGestionCaniosPage): JSX.Element => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const dobCaniosSubs = useAppSelector((state) => state.dobCaniosSub.dataAll);
  const dispatch = useAppDispatch();
  const [dateTo, setFechaHasta] = useState("");
  const [dateFrom, setFechaDesde] = useState("");
  const [agrupado, setAgrupado] = useState(false);
  const getHistory = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(
        DobCaniosSubSliceRequests.getAllByDateFromToRequest({
          dateFrom: moment(dateFrom).format("yyyy-MM-DD"),
          dateTo: moment(dateTo).format("yyyy-MM-DD")
        })
      );
      setAgrupado(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onSetGroup = async () => {
    if (!agrupado) {
      if (await getConfirmation("Agrupar", "Desea agrupar por pieza?")) {
        setAgrupado(true);
        setGroup();
      }
    } else {
      if (await getConfirmation("Desagrupar", "Desea desagrupar las piezas?")) {
        setAgrupado(false);
        getHistory();
      }
    }
  };
  const setGroup = () => {
    const dobGroup = _.groupBy(dobCaniosSubs, "dobMaestroPiezaId");
    const keys = Object.keys(dobGroup);
    const newDobCanios: IDobCaniosSub[] = [];
    keys.forEach((key) => {
      const cantDob = dobGroup[key].reduce((cantidad: number, dob) => cantidad + dob.cantDob, 0);
      const cantSol = dobGroup[key].reduce((cantidad: number, dob) => cantidad + dob.cantSol, 0);
      const diferencia = dobGroup[key].reduce((cantidad: number, dob) => cantidad + (dob.cantSol - dob.cantDob), 0);
      newDobCanios.push({
        id: parseInt(key),
        cantDob,
        cantSol,
        diferencia: diferencia != 0,
        dobMaestroPiezaId: parseInt(key),
        dobMaestroPieza: { ...dobGroup[key][0].dobMaestroPieza, generico: "Varios" },
        createdDate: "",
        generico: "Varios"
      });
    });
    dispatch(dobCaniosSubSlice.actions.setGroup(newDobCanios));
  };
  useEffect(() => {
    TitleChanger("Gestión de caños de dobladoras a soldadura");
  }, []);

  return (
    <div className="m-5 shadow-elevation-6">
      <div className="grid grid-cols-4 gap-5  shadow-elevation-4 text-center bg-secondaryNew rounded-lg">
        <div className="col-span-2">
          <SelectOfDate fechaDesdeHasta setFechaDesdeProps={setFechaDesde} setFechaHastaProps={setFechaHasta} />
        </div>
        <div className="max-w-xs h-2/4 m-auto">
          <Button className={classes.purpleButton} variant="contained" startIcon={<Search />} onClick={getHistory}>
            Buscar
          </Button>
        </div>
        <div className="max-w-xs h-2/4 m-auto">
          <Button
            className={classes.yellowButton}
            variant="contained"
            startIcon={<Group />}
            disabled={dobCaniosSubs?.length == 0}
            onClick={onSetGroup}>
            {!agrupado ? "Agrupar" : "Desagrupar"}
          </Button>
        </div>
      </div>
      <div className="animate__animated animate__fadeInUp">
        <GestionCaniosTable refresh={getHistory} informe={informe} />
      </div>
    </div>
  );
};
