import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, TextField, IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { MQfunc } from "../../../shared/components/material-ui/breakpoints";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { ModalCompoment } from "../../../shared/components/ModalComponent";
import { CrudTipoUnidad } from "./CrudTipoUnidad";
import { Edit } from "@mui/icons-material";
import { IModelos } from "app/models";
import { ModelosForm } from "./ModelosForm";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";

export const ModeloCRUDAndList = (props: any) => {
  const requiredField = "Este campo es requerido";
  const schema = yup
    .object()
    .shape({
      codigoModelo: yup.string().required(requiredField),
      descripcion: yup.string().required(requiredField),
      tipoUnidad: yup.string().required(requiredField),
      temporada: yup.string().min(4).max(4).required(requiredField),
      capacidadTipo: yup.string().required(requiredField)
    })
    .required();
  const defaultValues = {
    codigoModelo: "",
    descripcion: "",
    tipoUnidad: "",
    codigoSgs: null,
    modeloTps: 0,
    temporada: moment().get("year"),
    capacidadTipo: ""
  };
  const defaultLabels = {
    codigoModelo: "CodigoModelo",
    descripcion: "Descripcion",
    tipoUnidad: "Tipo de unidad",
    temporada: "Temporada",
    capacidadTipo: "Familia"
  };

  const dispatch = useAppDispatch();

  const [listTipoUnidad, setListTipoUnidad] = useState([]);
  const [familias, setFamilias] = useState([]);

  const getListTipoUnidad = async () => {
    const result = unwrapResult(await dispatch(TipoUnidadSliceRequests.getAllRequest()));
    if (result) {
      const newArray = result.map((x) => {
        const obj = { ...x, id: x.nombre };
        return obj;
      });
      setListTipoUnidad(newArray);
    }
  };

  const getFamilias = async () => {
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
    setFamilias(result);
  };

  useEffect(() => {
    getListTipoUnidad();
    getFamilias();
  }, []);

  const selectFields = {
    Target: {
      array: [
        { id: 1, nombre: "560" },
        { id: 2, nombre: "250" },
        { id: 3, nombre: "400" },
        { id: 4, nombre: "1650" }
      ],
      id: "id",
      column: "nombre"
    },
    "Tipo de unidad": {
      array: listTipoUnidad,
      id: "id",
      column: "descripcion"
    },
    Familia: {
      array: familias,
      id: "nombre",
      column: "nombre"
    }
  };

  const { setOpenPopup, modelo, getModelos } = props;
  const materialButtons = MaterialButtons();
  const { control, trigger, setValue, reset, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all"
  });
  const { openNotificationUI } = useNotificationUI();
  React.useEffect(() => {
    if (modelo) {
      reset(modelo);
    }
  }, [modelo]);

  const guardar = async () => {
    let info;
    try {
      if (modelo) {
        info = unwrapResult(await dispatch(ModelosSliceRequests.UpdateModelo(getValues())));
      } else {
        info = unwrapResult(await dispatch(ModelosSliceRequests.CreateModelo(getValues())));
      }
    } catch {
      info = null;
    }
    if (info) {
      openNotificationUI("Operacion realizada con exito", "success");
      setOpenPopup(false);
      getModelos();
    }
  };

  const getAllYears = () => {
    const infoIni = 2015;
    const infoFinish = moment().get("year");
    const years = [];
    for (let index = infoIni; index <= infoFinish; index++) {
      years.push(index);
    }
    return years;
  };

  const ini = {
    year: moment().get("year"),
    AllYears: getAllYears()
  };

  const [initialInfo, setinitialInfo] = useState(ini);

  const getListModelos = async () => {
    let info;
    try {
      info = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTemporada(initialInfo.year)));
    } catch (error) {
      info = null;
    }
    if (info) setmodelos(info);
  };

  useEffect(() => {
    getListModelos();
  }, [initialInfo.year]);

  const [modelos, setmodelos] = useState([]);

  const [openModalTipoUnidad, setOpenModalTipoUnidad] = useState(false);
  const [modeloSelected, setModeloSelected] = useState<IModelos>();
  const [openModalModelos, setOpenModalModelos] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
        <GenericFieldsGenerator
          values={defaultValues}
          control={control}
          labels={defaultLabels}
          selectFields={selectFields}
          styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
          variant="outlined"
        />
      </div>
      <div className="flex md:col-span-3 justify-around mt-4 w-full">
        <div>
          <Button
            className={materialButtons.greenButton}
            onClick={(e) => {
              setOpenModalTipoUnidad(true);
            }}>
            Crear Tipo Unidad
          </Button>
        </div>
        <Button
          variant="contained"
          className={materialButtons.greenButton}
          onClick={() => {
            guardar();
          }}
          disabled={!formState.isValid || !formState.isDirty}>
          Guardar
        </Button>
        <Button variant="contained" className={materialButtons.redButton} onClick={() => setOpenPopup(false)}>
          Cancelar
        </Button>
      </div>

      <div className="text-center mt-4" style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <TextField
            value={initialInfo.year}
            label={"Año"}
            placeholder="Año"
            onChange={(x) => {
              const info = x.target.value;
              if (info) {
                setinitialInfo({ ...initialInfo, year: Number(info) });
              }
            }}
            select>
            {ini.AllYears.map((x) => (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <ModalCompoment
        title="Creacion de Tipo de Unidad"
        setOpenPopup={setOpenModalTipoUnidad}
        openPopup={openModalTipoUnidad}>
        <CrudTipoUnidad refresh={getListTipoUnidad} setOpen={setOpenModalTipoUnidad}></CrudTipoUnidad>
      </ModalCompoment>
      <div>
        {modelos && (
          <TableComponent
            IDcolumn={"idModelo"}
            columns={[
              {
                title: "Codigo modelo",
                field: "codigoModelo"
              },
              {
                title: "Descripcion",
                field: "descripcion"
              },
              {
                title: "Tipo de unidad",
                field: "tipoUnidad"
              },
              {
                title: "Capacidad tipo",
                field: "capacidadTipo"
              },
              {
                title: "Temporada",
                field: "temporada"
              },
              {
                title: "Acciones",
                field: "",
                render: (row: any) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            setModeloSelected(row);
                            setOpenModalModelos(true);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={modelos}
            buscar={true}
            filterWithSpecificValues={"Estado"}
          />
        )}
      </div>
      <ModalCompoment title="Editar modelo" openPopup={openModalModelos} setOpenPopup={setOpenModalModelos}>
        <ModelosForm setOpenPopup={setOpenModalModelos} refresh={getListModelos} modeloSelected={modeloSelected} />
      </ModalCompoment>
    </div>
  );
};
