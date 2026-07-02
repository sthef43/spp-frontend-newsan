import { Delete, Edit } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ValidarMaterialSliceRequests } from "app/Middleware/reducers/ValidarMaterialSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant, IProducto } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { IValidarMaterial } from "app/models/IValidarMaterial";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ValidarMaterialesForm } from "app/features/trazabilidad/modules/materialesAValidar/modal/ValidarMaterialesForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import _ from "lodash";
import React from "react";

export const ValidarMaterialesPage = () => {
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [plantSelect, setPlantSelect] = React.useState<number>(0);
  const [productSelect, setProductSelect] = React.useState<number>(0);
  const [familiaSelect, setFamiliaSelect] = React.useState<number>(0);
  const [familias, setFamilias] = React.useState<IFamilia[]>([]);
  const [plantas, setPlantas] = React.useState<IPlant[]>([]);
  const [productos, setProductos] = React.useState<IProducto[]>([]);
  const [data, setData] = React.useState<IValidarMaterial[]>([]);
  const [dataEdit, setDataEdit] = React.useState<IValidarMaterial>(null);
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
  const handleGetValidarMateriales = async () => {
    try {
      const response = unwrapResult(await dispatch(ValidarMaterialSliceRequests.getAllByFamiliaId(familiaSelect)));
      setData(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleDelete = async (id) => {
    const response = await getConfirmation("Borrar tipo de material", "Está seguro que desea borrarlo?");
    if (response) {
      const response = unwrapResult(await dispatch(ValidarMaterialSliceRequests.deleteRequest(id)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        handleGetValidarMateriales();
      }
    }
  };
  const handlerFamilias = async () => {
    try {
      const response = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(productSelect)));
      setFamilias(response);
    } catch (e) {
      openNotificationUI(e, "error");
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
    handleGetValidarMateriales();
  };
  React.useEffect(() => {
    TitleChanger("Tipos de materiales");
    getPlantas();
  }, []);
  React.useEffect(() => {
    if (plantSelect) getProducts();
  }, [plantSelect]);
  React.useEffect(() => {
    if (productSelect != 0) handlerFamilias();
  }, [productSelect]);
  React.useEffect(() => {
    if (familiaSelect != 0) handleGetValidarMateriales();
  }, [familiaSelect]);
  return (
    <div className="my-2 mx-4 h-full">
      <div className="py-2 grid grid-cols-3 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
        <FormControl variant="filled">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select
            label="Seleccione un producto"
            value={plantSelect}
            onChange={(event: any) => {
              if (event.target.value) setPlantSelect(event.target.value);
              setProductSelect(0);
              setFamiliaSelect(0);
            }}>
            {plantas?.map((plant: IPlant) => (
              <MenuItem key={plant.id} value={plant.id}>
                {plant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {plantSelect != 0 && (
          <FormControl fullWidth variant="filled">
            <InputLabel>Seleccione un producto</InputLabel>
            <Select
              value={productSelect}
              onChange={(event: any) => {
                if (event.target.value) setProductSelect(event.target.value);
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
        )}
        {productSelect != 0 && (
          <FormControl fullWidth variant="filled">
            <InputLabel>Seleccione una familia</InputLabel>
            <Select
              value={familiaSelect}
              onChange={(event: any) => {
                if (event.target.value) setFamiliaSelect(event.target.value);
              }}>
              {familias &&
                familias.map((x) => (
                  <MenuItem key={x.id} value={x.id}>
                    <div className="w-full">
                      <div>{x.nombre}</div>
                    </div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </div>
      {familiaSelect != 0 && (
        <>
          <TableComponent
            Overflow
            buscar
            IDcolumn={"id"}
            columns={[
              {
                title: "Tipo de material a validar",
                field: "tipoMaterial.nombre"
              },
              {
                title: "Prefijo",
                field: "prefijo"
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
            <ValidarMaterialesForm
              setOpenPopup={setOpenModal}
              editState={dataEdit}
              refresh={refresh}
              familiaId={familiaSelect}
              productId={productSelect}
            />
          </ModalCompoment>
        </>
      )}
    </div>
  );
};
