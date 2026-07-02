/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { AgregarNuevoModeloModal } from "./AgregarNuevoModeloModal";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { LayoutCrearLote } from "../Layouts/LayoutCrearLote";
import { Check } from "@mui/icons-material";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const AgregarEditarPlanProdModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //USO LO OBJETOS GUARDADOS EN LOS SLICES
  const linea = useAppSelector((state) => state.lineaProduccion.object as any);
  const estadoFormularios = useAppSelector((state) => state.optionForm.dataAll);

  //SETS PARA MODALES
  const [openModalNuevoModelo, setOpenModalNuevoModelo] = useState<boolean>(false);

  return (
    <main className="w-[80vw]">
      <section className="flex flex-row justify-between w-full gap-x-4 px-12 py-6 bg-background rounded-md">
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Planta"
          nameInput="planta"
          valueDefault={linea.plant.name}
          disabled
          typeInput="standard"
        />
        <TextFieldComponent
          control={control}
          index={1}
          labelInput="Producto"
          nameInput="producto"
          valueDefault={linea.producto.nombre}
          disabled
          typeInput="standard"
        />
        <TextFieldComponent
          control={control}
          index={2}
          labelInput="Linea"
          nameInput="linea"
          valueDefault={linea.nombre}
          disabled
          typeInput="standard"
        />
      </section>
      <section className="flex flex-col px-10 mt-5">
        {estadoFormularios && (
          <div className="relative flex flex-row justify-between">
            <figure className="border border-gray-600 absolute left-20 top-6 w-[91.5%] -z-[1]"></figure>
            <div>
              <figure className="flex flex-col items-center">
                <span
                  className={`${
                    estadoFormularios[0].estadoForm === 1 ? "bg-cyan-500" : "bg-gray-600"
                  } rounded-full px-4 py-2 text-2xl text-white`}>
                  {estadoFormularios[0].aprobeForm === true ? <Check /> : "1"}
                </span>
                <p className="mt-2">Datos del modelo</p>
              </figure>
            </div>
            <div>
              <figure className="flex flex-col items-center">
                <span
                  className={`${
                    estadoFormularios[1].estadoForm === 1 ? "bg-cyan-500" : "bg-gray-600"
                  } rounded-full px-4 py-2 text-2xl text-white`}>
                  {estadoFormularios[1].aprobeForm === true ? <Check /> : "2"}
                </span>
                <p className="mt-2">Datos OP</p>
              </figure>
            </div>
            <div>
              <figure className="flex flex-col items-center">
                <span
                  className={`${
                    estadoFormularios[2].estadoForm === 1 ? "bg-cyan-500" : "bg-gray-600"
                  } rounded-full px-4 py-2 text-2xl text-white`}>
                  {estadoFormularios[2].aprobeForm === true ? <Check /> : "3"}
                </span>
                <p className="mt-2">Extras</p>
              </figure>
            </div>
          </div>
        )}
        <LayoutCrearLote setOpenModal={setOpenModal} />
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalNuevoModelo}
        openPopup={openModalNuevoModelo}
        title="Ingrese el nuevo modelo">
        <AgregarNuevoModeloModal setOpenModal={setOpenModalNuevoModelo} openModal={openModalNuevoModelo} />
      </ModalCompoment>
    </main>
  );
};
