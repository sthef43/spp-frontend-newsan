import { Box } from "@mui/material";
import React from "react";

export const ItemTablero = (props: any): JSX.Element => {
  const { sx, bgcolor, color, bordercolor, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        height: "100%",
        width: "90%",
        justifyItems: "center",
        alignItems: "center",
        backgroundColor: bgcolor ? bgcolor : color == "verde" ? "#9AD2C7" : color == "amarillo" ? "#F8E378" : "#EF787A",
        border: bordercolor ? bordercolor : "",
        margin: "5px",
        ...sx
      }}
      {...other}
    />
  );
};
