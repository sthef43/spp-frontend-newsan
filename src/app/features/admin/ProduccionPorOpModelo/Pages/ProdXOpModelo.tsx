/* eslint-disable unused-imports/no-unused-vars */
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  Switch,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ProdXOPModeloForm } from "../Modals/ProdXOpModeloForm";

interface initialState {
  codigo: string;
}
const initialStateVar = {
  codigo: ""
};

export const ProdXOpModelo = (): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  //Estados de modales
  const [ModalOpen, setModalOpen] = useState(false);
  const [checkedDestino, setCheckedDestino] = useState(true);

  //Estado para saber si es por OP o Modelo
  const [checkedDestinoNombre, setCheckedDestinoNombre] = useState("OP");

  //Estado para saber si es edicion o creacion
  //Estado de lista de inicio
  const [editState, setEditState] = useState<IInicio>(null);
  const [listInicio, setListInicio] = useState<IInicio>(null);

  //Buscar
  const getInicio = async () => {
    const valor = getValues("codigo");
    if (valor == "OP-" || valor == "91") {
      openNotificationUI("Ingresae OP o modelo.", "error");
    } else {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        if (checkedDestino) {
          // console.log("Buscar por OP");
          const result = unwrapResult(await dispatch(InicioSliceRequests.GetListByNRO_OPRequest(valor)));
          setListInicio(result);
        } else {
          // console.log("Buscar por Modelo");
          const result = unwrapResult(
            await dispatch(InicioSliceRequests.GetListByModeloFinRequest(valor.slice(2, valor.length)))
          );
          setListInicio(result);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        console.log(error);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  //Eliminar
  const eliminar = async (e) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(InicioSliceRequests.DeleteByIdRequest(e.idInicio)));
        openNotificationUI("Se eliminó el registro correctamente", "success");
        getInicio();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //SWITCH
  const handleChangeDestino = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedDestino(event.target.checked);
    if (event.target.checked) {
      setCheckedDestinoNombre("OP");
      setValue("codigo", "OP-");
    } else {
      setCheckedDestinoNombre("Modelo");
      setValue("codigo", "91");
    }
  };

  //Editar
  const editar = (e) => {
    setEditState(e);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("Producción por OP o Modelo");
    setValue("codigo", "OP-");
  }, []);

  return (
    <div className="w-full h-full relative p-4">
      <ContainerForPages optionsLayout="Selects">
        <form onSubmit={handleSubmit(getInicio)} className="w-full h-full">
          <div>
            <div className="flex flex-row items-center justify-between gap-x-6">
              <div className="flex flex-row item-center gap-x-4 w-full">
                <div className="w-[50%]">
                  <Controller
                    name="codigo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="standard" error={!!error}>
                        <InputLabel>Buscar por OP o Modelo</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkedDestino}
                        onChange={handleChangeDestino}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={checkedDestinoNombre}
                  />
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <Button
                    className={classes.greenButton}
                    type="submit"
                    variant="contained"
                    disabled={!isDirty && !isValid}>
                    Buscar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"idInicio"}
          excel
          columns={[
            {
              title: "Fecha",
              field: "fecha",
              render: (row) => {
                return moment(row.fecha).format("L");
              }
            },
            {
              title: "Turno",
              field: "turno"
            },
            {
              title: "Código de Trazabilidad",
              field: "codigoTrazabilidad"
            },
            {
              title: "Código Newsan",
              field: "codigoNewsan"
            },
            {
              title: "Fecha Fin",
              field: "fechaFin",
              render: (row) => {
                return moment(row.fechaFin).format("L");
              }
            },
            {
              title: "Nombre Inicio",
              field: "nombreInicio"
            },
            {
              title: "Nombre Fin",
              field: "nombreFin"
            },
            {
              title: "Turno Fin",
              field: "turnoFin"
            },
            {
              title: "Hora",
              field: "hora"
            },
            {
              title: "Hora Fin",
              field: "horaFin"
            },
            {
              title: "Código Newsan 2",
              field: "codigoNewsan2"
            },
            {
              title: "Modelo Fin",
              field: "modeloFin"
            },
            {
              title: "OP",
              field: "nroOp"
            },
            {
              title: "Organización",
              field: "organizacion"
            },
            {
              title: "Lote",
              field: "lote"
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
                        <span>
                          <IconButton
                            onClick={() => {
                              eliminar(row);
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
          dataInfo={listInicio}
        />
      </ContainerForPages>
      <ModalCompoment title="Editar Producción por OP o Modelo" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <ProdXOPModeloForm setOpenPopup={setModalOpen} editState={editState} refresh={getInicio} />
      </ModalCompoment>
    </div>
  );
};
