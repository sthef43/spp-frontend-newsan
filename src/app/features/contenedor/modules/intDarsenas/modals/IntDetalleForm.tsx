import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { IIntDetalle } from "app/models/IIntDetalle";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";

interface props {
  setOpenPopup: any;
  listDetalles?: IIntDetalle[] | null; //Lista Completa Arreglo de objetos
  editStateDetalle?: IIntDetalle; //Arreglo a Modificar
  refresh?: any; //Impacta sobre lista completa
  estaEditandoDetalle: any; //Si esta editando o no
}

export const IntDetalleForm = ({
  setOpenPopup,
  listDetalles,
  editStateDetalle,
  refresh,
  estaEditandoDetalle
}: props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  //Form Detalle
  interface initialState {
    intRemitoId: number;
    cajas: string;
    codigo: string;
    anexo: string;
    cantidad: number;
    cont: number;
    descripcion: string;
    numero: number;
  }
  const initialStateVar = {
    intRemitoId: 0,
    cantidad: 0,
    cont: 0,
    codigo: "-",
    descripcion: "",
    cajas: "-",
    anexo: "-",
    numero: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditandoDetalle ? editStateDetalle : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Agrego o modifico
  const loginSubmit = async (e) => {
    if (e.descripcion == "") {
      openNotificationUI("Ingrese Descripción", "error");
      return;
    }
    if (parseInt(e.cantidad) <= 0) {
      openNotificationUI("Ingrese Cantidad Válida", "error");
      return;
    }
    if (estaEditandoDetalle) {
      //Editando
      const updatedList = listDetalles.map(
        (obj) =>
          obj.numero === e.numero
            ? {
                ...obj,
                cajas: e.cajas,
                cantidad: parseInt(e.cantidad),
                codigo: e.codigo,
                anexo: e.anexo,
                cont: parseInt(e.cont),
                valor: e.valor,
                descripcion: e.descripcion
              }
            : obj // Si no cumple la condición, simplemente devuelve el objeto original
      );
      refresh(updatedList);
      openNotificationUI("Detalle Modificado", "success");
    } else {
      //Agregar
      const objeto = {
        ...e,
        numero: listDetalles.length + 1,
        cantidad: parseInt(e.cantidad),
        cont: parseInt(e.cont)
      };
      listDetalles.push(objeto);
      refresh(listDetalles);
      openNotificationUI("Detalle Agregado", "success");
    }
    setOpenPopup(false);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px"
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", padding: "5px" }}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    margin: "10px",
                    alignContent: "center"
                  }}>
                  Cajas
                </div>
                <div style={{ flex: 3 }}>
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="cajas"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="text" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", padding: "5px" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      margin: "10px",
                      alignContent: "center"
                    }}>
                    Cantidad
                  </div>
                  <div style={{ flex: 3 }}>
                    <div className="rounded-lg shadow-elevation-4 bg-background">
                      <Controller
                        name="cantidad"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth error={!!error}>
                            <TextField fullWidth type="number" {...field} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", padding: "5px" }}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    margin: "10px",
                    alignContent: "center"
                  }}>
                  Código
                </div>
                <div style={{ flex: 3 }}>
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="codigo"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="text" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", padding: "5px" }}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    margin: "10px",
                    alignContent: "center"
                  }}>
                  Anexo II
                </div>
                <div style={{ flex: 3 }}>
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="anexo"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="text" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", padding: "5px" }}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    margin: "10px",
                    alignContent: "center"
                  }}>
                  Cont.
                </div>
                <div style={{ flex: 3 }}>
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="cont"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="number" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripcion y Agregar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "20px"
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", padding: "5px" }}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    margin: "10px",
                    alignContent: "center"
                  }}>
                  Descripción
                </div>
                <div style={{ flex: 6 }}>
                  <div className="rounded-lg shadow-elevation-4 bg-background">
                    <Controller
                      name="descripcion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                          <TextField fullWidth type="text" {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center", alignContent: "center" }}>
                  <Button
                    className={classes.greenButton}
                    type="submit"
                    variant="contained"
                    disabled={!isDirty && !isValid}>
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
