import { useAppDispatch } from "app/core/store/store";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export const IngresoEgresoMaterialesPage = (props: any) => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  useEffect(() => {
    TitleChanger(`${props.title} de materiales`);
  }, []);
  const initialState = {
    material: "",
    op: "",
    modelo: "",
    cantidad: 0
  };
  const [state, setstate] = useState(initialState);
  const [codigo, setCodigo] = useState("");
  const [codigoFinded, setcodigoFinded] = useState("191100110");

  return (
    <div>
      <TitleUIComponent title={`${props.title} de materiales`} />
      <div className="mx-5">
        <div className="text-center">
          <TextField
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Codigo"
            label="Codigo"
            variant="outlined"
            className="w-1/2"
          />
        </div>
        {codigoFinded && (
          <div>
            <div className="grid grid-cols-4 my-5 shadow-elevation-4 bg-secondaryNew  p-4 rounded-lg">
              <div className="grid grid-cols-1 justify-center gap-4 text-xl">
                {/* <TextField value={state.material} fullWidth placeholder="Material" label="Material" variant="outlined" /> */}
                <div>Material</div>
                <div>OP</div>
                <div>Modelo</div>
                <div>Cantidad</div>
                {/* <TextField value={state.op} fullWidth placeholder="OP" label="OP" variant="outlined" />
            <TextField value={state.modelo} fullWidth placeholder="Modelo" label="Modelo" variant="outlined" />
            <TextField
              value={state.cantidad}
              fullWidth
              placeholder="Cantidad"
              label="Cantidad"
              type="number"
              variant="outlined"
            /> */}
              </div>
              <div className="grid grid-cols-1 justify-center gap-4 text-xl">
                <div>Tornillos</div>
                <div>OP-185581</div>
                <div>Aire</div>
                <div>500</div>
              </div>
              <div className="col-span-2 items-center flex text-2xl justify-center">
                <div className="flex text-2xl justify-center items-center flex-col overflow-hidden bg-blue-600 rounded-lg border-2 border-blue-600">
                  <div className=" p-2 text-gray-200">Material</div>
                  <div className="">
                    <img
                      src={`${import.meta.env.BASE_URL}/images/Tornillos.webp`}
                      style={{ height: "50vh", width: "auto" }}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
