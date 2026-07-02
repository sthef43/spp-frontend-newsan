import React, { useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Clear, Verified } from "@mui/icons-material";
import { ILimites, ILimitesTraza } from "app/models";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { Verificaciones } from "./Verificaciones";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LimitesTrazaSliceRequests } from "app/Middleware/reducers/LimitesTrazaSlice";
import moment from "moment";
import produce from "immer";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";

interface props {
  limites: ILimites[];
  linea: string;
  refresh: () => void;
}
//tabla con todos los puestos disponibles para hacer el control de torques
export const LimitesTable = ({ limites, linea, refresh }: props): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedLimite, setSelectedLimite] = React.useState<ILimites>(null);
  const [history, setHistory] = React.useState([]);
  const dispatch = useAppDispatch();

  const setRow = (limite: ILimites) => {
    setSelectedLimite(limite);
    setModalOpen(true);
  };
  const ExtraModulesCollapse = ({ row }: any) => {
    return (
      <>
        <div className="w-full">
          {history[row.id].length > 0 ? (
            <>
              <TitleUIComponent title="Controles realizados" classNameTitle="text-base" />
              <TableComponent
                columns={[
                  {
                    title: "Hora",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      return moment(row?.createdDate).format("H:mm:ss");
                    }
                  },
                  {
                    title: "Sector",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      return row?.limites?.instpuesto?.sector;
                    }
                  },
                  {
                    title: "Descripción",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      return row?.limites?.instpuesto?.descripcion;
                    }
                  },
                  {
                    title: "Puesto",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      return row?.limites?.codigoPuesto;
                    }
                  },
                  {
                    title: "Color",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      return row?.limites?.idColorNavigation?.color1;
                    }
                  },
                  {
                    title: "V1",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      // eslint-disable-next-line react/prop-types
                      return row.verificacion1 ? (
                        <IconButton disabled>
                          <Check color="success" />
                        </IconButton>
                      ) : (
                        <IconButton disabled>
                          <Clear color="error" />
                        </IconButton>
                      );
                    }
                  },
                  {
                    title: "V2",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      // eslint-disable-next-line react/prop-types
                      return row.verificacion2 ? (
                        <IconButton disabled>
                          <Check color="success" />
                        </IconButton>
                      ) : (
                        <IconButton disabled>
                          <Clear color="error" />
                        </IconButton>
                      );
                    }
                  },
                  {
                    title: "V3",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      // eslint-disable-next-line react/prop-types
                      return row.verificacion3 ? (
                        <IconButton disabled>
                          <Check color="success" />
                        </IconButton>
                      ) : (
                        <IconButton disabled>
                          <Clear color="error" />
                        </IconButton>
                      );
                    }
                  },
                  {
                    title: "V4",
                    field: "",
                    render: (row: ILimitesTraza) => {
                      // eslint-disable-next-line react/prop-types
                      return row.verificacion4 ? (
                        <IconButton disabled>
                          <Check color="success" />
                        </IconButton>
                      ) : (
                        <IconButton disabled>
                          <Clear color="error" />
                        </IconButton>
                      );
                    }
                  },
                  {
                    title: "Usuario",
                    field: "userName"
                  }
                ]}
                IDcolumn={"id"}
                dataInfo={history[row.id]}
              />
            </>
          ) : (
            <div className="flex justify-center font-medium py-4 ">
              <h1>Control de torque sin historial (:</h1>
            </div>
          )}
        </div>
      </>
    );
  };
  const getHistory = async () => {
    const newArr = limites.map(async (limite) => {
      const submit = { limitesId: limite?.id, fecha: moment().format("yyyy-MM-DD") };
      const response = unwrapResult(await dispatch(LimitesTrazaSliceRequests.getByLimitesIdAndFecha(submit)));
      setHistory(
        produce((state) => {
          state[limite.id] = response;
        })
      );
      return response;
    });
  };
  useEffect(() => {
    limites.length > 0 && getHistory();
  }, [limites]);

  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Código Trazabilidad",
            field: "codigoTrazabilidad"
          },
          {
            title: "Puesto",
            field: "numeroPuesto"
          },
          {
            title: "Descripción Puesto",
            field: "instpuesto.descripcion"
          },
          {
            title: "Codigo",
            field: "codigoPuesto"
          },
          {
            title: "Crítico",
            field: "",
            render: (row: ILimites) => {
              // eslint-disable-next-line react/prop-types
              return row.instpuesto.critico ? (
                <IconButton disabled>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <Clear color="error" />
                </IconButton>
              );
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <Tooltip title="Realizar control">
                    <IconButton
                      onClick={() => {
                        setRow(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Verified color="info" />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          }
        ]}
        dataInfo={limites}
        Collapse
        buscar
        Dense
        CollapseExtraModulesBefore={ExtraModulesCollapse}
      />
      <ModalCompoment title={linea} openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <Verificaciones limite={selectedLimite?.id} callback={setModalOpen} refresh={refresh} />
      </ModalCompoment>
    </div>
  );
};
