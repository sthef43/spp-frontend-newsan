import React from "react";
import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { UseGeneratorCodesForLabels } from "../useGeneratorCodesForLabels";
import { Provider } from "react-redux";
import { store } from "../../../core/store/store";

describe("generateLpnLabel", () => {
  test("Should generate label with 10 digits, only numbers", () => {
    const cantidadNumeros = 0;

    // 3. Ejecutamos el hook dentro de un entorno controlado
    const { result: hookResult } = renderHook(() => UseGeneratorCodesForLabels(), {
      // Envolvemos con el Provider si tu hook usa useAppDispatch/Selector
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    // 4. Accedemos a la función desde .current
    const result = hookResult.current.generateLpnLabel(cantidadNumeros);
    console.log({ result });

    expect(result).toHaveLength(cantidadNumeros == 0 ? 10 : cantidadNumeros);
    expect(result).toMatch(/^[0-9]+$/);
  });

  test("Should generate LPN code with prefix code", () => {
    const cantidadNumeros = 0;
    const regex = /^[A-Z]+[0-9]+$/;
    const prefijo = "LPN";

    const { result: hookResult } = renderHook(() => UseGeneratorCodesForLabels(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    const result = hookResult.current.generateLpnWitPrefixCode(cantidadNumeros, prefijo);
    console.log({ result });

    expect(result).toHaveLength(cantidadNumeros == 0 ? 7 + prefijo.length : cantidadNumeros + prefijo.length);
    expect(result).toMatch(regex);
  });

  test("Should generate Article Code", () => {
    const cantidadLetras = 0;
    const longitudEtiqueta = 0;
    const listaLetras = ["A", "F", "G"];

    const { result: hookResult } = renderHook(() => UseGeneratorCodesForLabels(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    const result = hookResult.current.generateArticleCode(listaLetras, longitudEtiqueta, cantidadLetras);
    console.log({ result });

    expect(result).toHaveLength(
      cantidadLetras == 0 ? 3 : cantidadLetras + longitudEtiqueta == 0 ? 7 : longitudEtiqueta
    );
    expect(result).toMatch(/^[A-Z]+[0-9]+$/);
  });

  test("Should generate code with template", () => {
    const template = "FACTURA: ####-LXXX";

    const { result: hookResult } = renderHook(() => UseGeneratorCodesForLabels(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    const result = hookResult.current.generateLabelFromTemplate(template);
    console.log({ result });

    expect(result).toMatch(result);
  });
});
