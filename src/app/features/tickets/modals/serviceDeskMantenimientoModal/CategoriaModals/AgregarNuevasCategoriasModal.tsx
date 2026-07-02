import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { ITicketsCategoria } from "../../../models/ITicketsCategorias";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  setListadoCategorias: (newValue: ITicketsCategoria[]) => void;
  openModal: boolean;
  plantaId: number;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const AgregarNuevasCategoriasModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  setListadoCategorias,
  plantaId
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data) => {
    const nuevaCategoria: ITicketsCategoria = {
      descripcion: data.descripcionCategoria,
      nombre: data.nombreCategoria,
      plantId: plantaId
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketsCategoriaSliceRequest.PostRequest(nuevaCategoria)));
      if (response) {
        const responseRefreshList = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId(plantaId))
        );
        if (responseRefreshList) {
          openNotificationUI("Se cargo correctamente ala categoria", "success");
          setListadoCategorias(responseRefreshList);
          setOpenModal(false);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  // const [opcionSeleccionada, setOpcionSeleccionada] = useState(null)
  // const opcionesDeCreacion: opcionesCreacion[] = [
  //     { id: 1, opcion: "Categoria multi rol" },
  //     { id: 2, opcion: "Categoria rol directo" }
  // ]
  // const [rolSeleccionado, setRolSeleccionado] = useState(null)
  // const [listaRoles, setListaRoles] = useState<IRol[]>([])
  // FetchApi<IRol[]>(RolSliceRequests.getAllRequest, null, false, openModal, setListaRoles)

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-y-4">
        <TextFieldComponent
          index={0}
          labelInput="Ingrese el nombre de la categoria"
          nameInput="nombreCategoria"
          valueDefault=""
          requiredBool
          control={control}
          errors={errors}
        />
        <TextFieldComponent
          index={0}
          labelInput="Ingrese una descripcion para la categoria"
          nameInput="descripcionCategoria"
          valueDefault=""
          requiredBool
          control={control}
          errors={errors}
        />
        {/* <SelectComponent
                    inputLabel="Seleccione una opcion"
                    listaObjetos={opcionesDeCreacion}
                    nameSelect="opcionesCreacion"
                    valueLabel={(value) => value.opcion}
                    valueSelect={(value) => value.id}
                    valueKey={(value) => value}
                    control={control}
                    ValueSave={setOpcionSeleccionada}
                />
                {opcionSeleccionada !== null && (
                    <>
                        {opcionSeleccionada === 2 && (
                            <SelectRolComponent
                                setRolSeleccionadoId={setRolSeleccionado}
                                activeControl
                                controlPadre={control}
                            />
                        )}
                        {opcionSeleccionada === 1 && (
                            <section>
                                <Stack spacing={3} sx={{ width: "100%" }}>
                                    <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={listaRoles}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={watch("roles") || []}
                                        onChange={(_, newValue) => setValue("roles", newValue)}
                                        isOptionEqualToValue={(item, value) => item.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Selecion roles para añadir"
                                            />
                                        )}
                                    />
                                    <input type="hidden" {...register("roles")} />
                                </Stack>
                            </section>
                        )}
                    </>
                )} */}
        <div className="flex flex-row justify-center gap-x-3 mt-2">
          <Button className={buttonClases.greenButton} type="submit" disabled={!isValid}>
            Guardar
          </Button>
          <Button
            className={buttonClases.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
