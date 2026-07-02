import React from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LineaProduccionForm } from "app/features/trazabilidad/modules/lineaDeProduccion/modals/LineaProduccionForm";
import { IconButton, Tooltip } from "@mui/material";
import { Add, Assignment, ClearAll, Delete, Edit } from "@mui/icons-material";
import { AccionAsignarPuestos } from "../modals/AccionAsignarPuestos";
import { AccionAsignarFamilias } from "../modals/AccionAsignarFamilias";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useHistory } from "react-router-dom";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";

export const TrazabilidadLineaProduccion = (): JSX.Element => {
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const producto = useAppSelector((state) => state.producto.object);
  const planta = useAppSelector((state) => state.plant.object);

  const [DataOpen, setData] = React.useState(null);

  const [titulo, setTitulo] = React.useState("");
  const [tituloAccionPuestos, setTituloAccionPuestos] = React.useState(null);
  const [tituloAccionFamilias, setTituloAccionFamilias] = React.useState(null);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [ModalPuestosOpen, setModalPuestosOpen] = React.useState(false);
  const [ModalFamiliasOpen, setModalFamiliasOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<ILineaProduccion | null>(null);
  const [filaSeleccionada, setFilaSeleccionada] = React.useState();
  const [productoId, setProductoId] = React.useState();
  const [lineaProduccionList, setLineaProduccionList] = React.useState(null);

  const deleteLinea = async (row) => {
    const resp = await getConfirmation("Borrar una linea", "Esta seguro que quiere eliminar esta linea de producción?");
    if (resp) {
      const response = unwrapResult(await dispatch(LineaProduccionSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getLineas();
      }
    }
  };

  const getLineas = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let response = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllByProductId(producto.id)));
    if (!response) console.log("sin lineas");
    response = response.filter((x) => x.plantId == planta?.id);
    setLineaProduccionList(response);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const editar = (rowData) => {
    setEditState(rowData);
    setModalOpen(true);
  };

  const accionAsignarPuestos = (rowData) => {
    setTituloAccionPuestos("Asignacion de Puestos para la Linea: " + rowData.nombre);
    setFilaSeleccionada(rowData.id);
    setProductoId(rowData.productoId);
    setModalPuestosOpen(true);
  };

  const accionAsignarFamilias = (rowData) => {
    setTituloAccionFamilias("Asignacion de Familias para la Linea: " + rowData.nombre);
    setProductoId(rowData.productoId);
    setFilaSeleccionada(rowData.id);
    setModalFamiliasOpen(true);
  };

  const getAccionAsignarPuestos = (row) => {
    if (row.lineaPuesto?.length > 0) {
      return (
        <Tooltip title="Asignar Puestos">
          <IconButton
            onClick={() => {
              accionAsignarPuestos(row);
            }}
            size="small"
            style={{ position: "relative" }}>
            <Add color="success" />
          </IconButton>
        </Tooltip>
      );
    } else
      return (
        <Tooltip title="Asignar Puestos">
          <IconButton
            onClick={() => {
              accionAsignarPuestos(row);
            }}
            size="small"
            style={{ position: "relative" }}>
            <Add color="error" />
          </IconButton>
        </Tooltip>
      );
  };

  const getColorClearAll = (row) => {
    if (row.lineaProduccionFamilia.length > 0) return <ClearAll color="success" />;
    else return <ClearAll color="error" />;
  };
  React.useEffect(() => {
    setTitulo(editState ? "Editar una linea de producción" : "Agregar una linea de producción");
  }, [editState]);

  React.useEffect(() => {
    if (lineaProduccionList) {
      setData(lineaProduccionList);
    }
    return () => {
      setData([]);
    };
  }, [lineaProduccionList]);

  React.useEffect(() => {
    TitleChanger("Agregar lineas de producción");
    return () => {
      setData([]);
    };
  }, []);
  React.useEffect(() => {
    if (producto) getLineas();
  }, [producto]);
  React.useEffect(() => {
    setData([]);
  }, [planta]);

  return (
    <div className="my-2 mx-4 h-full w-full">
      <SelectOFPlantAndProducts />
      <TableComponent
        Dense={true}
        Overflow={true}
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
            title: "Tiene el traza nuevo?",
            field: "",
            render: (row) => (row.trazaSPP ? "Si" : "No")
          },
          {
            title: "Planta",
            field: "plant.name"
          },
          {
            title: "Producto",
            field: "producto.nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar">
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
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          deleteLinea(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>{getAccionAsignarPuestos(row)}</div>
                  <div>
                    <Tooltip title="Asignar Familias">
                      <IconButton
                        onClick={() => {
                          accionAsignarFamilias(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        {getColorClearAll(row)}
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Configuracion de puestos">
                      <IconButton
                        size="small"
                        style={{ position: "relative" }}
                        onClick={() => {
                          //row.id = modeloId
                          history.push(`/main/trazabilidad/configuracion-puestos/${row.id}`);
                        }}>
                        <Assignment>Asignar puesto</Assignment>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setModalOpen(true);
          setEditState(null);
        }}
        dataInfo={DataOpen}
      />
      <ModalCompoment title={titulo} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <LineaProduccionForm
          lineasProduccion={DataOpen}
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getLineas}
          productId={producto?.id}
          plant={planta?.id}
        />
      </ModalCompoment>
      <ModalCompoment title={tituloAccionPuestos} openPopup={ModalPuestosOpen} setOpenPopup={setModalPuestosOpen}>
        <AccionAsignarPuestos
          setOpenPopup={setModalPuestosOpen}
          filaSeleccionada={filaSeleccionada}
          productoId={productoId}
          refresh={getLineas}
        />
      </ModalCompoment>
      <ModalCompoment title={tituloAccionFamilias} openPopup={ModalFamiliasOpen} setOpenPopup={setModalFamiliasOpen}>
        <AccionAsignarFamilias
          filaSeleccionada={filaSeleccionada}
          setOpenPopup={setModalFamiliasOpen}
          productId={productoId}
          refresh={getLineas}
        />
      </ModalCompoment>
    </div>
  );
};
