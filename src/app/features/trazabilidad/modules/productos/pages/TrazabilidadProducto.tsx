import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
// import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IAppUser } from "app/models/IAppUser";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TrazabilidadProductoForm } from "app/features/trazabilidad/modules/productos/modal/TrazabilidadProductoForm";
import { IProducto } from "app/models/IProducto";
import { ProductoSliceRequests } from "app/Middleware/reducers/ProductoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

export const TrazabilidadProducto = (): JSX.Element => {
  const [productsList, setProductsList] = useState(null);
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { openNotificationUI } = useNotificationUI();
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const [estaEditando, setEstaEditando] = useState(false);

  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const deleteProduct = async (row) => {
    const resp = await getConfirmation("Borrar un producto", "Esta seguro que quiere eliminar este producto?");
    if (resp) {
      const response = unwrapResult(await dispatch(ProductoSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino el producto correctamente", "success");
        getProducts();
      }
    }
  };
  const getProducts = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
    setProductsList(result);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  useEffect(() => {
    getProducts();
  }, []);

  // const { State: productosList } = useFetchApi<IProducto[]>(ProductoSliceRequests.getAllRequest, undefined);

  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<IProducto | null>(null);
  React.useEffect(() => {
    if (productsList?.length > 0) {
      console.log(productsList);
      setData(JSON.parse(JSON.stringify(productsList)));
      setCargando(false);
    }
  }, [productsList]);
  React.useEffect(() => {
    TitleChanger("Agregar productos");
  }, []);

  const editar = (rowData) => {
    setEditState({
      id: rowData.id,
      nombre: rowData.nombre,
      descripcion: rowData.descripcion,
      createdDate: rowData.createdDate
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  return (
    <div className="my-2 mx-4 h-full">
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
            title: "Descripcion",
            field: "descripcion"
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
                        deleteProduct(row.id);
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
          setEstaEditando(false);
          setModalOpen(true);
        }}
        dataInfo={DataOpen}
      />
      <ModalCompoment title="Creacion de un nuevo producto" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <TrazabilidadProductoForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getProducts}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
