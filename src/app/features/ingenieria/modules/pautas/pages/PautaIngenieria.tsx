import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { ChangeCircle, Check, Edit } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { PautaIngenieriaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaSlice";
import { Controller, useForm } from "react-hook-form";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import moment from "moment";
import { PautaIngenieriaForm } from "app/features/ingenieria/modules/pautas/modals/PautaIngenieriaForm";
import { IPautaIngenieria } from "app/models/IPautaIngenieria";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { PautaIngenieriaCambioVersionModal } from "app/features/ingenieria/modules/pautas/modals/PautaIngenieriaCambioVersionModal";

export const PautaIngenieria = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [modalOpenCambioVersion, setModalOpenCambioVersion] = useState(false);
  const [editState, setEditState] = React.useState<IPautaIngenieria | null>(null);
  const [selectedPautaIngenieria, setSelectedPautaIngenieria] = useState(0);
  const [estaEditando, setEstaEditando] = useState(false);
  const [tituloModal, setTituloModal] = useState("Creacion");
  const [plantas, setPlantas] = useState(null);
  const [lineasProduccion, setLineasProduccion] = useState(null);
  const [familias, setFamilias] = useState(null);
  const [pautasIngenieria, setPautasIngenieria] = useState(null);
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    plantaId: number;
    lineaProduccionId: number;
    lineaProduccionFamiliaId: number;
  }
  const initialStateVar = {
    plantaId: 0,
    lineaProduccionId: 0,
    lineaProduccionFamiliaId: 0
  };
  const { control, getValues } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const getPlantas = async () => {
    let responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    responses = JSON.parse(JSON.stringify(responses));
    setPlantas(responses);
  };

  const getLineasProduccionByPlanta = async () => {
    const plantaId = getValues("plantaId");
    if (plantaId != 0) {
      let responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaId)));
      responses = JSON.parse(JSON.stringify(responses));
      setLineasProduccion(responses);
    }
  };

  //Lleno el select de familias segun lineaProducicon
  const getFamiliasByLineaProduccion = async () => {
    const lineaProduccionId = getValues("lineaProduccionId");
    if (lineaProduccionId != 0) {
      setPautasIngenieria(null);
      let responses = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.getAllRequest()));
      responses = responses.filter((x) => x.lineaProduccionId == lineaProduccionId);
      setFamilias(JSON.parse(JSON.stringify(responses)));
    }
  };

  //Llena el listado de las pautas una vez que selecciono la familia.
  const getPautasByLineaProduccionFamiliaId = async () => {
    const lineaProduccionFamiliaId = getValues("lineaProduccionFamiliaId");
    if (lineaProduccionFamiliaId != 0) {
      const responses = unwrapResult(
        await dispatch(PautaIngenieriaSliceRequest.getListByLineaProduccionFamiliaId(lineaProduccionFamiliaId))
      );
      console.log(responses);
      setPautasIngenieria(JSON.parse(JSON.stringify(responses)));
    }
  };

  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);

  // React.useEffect(() => {
  //   if (pautasList?.length > 0) {
  //     setDataSource(JSON.parse(JSON.stringify(pautasList)));
  //     setCargando(false);
  //   }
  // }, [pautasList]);

  React.useEffect(() => {
    TitleChanger("CARGA DE PAUTAS");
    getPlantas();
  }, []);

  const editar = (row) => {
    setEditState({
      id: row.id,
      referencia: row.referencia,
      cantidad: row.cantidad,
      activado: row.activado,
      cantGenerico: row.cantGenerico,
      cantLinea: row.cantLinea,
      cantPlataforma: row.cantPlataforma,
      cantPuesto: row.cantPuesto,
      cantVersionProceso: row.cantVersionProceso,
      deleted: false,
      fecha: new Date(row.fecha),
      lineaProduccionFamiliaId: row.lineaProduccionFamiliaId,
      createdDate: row.createdDate
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Cambia a true el atributo activado del registro que selecciono y pasa a desactiva al registro q esta activo.
  const activarPauta = async (row) => {
    const listPautas = [...pautasIngenieria];
    const pautaActivada = listPautas.find((x) => x.activado);
    const aceptaEliminar = await getConfirmation("Activar", "¿ Confirma que desea activar ?");
    let result;
    if (aceptaEliminar) {
      pautaActivada.activado = false;
      try {
        result = await dispatch(PautaIngenieriaSliceRequest.PutRequest(JSON.parse(JSON.stringify(pautaActivada)))); //Desactivo la pauta q estaba activa
        const pautaAActivar = unwrapResult(await dispatch(PautaIngenieriaSliceRequest.getByIdRequest(row.id))); //Obtengo la pauta a activar
        if (pautaAActivar) {
          pautaAActivar.activado = true; //Activo la pauta
          await dispatch(PautaIngenieriaSliceRequest.PutRequest(JSON.parse(JSON.stringify(pautaAActivar)))); //Mando a updetear la pauta para q se active.
        }
      } catch (x) {
        result = null;
      }
      if (result) {
        openNotificationUI("Guardado exitosamente :)", "success");
        getPautasByLineaProduccionFamiliaId();
      }
    }
  };

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            {plantas && (
              <Controller
                name="plantaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Planta"
                      variant="standard"
                      onClick={() => getLineasProduccionByPlanta()}>
                      {plantas &&
                        plantas.map((x) => (
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
            )}
          </div>
          <div>
            {lineasProduccion && (
              <Controller
                name="lineaProduccionId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Linea Produccion</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Linea de Produccion"
                      variant="standard"
                      onClick={() => getFamiliasByLineaProduccion()}>
                      {lineasProduccion &&
                        lineasProduccion.map((x) => (
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
          <div>
            {familias && (
              <Controller
                name="lineaProduccionFamiliaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Familia"
                      variant="standard"
                      onClick={getPautasByLineaProduccionFamiliaId}>
                      {familias &&
                        familias.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.familia.nombre}</div>
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
          <div>
            {familias && (
              <Button className="btn btn-success" onClick={(e) => getPautasByLineaProduccionFamiliaId()}>
                Actualizar Listado
              </Button>
            )}
          </div>
        </div>
      </form>

      {/*   <div className="my-2 mx-4 h-full"> */}
      {pautasIngenieria && (
        <TableComponent
          Dense={true}
          Overflow={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Referencia",
              field: "referencia"
            },
            {
              title: "Familia",
              field: "lineaProduccionFamilia.familia.nombre"
            },
            {
              title: "Cantidad",
              field: "cantidad"
            },
            {
              title: "Aprobados",
              field: "",
              render: (row) => {
                return row.pautaIngenieriaAprobada != null
                  ? row.pautaIngenieriaAprobada.filter((x) => x.activo).length
                  : 0;
              }
            },
            {
              title: "Fecha",
              field: "",
              render: (row) => {
                return moment(row?.fecha).format("L");
              }
            },
            {
              title: "Activado",
              field: "",
              render: (row) => {
                return row.activado ? "SI" : "NO";
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <IconButton
                        onClick={() => {
                          editar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </div>
                    {!row.activado && (
                      <Tooltip title="Activar">
                        <IconButton
                          onClick={() => {
                            activarPauta(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Check />
                        </IconButton>
                      </Tooltip>
                    )}
                    <div>
                      <Tooltip title="Cambiar Versión">
                        <IconButton
                          onClick={() => {
                            setModalOpenCambioVersion(true);
                            setSelectedPautaIngenieria(row.id);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <ChangeCircle />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            setEstaEditando(false);
            setModalOpen(true);
          }}
          dataInfo={pautasIngenieria}
        />
      )}
      <ModalCompoment title={tituloModal + " de una pauta"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <PautaIngenieriaForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getPautasByLineaProduccionFamiliaId}
          estaEditando={estaEditando}
          lineaProduccionFamiliaId={getValues("lineaProduccionFamiliaId")}
          esPrimerRegistro={pautasIngenieria != null ? pautasIngenieria.length == 0 : true} //Si es el primer registro, lo pongo como activado al atributo.
        />
      </ModalCompoment>
      <ModalCompoment
        title={"Cambio de Versión "}
        openPopup={modalOpenCambioVersion}
        setOpenPopup={setModalOpenCambioVersion}>
        <PautaIngenieriaCambioVersionModal setOpenPopup={setModalOpen} pautaIngenieriaId={selectedPautaIngenieria} />
      </ModalCompoment>
    </div>
  );
};
