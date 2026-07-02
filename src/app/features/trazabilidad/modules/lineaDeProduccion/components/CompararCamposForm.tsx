import { Delete } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { MapasRutasCompararSliceRequest } from "app/Middleware/reducers/MapasRutasCompararSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import { IMapasRutasComparar } from "app/models/IRutasCamposComparar";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
interface Props {
  setOpenPopup: any;
  orden: number;
  campoId: number;
}
export const CompararCamposForm = ({ setOpenPopup, orden, campoId }: Props) => {
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const comparaciones = useAppSelector<IMapasRutasComparar[]>((state: any) => state.mapasRutasComparar.dataAll);
  const campos = useAppSelector<IMapasRutasCampos[]>((state) => state.mapasRutasCampos.dataAll);
  const [puestosAnteriores, setPuestosAnteriores] = useState<IMapasRutasCampos[]>([]);
  const [sinPuestos, setSinPuestos] = useState(false);
  const classesButtons = MaterialButtons();
  const intialStateForm = {
    mapasRutasCamposId: campoId,
    comparar: "Ninguno",
    campoCompararId: 0,
    tipo: 0
  };
  const { control, watch, getValues, reset } = useForm({ defaultValues: intialStateForm });
  const handleAdd = async () => {
    try {
      const campo = getValues();
      sacarCampoAComparar(campo.campoCompararId);
      const response = await dispatch(MapasRutasCompararSliceRequest.PostRequest(campo));
      const getAll = unwrapResult(await dispatch(MapasRutasCompararSliceRequest.getAllByCampoId(campoId)));
      response && openNotificationUI("Se agrego la comparación correctamente", "success");
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getAllComparacion = async () => {
    try {
      const getAll = unwrapResult(await dispatch(MapasRutasCompararSliceRequest.getAllByCampoId(campoId)));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const sacarCampoAComparar = (id) => {
    const newCampos = puestosAnteriores?.filter((campo) => campo.id != id);
    setPuestosAnteriores(newCampos);
    reset();
  };
  // const sacarCampoACompararExistentes = () => {
  //   debugger;
  //   const newCampos = puestosAnteriores?.filter((p) => {
  //     const campo = comparaciones.find((c) => c.campoCompararId == p.id);
  //     if (!campo) {
  //       return p;
  //     }
  //   });
  //   setPuestosAnteriores(newCampos);
  // };
  const onDeleteComparar = async (id, deleteId) => {
    try {
      const confirm = await getConfirmation("Eliminar campo", "Esta seguro que quiere eliminar la comparación?");
      if (confirm) {
        const buscarCampo = comparaciones?.find((c) => c.campoCompararId == id).campoComparar;
        setPuestosAnteriores([...puestosAnteriores, buscarCampo]);
        setSinPuestos(false);
        const response = await dispatch(MapasRutasCompararSliceRequest.deleteRequest(deleteId));
        response && openNotificationUI("Se elimino la comparación correctamente", "success");
        const getAll = unwrapResult(await dispatch(MapasRutasCompararSliceRequest.getAllByCampoId(campoId)));
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    if (campos) {
      const filterCampos = campos.filter((campo) => campo.orden < orden);
      const newCampos = filterCampos?.filter((p) => {
        const campo = comparaciones.find((c) => c.campoCompararId == p.id);
        if (!campo) {
          return p;
        }
      });
      newCampos.length == 0 && setSinPuestos(true);
      setPuestosAnteriores([...newCampos]);
    }
  }, [campos, comparaciones]);
  const compararWatch = watch("comparar");
  useEffect(() => {
    getAllComparacion();
  }, []);
  useEffect(() => {
    puestosAnteriores.length == 0 && setSinPuestos(true);
    puestosAnteriores.length > 0 && setSinPuestos(false);
    console.log(puestosAnteriores);
  }, [puestosAnteriores]);
  // useEffect(() => {
  //   comparaciones && sacarCampoACompararExistentes();
  // }, [comparaciones, puestosAnteriores]);

  return (
    <div className="grid gap-3">
      {sinPuestos ? (
        <h2>No hay puestos para agregar a la comparación</h2>
      ) : (
        <Controller
          name="comparar"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione con que quiere comparar</InputLabel>
              <Select {...field} variant="standard">
                <MenuItem key={"Ninguno"} value={"Ninguno"}>
                  <div className="w-full">
                    <div>Ninguno</div>
                  </div>
                </MenuItem>
                <MenuItem key={"Campos"} value={"Campos"}>
                  <div className="w-full">
                    <div>Campo/s</div>
                  </div>
                </MenuItem>
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      {compararWatch != "Ninguno" && (
        <>
          <Controller
            name="campoCompararId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un campo</InputLabel>
                <Select {...field} variant="standard">
                  {puestosAnteriores &&
                    puestosAnteriores.map((x) => (
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
          <Controller
            name="tipo"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Que comparar?</InputLabel>
                <Select {...field} variant="standard">
                  <MenuItem key={0} value={0}>
                    <div className="w-full">
                      <div>Completo</div>
                    </div>
                  </MenuItem>
                  <MenuItem key={1} value={1}>
                    <div className="w-full">
                      <div>Familia</div>
                    </div>
                  </MenuItem>
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Button className={classesButtons.greenButton} onClick={handleAdd}>
            Agregar
          </Button>
        </>
      )}
      {comparaciones.length > 0 && (
        <TableComponent
          IDcolumn="id"
          columns={[
            {
              title: "Campo a comparar",
              field: "campoComparar.nombre"
            },
            {
              title: "Comparar",
              field: "tipo",
              render: (row) => {
                return row.tipo == 0 ? <h1>Completo</h1> : <h1>Familia</h1>;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          onDeleteComparar(row.campoCompararId, row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          dataInfo={comparaciones}
        />
      )}
    </div>
  );
};
