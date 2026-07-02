import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { AreaTrazaSliceRequests } from "app/Middleware/reducers/AreaTrazaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { IAreaTraza } from "app/models/IAreaTraza";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IntDetalleForm } from "../../intDarsenas/modals/IntDetalleForm";
import { IIntDetalle } from "app/models/IIntDetalle";
import { Delete, Edit } from "@mui/icons-material";
import { IntRemitoSliceRequests } from "app/Middleware/reducers/IntRemitoSlice";
import { IntDetalleSliceRequests } from "app/Middleware/reducers/IntDetalleSlice";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { IIntRecepcionBloq } from "app/models/IIntRecepcionBloq";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { IntRecepcionBloqSliceRequest } from "app/Middleware/reducers/IntRecepcionBloqSlice";

interface props {
  setOpenPopup: any;
  refresh?: any;
}

export const IntRemitoForm = ({ setOpenPopup, refresh }: props) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { FetchPost } = useFetchApiMultiResults();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  //Form
  interface initialState {
    intEstadoId?: number | 1;
    appUserId?: string | null; //Puesto string para pasar el nombre
    areaDestinoId?: number | 0;
    // intEstadoId?: number | 0;
    plantOrigenId?: number | 0;
    plantDestinoId?: number | 0;
    referenciaDestino?: string | null;
    observacion?: string | null;
  }
  const initialStateVar = {
    appUserId: infoUser.operator.name + " " + infoUser.operator.surname,
    areaDestinoId: 0,
    intEstadoId: 1,
    plantOrigenId: 0,
    plantDestinoId: 0,
    referenciaDestino: "",
    observacion: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Cargo los comboBox con las Selecciones de Tablas
  useEffect(() => {
    getListPlantas();
    getListAreas();
  }, []);

  //Leer
  const [listPlantas, setListPlantas] = useState<IPlant[] | []>([]);
  const getListPlantas = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(result);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  const [listAreas, setListAreas] = useState<IAreaTraza[] | []>([]);
  const getListAreas = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(AreaTrazaSliceRequests.getAllRequest()));
      setListAreas(result);
    } catch (error) {
      openNotificationUI("Error al leer Áreas.", "error");
    }
  };
  //Tomar el primer Estado cuando se genera el remito: Generado

  //Guardar Remito *****************************
  const loginSubmit = async (e) => {
    if (e.plantOrigenId === e.plantDestinoId) {
      openNotificationUI("Planta Origen es igual a Planta Destino", "error");
      return;
    }
    if (listDetalles.length == 0) {
      openNotificationUI("Debe agregar detalles del remito", "error");
      return;
    }
    if (e.referenciaDestino === "" || e.referenciaDestino === null) {
      openNotificationUI("Debe ingresar un numero de referencia", "error");
      return;
    }
    if (e.observacion === "" || e.observacion === null) {
      openNotificationUI("Debe ingresar una observacion", "error");
      return;
    }
    const objectSubmit = {
      ...e,
      appUserId: infoUser.id,
      intEstadoId: 1
    };
    const objectBloqRecepcion: IIntRecepcionBloq = {
      intEstadoId: 1,
      intRemitoId: 0,
      appUserId: infoUser.id
    };
    try {
      const result = unwrapResult(await dispatch(IntRemitoSliceRequests.PostRequest(objectSubmit)));
      if (result) {
        const clonBloq = { ...objectBloqRecepcion, intRemitoId: result.id };
        guardarNuevoBloqueRecepcion(clonBloq);
        guardarDetalles(result.id);
      }
    } catch (error) {
      openNotificationUI("Error al guardar remito", "error");
    }
  };

  const guardarDetalles = async (padreId) => {
    const updatedList = listDetalles.map((obj) => ({ ...obj, intRemitoId: padreId }));
    try {
      unwrapResult(await dispatch(IntDetalleSliceRequests.multiPostRequest(updatedList)));
      openNotificationUI("Remito guardado", "success");
    } catch (error) {
      openNotificationUI("Error al guardar remito", "error");
    }
    refresh();
    setOpenPopup(false);
  };

  const guardarNuevoBloqueRecepcion = (objeto: IIntRecepcionBloq) => {
    FetchPost(IntRecepcionBloqSliceRequest.PostRequest, objeto, false);
  };

  //Cancelar
  const cancelar = () => {
    setOpenPopup(false);
  };

  //Detalle *****************************
  const [listDetalles, setListDetalles] = useState<IIntDetalle[] | []>([]); //Lista Completa. Arreglo de Objetos
  const [ModalOpenDetalle, setModalOpenDetalle] = useState(false);
  const [estaEditandoDetalle, setEstaEditandoDetalle] = useState(false);
  const [editStateDetalle, setEditStateDetalle] = useState<IIntDetalle | null>(null); //Lista que se va a editar. Objeto

  //Editar Detalle
  const editarDetalle = (rowData) => {
    setEditStateDetalle({ ...rowData });
    setEstaEditandoDetalle(true);
    setModalOpenDetalle(true);
  };

  //Eliminar Detalle
  const eliminarDetalle = async (row) => {
    const resp = await getConfirmation("Borrar registro", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        const filtrado = listDetalles.filter((obj) => obj.numero !== row.numero);
        const nuevaAsignacion = filtrado.map((obj, index) => ({
          ...obj,
          numero: index + 1
        }));
        setListDetalles(nuevaAsignacion);
        openNotificationUI("Se eliminó el registro correctamente", "success");
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        {/* Operador - Planta - Area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px"
          }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <Controller
              name="appUserId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField fullWidth label="Operador" variant="standard" type="text" disabled={true} {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10%", textAlign: "center" }}>
            <Controller
              name="plantOrigenId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Planta Origen</InputLabel>
                  <Select {...field} placeholder="Seleccione Planta Origen" variant="standard">
                    {listPlantas &&
                      listPlantas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10%", textAlign: "center" }}>
            <Controller
              name="plantDestinoId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Planta Destino</InputLabel>
                  <Select {...field} placeholder="Seleccione Planta Destino" variant="standard">
                    {listPlantas &&
                      listPlantas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10%", textAlign: "center" }}>
            <Controller
              name="areaDestinoId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Área Destino</InputLabel>
                  <Select {...field} placeholder="Seleccione Área de Destino" variant="standard">
                    {listAreas &&
                      listAreas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>

        {/* Referencia - Descripcion */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px"
          }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", padding: "5px" }}>
              <div style={{ flex: 1, textAlign: "right", margin: "10px", alignContent: "center" }}>Referencia</div>
              <div style={{ flex: 3 }}>
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="referenciaDestino"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <div style={{ display: "flex", padding: "5px" }}>
              <div style={{ flex: 1, textAlign: "right", margin: "10px", alignContent: "center" }}>Observación</div>
              <div style={{ flex: 4 }}>
                <div className="rounded-lg shadow-elevation-4 bg-background">
                  <Controller
                    name="observacion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <TextField fullWidth {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "20px"
          }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <TableComponent
              Dense={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "N°",
                  field: "numero"
                },
                {
                  title: "Cajas",
                  field: "cajas"
                },
                {
                  title: "Anexo II",
                  field: "anexo"
                },
                {
                  title: "Código",
                  field: "codigo"
                },
                {
                  title: "Descripción",
                  field: "descripcion"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "Cont.",
                  field: "cont"
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
                                editarDetalle(row);
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
                                eliminarDetalle(row);
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
                setEstaEditandoDetalle(false);
                setEditStateDetalle(null);
                setModalOpenDetalle(true);
              }}
              dataInfo={listDetalles}
            />
          </div>
        </div>

        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.redButton} onClick={cancelar} variant="contained" disabled={!isDirty && !isValid}>
            Cancelar
          </Button>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar Remito
          </Button>
        </div>
      </form>
      <ModalCompoment
        title={estaEditandoDetalle ? "Modificar Detalle" : "Agregar Detalle"}
        openPopup={ModalOpenDetalle}
        setOpenPopup={setModalOpenDetalle}>
        <IntDetalleForm
          setOpenPopup={setModalOpenDetalle}
          listDetalles={listDetalles} // Lista Completa
          editStateDetalle={editStateDetalle} //Objeto a Modificar
          refresh={setListDetalles} //Pego directamente sobre la lista de detalles, debo traer todo.
          estaEditandoDetalle={estaEditandoDetalle}
        />
      </ModalCompoment>
    </div>
  );
};
