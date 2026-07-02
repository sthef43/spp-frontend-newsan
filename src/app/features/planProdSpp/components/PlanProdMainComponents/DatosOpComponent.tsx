/* eslint-disable unused-imports/no-unused-vars */
import React, { FC, useEffect } from "react";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OptionFormSlice } from "../../reducers/OptionFormReducers";
import { IPlanProdSpp } from "../../models/IPlanProdSpp";

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
}

export const DatosOpComponent: FC<Props> = ({ controlFather, errosFather }) => {
  const dispatch = useAppDispatch();

  const estadoFormularios = useAppSelector((state) => state.optionForm.dataAll);
  const planProduccionEdit = useAppSelector((state) => state.planProdSpp.object as IPlanProdSpp);
  const edicionState = useAppSelector((state) => state.optionForm.estadoEdicion);

  //EJECUTO ESTE UseEffect PARA QUE CUANDO EL FORMULARIO SE MONTE EN EL LAYOUT ME CAMBIE EL ESTADO DEL FORMULARIO A EN PROGRESO
  useEffect(() => {
    const aprobarFormulario = estadoFormularios.map((elementos) => {
      const nuevoObjeto = { ...elementos };
      if (nuevoObjeto.idForm == 2) {
        nuevoObjeto.estadoForm = 1;
      }
      return nuevoObjeto;
    });
    dispatch(OptionFormSlice.actions.setNewPlanAll(aprobarFormulario));
  }, []);

  return (
    <>
      {estadoFormularios && (
        <main className="w-full">
          <form className="flex w-full flex-row justify-evenly gap-x-52 px-3">
            <TextFieldComponent
              control={controlFather}
              index={0}
              labelInput="OP Montaje"
              nameInput="opMontaje"
              valueDefault={edicionState ? planProduccionEdit.opMontaje : ""}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={1}
              labelInput="OP Main"
              nameInput="opMain"
              valueDefault={edicionState ? planProduccionEdit.opImMain : ""}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={2}
              labelInput="OP Display"
              nameInput="opDisplay"
              valueDefault={edicionState ? planProduccionEdit.opImDisplay : ""}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={2}
              labelInput="OP Sub"
              nameInput="opSub"
              valueDefault={edicionState ? planProduccionEdit.opSub : ""}
              typeInput="standard"
            />
          </form>
        </main>
      )}
    </>
  );
};
