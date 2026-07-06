import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AñadirEditarTareasModal } from "../../modals/DotacionTareasModals/AñadirEditarTareasModal";
import { IDotacionSector } from "../../models/IDotacionSector";
import { IDotacionTareas } from "../../models/IDotacionTareas";
import { DotacionSectorSliceRequest } from "../../reducers/DotacionSectorSlice";
import { DotacionTareaSliceRequest } from "../../reducers/DotacionTareasSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DotacionMantenimientoTareas = () => {
  const { control } = useForm();

  const classes = MaterialButtons();

  const [openModalEditarAñadir, setOpenModalEditarAñadir] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<IDotacionTareas>();

  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>(0);

  const [listaSectores, setListaSectores] = useState<IDotacionSector[]>([]);
  FetchApi<IDotacionSector[]>(DotacionSectorSliceRequest.getAllRequest, null, false, null, setListaSectores);

  const [listaTareas, setListaTareas] = useState<IDotacionTareas[]>([]);
  FetchApi<IDotacionTareas[]>(
    DotacionTareaSliceRequest.GetAllBySectorId,
    sectorSeleccionado,
    false,
    sectorSeleccionado,
    setListaTareas
  );

  const handleOpenModal = () => {
    setModoEdicion(false);
    setOpenModalEditarAñadir(true);
  };

  return (
    <main className="w-full p-5 bg-secondaryNew shadow-lg">
      <SelectComponent
        listaObjetos={listaSectores}
        nameSelect="planta"
        valueLabel={(value) => value.nombre}
        valueSelect={(value) => value.id}
        inputLabel="Seleccione un sector"
        ValueSave={setSectorSeleccionado}
        control={control}
        valueKey={(value) => value}
      />
      <div className="my-3">
        <Button
          onClick={() => {
            handleOpenModal();
          }}
          disabled={sectorSeleccionado === 0}
          className={classes.blueButton}>
          Cargar nueva tarea
        </Button>
      </div>
      {listaTareas && (
        <section>
          <div>
            <TableComponent
              buscar
              dataInfo={listaTareas}
              IDcolumn="id"
              columns={[
                {
                  title: "Nombre",
                  field: "nombre"
                },
                {
                  title: "Detalles",
                  field: "detalles"
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <section className="flex flex-row items-center">
                        <div>
                          <Tooltip title="Eliminar tarea">
                            <span>
                              <IconButton
                                // onClick={() => { eliminarGrupo(row) }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Delete color="error" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Editar tarea">
                            <span>
                              <IconButton
                                onClick={() => {
                                  setModoEdicion(true);
                                  setTareaSeleccionada(row);
                                  setOpenModalEditarAñadir(true);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        {/* <div>
                                                    <Tooltip title="Examinar tarea">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => { console.log("sasa") }}
                                                                size="small"
                                                                style={{ position: "relative" }}>
                                                                <TouchAppRounded color="secondary" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </div> */}
                      </section>
                    );
                  }
                }
              ]}
            />
          </div>
        </section>
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalEditarAñadir}
        openPopup={openModalEditarAñadir}
        title={`${modoEdicion ? "Editar" : "Agregar"} Sector`}>
        <AñadirEditarTareasModal
          modoEditor={modoEdicion}
          sectorId={sectorSeleccionado as number}
          setListaTareas={setListaTareas}
          setOpenModal={setOpenModalEditarAñadir}
          tareaSeleccionada={tareaSeleccionada}
        />
      </ModalCompoment>
    </main>
  );
};
