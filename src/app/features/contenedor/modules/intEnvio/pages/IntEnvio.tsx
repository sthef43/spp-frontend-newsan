import { AddCircleOutline, CheckCircleOutline, LocalPrintshop } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IntEstadoSliceRequests } from "app/Middleware/reducers/IntEstadoSlice";
import { IntRemitoPadreSliceRequests } from "app/Middleware/reducers/IntRemitoPadreSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { IIntEstado } from "app/models/IIntEstado";
import { IIntRemito } from "app/models/IIntRemito";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { IntEnviarMaterialForm } from "app/features/contenedor/modules/intEnvio/modals/IntEnviarMaterialForm";
import { IntImprimirRemitoPadre } from "app/features/contenedor/components/IntImprimirRemitoPadre";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
// import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

export const IntEnvio = () => {
  // const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  // const { getConfirmation } = useConfirmationDialog();
  // const [ModalOpen, setModalOpen] = useState(false);

  //Form
  interface initialState {
    plantDestinoId: number | 0;
    plantOrigenId: number | 0;
    intEstadoId: number | 0;
  }
  const initialStateVar = {
    plantOrigenId: 0,
    plantDestinoId: 0,
    intEstadoId: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Leer Plantas
  const [listPlantas, setListPlantas] = useState<IPlant[] | []>([]);
  const getListPlantas = async () => {
    try {
      const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      // setValue("plantDestinoId", infoUser.operator.plantaId);
      setListPlantas(result);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  //Leer Estados
  const [listEstados, setListEstados] = useState<IIntEstado[] | []>([]);
  const getListEstados = async () => {
    try {
      const result = unwrapResult(await dispatch(IntEstadoSliceRequests.getAllRequest()));
      setValue("intEstadoId", 0);
      setListEstados(result);
    } catch (error) {
      openNotificationUI("Error al leer Estados.", "error");
    }
  };

  //Leer Remito Padre
  const [listIntRemitoPadre, setlistIntRemitoPadre] = useState<IIntRemitoPadre[] | []>([]);
  const getIntRemitoPadre = async () => {
    if (!watchPlantaOrigen || !watchPlantaDestino) {
      openNotificationUI("Debe seleccionar planta origen y destino", "error");
    } else {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      try {
        const objeto = {
          intEstadoId: watchEstado,
          plantOrigenId: watchPlantaOrigen,
          plantDestinoId: watchPlantaDestino
        };
        const responses = unwrapResult(
          await dispatch(IntRemitoPadreSliceRequests.getAllByEstadoOrigenDestinoRequest(objeto))
        );
        // console.log(responses);
        setlistIntRemitoPadre(responses);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        openNotificationUI("Error al leer.", "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  //Watch
  const watchEstado = watch("intEstadoId");
  const watchPlantaOrigen = watch("plantOrigenId");
  const watchPlantaDestino = watch("plantDestinoId");
  useEffect(() => {
    if (watchEstado) {
      getIntRemitoPadre();
    }
  }, [watchEstado]);

  useEffect(() => {
    if (watchPlantaOrigen || watchPlantaDestino) {
      // console.log("estoy reset de estados");
      setlistIntRemitoPadre([]);
      setValue("intEstadoId", 0);
    }
  }, [watchPlantaOrigen | watchPlantaDestino]);

  //Asignación de Remitos
  const [intRemitoPadreSelect, setIntRemitoPadreSelect] = useState<IIntRemitoPadre | null>(null);
  const [ModalOpenAsignarRemitos, setModalOpenAsignarRemitos] = useState(false);
  const asignarRemitos = (row) => {
    setIntRemitoPadreSelect(row);
    setModalOpenAsignarRemitos(true);
  };

  //Imprimir Remito
  const [intDetalleSelect, setIntDetalleSelect] = useState<IIntRemito[] | null>(null);
  const [modalOpenPrint, setModalOpenPrint] = useState(false);
  const imprimirRemito = async (row) => {
    setIntRemitoPadreSelect(row);
    // getIntDetalleSelect(row);
  };
  //Leer Detalle
  // const getIntDetalleSelect = async (row) => {
  //   try {
  //     const result = unwrapResult(await dispatch(IntRemitoSliceRequests.getAllByIntRemitoPadreRequest(row.id)));
  //     const agregado = result.map((file, index) => ({ ...file, numero: index + 1 }));
  //     setIntDetalleSelect(agregado);
  //     setModalOpenPrint(true);
  //   } catch (error) {
  //     openNotificationUI("Error al leer Remitos.", "error");
  //   }
  // };
  //General Imprimir
  const componentRef = React.useRef(null);
  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Remito`,
    copyStyles: true
  });
  useEffect(() => {
    if (modalOpenPrint && intDetalleSelect) {
      const timeout = setTimeout(() => {
        handleImprimir();
      }, 500); // Pequeño delay para asegurar que se renderice

      return () => clearTimeout(timeout);
    }
  }, [modalOpenPrint, intDetalleSelect]);

  //General
  useEffect(() => {
    TitleChanger("Generador de Envíos");
    getListPlantas();
    getListEstados();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <form>
        <div className="p-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div style={{ display: "flex", padding: "1px" }}>
            <div style={{ flex: 1, padding: "10px" }}>
              <Controller
                name="plantOrigenId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta Origen</InputLabel>
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
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, padding: "10px" }}>
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
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, padding: "10px" }}>
              <Controller
                name="intEstadoId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Estado</InputLabel>
                    <Select {...field} placeholder="Seleccione Estado Remito Padre" variant="standard">
                      {listEstados &&
                        listEstados.map((x) => (
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
            <div style={{ flex: 2 }}></div>
          </div>
        </div>

        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          excel
          columns={[
            {
              title: "Fecha",
              field: "createdDate",
              render: (row) => {
                return moment(row.createdDate).format("L");
              }
            },
            {
              title: "N° remito",
              field: "id",
              render: (row) => "RP" + row.id.toString().padStart(10, "0")
            },
            {
              title: "Planta Origen",
              field: "plantOrigen.name"
            },
            {
              title: "Planta Destino",
              field: "plantDestino.name"
            },
            {
              title: "Estado",
              field: "intEstado.nombre"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Asignar / Ver Remitos">
                        <IconButton
                          onClick={() => {
                            asignarRemitos(row);
                          }}
                          size="small"
                          color={row.intRemitos.length == 0 ? "inherit" : "success"}
                          style={{ position: "relative" }}>
                          {row.intRemitos.length == 0 ? <AddCircleOutline /> : <CheckCircleOutline />}
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir">
                        <span>
                          <IconButton
                            onClick={() => {
                              imprimirRemito(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <LocalPrintshop />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={listIntRemitoPadre}
        />
      </form>
      <ModalCompoment
        title="Asignar Remitos"
        openPopup={ModalOpenAsignarRemitos}
        setOpenPopup={setModalOpenAsignarRemitos}>
        <IntEnviarMaterialForm
          setOpenPopup={setModalOpenAsignarRemitos}
          refresh={getIntRemitoPadre}
          intRemitoPadreSelect={intRemitoPadreSelect}
        />
      </ModalCompoment>
      <div style={{ display: "none" }}>
        <IntImprimirRemitoPadre parentRef={componentRef} fila={intRemitoPadreSelect} detalle={intDetalleSelect} />
      </div>
    </div>
  );
};
