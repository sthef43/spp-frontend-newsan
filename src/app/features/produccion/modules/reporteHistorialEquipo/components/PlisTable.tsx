import { unwrapResult } from "@reduxjs/toolkit";
import { PlisSliceRequests } from "app/Middleware/reducers/PlisSlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";

interface props {
  registroInicio: IInicio;
}

export const PlisTable = ({ registroInicio }: props) => {
  const dispatch = useAppDispatch();
  const [listPlis, setListPlis] = useState([]);

  useEffect(() => {
    getListadoPlis();
  }, [registroInicio]);

  const getListadoPlis = async () => {
    let listadoPlisResult = [];
    try {
      listadoPlisResult = unwrapResult(
        await dispatch(
          PlisSliceRequests.getListByBarcode({
            barcode: registroInicio.codigoTrazabilidad
          })
        )
      );
    } catch (error) {
      throw new Error(error);
    }
    if (listadoPlisResult) {
      let aux = 0;
      const array = listadoPlisResult.map((ele) => {
        aux += 1;
        return { ...ele, id: aux };
      });
      console.log(array);

      setListPlis(array);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center ">
        <TitleUIComponent title={"Plis"} classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <TableComponent
        Dense={false}
        Overflow={false}
        IDcolumn={"id"}
        columns={[
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.datE_TESTED).format("L");
            }
          },
          {
            title: "Descriptor",
            field: "descriptor"
          },
          {
            title: "Processor_id",
            field: "processoR_ID"
          },
          {
            title: "Barcode",
            field: "barcode"
          },
          {
            title: "Seqno",
            field: "seqno"
          },
          {
            title: "Status",
            field: "status"
          },
          {
            title: "Complete",
            field: "complete"
          }
        ]}
        dataInfo={listPlis}
      />
    </div>
  );
};
