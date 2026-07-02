import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import Button from "@mui/material/Button";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { IPlant } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const AnalisisProductoTerminado = (): JSX.Element => {
  const opcionesMotivo = [
    { motivo: "Modelo", value: 1 },
    { motivo: "Semielaborado", value: 2 }
  ];
  const opcionesSemielaborado = [
    { opcion: "Caños", value: 1, filtro: "TC" },
    { opcion: "Placas", value: 2, filtro: "PLACA" }
  ];

  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [dataOpen, setDataOpen] = useState([]);
  const [listOT, setListOT] = useState([]);
  const [listOtPlan, setListOtPlan] = useState([]);
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const [plantSelected, setPlantSelected] = useState(null);
  const [motivoSelected, setMotivoSelected] = useState(null);
  const [semielaboradoSelected, setSemielaboradoSelected] = useState([]);

  //Constantes para las tablas----------------------*
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
    /*  {
            title: "Cant. WIPOT",
            field: "cantidadWIPOT"
          }, */
    {
      title: "Diferencia",
      field: "",
      render: (row) => {
        return row.plan?.cantidadInicio - row.plan?.cantidadEbs;
      }
    },
    {
      title: "Resta Lote",
      field: "",
      render: (row) => {
        return row.plan?.cantidad - row.plan?.cantidadInicio;
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
  //Constantes para las tablas----------------------*

  useEffect(() => {
    TitleChanger("Analisis de Productos Terminados");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);

  //fetch de lista de OT por modelo.
  const getListByOrganizationCode = async () => {
    const org = plantas.find((x) => x.id == plantSelected);
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result = [];
    try {
      result = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetListByOrganizationCode(org.organizationCode)));
    } catch (error) {
      console.log(error);
    }
    if (result) setListOT(result);
  };
  //fetch de lista de OT por modelo.

  //fetch de lista de OT por modelo.

  const getListByOrganizationCodeAndSemielaborado = async () => {
    const org = plantas.find((x) => x.id == plantSelected);
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result = [];
    try {
      result = unwrapResult(
        await dispatch(
          XXE_WIP_OTSliceRequests.GetListByOrganizationCodeAndSemielaborado({
            organizationCode: org.organizationCode,
            filters: semielaboradoSelected
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) {
      console.log("result semielaborado", result);
      setListOT(result);
      setDataOpen(result);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  //fetch de lista de OT por modelo.

  //Obtiene el plan prod por op
  const getPlanProdByOp = async (op) => {
    let result;
    try {
      result = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(op)));
    } catch (e) {
      console.log(e);
    }
    if (result) {
      return result;
    }
  };

  //Por cada registro de OT, ME TRAIGO SU PLAN PROD.
  const getPlanProdByOt = async () => {
    const newArray = [];
    let planAux = null;
    for (let index = 0; index < listOT.length; index++) {
      const element = listOT[index];
      planAux = await getPlanProdByOp(element.wiP_ENTITY_NAME);
      if (planAux) newArray.push({ ot: element, plan: planAux });
      planAux = null;
    }
    setListOtPlan(newArray);
  };

  //Cuando termina de cargar el listado de ot con su plan prod, traigo los datos faltantes.
  useEffect(() => {
    if (listOtPlan.length > 0 && motivoSelected == 1) {
      getDatosFaltantes();
    }
  }, [listOtPlan]);

  //Una vez que obtengo el listado de  OT, me traigo la data
  useEffect(() => {
    if (listOT.length > 0 && motivoSelected == 1) {
      getPlanProdByOt();
    }
  }, [listOT]);

  //Por cada registro de planprod, me traigo los inicio, filtrando por numeroOP.
  const getIniciosByNroOp = async () => {
    const newArray = [];
    let cantidadInicio = 0;
    let objetoOtPlan;
    for (let index = 0; index < listOtPlan.length; index++) {
      objetoOtPlan = { ...listOtPlan[index] };
      if (objetoOtPlan.plan != undefined) {
        cantidadInicio = await getInicioByNroOp(objetoOtPlan.plan.numeroOp);
        const newPlan = { ...objetoOtPlan.plan, cantidadInicio }; //Le agrego la cantidadInicio al objeto planprod.
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  //Por cada registro de planprod, me traigo los TRAZA, filtrando por numeroOP.
  const getCantidadEBSByOp = async (listadoOtPlan) => {
    const newArray = [];
    let cantidadEbs = 0;
    let objetoOtPlan;
    for (let index = 0; index < listadoOtPlan.length; index++) {
      objetoOtPlan = { ...listadoOtPlan[index] };
      if (objetoOtPlan.plan != undefined) {
        cantidadEbs = await getCounByOp(objetoOtPlan.plan.numeroOp);
        const newPlan = { ...objetoOtPlan.plan, cantidadEbs }; //Le agrego la cantidadInicio al objeto planprod.
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  //Obtiene la cantidad de registros filtrando por numeroOP, y transok: (piede ser > o =). = es para los en proceso. > es para los equipos con errores.
  const getCounByOpAndTransOk = async (op: string, transOk: string) => {
    let resultado;
    try {
      const plant = plantas.find((x) => x.id == plantSelected);
      resultado = unwrapResult(
        await dispatch(
          XXE_WIP_ITF_SERIESliceRequests.getCountByOpAndTransOk({ op, transOk, orgCode: plant.organizationCode })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (resultado) return resultado;
    else return 0;
  };
  //Obtiene la cantidad de registros filtrando por numeroOP, y transok: (piede ser > o =). = es para los en proceso. > es para los equipos con errores.
  const getCounByOp = async (op: string) => {
    let resultado;
    try {
      const plant = plantas.find((x) => x.id == plantSelected);
      resultado = unwrapResult(
        await dispatch(XXE_WIP_OTSliceRequests.getCountByOP({ op, orgCode: plant.organizationCode }))
      );
    } catch (error) {
      console.log(error);
    }
    if (resultado) return resultado;
    else return 0;
  };

  const getEquiposProceso = async (listOtPlan) => {
    const newArray = [];
    let equiposProceso = 0;
    let objetoOtPlan;
    for (let index = 0; index < listOtPlan.length; index++) {
      objetoOtPlan = { ...listOtPlan[index] };
      if (objetoOtPlan.plan != undefined) {
        equiposProceso = await getCounByOpAndTransOk(objetoOtPlan.plan.numeroOp, "=");
        const newPlan = { ...objetoOtPlan.plan, equiposProceso: equiposProceso }; //Le agrego la cantidadInicio al objeto planprod.
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getEquiposError = async (listOtPlan) => {
    const newArray = [];
    let equiposError = 0;
    let objetoOtPlan;
    for (let index = 0; index < listOtPlan.length; index++) {
      objetoOtPlan = { ...listOtPlan[index] };
      if (objetoOtPlan.plan != undefined) {
        equiposError = await getCounByOpAndTransOk(objetoOtPlan.plan.numeroOp, ">");
        const newPlan = { ...objetoOtPlan.plan, equiposError: equiposError }; //Le agrego la cantidadInicio al objeto planprod.
        objetoOtPlan.plan = { ...newPlan };
      }
      newArray.push(objetoOtPlan);
    }
    return newArray;
  };

  const getDatosFaltantes = async () => {
    let arrayFinal = []; //Tambien tiene el campo CantidadEBS.
    arrayFinal = await getIniciosByNroOp(); //a el array de plan prod le agrega la columna CantTRraza.
    arrayFinal = await getCantidadEBSByOp(arrayFinal); //A el array le agrega CantidadEBS
    arrayFinal = await getEquiposProceso(arrayFinal); //Le agrego los equipos en proceso
    arrayFinal = await getEquiposError(arrayFinal); //Agrego los equipos con error
    console.log("array final", arrayFinal);
    setDataOpen(arrayFinal);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const getInicioByNroOp = async (nroOp: string) => {
    let result;
    try {
      result = unwrapResult(await dispatch(InicioSliceRequests.getAllbyNroOp(nroOp)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      return result;
    } else return 0;
  };

  // const getCantEBSByNroOp = async (nroOp: string) => {
  //   let result;
  //   try {
  //     result = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetQuantityByOp(nroOp)));
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   if (result) {
  //     return result;
  //   } else return 0;
  // };

  useEffect(() => {
    if (plantSelected && motivoSelected == 1) {
      getListByOrganizationCode();
    } else if (plantSelected == 4 && motivoSelected == 2 && semielaboradoSelected.length > 0) {
      getListByOrganizationCodeAndSemielaborado();
    }
  }, [plantSelected, motivoSelected, semielaboradoSelected]);

  console.log("semielaborado", semielaboradoSelected);
  console.log("planta:", plantSelected);
  return (
    <div className="my-2 mx-4 h-full w-full">
      <div className="flex w-full justify-around">
        {plantas && (
          <div className="flex flex-row justify-around" style={{ width: "800px" }}>
            <FormControl variant="standard">
              <InputLabel>Planta</InputLabel>
              <Select
                onChange={(e) => {
                  setPlantSelected(parseInt(e.target.value.toString()));
                }}
                style={{ width: "275px" }}>
                {plantas &&
                  plantas.map((plant) => (
                    <MenuItem key={plant.id} value={plant.id} style={{ width: "275px" }}>
                      {plant.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {plantSelected === 4 && (
              <FormControl variant="standard">
                <InputLabel>Motivo de busqueda</InputLabel>
                <Select
                  onChange={(e) => {
                    setMotivoSelected(parseInt(e.target.value.toString()));
                  }}
                  style={{ width: "275px" }}
                  value={motivoSelected}>
                  {opcionesMotivo.map((opcion, index) => (
                    <MenuItem key={opcion.value || index} value={opcion.value} style={{ width: "275px" }}>
                      {opcion.motivo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {motivoSelected == 2 && (
              <FormControl variant="standard">
                <InputLabel>Opciones</InputLabel>
                <Select
                  multiple
                  onChange={(e) => {
                    const { value } = e.target;
                    setSemielaboradoSelected(typeof value === "string" ? value.split(",") : value);
                  }}
                  style={{ width: "200px" }}
                  value={semielaboradoSelected}>
                  {opcionesSemielaborado.map((opcion) => (
                    <MenuItem key={opcion.value} value={opcion.filtro} style={{ width: "200px" }}>
                      {opcion.opcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        )}
        <div style={{ textAlign: "center" }}>
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
      </div>
      <TableComponent
        excel={true}
        Dense={true}
        Overflow={false}
        buscar={true}
        IDcolumn={motivoSelected === 2 ? "wiP_ENTITY_NAME" : "ot.wiP_ENTITY_NAME"}
        columns={motivoSelected == 1 ? columns_modelo : columns_semielaborado}
        dataInfo={dataOpen}
      />
    </div>
  );
};
