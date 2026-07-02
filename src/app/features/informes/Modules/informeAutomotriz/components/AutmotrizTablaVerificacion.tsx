import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import React from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { Box } from "@mui/system";

interface Props {
  data?: TrazaOperaciones[] | any[];
  columns: any[];
  flagMovimientos?: boolean;
}
export const AutomotrizTabLaVerificacion = ({ data, columns, flagMovimientos }: Props): JSX.Element => {
  return (
    <div className={`w-full ${flagMovimientos ? "min-w-[650px] flex flex-row justify-center p-2" : ""}`}>
      <Box
        sx={{
          width: "100%",
          ...(flagMovimientos
            ? {
                "& th, & .MuiTableCell-head, & .MuiDataGrid-columnHeaderTitleContainer": {
                  textAlign: "center !important",
                  justifyContent: "center !important"
                }
              }
            : {})
        }}>
        <TableComponent
          excel={true}
          IDcolumn={"id"}
          headerBackgroundColor="#F8FAFB"
          columns={columns}
          dataInfo={data}
        />
      </Box>
    </div>
  );
};
