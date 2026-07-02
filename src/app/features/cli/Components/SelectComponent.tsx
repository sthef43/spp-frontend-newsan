import { ArrowDropDown } from "@mui/icons-material";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, SxProps, Theme } from "@mui/material";
import React, { ElementType, ReactNode } from "react";
import { Control, Controller } from "react-hook-form";

/**
 * @param {T[]} listaObjetos => Se pasa en este prop la lista de objetos que sea desea recorrer
 * @param {string} inputLabel => Se pasa en este prop el espacio que va a ocupar el label ingresado y el espacio que va ah ser ocupado
 * @param {string | number} valueSelect => Se pasa en este prop el valor que va a ser seleccionado ya sea un string o un numero
 * @param {string | number} valueLabel => Se pasa en este prop la visualizacion del valor que va a ser seleccionado
 * @param {useState} valueSave => Se pasa en este prop el useState donde va a ser seteado el valor seleccionado
 * @param {string} nameSelect => Se pasa en este prop el name que va tener el select, para que se pueda reconocer mas facil a la hora de mandar el formulario
 *
 * @template <SelectComponent listaObjetos={listaOrganizacion} nameSelect="valorAletorio" inputLabel="Aletorio" valueLabel={(items) => items.nombre} valueSelect={(items) => items.nombre} ValueSave={setValorAletorio}
 */

interface Props<T> {
  listaObjetos: T[];
  inputLabel: string;
  valueSelect: (item: T) => string | number;
  valueLabel: (item: T) => string | JSX.Element;
  ValueSave?: (newValue: string | number) => void;
  valueKey: (newValue: number) => number;
  control: Control;
  nameSelect: string;
  varianteEstilo?: "standard" | "outlined" | "filled";
  defaultValue?: string | number;
  disabled?: boolean;
  activeRequired?: boolean;
  startAdornment?: boolean;
  iconoPerzonlizado?: ElementType;
  iconoStartAdornment?: ReactNode;
  estilosPersonalizados?: SxProps<Theme>;
  estilosSelectItems?: SxProps<Theme>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SelectComponent = <T,>({
  listaObjetos,
  inputLabel,
  valueLabel,
  valueSelect,
  ValueSave,
  nameSelect,
  valueKey,
  control,
  varianteEstilo,
  defaultValue,
  disabled,
  activeRequired,
  estilosPersonalizados,
  startAdornment,
  iconoStartAdornment,
  iconoPerzonlizado,
  estilosSelectItems
}: Props<T>) => {
  const arrayVacio = [];
  const activarEstilosPersonalizados = estilosPersonalizados ? estilosPersonalizados : {};
  const activarIconoPerzonalizado = iconoPerzonlizado ? iconoPerzonlizado : ArrowDropDown;

  return (
    <div className="w-full">
      {listaObjetos && listaObjetos ? (
        <Controller
          control={control}
          name={nameSelect}
          defaultValue={defaultValue || ""}
          rules={{ required: activeRequired ? "Este campo es requerido" : false }}
          render={({ field }) => {
            return (
              <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
                <InputLabel id="select-generico">{inputLabel}</InputLabel>
                <Select
                  sx={activarEstilosPersonalizados}
                  {...field}
                  labelId="select-generico"
                  disabled={disabled ? disabled : false}
                  id="seleccion"
                  label={`${inputLabel}`}
                  startAdornment={
                    startAdornment ? <InputAdornment position="start">{iconoStartAdornment}</InputAdornment> : null
                  }
                  IconComponent={activarIconoPerzonalizado}
                  onChange={(e) => {
                    field.onChange(e);
                    if (ValueSave) {
                      const value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                      ValueSave?.(value);
                    }
                  }}>
                  {listaObjetos.map((elementos, index) => (
                    <MenuItem sx={{ ...estilosSelectItems }} value={valueSelect(elementos)} key={valueKey(index)}>
                      {valueLabel(elementos)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }}
        />
      ) : (
        <Controller
          control={control}
          name={nameSelect}
          defaultValue={defaultValue || ""}
          render={({ field }) => (
            <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
              <InputLabel id="select-generico">{inputLabel}</InputLabel>
              <Select
                {...field}
                labelId="select-generico"
                disabled={disabled ? disabled : false}
                id="seleccion"
                label={`${inputLabel}`}
                onChange={(e) => {
                  field.onChange(e);
                  if (ValueSave) {
                    const value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                    ValueSave?.(value);
                  }
                }}>
                {arrayVacio.map((elementos, index) => (
                  <MenuItem value={valueSelect(elementos)} key={valueKey(index)}>
                    {valueLabel(elementos)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
    </div>
  );
};
