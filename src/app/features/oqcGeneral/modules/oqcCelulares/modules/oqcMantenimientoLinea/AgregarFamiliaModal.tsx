import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AgregarFamiliaForm } from "./AgregarFamiliaForm";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IFamilia } from "app/models/IFamilia";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IProducto } from "app/models";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";

import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Delete, Edit, TouchApp, Visibility } from "@mui/icons-material";
import { AsignacionLinea } from "./AsignacionLinea";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ExaminarFamilia } from "./ExaminarFamilia";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";

interface Props {
  open: boolean;
  handleClose: () => void;
  subirHastaArriba: () => void;
  productId: any;
  plant: any;
  refreshfam?: any;
  setMostrarFondo: (state: boolean) => void;
}

export const AgregarFamiliaModal = ({
  open,
  handleClose,
  plant,
  productId,
  refreshfam,
  setMostrarFondo,
  subirHastaArriba
}: Props) => {
  interface initialState {
    productoId: number;
    plantaId: number;
    familiaId: number;
    lineaId: string;
  }
  const initialStateVar = {
    productoId: 0,
    plantaId: 0,
    familiaId: 0
  };

  const theme = useTheme().palette.mode;
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const navbarRef = useRef(null);
  const [titulo, setTitulo] = useState(""); // CAMBIE EL TITULO SI LO EDITAS O AGREGAS UNA NUEVA FAMILIA
  const [DataOpen, setData] = useState(null);
  const [familiaList, setFamiliaList] = useState(null);
  const [cargando, setCargando] = useState(true);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [openFamilia, setOpenFamilia] = useState(false);
  const [asignar, setAsignar] = useState(false);
  const [examinarModal, setExaminarModal] = useState(false);
  const { getConfirmation } = useConfirmationDialog();
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const onOpenForm = useCallback((state: boolean) => {
    setOpenFamilia(state);
    setAsignar(state);
  }, []);

  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = React.useState<IFamilia | null>(null); // PARA TRAER LA FAMILIA
  useEffect(() => {
    setTitulo(editState ? "Editar Model Number" : "Agregar Model Number");
  }, [editState]);

  //elimar familia
  const deleteFamilia = async (row) => {
    const response = await getConfirmation("Borrar Model Number", "Está seguro que desea borrar Model Number?");
    if (response) {
      const response = unwrapResult(await dispatch(FamiliaSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getFamilias();
      }
    }
  };

  const editar = (rowData) => {
    setEditState({
      id: rowData.id,
      nombre: rowData.nombre,
      semiElaboradoIA: rowData.semiElaboradoIA,
      productoId: rowData.productoId,
      descripcion: rowData.descripcion,
      createdDate: rowData.createdDate
    });
    setEstaEditando(true);
    setOpenFamilia(true);
  };

  const asignarr = (rowData) => {
    setEditState({
      id: rowData.id,
      nombre: rowData.nombre,
      semiElaboradoIA: rowData.semiElaboradoIA,
      productoId: rowData.productoId,
      descripcion: rowData.descripcion,
      createdDate: rowData.createdDate
    });
    setEstaEditando(true);
    // setOpenFamilia(true);
    setAsignar(true);
  };

  const [datosFamilia, setDatosFamilia] = useState(null);
  const examinar = (rowData) => {
    setDatosFamilia(rowData);
    setExaminarModal(!examinarModal);
  };

  const openModal = () => {
    if (producto?.id == 0) {
      openNotificationUI("Seleccione una planta y/o producto", "error");
    } else {
      setOpenFamilia(true);
      setEditState(null);
    }
  };

  //trae el producto , familia y planta
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      console.log("Error al obtener productos");
    }
  };

  const getFamilias = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(producto.id)));
    setFamiliaList(result);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const [lineas, setLIneas] = useState<ILineaProduccion[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({ plantaId: plant.id, productoId: productId.id })
        )
      );
      if (response) {
        console.log(response);
        setLIneas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
  };

  //segun id traigo el nombre del producto
  const [listProducto, setListProducto] = useState([]);
  const getProductNameById = (id) => {
    const product = listProducto.find((p) => p.id === id);
    return product ? product.nombre : "Producto no encontrado";
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toISOString().split("T")[0];
  };
  const refresh = () => {
    getFamilias();
  };

  //lista de las familias
  useEffect(() => {
    if (familiaList?.length > 0) {
      const families = familiaList.map((x) => {
        return { ...x, producto: null };
      });
      setData(JSON.parse(JSON.stringify(families)));
      setCargando(false);
    }
  }, [familiaList]);
  useEffect(() => {
    setShowModal(open);
    getProducto();
  }, [open]);
  React.useEffect(() => {
    producto && getFamilias();
  }, [producto]);

  useEffect(() => {
    if (showModal) {
      getLineas();
    }
  }, [showModal]);

  useEffect(() => {
    if (examinarModal || asignar) {
      getLineas();
    }
  }, [examinarModal, asignar]);

  return (
    <>
      <main className="relative border border-gray-200 rounded-md shadow-lg">
        <nav ref={navbarRef}></nav>
        {showModal && (
          <div>
            <header className="relative text-center border-b border-[#a9a9a9] mt-4">
              <span
                className="bg-gray-500 absolute cursor-pointer text-center rounded-md right-4 px-[5px] py-[1px]"
                onClick={handleClose}>
                <p className="text-xs font-bold text-white">X</p>
              </span>
              <h2 className="font-bold text-xl py-2">Agregar Model Number</h2>
            </header>
            <div className="p-5">
              <div>
                <TableComponent
                  IDcolumn="id"
                  columns={[
                    {
                      title: "Fecha",
                      field: "createdDate",
                      render: (rowData) => formatDate(rowData.createdDate) //traigo de la hora de creacion y lo filtro
                    },
                    // {
                    //   title: "Descripcion",
                    //   field: "descripcion"
                    // },
                    {
                      title: "Producto",
                      field: "productoId",
                      render: (rowData) => getProductNameById(rowData.productoId)
                    },
                    {
                      title: "Model Number ",
                      field: "nombre"
                    },
                    {
                      title: "Acciones",
                      field: "",
                      render: (row) => {
                        return (
                          <div className="flex w-full justify-end sm:justify-start gap-4">
                            <div>
                              <Tooltip title="Examinar">
                                <IconButton
                                  onClick={() => {
                                    setMostrarFondo(true);
                                    subirHastaArriba();
                                    examinar(row);
                                    getLineas();
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Visibility color="primary" />
                                </IconButton>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip title="Editar">
                                <IconButton
                                  onClick={() => {
                                    editar(row);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Edit color="primary" />
                                </IconButton>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip title="Asignar">
                                <IconButton
                                  onClick={() => {
                                    asignarr(row);
                                    // setFamiliaId(row.id);
                                    // setAsignar(true);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <TouchApp color="primary" />
                                </IconButton>
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip title="Eliminar">
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
                          </div>
                        );
                      }
                    }
                  ]}
                  dataInfo={DataOpen}
                  buscar
                  agregar={() => {
                    openModal();
                  }}
                />
              </div>
              <ModalCompoment titleModalStyle="Audit" showModalCenterPage onCloseDynamic setOpenPopup={setOpenFamilia} openPopup={openFamilia} title={titulo} subTitle="Administración de Model Number">
                <AgregarFamiliaForm
                  setOpenFamilia={setOpenFamilia} // UN BOOLEAN PARA CERRAR O NO EL MODAL
                  dataEdit={editState}
                  plant={plant.id}
                  productId={productId.id}
                  refresh={refresh}
                />
              </ModalCompoment>

              <ModalCompoment titleModalStyle="Audit" showModalCenterPage onCloseDynamic setOpenPopup={setAsignar} openPopup={asignar} title="Asignar Model Number" subTitle="Asignación de línea al Model Number">
                <AsignacionLinea
                  lineasComponente={lineas}
                  actualizarLineas={setLIneas}
                  setAsignar={setAsignar}
                  dataEdit={editState}
                  plant={plant.id}
                  productId={productId.id}
                  refresh={refresh}
                  refreshfam={refreshfam}
                />
              </ModalCompoment>
              {examinarModal && (
                <ExaminarFamilia
                  lineas={lineas}
                  setMostrarFondo={setMostrarFondo}
                  setAbrirExaminar={setExaminarModal}
                  datosFamilia={datosFamilia}
                  plantaId={plant}
                  producto={producto.id}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};
