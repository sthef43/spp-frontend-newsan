import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILista } from "app/models/ILista";
import { unwrapResult } from "@reduxjs/toolkit";
import { ListaSliceRequests } from "app/features/audit/slices/ListaSlice";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ListaTypeForm } from "./ListaTypeForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { AuditTypeSliceRequests } from "app/features/audit/slices/AuditTypeSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AuditTableSliceRequests } from "app/features/audit/slices/AuditTableSlice";
interface props {
  callbackFunction: any;
  setpopup: any;
}
export const AuditTypeForm = ({ callbackFunction, setpopup }: props) => {
  const classes = MaterialButtons();
  const Rol = useAppSelector((state) => state.authentification.data.permisos as any).rol;
  const initialState = {
    name: "",
    sample: false,
    rolId: Rol.id,
    auditTableId: 1,
    lista: null
  };
  const dispatch = useAppDispatch();
  const [ModalOpen, setModalOpen] = useState(false);
  const { State: lista, setState: setLista } = useFetchApi<ILista[]>(ListaSliceRequests.getAllRequest);
  const { State: AuditTable } = useFetchApi<ILista[]>(AuditTableSliceRequests.getAllRequest);
  //const [selectedItemLista, setSelectedItemLista] = useState<ILista>(null);
  const { openNotificationUI } = useNotificationUI();
  const [desactivateLista, setdesactivateLista] = useState(false);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm({
    defaultValues: initialState
  });
  const watchShowLista = watch("lista");
  const callbackLista = useCallback((lista: ILista) => {
    console.log(lista);
    setdesactivateLista(true);
    setValue("lista", lista);
  }, []);
  const { isDirty, isValid, errors } = formState;
  const { getConfirmation } = useConfirmationDialog();
  const loginSubmit = async (e) => {
    console.log(getValues("lista"));

    const confirmation = await getConfirmation("Confimacion", "Esta seguro que desea crear este tipo de auditoria");
    confirmation ? finish() : openNotificationUI("No creado", "warning");
  };
  // const nuevaFunction = async () => {

  // };
  const finish = async () => {
    let fetch;
    try {
      fetch = unwrapResult(await dispatch(AuditTypeSliceRequests.PostRequest(getValues())));
    } catch (error) {
      fetch = null;
    }
    console.log(fetch);
    if (fetch) {
      callbackFunction(fetch);
      setpopup(false);
    }
  };

  useEffect(() => {
    if (formState.errors.name) {
      console.log(formState.errors.name);
    }
  }, [formState]); //
  return (
    <div>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "80vw" }}>
        <div className="my-2 grid grid-cols-1 gap-4 ">
          <div className="flex justify-between gap-10 items-start">
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 1 }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre de la lista de valores"
                  label="Nombre del tipo de auditoría"
                  error={!!errors.name}
                  helperText={errors?.name?.type}
                  {...field}
                />
              )}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Item existentes</InputLabel>
              <Controller
                name="auditTableId"
                control={control}
                rules={{ required: true }}
                defaultValue={1}
                render={({ field }) => (
                  <Select {...field} variant="standard">
                    {AuditTable &&
                      AuditTable.map((x, index2) => (
                        <MenuItem key={index2} value={x.id}>
                          <div className=" w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>{x.name}</div>
                            <div className="md:col-span-2">{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>
          <div className="md:flex md:justify-around  text-center">
            <div className="w-full text-textColor text-xl">
              Si los valores que deséa no son los que se encuentran debajo puede crear una nueva lista de valores
            </div>
            <Button
              className={classes.purpleButton}
              type="button"
              onClick={() => {
                setModalOpen(true);
              }}
              variant="contained">
              Agregar
            </Button>
          </div>
          {!desactivateLista && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Lista de Valores</InputLabel>
              <Controller
                name="lista"
                control={control}
                defaultValue=""
                rules={{ required: true, minLength: 2 }}
                render={({ field }) => (
                  <Select {...field} variant="standard">
                    {lista &&
                      lista.map((element, x) => (
                        <MenuItem key={x} value={element as any}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div>{`${element.name}`}</div>
                            <div>
                              {" "}
                              {"       Valores: ("}
                              {element.listaValores?.map((y) => ` ${y.valor?.name} `)}
                              {")     "}
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          )}
          <div className="p-2 shadow-elevation-4">
            <div className=" grid grid-cols-3 gap-4 w-full text-lg font-medium">
              <div>Valor</div>
              <div>Descripcion</div>
              {/* <div>Envío por email</div> */}
              <div>Item good</div>
            </div>
            {watchShowLista &&
              watchShowLista?.listaValores?.map((element, x) => (
                <div key={x} className="grid grid-cols-3 gap-4 w-full text-lg">
                  <div>{`${element?.valor?.name}`}</div>
                  <div>{`${element?.valor?.descripcion}`}</div>
                  {/* <div>
                    {element?.valor?.flagMail ? (
                      <span className="text-green-600">SI</span>
                    ) : (
                      <span className="text-red-600">NO</span>
                    )}
                  </div> */}
                  <div>
                    {element?.valor?.flagCriterio ? (
                      <span className="text-green-600">SI</span>
                    ) : (
                      <span className="text-red-600">NO</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="my-2 flex justify-around ">
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
      <ModalCompoment title="Creacion de lista de valores" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <ListaTypeForm callbackFunction={callbackLista} setOpenPopup={setModalOpen} />
      </ModalCompoment>
    </div>
  );
};
