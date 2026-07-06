import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { InspeccionesGroupedDTO } from "app/features/calidad/services/calidad-inspecciones.service";
import { CalidadInspeccionesSliceRequest } from "app/features/calidad/slices/CalidadInspeccionesSlice";

type Props = {
  from: string;
  to: string;
};

const InspeccionesTable = ({ from, to }: Props) => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<InspeccionesGroupedDTO[]>([]);

  const getData = async (from, to) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(CalidadInspeccionesSliceRequest.GetInspeccionesGrouped({ from, to }))
      );
      setData(response);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    getData(from, to);
  }, [from, to]);

  return (
    <div>
      <TableComponent
        buscar={true}
        IDcolumn={"codigo"}
        columns={[
          {
            title: "Codigo",
            field: "codigo"
          },
          {
            title: "Cantidad de Inspecciones",
            field: "inspecciones"
          },
          {
            title: "Ultima Inspecciones",
            field: "ultimaInspeccion",
            render: (row) => (
              <div>
                <p>{moment(row.ultimaInspeccion).format("DD-MM-YYYY hh:mm:ss")}</p>
              </div>
            )
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <div className="flex">
                <Tooltip title="Inspeccionar">
                  <IconButton
                    onClick={() => {
                      history.push(`/main/calidad/detail/${row.codigo}`);
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <PersonSearchIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
        ]}
        dataInfo={data}
      />
    </div>
  );
};

export default InspeccionesTable;
