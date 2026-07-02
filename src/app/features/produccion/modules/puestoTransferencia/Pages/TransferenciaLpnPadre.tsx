/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import {
  CLIContenedorItemsSlice,
  CLIContenedorItemsSliceRequest
} from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { IconButton, Tooltip } from "@mui/material";
import { MultipleStop, Visibility } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ExaminarContenidoModal } from "../modals/TransferirPlacas/ExaminarContenidoModal";
import { TransferirPlacasModal } from "../modals/TransferirPlacas/TransferirPlacasModal";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";

export const TransferenciaLpnPadre = () => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [openModalExaminarContenido, setOpenModalExaminarContenido] = useState(false);
  const [openModalTransferirPlacas, setOpenModalTranseferirPlacas] = useState(false);

  const contenedores = useAppSelector((state) => state.cliContenedorItems.dataAll);
  FetchApi<ICLIContendorItems[]>(CLIContenedorItemsSliceRequest.GetByOptionLpn, "PROD", false, null, null, false);

  const handleOpenModalAsignarBateas = (row: ICLIContendorItems) => {
    dispatch(CLIContenedorItemsSlice.actions.setContenedorObject(row));
    setOpenModalExaminarContenido(true);
  };

  const handleOpenModaTransferirPlacas = async (row: ICLIContendorItems) => {
    const response = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetContenedorById(row.id)));
    dispatch(CLIContenedorItemsSlice.actions.setContenedorObject(response));
    setOpenModalTranseferirPlacas(true);
  };

  return (
    <main className="mt-6 w-full">
      <section>
        <TableComponent
          dataInfo={contenedores == null ? [] : contenedores}
          IDcolumn="id"
          // agregar={() => nuevoContainer()}
          buscar
          columns={[
            {
              title: "Articulo",
              field: "articulo"
            },
            {
              title: "LPN Generada",
              field: "lpnGenerada"
            },
            {
              title: "Modelo",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.modelo !== null ? <p>{`${row.modelo}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Semielaborado",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.semiElaborado !== null ? <p>{`${row.semiElaborado}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Numero Op",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.numeroOp !== null ? <p>{`${row.numeroOp}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <section className="flex flex-row justify-start gap-x-2">
                    <div>
                      <Tooltip title="Examinar Contenido">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              handleOpenModalAsignarBateas(row);
                            }}>
                            <Visibility color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Transferir Ubicacion">
                        <span>
                          <IconButton
                            disabled={row.modelo === null}
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              handleOpenModaTransferirPlacas(row);
                            }}>
                            <MultipleStop color={row.modelo === null ? "disabled" : "primary"} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalExaminarContenido}
        openPopup={openModalExaminarContenido}
        title="Examinar Contenido Contenedor">
        <ExaminarContenidoModal setOpenModal={setOpenModalExaminarContenido} openModal={openModalExaminarContenido} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalTranseferirPlacas}
        openPopup={openModalTransferirPlacas}
        title="Transferir Contenedores">
        <TransferirPlacasModal setOpenModal={setOpenModalTranseferirPlacas} openModal={openModalTransferirPlacas} />
      </ModalCompoment>
    </main>
  );
};
