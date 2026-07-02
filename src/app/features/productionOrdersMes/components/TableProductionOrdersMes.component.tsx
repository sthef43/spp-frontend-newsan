import { IProductionOrders } from "app/models/mes/IProductionOrders";
//import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
//import { PatchedPagination } from "../material-ui/materialPagination";
import _ from "lodash";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
interface IProps {
  data: IProductionOrders[];
  editProductionCallback: any;
  deleteProductionCallback: any;
}
export const TableProductionOrdersMes = ({ data, editProductionCallback, deleteProductionCallback }: IProps) => {
  const [state, setstate] = useState<IProductionOrders[]>([]);
  useEffect(() => {
    setstate(_.cloneDeep(data));
  }, [data]);
  return (
    <div>
      <TableComponent
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Nombre",
            field: "name"
          },
          {
            title: "Fábrica",
            field: "factory.name"
          },
          {
            title: "Disponible",
            field: "",
            render: (row) => (row?.enabled ? "SI" : "NO")
          },
          {
            title: "Total",
            field: "totalQty"
          },
          {
            title: "Consumido",
            field: "consumedQty"
          }
        ]}
        dataInfo={state}
        Collapse={true}
        Edit={(row) => {
          editProductionCallback(_.cloneDeep(state.find((x) => x.id == row?.id)));
        }}
        Delete={(row) => {
          console.log(state);
          console.log(row);
          deleteProductionCallback(_.cloneDeep(state.find((x) => x.id == row?.id)).id);
        }}
      />
    </div>
    //   {data && (
    //     <div className="animate__animated animate__fadeInUp mt-4">
    //       {console.log(state)}
    //       <MaterialTable
    //         style={{ overflowX: "hidden" }}
    //         // isLoading={cargando}
    //         components={{ Pagination: PatchedPagination }}
    //         localization={{
    //           toolbar: {
    //             searchPlaceholder: "Buscar"
    //           },
    //           body: {
    //             emptyDataSourceMessage: ""
    //           }
    //         }}
    //         columns={[
    //           {
    //             title: "Id",
    //             field: "id",
    //             hidden: true,
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           },
    //           {
    //             title: "Nombre",
    //             render: (rowData: IProductionOrders) => {
    //               return (
    //                 <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //                   <div className="sm:hidden font-bold"> Nombre: </div>
    //                   <div className="col-span-2 text-right text-lg sm:text-left">{rowData?.name}</div>
    //                 </div>
    //               );
    //             },
    //             headerStyle: {
    //               padding: "0 2rem"
    //             },
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           },
    //           {
    //             title: "Fábrica",
    //             render: (rowData: IProductionOrders) => {
    //               return (
    //                 <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //                   <div className="sm:hidden font-bold"> Fábrica: </div>
    //                   <div className="col-span-2 text-right text-lg sm:text-left">{rowData?.factory?.name}</div>
    //                 </div>
    //               );
    //             },
    //             headerStyle: {
    //               padding: "0 2rem"
    //             },
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           },
    //           {
    //             title: "Disponible",
    //             render: (rowData: IProductionOrders) => {
    //               return (
    //                 <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //                   <div className="sm:hidden font-bold">Disponible</div>
    //                   <div className="col-span-2 text-right text-lg sm:text-left">{rowData?.enabled ? "SI" : "NO"}</div>
    //                 </div>
    //               );
    //             },
    //             headerStyle: {
    //               padding: "0 2rem"
    //             },
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           },
    //           {
    //             title: "Total",
    //             headerStyle: {
    //               padding: "0 2rem"
    //             },
    //             render: (rowData: IProductionOrders) => {
    //               return (
    //                 <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //                   <div className="sm:hidden font-bold"> Total: </div>
    //                   <div className="col-span-2 text-right text-lg sm:text-left">{rowData?.totalQty}</div>
    //                 </div>
    //               );
    //             },
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           },
    //           {
    //             title: "Consumido",
    //             headerStyle: {
    //               padding: "0 2rem"
    //             },
    //             render: (rowData: IProductionOrders) => {
    //               return (
    //                 <div className="w-full hidden sm:grid grid-cols-3 sm:grid-cols-2 gap-4">
    //                   <div className="sm:hidden font-bold">Consumido: </div>
    //                   <div className="col-span-2 text-right text-lg sm:text-left">{rowData?.consumedQty}</div>
    //                 </div>
    //               );
    //             },
    //             cellStyle: {
    //               padding: "0 2rem"
    //             }
    //           }
    //         ]}
    //         data={state ?? []}
    //         detailPanel={[
    //           {
    //             icon: materialTableIcons.OpenInfo,
    //             tooltip: "Informacion extra",
    //             render: (rowData) => {
    //               return (
    //                 <div className="w-full sm:flex  sm:items-stretch sm:justify-center sm:gap-2 px-8">
    //                   <div className={tabledivActions}>
    //                     <div className=" font-bold">Acciones </div>
    //                     <div className="col-span-2 sm:col-span-1 text-right">
    //                       <IconButton
    //                         className="textButtons"
    //                         onClick={() => {
    //                           editProductionCallback(_.cloneDeep(data.find((x) => x.id == rowData?.id)));
    //                           //history.push(`/main/auditoria/perform/${rowData?.audit?.id}/${rowData?.id}`);
    //                         }}
    //                         size="large">
    //                         <EditIcon />
    //                       </IconButton>
    //                     </div>
    //                   </div>
    //                   {/* <div className={tabledivActions}>
    //                 <div className=" font-bold">Auditor </div>
    //                 <div className="col-span-2 sm:col-span-1 text-right">
    //                   {rowData.operator?.name} {rowData.operator?.surname}
    //                 </div>
    //               </div> */}
    //                 </div>
    //               );
    //             }
    //           }
    //         ]}
    //         options={{
    //           search: true,
    //           showTitle: false,
    //           toolbar: true,

    //           searchFieldStyle: {
    //             padding: 5,
    //             marginTop: 5
    //           },
    //           editCellStyle: {
    //             backgroundColor: "#01579b",
    //             color: "#FFF"
    //           },
    //           searchFieldAlignment: "left",
    //           rowStyle: (rowData) => {
    //             switch (rowData.estado) {
    //               case 2:
    //                 return { padding: 1, backgroundColor: "#28a745", fontSize: 14 };
    //               case 3:
    //                 return { padding: 1, backgroundColor: "#2697FF", fontSize: 14 };
    //               case 4:
    //                 return { padding: 1, backgroundColor: "#ffc107", fontSize: 14 };
    //               default:
    //                 return { padding: 1, fontSize: 14 };
    //             }
    //           }
    //         }}
    //       />
    //     </div>
    //   )}
    // </div>
  );
};
