import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaPuestoSlice, LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { AgregarPuestoForm } from "app/features/trazabilidad/modules/lineaDeProduccion/components/AgregarPuestoForm";
import { ILPNPuesto } from "app/models/ILPNPuesto";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Settings, SubdirectoryArrowRight } from "@mui/icons-material";
import { ILineaPuesto } from "app/models/ILineaPuesto";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { PuestoTableroCRUDPage } from "./PuestoTableroCRUDPage";
import { LineaPuestoTableroSlice } from "app/Middleware/reducers/LineaPuestoTableroSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

// import { LPNPuestoSliceRequests } from "app/Middleware/reducers/LPNPuestoSlice";

type onCloseLpnDialogProps = {
  value?: {
    cantidad: number;
    prefijo: string;
  };
  lineaPuesto: ILineaPuesto;
  state?: boolean;
};

export interface LPNDialogProps {
  open: boolean;
  lineaPuesto: ILineaPuesto;
  onClose: (onCloseLpnDialogProps) => void;
}
function LPNDialog({ open, onClose, lineaPuesto }: LPNDialogProps) {
  const [newValue, setNewValue] = useState(1);
  const [prefijo, setPrefijo] = useState("");
  const classes = MaterialButtons();

  const handleChange = (event) => {
    const value = event.target.value;
    setNewValue(value);
  };

  const handleChangePrefijo = (event) => {
    const value = event.target.value;
    setPrefijo(value);
  };

  const handleClickAceptar = () => {
    if (newValue == 0) return;
    if (prefijo == "") return;
    onClose({
      value: {
        cantidad: newValue,
        prefijo: prefijo.toUpperCase()
      },
      lineaPuesto,
      state: true
    });
  };

  return (
    <Dialog onClose={() => onClose({ state: false })} open={open}>
      <DialogTitle>Ingrese el tamaño del lpn</DialogTitle>
      <DialogContent>
        <input
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:border-b-2 text-center outline-none text-black"
          type="number"
          placeholder="Ingrese la cantidad"
          value={newValue}
          onChange={handleChange}
        />
        {newValue == 0 ? <small className="text-sm text-red-700">El LPN no puede tener un tamaño de 0</small> : null}
        <input
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:border-b-2 text-center outline-none mt-1 text-black uppercase"
          type="text"
          placeholder="Ingrese el prefijo"
          onChange={handleChangePrefijo}
        />
      </DialogContent>
      <DialogActions>
        <Button className={classes.redButton} variant="contained" onClick={() => onClose({ state: false })}>
          Cancelar
        </Button>
        <Button className={classes.blueButton} variant="contained" onClick={handleClickAceptar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

//filaSeleccionada tiene el id de LineaProduccion
//productoId es el id del producto que tiene la LineaProduccion
interface Props {
  setOpenPopup: any;
  filaSeleccionada: any;
  productoId: any;
  refresh: any;
}
export const AccionAsignarPuestos = ({ refresh, setOpenPopup, filaSeleccionada, productoId }: Props): JSX.Element => {
  const [puestosList, setPuestosList] = useState(null);
  const [declararEBS, setDeclararEBS] = useState(false);
  const [tableroPuesto, setTableroPuesto] = useState(false);
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState(null);

  useEffect(() => {
    getPuestosByProductoId();
  }, []);

  React.useEffect(() => {
    if (puestosList?.length > 0) {
      setData(JSON.parse(JSON.stringify(puestosList)));
    } else {
      setData([]);
    }
  }, [puestosList]);
  React.useEffect(() => {
    return () => {
      dispatch(LineaPuestoTableroSlice.actions.setObject(null));
      dispatch(LineaPuestoSlice.actions.setObject(null));
    };
  }, []);

  const getPuestosByProductoId = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllWithRelations(productoId)));
    const newResult = result.filter((x) => x.lineaProduccionId == filaSeleccionada);
    setPuestosList(newResult);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  const handleDeclararEBS = async (data) => {
    data.declararEBS = !data.declararEBS;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handleAutomotriz = async (data) => {
    data.automotriz = !data.automotriz;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handleConMarcacion = async (data) => {
    data.loginOperario = !data.loginOperario;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handleContingencia = async (data) => {
    data.contingencia = !data.contingencia;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };
  const handlePuestoDeRechazo = async (data) => {
    data.puestoDeRechazo = !data.puestoDeRechazo;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handlePuestoDeObservacion = async (data) => {
    data.puestoDeObservacion = !data.puestoDeObservacion;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handlePuestoCritico = async (data) => {
    data.critico = !data.critico;
    await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const onTableroPuesto = async (data: ILineaPuesto) => {
    dispatch(LineaPuestoSlice.actions.setObject(data));
    dispatch(LineaPuestoTableroSlice.actions.setObject(data.lineaPuestoTablero));
    setTableroPuesto(true);
  };

  const [openLPNDialog, setLPNDialog] = useState(false);
  const [lpnVal, setLpnVal] = useState<ILineaPuesto>();

  const handleEsLpnClick = async (checked: boolean, data: ILineaPuesto) => {
    if (checked) {
      setLpnVal(data);
      setLPNDialog(true);
      return;
    }
    data.esLPN = false;
    const response = await dispatch(LineaPuestoSliceRequest.PutRequest(data));
    getPuestosByProductoId();
  };

  const handleLPNDialogClose = async ({ lineaPuesto, state, value }: onCloseLpnDialogProps) => {
    setLPNDialog(false);
    setLpnVal(null);
    if (state) {
      lineaPuesto.esLPN = true;
      if (!lineaPuesto.lpnPuesto) {
        const newLPNPuesto: ILPNPuesto = {
          lineaPuestoId: lineaPuesto.id,
          tamano: value.cantidad,
          prefijo: value.prefijo,
          cantidad: 0
        };
        lineaPuesto.lpnPuesto = newLPNPuesto;
      } else {
        lineaPuesto.lpnPuesto.lpn = null;
        lineaPuesto.lpnPuesto.tamano = value.cantidad;
        lineaPuesto.lpnPuesto.prefijo = value.prefijo;
      }
      const response = await dispatch(LineaPuestoSliceRequest.PutRequest(lineaPuesto));
      // const response2 = await dispatch(LPNPuestoSliceRequests.PostRequest(newLPNPuesto))
      getPuestosByProductoId();
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <AgregarPuestoForm
        filaSeleccionada={filaSeleccionada}
        productoId={productoId}
        puestos={puestosList}
        refresh={refresh}
        refreshList={getPuestosByProductoId}></AgregarPuestoForm>
      <TableComponent
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Puesto",
            field: "puesto.nombre"
          },
          {
            title: "Descripción",
            field: "puesto.descripcion"
          },
          {
            title: "Tipo",
            field: "tipo"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <div className="flex gap-5">
                <Tooltip title="Configurar tablero">
                  <IconButton onClick={() => onTableroPuesto(row)}>
                    <Settings color="info" />
                  </IconButton>
                </Tooltip>
                <div className="grid grid-cols-3">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.automotriz}
                        onClick={() => {
                          handleAutomotriz(row);
                        }}
                      />
                    }
                    label="Automotriz?"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.declararEBS}
                        onClick={() => {
                          handleDeclararEBS(row);
                        }}
                      />
                    }
                    label="Declarar en EBS?"
                  />
                  <div className="flex flex-col items-start">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={row.puestoDeRechazo}
                          onClick={() => {
                            handlePuestoDeRechazo(row);
                          }}
                        />
                      }
                      label="Puesto de rechazo?"
                    />
                    {row.puestoDeRechazo ? (
                      <div className="pl-2">
                        <SubdirectoryArrowRight />
                        <Tooltip title="Se rechaza el equipo pero no se bloquea ">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={row.puestoDeObservacion}
                                onClick={() => {
                                  handlePuestoDeObservacion(row);
                                }}
                              />
                            }
                            label="Puesto de Observacion?"
                          />
                        </Tooltip>
                      </div>
                    ) : null}
                  </div>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.critico}
                        onClick={() => {
                          handlePuestoCritico(row);
                        }}
                      />
                    }
                    label="¿Critico?"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.loginOperario}
                        onClick={() => {
                          handleConMarcacion(row);
                        }}
                      />
                    }
                    label="Con Marcacion"
                  />

                  <Tooltip title="Se solicitara NRO de lpn en el puesto">
                    <>
                      <FormControlLabel
                        className="mr-0"
                        label="LPN"
                        control={
                          <Checkbox
                            checked={row.esLPN}
                            onChange={(ev, chk) => {
                              handleEsLpnClick(chk, row);
                            }}
                          />
                        }
                      />
                      {row.esLPN && (
                        <span className="text-gray-300  text-sm ml-1 mr-[16px] font-bold">
                          ({row.lpnPuesto.prefijo})
                        </span>
                      )}
                    </>
                  </Tooltip>

                  {row.declararEBS && (
                    <Tooltip title="Se guardaran los datos en una Tabla temporal">
                      <>
                        <FormControlLabel
                          className="mr-0"
                          label="Contingencia"
                          control={
                            <Checkbox
                              checked={row.contingencia}
                              onClick={() => {
                                handleContingencia(row);
                              }}
                            />
                          }
                        />
                      </>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          }
        ]}
        dataInfo={DataOpen}
      />

      <LPNDialog open={openLPNDialog} onClose={handleLPNDialogClose} lineaPuesto={lpnVal} />

      <ModalCompoment setOpenPopup={setTableroPuesto} openPopup={tableroPuesto} title="Configurar puesto para tablero">
        <PuestoTableroCRUDPage closeModal={setTableroPuesto} refresh={getPuestosByProductoId} />
      </ModalCompoment>
    </div>
  );
};
