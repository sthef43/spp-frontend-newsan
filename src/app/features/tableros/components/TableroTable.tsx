import React from "react";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface ITableroTable {
  color: string;
  bgColorHead: string;
  data: Array<any>;
}
export const TableroTable = ({ color, data, bgColorHead }: ITableroTable): JSX.Element => {
  const colores = {
    verde: "#0F2415",
    amarillo: "#FFBE16",
    rojo: "#96322c"
  };

  const getTableRow = (element, index): JSX.Element => {
    return (
      <TableRow 
        key={index} 
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 1,
            breakInside: "avoid"
          },
          "&:nth-of-type(odd)": {
            backgroundColor: color == "verde" ? "#9AD2C7" : color == "amarillo" ? "#F8E378" : "#EF787A"
          }
        }}
      >
        {Object.keys(element).map((key) => (
          <TableCell 
            key={key} 
            component="th" 
            scope="row" 
            sx={{
              color: color == "amarillo" ? "black" : "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "40px"
            }}
          >
            {element[key]}
          </TableCell>
        ))}
        <TableCell 
          component="th" 
          scope="row" 
          sx={{
            color: color == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}
        >
          {element.producidos}
        </TableCell>
        <TableCell 
          component="th" 
          scope="row" 
          sx={{
            color: color == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}
        >
          {element.rechazos}
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <div className="w-full py-1 text-lg text-white ">
          <TableContainer 
            sx={{
              boxShadow: "none",
              background: color == "verde" ? colores.verde : color == "amarillo" ? colores.amarillo : colores.rojo,
              font: "black"
            }}
          >
            <Table size="small">
              <TableHead style={{ backgroundColor: bgColorHead, border: "white solid 1px" }}>
                <TableRow style={{ height: "75px" }}>
                  {Object.keys(data[0]).map((key, index) => (
                    <TableCell 
                      key={index} 
                      sx={{
                        color: "white",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}
                    >
                      {key.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{data.map((element, index) => getTableRow(element, index))}</TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Grid>
  );
};
