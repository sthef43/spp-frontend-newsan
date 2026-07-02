/* eslint-disable react/display-name */
import { useAppDispatch } from "app/core/store/store";
import { IReprocesoLote } from "app/models/IReprocesoLote";
import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";
import moment from "moment";
//import MaterialTable from "material-table";
import React, { forwardRef } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";

interface props {
  reprocesos: IReprocesoLote[];
}

export const ReprocesoLoteTable = ({ reprocesos }: props): JSX.Element => {
  const dispatch = useAppDispatch();

  const tableIcons = {
    FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
    SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
    ClearSearch: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
    Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />)
  };
  return (
    <div>
      <TableComponent
        buscar={true}
        IDcolumn={"idControlLote"}
        columns={[
          {
            title: "Desde",
            field: "serieDesde"
          },
          {
            title: "Hasta",
            field: "serieHasta"
          },
          {
            title: "Observaciones",
            field: "observaciones"
          },
          {
            title: "Reprocesados",
            field: "cantidadReprocesada"
          },
          {
            title: "Auditor",
            field: "auditor"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => moment(row.fecha).format("L")
          }
        ]}
        dataInfo={reprocesos}
        // Collapse={true}
        // Edit={(row) => {
        //   setRow(row?.idControlLote);
        // }}
      />
    </div>
    //   {/* <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew"> */}
    //   <MaterialTable
    //     //isLoading={cargando}
    //     icons={tableIcons}
    //     localization={{
    //       body: {
    //         emptyDataSourceMessage: ""
    //       }
    //     }}
    //     columns={[
    //       {
    //         title: "idControlLote",
    //         field: "idControlLote",
    //         hidden: true,
    //         filtering: false
    //       },
    //       {
    //         title: "Desde",
    //         field: "serieDesde",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Desde: </div>
    //               <div className="col-span-2 text-right sm:text-left">{rowData.serieDesde}</div>
    //             </div>
    //           );
    //         }
    //       },
    //       {
    //         title: "Hasta",
    //         field: "serieHasta",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Hasta: </div>
    //               <div className="col-span-2 text-right sm:text-left">{rowData.serieHasta}</div>
    //             </div>
    //           );
    //         }
    //       },
    //       {
    //         title: "Observaciones",
    //         field: "observaciones",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Rechazados: </div>
    //               <div className="col-span-2 text-right sm:text-left">{rowData.observaciones}</div>
    //             </div>
    //           );
    //         }
    //       },
    //       {
    //         title: "Reprocesados",
    //         field: "cantidadReprocesada",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Reprocesados: </div>
    //               <div className="col-span-2 text-right sm:text-left">{rowData.cantidadReprocesada}</div>
    //             </div>
    //           );
    //         }
    //       },
    //       {
    //         title: "Auditor",
    //         field: "auditor",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Auditor: </div>
    //               <div className="col-span-2 text-right sm:text-left">{rowData.auditor}</div>
    //             </div>
    //           );
    //         }
    //       },
    //       {
    //         title: "Fecha",
    //         field: "fecha",
    //         cellStyle: {
    //           padding: "0 1rem"
    //         },
    //         render: (rowData: any) => {
    //           return (
    //             <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
    //               <div className="sm:hidden font-bold"> Fecha: </div>
    //               <div className="col-span-2 text-right sm:text-left">{moment(rowData.fecha).format("L")}</div>
    //             </div>
    //           );
    //         }
    //       }
    //     ]}
    //     data={reprocesos ?? []}
    //     options={{
    //       //filtering: getResolucion(),
    //       search: false,
    //       showTitle: false,
    //       toolbar: false,
    //       pageSize: 5,
    //       searchFieldStyle: {
    //         padding: 5,
    //         marginTop: 5
    //       },
    //       editCellStyle: {
    //         backgroundColor: "#01579b",
    //         color: "#FFF"
    //       },
    //       searchFieldAlignment: "left"
    //     }}
    //   />
    // </div>
    // </div>
  );
};
