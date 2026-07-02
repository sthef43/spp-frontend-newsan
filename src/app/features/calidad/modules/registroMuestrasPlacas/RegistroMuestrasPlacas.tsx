/* eslint-disable unused-imports/no-unused-vars */
import { Check, Close, Delete } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { CtrlPlacasSliceRequests } from "app/Middleware/reducers/CtrlPlacasSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { RegistrarMuestraPlacaForm } from "app/features/calidad/modules/registroMuestrasPlacas/Modal/RegistrarMuestraPlacaForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ICtrlPlacas } from "app/models/ICtrlPlacas";
import { ExportacionMuestrasPlacasExcel } from "./Components/ExportacionMuestrasPlacasExcel";

interface initialState {
  planta: number;
  linea: number;
  producto: number;
}
const initialStateVar = {
  planta: 0,
  linea: 0,
  producto: 0
};

export const RegistroMuestrasPlacas = (): JSX.Element => {
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();

  const watchLinea = watch("linea");
  const watchPlanta = watch("planta");

  const [editState, setEditState] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);

  const [listPlantas, setListPantas] = useState([]);
  const [listLineas, setListLineas] = useState([]);
  const [listPlacas, setListPlacas] = useState([]);

  //Leer Plantas
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const getLineas = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlanta))
      );
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer Placas
  const getListPlacas = async () => {
    if (watchPlanta && watchLinea) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const params = {
          plantId: watchPlanta,
          lineaId: watchLinea,
          fechaDesde: fechaSelectDesde,
          fechaHasta: fechaSelectHasta
        };
        const responses = unwrapResult(await dispatch(CtrlPlacasSliceRequests.getListByPlantIdLineaIdRequest(params)));
        setListPlacas(responses);
      } catch (error) {
        openNotificationUI("Error al leer placas.", "error");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } else {
      openNotificationUI("Seleccione planta, línea y fecha.", "error");
    }
  };

  //Eliminar
  const deleteRow = async (row) => {
    const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(CtrlPlacasSliceRequests.deleteRequest(row)));
        openNotificationUI("Se elimino el registro correctamente", "success");
        getListPlacas();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Watch
  useEffect(() => {
    if (watchPlanta) {
      dispatch(plantSlice.actions.setSelectPlant(watchPlanta));
      watchLinea == 0;
      getLineas();
    }
  }, [watchPlanta]);

  //Editar
  // const [estaEditando, setEstaEditando] = useState(false);
  // const editar = (rowData) => {
  //   setEditState({ ...rowData });
  //   setEstaEditando(true);
  //   setModalOpen(true);
  // };

  //Agregar

  const agregar = () => {
    if (watchPlanta && watchLinea) {
      setEditState({ plantaId: watchPlanta, lineaId: watchLinea });
      setModalOpen(true);
    } else {
      openNotificationUI("Ingrese Planta - Línea.", "error");
    }
  };

  //Fecha desde y hasta
  const [fechaSelectDesde, setfechaSelectDesde] = useState(null);
  const onChangeFechaDesde = (fecha: string) => {
    setfechaSelectDesde(moment(fecha).format("YYYY-MM-DD"));
  };

  const [fechaSelectHasta, setfechaSelectHasta] = useState(null);
  const onChangeFechaHasta = (fecha: string) => {
    setfechaSelectHasta(moment(fecha).format("YYYY-MM-DD"));
  };

  //Use efect genérico
  useEffect(() => {
    TitleChanger("Registro de Muestras de Placas");
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlanta) {
      dispatch(plantSlice.actions.setSelectPlant(watchPlanta));
      watchLinea == 0;
      getLineas();
    }
  }, [watchPlanta]);

  return (
    <div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container spacing={1} sx={{ alignItems: "center" }}>
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="planta"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
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
          </Grid>
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="linea"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Línea</InputLabel>
                    <Select {...field} placeholder="Seleccione Línea" variant="standard">
                      {listLineas &&
                        listLineas.map((x) => (
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
          </Grid>
          <Grid item xs={3}>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div>
                <SelectOfDate pickFecha label="Desde" setFechaProps={onChangeFechaDesde} />
              </div>
              <div>
                <SelectOfDate pickFecha label="Hasta" setFechaProps={onChangeFechaHasta} />
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="flex flex-row gap-x-4 justify-center items-center">
              {listPlacas && listPlacas.length > 0 && (
                <ExportacionMuestrasPlacasExcel reporteMuestrasPlacas={listPlacas} />
              )}
              <Button onClick={getListPlacas} className={buttonClasses.purpleButton} variant="contained">
                Buscar
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Fecha",
              field: "",
              render: (row) => {
                return moment(row.createdDate).format("L");
              }
            },
            {
              title: "Semielaborado",
              field: "semiElaborado"
            },
            {
              title: "Modelo",
              field: "modelo"
            },
            {
              title: "Código",
              field: "codigoInit"
            },
            {
              title: "Estado",
              field: "",
              render: (row) => {
                // const resultado = row.estado ? "Good" : "No good";
                // return (
                //   <TableCell style={{ color: row.estado ? 'green' : 'red' }}>
                //     {resultado}
                //   </TableCell>
                // );
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      {row.estado ? (
                        <Tooltip title="Good">
                          <IconButton size="small" color="success" style={{ position: "relative" }}>
                            <Check />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="No Good">
                          <IconButton size="small" color="error" style={{ position: "relative" }}>
                            <Close />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              }
            },
            {
              title: "Hallazgo",
              // field: "ctrlPlacasHallazgos.descripcion",
              field: "",
              render: (row) => {
                return row.ctrlPlacasHallazgosId ? row.ctrlPlacasHallazgos.descripcion : "-";
              }
            },
            {
              title: "Tipo",
              // field: "ctrlPlacasHallazgos.descripcion",
              field: "",
              render: (row: ICtrlPlacas) => {
                return row.ctrlPlacasTipoMuestra ? row.ctrlPlacasTipoMuestra.nombre : "-";
              }
            },
            {
              title: "Auditor",
              field: "",
              render: (row) => {
                return row.appUser.operator.surname + " " + row.appUser.operator.name;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    {/* <div>
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
                    </div> */}
                    <div>
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            onClick={() => {
                              deleteRow(row.id);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            agregar();
          }}
          dataInfo={listPlacas}
        />
        <ModalCompoment
          title="Nuevo Registro Placas"
          openPopup={ModalOpen}
          setOpenPopup={setModalOpen}
          backgroundColor="var(--background-color-registro-placas)">
          <RegistrarMuestraPlacaForm
            setOpenPopup={setModalOpen}
            openModal={ModalOpen}
            editState={editState}
            refresh={getListPlacas}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
