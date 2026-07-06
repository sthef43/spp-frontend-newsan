import { Delete, Edit } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { CodigoRechazosSliceRequest } from "app/Middleware/reducers/CodigoRechazosSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea } from "app/models";
import { ICodigoRechazos } from "app/models/ICodigoRechazos";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CarrgaRechazosForm } from "./CarcgaRechazosForm";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

export const CargaRechazosPage = () => {
  const { TitleChanger } = useTitleOfApp();

  const [plantas, setPlantas] = useState(null);
  const [lineasProduccion, setLineasProduccion] = useState<ILineaProduccion[]>(null);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    TitleChanger("carga el rechazo");
    getPlantas();
  }, []);

  interface initialState {
    plantaId: number;
    lineaProduccionId: number;
    lineaProduccionFamiliaId: number;
    modeloId: number;
    semielaboradoTipoId: number;
  }
  const initialStateVar = {
    plantaId: 0,
    lineaProduccionId: 0,
    lineaProduccionFamiliaId: 0,
    modeloId: 0,
    semielaboradoTipoId: 0
  };
  const { control, getValues, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const getPlantas = async () => {
    let responses = await unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    responses = JSON.parse(JSON.stringify(responses));
    console.log(responses);

    setPlantas(responses);
  };

  const getLineasProduccionByPlanta = async () => {
    setListCodigorechazos(null);
    const plantaId = getValues("plantaId");
    if (plantaId != 0) {
      let responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaId)));
      responses = JSON.parse(JSON.stringify(responses));
      setLineasProduccion(responses);
    }
  };

  useEffect(() => {
    TitleChanger("Carga de rechazos");
  }, []);

  const getLinea = async (identificadorLinea: number) => {
    if (!identificadorLinea) {
      return null;
    }
    const result = unwrapResult(await dispatch(LineaSliceRequests.GetByCodigoInicio(identificadorLinea.toString())));
    if (result) {
      return result;
    } else return null;
  };

  const [lineaSelected, setLineaSelected] = useState<ILinea>(null);

  const getData = async () => {
    const lineaProduciconSelected: ILineaProduccion = lineasProduccion.find((x) => x.id == watch("lineaProduccionId"));

    const linea: ILinea = await getLinea(lineaProduciconSelected.identificadorLinea); //Trae la liea de producicon06

    if (!linea) {
      setLineaSelected(null);
      return false;
    }
    setLineaSelected(linea); //Guardo la linea para pasarsela al modal de Agregar/Editar
    getListCodigoRechazos(linea.idLinea);
  };

  const [listCodigorechazos, setListCodigorechazos] = useState<ICodigoRechazos[]>(null);
  const [listRechazos, setListRechazos] = useState<ICodigoRechazos[]>(null);
  const getListCodigoRechazos = async (idLinea: number) => {
    const result = unwrapResult(await dispatch(CodigoRechazosSliceRequest.GetListByLineaIdRequest(idLinea)));
    if (result) {
      setListCodigorechazos(result);
    } else setListCodigorechazos(null);
  };

  const AgregarCodigo = async () => {
    console.log(listCodigorechazos);
    const listaRechazosFiltrada = listCodigorechazos.map((x) => {
      const resultado = {
        ...x,
        codigo: String(x.codigoRechazo).padStart(3, "000") + "R" + String(x.idLinea).padStart(3, "000")
      };
      return resultado;
    });
    console.log(listaRechazosFiltrada);
    setListRechazos(listaRechazosFiltrada);
  };

  useEffect(() => {
    if (listCodigorechazos) {
      AgregarCodigo();
    }
  }, [listCodigorechazos]);

  const watchLineaProduccion = watch("lineaProduccionId");
  useEffect(() => {
    if (watchLineaProduccion > 0) {
      getData();
    }
  }, [watchLineaProduccion]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editState, setEditState] = useState<ICodigoRechazos>(null);
  const editar = (codigoRechazo: ICodigoRechazos) => {
    setModalOpen(true);
    setEditState(codigoRechazo);
  };

  const eliminar = async (codigoRechazo: ICodigoRechazos) => {
    const result = unwrapResult(
      await dispatch(CodigoRechazosSliceRequest.DeleteRequest(codigoRechazo.idCodigoRechazo))
    );
    if (result) {
      openNotificationUI("Eliminado exitosamente :)", "success");
      getData();
    } else {
      openNotificationUI("Hubo un error al eliminar :(", "error");
    }
  };

  const { openNotificationUI } = useNotificationUI();

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-2 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
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
                    <Select {...field} placeholder="Seleccione una Linea de Produccion" variant="standard">
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
        </div>
      </form>
      {/* {listCodigorechazos && ( */}
      <TableComponent
        buscar
        IDcolumn={"idCodigoRechazo"}
        excel
        agregar={() => {
          setModalOpen(true);
          setEditState(null);
        }}
        columns={[
          {
            title: "Descripcion",
            field: "descripcionRechazo"
          },
          {
            title: "Código",
            field: "codigo"
          },
          {
            title: "Codigo Rechazo",
            field: "codigoRechazo"
          },
          {
            title: "Informe Mensual",
            field: "informeMensual"
          },
          {
            title: "Totaliza",
            field: "totaliza"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        editar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit color="success" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        eliminar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )
          }
        ]}
        dataInfo={listRechazos}
      />
      {/* )} */}
      <ModalCompoment title="Agregar" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <CarrgaRechazosForm
          editState={editState}
          idLinea={lineaSelected?.idLinea}
          setOpenModal={setModalOpen}
          refresh={getData}></CarrgaRechazosForm>
      </ModalCompoment>
    </div>
  );
};
