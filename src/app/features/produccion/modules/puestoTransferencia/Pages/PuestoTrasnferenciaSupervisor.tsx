/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { unwrapResult } from "@reduxjs/toolkit";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CLIContenedorItemsSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { TransferenciaUsuariosPermitidosSliceRequest } from "../../procesosTransferenciaUsuarios/slices/TransferenciaUsuariosPermitidosSlice";
import { sehAuditoriaSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_AuditoriaSlice";
import { ITransferenciaUsuariosBloq } from "../../procesosTransferenciaUsuarios/models/ITransferenciaUsuariosBloq";
import { TransferenciaUsuariosBloqSliceRequest } from "../../procesosTransferenciaUsuarios/slices/TransferenciaUsuariosBloqSlice";
import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";

export const PuestoTransferenciaSupervisor = () => {
  const { control, trigger, setValue } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { FetchPut } = useFetchApiMultiResults();

  const [listaContenedores, setListaContenedores] = useState<ICLIContenedorItemsRecepcionBloq[]>([]);
  const [procesoUsuario, setProcesoUsuario] = useState<ITransferenciaUsuariosBloq[]>([]);
  const [usuarioValido, setUsuarioValido] = useState<boolean>(false);
  const handleSearchOperator = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
        try {
          const siguienteInput = inputs[index + 1]?.querySelector("input") as HTMLInputElement | null;
          const response = unwrapResult(
            await dispatch(TransferenciaUsuariosPermitidosSliceRequest.GetUserByDni(inputActual.value))
          );
          if (response) {
            const personal = unwrapResult(
              await dispatch(sehAuditoriaSliceRequest.SearchPersonal(parseInt(response.dni, 10)))
            );
            if (personal) {
              const responseBloqProceso = unwrapResult(
                await dispatch(TransferenciaUsuariosBloqSliceRequest.GetAllBloqsByUserId(response.id))
              );
              const responseBloq = unwrapResult(
                await dispatch(
                  CLIContenedorItemsRecepcionBloqSliceRequest.GetAllContainerByUserWithPermissions(response.id)
                )
              );
              setListaContenedores(responseBloq);
              setProcesoUsuario(responseBloqProceso);
              setUsuarioValido(true);
              openNotificationUI("Se encontro un usuario valido", "success");
              siguienteInput.focus();
            }
          } else {
            openNotificationUI("No se encontro un usuario valido", "warning");
            inputActual.select();
            return;
          }
        } catch (error) {
          openNotificationUI("Ocurrio un error en la busqueda del usuario", "error");
        }
      }
    }
  };

  const [sectorjefe, setSectorJefe] = useState(0);
  const handleContainerPadre = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      if (inputActual.value === "RESET") {
        const anteriorInput = inputs[index - 1]?.querySelector("input") as HTMLInputElement | null;
        anteriorInput.focus();
        anteriorInput.select();
        setValue("lpnPadre", "");
        return;
      }
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
        const response = unwrapResult(
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.SearchContainerWithNotReception(inputActual.value))
        );
        if (response) {
          const responseContenedor = unwrapResult(
            await dispatch(CLIContenedorItemsSliceRequest.GetContainerByLPN(inputActual.value))
          );
          actualizarBloqueAndContenedorPadre(inputActual);
        } else {
          openNotificationUI("El codigo ingresado no tiene un estado asignado", "error");
          inputActual.select();
          return;
        }
      }
    }
  };

  const actualizarBloqueAndContenedorPadre = async (inputActual: HTMLInputElement) => {
    let clonObjetoBloque: ICLIContenedorItemsRecepcionBloq;
    let clonContenedorObjeto: ICLIContendorItems;
    let tipoRecepcion = "";

    const contenedoresIgualesPorLpn = listaContenedores.filter(
      (elementos) => elementos.cliContenedorItems.lpnGenerada === inputActual.value
    );
    try {
      for (const elementos of contenedoresIgualesPorLpn) {
        if (elementos.recepcion === "En Transito" || elementos.recepcion === "Sin Recepcion") {
          if (elementos.recepcion === "En Transito") {
            const buscarProcesoValido = procesoUsuario.find(
              (elementos) => elementos.transferenciaUsuariosProcesos.nombre == "Enviado"
            );
            tipoRecepcion = buscarProcesoValido.transferenciaUsuariosProcesos.nombre;
            clonObjetoBloque = { ...elementos, recepcion: tipoRecepcion };
            clonContenedorObjeto = { ...elementos.cliContenedorItems, permisoAgregar: "Deshabilitado" };
            break;
          } else if (elementos.recepcion === "Sin Recepcion") {
            const buscarProcesoValido = procesoUsuario.find(
              (elementos) => elementos.transferenciaUsuariosProcesos.nombre == "Recepcionado"
            );
            tipoRecepcion = buscarProcesoValido.transferenciaUsuariosProcesos.nombre;
            clonObjetoBloque = { ...elementos, recepcion: tipoRecepcion };
            clonContenedorObjeto = { ...elementos.cliContenedorItems, permisoAgregar: "Deshabilitado" };
            break;
          }
        }
        if (elementos.recepcion !== "En Transito" && elementos.recepcion !== "Sin Recepcion") {
          openNotificationUI("No se encontraron contenedores validos para las operaciones de procesos", "error");
        }
      }

      // if (clonObjetoBloque.recepcion === "En Transito") {
      //     const buscarProcesoValido = procesoUsuario.find((elementos) => elementos.transferenciaUsuariosProcesos.nombre == "Enviado")
      //     tipoRecepcion = buscarProcesoValido.transferenciaUsuariosProcesos.nombre
      //     clonObjetoBloque = { ...clonObjetoBloque, recepcion: tipoRecepcion }
      //     clonContenedorObjeto = { ...clonContenedorObjeto, permisoAgregar: "Deshabilitado" }
      //     console.log("se acepta")
      // } else {
      //     if (clonObjetoBloque.recepcion === "Sin Recepcion") {
      //         const buscarProcesoValido = procesoUsuario.find((elementos) => elementos.transferenciaUsuariosProcesos.nombre == "Recepcionado")
      //         tipoRecepcion = buscarProcesoValido.transferenciaUsuariosProcesos.nombre
      //         clonObjetoBloque = { ...clonObjetoBloque, recepcion: tipoRecepcion }
      //         clonContenedorObjeto = { ...clonContenedorObjeto, permisoAgregar: "Deshabilitado" }
      //         console.log("se acepta")
      //     } else {
      //         openNotificationUI("El contenedor no fue enviado aun", "warning")
      //         inputActual.select()
      //         return
      //     }
      // }

      if (clonObjetoBloque && clonContenedorObjeto) {
        delete clonContenedorObjeto.cliSectores;
        delete clonObjetoBloque.cliContenedorItems;
        delete clonContenedorObjeto.cliContenedorItemsRecepcionBloq;
        await dispatch(CLIContenedorItemsSliceRequest.PutRequest(clonContenedorObjeto));
        await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest(clonObjetoBloque));
        const responseBloq = unwrapResult(
          await dispatch(
            CLIContenedorItemsRecepcionBloqSliceRequest.GetAllContainerByUserWithPermissions(
              procesoUsuario[0].transferenciaUsuariosPermitidosId
            )
          )
        );
        setListaContenedores(responseBloq);
        openNotificationUI("Se recepciono el LPN padre", "success");
        inputActual.select();
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error intentando hacer la actualizacion", "error");
    }
  };

  useEffect(() => {
    TitleChanger("Puesto de Recepcion y Envio");
  }, []);

  return (
    <main className="w-full p-4">
      <section>
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Ingrese el codigo del usuario"
          nameInput="usuario"
          valueDefault=""
          onKeyUpFunction
          autoFocus
          onKeyUp={handleSearchOperator}
        />
      </section>
      <section className={`${usuarioValido ? "block" : "hidden"} py-2 px-4`}>
        <div className="bg-background mt-4 p-4 border border-slate-400 shadow-shadowBox rounded-xl">
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Ingrese un LPN Padre"
            nameInput="lpnPadre"
            valueDefault=""
            onKeyUpFunction
            onKeyUp={handleContainerPadre}
          />
          <div className="mt-4">
            <TableComponent
              IDcolumn="id"
              buscar
              dataInfo={listaContenedores}
              columns={[
                {
                  title: "LPN",
                  field: "cliContenedorItems.lpnGenerada"
                },
                {
                  title: "Modelo",
                  field: "cliContenedorItems.modelo"
                },
                {
                  title: "Numero OP",
                  field: "cliContenedorItems.numeroOp"
                },
                {
                  title: "Cantidad Placas",
                  field: "cliContenedorItems.cantidadTotalItems"
                },
                {
                  title: "Sector Actual",
                  field: ""
                },
                {
                  title: "Cantidad Bateas",
                  field: "cliContenedorItems.cantidadBateas"
                },
                {
                  title: "Estado",
                  field: "recepcion"
                }
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
};
