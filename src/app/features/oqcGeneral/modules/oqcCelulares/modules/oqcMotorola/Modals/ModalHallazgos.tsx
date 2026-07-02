/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ContextApp } from "../../../Context/Context";
import { Controller, useForm } from "react-hook-form";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const ModalHallazgos: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { openNotificationUI } = useNotificationUI();
  const [muestasCompletasContador, setMuestrasCompletasContador] = useState(0);
  const contextoGlobal = useContext(ContextApp);
  const {
    handleSubmit,
    control,
    trigger,
    setValue,
    reset,
    formState: { isValid, errors }
  } = useForm({
    mode: "onChange"
  });

  //Funcion que segun el select que se ponga en NG, muestre el modal con la lista de los hallazgos filtrados segun el nombre
  const [hallazgosFiltrados, setHallazgosFiltrados] = useState<IOQCBloqueHallazgo[]>([]);
  const [bloquesHallazgosFiltrados, setBloquesHallazgosFiltrados] = useState<IOQCBloqueHallazgo[]>([]);
  const verHallazgos = () => {
    generarHallazgos();
    const bloquesHallazgosNuevos = contextoGlobal.bloquesGroup.flatMap(
      (elementos) => elementos.oqcBloque.oqcBloqueHallazgo
    );
    setBloquesHallazgosFiltrados(bloquesHallazgosNuevos);
    console.log(contextoGlobal.obaTest);
    console.log(contextoGlobal.estetica);
    console.log(contextoGlobal.packing);
    if (contextoGlobal.obaTest === "NO GOOD") {
      //Cuando este en la base de datos de produccion usar func en el include
      const buscarFuncional = contextoGlobal.bloquesGroup.filter((elementos) =>
        elementos.oqcBloque.nombre.toLocaleLowerCase().includes("func")
      );
      buscarFuncional.forEach((elementos) => {
        setHallazgosFiltrados(elementos.oqcBloque.oqcBloqueHallazgo);
      });
      setOpenModal(true);
    }
    if (contextoGlobal.estetica === "NO GOOD") {
      //Cuando este en la base de datos de produccion usar este en el include
      const buscarFuncional = contextoGlobal.bloquesGroup.filter((elementos) =>
        elementos.oqcBloque.nombre.toLowerCase().includes("est")
      );
      buscarFuncional.forEach((elementos) => {
        setHallazgosFiltrados(elementos.oqcBloque.oqcBloqueHallazgo);
      });
      setOpenModal(true);
    }
    if (contextoGlobal.packing === "NO GOOD") {
      //Cuando este en la base de datos de produccion usar pack en el include
      const buscarFuncional = contextoGlobal.bloquesGroup.filter((elementos) =>
        elementos.oqcBloque.nombre.toLowerCase().includes("pack")
      );
      buscarFuncional.forEach((elementos) => {
        setHallazgosFiltrados(elementos.oqcBloque.oqcBloqueHallazgo);
      });
      setOpenModal(true);
    }
  };

  //Funcion que muestra el ciruculo de color segun la criticidad
  function mostrarColor(color: string) {
    switch (color) {
      case "Rojo":
        return <span className="bg-red-500 rounded-full w-4 h-4"></span>;
      case "Amarillo":
        return <span className="bg-yellow-500 rounded-full w-4 h-4"></span>;
      case "Verde":
        return <span className="bg-green-500 rounded-full w-4 h-4"></span>;
    }
  }

  const [idBloques, setIdBloques] = useState([]);
  const bloquesHallazgos = () => {
    const nombreHallazgos = [];
    bloquesHallazgosFiltrados.forEach((elemetos) => {
      nombreHallazgos.push(elemetos.id);
    });
    console.log(nombreHallazgos);
    const idsEncontrados = contextoGlobal.bloquesGroup
      .map((elemento) => elemento.oqcBloque.oqcBloqueHallazgo.filter((id) => nombreHallazgos.includes(id.id)))
      .flat();
    idsEncontrados.forEach((elementos) => {
      console.log(elementos);
      setIdBloques((prev) => prev.concat(elementos.id));
    });
  };

  //Funcion que cierra el modal y setea lista en un array vacio y el contador en 0
  function cerrarModal() {
    setOpenModal(false);
    setValorBotonPrecionado([]);
    setMuestrasCompletasContador(0);
    setHallazgosFiltrados([]);
    setValorBotonPrecionado(hallazgosFiltrados.map(() => null));
    setIdBloques([]);
    reset();
  }

  //Funcion que segun el boton precionado se cambia de GOOD a NG,
  //Aumenta y decrementa el contador segun el boton precionado,
  //Espera la validacion manual de cada boton con el trigger
  const [valorBotonPrecionado, setValorBotonPrecionado] = useState([]);
  const cambiarBoton = async (idHallazgo: number, valorBoton: string) => {
    const nuevoEstadosBotones = [...valorBotonPrecionado];
    nuevoEstadosBotones[idHallazgo] = valorBoton;
    setValorBotonPrecionado(nuevoEstadosBotones);

    if (valorBoton === "GOOD") {
      if (hallazgosFiltrados.length > muestasCompletasContador) {
        setMuestrasCompletasContador((prev) => prev + 1);
      }
    } else if (valorBoton === "NG") {
      if (hallazgosFiltrados.length < muestasCompletasContador) {
        setMuestrasCompletasContador((prev) => prev - 1);
        await trigger(`${idHallazgo}`);
      }
    }
  };

  //Funcion que cuando se aprete el checkbox marca todo como NG y setea el contador en 0
  const marcarTodosComoNg = (evento) => {
    const checkActivado = evento.target.checked;
    if (checkActivado) {
      setValorBotonPrecionado(hallazgosFiltrados.map(() => "NG"));
      setMuestrasCompletasContador(0);
    } else {
      setValorBotonPrecionado(hallazgosFiltrados.map(() => null));
      setMuestrasCompletasContador(hallazgosFiltrados.length);
    }
  };

  //Funcion que manda los datos ingresados
  const sendForm2 = (data) => {
    const gruposGenerados = generarHallazgos();

    gruposGenerados.forEach((elementos) => {
      const key = String(elementos.oqcBloqueHallazgoId);
      const comentario = data[key] || "";
      if (key == elementos.oqcBloqueHallazgoId) {
        elementos.comentario = comentario;
        elementos.state = comentario == "" ? true : false;
      }
    });

    contextoGlobal.setComentariosNg(gruposGenerados);
    openNotificationUI("Email enviado", "success");
    cerrarModal();
  };

  const generarHallazgos = () => {
    const generados: any[] = [];
    bloquesHallazgosFiltrados.forEach((elementos) => {
      generados.push({
        comentario: "",
        state: true,
        oqcBloqueHallazgo: elementos,
        oqcBloqueHallazgoId: elementos.id
      });
    });
    if (generados.length > 0) {
      return generados;
    }
  };

  //Setea la lista de hallazgos cuando cambie de valor el menu de datos zampling
  useEffect(() => {
    if (contextoGlobal.datosZampling || contextoGlobal.continuarPallet) {
      setHallazgosFiltrados([]);
    }
  }, [contextoGlobal.datosZampling, contextoGlobal.continuarPallet]);

  useEffect(() => {
    if (openModal) {
      verHallazgos();
      bloquesHallazgos();
    }
  }, [openModal]);

  //Realiza una validacion de los botones cuando cambie alguno de los valores de los botones
  useEffect(() => {
    hallazgosFiltrados.forEach((elementos) => {
      trigger(`${elementos.id}`);
    });
  }, [valorBotonPrecionado]);

  return (
    //En este modal lo que se hace es realizar el oqc a el codigo de serie que se esta ingresando
    <main className="w-[75vw] h-[70vh]">
      {hallazgosFiltrados.length > 0 && (
        <form onSubmit={handleSubmit(sendForm2)} className="rounded-md pt-2 px-2">
          <div className="flex justify-between">
            <p>
              1. Muestras completas {muestasCompletasContador}/{hallazgosFiltrados.length}
            </p>
            <div className="flex items-center">
              <label className="mr-4 text-blue-800 font-semibold" id="marcarTodoNG">
                Marcar todo como NG
              </label>
              <input onChange={marcarTodosComoNg} type="checkbox" name="marcarTodoNG" id="marcarTodoNG" />
            </div>
          </div>
          {hallazgosFiltrados.map((elementos, index) => (
            <div key={index} className="border border-gray-300 rounded-md w-full flex flex-col my-3 pt-1 pb-3 px-3">
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-x-2">
                    <p className="text-base font-semibold text-textColor">{elementos.oqcHallazgo?.nombre}, Estado</p>
                    {mostrarColor(elementos.oqcHallazgo?.oqcPonderacion?.color)}
                  </div>
                  <p className="text-sm text-blue-800 italic">Si el hallazgo es NG el comentario es obligatorio</p>
                </div>
                <div className="flex flex-row gap-x-4">
                  <button
                    value="true"
                    type="button"
                    onClick={() => cambiarBoton(index, "GOOD")}
                    className={`${valorBotonPrecionado[index] === "GOOD" ? "bg-green-500" : "bg-gray-300"}
                                "bg-red-500":"bg-gray-300"} text-white font-semibold w-14 h-8 rounded-md shadow-lg shadow-[0_3px_3px_0_rgb(138,138,138,0.60)]`}>
                    GOOD
                  </button>
                  <button
                    value="false"
                    type="button"
                    onClick={() => cambiarBoton(index, "NG")}
                    className={`${valorBotonPrecionado[index] === "NG" ? "bg-red-500" : "bg-gray-300"}
                                "bg-red-500":"bg-gray-300"} text-white font-semibold w-14 h-8 rounded-md shadow-lg shadow-[0_3px_3px_0_rgb(138,138,138,0.60)]`}>
                    NG
                  </button>
                </div>
              </div>
              <Controller
                name={`${elementos.id}`}
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    if (valorBotonPrecionado[index] === "GOOD") {
                      return true;
                    } else if (valorBotonPrecionado[index] === "NG" && value === "") {
                      return "Debe ingresar un comentario";
                    }
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="border text-black border-gray-300 rounded-md mt-2 h-10 px-4 focus:outline-none"
                    placeholder="Comentario:"
                  />
                )}
              />
              {errors[`hallazgoComentario-${elementos.oqcHallazgo?.nombre}`] && (
                <p className="text-red-500 mt-3">
                  {errors[`hallazgoComentario-${elementos.oqcHallazgo?.nombre}`]?.message}
                </p>
              )}
            </div>
          ))}
          <div className="w-full flex flex-row items-center gap-x-3 justify-center">
            <button
              disabled={!isValid}
              type="submit"
              className={`${
                !isValid ? "bg-gray-300" : "bg-blue-500"
              } shadow-shadowBox cursor-pointer text-center w-40 h-10 my-4 rounded-md text-white font-semibold`}>
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
              }}
              className="shadow-shadowBox cursor-pointer text-center w-40 h-10 my-4 rounded-md text-white font-semibold bg-red-500">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
