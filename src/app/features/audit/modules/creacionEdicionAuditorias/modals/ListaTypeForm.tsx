import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, TextField, FormControlLabel } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
interface props {
  callbackFunction: any;
  setOpenPopup: any;
}
export const ListaTypeForm = ({ callbackFunction, setOpenPopup }: props) => {
  const classes = MaterialButtons();
  const initialState = {
    name: "",
    listaValores: [
      // {
      //     valor: {
      //         descripcion: "",
      //         flagCriterio: false,
      //         flagMail: false,
      //         name: ""
      //     }
      // },
      // {
      //     valor: {
      //         descripcion: "",
      //         flagCriterio: false,
      //         flagMail: false,
      //         name: ""
      //     }
      // }
      // {
      //     listaValor: {
      //         valor: {
      //             descripcion: "",
      //             flagCriterio: false,
      //             flagMail: false,
      //             name: ""
      //         }
      //     }
      // },
      // {
      //     listaValor: {
      //         valor: {
      //             descripcion: "",
      //             flagCriterio: false,
      //             flagMail: false,
      //             name: ""
      //         }
      //     }
      // },
      // {
      //     listaValor: {
      //         valor: {
      //             descripcion: "",
      //             flagCriterio: false,
      //             flagMail: false,
      //             name: ""
      //         }
      //     }
      // },
      // {
      //     listaValor: {
      //         valor: {
      //             descripcion: "",
      //             flagCriterio: false,
      //             flagMail: false,
      //             name: ""
      //         }
      //     }
      // }
    ],
    descripcion: ""
  };
  const dispatch = useAppDispatch();
  const [cantidad, setCantidad] = useState<number>(0);
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm({
    defaultValues: initialState
  });
  const addValores = () => {
    const listaValoresVar: any[] = [];
    for (let x = 0; x < cantidad; x++) {
      listaValoresVar[x] = {
        valor: {
          descripcion: "",
          flagCriterio: false,
          flagMail: false,
          name: ""
        }
      };
    }
    console.log("llege", cantidad);
    setValue("listaValores", listaValoresVar);
  };
  const ExecCallbackFunction = (e) => {
    callbackFunction(e);
  };
  const watchShowListaValores = watch("listaValores");
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const loginSubmit = (e) => {
    ExecCallbackFunction(e);
    setOpenPopup(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "80vw", height: "60vh" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="my-2 grid grid-cols-2 gap-10" style={{ flex: "1 1 10%" }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre de la Lista de valores"
                  label="Nombre de la Lista de valores"
                  {...field}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
            <Controller
              name="descripcion"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="descripcion"
                  label="descripcion"
                  {...field}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </div>
          <div className="my-1 py-2 grid grid-cols-1 gap-4 overflow-auto auto-rows-min" style={{ flex: "1 1 80%" }}>
            {watchShowListaValores?.length == 0 && (
              <div className="grid grid-cols-4 gap-2 md:gap-10">
                <TextField
                  fullWidth
                  variant="outlined"
                  className="col-span-3"
                  placeholder="Cantidad de valores"
                  label="Cantidad de valores"
                  defaultValue={0}
                  type="number"
                  onChange={(event) => {
                    setCantidad(Number(event.target.value));
                  }}
                />
                <Button
                  className={classes.purpleButton}
                  type="button"
                  variant="contained"
                  disabled={cantidad < 1}
                  onClick={() => {
                    addValores();
                  }}>
                  Agregar valores
                </Button>
              </div>
            )}
            {watchShowListaValores?.length > 0 &&
              watchShowListaValores.map((listaVal, key) => {
                return (
                  <div className="grid md:grid-cols-5 grid-cols-3 gap-4  animate__animated animate__fadeIn" key={key}>
                    <Controller
                      name={`listaValores.${key}.valor.name`}
                      control={control}
                      defaultValue={""}
                      rules={{ required: true, minLength: 1 }}
                      render={({ field }) => (
                        <TextField
                          className="md:col-span-2"
                          fullWidth
                          variant="outlined"
                          placeholder="Valor"
                          label="Valor"
                          error={!!errors.listaValores?.[key]}
                          //helperText={errors?.listaValores?.[key]?.valor?.name?.type}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name={`listaValores.${key}.valor.descripcion`}
                      control={control}
                      defaultValue={""}
                      render={({ field }) => (
                        <TextField
                          className="md:col-span-2"
                          variant="outlined"
                          fullWidth
                          placeholder="Descripcíon"
                          label="Descripcíon"
                          {...field}
                        />
                      )}
                    />
                    <FormControlLabel
                      label="Criterio"
                      control={
                        <Controller
                          name={`listaValores.${key}.valor.flagCriterio`}
                          control={control}
                          defaultValue={false}
                          render={({ field }) => <Checkbox {...field} />}
                        />
                      }
                    />
                    <div className="hidden">
                      <FormControlLabel
                        label="Mail"
                        control={
                          <Controller
                            name={`listaValores.${key}.valor.flagMail`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => <Checkbox {...field} />}
                          />
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
