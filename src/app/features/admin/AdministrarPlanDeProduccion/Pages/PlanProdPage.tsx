import { ChangeCircle, Check, Clear, Delete, Edit, NextPlan } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  useTheme
} from "@mui/material";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlanProd, IPlant } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ProduccionEditDialog } from "../Modals/ProduccionEditDialog";
import { ProduccionNuevoLote } from "../Modals/ProduccionNuevoLote";
import { ProduccionNuevoLoteSemielaborado } from "../Modals/ProduccionNuevoLoteSemielaborado";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SemiElaboradosIAForm } from "../Modals/semielaboradosIAForm";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface initialState {
  lineaId: number;
  plantId: number;
}

const initialValues = {
  lineaId: 0,
  plantId: 0
};

export const PlanProdPage = () => {
  const { control, getValues, watch } = useForm<initialState>({
    defaultValues: initialValues
  });

  const classes = MaterialButtons();
  const theme = useTheme().palette.mode;

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalSemielaborado, setOpenModalSemielaborado] = useState(false);
  const [openModalEdit, setOpenModalEdit] = React.useState(false);
  const [loteCerrado, setLoteCerrado] = useState(false);
  const [openModalEditSemielaboradoIA, setOpenModalEditSemielaboradoIA] = useState(false);
  const [openSemiIAForm, setopenSemiIAForm] = useState(false);

  const [lineas, setLineas] = useState<ILinea[]>([]);
  const [familiaRow, setFamiliaRow] = useState<IFamilia>();
  const [dataTable, setDataTable] = React.useState<IPlanProd[]>();
  const [dataTableAux, setDataTableAux] = React.useState<IPlanProd[]>();
  const [plantas, setPlantas] = useState<IPlant[]>([]);

  const [row, setRow] = React.useState(null);

  const watchLinea = watch("lineaId");
  const watchPlanta = watch("plantId");

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
  };

  const getAllPlanProd = async () => {
    const lineaId = getValues("lineaId");
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      let response = [];
      response = unwrapResult(await dispatch(PlanProdSliceRequests.getAllByLoteCerradoRequest(loteCerrado)));
      if (lineaId != 9999) response = response.filter((x) => x.idLinea == lineaId);
      setDataTableAux(response); //Aca guardo la lista original, para usarla posteriormente cuando necesite obtener un objeto de esa lista.
      //Aca cambio la fecha en un formato mas legible, para que cuando exporto a excel, salga bien escrita la fecha.
      response = response.map((x) => {
        const planProd = { ...x, fecha: moment(x.fecha).format("DD/MM/YYYY") };
        return planProd;
      });
      // console.log(response);
      const newArrayPlanProd = [];
      //Me traigo los semielaboradoIA para los planprod donde el campo TipoSemielaborado != "MON".
      for (let index = 0; index < response.length; index++) {
        const plan = response[index];
        if (plan.tipoSemiElaborado != "MON") {
          //Filtra por familia
          // const nombreSemi = await getSemielaboradoIAByFamilia(plan.capacidad);
          // newArrayPlanProd.push({ ...plan, semielaboradoIA: nombreSemi != null ? nombreSemi.valor : "" });

          //Filtra por familia y tipo
          //console.log(plan);
          const nombreSemi = plan.semielaborado
            ? await getSemiIAByFamAndTSemi(plan.capacidad, plan.semielaborado.semielaboradoTipo.id)
            : null;
          newArrayPlanProd.push({ ...plan, semielaboradoIA: nombreSemi != null ? nombreSemi.valor : "" });
        } else {
          newArrayPlanProd.push({ ...plan, semielaboradoIA: "" });
        }
      }
      setDataTable(newArrayPlanProd);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      console.error(e);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  // const getSemielaboradoIAByFamilia = async (familia: string) => {
  //   const result = unwrapResult(await dispatch(SemielaboradoIASliceRequest.getByFamiliaRequest(familia)));
  //   if (result) return result;
  //   else return null;
  // };
  const getSemiIAByFamAndTSemi = async (familia: string, tipo: number) => {
    const modelo = { familia, tipo };
    const result = unwrapResult(await dispatch(SemielaboradoIASliceRequest.getByFamAndTSemiRequest(modelo)));
    if (result) return result;
    else return null;
  };

  const onDelete = async (id: number) => {
    try {
      const resp = await getConfirmation("Borrar plan", "Está seguro que desea borrarlo?");
      if (resp) {
        await dispatch(PlanProdSliceRequests.deleteRequest(id));
        openNotificationUI("Se elimino correctamente", "success");
        getAllPlanProd();
      }
    } catch (e) {
      console.error(e);
      openNotificationUI(e, "error");
    }
  };

  const isLoteSig = (row: IPlanProd) => {
    if (row.linea == null) return false;
    return row.linea.loteSiguiente == row.estado ? true : false;
  };

  const onSigLote = async (row: IPlanProd) => {
    try {
      if (await getConfirmation("Asginar a lote siguiente", "Esta seguro que quiere asignar como lote siguiente?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const oldLote = dataTableAux.find(
          (plan) => plan.estado == row.linea.loteSiguiente && plan.idLinea == row.idLinea
        ); //busco en esta lista por que la fecha de los objetos no esta cambiada a string.
        if (oldLote) {
          const updateOld = { ...oldLote, estado: "F", linea: null };
          await dispatch(PlanProdSliceRequests.putRequest(updateOld));
          const rowAux = dataTableAux.find((x) => x.idProduccion == row.idProduccion); //Aca, agarro el objeto de esta lista por que es la original que viene del back, que no se cambio la fecha.
          const updateNewLote = {
            ...rowAux,
            estado: rowAux.linea.loteSiguiente,
            linea: null,
            fecha: rowAux.fecha
          };
          await dispatch(PlanProdSliceRequests.putRequest(updateNewLote));
          openNotificationUI("Se cambio el lote siguiente con éxito", "success");
          getAllPlanProd();
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        } else {
          openNotificationUI("No se encontro lote siguiente actual", "error");
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const getLineas = async () => {
    let response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    if (response) {
      response = response.filter((x) => x.plantId == watch("plantId")); //Filtro las lineas por la planta.
      setLineas(response);
    }
  };

  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  const changeState = async (row) => {
    try {
      const resp = await getConfirmation("Cambiar estado", "¿ Está seguro que desea cambiar el estado ?");
      if (resp) {
        const obj = dataTableAux.find((x) => x.idProduccion == row.idProduccion);
        const objectPlanProd = { ...obj, loteCerrado: null };
        await dispatch(PlanProdSliceRequests.putRequest(objectPlanProd));
        openNotificationUI("Datos actualizados exitosamente :)", "success");
        getAllPlanProd();
      }
    } catch (e) {
      console.error(e);
      openNotificationUI(e, "error");
    }
  };

  //Traigo la familiaId que tiene el planprod, para poder editar el semielaboradoIA.
  const getFamilia = async (familiaBuscar: string) => {
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
    if (!result) return false;
    const fam = result.find((x) => x.nombre == familiaBuscar);
    if (!fam) return false;
    setFamiliaRow(fam);
    setOpenModalEditSemielaboradoIA(true);
  };

  useEffect(() => {
    if (watchLinea != 0) getAllPlanProd();
  }, [watchLinea]);

  useEffect(() => {
    setDataTable([]);
  }, [watchPlanta]);

  useEffect(() => {
    if (watch("plantId") != 0) getAllPlanProd();
  }, [loteCerrado]);

  useEffect(() => {
    TitleChanger("Administrar plan de producción");
    getPlantas();
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages
        optionsLayout="personalized"
        classNamePersonalized="flex flex-col w-full items-start bg-secondaryNew p-4 rounded-md shadow-md">
        <div className="flex flex-row items-start w-full gap-x-4">
          <div className="w-full">
            {plantas && (
              <Controller
                name="plantId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
                    <InputLabel variant="standard">Planta</InputLabel>
                    <Select
                      {...field}
                      variant="standard"
                      className="pt-2"
                      onClick={() => {
                        getLineas();
                      }}>
                      {plantas &&
                        plantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
          </div>
          <div className="w-full">
            {lineas && (
              <Controller
                name="lineaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
                    <InputLabel variant="standard">Linea</InputLabel>
                    <Select {...field} variant="standard" className="pt-2">
                      {lineas &&
                        lineas.map((x) => (
                          <MenuItem key={x.idLinea} value={x.idLinea}>
                            <div className="w-full">
                              <div>{x.descripcion}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            <InputLabel>Lote Cerrado</InputLabel>
            <Switch
              checked={loteCerrado}
              onChange={() => {
                setLoteCerrado(!loteCerrado);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
        </div>
        <div className="w-full flex flex-row item-start gap-x-4 mt-4 justify-center">
          <div>
            <Button className={classes.greenButton} variant="contained" onClick={excelExport}>
              Exportar a excel
            </Button>
            <ExcelExport data={dataTable} ref={_exporter} fileName={`Plan de Produccion`}>
              <ExcelExportColumn field="lote" title="Lote" />
              <ExcelExportColumn field="cantidad" title="Cantidad" />
              <ExcelExportColumn field="fecha" title="Fecha" />
              <ExcelExportColumn field="desde" title="Desde" />
              <ExcelExportColumn field="hasta" title="Hasta" />
              <ExcelExportColumn field="tipoUnidad" title="Unidad" />
              <ExcelExportColumn field="ultimoNewsan" title="Prefijo" />
              <ExcelExportColumn field="codigoModelo" title="Código de modelo" />
              <ExcelExportColumn field="capacidad" title="Capacidad" />
              <ExcelExportColumn field="organizacion" title="Organización" />
              <ExcelExportColumn field="numeroOp" title="Numero de OP" />
              <ExcelExportColumn field="linea.descripcion" title="Linea" />
            </ExcelExport>
          </div>
          <div className="text-end animate__animated animate__fadeIn">
            <Button variant="contained" onClick={() => setOpenModal(true)} className={classes.blueButton}>
              Crear lote montaje
            </Button>
          </div>
          <ModalCompoment title="Crear un nuevo lote" setOpenPopup={setOpenModal} openPopup={openModal}>
            <ProduccionNuevoLote setOpenPopup={setOpenModal} callback={getAllPlanProd} />
          </ModalCompoment>
          <div className="text-end animate__animated animate__fadeIn">
            <Button variant="contained" onClick={() => setOpenModalSemielaborado(true)} className={classes.blueButton}>
              Crear lote Semielaborado
            </Button>
          </div>
          <div className="text-end animate__animated animate__fadeIn">
            <Button variant="contained" onClick={() => setopenSemiIAForm(true)} className={classes.purpleButton}>
              Crear SemielaboradoIA
            </Button>
          </div>
        </div>
        {openSemiIAForm == true && (
          <ModalCompoment
            title={"Agregar SemiElaborado Externo"}
            openPopup={openSemiIAForm}
            setOpenPopup={setopenSemiIAForm}>
            <SemiElaboradosIAForm setOpenModal={setopenSemiIAForm} familia={null} handleFamilia={true} />
          </ModalCompoment>
        )}
        <ModalCompoment
          title="Crear un nuevo lote semielaborado"
          setOpenPopup={setOpenModalSemielaborado}
          openPopup={openModalSemielaborado}>
          <ProduccionNuevoLoteSemielaborado setOpenPopup={setOpenModalSemielaborado} callback={getAllPlanProd} />
        </ModalCompoment>
      </ContainerForPages>
      {dataTable && (
        <ContainerForPages optionsLayout="Table">
          <TableComponent
            IDcolumn={"idProduccion"}
            Dense={true}
            // Overflow={true}
            dataInfo={dataTable}
            buscar
            columns={[
              {
                title: "Organización",
                field: "organizacion"
              },
              {
                title: "Fecha",
                field: "fecha"
              },
              {
                title: "Familia",
                field: "capacidad"
              },
              {
                title: "Modelo",
                field: "codigoModelo"
              },
              {
                title: "Prefijo",
                field: "ultimoNewsan"
              },
              {
                title: "Num - OP",
                field: "numeroOp"
              },
              {
                title: "Lote",
                field: "lote"
              },
              {
                title: "Cantidad",
                field: "cantidad"
              },
              {
                title: "Desde",
                field: "desde"
              },
              {
                title: "Hasta",
                field: "hasta"
              },
              {
                title: "Semielaborado IM",
                field: "tipoSemiElaborado"
              },
              {
                title: "Semielaborado IA",
                field: "semielaboradoIA"
              },
              {
                title: "Lote siguiente?",
                field: "",
                render: (row) => {
                  return isLoteSig(row) ? (
                    <IconButton disabled>
                      <Check color="success" />
                    </IconButton>
                  ) : (
                    <IconButton disabled>
                      <Clear color="error" />
                    </IconButton>
                  );
                }
              },
              {
                title: "Acciones",
                field: "",
                render: (row: IPlanProd) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        {loteCerrado == true ? (
                          <Tooltip title="Cambiar estado">
                            <IconButton
                              onClick={() => {
                                changeState(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <ChangeCircle color="warning" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                        <Tooltip title="Asignar siguiente lote">
                          <span>
                            <IconButton
                              onClick={() => {
                                onSigLote(row);
                              }}
                              disabled={isLoteSig(row)}
                              size="small"
                              style={{ position: "relative" }}>
                              <NextPlan color="success" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => {
                              setRow(row?.idProduccion);
                              setOpenModalEdit(true);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              onDelete(row?.idProduccion);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                        {row.tipoSemiElaborado != "MON" && (
                          <Tooltip title="Editar Semielaborado">
                            <IconButton
                              onClick={() => {
                                getFamilia(row.capacidad.trim());
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <img
                                className="h-full w-5"
                                src={`${import.meta.env.BASE_URL}icons/Logos_spp_viejos/addSemi.svg`}
                                style={{ filter: `${theme === "dark" ? "invert(1)" : "invert(0)"}` }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  );
                }
              }
            ]}
            Edit={(row) => console.log(row)}
          />
          <ModalCompoment title="Edición de lote" openPopup={openModalEdit} setOpenPopup={setOpenModalEdit}>
            <ProduccionEditDialog id={row} setModalEditOpen={setOpenModalEdit} callback={getAllPlanProd} />
          </ModalCompoment>
          <ModalCompoment
            title="Edicion de semielaboradoIA"
            openPopup={openModalEditSemielaboradoIA}
            setOpenPopup={setOpenModalEditSemielaboradoIA}>
            <SemiElaboradosIAForm setOpenModal={setopenSemiIAForm} familia={familiaRow} handleFamilia={true} />
          </ModalCompoment>
        </ContainerForPages>
      )}
    </ContainerForPages>
  );
};
