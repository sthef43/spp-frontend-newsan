/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthResponse } from "app/models/IAuthResponse";
import jwt_decode from "jwt-decode";

export let AUTH_TOKEN = "";

export const SetTokenUserInformation = (information: string) => {
  AUTH_TOKEN = information;
  localStorage.setItem("Token", AUTH_TOKEN);
};

export const SetInfoUser = (info: IAuthResponse) => {
  localStorage.setItem("InfoUser", JSON.stringify({ username: info.username, id: info.id, dni: info.dni }));
};

export const GetInfoUser = () => {
  return JSON.parse(localStorage.getItem("InfoUser"));
};

export const LogOutUser = () => {
  localStorage.removeItem("Token");
  localStorage.removeItem("InfoUser");
};

/**
 * Verifica si el token JWT ha expirado
 * @param token - Token JWT a verificar
 * @returns true si el token ha expirado, false si aún es válido
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded: any = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Convertir a segundos

    // Si el token tiene campo 'exp', verificar expiración
    if (decoded.exp) {
      return decoded.exp < currentTime;
    }

    // Si no tiene 'exp', asumir que no expira
    return false;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return true; // Si hay error, asumir que expiró
  }
};

export const TokenUserInfomation = () => {
  // Verificamos si estamos en el navegador
  if (typeof window !== "undefined" && window.localStorage) {
    if (AUTH_TOKEN?.length < 2) {
      AUTH_TOKEN = localStorage.getItem("Token") || "";
    }
  }

  // Verificar si el token ha expirado
  if (AUTH_TOKEN && isTokenExpired(AUTH_TOKEN)) {
    console.warn("Token expirado, limpiando sesión...");
    LogOutUser();
    AUTH_TOKEN = "";
    return { AUTH_TOKEN: "" };
  }

  return { AUTH_TOKEN };
};
