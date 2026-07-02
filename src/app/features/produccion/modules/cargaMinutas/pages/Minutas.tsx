import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { MinutasSliceRequests } from "app/Middleware/reducers/MinutasSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IMinutas } from "app/models/IMinutas";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { MinutasForm } from "app/features/produccion/modules/cargaMinutas/modals/MinutasForm";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Minutas = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    planta: number;
    linea: number;
  }
  const initialStateVar = {
    planta: 0,
    linea: 0
  };

  //UseForm
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Leer Plantas
  const [listPlantas, setListPantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const [listLineas, setListLineas] = useState<ILineaProduccion[]>([]);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getByPlantId(watchPlanta)));
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer Minutas
  const [minutas, setMinutas] = useState<IMinutas[]>([]);
  const getMinutas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const param = {
        lineaId: watchLinea,
        fechaDesde,
        fechaHasta
      };
      const responses = unwrapResult(await dispatch(MinutasSliceRequests.getAllByLFRequest(param)));
      setMinutas(responses);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Error al leer minutas.", "error");
    }
  };

  //Fecha
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  //Watch
  const watchLinea = watch("linea");
  const watchPlanta = watch("planta");

  useEffect(() => {
    if (watchPlanta) {
      setValue("linea", 0);
      getLineas();
    }
  }, [watchPlanta]);

  useEffect(() => {
    TitleChanger("Minutas");
    getPlantas();
  }, []);

  //Eliminar
  const eliminar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro de eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(MinutasSliceRequests.deleteRequest(row)));
        openNotificationUI("Se elimino el registro correctamente", "success");
        getMinutas();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Editar
  const [ModalOpen, setModalOpen] = useState(false);
  const [editState, setEditState] = useState<IMinutas | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [estaVisualizando, setEstaVisualizando] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setEstaVisualizando(false);
    setModalOpen(true);
  };
  //Visualizar
  const visualizar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setEstaVisualizando(true);
    setModalOpen(true);
  };
  //Agregar
  const agregar = () => {
    if (watchLinea == 0) {
      openNotificationUI("Seleccione Línea", "error");
      return;
    }
    setEditState(null);
    setEstaEditando(false);
    setEstaVisualizando(false);
    setModalOpen(true);
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", marginTop: "1rem", padding: "0 1rem" }}>
      <div className="sm:flex md:flex items-center justify-around w-full font-semibold rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
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
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
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
        <div className="p-2 overflow-auto m-2" style={{ flex: "1 1 100%" }}>
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
        </div>
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Button
            onClick={getMinutas}
            sx={{ marginLeft: 3 }}
            className={buttonClasses.greenButton}
            variant="contained"
            disabled={getValues("linea") === 0 || error}>
            Buscar
          </Button>
        </div>
      </div>

      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          // Overflow={true}
          buscar={true}
          excel
          IDcolumn={"id"}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Fecha Minuta",
              field: "fechaMinuta",
              render: (row) => {
                return moment(row.fechaMinuta).format("L");
              }
            },
            {
              title: "Línea",
              field: "linea.nombre"
            },
            {
              title: "Operador",
              field: "appUser.operator.surname",
              render: (row) => {
                return row.appUser.operator.surname + " " + row.appUser.operator.name;
              }
            },
            {
              title: "Tema",
              field: "tema"
            },
            {
              title: "Estado",
              field: "cumplido",
              render: (row) => {
                if (row.cumplido == "OK") {
                  return <div style={{ color: "green" }}>OK</div>;
                } else {
                  if (row.cumplido == "NG") {
                    return <div style={{ color: "red" }}>NG</div>;
                  } else {
                    return <div style={{ color: "yellow" }}>SB</div>;
                  }
                }
              }
            },
            {
              title: "Fecha de cierre",
              field: "fechaCierre",
              render: (row) => {
                return row.cumplido == "SB" ? "-" : moment(row.fechaCierre).format("L");
              }
            },
            {
              title: "Departamento",
              field: "departamento"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Visualizar">
                        <IconButton
                          onClick={() => {
                            visualizar(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Visibility color="info" />
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
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            eliminar(row.id);
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
            agregar();
          }}
          dataInfo={minutas}
        />
        <ModalCompoment
          title={estaEditando ? "Detalle" : "Nueva Minuta"}
          openPopup={ModalOpen}
          setOpenPopup={setModalOpen}>
          <MinutasForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getMinutas}
            estaEditando={estaEditando}
            linea={watchLinea}
            estaVisualizando={estaVisualizando}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
