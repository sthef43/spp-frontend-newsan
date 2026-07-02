import { unwrapResult } from "@reduxjs/toolkit";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IGenerico } from "app/models";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

interface props {
  setValue: any;
}
export const GenericoTable = ({ setValue }: props) => {
  const dispatch = useAppDispatch();

  const getGenericos = async () => {
    const result = unwrapResult(await dispatch(GenericoSliceRequests.getAllRequest()));
    if (result) {
      setGenericos(result);
    }
  };

  useEffect(() => {
    getGenericos();
  }, []);

  const editar = (rowData: IGenerico) => {
    setValue(rowData);
  };

  const [genericos, setGenericos] = useState<IGenerico[]>(null);
  return (
    <div>
      {genericos && (
        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Codigo",
              field: "codigo"
            },
            {
              title: "Generico",
              field: "generico1"
            },
            {
              title: "Acciones",
              field: "",
              render: (rowData: any) => (
                <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                  <div id="icono" className="col-span-2 text-right sm:text-left ">
                    <IconButton
                      onClick={() => {
                        editar(rowData);
                      }}
                      size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              )
            }
          ]}
          dataInfo={genericos}
          Dense={true}
        />
      )}
    </div>
  );
};
