import React, { useEffect, useState } from "react";
import { SEH_EPP } from "../../interfaces/SEH_EPP";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { EPPForm } from "../../components/EPPForm";
import FetchApi from "app/shared/helpers/FetchApi";
import { SEHEPPSliceRequest } from "../../reducers/SEH_EPPSlice";
import { Edit, Delete } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

export const AuditoriasEPPPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eppSelected, setEppSelected] = useState<SEH_EPP>();
  const [restart, setRestart] = useState(false);

  useEffect(() => {
    TitleChanger("Elementos de Proteccion Personal");
  });

  const [epp, setEPP] = useState<SEH_EPP[]>([]);
  FetchApi(SEHEPPSliceRequest.getAllRequest, null, true, restart, setEPP);

  const onAdd = () => {
    setOpenModalAdd(true);
  };

  const onSubmit = (value: boolean) => {
    setOpenModalAdd(!value); //?
    if (value) {
      setRestart(!restart);
    }
  };

  const onDelete = async (idEpp: number) => {
    try {
      if (
        await getConfirmation(
          "Eliminar Elemento de Seguridad",
          "¿Esta seguro de eliminar el elemento?",
          null,
          "Eliminar",
          "Cancelar"
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Elimnado..."));
        const response = unwrapResult(await dispatch(SEHEPPSliceRequest.deleteRequest(idEpp)));
        if (!response) throw "No se pudo completar la operacion";
        openNotificationUI("Elemento Elimnado", "success");
        setRestart(!restart);
      }
    } catch (e) {
      openNotificationUI(e?.message || "Ha Ocurrido un Error", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    if (!openModalAdd) {
      setEditMode(false);
      setEppSelected(null);
    }
  }, [openModalAdd]);

  return (
    <div className="w-full h-full">
      {!epp || epp.length == 0 ? (
        <div className="w-full p-4 my-4 shadow-lg border border-slate-300 rounded-md">
          <Button fullWidth variant="contained" color="primary" className={buttonClasses.blueButton} onClick={onAdd}>
            Agregar
          </Button>
        </div>
      ) : (
        <TableComponent
          IDcolumn="id"
          columns={[
            {
              title: "EPP",
              field: "",
              render: (row: SEH_EPP) => <span className="capitalize">{row.nombre}</span>
            },
            {
              title: "DESCRIPCION",
              field: "descripcion"
            },
            {
              title: "",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          setEditMode(true);
                          setEppSelected(row);
                          setOpenModalAdd(true);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          onDelete(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          buscar={true}
          Dense={true}
          dataInfo={epp}
          agregar={onAdd}
        />
      )}

      <ModalCompoment
        openPopup={openModalAdd}
        setOpenPopup={setOpenModalAdd}
        title={`${editMode ? "Editar " : "Cargar "} Elementos de seguridad`}>
        <EPPForm editMode={editMode} model={eppSelected} submit={onSubmit} />
      </ModalCompoment>
    </div>
  );
};
