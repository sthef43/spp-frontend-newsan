/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ICtrlPlacasTipoMuestra } from "app/models/ICtrlPlacasTipoMuestra";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { CtrlPlacasTipoMuestraSliceRequest } from "app/Middleware/reducers/CtrlPlacasTipoMuestraSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const RegistrarTipoMuestraForm: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm();

  const listaMuestras = useAppSelector((state) => state.ctrlPlacasTipoMuestra.dataAll);

  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { FetchDelete, FetchPost } = useFetchApiMultiResults<ICtrlPlacasTipoMuestra>();

  const onSubmit = (dataForm) => {
    const guardarNuevoTipo = generarNuevoTipo(dataForm);
    FetchPost(CtrlPlacasTipoMuestraSliceRequest.PostRequest, guardarNuevoTipo, false, async () => {
      await dispatch(CtrlPlacasTipoMuestraSliceRequest.getAllRequest());
      openNotificationUI("Se guardo el nuevo tipo con exito!", "success");
      reset();
    });
  };

  const eliminarTipo = (tipoId: number) => {
    FetchDelete({
      consoleLog: false,
      sliceRequest: CtrlPlacasTipoMuestraSliceRequest.deleteRequest,
      deleteId: tipoId,
      mensajePersonalizado: true,
      titleUser: "Eliminar Tipo de Muestra",
      messageUser: "Se eliminara el tipo de muestra seleccionado",
      functionAdd: async () => {
        await dispatch(CtrlPlacasTipoMuestraSliceRequest.getAllRequest());
        openNotificationUI("Se elimino el tipo de muestra con exito", "success");
      }
    });
  };

  const generarNuevoTipo = (formData) => {
    try {
      const nuevoTipo: ICtrlPlacasTipoMuestra = {
        descripcion: formData.descripcionMuestra,
        nombre: formData.nombreMuestra
      };
      return nuevoTipo;
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error intentando generar el nuevo tipo", "error");
    }
  };

  return (
    <main className="w-[35vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
        <div className="flex flex-col">
          <p className="mb-1">Nombre</p>
          <TextFieldComponent
            control={control}
            index={0}
            labelInput=""
            nameInput="nombreMuestra"
            valueDefault=""
            typeInput="standard"
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-col">
          <p className="mb-1">Descripcion</p>
          <TextFieldComponent
            control={control}
            index={1}
            labelInput=""
            nameInput="descripcionMuestra"
            valueDefault=""
            typeInput="standard"
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-row items-center justify-center w-full">
          <Button type="submit" disabled={!isValid} className={buttonClasses.greenButton} variant="contained">
            Guardar
          </Button>
        </div>
      </form>
      <section>
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={listaMuestras}
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
              render: (row: ICtrlPlacasTipoMuestra) => {
                return (
                  <div>
                    <span>
                      <IconButton
                        onClick={() => {
                          eliminarTipo(row.id);
                        }}>
                        <Tooltip title="Eliminar Tipo de Muestra">
                          <Delete color="error" />
                        </Tooltip>
                      </IconButton>
                    </span>
                  </div>
                );
              }
            }
          ]}
        />
      </section>
    </main>
  );
};
