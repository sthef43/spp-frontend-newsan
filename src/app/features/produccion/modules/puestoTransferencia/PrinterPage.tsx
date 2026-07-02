import React from "react";
const exampleZPL = `^ ^XA^MUd,300,600^FO70,276^A@N,37,37,E:ARI000.FNT^FDModelo unidad interior ^FS^FO70,322^A@N,37,37,E:ARI000.FNT^FDModelo  unidad exterior ^FS^FO608,276^A@N,37,37,E:ARI000.FNT^FDPHS25HA4CNI^FS^FO608,322^A@N,37,37,E:ARI000.FNT^FDPHS25HA4CNE^FS^FO591,171^XGE:PHIL.GRF,1,1^FS^FO628,379^XGE:BGRANDE.GRF,1,1^FS^FO695,1089^A@N,60,55,E:ARI001.FNT^FD420^FS^FO695,1196^A@N,60,55,E:ARI001.FNT^FD2,75^FS^FO695,1285^A@N,60,55,E:ARI001.FNT^FD3,27^FS^FO645,1421^XGE:FLECHA.GRF,1,1^FS^FO695,1496^A@N,60,55,E:ARI001.FNT^FD2,5^FS^FO643,1583^XGE:ABCDEFG3.GRF,1,1^FS^FO647,1919^A@N,26,26,E:ARI000.FNT^FDEA 4182845 EE^FS^PQ1,0,1,Y^XZ`;
const x = () => {
  window.postMessage(
    {
      type: "zebra_print_label",
      zpl: exampleZPL,
      url: "http://127.0.0.1:9100/pstprnt"
    },
    "*"
  );
};
const values = {};
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994, id: 1 },
  { title: "The Godfather", year: 1972, id: 2 },
  { title: "The Godfather: Part II", year: 1974, id: 3 },
  { title: "The Dark Knight", year: 2008, id: 4 },
  { title: "12 Angry Men", year: 1957, id: 5 }
];

export const PrinterPage = (): JSX.Element => {
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option) => option.title
  };
  const flatProps = {
    options: top100Films.map((option) => option.title)
  };
  const [value, setValue] = React.useState(1);
  return (
    <div>
      {/* <Autocomplete
        {...defaultProps}
        id="controlled-demo"
        value={top100Films.find((x) => x.id == value)}
        onChange={(event: any, newValue: any) => {
          setValue(newValue.id);
        }}
        renderInput={(params) => <TextField {...params} label="controlled" variant="standard" />}
      /> */}
      {/* <GenericFieldsGenerator></GenericFieldsGenerator> */}
    </div>
  );
};
