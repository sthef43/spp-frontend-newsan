import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React from "react";

export const HeaderTablero = () => {
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const dispatch = useAppDispatch();

  return (
    <header className="w-full flex h-32 justify-between items-center px-6 bg-linearGradientHaderPage">
      <figure>
        <img
          className="cursor-pointer"
          src={`${import.meta.env.BASE_URL}imagenes/newsan/LogoNewsanBlanco.svg`}
          width="120px"
          alt="logo newsan"
          onClick={() => dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState))}
        />
      </figure>
      <figure>
        <img src={`${import.meta.env.BASE_URL}icons/LOGO-NUEVO-SPP.svg`} width="150px" alt="logo newsan" />
      </figure>
    </header>
  );
};
