import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PautaIngenieriaAprobadaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaAprobadaSlice";
import { ChangeCircle, Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { Hoja0Form } from "./Hoja0Form";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IPautaIngenieriaAprobada } from "app/models/IPautaIngenieriaAprobada";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  setOpenPopup: any;
  pautaIngenieriaId: any;
}
//filaSeleccionada tiene el id de LineaProduccion
//productoId es el id del producto que tiene la LineaProduccion
export const PautaIngenieriaCambioVersionModal = ({ setOpenPopup, pautaIngenieriaId }: Props): JSX.Element => {
  const [list, setList] = useState(null);
  const dispatch = useAppDispatch();
  const [modalOpenHoja0, setModalOpenHoja0] = useState(false);
  const [selectedPautaIngenieriaAprobada, setSelectedPautaIngenieriaAprobada] = useState(0);
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [tituloCambioVersion, setTituloCambioVersion] = useState("");

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(PautaIngenieriaAprobadaSliceRequest.getAllRequest()));
    const newResult = result.filter((x) => x.pautaIngenieriaId == pautaIngenieriaId && x.activo);
    setList(newResult);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const { getConfirmation } = useConfirmationDialog();

  const eliminar = async (row: IPautaIngenieriaAprobada) => {
    const resp = await getConfirmation("Eliminar", " ¿ Seguro que desea eliminar ? ");

    if (!resp) return false;

    const result = unwrapResult(await dispatch(PautaIngenieriaAprobadaSliceRequest.deleteRequest(row.id)));
    if (result) openNotificationUI("Eliminado exitosamente :)", "success");
    else openNotificationUI("Error al eliminar :(", "error");
  };

  const { openNotificationUI } = useNotificationUI();

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Codigo",
            field: "codigo"
          },
          {
            title: "Version Proceso",
            field: "versionProceso"
          },
          {
            title: "Generico",
            field: "generico"
          },
          {
            title: "Plataforma",
            field: "plataforma"
          },
          {
            title: "Linea",
            field: "linea"
          },
          {
            title: "Puesto",
            field: "puesto"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Cambiar Versión">
                      <IconButton
                        onClick={() => {
                          setModalOpenHoja0(true);
                          setSelectedPautaIngenieriaAprobada(row.id);
                          setSelectedFamilia(row.generico);
                          setTituloCambioVersion(row.codigo);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <ChangeCircle color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          eliminar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error"></Delete>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        dataInfo={list}
      />
      <ModalCompoment
        title={"Cambio de Versión del codigo: " + tituloCambioVersion}
        openPopup={modalOpenHoja0}
        setOpenPopup={setModalOpenHoja0}>
        <Hoja0Form
          setOpenPoup={setModalOpenHoja0}
          pautaIngenieriaAprobadaId={selectedPautaIngenieriaAprobada}
          pautaIngenieriaId={pautaIngenieriaId}
          familia={selectedFamilia}
          refresh={getList}
        />
      </ModalCompoment>
    </div>
  );
};
