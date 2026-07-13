import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import Button from "@mui/material/Button";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { IPlant, IPlanProd } from "app/models";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const MOTIVO_MODELO = 1;
const MOTIVO_SMIELABORADO = 2;
const PLANTA_ID_ESPECIAL = 4;

interface EnrichedPlanProd extends IPlanProd {
  cantidadInicio?: number;
  cantidadEbs?: number;
  equiposProceso?: number;
  equiposError?: number;
}

interface OtPlanItem {
  ot: IXXE_WIP_OT;
  plan: EnrichedPlanProd;
}

export const AnalisisProductoTerminado = (): JSX.Element => {
  const opcionesMotivo = [
    { motivo: "Modelo", value: MOTIVO_MODELO },
    { motivo: "Semielaborado", value: MOTIVO_SMIELABORADO }
  ];
  const opcionesSemielaborado = [
    { opcion: "Caños", value: 1, filtro: "TC" },
    { opcion: "Placas", value: 2, filtro: "PLACA" }
  ];

  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataOpen, setDataOpen] = useState<any[]>([]);
  const [listOT, setListOT] = useState<IXXE_WIP_OT[]>([]);
  const [listOtPlan, setListOtPlan] = useState<OtPlanItem[]>([]);
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const [plantSelected, setPlantSelected] = useState<number | null>(null);
  const [motivoSelected, setMotivoSelected] = useState<number | null>(null);
  const [semielaboradoSelected, setSemielaboradoSelected] = useState<string[]>([]);

  const columns_modelo = [
    {
      title: "N° OP",
      field: "plan.numeroOp"
    },
    {
      title: "Modelo",
      field: "plan.codigoModelo"
    },
    {
      title: "Lote",
      field: "plan.lote"
    },
    {
      title: "Cant. Lote",
      field: "plan.cantidad"
    },
    {
      title: "Cant. Traza",
      field: "plan.cantidadInicio"
    },
    {
      title: "Cant. EBS",
      field: "plan.cantidadEbs"
    },
    {
      title: "Diferencia",
      field: "",
      render: (row: OtPlanItem) => {
        return (row.plan?.cantidadInicio as number) - (row.plan?.cantidadEbs as number);
      }
    },
    {
      title: "Resta Lote",
      field: "",
      render: (row: OtPlanItem) => {
        return (row.plan?.cantidad as number) - (row.plan?.cantidadInicio as number);
      }
    },
    {
      title: "Equipos en proceso",
      field: "plan.equiposProceso"
    },
    {
      title: "Equipos con error",
      field: "plan.equiposError"
    }
  ];
  const columns_semielaborado = [
    {
      title: "N° OP",
      field: "wiP_ENTITY_NAME"
    },
    {
      title: "Semielaborado",
      field: "segmenT1"
    },
    {
      title: "Descripción",
      field: "description"
    },
    {
      title: "Cant. Inicio",
      field: "starT_QUANTITY"
    },
    {
      title: "Cant. Completada",
      field: "quantitY_COMPLETED"
    }
  ];

  const findPlant = (): IPlant | undefined => {
    return plantas.find((x) => x.id === plantSelected);
  };

  useEffect(() => {
    TitleChanger("Analisis de Productos Terminados");
    dispatch(PlantSliceRequests.getAllRequest());
  }, [dispatch]);

  const getListByOrganizationCode = async () => {
    const org = findPlant();
    if (!org) {
      openNotificationUI("Planta no encontrada", "error");
      return;
    }
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    try {
      const result = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetListByOrganizationCode(org.organizationCode)));
      setListOT(result);
    } catch (error) {
      openNotificationUI("Error al cargar la lista de OT", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getListByOrganizationCodeAndSemielaborado = async () => {
    const org = findPlant();
    if (!org) {
      openNotificationUI("Planta no encontrada", "error");
      return;
    }
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    try {
      const result = unwrapResult(
        await dispatch(
          XXE_WIP_OTSliceRequests.GetListByOrganizationCodeAndSemielaborado({
            organizationCode: org.organizationCode,
            filters: semielaboradoSelected
          })
        )
      );
      setListOT(result);
      setDataOpen(result);
    } catch (error) {
      openNotificationUI("Error al cargar la lista de OT por semielaborado", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getPlanProdByOp = async (op: string): Promise<IPlanProd | undefined> => {
    try {
      return unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(op)));
    } catch (error) {
      openNotificationUI("Error al obtener plan de producción", "error");
      return undefined;
    }
  };

  const getPlanProdByOt = async () => {
    const newArray: OtPlanItem[] = [];
    for (const element of listOT) {
      const planAux = await getPlanProdByOp(element.wiP_ENTITY_NAME);
      if (planAux) newArray.push({ ot: element, plan: planAux });
    }
    setListOtPlan(newArray);
  };

  useEffect(() => {
    if (listOtPlan.length > 0 && motivoSelected === MOTIVO_MODELO) {
      getDatosFaltantes();
    }
  }, [listOtPlan, motivoSelected]);

  useEffect(() => {
    if (listOT.length > 0 && motivoSelected === MOTIVO_MODELO) {
      getPlanProdByOt();
    }
  }, [listOT, motivoSelected]);

  const getInicioByNroOp = async (nroOp: string): Promise<number> => {
    try {
      return unwrapResult(await dispatch(InicioSliceRequests.getAllbyNroOp(nroOp)));
    } catch (error) {
      openNotificationUI("Error al obtener inicios por número de OP", "error");
      return 0;
    }
  };

  const getIniciosByNroOp = async (): Promise<OtPlanItem[]> => {
    const newArray: OtPlanItem[] = [];
    for (const item of listOtPlan) {
      const objetoOtPlan = { ...item };
      if (objetoOtPlan.plan !== undefined) {
        const cantidadInicio = await getInicioByNroOp(objetoOtPlan.plan.numeroOp);
        const newPlan = { ...objetoOtPlan.plan, cantidadInicio };
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getCounByOp = async (op: string): Promise<number> => {
    const plant = findPlant();
    if (!plant) return 0;
    try {
      return unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.getCountByOP({ op, orgCode: plant.organizationCode })));
    } catch (error) {
      openNotificationUI("Error al obtener cantidad por OP", "error");
      return 0;
    }
  };

  const getCantidadEBSByOp = async (listadoOtPlan: OtPlanItem[]): Promise<OtPlanItem[]> => {
    const newArray: OtPlanItem[] = [];
    for (const item of listadoOtPlan) {
      const objetoOtPlan = { ...item };
      if (objetoOtPlan.plan !== undefined) {
        const cantidadEbs = await getCounByOp(objetoOtPlan.plan.numeroOp);
        const newPlan = { ...objetoOtPlan.plan, cantidadEbs };
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getCounByOpAndTransOk = async (op: string, transOk: string): Promise<number> => {
    const plant = findPlant();
    if (!plant) return 0;
    try {
      return unwrapResult(
        await dispatch(
          XXE_WIP_ITF_SERIESliceRequests.getCountByOpAndTransOk({ op, transOk, orgCode: plant.organizationCode })
        )
      );
    } catch (error) {
      openNotificationUI("Error al obtener cantidad por OP y transacción", "error");
      return 0;
    }
  };

  const getEquiposProceso = async (listOtPlanItems: OtPlanItem[]): Promise<OtPlanItem[]> => {
    const newArray: OtPlanItem[] = [];
    for (const item of listOtPlanItems) {
      const objetoOtPlan = { ...item };
      if (objetoOtPlan.plan !== undefined) {
        const equiposProceso = await getCounByOpAndTransOk(objetoOtPlan.plan.numeroOp, "=");
        const newPlan = { ...objetoOtPlan.plan, equiposProceso };
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getEquiposError = async (listOtPlanItems: OtPlanItem[]): Promise<OtPlanItem[]> => {
    const newArray: OtPlanItem[] = [];
    for (const item of listOtPlanItems) {
      const objetoOtPlan = { ...item };
      if (objetoOtPlan.plan !== undefined) {
        const equiposError = await getCounByOpAndTransOk(objetoOtPlan.plan.numeroOp, ">");
        const newPlan = { ...objetoOtPlan.plan, equiposError };
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getDatosFaltantes = async () => {
    let arrayFinal: OtPlanItem[] = [];
    arrayFinal = await getIniciosByNroOp();
    arrayFinal = await getCantidadEBSByOp(arrayFinal);
    arrayFinal = await getEquiposProceso(arrayFinal);
    arrayFinal = await getEquiposError(arrayFinal);
    setDataOpen(arrayFinal);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  useEffect(() => {
    if (plantSelected && motivoSelected === MOTIVO_MODELO) {
      getListByOrganizationCode();
    } else if (plantSelected === PLANTA_ID_ESPECIAL && motivoSelected === MOTIVO_SMIELABORADO && semielaboradoSelected.length > 0) {
      getListByOrganizationCodeAndSemielaborado();
    }
  }, [plantSelected, motivoSelected, semielaboradoSelected]);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full">
          <FormControl variant="standard">
            <InputLabel>Planta</InputLabel>
            <Select
              value={plantSelected ?? ""}
              onChange={(e) => {
                setPlantSelected(parseInt(e.target.value.toString()));
              }}
              className="w-[275px]">
              {plantas.map((plant) => (
                <MenuItem key={plant.id} value={plant.id} className="w-[275px]">
                  {plant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {plantSelected === PLANTA_ID_ESPECIAL && (
          <div className="w-full">
            <FormControl variant="standard">
              <InputLabel>Motivo de busqueda</InputLabel>
              <Select
                onChange={(e) => {
                  setMotivoSelected(parseInt(e.target.value.toString()));
                }}
                className="w-[275px]"
                value={motivoSelected ?? ""}>
                {opcionesMotivo.map((opcion) => (
                  <MenuItem key={opcion.value} value={opcion.value} className="w-[275px]">
                    {opcion.motivo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
        {motivoSelected === MOTIVO_SMIELABORADO && (
          <div className="w-full">
            <FormControl variant="standard">
              <InputLabel>Opciones</InputLabel>
              <Select
                multiple
                onChange={(e) => {
                  const { value } = e.target;
                  setSemielaboradoSelected(typeof value === "string" ? value.split(",") : value);
                }}
                className="w-[200px]"
                value={semielaboradoSelected}>
                {opcionesSemielaborado.map((opcion) => (
                  <MenuItem key={opcion.value} value={opcion.filtro} className="w-[200px]">
                    {opcion.opcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
        <div className="text-center">
          <Button
            variant="text"
            color="success"
            disabled={!plantSelected}
            onClick={() => {
              getListByOrganizationCode();
            }}>
            Refrescar listado
          </Button>
        </div>
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          excel={true}
          Dense={true}
          Overflow={false}
          buscar={true}
          IDcolumn={motivoSelected === MOTIVO_SMIELABORADO ? "wiP_ENTITY_NAME" : "ot.wiP_ENTITY_NAME"}
          columns={motivoSelected === MOTIVO_MODELO ? columns_modelo : columns_semielaborado}
          dataInfo={dataOpen}
        />
      </ContainerForPages>
    </ContainerForPages>
  );
};
