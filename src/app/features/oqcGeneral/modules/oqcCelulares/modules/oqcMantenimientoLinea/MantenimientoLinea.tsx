import React, { useEffect, useRef, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { lineaProduccionFamiliaSlice } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { Add, Delete, Edit, ContentCopy } from "@mui/icons-material";
import { AgregarLineaModal } from "./AgregarLineaModal";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { AgregarFamiliaModal } from "./AgregarFamiliaModal";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { MantenimientoLineaComponent } from "./MantenimientoLineaComponent";
import { IModelo } from "app/models/IModelo";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { EditarModelo } from "./EditarModelo";
import { IOperator } from "app/models";
import { ClonarModelo } from "./ClonarModelo";

const defaultValues = {
  familia: ""
};

export const MantenimientoLinea = () => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const navbarRef = useRef(null);
  const [editState, setEditState] = React.useState<ILineaProduccion | null>(null);
  const [lineaProduccionList, setLineaProduccionList] = React.useState(null);
  const [DataOpen, setData] = React.useState(null);

  const { control, getValues, watch } = useForm({
    defaultValues: defaultValues
  });

  const [open, setOpen] = useState(false);

  const producto = useAppSelector((state) => state.producto.object);
  const planta = useAppSelector((state) => state.plant.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const lineaProdFamilia = useAppSelector((state) => state.lineaProduccionFamilia.dataAll);

  const { getConfirmation } = useConfirmationDialog();

  const [openModelo, setOpenModelo] = useState(false);
  const [openFamilia, setOpenFamilia] = useState(false);

  // datos que tendra la table de component
  // const [dataOpen, setDataOpen] = React.useState<IModelo[]>();
  const dataOpen = useAppSelector((state) => state.modelo.dataAll);

  const [selectedFamily, setSelectedFamily] = useState(null); // Estado para la familia seleccionada se guarde aca

  //trae los modelos
  const modelos = useAppSelector((p) => p.modelo.data);
  const getModels = async () => {
    await dispatch(ModeloSliceRequest.getAllByFamiliaId(selectedFamily));
  };

  const getFamilias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(linea.id || 0));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //para refrescar cuando se agrege una nueva linea
  const getLineas = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let response = unwrapResult(
      await dispatch(
        LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({ plantaId: planta.id, productoId: producto.id })
      )
    );
    if (!response) console.log("sin lineas");
    response = response.filter((x) => x.plantId == planta.id);
    setLineaProduccionList(response);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const subirHastaArriba = () => {
    navbarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const agregarModelo = () => {
    // setEditState(rowData); funcionalidad pa editar
    setOpenModelo(true);
    setOpen(false);
    setOpenFamilia(false);
  };
  //modal para editar modelo
  const handleCloseModelo = () => {
    setOpenModelo(false);
  };

  //abrir y cerrar linea el modal de la linea
  const agregarLinea = () => {
    setOpen(true); //cuando abro este modal  cierro los demas
    setOpenFamilia(false);
    setOpenModelo(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //abrir modal de agregar familia
  const agregarFamiliaOpen = () => {
    setOpenFamilia(true); //cuando abro este modal cierro los demas
    setOpen(false);
    setOpenModelo(false);
  };
  const agregarFamiliaOFF = () => {
    setOpenFamilia(false);
  };

  useEffect(() => {
    if (lineaProduccionList) {
      setData(lineaProduccionList);
    }
    return () => {
      setData([]);
    };
  }, [lineaProduccionList]);

  const [lineaId, setLineaId] = useState(0);
  useEffect(() => {
    getFamilias();
    if (linea) {
      setLineaId(linea.id);
    }
  }, [linea, dispatch]);

  //cuando cambien la planta se cierran todos los  modales
  useEffect(() => {
    agregarFamiliaOFF();
    handleClose();
    handleCloseModelo();
  }, [planta, producto, linea]);

  const refresh = () => {
    handleClose();
  };

  //cuando cambies el seleccionar una linea, se actualice el estado de Seleccione familia, en caso de no tener
  // familiaes null y no podes agregar mdelo
  useEffect(() => {
    if (getValues("familia") !== "") {
      const linProdFam = lineaProdFamilia.find((fa) => fa.familia.nombre === getValues("familia"));
      if (linProdFam) {
        dispatch(lineaProduccionFamiliaSlice.actions.setObject(linProdFam));
        setSelectedFamily(linProdFam.familiaId);
      } else {
        // manejo en caso de que linProdFam sea undefined
        setSelectedFamily(null); // O cualquier otro valor por defecto
      }
    }
  }, [watch("familia"), lineaProdFamilia, dispatch, getValues]);

  // useEffect(() => {
  //   if (Array.isArray(modelos)) {
  //     setDataOpen(modelos);
  //   }
  // }, [modelos]);

  useEffect(() => {
    if (selectedFamily) {
      getModels();
    }
  }, [selectedFamily]); //cada vez que la familia cambie, trae los modelos cargados

  //modal para editar los modelos
  const [ModalOpen, setModalOpen] = React.useState(false);
  //modal para CLONAR MODELOS
  const [modalClon, setmodalClon] = React.useState(false);

  //para editar el modelo
  const [editModelo, setEditModelo] = React.useState<IModelo | null>(null);
  const editar = (rowData) => {
    setEditModelo({
      id: rowData.id,
      nombre: rowData.nombre,
      familia: rowData.familia,
      descripcion: rowData.descripcion,
      familiaId: rowData.familiaId,
      createdDate: rowData.createdDate,
      eancode: rowData.eancode,
      Muestras: rowData.muestras,
      pallet: rowData.pallet,
      compania: rowData.compania,
      operator: rowData.operator,
      operatorId: rowData.operatorId
    });
  };

  //para borrar el modelo
  const deleteFamilia = async (row) => {
    const resp = await getConfirmation("Borrar un modelo", "Esta seguro que quiere eliminar este modelo?");
    if (resp) {
      const response = unwrapResult(await dispatch(ModeloSliceRequest.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        dispatch(ModeloSliceRequest.getAllByFamiliaId(selectedFamily));
      }
    }
  };

  useEffect(() => {
    TitleChanger("Mantenimiento Modelo/Linea"); // al abrir te muestra el titulo
  }, []);

  //siempre que selecciones planta, producto , linea de produccion y familia  te deja Agregar Modelo nuevo
  const BottonDisabled = !linea || !planta || !lineaProdFamilia || !selectedFamily;

  //para la fehca, las trae de la base de datos y solo se queda con año,mes y dia
  const formatDate = (dateTime) => {
    return new Date(dateTime).toISOString().split("T")[0];
  };

  //pequeña function para ver si lo cargo turno tarde o mañana
  const TurnoCreation = (dateTime) => {
    const turno = (createdDate) => {
      const date = new Date(createdDate);
      const hours = date.getHours();
      if (hours >= 6 && hours < 15) {
        return "Mañana";
      } else if (hours >= 15 && hours < 24) {
        return "Tarde";
      } else {
        return "modelo cargado fuera de hora";
      }
    };
    return turno(dateTime);
  };

  //cuando cambie la familia
  useEffect(() => {
    console.log("-------------------");
    console.log("familia select", selectedFamily);
  }, [selectedFamily]);

  useEffect(() => {
    if (producto) {
      if (producto !== undefined) {
        getLineas();
      }
    }
  }, [producto, planta]);

  const [mostarFondo, setMostrarFondo] = useState(false);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <nav ref={navbarRef}></nav>
      <figure
        className={`${
          !mostarFondo ? "" : "w-[100%] h-[400vh] bg-black/50 absolute top-0 z-10 overflow-hidden left-0 right-0 m-auto"
        }`}></figure>
      <div className="flex flex-col gap-1 bg-secondaryNew p-4">
        <TitleUIComponent title="Ingreso de datos" />
        <SelectOFPlantAndProducts selectLineas>
          <>
            <Tooltip title="Agregar Sales Model">
              <IconButton onClick={agregarLinea} size="small" style={{ position: "relative" }}>
                <Add sx={{ color: "white", background: "#1976d2", borderRadius: "100%" }} />
              </IconButton>
            </Tooltip>
            <Controller
              control={control}
              name="familia"
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth>
                  <InputLabel>Seleccione Model Number</InputLabel>
                  <Select {...field} variant="standard">
                    {lineaProdFamilia &&
                      linea &&
                      lineaProdFamilia.map((lineaprodFam) => (
                        <MenuItem
                          key={lineaprodFam.id}
                          value={
                            linea.id == 7 || linea.id == 10
                              ? "M" + lineaprodFam.familia.nombre
                              : lineaprodFam.familia.nombre
                          }>
                          <div className="w-full">
                            <div>
                              {linea.id == 7 || linea.id == 10
                                ? "M" + lineaprodFam.familia.nombre
                                : lineaprodFam.familia.nombre}
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            <Tooltip title="agregar Model Number">
              <IconButton onClick={agregarFamiliaOpen} size="small" style={{ position: "relative" }}>
                <Add sx={{ color: "white", background: "#1976d2", borderRadius: "100%" }} />
              </IconButton>
            </Tooltip>
          </>
        </SelectOFPlantAndProducts>

        <div className="mt-2 ml-2 mb-4">
          <Button className={classes.blueButton} variant="contained" onClick={agregarModelo} disabled={BottonDisabled}>
            Agregar Sales Model
          </Button>
        </div>

        {/* agregar nuevo modelos */}
        <MantenimientoLineaComponent
          open={openModelo} // para abrir el moda lde agregar nuevo modelo
          handleClose={handleCloseModelo}
          familiaId={selectedFamily} // pasar la familia seleccionada como prop para agregarle un modelo
          refresh={getModels} //para cuando se agrege un modelo nuevo se actualice
          editState={editModelo}
          lineaId={lineaId}
        />

        {/* AGREGAR LINEA  */}
        <AgregarLineaModal
          open={open}
          handleClose={handleClose}
          plant={planta?.id}
          productId={producto?.id}
          editState={editState}
          refresh={getLineas} //refest para cuando se agrege una nueva linea
        />

        {/* Agregar nueva familia */}
        <AgregarFamiliaModal
          subirHastaArriba={subirHastaArriba}
          setMostrarFondo={setMostrarFondo}
          open={openFamilia}
          handleClose={agregarFamiliaOFF}
          plant={planta}
          productId={producto}
          refreshfam={getFamilias}
        />

        <div>
          <TitleUIComponent title="LISTADO DE SALES MODEL" />
          <TableComponent
            IDcolumn="id"
            columns={[
              // {
              //   title: "ID ",
              //   field: "id"
              // },
              {
                title: "Fecha",
                field: "createdDate",
                render: (rowData) => formatDate(rowData.createdDate) //traigo de la hora de creacion y lo filtro
              },
              {
                title: "Turno",
                field: "turno",
                render: (rowData) => TurnoCreation(rowData.createdDate)
              },
              // {
              //   title: "Auditor",
              //   field: "operatorId",
              //   render: (row: IModelo) => <>{row.operator?.name + " " + row.operator?.surname}</> //Muestro nombre y apellido de la persona que subio el modelo
              // },
              {
                title: "Sales Model",
                field: "nombre"
              },
              {
                title: "EANCODE",
                field: "eancode"
              },
              {
                title: "Muestras",
                field: "muestras"
              },
              {
                title: "Compañia",
                field: "compania"
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
                              editar(row); //aca envio el objecto completo para editar
                              setModalOpen(true); // abro el modal para editar con los datos de row
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Clonar">
                          <IconButton
                            onClick={() => {
                              editar(row);
                              setmodalClon(true);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <ContentCopy color="primary" />
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
            dataInfo={dataOpen}
            buscar
          />
        </div>
        <ModalCompoment
          title={"Editar Modelo"}
          openPopup={ModalOpen}
          setOpenPopup={setModalOpen}
          titleModalStyle="Audit"
          showModalCenterPage
          onCloseDynamic>
          <EditarModelo
            lineaId={linea?.id}
            setOpenPopup={setModalOpen}
            handleClose={handleCloseModelo}
            familiaId={selectedFamily} // pasar la familia seleccionada como prop para agregarle un modelo
            refresh={getModels} //para cuando se edite un modelo nuevo se actualice
            editState={editModelo}
          />
        </ModalCompoment>

        <ModalCompoment
          title={"Clonar Modelo"}
          openPopup={modalClon}
          setOpenPopup={setmodalClon}
          titleModalStyle="Audit"
          showModalCenterPage
          onCloseDynamic>
          <ClonarModelo
            lineaId={lineaId}
            setOpenPopup={setmodalClon}
            handleClose={handleCloseModelo}
            familiaId={selectedFamily} // pasar la familia seleccionada como prop para agregarle un modelo
            refresh={getModels} //para cuando se clona un modelo nuevo se actualice
            editState={editModelo}
          />
        </ModalCompoment>
      </div>
    </ContainerForPages>
  );
};
