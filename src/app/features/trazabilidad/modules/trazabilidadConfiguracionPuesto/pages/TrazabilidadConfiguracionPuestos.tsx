import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { MapasRutasSliceRequest } from "app/Middleware/reducers/MapasRutasSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Check, Clear, Compare, Delete, Edit, SyncAlt } from "@mui/icons-material";
import { MapasRutasCamposSliceRequest } from "app/Middleware/reducers/MapasRutasCamposSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { RutasPuestosForm } from "app/features/trazabilidad/modules/trazabilidadConfiguracionPuesto/modals/RutasPuestosForm";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { RutasSubensambleForm } from "app/features/trazabilidad/modules/trazabilidadConfiguracionPuesto/modals/RutasSubensambleForm";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { CompararCamposForm } from "app/features/trazabilidad/modules/lineaDeProduccion/components/CompararCamposForm";

export const TrazabilidadConfiguracionPuestos = () => {
  interface initialState {
    lineaProd: string;
    rutaId: number;
    mapaRutaId: number;
  }
  const initialStateVar = {
    lineaProd: "",
    rutaId: 0,
    mapaRutaId: 0
  };
  const { control, setValue, getValues } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const params: any = useParams();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [puestos, setPuestos] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [listMapasRutasCampos, setListMapasRutasCampos] = useState([]);
  const [orden, setOrden] = useState(0);
  const [campoId, setCampoId] = useState(0);
  const [eligioPuesto, setEligioPuesto] = useState(false);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [ModalOpenSub, setOpenModalSub] = React.useState(false);
  const [ModalComparar, setModalComparar] = React.useState(false);
  const [rutaSelect, setRutaSelect] = useState(null);
  const [title, setTitle] = useState("");
  const [rutaNombre, setRutaNombre] = useState("");
  const [puestoId, setPuestoId] = useState();
  const [editState, setEditState] = useState(null);
  const [familia, setFamilia] = useState(null);
  React.useEffect(() => {
    TitleChanger("Configuración de Puestos");
  }, []);

  const getLinea = async () => {
    let lineaResult;
    try {
      lineaResult = unwrapResult(await dispatch(LineaProduccionSliceRequests.getByIdRequest(params.lineaId)));
    } catch (e) {
      lineaResult = null;
    }
    if (lineaResult) {
      lineaResult = JSON.parse(JSON.stringify(lineaResult));
      setFamilia(lineaResult);
      setValue("lineaProd", lineaResult.nombre);
    }
  };
  const onDeleteCampo = async (id) => {
    try {
      const resp = await getConfirmation("Eliminar campo", "Esta seguro que quiere eliminar el campo?");
      if (resp) {
        const response = await dispatch(MapasRutasCamposSliceRequest.deleteRequest(id));
        if (response) {
          openNotificationUI("Se elimino el campo correctamente", "success");
          refresh();
        }
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onEdit = (campo) => {
    setTitle("Editar el campo " + campo.nombre);
    setEditState(campo);
    setModalOpen(true);
  };

  const getRutas = async () => {
    let rutaResult;
    try {
      rutaResult = unwrapResult(
        await dispatch(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId(params.lineaId))
      );
    } catch (e) {
      rutaResult = null;
    }
    if (rutaResult) {
      rutaResult = JSON.parse(JSON.stringify(rutaResult));
      setRuta(rutaResult);
      setValue("rutaId", rutaResult.rutasId);
    }
  };

  //Obtengo los puestos segun la ruta que selecciona.
  const getPuestosByRuta = async () => {
    let mapasRutas;
    setRutaNombre(ruta?.rutas.nombre);
    try {
      mapasRutas = unwrapResult(await dispatch(MapasRutasSliceRequest.getAllRequest())); //traigo todos los mapas rutas
      const mapasRutasByRuta = mapasRutas.filter((x) => x.rutasId == ruta.rutasId); //Filtro por la ruta que selecciono
      if (mapasRutasByRuta) {
        setPuestos(JSON.parse(JSON.stringify(mapasRutasByRuta)));
      }
    } catch (e) {
      console.log("error" + e);
    }
  };

  //Obtengo los registros para el listado
  const getMapasRutasCamposByMapasRutasId = async () => {
    console.log(puestos);
    const findPuestoId = puestos.find((p) => p.id == getValues("mapaRutaId"));
    setPuestoId(findPuestoId.desdePuestoId);
    if (getValues("mapaRutaId") !== 0) {
      setEligioPuesto(true);
    }
    setRutaSelect(() => {
      return puestos.find((r) => r.id == getValues("mapaRutaId"));
    });

    const mapaRutaId = getValues("mapaRutaId");
    console.log("mapaRutaId:  " + mapaRutaId);
    let listMapasRutasCampos;
    try {
      listMapasRutasCampos = unwrapResult(await dispatch(MapasRutasCamposSliceRequest.getListByMapaRutaId(mapaRutaId))); //traigo todos los mapas rutas
      if (listMapasRutasCampos) {
        console.log(listMapasRutasCampos);
        setListMapasRutasCampos(JSON.parse(JSON.stringify(listMapasRutasCampos)));
      }
    } catch (e) {
      console.log("error" + e);
    }
  };
  const openModal = () => {
    setEditState(null);
    setModalOpen(true);
  };
  const handleComparar = (orden, id) => {
    setOrden(orden);
    setCampoId(id);
    setModalComparar(true);
  };
  const refresh = () => {
    getMapasRutasCamposByMapasRutasId();
  };

  useEffect(() => {
    getRutas();
    getLinea();
  }, []);
  useEffect(() => {
    if (ruta != 0) getPuestosByRuta();
  }, [ruta]);

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-3 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            <Controller
              name="lineaProd"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Linea de producción"
                  disabled={true}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                />
              )}
            />
          </div>
          <div>
            {ruta && (
              <Controller
                name="rutaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Ruta</InputLabel>
                    <Select disabled {...field} variant="standard">
                      <MenuItem key={ruta.id} value={ruta.rutasId}>
                        <div className="w-full">
                          <div>{ruta?.rutas?.nombre}</div>
                        </div>
                      </MenuItem>
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            {puestos && (
              <Controller
                name="mapaRutaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un puesto</InputLabel>
                    <Select {...field} variant="standard" onClick={() => getMapasRutasCamposByMapasRutasId()}>
                      {puestos &&
                        puestos.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.desdePuesto.nombre}</div>
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
      {listMapasRutasCampos && (
        <TableComponent
          Dense={true}
          Overflow={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Orden",
              field: "orden"
            },
            {
              title: "Validar semi",
              field: "",
              render: (row) => {
                return row.validarSemi ? (
                  <IconButton>
                    <Check color="success" />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Clear color="error" />
                  </IconButton>
                );
              }
            },
            {
              title: "Es identificador",
              field: "",
              render: (row) => {
                return row.identificador ? (
                  <IconButton>
                    <Check color="success" />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Clear color="error" />
                  </IconButton>
                );
              }
            },
            {
              title: "Persiste",
              field: "",
              render: (row) => {
                return row.persiste ? (
                  <IconButton>
                    <Check color="success" />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Clear color="error" />
                  </IconButton>
                );
              }
            },
            {
              title: "Serie",
              field: "",
              render: (row) => {
                return row.serie ? (
                  <IconButton>
                    <Check color="success" />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Clear color="error" />
                  </IconButton>
                );
              }
            },
            {
              title: "Expresión regular",
              field: "",
              render: (row) => (row?.expRegular != "" ? `${row.expRegular}` : "Libre")
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
                            onEdit(row);
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
                            onDeleteCampo(row.id);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Subensamble">
                        <IconButton
                          onClick={() => {
                            setTitle(
                              `Asignar un subensamble al campo "${row.nombre}" del puesto "${
                                rutaSelect.desdePuesto.nombre
                              }" de la linea "${getValues("lineaProd")}" en la ruta "${rutaNombre}"`
                            );
                            setEditState(row);
                            setOpenModalSub(true);
                          }}
                          aria-label="Subensamble"
                          size="small"
                          style={{ position: "relative" }}>
                          {row.subensambleSPP.length != 0 || row.subTipoDetalleId != null ? (
                            <SyncAlt color="success" />
                          ) : (
                            <SyncAlt color="error" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Comparar campos">
                        <IconButton size="small" onClick={() => handleComparar(row.orden, row.id)}>
                          <Compare />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            eligioPuesto ? openModal() : openNotificationUI("Seleccione un puesto", "error");
            setTitle(
              `Configurar el puesto ${rutaSelect.desdePuesto.nombre} de la ruta ${rutaNombre} de la linea ${getValues(
                "lineaProd"
              )}`
            );
          }}
          dataInfo={listMapasRutasCampos}
        />
      )}

      <ModalCompoment title={title} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <RutasPuestosForm
          productoId={familia?.productoId}
          editState={editState}
          setOpenPopup={setModalOpen}
          refresh={refresh}
          mapaRuta={rutaSelect}
        />
      </ModalCompoment>
      <ModalCompoment title={title} openPopup={ModalOpenSub} setOpenPopup={setOpenModalSub}>
        <RutasSubensambleForm
          lineaId={params.lineaId}
          puestoId={puestoId}
          campo={editState}
          setOpenPopup={setOpenModalSub}
          refresh={refresh}
          mapaRuta={rutaSelect}
          familia={familia}
        />
      </ModalCompoment>
      <ModalCompoment title={"Comparar campos"} openPopup={ModalComparar} setOpenPopup={setModalComparar}>
        <CompararCamposForm setOpenPopup={setModalComparar} orden={orden} campoId={campoId} />
      </ModalCompoment>
    </div>
  );
};
