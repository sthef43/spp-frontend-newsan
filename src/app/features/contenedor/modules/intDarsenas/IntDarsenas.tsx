import { Settings, Visibility } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IntDarsenaSliceRequests } from "app/Middleware/reducers/IntDarsenaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { IIntDarsena } from "app/models/IIntDarsena";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { IntDarsenaProgramar } from "app/features/contenedor/modules/intDarsenas/modals/IntDarsenaProgramar";
import { IntVerContenidoRemitoPadre } from "app/features/contenedor/modules/intDarsenas/modals/IntVerContenidoRemitoPadre";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IntGestorDarsenas } from "./modals/IntGestorDarsenas";

export const IntDarsenas = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();

  //Form
  interface initialState {
    plantOrigenId?: number | 0;
  }
  const initialStateVar = {
    plantOrigenId: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Leer
  const [listPlantas, setListPlantas] = useState<IPlant[] | []>([]);
  const getListPlantas = async () => {
    try {
      const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(result);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };
  const [listDarsenas, setListDarsenas] = useState<IIntDarsena[] | []>([]);
  const getListDarsenas = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(IntDarsenaSliceRequests.getAllByPlantRequest(watchPlantaOrigen)));
      //Para quitar todos los remitos bases
      const updatedList = result.map(
        (obj) =>
          obj.intRemitoPadreId === 1
            ? {
                ...obj,
                intRemitoPadre: {}
              }
            : obj // Si no cumple la condición, simplemente devuelve el objeto original
      );
      setListDarsenas(updatedList);
    } catch (error) {
      openNotificationUI("Error al leer Dársenas.", "error");
    }
  };

  //Watch
  const watchPlantaOrigen = watch("plantOrigenId");
  useEffect(() => {
    if (watchPlantaOrigen) {
      getListDarsenas();
    }
  }, [watchPlantaOrigen]);

  //Programar
  const [intDarsenaSelect, setIntDarsenaSelect] = useState<IIntDarsena | null>(null);
  const [modalOpenProgramar, setModalOpenProgramar] = useState(false);
  const programar = (row) => {
    setIntDarsenaSelect(row);
    setModalOpenProgramar(true);
  };

  //Cambiar Darsena
  // const [modalOpenCambiar, setModalOpenCambiar] = useState(false);
  // const [intDarsenasDisponibles, setIntDarsenasDisponibles] = useState<IIntDarsena[] | null>(null);
  // const cambiar = (row) => {
  //   setIntDarsenaSelect(row);
  //   const darsenasDisponibles = listDarsenas.filter( x => x.intRemitoPadreId == 1)
  //   setIntDarsenasDisponibles(darsenasDisponibles);
  //   setModalOpenCambiar
  //   console.log(row);
  //   console.log(darsenasDisponibles);

  // };

  //Ver detalle - Ojo
  const [modalOpenVerContenido, setModalOpenVerContenido] = useState(false);
  const [intRemitoPadreSelect, setIntRemitoPadreSelect] = useState<IIntRemitoPadre | null>(null);
  const getVerDetalle = (row) => {
    setIntRemitoPadreSelect(row.intRemitoPadre);
    setModalOpenVerContenido(true);
  };

  //Gestionar las dársenas
  const [modalOpenGestionDarsena, setModalOpenGestionDarsena] = useState(false);
  const gestionDarsenas = () => {
    setModalOpenGestionDarsena(true);
  };

  useEffect(() => {
    TitleChanger("PROGRAMADOR DE DÁRSENAS");
    getListPlantas();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <form>
        {/* Planta de Origen */}
        <div className="p-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div style={{ display: "flex", padding: "10px" }}>
            <div style={{ flex: 1 }}>
              <Controller
                name="plantOrigenId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta de Origen" variant="standard">
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
            <div style={{ flex: 4 }}></div>
            <div style={{ flex: 1 }}>
              <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
                <Button
                  className={classes.greenButton}
                  variant="contained"
                  disabled={watchPlantaOrigen == 0}
                  onClick={gestionDarsenas}>
                  Gestión Dársena
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="my-2">
          <TableComponent
            Dense={true}
            IDcolumn={"id"}
            columns={[
              // {
              //   title: "Id",
              //   field: "id"
              // },
              {
                title: "N°",
                field: "detalle"
              },
              {
                title: "Fecha",
                field: "intRemitoPadre.createdDate",
                render: (row) => moment(row.intRemitoPadre.createdDate).format("L")
              },
              {
                title: "Patente",
                field: "intRemitoPadre.patente"
              },
              {
                title: "Chofer",
                field: "intRemitoPadre.chofer"
              },
              {
                title: "Contenedor",
                field: "intRemitoPadre.contenedor"
              },
              {
                title: "N° Precinto",
                field: "intRemitoPadre.precintoCandado"
              },
              {
                title: "Remito Padre",
                field: "intRemitoPadre.id",
                render: (row) =>
                  row.intRemitoPadre.id ? "RP" + row.intRemitoPadre.id.toString().padStart(10, "0") : ""
              },
              {
                title: "Planta Origen",
                field: "intRemitoPadre.plantOrigen.name"
              },
              {
                title: "Planta Destino",
                field: "intRemitoPadre.plantDestino.name"
              },
              {
                title: "Estado",
                field: "intRemitoPadre.intEstado.nombre"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        {/* {row.intRemitoPadre.id ? (
                          <Tooltip title="Cambiar Dársena">
                            <IconButton
                              onClick={() => {
                                cambiar(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Settings />
                            </IconButton>
                          </Tooltip>
                        ) : ( */}
                        <Tooltip title="Programar">
                          <IconButton
                            disabled={row.intRemitoPadre.id}
                            onClick={() => {
                              programar(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Settings />
                          </IconButton>
                        </Tooltip>
                        {/* )} */}
                      </div>
                      <div>
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            color="info"
                            disabled={!row.intRemitoPadre.id}
                            onClick={() => {
                              getVerDetalle(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={listDarsenas}
          />
        </div>
      </form>
      <ModalCompoment title="Programar" openPopup={modalOpenProgramar} setOpenPopup={setModalOpenProgramar}>
        <IntDarsenaProgramar
          setOpenPopup={setModalOpenProgramar}
          intDarsenaSelect={intDarsenaSelect}
          refresh={getListDarsenas}
          listDarsenas={listDarsenas}
        />
      </ModalCompoment>

      {/* Ver Remito Padre con todos los hijos */}
      <ModalCompoment title="Ver Contenido" openPopup={modalOpenVerContenido} setOpenPopup={setModalOpenVerContenido}>
        <IntVerContenidoRemitoPadre setOpenPopup={setModalOpenVerContenido} intRemitoPadre={intRemitoPadreSelect} />
      </ModalCompoment>

      <ModalCompoment
        title="Gestión Darsenas"
        openPopup={modalOpenGestionDarsena}
        setOpenPopup={setModalOpenGestionDarsena}>
        <IntGestorDarsenas
          setOpenPopup={setModalOpenGestionDarsena}
          plantaId={watchPlantaOrigen}
          refresh={getListDarsenas}
        />
      </ModalCompoment>
    </div>
  );
};
