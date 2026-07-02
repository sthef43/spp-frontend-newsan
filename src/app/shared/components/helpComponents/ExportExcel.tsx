import { Button } from "@mui/material";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../material-ui/MaterialButtons";

interface Props {
  title: string;
  columns?: Array<{ title: string; field: string }>;
  data: any;
  titleButton?: string;
  stylesButton?: string;
}
/** Este componente puede exportar a excel pasandole las siguentes props
 *
 * `title`:`string` es el titulo del documento
 *
 *  columns: { title: string; field: string | null }[ ]; si se lo pasa como null se genera automaticamente con los atributos de la data
 *
 * `data`:`any` es el array de objetos necesarios para llenar el excel
 */
export const ExportExcel = ({ title, columns, data, titleButton, stylesButton }: Props) => {
  const classes = MaterialButtons();
  const [dataExcel, setDataExcel] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };
  const getColumns = () => {
    if (columns) {
      setColumnas(columns);
    } else {
      const keys = Object.keys(data[0]);
      const newColumns = keys.map((prop) => {
        const obj = { field: prop, title: prop };
        return obj;
      });
      setColumnas(newColumns);
    }
  };
  useEffect(() => {
    setDataExcel(data);
    getColumns();
  }, [data]);
  return (
    <div className={`${stylesButton ? stylesButton : 'w-full m-5'}`}>
      <Button className={classes.blueButton} variant="contained" onClick={excelExport}>
        { titleButton ? titleButton : 'EXPORTAR A EXCEL'}
      </Button>
      <ExcelExport data={dataExcel} ref={_exporter} fileName={title}>
        {columnas &&
          columnas?.map((columna, i) => <ExcelExportColumn key={i} field={columna.field} title={columna.title} />)}
      </ExcelExport>
    </div>
  );
};
