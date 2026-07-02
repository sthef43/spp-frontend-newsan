import { useAppSelector } from "app/core/store/store";
import React from "react";
import "./Loader.css";
import logoCargaSpp from "../../../../assets/animated/Loading_SPP.json";
import { FestividadesComponent } from "../ui/FestividadesComponent";

export const LoaderComponent = () => {
  const estado = useAppSelector((state) => state.loadingUI);
  return (
    <div>
      {estado.state && (
        <div className="overlay-loading-newsan">
          <div className="newsan-loading-container">
            <FestividadesComponent active gifOrImage={logoCargaSpp} width={500} height={400} />
          </div>
          {/* <div className="newsan-loading-container">
            <div className="newsan-loading"></div>
            <div className="newsan-loading-logo">
              <img src={`${import.meta.env.BASE_URL}logoNS.png`} className="w-full" />
            </div>
            <div className="newsan-loading-message more-mensaje">
              <span className="text-gray-900 w-full">{estado.Mensaje} </span>
              <!-- mode = 'determinate' , 'indeterminate' , 'buffer' , 'query' --> 
          <mat-progress-bar mode="query" color="accent"></mat-progress-bar>
          
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};
