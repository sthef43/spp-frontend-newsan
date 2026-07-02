import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { DotacionesFilter } from "./DotacionesFilter";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotaFamiliaLineaProduccionSliceRequests } from "app/Middleware/reducers/DotaFamiliaLineaProduccionSlice";
import { IDotaFamiliaLineaProduccion } from "app/models/IDotaFamiliaLineaProduccion";
import { DotacionesFormulariosButtom } from "./DotacionesFormulariosButtom";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { DotaSectorPuestoform } from "./DotaSectorPuestoForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, Typography } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { DotaSectorPuestoformEdit } from "./DotaSectorPuestoformEdit";
import { IDotaHistorico } from "app/models/IDotaHistorico";
import { DotaHistoricoSliceRequests } from "app/Middleware/reducers/DotaHistoricoSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { DotaHistoricoList } from "./DotaHistoricoList";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";

export const DotacionesPage = () => {
  const datosFiltroInterface = {
    plantId: 0,
    lineaProduccionId: 0,
    dotaFamiliaId: 0
  };

  const { getConfirmation } = useConfirmationDialog();
  const colorButtons = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const classButtons = MaterialButtons();
  const dispatch = useAppDispatch();
  const [dotaFamiliaLineaProduccion, setDotaFamiliaLineaProduccion] = useState<IDotaFamiliaLineaProduccion>();
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [refreshFamilia, setRefreshFamilia] = useState(false);
  const [datosFiltro, setDatosFiltro] = useState(datosFiltroInterface);
  const [listDotaHistorico, setListDotaHistorico] = useState<IDotaHistorico[]>([]);
  const [arrayListDotaHistorico, setArrayListDotaHistorico] = useState([]);

  //Una vez que selecciona planta linea y familia, traigo la informacion de dotaFamiliaLineaProduccion
  useEffect(() => {
    onInit();
  }, [datosFiltro]);

  const onInit = () => {
    const { plantId, dotaFamiliaId, lineaProduccionId } = datosFiltro;
    if (plantId != 0 && dotaFamiliaId != 0 && lineaProduccionId != 0) {
      getDotaFamiliaLineaProduccion();
      getDotaHistoricoByLineaAndFamilia();
    }
  };

  const getDotaFamiliaLineaProduccion = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaFamiliaLineaProduccionSliceRequests.GetByFamiliaAndLinea({
          dotaFamiliaId: datosFiltro.dotaFamiliaId,
          lineaProduccionId: datosFiltro.lineaProduccionId
        })
      )
    );
    if (result) {
      console.log(result);
      setDotaFamiliaLineaProduccion(result);
    } else setDotaFamiliaLineaProduccion(null);
  };

  //Retorna el ultimo numero que debe ir.
  const GetNumeroSiguienteByLineaAndFamilia = async (lineaProduccionId: number, dotaFamiliaId: number) => {
    const result = unwrapResult(
      await dispatch(
        DotaHistoricoSliceRequests.getNumeroSiguienteByLineaAndFamiliaRequest({
          lineaProduccionId: lineaProduccionId,
          dotaFamiliaId: dotaFamiliaId
        })
      )
    );
    if (result) {
      return result;
    } else return 1;
  };

  const ponerVigente = async () => {
    const acepta = await getConfirmation("Poner en vigente", "¿ Seguro que desea poner en vigente ?");
    if (!acepta) return false;
    //Obtiene la numeracion que debe tener los nuevos registros a guardar.
    const numeroSiguiente = await GetNumeroSiguienteByLineaAndFamilia(
      dotaFamiliaLineaProduccion.lineaProduccionId,
      dotaFamiliaLineaProduccion.dotaFamiliaId
    );
    const arrayDotaHistoric: IDotaHistorico[] = [];
    //Itero sobre la estructura (dotaSectorPuesto) y voy generando los registros de dotaHistoric.
    for (let index = 0; index < dotaFamiliaLineaProduccion.dotaSectorPuesto.length; index++) {
      const sectorPuesto = dotaFamiliaLineaProduccion.dotaSectorPuesto[index];
      const dotaHistoric: IDotaHistorico = {
        dotaFamiliaId: dotaFamiliaLineaProduccion.dotaFamiliaId,
        lineaProduccionId: dotaFamiliaLineaProduccion.lineaProduccionId,
        sector: sectorPuesto.dotaSector.nombre,
        puesto: sectorPuesto.dotaPuesto.nombre,
        activo: true,
        cantidad: sectorPuesto.cantidad,
        numeracion: numeroSiguiente
      };
      arrayDotaHistoric.push(dotaHistoric);
    }
    await updateHistoricosViejos();
    await guardarDotaHistoric(arrayDotaHistoric);
    sendEmailDotacionVigente(arrayDotaHistoric);
    onInit();
  };

  const sendEmailDotacionVigente = async (listDotaHistoric: IDotaHistorico[]) => {
    const { dotaFamiliaId, plantId, lineaProduccionId } = datosFiltro;
    unwrapResult(
      await dispatch(
        EmailSliceRequest.SendEmailDotacionVigente({
          dotaFamiliaId: dotaFamiliaId,
          plantId: plantId,
          lineaProduccionId: lineaProduccionId,
          listDotaHistoric: listDotaHistoric
        })
      )
    );
  };

  //Paso a inactivo los registros que estaban activos.
  const updateHistoricosViejos = async () => {
    let dotaHistoricList = [];
    dotaHistoricList = await getListDotaHistoricoActivos();

    //Los pongo inactivos
    dotaHistoricList = dotaHistoricList.map((x) => {
      return { ...x, activo: false };
    });

    updateDotaHistoric(dotaHistoricList); //actualizo
  };

  const getListDotaHistoricoActivos = async () => {
    let result = unwrapResult(
      await dispatch(
        DotaHistoricoSliceRequests.getListByLineaAndFamiliaRequest({
          dotaFamiliaId: datosFiltro.dotaFamiliaId,
          lineaProduccionId: datosFiltro.lineaProduccionId
        })
      )
    );
    if (result) {
      result = result.filter((x) => x.activo); //Filtro solo los activos
      return result;
    } else return null;
  };

  const updateDotaHistoric = async (listDotaHistoric: IDotaHistorico[]) => {
    const result = unwrapResult(await dispatch(DotaHistoricoSliceRequests.multiPutRequest(listDotaHistoric)));
    if (result) {
      console.log("pasados a activos correctamente.");
    }
  };

  //Guarda la dotacion en historico, todos los objetos van activos, son los que se muestran en informes.
  const guardarDotaHistoric = async (arrayDotaHistoric: IDotaHistorico[]) => {
    const result = unwrapResult(await dispatch(DotaHistoricoSliceRequests.multiPostRequest(arrayDotaHistoric)));
    if (result) {
      openNotificationUI("Pasado a vigente con exito :)", "success");
    }
  };

  const seguirEditando = () => {
    setOpenModalEdit(true);
  };

  const getDotaHistoricoByLineaAndFamilia = async () => {
    const result = unwrapResult(
      await dispatch(
        DotaHistoricoSliceRequests.getListByLineaAndFamiliaRequest({
          dotaFamiliaId: datosFiltro.dotaFamiliaId,
          lineaProduccionId: datosFiltro.lineaProduccionId
        })
      )
    );
    if (result) {
      setListDotaHistorico(result);
    } else setListDotaHistorico([]);
  };

  // Crear un objeto donde las claves son los valores únicos de "numeracion"
  const gruposPorNumeracion = listDotaHistorico.reduce((grupos, objeto) => {
    const numeracion = objeto.numeracion;

    // Si el grupo para esta numeración no existe, créalo
    if (!grupos[numeracion]) {
      grupos[numeracion] = [];
    }

    // Agrega el objeto al grupo correspondiente
    grupos[numeracion].push(objeto);

    return grupos;
  }, {} as { [numeracion: number]: IDotaHistorico[] });

  const separarPorNumeracion = () => {
    const arraysPorNumeracion = Object.values(gruposPorNumeracion);
    setArrayListDotaHistorico(arraysPorNumeracion.reverse());
  };

  useEffect(() => {
    if (listDotaHistorico && listDotaHistorico.length > 0) {
      separarPorNumeracion();
    } else setArrayListDotaHistorico([]);
  }, [listDotaHistorico]);

  return (
    <div>
      <div className="my-2 h-full">
        <div className="flex justify-around rounded-lg px-4 w-full my-2 bg-secondaryNew shadow-elevation-4">
          <div className="w-3/4 flex justify-around">
            <div className="1/4">
              <Button className={classButtons.purpleButton} onClick={() => setOpenModal(true)}>
                Agregar Dotacion
              </Button>
            </div>
            <div className="w-3/4">
              <DotacionesFilter
                setDatosFiltro={setDatosFiltro}
                datosFiltro={datosFiltro}
                refreshFamilia={refreshFamilia}></DotacionesFilter>
            </div>
          </div>
          <div className="w-1/4">
            <DotacionesFormulariosButtom setRefreshFamilia={setRefreshFamilia}></DotacionesFormulariosButtom>
          </div>
        </div>
        <div className="w-full">
          {dotaFamiliaLineaProduccion && (
            <div className="flex p-4">
              <div
                className="w-1/4"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center"
                }}>
                <Typography>{moment(dotaFamiliaLineaProduccion.createdDate).format("L")}</Typography>
                <Button className={colorButtons.blueButton} onClick={seguirEditando}>
                  Seguir Editando
                </Button>
                <Button className={colorButtons.greenButton} onClick={ponerVigente}>
                  Poner Vigente
                </Button>
              </div>
              <div className="w-3/4">
                <TableComponent
                  Dense={true}
                  Overflow={false}
                  buscar={false}
                  IDcolumn={"id"}
                  columns={[
                    {
                      title: "Sector",
                      field: "dotaSector.nombre"
                    },
                    {
                      title: "Puesto",
                      field: "dotaPuesto.nombre"
                    },
                    {
                      title: "Cantidad",
                      field: "cantidad"
                    }
                  ]}
                  dataInfo={dotaFamiliaLineaProduccion.dotaSectorPuesto}
                />
              </div>
            </div>
          )}
          {arrayListDotaHistorico && (
            <DotaHistoricoList arrayListDotaHistorico={arrayListDotaHistorico}></DotaHistoricoList>
          )}
        </div>
      </div>
      {/* Para agregar dotacion nueva */}
      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title={"Alta dotacion."}>
        <DotaSectorPuestoform
          setOpenModal={setOpenModal}
          refresh={getDotaFamiliaLineaProduccion}></DotaSectorPuestoform>
      </ModalCompoment>
      {/* Para editar una dotacion */}
      {dotaFamiliaLineaProduccion && (
        <ModalCompoment openPopup={openModalEdit} setOpenPopup={setOpenModalEdit} title={"Edicion de dotacion."}>
          <DotaSectorPuestoformEdit
            dotaFamiliaLineaProduccion={dotaFamiliaLineaProduccion}
            onInit={onInit}></DotaSectorPuestoformEdit>
        </ModalCompoment>
      )}
    </div>
  );
};
