import { IAutomotrizJig } from "app/features/informes/Modules/reportePlacasAutomotriz/Interfaces/IAutomotrizJig";
import React, { useState } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import moment from "moment";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AutomotrizTesteosModal } from "./automotrizTesteosModal";

interface Props {
  dataTabla: IAutomotrizJig[];
  flagAgrupado?: boolean;
}
export const AutomotrizTesteosTable = ({ dataTabla, flagAgrupado }: Props): JSX.Element => {
  const [testeoPlaca, setTesteoPlaca] = useState(null);
  const [openModalTest, setOpenModalTest] = useState(false);
  const [dataTesteo, setDataTesteos] = useState<IAutomotrizJig>(null);

  const columnsAgrupadas = [
    { title: "Codigo", field: "codigo" },
    { title: "Cant. OK", field: "cantOk" },
    { title: "Cant. NG", field: "cantNg" }
  ];

  const columnsSinAgrupar = [
    { title: "Codigo", field: "codigo" },
    {
      title: "Estado testeo",
      field: "estado",
      render: (row) => (
        <div>
          <p>{row.estado ? "OK" : "NG"}</p>
        </div>
      )
    },
    { title: "Fecha", field: "createdDate", render: (row) => moment(row.createdDate).format("DD/MM/YYYY HH:mm") },
    {
      title: "Modelo",
      field: "modelo"
    },
    {
      title: "Acciones",
      field: "",
      render: (row) => (
        <div>
          <div>
            <IconButton onClick={() => openModalTesteos(row)}>
              <VisibilityIcon />
            </IconButton>
          </div>
        </div>
      )
    }
  ];

  const openModalTesteos = (row) => {
    console.log("row", row);
    setDataTesteos(row);
    setOpenModalTest(true);
  };

  return (
    <div>
      <TableComponent
        IDcolumn="id"
        showFooter={false}
        columns={flagAgrupado ? columnsAgrupadas : columnsSinAgrupar}
        dataInfo={dataTabla}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"codigo"}
      />
      <>
        <ModalCompoment
          title={`Resultado testeo placa ${dataTesteo?.codigo}`}
          openPopup={openModalTest}
          setOpenPopup={setOpenModalTest}
          showModalCenterPage={true}
          titleModalStyle="Audit">
          {openModalTest && dataTesteo && <AutomotrizTesteosModal dataTest={dataTesteo} />}
        </ModalCompoment>
      </>
    </div>
  );
};
