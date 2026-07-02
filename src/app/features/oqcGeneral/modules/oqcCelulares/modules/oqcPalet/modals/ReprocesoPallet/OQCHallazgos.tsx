import { Button } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../../../shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  hallazgos: IOQCBloqueHallazgo[];
  cancelarOpciones: () => void;
  hallazgosEquipo: (newValue: any) => void;
}

export const OQCHallazgos: React.FC<Props> = ({
  setOpenModal,
  openModal,
  hallazgos,
  cancelarOpciones,
  hallazgosEquipo
}) => {
  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors, isValid }
  } = useForm();
  const paletSeleccionado = useAppSelector((state) => state.oqcPalet.object);

  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();

  const [muestasCompletasContador, setMuestrasCompletasContador] = useState(0);
  const [valorBotonPrecionado, setValorBotonPrecionado] = useState([]);

  const [hallazgosId, setHallazgosId] = useState([]);

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

  const buscarIdsHallazgos = () => {
    const idHallazgos = [];
    hallazgos.forEach((elementos) => {
      idHallazgos.push(elementos.id);
    });
    const idBuscados = paletSeleccionado.oqcDesignada.oqc.oqcBloqueGroup
      .map((elementos) => elementos.oqcBloque.oqcBloqueHallazgo.filter((id) => idHallazgos.includes(id.id)))
      .flat();
    idBuscados.forEach((elementos) => {
      setHallazgosId((prev) => prev.concat(elementos.id));
    });
  };

  const cambiarBoton = async (idHallazgo: number, valorBoton: string) => {
    const nuevoEstadosBotones = [...valorBotonPrecionado];
    nuevoEstadosBotones[idHallazgo] = valorBoton;
    setValorBotonPrecionado(nuevoEstadosBotones);

    if (valorBoton === "GOOD") {
      if (hallazgos.length > muestasCompletasContador) {
        setMuestrasCompletasContador((prev) => prev + 1);
      }
    } else if (valorBoton === "NG") {
      if (hallazgos.length < muestasCompletasContador) {
        setMuestrasCompletasContador((prev) => prev - 1);
        await trigger(`hallazgoComentario-${idHallazgo}`);
      }
    }
  };

  const marcarTodosComoNg = (evento) => {
    const checkActivado = evento.target.checked;
    if (checkActivado) {
      setValorBotonPrecionado(hallazgos.map(() => "NG"));
      setMuestrasCompletasContador(0);
    } else {
      setValorBotonPrecionado(hallazgos.map(() => null));
      setMuestrasCompletasContador(hallazgos.length);
    }
  };

  const sendForm2 = (data) => {
    console.log(data);
    const datosInputs: string[] = Object.values(data);
    datosInputs.forEach((elementos, index) => {
      const hallazgo = hallazgos[index];
      const idBloq = hallazgosId[index];
      if (hallazgo) {
        hallazgosEquipo((prev) => [
          ...prev,
          {
            comentario: elementos,
            state: elementos == "" ? true : false,
            oqcBloqueHallazgo: hallazgo,
            oqcBloqueHallazgoId: idBloq
          }
        ]);
      }
    });
    openNotificationUI("Email enviado", "success");
    setOpenModal(false);
  };

  useEffect(() => {
    if (openModal) {
      buscarIdsHallazgos();
    }
  }, [openModal]);

  //Realiza una validacion de los botones cuando cambie alguno de los valores de los botones
  useEffect(() => {
    hallazgos.forEach((elementos) => {
      trigger(`hallazgoComentario-${elementos.oqcHallazgo?.nombre}`);
    });
  }, [valorBotonPrecionado]);

  return (
    <main className="w-[80vw]">
      <form onSubmit={handleSubmit(sendForm2)}>
        <div className="flex justify-between">
          <p>
            1. Muestras completas {muestasCompletasContador}/{hallazgos.length}
          </p>
          <div className="flex items-center">
            <label className="mr-4 text-blue-800 font-semibold" id="marcarTodoNG">
              Marcar todo como NG
            </label>
            <input onChange={marcarTodosComoNg} type="checkbox" name="marcarTodoNG" id="marcarTodoNG" />
          </div>
        </div>
        {hallazgos.map((elementos, index) => (
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
              name={`hallazgoComentario-${elementos.oqcHallazgo?.nombre}`}
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
          <section className="flex justify-center gap-x-4 mt-4">
            <div>
              <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
                Agregar
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => {
                  cancelarOpciones();
                }}
                className={buttonClases.redButton}>
                Cancelar
              </Button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
};
