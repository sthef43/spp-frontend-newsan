/* eslint-disable react/display-name */
import React from "react";

import { forwardRef } from "react";
import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";

import { IconButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useHistory } from "react-router";
import { IAppUser } from "app/models/IAppUser";
import { IPermisos, IRegistry } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { RegistrySliceRequests } from "app/Middleware/reducers/RegistrySlice";
import { IQuery, IQueryResult } from "app/models/IQuery";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import moment from "moment";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";

const divofacctions =
  "w-full py-2 sm:col-span-1 items-center grid grid-cols-3 sm:grid-cols-2 sm:border-2 sm:content-center border-gray-500 rounded-md px-0 sm:px-4 gap-2 sm:gap-4";
const tableIcons = {
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  OpenInfo: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
  Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  ClearSearch: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />)
};
export const HistoricAuditPerformed = (): JSX.Element => {
  const classes = IconButtons();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const tableRef = React.createRef();
  const permisos: IPermisos = useAppSelector<IAppUser>((state) => state.authentification.data.permisos as any);
  async function onInit(query: IQuery<IRegistry>): Promise<IQueryResult<IRegistry>> {
    const page = query.page + 1;
    const information = unwrapResult(
      await dispatch(
        RegistrySliceRequests.getPaginationbyRolId({
          pag: page,
          count: query.pageSize,
          rolId: permisos?.rolId,
          search: query.search
        })
      )
    );
    const copyInfo = JSON.parse(JSON.stringify(information));
    return { data: copyInfo.data, totalPages: copyInfo.totalPage, totalCount: copyInfo.total };
  }

  return (
    <div>
      <TitleUIComponent classNameTitle="text-base" title={"Lista de auditorías realizadas en el sistema anterior"} />

      <TableComponent
        IDcolumn={"id"}
        buscar={true}
        columns={[
          {
            title: "Nombre",
            field: "audit.name"
          },
          {
            title: "Fecha",
            field: "",
            render: (row: any) => moment(row?.createdDate).format("L")
          },
          {
            title: "Planta",
            field: "plant.name"
          },
          {
            title: "Linea",
            field: "line.name"
          },
          {
            title: "Tipo de Auditoria",
            field: "",
            render: (row) => {
              return row?.finalProduct.length > 0 ? "producto" : row?.registryResult.length > 0 && "calidad";
            }
          }
        ]}
        AsyncData={onInit}
        Collapse={true}
        Watch={(row) => {
          console.log(row);
          history.push(`/main/auditoria/perform/${row?.audit?.id}/${row?.id}/0`);
        }}
      />
    </div>
  );
};
