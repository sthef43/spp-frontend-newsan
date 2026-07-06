import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IRutas } from "app/models/IRutas";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { Check, Edit, Info } from "@mui/icons-material";
import { RutasForm } from "app/features/trazabilidad/modules/rutas/modal/RutasForm";
import { PlantSliceRequests } from "app/Middleware/reducers/PlantSlice";
import { IPlant } from "app/models";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { Controller, useForm } from "react-hook-form";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import _ from "lodash";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { ILineaProduccionRutas } from "app/models/ILineaProduccionRutas";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";

export const Rutas = (): JSX.Element => {
  const [puestos, setPuestos] = useState(null);
  const [productos, setProductos] = useState(null);
  const [familias, setFamilias] = useState(null);
  const [lineaProd, setLineaProd] = useState(null);
  const dispatch = useAppDispatch();
  const [soloVista, setSoloVista] = useState(false);
  const [DataOpen, setData] = useState<ILineaProduccionRutas[]>(null);
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const [titulo, setTitulo] = useState("");
  interface initialState {
    plantId: number;
    productoId: number;
    familiaId: number;
    lineaProduccionId: number;
  }
  const initialStateVar = {
    plantId: 0,
    productoId: 0,
    lineaProduccionId: 0,
    familiaId: 0
  };
  //   const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { TitleChanger } = useTitleOfApp();
  const { State: ListOfPlants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<IRutas | null>(null);
  useEffect(() => {
    setTitulo(editState ? "Editar una ruta" : "Agregar una ruta");
  }, [editState]);
  React.useEffect(() => {
    TitleChanger("Configuracion de rutas para trazabilidad ");
  }, []);
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const setRow = (row) => {
    setEditState({
      id: row.rutas.id,
      nombre: row.rutas.nombre,
      descripcion: row.rutas.descripcion,
      mapasRutas: row.rutas.mapasRutas,
      createdDate: row.rutas.createdDate
    });
    setModalOpen(true);
  };
  const buscarProductos = async () => {
    let fetchLineaResult;
    setData([]);
    setValue("productoId", 0);
    const plantId = getValues("plantId");
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
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
      console.log(productos);
    }
  };
  const buscarRutas = async () => {
    let fetchRutasResult;
    const lineaId = getValues("lineaProduccionId");
    try {
      fetchRutasResult = unwrapResult(await dispatch(LineaProduccionRutasSliceRequest.getAllRutaByLineaId(lineaId)));
    } catch (error) {
      fetchRutasResult = null;
    }
    if (fetchRutasResult) {
      setData(fetchRutasResult);
    } else {
      setData([]);
    }
  };
  const handlerSearchPuestos = async () => {
    try {
      const lineaId = getValues("lineaProduccionId");
      const puestosFetchResult = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllByLineaId(lineaId)));
      if (puestosFetchResult) {
        const puestosByProduct = puestosFetchResult.map((p) => {
          return p.puesto;
        });
        setPuestos(puestosByProduct);
        console.log(puestosByProduct);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const buscarLineas = async () => {
    let lineaFetchResult;
    try {
      const productoId = getValues("productoId");
      lineaFetchResult = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllByProductId(productoId)));
      lineaFetchResult = JSON.parse(JSON.stringify(lineaFetchResult));
      setLineaProd(lineaFetchResult);
    } catch (e) {
      lineaFetchResult = null;
      openNotificationUI(e, "error");
    }
  };
  const onActivar = async (row) => {
    try {
      const confirm = await getConfirmation("Cambiar ruta", "Desea activar la ruta activa?");
      if (confirm) {
        const activo = DataOpen.find((ruta) => ruta.activa == true);
        if (activo) {
          activo.rutas = null;
          activo.activa = false;
          const update = await dispatch(LineaProduccionRutasSliceRequest.PutRequest(activo));
        }
        row.familia = null;
        row.rutas = null;
        row.activa = true;
        const response = await dispatch(LineaProduccionRutasSliceRequest.PutRequest(row));
        if (response) openNotificationUI("Se activo correctamente", "success");
        buscarRutas();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    setData([]);
    setFamilias(null);
    setValue("familiaId", 0);
    setLineaProd(null);
    setValue("lineaProduccionId", 0);
  }, [watch("productoId")]);
  useEffect(() => {
    setData([]);
    setValue("familiaId", 0);
  }, [watch("lineaProduccionId")]);

  return (
    <div className="my-2 mx-4 h-full">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="flex" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-3 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="plantId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una planta</InputLabel>
                  <Select
                    {...field}
                    variant="standard"
                    onClick={() => {
                      setData([]);
                      setFamilias(null);
                      setValue("familiaId", 0);
                      buscarProductos();
                    }}>
                    {ListOfPlants &&
                      ListOfPlants.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            {productos && (
              <Controller
                name="productoId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un producto</InputLabel>
                    <Select {...field} variant="standard" onClick={buscarLineas}>
                      {productos &&
                        productos.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
            {lineaProd && (
              <Controller
                name="lineaProduccionId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una linea de producción</InputLabel>
                    <Select
                      {...field}
                      variant="standard"
                      onClick={() => {
                        handlerSearchPuestos();
                        buscarRutas();
                      }}>
                      {lineaProd &&
                        lineaProd.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
        </div>
      </form>
      <TableComponent
        buscar={true}
        Overflow={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Nombre ",
            field: "rutas.nombre"
          },
          {
            title: "Descripción ",
            field: "rutas.descripcion"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Ver">
                      <IconButton
                        onClick={() => {
                          setSoloVista(true);
                          console.log("Entre");
                          setRow(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Info color="primary" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        setSoloVista(false);
                        setRow(row);
                        console.log(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {row.activa ? (
                    <Tooltip title="Ruta activa">
                      <IconButton>
                        <Check color="success" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Activar ruta">
                      <IconButton onClick={() => onActivar(row)}>
                        <Check color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <div></div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          const existe = getValues("productoId");
          if (existe != 0) {
            setSoloVista(false);
            setModalOpen(true);
            setEditState(null);
          } else {
            openNotificationUI("Seleccione los campos primero", "error");
          }
        }}
        dataInfo={DataOpen}
      />
      <ModalCompoment title={titulo} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <RutasForm
          soloVista={soloVista}
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={buscarRutas}
          lineaProduccionId={getValues("lineaProduccionId")}
          addPuesto={puestos}
        />
      </ModalCompoment>
    </div>
  );
};
