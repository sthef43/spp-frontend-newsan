import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React, { useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { IconButton, Tooltip } from "@mui/material";
import { CheckBoxOutlined, GradingRounded } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { OQCPalet } from "./OQCPalet";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { oqcDesignadaSlice } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";

export const OQCDesignadasTable = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const oqcDesignadas = useAppSelector<IOQCDesignada[]>((state) => state.oqcDesignada.dataAll);

  const [palet, setPalet] = useState(false);

  const onRealizar = (oqc: IOQCDesignada) => {
    dispatch(oqcDesignadaSlice.actions.setObject(oqc));
    if (oqc.paletiza) {
      setPalet(true);
    } else {
      history.push(`oqc-realizar-designada`);
    }
  };

  return (
    <ContainerForPages optionsLayout="Table" activeEffectVisible>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "OQC",
            field: "oqc.nombre"
          },
          {
            title: "Valida núm serie",
            field: "",
            render: (row: IOQCDesignada) => (row.oqc.validarNumSerie ? "Si" : "No")
          },
          {
            title: "Valida interface ebs",
            field: "",
            render: (row) => (row.celulares ? "Si" : "No")
          },
          {
            title: "Paletiza",
            field: "",
            render: (row) => (row.paletiza ? "Si" : "No")
          },
          {
            title: "Cantidad",
            field: "",
            render: (row: IOQCDesignada) =>
              row.paletiza ? null : (
                <div
                  className={`${
                    row.cantidad == row.oqcDesignadaResultado?.length ? "text-green-500" : "text-red-500"
                  }`}>
                  {row.cantidad - row.oqcDesignadaResultado?.length}/{row.cantidad}
                </div>
              )
          },
          {
            title: "Acciones",
            field: "",
            render: (row: IOQCDesignada) =>
              row.cantidad !== row.oqcDesignadaResultado?.length || row.celulares ? (
                <Tooltip title="Realizar OQC">
                  <IconButton onClick={() => onRealizar(row)}>
                    <GradingRounded color="inherit" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="OQC realizadas">
                  <IconButton>
                    <CheckBoxOutlined color="success" />
                  </IconButton>
                </Tooltip>
              )
          }
        ]}
        dataInfo={oqcDesignadas}
      />
      <ModalCompoment setOpenPopup={setPalet} openPopup={palet} title="Palet por modelo">
        <OQCPalet closeModal={setPalet} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
