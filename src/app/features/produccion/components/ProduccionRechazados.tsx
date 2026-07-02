import { IControlLote } from "app/models/IControlLote";
import moment from "moment";
import React from "react";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import DownloadIcon from "@mui/icons-material/Download";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { CsvBuilder } from "filefy";
import { Button } from "@mui/material";

interface prop {
  rechazados: IControlLote[];
}

export const ProduccionRechazados = ({ rechazados }: prop): JSX.Element => {
  const classesButton = MaterialButtons();

  const eraseNullKeys = (data: any): any[] => {
    let newData = {};
    const dataToReturn = [];

    data.map((dat) => {
      Object.entries(dat)
        .filter(([, value]) => value !== null)
        .forEach(([key, value]) => (newData[key] = value));
      dataToReturn.push(newData);
      newData = {};
    });

    return dataToReturn;
  };

  const dataToCsv = (data: any[]) => {
    const varData = [];
    data.map((dat) => {
      const aux = {
        fecha: dat.fecha,
        serieDesde: dat.serieDesde,
        serieHasta: dat.serieHasta,
        nombreSupervisor: dat.nombreSupervisor,
        cantidadRechazos: dat.cantidadRechazos,
        cantidadReprocesos: dat.cantidadReprocesos,
        accioncorrectiva: dat.accioncorrectiva,
        contenidoDefectuoso: dat.contenidoDefectuoso,
        observaciones: dat.observaciones,
        estadoReproceso: dat.estadoReproceso === "N" ? "Para Reprocesar" : "Reprocesado"
      };
      varData.push(aux);
    });
    return varData;
  };

  const handleDescargar = () => {
    const csvBuilder = new CsvBuilder("Rechazos.csv");
    csvBuilder.setDelimeter(";");
    const data = dataToCsv(createData());
    // const sinNulls = eraseNullKeys(data);
    console.log("🚀 ~ file: ProduccionRechazados.tsx ~ line 20 ~ handleDescargar ~ data", data[0]);
    console.log("🚀 ~ file: ProduccionRechazados.tsx ~ line 20 ~ handleDescargar ~ data", Object.keys(data[0]));

    csvBuilder.setColumns(Object.keys(data[0]));
    data.map((dat) => {
      csvBuilder.addRow(Object.values(dat));
    });
    console.log("filas", csvBuilder);

    csvBuilder.exportFile();
  };

  const verificarEstado = (estado: string) => {
    // console.log(estado);
    switch (estado) {
      case "N":
        return "Para Reprocesar";
      case "S":
        return "Reprocesado";
    }
    // console.log(estado);
  };

  const createData = () => {
    const varData = [];
    rechazados.map((rech: IControlLote) => {
      const aux = {
        ...rech,
        fecha: moment(rech.fecha).format("DD-MM-YYYY")
      };
      varData.push(aux);
    });
    return varData;
  };

  return (
    <div className="w-full">
      <div className="text-right pb-5">
        <Button className={classesButton.blueButton} variant="contained" color="primary" onClick={handleDescargar}>
          Descargar
          <DownloadIcon fontSize="small" />
        </Button>
      </div>
      <TableComponent
        IDcolumn={"idControlLote"}
        columns={[
          {
            title: "Fecha",
            field: "fecha"
          },
          {
            title: "Desde",
            field: "serieDesde"
          },
          {
            title: "Hasta",
            field: "serieHasta"
          },
          {
            title: "Supervisor",
            field: "nombreSupervisor"
          },
          {
            title: "Equipos rechazados",
            field: "cantidadRechazos"
          },
          {
            title: "Equipos reprocesados",
            field: "cantidadReprocesos"
          },
          {
            title: "Acción correctiva",
            field: "accioncorrectiva"
          },
          {
            title: "Contenido defectuoso",
            field: "contenidoDefectuoso"
          },
          {
            title: "Observaciones",
            field: "observaciones"
          },
          {
            title: "Estado",
            field: "estadoReproceso",
            render: (row) => {
              return verificarEstado(row.estadoReproceso);
            }
          }
        ]}
        dataInfo={createData()}
        //Collapse={true}
        // rowStyle={(rowData) => {
        //   return rowData.cargando ?? { backgroundColor: "#2697F" };
        // }}
        // buscar={true}
        Dense={true}
      />
      <br />
    </div>
  );
};
