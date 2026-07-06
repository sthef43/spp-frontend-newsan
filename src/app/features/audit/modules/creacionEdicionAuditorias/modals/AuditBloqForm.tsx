import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, MenuItem, TextField, Icon, Fab } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IItem } from "app/models/IItem";
import { unwrapResult } from "@reduxjs/toolkit";
import { ItemSliceRequests } from "app/Middleware/reducers/ItemSlice";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { BloqSliceRequests } from "app/features/audit/slices/BloqSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IBloq } from "app/models/IBloq";
import { NivelItemSliceRequests } from "app/Middleware/reducers/NivelItemSlice";
import produce from "immer";
import { INivelItem } from "app/models/INivelItem";
import { Autocomplete } from "@mui/material";
import { IPermisos } from "app/models";
interface props {
  callbackFunction: any;
  setOpenPopup: any;
}
const funcionmapa = (item: IItem[]) => {
  //const { RolId } = useAppSelector((state) => state.appUser.data as any).permisos.rol;
  if (item?.length > 0) {
    let mapa = item?.filter((x) => x.rolId === 5);

    if (mapa) {
      mapa = mapa.map((x) => {
        return { ...x, nivelItem: null, rol: null };
      });
      return mapa;
    }
    return [];
  }
};

export const AuditBloqForm = ({ callbackFunction, setOpenPopup }: props) => {
  const classes = MaterialButtons();
  const permisos = useAppSelector((state) => state.authentification.data.permisos as IPermisos);
  const initialState: IBloq = {
    name: "",
    itemBloq: [],
    rolId: permisos?.rolId
  };
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();

  const [SelectorItem, setexistingItem] = useState([]);
  const { State: Item, setState: setItem } = useFetchApi<IItem[]>(ItemSliceRequests.getAllRequest, funcionmapa);
  const { State: ListnivelItem } = useFetchApi<INivelItem[]>(NivelItemSliceRequests.getAllRequest);
  //const [selectedItemItem, setSelectedItemItem] = useState<IItem>(null);

  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<any>({
    defaultValues: initialState
  });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "itemBloq" // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const { isDirty, isValid, errors } = formState;
  const { getConfirmation } = useConfirmationDialog();
  const addValues = (bo: boolean) => {
    const itemExample = {
      rolId: permisos.rolId,
      item: {
        name: "",
        nivelItemId: 1
      }
    };
    setexistingItem(
      produce((draft) => {
        draft.push(bo);
      })
    );
    append(itemExample);
  };
  const removeValues = (index: number) => {
    setexistingItem(
      produce((draft) => {
        draft.splice(index, 1);
      })
    );
    remove(index);
  };
  // const nuevaFunction = async () => {

  // };
  const finish = async (e) => {
    console.log(getValues());
    let fetch;
    try {
      fetch = unwrapResult(await dispatch(BloqSliceRequests.PostRequest(getValues())));
    } catch (error) {
      fetch = null;
    }

    if (fetch) {
      console.log("lo que devuelvo del fetch");

      console.log(fetch);

      callbackFunction(JSON.parse(JSON.stringify(fetch)));
      console.log("si ya llame al callback");

      setOpenPopup(false);
    }
    //
  };

  useEffect(() => {
    if (formState.errors.name) {
      console.log(formState.errors.name);
    }
  }, [formState]); //
  return (
    <div>
      <form onSubmit={handleSubmit(finish)} style={{ width: "80vw" }}>
        <div className="my-2 grid grid-cols-1 gap-4 ">
          <div className="flex justify-center items-start">
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre del Bloque"
                  label="Nombre del Bloque"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.type}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              )}
            />
          </div>
          <div className="w-full bg-newsanLighten my-2 px-2 shadow-elevation-4 text-gray-200 rounded-md mb-2 text-center text-xl font-medium">
            Items del bloque
          </div>
          {fields.map((x, index) => {
            return (
              <div className="flex items-center gap-2 animate_animated animate__fadeIn" key={x.id}>
                {SelectorItem && SelectorItem[index] ? (
                  <div className="w-full">
                    <Controller
                      name={`itemBloq.${index}.item`}
                      control={control}
                      rules={{ required: true }}
                      defaultValue={{ name: "", nivelItemId: 1 }}
                      render={({ field }) => (
                        <Autocomplete
                          id="alguno"
                          {...fields}
                          options={Item ? Item : []}
                          getOptionLabel={(items) => (typeof items === "string" ? "" : items.name)}
                          onChange={(e, newvalue: any) => {
                            if (newvalue?.id) {
                              field.onChange({
                                id: newvalue.id
                              });
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" fullWidth label="Item existentes" />
                          )}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <Controller
                        name={`itemBloq.${index}.item.name`}
                        control={control}
                        rules={{ required: true, minLength: 2 }}
                        render={({ field, fieldState }) => (
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Nombre del item"
                            label="Nombre del item"
                            error={!!fieldState?.error}
                            helperText={fieldState?.error?.type}
                            {...field}
                          />
                        )}
                      />
                    </div>

                    <Controller
                      name={`itemBloq.${index}.item.nivelItemId`}
                      control={control}
                      defaultValue={1}
                      rules={{ required: true, minLength: 2 }}
                      render={({ field }) => (
                        <TextField select label="Nivel de peligro del Item" fullWidth variant="outlined" {...field}>
                          {ListnivelItem &&
                            ListnivelItem.map((element, x) => (
                              <MenuItem key={x} value={element.id}>
                                {element.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      )}
                    />
                  </div>
                )}
                <Fab
                  color="secondary"
                  size="small"
                  onClick={() => {
                    removeValues(index);
                  }}>
                  <Icon>close</Icon>
                </Fab>
              </div>
            );
          })}
          <div className="flex py-1 justify-around border-2 rounded-md border-gray-400 text-center">
            <Button
              color="primary"
              type="button"
              className={buttonClasses.blueButton}
              onClick={() => {
                addValues(false);
              }}
              variant="contained">
              Nuevo
            </Button>

            <Button
              color="primary"
              type="button"
              className={buttonClasses.blueButton}
              onClick={() => {
                addValues(true);
              }}
              variant="contained">
              Existente
            </Button>
          </div>
          <div className="my-2 flex justify-around ">
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
