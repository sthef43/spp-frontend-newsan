import { Delete, Edit } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { TipoMaterialSliceRequests } from "app/features/trazabilidad/slices/TipoMaterialSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant, IProducto } from "app/models";
import { ITipoMaterial } from "app/models/ITipoMaterial";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { TipoMaterialesForm } from "app/features/trazabilidad/modules/tipoDeMateriales/modal/TipoMaterialesForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import _ from "lodash";
import React from "react";

export const TipoMaterialPage = () => {
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [plantSelect, setPlantSelect] = React.useState();
  const [productSelect, setProductSelect] = React.useState<number>(0);
  const [plantas, setPlantas] = React.useState<IPlant[]>([]);
  const [productos, setProductos] = React.useState<IProducto[]>([]);
  const [data, setData] = React.useState<ITipoMaterial[]>([]);
  const [dataEdit, setDataEdit] = React.useState<ITipoMaterial>(null);
  const [titulo, setTitulo] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const getPlantas = async () => {
    try {
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setPlantas(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getProducts = async () => {
    let fetchLineaResult;
    setData([]);
    try {
      fetchLineaResult = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantSelect))
      );
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      fetchLineaResult = JSON.parse(JSON.stringify(fetchLineaResult));
      const productsGroup = _.groupBy(fetchLineaResult, "productoId");
      console.log(productsGroup);
      const key = Object.keys(productsGroup);
      console.log(key);
      if (key) {
        const productosSinKeys = key.map((k) => {
          return productsGroup[k][0].producto;
        });
        setProductos(productosSinKeys);
      }
    }
  };
  const handleGetTiposMateriales = async (productoId) => {
    try {
      const response = unwrapResult(await dispatch(TipoMaterialSliceRequests.getAllByProductId(productoId)));
      setData(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleDelete = async (id) => {
    const response = await getConfirmation("Borrar tipo de material", "Está seguro que desea borrarlo?");
    if (response) {
      const response = unwrapResult(await dispatch(TipoMaterialSliceRequests.deleteRequest(id)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        handleGetTiposMateriales(productSelect);
      }
    }
  };
  const handleAddTipoMaterial = () => {
    setTitulo("Agregar un tipo de material");
    setDataEdit(null);
    setOpenModal(true);
  };
  const handleEdit = (row) => {
    setTitulo("Editar un tipo de material");
    setDataEdit(row);
    setOpenModal(true);
  };
  const refresh = () => {
    handleGetTiposMateriales(productSelect);
  };
  React.useEffect(() => {
    TitleChanger("Tipos de materiales");
    getPlantas();
  }, []);
  React.useEffect(() => {
    if (plantSelect) getProducts();
  }, [plantSelect]);
  return (
    <div className="my-2 mx-4 h-full">
      <div className="py-2 grid grid-cols-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
        <FormControl variant="filled">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select
            label="Seleccione un producto"
            value={plantSelect}
            onChange={(event: any) => {
              if (event.target.value) setPlantSelect(event.target.value);
            }}>
            {plantas?.map((plant: IPlant) => (
              <MenuItem key={plant.id} value={plant.id}>
                {plant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="filled">
          <InputLabel>Seleccione un producto</InputLabel>
          <Select
            value={productSelect}
            onChange={(event: any) => {
              if (event.target.value) setProductSelect(event.target.value);
              handleGetTiposMateriales(event.target.value);
            }}>
            {productos &&
              productos.map((x) => (
                <MenuItem key={x.id} value={x.id}>
                  <div className="w-full">
                    <div>{x.nombre}</div>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      {productSelect != 0 && (
        <>
          <TableComponent
            Overflow
            buscar
            IDcolumn={"id"}
            columns={[
              {
                title: "Nombre",
                field: "nombre"
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
                              handleEdit(row);
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
                              handleDelete(row.id);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            agregar={() => {
              handleAddTipoMaterial();
            }}
            dataInfo={data}
          />
          <ModalCompoment title={titulo} openPopup={openModal} setOpenPopup={setOpenModal}>
            <TipoMaterialesForm
              setOpenPopup={setOpenModal}
              editState={dataEdit}
              refresh={refresh}
              productoId={productSelect}
            />
          </ModalCompoment>
        </>
      )}
    </div>
  );
};
