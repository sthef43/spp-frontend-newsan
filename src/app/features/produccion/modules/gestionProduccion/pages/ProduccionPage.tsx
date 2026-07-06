import React, { useEffect, useState } from "react";
import "animate.css";
import { Info } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ProduccionDialog } from "app/features/produccion/modules/gestionProduccion/modals/ProduccionDialog";
import { ProduccionCierreLote } from "app/features/produccion/modules/gestionProduccion/modals/ProduccionCierreLote";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Edit, CheckCircle } from "@mui/icons-material";
import _ from "lodash";
import { IControlLote, ILinea, IPlanProd } from "app/models";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { Controller, useForm } from "react-hook-form";
import { ProduccionEditDialog } from "app/features/admin/AdministrarPlanDeProduccion/Modals/ProduccionEditDialog";
import { ProduccionNuevoLote } from "app/features/admin/AdministrarPlanDeProduccion/Modals/ProduccionNuevoLote";

export const ProduccionPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [DataOpen, setData] = useState(null);
  const lineas: ILinea[] = useAppSelector((state) => state.linea.dataAll);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalEditOpen, setModalEditOpen] = React.useState(false);
  const [modalCierreLoteOpen, setModalCierreLoteOpen] = React.useState(false);
  const [modalCierreCondicionalOpen, setModalCierreCondicionalOpen] = React.useState(false);
  const [modalNuevoLoteOpen, setModalNuevoLoteOpen] = React.useState(false);
  const [selectedPlanProd, setSelectedPlanProd] = React.useState(0);
  const [declarado, setDeclarado] = useState(null);
  const getDeclarado = (row) => {
    setDeclarado(parseInt(row));
  };

  const initialState = {
    lineaId: 0
  };
  const { control, watch } = useForm({
    defaultValues: initialState
  });
  const lineaWatch = watch("lineaId");

  const OnInit = async () => {
    let fetchResult;
    dispatch(LoadingUISlice.actions.LoadingUIOpen());
    try {
      fetchResult = unwrapResult(await dispatch(PlanProdSliceRequests.getAllByLineaIdSinFiltroRequest(lineaWatch)));
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      const result = setEstadoLote(fetchResult);
      const resultado = result.map((x) => ({
        ...x,
        noConformes: calcularNoConformes(x.rechazados)
      }));
      setData(resultado);
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const [planSeleccionado, setPlanSeleccionada] = useState<IPlanProd>();
  const setRow = (id: IPlanProd) => {
    setSelectedPlanProd(id.idProduccion);
    setPlanSeleccionada(id);
    setModalOpen(true);
  };

  useEffect(() => {
    dispatch(LineaSliceRequests.getAllRequest());
  }, []);

  useEffect(() => {
    lineaWatch && OnInit();
  }, [lineaWatch]);

  //REFRESCO LA LISTA CUANDO CIERRO UN LOTE PARA TENER LA INFO ACTUALIZADA
  const refreshPage = React.useCallback(async () => {
    setEstadoSelect(0);
    const fetchResult = unwrapResult(await dispatch(PlanProdSliceRequests.getAllByLoteCerradoRequest(false)));
    if (fetchResult) {
      setData(setEstadoLote(fetchResult));
    }
  }, []);

  /* const setEstadoLote = (data) => {
    const varData = [];
    data.map((x) => {
      const numero = Number(x.cantidadProducida);
       const aux = _.cloneDeep(x);

       if (numero > 0) {
         //Completo sin no conforme VIEJO
         // if (x.cantidad === numero && x.loteCerrado === null) {
         //   aux.estado = "4";
         // }
         //Completo sin no conforme NUEVO
         const tieneEstadoReprocesoN = x.rechazados.some((rechazo) => rechazo.estadoReproceso === "N");
         if (x.cantidad === numero && x.loteCerrado === null && !tieneEstadoReprocesoN) {
           aux.estado = "4";
         } else {
           aux.estado = "5";
         }
         //Lote Iniciado
         if (x.cantidad > numero && x.loteCerrado === null) {
           aux.estado = "3";
         }
         //Completo con no conforme
         if (x.cantidad === numero && x.cantidadRechazos !== 0 && x.loteCerrado !== "P") {
           aux.estado = "5";
         }
         //Cerrado
         if (x.loteCerrado === "S") {
           aux.estado = "2";
         }
         //Pedido de cierre
         if (x.loteCerrado === "P") {
           aux.estado = "6";
         }
         //Pedido de material
         if (x.loteCerrado === "M") {
           aux.estado = "7";
         }
       } else {
         //Sin iniciar
         aux.estado = "1";
       }
       aux.estadoString = verEstado(aux.estado);
       aux.pendiente = Number(x.cantidad) - Number(x.cantidadProducida);
       varData.push(aux);
     });
     return varData;
   }; */

  //__NUEVO: setEstadoLote___//
  const netNoConformes = (items: IControlLote[] = []) => {
    let r = 0,
      rep = 0;
    items.forEach((e) => {
      r += Number(e.cantidadRechazos || 0);
      rep += Number(e.cantidadReprocesos || 0);
    });
    return r - rep;
  };

  const setEstadoLote = (data) => {
    const varData = [];

    data.forEach((x) => {
      const aux = _.cloneDeep(x);

      const producidos = Number(x.cantidadProducida || 0);
      const cantidad = Number(x.cantidad || 0);
      const pendiente = cantidad - producidos;

      const nc = netNoConformes(x.rechazados || []);

      const esCerrado = x.loteCerrado === "S";
      const esPedidoCierre = x.loteCerrado === "P";
      const esPedidoMaterial = x.loteCerrado === "M";

      // Cerrado final SIEMPRE
      if (esCerrado) {
        aux.estado = nc > 0 ? "8" : "2";
      }
      // Sin iniciar
      else if (producidos <= 0) {
        aux.estado = "1";
      }
      // Si está completo (cantidad == producidos)
      else if (pendiente === 0) {
        aux.estado = nc > 0 ? "5" : "4"; // completo con/sin NC
        // Nota: aunque loteCerrado sea "M" o "P", visualmente sigue mostrando COMPLETO
      }
      // Si hay pendiente (lote iniciado)
      else {
        // Si hay pedidos, muestran prioridad sobre "lote iniciado"
        if (esPedidoMaterial) aux.estado = "7";
        else if (esPedidoCierre) aux.estado = "6";
        else aux.estado = "3";
      }

      aux.estadoString = verEstado(aux.estado);
      aux.pendiente = pendiente;
      aux.noConformes = String(nc);

      varData.push(aux);
    });

    return varData;
  };

  const [estadoSelect, setEstadoSelect] = useState(0);
  const comprobarEstado = ({ estado, idProduccion, cantidadProducida }) => {
    switch (estado) {
      case "4": //completo sin no conformes
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedPlanProd(idProduccion);
                setModalCierreLoteOpen(true);
                getDeclarado(cantidadProducida);
                setEstadoSelect(estado);
              }}
              size="small"
              style={{ position: "relative" }}>
              <CheckCircle />
            </IconButton>
          </div>
        );
      case "1":
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedPlanProd(idProduccion);
                setModalCierreLoteOpen(true);
                getDeclarado(cantidadProducida);
                setEstadoSelect(estado);
              }}
              size="small"
              style={{ position: "relative" }}>
              <Edit />
            </IconButton>
          </div>
        );
      case "3": //lotes iniciados
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedPlanProd(idProduccion);
                setModalCierreCondicionalOpen(true);
                getDeclarado(cantidadProducida);
                setEstadoSelect(estado);
              }}
              size="small"
              style={{ position: "relative" }}>
              <CheckCircle />
            </IconButton>
          </div>
        );
    }
  };

  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "Sin iniciar";
      case "2":
        return "Cerrado";
      case "3":
        return "Lote iniciado";
      case "4":
        return "Completo sin no conformes";
      case "5":
        return "Completo con no conformes";
      case "6":
        return "Pedido de cierre";
      case "7":
        return "Pedido de material";
      case "8":
        return "Cerrado con no conforme";
    }
  };

  const calcularNoConformes = (items: IControlLote[]) => {
    let totalRechazos = 0;
    let totalReprocesados = 0;
    items.forEach((elementos) => {
      totalRechazos += elementos.cantidadRechazos;
      totalReprocesados += elementos.cantidadReprocesos;
    });
    return `${totalRechazos - totalReprocesados}`;
  };

  React.useEffect(() => {
    TitleChanger("GESTIÓN DE PRODUCCIÓN");
  }, []);

  return (
    <div className="my-2 mx-4">
      <div className="w-full gap-4">
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* ----------------LINEA---------------*/}
          <FormControl fullWidth variant="outlined">
            <InputLabel variant="filled">Seleccione una linea</InputLabel>
            <Controller
              name="lineaId"
              control={control}
              rules={{ required: "Seleccione una línea." }}
              render={({ field }) => (
                <Select className="pt-2" {...field}>
                  {lineas &&
                    lineas.map((linea) => (
                      <MenuItem key={linea.idLinea} value={linea.idLinea}>
                        <div className="w-full">
                          <div>{linea.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
        </div>
        {DataOpen && (
          <div className="animate__animated animate__fadeIn">
            <TableComponent
              IDcolumn={"idProduccion"}
              columns={[
                {
                  title: "Id",
                  field: "idProduccion"
                },
                {
                  title: "Modelo",
                  field: "codigoModelo"
                },
                {
                  title: "Lote",
                  field: "lote"
                },
                {
                  title: "Numero-OP",
                  field: "numeroOp"
                },

                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "Producidos",
                  field: "cantidadProducida"
                },
                {
                  title: "Pendiente",
                  field: "pendiente"
                },
                {
                  title: "No conformes",
                  field: "noConformes"
                },
                {
                  title: "Estado",
                  field: "estado",
                  render: (row) => {
                    return verEstado(row.estado);
                  },
                  lookup: {
                    "1": "Sin Iniciar",
                    "2": "Cerrado",
                    "3": "Lote Iniciado",
                    "5": "Completo con no conformes",
                    "4": "Completo sin no conformes",
                    "6": "Pedido de cierre",
                    "7": "Pedido de material",
                    "8": "Cerrado con no conforme"
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
                              setRow(row);
                              getDeclarado(row?.cantidadProducida);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Info />
                          </IconButton>
                        </div>
                        {comprobarEstado(row)}
                      </div>
                    );
                  }
                },
                {
                  title: "",
                  field: "estadoString",
                  render: (row) => {
                    return verEstado(row.estadoString);
                  }
                }
              ]}
              dataInfo={DataOpen}
              // Collapse={true}
              buscar={true}
              // Dense={true}
              // Overflow={true}
              filterWithSpecificValues={"Estado"}
              // setFiltroSeleccionadoProp={setear}
              excel
              fileNameExcel={"Gestion de produccion."}
              rowStyle={(rowData) => {
                switch (rowData.estado) {
                  case "2":
                    return { padding: 1, backgroundColor: "rgba(97, 216, 100, .8)", fontSize: 14 };
                  case "3":
                    return { padding: 1, backgroundColor: "rgba(89, 183, 247, .8)", fontSize: 14 };
                  case "4":
                    return { padding: 1, backgroundColor: "#D8AA51", fontSize: 14 };
                  case "5":
                    return { padding: 1, backgroundColor: "#FF625B", fontSize: 14 };
                  case "6":
                    return { padding: 1, backgroundColor: "rgba(251, 254, 94, .8)", fontSize: 14 };
                  case "7":
                    return { padding: 1, backgroundColor: "rgba(122, 101, 242, .8)", fontSize: 14 };
                  case "8":
                    return { padding: 1, backgroundColor: "rgba(82, 165, 85, 0.8)", fontSize: 14 };
                  default:
                    return { padding: 1, fontSize: 14 };
                }
              }}
            />
          </div>
        )}
      </div>

      {/*  */}
      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ProduccionDialog loteSelect={planSeleccionado} id={selectedPlanProd} />
      </ModalCompoment>

      <ModalCompoment title="Edición de lote" openPopup={modalEditOpen} setOpenPopup={setModalEditOpen}>
        <ProduccionEditDialog id={selectedPlanProd} setModalEditOpen={setModalEditOpen} callback={refreshPage} />
      </ModalCompoment>

      {/*  */}
      <ModalCompoment title="Cierre de lote" openPopup={modalCierreLoteOpen} setOpenPopup={setModalCierreLoteOpen}>
        <ProduccionCierreLote
          id={selectedPlanProd}
          callback={refreshPage}
          setOpenPopup={setModalCierreLoteOpen}
          declarado={declarado}
          // cierreCondicional={true}
          estado={estadoSelect}
        />
      </ModalCompoment>

      {/*  */}
      <ModalCompoment
        title="Cierre condicional de lote"
        openPopup={modalCierreCondicionalOpen}
        setOpenPopup={setModalCierreCondicionalOpen}>
        <ProduccionCierreLote
          id={selectedPlanProd}
          callback={refreshPage}
          setOpenPopup={setModalCierreCondicionalOpen}
          cierreCondicional={true}
          declarado={declarado}
          estado={estadoSelect}
        />
      </ModalCompoment>
      <ModalCompoment title="Nuevo Lote" openPopup={modalNuevoLoteOpen} setOpenPopup={setModalNuevoLoteOpen}>
        <ProduccionNuevoLote setOpenPopup={setModalNuevoLoteOpen} callback={refreshPage} />
      </ModalCompoment>
    </div>
  );
};
