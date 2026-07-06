import React, { useState } from "react";
import { TableComponent } from "../../../../../../../shared/components/Table/TableComponent";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IOQCModelo } from "app/models/IOQModelo";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCModeloForm } from "./OQCModeloForm";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, PowerSettingsNew } from "@mui/icons-material";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { OQCModeloSliceRequests, oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";

export const OQCModeloTable = (): JSX.Element => {
  const modelos = useAppSelector<IOQCModelo[]>((state) => state.oqcModelo.dataAll);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(false);

  const onEliminar = async (modelo: IOQCModelo) => {
    try {
      if (await getConfirmation("Eliminar Modelo", "Esta seguro que quiere eliminar el modelo")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCModeloSliceRequests.deleteRequest(modelo.id));
        await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(linea.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  const editarEstado = async (modelo: IOQCModelo) => {
    const estadoActivoModelo = modelo.activo;
    try {
      if (
        await getConfirmation(
          `${!estadoActivoModelo ? "Activar" : "Desactivar"} el modelo`,
          `Esta seguro que desea ${!estadoActivoModelo ? "Activar" : "Desactivar"} el modelo`
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const nuevoEstadoModelo = { ...modelo, activo: !estadoActivoModelo };
        await dispatch(OQCModeloSliceRequests.PutRequest(nuevoEstadoModelo));
        await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(linea.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      openNotificationUI(error, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onEdit = (ponderacion: IOQCModelo) => {
    dispatch(oqcModeloSlice.actions.setObject(ponderacion));
    setForm(true);
  };

  const onOpenForm = () => {
    dispatch(oqcModeloSlice.actions.setObject(null));
    setForm(true);
  };

  return (
    <ContainerForPages activeEffectVisible optionsLayout="Table">
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Nombre Motorola",
            field: "modeloMoto"
          },
          {
            title: "Nombre Newsan",
            field: "modeloNewsan"
          },
          {
            title: "Compañia",
            field: "compania"
          },
          {
            title: "EanCode",
            field: "eanCode"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex flex-row">
                  <div>
                    <Tooltip title="Borrar Modelo">
                      <span>
                        <IconButton
                          onClick={() => {
                            onEliminar(row);
                          }}
                          size="small"
                          style={{ position: "relative", cursor: "pointer" }}>
                          <Delete color="error" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Editar Modelo">
                      <span>
                        <IconButton
                          onClick={() => {
                            onEdit(row);
                          }}
                          size="small"
                          style={{ position: "relative", cursor: "pointer" }}>
                          <Edit color="inherit" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Desactivar Modelo">
                      <span>
                        <IconButton
                          onClick={() => {
                            editarEstado(row);
                          }}
                          size="small"
                          style={{ position: "relative", cursor: "pointer" }}>
                          <PowerSettingsNew color={row.activo ? "primary" : "disabled"} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={modelos}
      />
      <ModalCompoment titleModalStyle="Audit" showModalCenterPage onCloseDynamic openPopup={form} setOpenPopup={setForm} title="Agregar/editar un modelo" subTitle="Formulario de modelo OQC">
        <OQCModeloForm closeModal={setForm} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
