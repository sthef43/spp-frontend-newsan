import { Delete, Edit, Error, Image } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHHerramentalSliceRequests } from "app/Middleware/reducers/DobHHerramentalSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDobHHerramental } from "app/models/IDobHHerramental";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { HerramentalesForm } from "app/features/dobladora/modules/gestionHerramental/modals/HerramentalesForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const Herramentales = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IDobHHerramental | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);

  //Leer
  const [listHerramentales, setlistHerramentales] = useState([]);
  const getHerramentales = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobHHerramentalSliceRequests.getAllRequest()));
      setlistHerramentales(responses);
    } catch (error) {
      openNotificationUI("Error al leer herramental.", "error");
    }
  };

  //Eliminar
  const deleteHerramental = async (row) => {
    const resp = await getConfirmation("Borrar herramental", "Esta seguro que quiere eliminar el herramental?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(DobHHerramentalSliceRequests.deleteRequest(row)));
        if (response) {
          openNotificationUI("Se eliminó el herramental correctamente", "success");
          getHerramentales();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar herramental.", "error");
      }
    }
  };

  //Imagen
  const [modalVerImagen, setModalVerImagen] = useState(false);
  const [stringImagen, setStringImagen] = useState("");

  const verImagen = (imagen) => {
    setModalVerImagen(true);
    setStringImagen(imagen);
  };

  //Editar
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("HERRAMENTALES");
    getHerramentales();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Id",
            field: "id"
          },
          {
            title: "Código",
            field: "codigo"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Tipo Máquina",
            field: "",
            render: (row) => {
              return (
                row.dobHTipoMaquina.id + "- " + row.dobHTipoMaquina.codigo + " - " + row.dobHTipoMaquina.descripcion
              );
            }
          },
          {
            title: "Tipo Herramental",
            field: "",
            render: (row) => {
              return row.dobHTipo.codigo + " - " + row.dobHTipo.descripcion;
            }
          },
          {
            title: "Diámetro Tubo",
            field: "dobHDiametroTubo.descripcion"
          },
          {
            title: "Radio Medio",
            field: "dobHRadioMedio.codigo"
          },
          {
            title: "Estado",
            field: "dobHEstado.descripcion"
          },
          {
            title: "Proveedor",
            field: "",
            render: (row) => {
              return row.dobHProveedor.nombre + " - " + row.dobHProveedor.nacionalidad;
            }
          },
          {
            title: "Costo U$S",
            field: "costoUSS"
          },
          {
            title: "Correlativo",
            field: "correlativo"
          },
          {
            title: "Fecha Creación",
            field: "",
            render: (row) => {
              return moment(row.createdDate).format("L");
            }
          },
          {
            title: "Fecha Modificación",
            field: "",
            render: (row) => {
              return moment(row.lastModifiedDate).format("L");
            }
          },
          {
            title: "Fotos",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    {row.imagen != "" && row.imagen != null ? (
                      <IconButton
                        onClick={() => {
                          verImagen(row.imagen);
                        }}
                        size="small"
                        color="success"
                        style={{ position: "relative" }}>
                        <Image />
                      </IconButton>
                    ) : (
                      <IconButton size="small" color="error" style={{ position: "relative" }}>
                        <Error />
                      </IconButton>
                    )}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          editar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          deleteHerramental(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setEstaEditando(false);
          setEditState(null);
          setModalOpen(true);
        }}
        dataInfo={listHerramentales}
      />
      <ModalCompoment title="Nuevo Herramental" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <HerramentalesForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getHerramentales}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
      <ModalCompoment title="Imagen" openPopup={modalVerImagen} setOpenPopup={setModalVerImagen}>
        <>
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
              <img
                style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
                src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/Herramentales/${stringImagen}`}
              />
            </div>
          </div>
        </>
      </ModalCompoment>
    </div>
  );
};
