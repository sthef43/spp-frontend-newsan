/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { CLIContenedorItemsSlice } from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Receipt } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RecepcionarLpnPadreModal } from "../modals/RecepcionLpnPadre/RecepcionarLpnPadreModal";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const RecepcionLpnPadre = () => {
  const { control } = useForm();

  const opcionFiltrado = useAppSelector((state) => state.optionalStates.tipoFiltrado as string);
  const sectorSeleccionado = useAppSelector((state) => state.cliSectores.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [openModalRecepcionarLpn, setOpenModalRecepcionarLpn] = useState(false);

  const [aux, setAux] = useState([]);
  const getAllContenedores = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          CLIContenedorItemsRecepcionBloqSliceRequest.GetAllContainerIemsByStateReceived({
            tipoFiltrado: opcionFiltrado,
            sectorId: sectorSeleccionado.id
          })
        )
      );
      if (response) {
        setAux(response);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleOpenModalRecepcion = (row: ICLIContendorItems) => {
    dispatch(CLIContenedorItemsSlice.actions.setContenedorObject(row));
    setOpenModalRecepcionarLpn(true);
  };

  useEffect(() => {
    if (sectorSeleccionado && opcionFiltrado) {
      getAllContenedores();
    }
  }, [sectorSeleccionado, opcionFiltrado]);

  return (
    <main className="mt-6 w-full">
      <section>
        <TableComponent
          dataInfo={
            aux == null
              ? []
              : aux.map((elementos) => {
                  return elementos.cliContenedorItems;
                })
          }
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
                      <Tooltip title="Recepcionar LPN Padre">
                        <span>
                          <IconButton
                            disabled={row.modelo === null}
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              handleOpenModalRecepcion(row);
                            }}>
                            <Receipt color={row.modelo === null ? "disabled" : "primary"} />
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
        setOpenPopup={setOpenModalRecepcionarLpn}
        openPopup={openModalRecepcionarLpn}
        title="Recepcionar LPN">
        <RecepcionarLpnPadreModal setOpenModal={setOpenModalRecepcionarLpn} openModal={openModalRecepcionarLpn} />
      </ModalCompoment>
    </main>
  );
};
