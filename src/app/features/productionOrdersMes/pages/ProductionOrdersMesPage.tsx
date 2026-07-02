import { FamiliesSliceRequests } from "app/Middleware/reducers/mes/familiesSlice";
import { ProductionOrdersSliceRequests } from "app/Middleware/reducers/mes/productionOrdersSlice";
import { ProductLinesSliceRequests } from "app/Middleware/reducers/mes/productLinesSlice";
import { useAppDispatch } from "app/core/store/store";
import { IFamilies } from "app/models/mes/IFamilies";
import { IProductionOrders } from "app/models/mes/IProductionOrders";
import { IProductLines } from "app/models/mes/IProductLines";
import { IProducts } from "app/models/mes/IProducts";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ModalProductionOrdersMes } from "app/features/productionOrdersMes/components/ModalProductionOrdersMes.component";
import { TableProductionOrdersMes } from "app/features/productionOrdersMes/components/TableProductionOrdersMes.component";
import useFetchApi from "app/shared/hooks/useFetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Button, MenuItem, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import produce from "immer";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
export const ProductionOrdersMesPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  //   const { State: factories, setState: setfactories } = useFetchApi<IFactories>(
  //     FactoriesSliceRequests.getByIdRequest,
  //     3
  //   );
  const buttonClasses = MaterialButtons();
  const { State: lines, setState: setLines } = useFetchApi<IProductLines[]>(ProductLinesSliceRequests.getAllRequest);
  const [selectedProductLines, setSelectedProductLines] = useState<IFamilies>(null);
  const [families, setFamilies] = useState<IFamilies[]>([]);
  const [selectedFamilia, setSelectedFamilia] = useState<IFamilies>(null);
  const [openModal, setopenModal] = useState(false);
  //   const { State: product, setState: setProduct } = useFetchApi<IProducts[]>(ProductsSliceRequests.getAllRequest);
  const [selectedProduct, setSelectedProduct] = useState<IProducts>(null);
  const [productionOrders, setProductionOrders] = useState<IProductionOrders[]>([]);
  const [editProduction, seteditProduction] = useState<IProductionOrders>(null);
  const editProductionCallback = useCallback((produccion) => {
    seteditProduction(produccion);
    setopenModal(true);
  }, []);
  useEffect(() => {
    TitleChanger("Ordernes de producción");
  }, []);
  const changeSelectedFamilia = (e) => {
    setSelectedFamilia(
      produce((draft) => {
        draft = _.cloneDeep(e.target.value);
        return draft;
      })
    );
    setSelectedProduct(null);
  };
  const changeSelectedProducto = (e) => {
    setSelectedProduct(
      produce((draft) => {
        draft = _.cloneDeep(e.target.value);
        return draft;
      })
    );
  };

  const getInforProdOrders = async () => {
    let result;
    if (selectedProduct?.id) {
      result = unwrapResult(
        await dispatch(ProductionOrdersSliceRequests.getByProduct({ producto: selectedProduct.id, planta: 3 }))
      );
    } else {
      result = [];
    }
    setProductionOrders(result);
  };
  useEffect(() => {
    getInforProdOrders();
  }, [selectedProduct]);

  const changeSelectedProductLine = (e) => {
    setSelectedProductLines(
      produce((draft) => {
        draft = _.cloneDeep(e.target.value);
        return draft;
      })
    );
  };
  const getInfoFamilies = async () => {
    let result;
    if (selectedProductLines?.id) {
      result = unwrapResult(await dispatch(FamiliesSliceRequests.getbyproductoLinea(selectedProductLines.id)));
    } else {
      result = [];
    }
    //console.log(result);
    setFamilies(result);
    setSelectedFamilia(null);
    setSelectedProduct(null);
    setProductionOrders([]);
  };
  useEffect(() => {
    console.log("getInfoFamilies");
    getInfoFamilies();
  }, [selectedProductLines]);
  const deleteProductionCallback = useCallback(async (row) => {
    unwrapResult(await dispatch(ProductionOrdersSliceRequests.deleteRequest(row)));

    getInforProdOrders();
  }, []);
  return (
    <div className="p-2">
      <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
        <div className="sm:place-self-start sm:self-center">
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={buttonClasses.blueButton}
            disabled={!selectedProduct}
            onClick={() => {
              seteditProduction(null);
              setopenModal(true);
            }}>
            Agregar
          </Button>
        </div>
        <div>
          <TextField
            fullWidth
            name="selectedFamilia"
            variant="outlined"
            placeholder="Linea"
            label="Linea"
            value={selectedProductLines?.id}
            //defaultValue={null}
            select
            onChange={(e) => changeSelectedProductLine(e)}>
            {lines?.map((elemento, index) => (
              <MenuItem key={elemento.id} value={elemento as any}>
                {elemento.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <TextField
            fullWidth
            name="selectedFamilia"
            variant="outlined"
            placeholder="Familia"
            label="Familia"
            value={selectedFamilia?.id}
            //defaultValue={null}
            select
            onChange={(e) => changeSelectedFamilia(e)}>
            {families?.map((elemento, index) => (
              <MenuItem key={elemento.id} value={elemento as any}>
                {elemento.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <TextField
            fullWidth
            name="selectedProduct"
            variant="outlined"
            placeholder="Modelo"
            label="Modelo"
            //defaultValue={null}
            value={selectedProduct?.id}
            onChange={(e) => changeSelectedProducto(e)}
            select
            disabled={!selectedFamilia}>
            {selectedFamilia?.products?.map((elemento, index) => (
              <MenuItem key={elemento.id} value={elemento as any}>
                {elemento.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <TableProductionOrdersMes
        data={productionOrders}
        editProductionCallback={editProductionCallback}
        deleteProductionCallback={deleteProductionCallback}
      />
      <ModalCompoment openPopup={openModal} title="Ordenes de producción" setOpenPopup={setopenModal}>
        <ModalProductionOrdersMes
          data={selectedProduct}
          productionOrder={editProduction}
          setOpenPopup={setopenModal}
          refresh={getInforProdOrders}
        />
      </ModalCompoment>
    </div>
  );
};
