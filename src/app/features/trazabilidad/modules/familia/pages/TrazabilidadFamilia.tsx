import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
// import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { FamiliaForm } from "app/features/trazabilidad/modules/familia/components/FamiliaForm";
import { IFamilia } from "app/models/IFamilia";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IPlant, IProducto } from "app/models";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { TrazabilidadModelo } from "../modals/TrazablidadModelo";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SemiElaboradosIAForm } from "app/features/admin/AdministrarPlanDeProduccion/Modals/semielaboradosIAForm";

export const TrazabilidadFamilia = (): JSX.Element => {
  const [familiaList, setFamiliaList] = useState(null);
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState(null);
  const [titulo, setTitulo] = useState("");
  // const history = useHistory();
  const [cargando, setCargando] = useState(true);
  const { openNotificationUI } = useNotificationUI();
  // const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const [estaEditando, setEstaEditando] = useState(false);
  const [openModeloCrud, setOpenModeloCrud] = useState(false);
  const [familiaId, setFamiliaId] = useState(0);
  const [familia, setFamilia] = useState();
  const { getConfirmation } = useConfirmationDialog();
  const [openSemiIAForm, setopenSemiIAForm] = useState(false); //formilario de semielaboradoIA

  const theme = useTheme().palette.mode;

  const { TitleChanger } = useTitleOfApp();
  const deleteFamilia = async (row) => {
    const response = await getConfirmation("Borrar familia", "Está seguro que desea borrar la familia?");
    if (response) {
      const response = unwrapResult(await dispatch(FamiliaSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getFamilias();
      }
    }
  };
  const [editState, setEditState] = React.useState<IFamilia | null>(null);

  const getFamilias = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(producto.id)));
    setFamiliaList(result);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  const refresh = () => {
    getFamilias();
  };

  useEffect(() => {
    setTitulo(editState ? "Editar una familia" : "Agregar una familia");
  }, [editState]);

  const [ModalOpen, setModalOpen] = React.useState(false);
  const { State: ListOfPlants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
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
    setModalOpen(true);
  };

  const openModal = () => {
    if (producto?.id == 0) {
      openNotificationUI("Seleccione una planta y/o producto", "error");
    } else {
      setModalOpen(true);
      setEditState(null);
    }
  };

  React.useEffect(() => {
    if (familiaList?.length > 0) {
      console.log(familiaList);
      const families = familiaList.map((x) => {
        return { ...x, producto: null };
      });
      setData(JSON.parse(JSON.stringify(families)));
      setCargando(false);
    }
  }, [familiaList]);

  React.useEffect(() => {
    producto && getFamilias();
  }, [producto]);

  React.useEffect(() => {
    TitleChanger("Agregar familias");
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
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
            title: "Descripcion",
            field: "descripcion"
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
                          deleteFamilia(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Agregar modelo">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFamiliaId(row.id);
                          setOpenModeloCrud(true);
                        }}
                        style={{ position: "relative" }}>
                        <Add color="success" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Agregar SemiElaborados Externos">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFamilia(row);
                          setopenSemiIAForm(true);
                        }}
                        style={{ position: "relative" }}>
                        <img
                          className="h-full w-5"
                          src={`${import.meta.env.BASE_URL}icons/addSemi.svg`}
                          style={{ filter: `${theme === "dark" ? "invert(1)" : "invert(0)"}` }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          openModal();
        }}
        dataInfo={DataOpen}
      />
      <ModalCompoment title={titulo} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <FamiliaForm setOpenPopup={setModalOpen} editState={editState} refresh={refresh} />
      </ModalCompoment>
      <ModalCompoment title={"Agregar modelo a familia"} openPopup={openModeloCrud} setOpenPopup={setOpenModeloCrud}>
        <TrazabilidadModelo refresh={refresh} familiaId={familiaId} handleFamilia={true} />
      </ModalCompoment>
      <ModalCompoment
        title={"Agregar SemiElaborado Externo"}
        openPopup={openSemiIAForm}
        setOpenPopup={setopenSemiIAForm}>
        <SemiElaboradosIAForm setOpenModal={setopenSemiIAForm} familia={familia} handleFamilia={true} />
      </ModalCompoment>
    </div>
  );
};
