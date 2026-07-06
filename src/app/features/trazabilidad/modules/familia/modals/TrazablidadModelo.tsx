/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
// import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { ModeloForm } from "app/features/trazabilidad/modules/familia/components/ModeloForm";
import { IModelo } from "app/models/IModelo";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, PowerSettingsNewRounded } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";

import { IProducto } from "app/models";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

interface Props {
  familiaId?: number;
  refresh?: any;
  handleFamilia?: boolean;
}
export const TrazabilidadModelo = ({ familiaId = 0, refresh, handleFamilia = false }: Props): JSX.Element => {
  const modelos = useAppSelector((p) => p.modelo.data);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const { FetchPut } = useFetchApiMultiResults<IModelo>();

  const [titulo, setTitulo] = useState("");
  const [familias, setFamilias] = useState([]);
  const [familiaSelect, setFamiliaSelect] = useState(familiaId || 0);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [dataOpen, setDataOpen] = React.useState<IModelo[]>();

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.getAllByFamiliaId, familiaId, false, familiaId, setListaModelos, true);

  const deleteFamilia = async (row) => {
    const resp = await getConfirmation("Borrar un modelo", "Esta seguro que quiere eliminar este modelo?");
    if (resp) {
      const response = unwrapResult(await dispatch(ModeloSliceRequest.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        dispatch(ModeloSliceRequest.getAllByFamiliaId(familiaSelect));
      }
    }
  };

  const activarModeloRenacer = async (modelo: IModelo) => {
    const clonModelo: IModelo = { ...modelo, modeloRenacer: !modelo.modeloRenacer };
    FetchPut({
      consoleLog: false,
      modelPut: clonModelo,
      sliceRequest: ModeloSliceRequest.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: `${modelo.modeloRenacer ? "Desactivar" : "Activar"} Modelo Para Renacer`,
      messageUser: `Desea ${modelo.modeloRenacer ? "desactivar" : "activar"} el modelo para poder usarlo en renacer?`,
      functionAdd: async (actualizacion) => {
        const response = unwrapResult(await dispatch(ModeloSliceRequest.getAllRequest()));
        if (response) {
          openNotificationUI(
            `Se ${actualizacion.modeloRenacer ? "Activo" : "Desactivo"} el modelo correctamente`,
            "success"
          );
          setListaModelos(response);
        }
      }
    });
  };

  const getModels = async () => {
    await dispatch(ModeloSliceRequest.getAllByFamiliaId(familiaSelect));
  };

  const [editState, setEditState] = React.useState<IModelo | null>(null);
  const editar = (rowData) => {
    setEditState({
      id: rowData.id,
      nombre: rowData.nombre,
      familia: rowData.familia,
      descripcion: rowData.descripcion,
      familiaId: rowData.familiaId,
      createdDate: rowData.createdDate
    });
    setModalOpen(true);
  };

  useEffect(() => {
    setTitulo(editState ? "Editar un modelo" : "Agregar un modelo");
  }, [editState]);

  React.useEffect(() => {
    if (Array.isArray(modelos)) {
      setDataOpen(modelos);
    }
  }, [modelos]);

  React.useEffect(() => {
    TitleChanger("Agregar modelos");
    dispatch(ProductoSliceRequests.getAllRequest());
  }, []);

  useEffect(() => {
    if (producto) {
      setFamiliaSelect(null);
      dispatch(FamiliaSliceRequests.getAllByProductoId(producto.id));
    }
  }, [producto]);

  useEffect(() => {
    if (familiaSelect) {
      getModels();
    }
  }, [familiaSelect]);

  useEffect(() => {
    if (producto && producto.id > 0) {
      setFamiliaSelect(familiaId);
      getFamilias(producto.id);
    }
  }, [producto]);

  const getFamilias = async (productSelect) => {
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(productSelect)));
    if (result) {
      setFamilias(result);
    } else setFamilias([]);
  };

  return (
    <div className="my-2 mx-4 h-full">
      {listaModelos && listaModelos.length > 0 && (
        <TableComponent
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Nombre ",
              field: "nombre"
            },
            {
              title: "Descripción",
              field: "descripcion"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Editar Modelo">
                        <IconButton
                          onClick={() => {
                            editar(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar Modelo">
                        <IconButton
                          onClick={() => {
                            deleteFamilia(row.id);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title={`${row.modeloRenacer ? "Desactivar" : "Activar"} Modelo Para Renacer`}>
                        <IconButton
                          onClick={() => {
                            activarModeloRenacer(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <PowerSettingsNewRounded color={row.modeloRenacer ? "primary" : "disabled"} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            if (familiaSelect) {
              setModalOpen(true);
              setEditState(null);
            } else {
              openNotificationUI("Seleccione los campos", "error");
            }
          }}
          dataInfo={listaModelos}
        />
      )}
      <ModalCompoment title={titulo} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <ModeloForm setOpenPopup={setModalOpen} editState={editState} familiaId={familiaSelect} refresh={getModels} />
      </ModalCompoment>
    </div>
  );
};
