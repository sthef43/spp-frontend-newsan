import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ITrazaProductoPuesto } from "app/models/ITrazaProductoPuesto";
import { TrazaProductoPuestoSliceRequests } from "app/features/trazabilidad/slices/TrazaProductoPuestoSlice";
import { TrazabilidadProductoPuestoForm } from "app/features/trazabilidad/modules/puestosDeProductos/modal/TrazabilidadProductoPuestoForm";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IPlant, IProducto } from "app/models";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import _ from "lodash";

export const TrazabilidadProductoPuesto = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { openNotificationUI } = useNotificationUI();
  const [titulo, setTitulo] = useState("");
  const { getConfirmation } = useConfirmationDialog();
  const puestos = useAppSelector((p) => p.productoPuesto.data);
  const [productSelect, setProductSelect] = useState();
  const [productos, setProductos] = useState(null);
  const [plantSelect, setPlantSelect] = useState(0);
  const [plants, setPlants] = useState<IPlant[]>([]);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<ITrazaProductoPuesto | null>(null);

  React.useEffect(() => {
    TitleChanger("Agregar puestos a los productos");
    dispatch(ProductoSliceRequests.getAllRequest());
    getPlants();
  }, []);

  const deleteProductoPuesto = async (row) => {
    const resp = await getConfirmation("Borrar puesto", "Esta seguro que quiere eliminar este puesto?");
    if (resp) {
      const response = unwrapResult(await dispatch(TrazaProductoPuestoSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getPuestos();
      }
    }
  };

  const editar = (rowData) => {
    setEditState({
      id: rowData.id,
      puestoId: rowData.puestoId,
      productoId: rowData.productoId,
      createdDate: rowData.createdDate
    });
    setModalOpen(true);
  };

  const getPuestos = async () => {
    await dispatch(TrazaProductoPuestoSliceRequests.getProductoPuestoByProductoId(productSelect));
  };

  useEffect(() => {
    setTitulo(editState ? "Editar Puesto de Producto" : "Agregar Puesto a Producto");
  }, [editState]);

  /*   React.useEffect(() => {
    console.log(trazaProductoPuestoList);

    if (trazaProductoPuestoList?.length > 0) {
      alert("dola");
      console.log(trazaProductoPuestoList);
      setData(JSON.parse(JSON.stringify(trazaProductoPuestoList)));
      setCargando(false);
    }
  }, [trazaProductoPuestoList]); */

  React.useEffect(() => {
    if (productSelect) getPuestos();
  }, [productSelect]);

  React.useEffect(() => {
    if (Array.isArray(puestos)) {
      console.log(puestos);
      console.log("planta selected " + plantSelect);
      const result = puestos.filter((x) => x.puesto.plantId == plantSelect); //Filtro los puestos por la planta que selecciono
      setData(result);
    }
  }, [puestos]);

  const getPlants = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    setPlants(result);
  };

  const buscarProductos = async (plantId: number) => {
    let fetchLineaResult;
    setData([]);
    //setValue("productoId", 0);
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      fetchLineaResult = JSON.parse(JSON.stringify(fetchLineaResult));
      const productsGroup = _.groupBy(fetchLineaResult, "productoId");
      const key = Object.keys(productsGroup);
      if (key) {
        const productosSinKeys = key.map((k) => {
          return productsGroup[k][0].producto;
        });
        setProductos(productosSinKeys);
      }
      console.log(productos);
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
        <FormControl variant="filled">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select
            label="Seleccione una planta"
            value={plantSelect}
            onChange={(event: any) => {
              if (event.target.value) {
                setPlantSelect(event.target.value);
                buscarProductos(event.target.value);
              }
            }}>
            {plants?.map((plant: IPlant) => (
              <MenuItem key={plant.id} value={plant.id}>
                {plant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel>Seleccione un producto</InputLabel>
          <Select
            label="Seleccione un producto"
            value={productSelect}
            onChange={(event: any) => {
              if (event.target.value) setProductSelect(event.target.value);
            }}>
            {productos?.map((produ: IProducto) => (
              <MenuItem key={produ.id} value={produ.id}>
                {produ.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Puesto",
            field: "puesto.nombre"
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
                    <IconButton
                      onClick={() => {
                        editar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton
                      onClick={() => {
                        deleteProductoPuesto(row.id);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
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
        <TrazabilidadProductoPuestoForm
          puestos={DataOpen}
          productId={productSelect}
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getPuestos}
          plantSelect={plantSelect}
        />
      </ModalCompoment>
    </div>
  );
};
