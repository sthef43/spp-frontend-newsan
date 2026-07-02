import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Tooltip, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { ITipoUnidad } from "app/models/ITipoUnidad";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const AgregarTipoUnidadModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchDelete, FetchPost } = useFetchApiMultiResults();

  //SLICE QUE USO PARA PODER ACTUALIZAR LA TABLA LISTA DE TIPO DE UNIDADES
  const tipoUnidades = useAppSelector((state) => state.tipoUnidad.dataAll);

  //PETICION DE DELETE PARA BORRAR EL TIPO DE UNIDAD QUE SELECCIONO
  const deleteTipoUnidad = async (idTipo: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: idTipo,
      sliceRequest: TipoUnidadSliceRequests.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "Desea eliminar el tipo de unidad seleccionado",
      titleUser: "Eliminar Tipo de unidad",
      functionAdd: async () => {
        openNotificationUI("Se elimino el tipo de unidad con exito", "success");
        await dispatch(TipoUnidadSliceRequests.getAllRequest());
      }
    });
  };

  //FUNCION QUE AGREGA CON UN POST EL NUEVO TIPO DE UNIDAD A LA TABLA
  const onSubmit = async (e) => {
    const nuevoTipo = generarTipo(e);
    FetchPost(TipoUnidadSliceRequests.postRequest, nuevoTipo, false, async () => {
      openNotificationUI("Se creo el nuevo tipo de unidad con exito", "success");
      await dispatch(TipoUnidadSliceRequests.getAllRequest());
      reset();
    });
  };

  //GENERO EL NUEVO TIPO DE UNIDAD CON LOS DATOS QUE SE PASAN EN EL FORMULARIO
  const generarTipo = (dataForm) => {
    try {
      const nuevoTipo: ITipoUnidad = {
        descripcion: dataForm.descripcion,
        nombre: dataForm.nombre
      };

      if (nuevoTipo !== null) {
        return nuevoTipo;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error mientras se creaba el nuevo tipo ${error}`, "error");
    }
  };

  //VERIFICO QUE EL ESTADO DEL FORMULARIO SEA VALIDO PARA PODER HABILITAR EL BOTON
  const verificarEstadoBoton = () => {
    if (!isValid) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <main className="w-[50vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row justify-between gap-x-4">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Nombre tipo unidad"
            nameInput="nombre"
            valueDefault=""
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Descripcion tipo unidad"
            nameInput="descripcion"
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
        <div>
          <TableComponent
            IDcolumn="id"
            dataInfo={tipoUnidades}
            buscar
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
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <section>
                      <figure>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              deleteTipoUnidad(row.id);
                            }}
                            style={{ position: "relative" }}
                            size="small">
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </figure>
                    </section>
                  );
                }
              }
            ]}
          />
        </div>
        <FormButtons
          disabledFunction={verificarEstadoBoton}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
      </form>
    </main>
  );
};
