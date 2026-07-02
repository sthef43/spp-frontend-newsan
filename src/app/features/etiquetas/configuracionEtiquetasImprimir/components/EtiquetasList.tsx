import { unwrapResult } from "@reduxjs/toolkit";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { useAppDispatch } from "app/core/store/store";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import { EtiquetasForm } from "../form/EtiquetasForm";
import { ZPL_EtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetasSlice";
import { IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";

export const EtiquetasList = () => {
  const [tipoEtiquetas, setTipoEtiquetas] = useState(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editState, setEditState] = useState<IZPL_Etiquetas>(null);

  const dispatch = useAppDispatch();

  const getTipoEtiquetas = async () => {
    const result = unwrapResult(await dispatch(ZPL_TipoEtiquetasSliceRequests.getAllRequest()));
    setTipoEtiquetas(result);
  };

  useEffect(() => {
    getTipoEtiquetas();
  }, []);

  const [etiquetas, setEtiquetas] = useState(null);

  const getEtiquetas = async () => {
    const result = unwrapResult(await dispatch(ZPL_EtiquetasSliceRequests.getAllRequest()));
    setEtiquetas(result);
  };

  useEffect(() => {
    getEtiquetas();
  }, []);

  useEffect(() => {
    if (!modalOpen) setEditState(null);
  }, [modalOpen]);

  return (
    <div>
      {tipoEtiquetas && (
        <TableComponent
          Dense={true}
          Overflow={false}
          buscar={true}
          IDcolumn={"id"}
          agregar={() => {
            setEstaEditando(false);
            setModalOpen(true);
          }}
          columns={[
            {
              title: "Nombre",
              field: "descripcionEtiqueta"
            },
            {
              title: "Posiciones",
              field: "cantidadPosiciones"
            },
            {
              title: "Prefijo",
              field: "prefijo"
            },
            {
              title: "Equipo",
              field: "tipoEquipo"
            },
            {
              title: "Activa",
              field: "",
              render: (row) => {
                return row.activa == true ? "SI" : "NO";
              }
            },
            {
              title: "Mensual",
              field: "",
              render: (row) => {
                return row.cambiaMes ? "SI" : "NO";
              }
            },
            {
              title: "Ancho",
              field: "anchoEtiqueta"
            },
            {
              title: "Alto",
              field: "altoEtiqueta"
            },
            {
              title: "PPmm",
              field: "dPmm"
            },
            {
              title: "ZPL",
              field: "zpl"
            },
            {
              title: "TipoEtiqueta",
              field: "",
              render: (row) => {
                return tipoEtiquetas.find((x) => x.id == row.tipoEtiqueta)?.descripcionTipoEtiqueta;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row: any) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          const object = { ...row, DPmm: row.dPmm, ZPL: row.zpl };
                          delete object.dPmm;
                          delete object.zpl;
                          setEditState(object);
                          setModalOpen(true);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          dataInfo={etiquetas}
        />
      )}
      <ModalCompoment title={"Agregar"} openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <EtiquetasForm refresh={getEtiquetas} setOpenPopup={setModalOpen} editState={editState} />
      </ModalCompoment>
    </div>
  );
};
