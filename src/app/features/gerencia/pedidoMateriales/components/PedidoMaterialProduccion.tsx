import React from "react";
import { CheckCircle, Info } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ProduccionDialog } from "app/features/produccion/modules/gestionProduccion/modals/ProduccionDialog";
import { PedidoMaterialDialog } from "app/features/gerencia/pedidoMateriales/modals/PedidoMaterialDialog";
import { IPedidoMaterialesProduccion } from "app/models/IPedidoMaterialesProduccion";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { PedidoMaterialesProduccionSliceRequests } from "app/Middleware/reducers/PedidoMaterialesProduccionSlice";
import { IconButton } from "@mui/material";
import _ from "lodash";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

export const PedidoMaterialProduccion = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = React.useState<IPedidoMaterialesProduccion[]>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPedidoMaterialesOpen, setModalPedidoMaterialesOpen] = React.useState(false);

  const [selectedPlanProd, setSelectedPlanProd] = React.useState(0);
  const [selectedPedidoMateriales, setSelectedPedidoMateriales] = React.useState<IPedidoMaterialesProduccion>(null);

  const OnInit = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let fetchResult;
    try {
      fetchResult = unwrapResult(
        await dispatch(PedidoMaterialesProduccionSliceRequests.getAllPedidoMaterialesProduccionRequest())
      );
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      console.log("🚀 ~ file: ProduccionPage.tsx ~ line 46 ~ OnInit ~ fetchResult", fetchResult);
      setData(setEstadoLote(fetchResult));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setRow = (id: number) => {
    setSelectedPlanProd(id);
    setModalOpen(true);
  };

  React.useEffect(() => {
    OnInit();
  }, []);

  //REFRESCO LA LISTA CUANDO CIERRO UN LOTE PARA TENER LA INFO ACTUALIZADA
  const refreshPage = React.useCallback(async () => {
    const fetchResult = unwrapResult(
      await dispatch(PedidoMaterialesProduccionSliceRequests.getAllPedidoMaterialesProduccionRequest())
    );
    if (fetchResult) {
      console.log(fetchResult);
      setData(setEstadoLote(fetchResult));
    }
  }, []);

  const setEstadoLote = (data: IPedidoMaterialesProduccion[]) => {
    const varData: IPedidoMaterialesProduccion[] = [];
    data.map((x) => {
      const aux = _.cloneDeep(x);
      if (x.estadoPedido === "P") {
        aux.estadoPedido = "1";
      }
      if (x.estadoPedido === "R") {
        aux.estadoPedido = "2";
      }
      if (x.estadoPedido === "A") {
        aux.estadoPedido = "3";
      }
      varData.push(aux);
    });
    console.log("🚀 ~ file: PedidoMaterialesPAge.tsx ~ line 88 ~ data.map ~ varData", varData);
    return _.orderBy(varData, "estadoPedido");
  };

  const comprobarEstado = (pedidoMateriales: IPedidoMaterialesProduccion) => {
    switch (pedidoMateriales.estadoPedido) {
      // case "1":
      //   return (
      //     <div>
      //       <IconButton
      //         onClick={() => {
      //           setSelectedPlanProd(pedidoMateriales.idPlanProd);
      //           setSelectedPedidoMateriales(pedidoMateriales);
      //           setModalCierreLoteOpen(true); //ver que tiene que hacer despues
      //         }}
      //         size="small"
      //         style={{ position: "relative" }}>
      //         <CheckCircle />
      //       </IconButton>
      //     </div>
      //   );
      case "1":
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedPlanProd(pedidoMateriales.idPlanProd);
                setSelectedPedidoMateriales(pedidoMateriales);
                setModalPedidoMaterialesOpen(true);
              }}
              size="small"
              style={{ position: "relative" }}>
              <CheckCircle />
            </IconButton>
          </div>
        );
      // case "3":
      //   if (pedidoCierre.cantidad - parseInt(pedidoCierre.cantidadProducida) > 0 && pedidoCierre.cantidadRechazos === 0) {
      //     return (
      //       <div>
      //         <IconButton
      //           onClick={() => {
      //             setSelectedPlanProd(pedidoCierre.idPlanProd);
      //             setModalCierreCondicionalOpen(true);
      //           }}
      //           size="small"
      //           style={{ position: "relative" }}>
      //           <CheckCircle />
      //         </IconButton>
      //       </div>
      //     );
      //   } else {
      //     return;
      //   }
    }
  };

  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "Pendiente";
      case "2":
        return "Rechazado";
      case "3":
        return "Aprobado";
    }
  };

  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Modelo",
            field: "idPlanProdNavigation.codigoModelo"
          },
          {
            title: "Lote",
            field: "idPlanProdNavigation.lote"
          },
          {
            title: "Numero-OP",
            field: "idPlanProdNavigation.numeroOp"
          },
          {
            title: "Cantidad",
            field: "idPlanProdNavigation.cantidad"
          },
          {
            title: "Producidos",
            field: "idPlanProdNavigation.cantidadProducida"
          },
          {
            title: "Pendiente",
            field: "",
            render: (row) => {
              return Number(row.idPlanProdNavigation.cantidad) - Number(row.idPlanProdNavigation.cantidadProducida);
            }
          },
          {
            title: "No conformes",
            field: "idPlanProdNavigation.cantidadRechazos"
          },
          {
            title: "Estado",
            field: "estadoPedido",
            render: (row) => {
              return verEstado(row.estadoPedido);
            },
            lookup: {
              "1": "Pendiente",
              "2": "Rechazado",
              "3": "Cerrado"
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
                        setRow(row?.idPlanProdNavigation.idProduccion);
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
          }
        ]}
        dataInfo={DataOpen}
        //Collapse={true}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
        // Watch={(rowData) => {
        //   setRow(rowData?.idProduccion);
        // }}
        rowStyle={(rowData) => {
          switch (rowData.estadoPedido) {
            case "1":
              return { padding: 1, backgroundColor: "#fdaf59", fontSize: 14 };
            case "2":
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            case "3":
              return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
      />
      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ProduccionDialog id={selectedPlanProd} esAdministracion={true} />
      </ModalCompoment>
      <ModalCompoment
        title="Detalles del pedido de Materiales"
        openPopup={modalPedidoMaterialesOpen}
        setOpenPopup={setModalPedidoMaterialesOpen}>
        <PedidoMaterialDialog
          selectedPedidoMateriales={selectedPedidoMateriales}
          setModalEditOpen={setModalPedidoMaterialesOpen}
          callback={refreshPage}
        />
      </ModalCompoment>
    </div>
  );
};
