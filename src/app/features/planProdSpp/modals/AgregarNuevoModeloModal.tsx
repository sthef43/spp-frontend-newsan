import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { ITipoUnidad } from "app/models/ITipoUnidad";
import FetchApi from "app/shared/helpers/FetchApi";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, IconButton, Tooltip } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IModelo } from "app/models/IModelo";
import { Delete, Edit } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarTipoUnidadModal } from "./AgregarTipoUnidadModal";
import { modeloSlice, ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { EditarModeloModal } from "./EditarModeloModal";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AgregarNuevoModeloModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { FetchPost, FetchDelete } = useFetchApiMultiResults();

  //USO LOS SLICES PARA OBTENER LOS DATOS DE LOS MODALES ANTERIORES
  const familia = useAppSelector((state) => state.familia.object);
  const modelos = useAppSelector((state) => state.modelo.dataAll);
  const tipoUnidades = useAppSelector((state) => state.tipoUnidad.dataAll);

  //ESTADOS PARA ABRIR Y CERRAR LOS MODALES
  const [openModalCrearTipo, setOpenModalCrearTipo] = useState<boolean>(false);
  const [openModalEditarModelo, setOpenModalEditarModelo] = useState<boolean>(false);

  //SETEO EL TIPO SELECCIONADO DEL SELECT
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | number>("");

  //USO EL FETCHAPI PARA TRAER TODOS LOS TIPO DE UNIDADES DISPONIBLES
  FetchApi<ITipoUnidad[]>(TipoUnidadSliceRequests.getAllRequest, null, false, openModal, null, true);

  //USO EL FETCHAPI PARA TRAER TOODS LOS MODELOS INPUTADOS A LA FAMILIA DEL MODELO QUE SELECCIONE ANTERIORMENTE
  FetchApi<IModelo[]>(ModeloSliceRequest.getAllByFamiliaId, familia.id, false, openModal, null, true);

  //FUNCION QUE EJECUTA EL FORMULARIO PARA PODER CARGAR UN NUEVO MODELO
  const onSubmit = (e) => {
    const nuevoModelo = generarNuevoModelo(e);
    FetchPost(ModeloSliceRequest.PostRequest, nuevoModelo, true, async () => {
      openNotificationUI("Se cargo el nuevo modelo con exito", "success");
      await dispatch(ModeloSliceRequest.getAllByFamiliaId(familia.id));
      reset();
    });
  };

  //FUNCION QUE ACTIVA EL BORRADO LOGICO EN LA BASE DE DATOS
  const deleteModelo = (idModelo: number) => {
    FetchDelete({
      consoleLog: true,
      deleteId: idModelo,
      sliceRequest: ModeloSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "Desea eliminar el modelo seleccionado",
      titleUser: "Eliminar Modelo",
      functionAdd: async () => {
        openNotificationUI("Se elimino el modelo con exito!", "success");
        await dispatch(ModeloSliceRequest.getAllByFamiliaId(familia.id));
      }
    });
  };

  //GENERO UN NUEVO MODELO QUE LUEGO SE LO PASO A LA FUNCION QUE EJECUTA EL FORMULARIO
  const generarNuevoModelo = (formData) => {
    try {
      const nuevoModelo: IModelo = {
        nombre: formData.codigoModelo,
        descripcion: tipoSeleccionado as string,
        tipoUnidad: formData.unidad,
        familiaId: familia.id
      };

      if (nuevoModelo !== null) {
        return nuevoModelo;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error generando el nuevo modelo ${error}`, "error");
    }
  };

  //HANDLE QUE USO PARA ABRIR EL MODAL DE EDICION DEL MODELO Y SETEO EN EL SLICE EL MODELO QUE SELECCIONO EN LA TABLA
  const handleOpenModalEditarModelo = (rowModelo: IModelo) => {
    dispatch(modeloSlice.actions.setObject(rowModelo));
    setOpenModalEditarModelo(true);
  };

  return (
    <main className="w-[70vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start justify-start gap-y-4">
        <div className="flex flex-row justify-between w-full gap-x-4">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Codigo Modelo"
            nameInput="codigoModelo"
            valueDefault=""
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Descripcion"
            nameInput="descripcion"
            valueDefault=""
            requiredBool
            errors={errors}
          />
          <SelectComponent
            listaObjetos={tipoUnidades}
            inputLabel="Tipo de unidad"
            nameSelect="unidad"
            valueLabel={(value) => value.descripcion}
            valueSelect={(value) => value.nombre}
            control={control}
            valueKey={(value) => value}
            ValueSave={setTipoSeleccionado}
          />
        </div>
        <div className="flex flex-row justify-between w-full gap-x-4">
          <TextFieldComponent
            control={control}
            index={2}
            labelInput="Familia"
            nameInput="familia"
            valueDefault={familia.nombre}
            requiredBool
            disabled
            errors={errors}
          />
        </div>
        <div className="flex flex-row items-center justify-start gap-x-4 mt-2">
          <div>
            <Button
              onClick={() => {
                setOpenModalCrearTipo(true);
              }}
              className={buttonClases.purpleButton}>
              CREAR TIPO UNIDAD
            </Button>
          </div>
          <div>
            <Button type="submit" disabled={!isValid || tipoSeleccionado === ""} className={buttonClases.greenButton}>
              GUARDAR
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setOpenModal(false);
              }}
              className={buttonClases.redButton}>
              CANCELAR
            </Button>
          </div>
        </div>
      </form>
      <section>
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={modelos}
          columns={[
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "Familia",
              field: `familia.nombre`
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IModelo) => {
                return (
                  <div className="flex flex-row items-center gap-x-1">
                    <div>
                      <Tooltip title="Editar Modelo">
                        <IconButton
                          onClick={() => {
                            handleOpenModalEditarModelo(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar modelo">
                        <IconButton
                          onClick={() => {
                            deleteModelo(row.id);
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
        />
      </section>
      <ModalCompoment setOpenPopup={setOpenModalCrearTipo} openPopup={openModalCrearTipo} title="Agregar Nuevo Tipo">
        <AgregarTipoUnidadModal setOpenModal={setOpenModalCrearTipo} openModal={openModalCrearTipo} />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalEditarModelo} openPopup={openModalEditarModelo} title="Editar Modelo">
        <EditarModeloModal setOpenModal={setOpenModalEditarModelo} openModal={openModalEditarModelo} />
      </ModalCompoment>
    </main>
  );
};
