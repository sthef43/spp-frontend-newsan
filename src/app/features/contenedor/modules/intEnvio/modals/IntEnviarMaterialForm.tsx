import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { IIntRemitoPadre } from "app/models/IIntRemitoPadre";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { IIntRemito } from "app/models/IIntRemito";
import { IntRemitoSliceRequests } from "app/Middleware/reducers/IntRemitoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { IntVerContenido } from "../../../modals/IntVerContenido";
interface props {
  setOpenPopup: any;
  refresh?: any;
  intRemitoPadreSelect?: IIntRemitoPadre | null;
}
export const IntEnviarMaterialForm = ({ setOpenPopup, refresh, intRemitoPadreSelect }: props) => {
  // const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  //Form
  interface initialState {
    intRemitoId: string;
  }
  const initialStateVar = {
    intRemitoId: ""
  };
  const { control, setValue, getValues, handleSubmit, setFocus, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //General cuando llega Remito Padre
  // useEffect(() => {
  //   if (intRemitoPadreSelect) {
  //     getListRemitos();
  //   }
  // }, [intRemitoPadreSelect]);

  //Leer Remitos segun Remito Padre
  // const [listRemitos, setListRemitos] = useState<IIntRemito[] | []>([]);
  // const getListRemitos = async () => {
  //   try {
  //     const result = unwrapResult(
  //       await dispatch(IntRemitoSliceRequests.getAllByIntRemitoPadreRequest(intRemitoPadreSelect.id))
  //     );
  //     setListRemitos(result);
  //   } catch (error) {
  //     openNotificationUI("Error al leer el Remito.", "error");
  //   }
  // };

  //Buscar Remito para cargarlo
  //TRATAR DE HACER ESTO EN EL BACK PARA QUE NO USE TANTO ESPACIO
  //const getRemito = async () => {
  //   try {
  //     const result = unwrapResult(await dispatch(IntRemitoSliceRequests.getByIdRemitoRequest(parseInt(WatchRemitoId))));
  //     const filter = listRemitos.filter((x) => x.id == result[0].id);
  //     if (filter.length > 0) {
  //       openNotificationUI("El remito" + WatchRemitoId + " ya está agregado", "error");
  //     } else {
  //       if (result[0].intRemitoPadreId !== 1) {
  //         openNotificationUI("Remito " + WatchRemitoId + " ya asignado a Remito Padre N°: " + result[0].intRemitoPadreId, "error");
  //       } else {
  //         //intRemitoPadreSelect
  //         if (result[0].plantOrigenId !== intRemitoPadreSelect.plantOrigenId) {
  //           openNotificationUI("El Origen no corresponde: " + result[0].plantOrigen.name, "error");
  //         } else {
  //           if (result[0].plantDestinoId !== intRemitoPadreSelect.plantDestinoId) {
  //             openNotificationUI("El Destino no corresponde: " + result[0].plantDestino.name, "error");
  //           } else {
  //             cargarRemito({ ...result[0], intRemitoPadreId: intRemitoPadreSelect.id });
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     openNotificationUI("Error al leer el Remito.", "error");
  //   }
  //   setValue("intRemitoId", "");
  //   setFocus("intRemitoId");
  // };

  //Cargar Remito
  const cargarRemito = async (remito) => {
    const objectSubmit = {
      ...remito,
      intRemitoPadre: null,
      appUser: null,
      areaDestino: null,
      plantOrigen: null,
      plantDestino: null
    };
    try {
      unwrapResult(await dispatch(IntRemitoSliceRequests.PutRequest(objectSubmit)));
      // getListRemitos();
    } catch (error) {
      openNotificationUI("Error al leer el Remito.", "error");
    }
  };

  //Al presionar enter busco el Remito
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // getRemito();
    }
  };

  //Suprimir
  const suprimir = async (row) => {
    const resp = await getConfirmation("Desasignar", "Está seguro que desea desasignar el Remito?");
    if (resp) {
      cargarRemito({ ...row, intRemitoPadreId: 1 });
    }
  };

  //Ver detalle - Ojo
  const [intRemitoSelect, setIntRemitoSelect] = useState<IIntRemito | null>(null);
  const [modalOpenVerContenido, setModalOpenVerContenido] = useState(false);
  const getVerDetalle = (row) => {
    setIntRemitoSelect(row);
    setModalOpenVerContenido(true);
  };

  //Watch
  const WatchRemitoId = watch("intRemitoId");

  //Cerrar
  const cerrar = () => {
    refresh();
    setOpenPopup(false);
  };

  return (
    <>
      <div style={{ height: "100%", width: "60vw", position: "relative" }}>
        <form style={{ width: "100%", height: "100%" }}>
          {/* Primer Recuadro */}
          <div className="rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ margin: "20px" }}>
            <div style={{ padding: "5px", marginLeft: "30px" }}>
              <div className="m-1">Origen: {intRemitoPadreSelect.plantOrigen.name}</div>
              <div className="m-1">Destino: {intRemitoPadreSelect.plantDestino.name}</div>
              <div className="m-1">Patente: {intRemitoPadreSelect.patente}</div>
              <div className="m-1">Chofer: {intRemitoPadreSelect.chofer}</div>
              <div className="m-1">Contenedor: {intRemitoPadreSelect.contenedor}</div>
              <div className="m-1">N° Precinto/Candado: {intRemitoPadreSelect.precintoCandado}</div>
            </div>
          </div>

          {/* Segundo cuadro */}
          <form>
            <div style={{ margin: "20px" }}>
              Escanear Código de Remito
              <div className="rounded-lg shadow-elevation-4 bg-background">
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      // margin: "10px",
                      alignContent: "center",
                      fontSize: "30px"
                    }}>
                    <Controller
                      name="intRemitoId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField
                            fullWidth
                            {...field}
                            onKeyDown={handleKeyDown}
                            disabled={intRemitoPadreSelect.intEstadoId === 1 ? false : true}
                          />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Formulario */}
          {/* <TableComponent
            columns={[
              {
                title: "Número Remito",
                field: "id",
                render: (row) => row.plantOrigen.organizationCode + row.id.toString().padStart(10, "0")
              },
              {
                title: "Operador",
                field: "appUser.username",
                render: (row) => row.appUser.operator.name + " " + row.appUser.operator.surname
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
                title: "Área Destino",
                field: "areaDestino.nombre"
              },
              {
                title: "Referente Destino",
                field: "referenciaDestino"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            color="info"
                            onClick={() => {
                              getVerDetalle(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              suprimir(row);
                            }}
                            disabled={intRemitoPadreSelect.intEstadoId === 1? false : true}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color={intRemitoPadreSelect.intEstadoId === 1? "error" : "disabled"} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={listRemitos}
            IDcolumn="id"
          /> */}
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <div style={{ flex: 1, alignContent: "center", textAlign: "center" }}>
              <Button className={classes.redButton} onClick={cerrar} variant="contained">
                Cerrar
              </Button>
            </div>
          </div>
        </form>
        <ModalCompoment title="Ver Contenido" openPopup={modalOpenVerContenido} setOpenPopup={setModalOpenVerContenido}>
          <IntVerContenido setOpenPopup={setModalOpenVerContenido} intRemitoSelect={intRemitoSelect} />
        </ModalCompoment>
      </div>
    </>
  );
};
