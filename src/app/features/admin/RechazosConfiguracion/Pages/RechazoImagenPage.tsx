import { FormControl, Select, MenuItem, Button } from "@mui/material";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { RechazoImagenSliceRequests } from "app/features/admin/slices/RechazoImagenSlice";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IAppUser } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { PlantSliceRequests, plantSlice } from "app/Middleware/reducers/PlantSlice";
import { IPlant } from "app/models/IPlant";
import { IProducto } from "app/models/IProducto";
//agrego imports para la tabla/modales/buscador (lógica)
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoPuestoSliceRequests } from "app/Middleware/reducers/RechazoPuestoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRechazoImagen } from "app/models/IRechazoImagen";
import { IRechazoPuesto } from "app/models/IRechazoPuesto";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { RechazoPuestoForm } from "../../PuestoRechazoPorLinea/Modals/RechazoPuestoForm";
import { RechazoImagenTable } from "../Components/RechazoImagenTable";
import { ImagenForm } from "../Modal/ImagenForm";
import { RechazoImagenForm } from "../Modal/RechazoImagenForm";
// import { RechazoPuestoForm } from "app/shared/components/trazabilidad/rechazo/RechazoPuestoForm";
// import { RechazoImagenTable } from "../../../components/calidad/rechazo/RechazoImagenTable";
// import { RechazoImagenForm } from "app/shared/components/calidad/rechazo/RechazoImagenForm";
// import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
// import { ImagenForm } from "app/shared/components/calidad/rechazo/ImagenForm";
// import { ModalCompoment } from "app/shared/components/ui/ModalComponent";

type FormState = {
  plantId: number;
  productoId: number;
  rechazoPuestoId: number;
};

export const RechazoImagenPage = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, watch } = useForm<FormState>({
    defaultValues: { plantId: 0, productoId: 0, rechazoPuestoId: 0 }
  });

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [imageForm, setImageForm] = useState<boolean>(false);
  const [productoId, setProductoId] = useState<number>(0);
  const [editState, setEditState] = useState<IRechazoImagen>(null);
  const [ModalOpenPuesto, setModalOpenPuesto] = useState(false);
  const [productos, setProductos] = useState<IProducto[]>([]);

  const dispatch = useAppDispatch();

  const puestos = useAppSelector<IRechazoPuesto[]>((state) => state.rechazoPuesto.dataAll);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const plantas = useAppSelector<IPlant[]>((state) => state.plant.dataAll);
  const plantWatch = watch("plantId");
  const productoWatch = watch("productoId");
  const rpWatch = watch("rechazoPuestoId");

  const setProductIdProps = useCallback((id: number) => {
    setProductoId(id);
  }, []);

  const onGetPuestos = async (id?: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      onGetFamilias(id);
      onGetLineas(id);
      await dispatch(RechazoPuestoSliceRequests.GetAllByProductoIdRequest(id ? id : productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
    }
  };

  const onGetFamilias = async (id?: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      await dispatch(FamiliaSliceRequests.getAllByProductoId(id ? id : productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
    }
  };

  const onGetLineas = async (id?: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      await dispatch(LineaProduccionSliceRequests.getAllByProductId(id ? id : productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
    }
  };

  const onGetRechazoImagen = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      await dispatch(RechazoImagenSliceRequests.GetAllByPuestoIdRequest(getValues("rechazoPuestoId")));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
    }
  };

  const setEditProps = useCallback((rImagen: IRechazoImagen) => {
    setEditState(rImagen);
    setOpenForm(true);
  }, []);

  const setImageProps = useCallback((rImagen: IRechazoImagen) => {
    setEditState(rImagen);
    setImageForm(true);
  }, []);

  const setOpenFormProps = useCallback((state: boolean) => {
    setEditState(null);
    setOpenForm(state);
  }, []);

  const crearPuesto = () => setModalOpenPuesto(true);

  // selects separados
  const onGetPlants = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(PlantSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
    }
  };

  const onGetProductsByPlant = async (plantId: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      dispatch(plantSlice.actions.setSelectPlant(plantId));

      const response = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
      const productsGroup = _.groupBy(response, "productoId");
      const keys = Object.keys(productsGroup);
      const productosSinKeys: IProducto[] = keys.map((k) => productsGroup[k][0].producto);

      setProductos(productosSinKeys);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e as any, "error");
      setProductos([]);
    }
  };

  useEffect(() => {
    if (!plantWatch || plantWatch === 0) return;

    setValue("productoId", 0);
    setValue("rechazoPuestoId", 0);
    setProductos([]);
    setProductIdProps(0);

    onGetProductsByPlant(plantWatch);
  }, [plantWatch]);

  useEffect(() => {
    if (!productoWatch || productoWatch === 0) return;

    setValue("rechazoPuestoId", 0);
    setProductIdProps(productoWatch);
    onGetPuestos(productoWatch);
  }, [productoWatch]);

  useEffect(() => {
    TitleChanger("Imagenes de rechazo para linea");
    onGetPlants();
  }, []);

  return (
    <div className="container mx-auto my-3">
      <div className="text-textNew font-bold text-[22px] px-5 py-2">Registro imágenes de rechazos</div>
      <div className="flex gap-8  flex justify-center p-5 items-center">
        <div className="flex gap-10 w-full justify-between items-center">
          {/* PLANTA */}
          <Controller
            control={control}
            name="plantId"
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl className="w-full max-w-[320px]" size="small">
                <Select
                  {...field}
                  displayEmpty
                  className="w-full h-[44px] bg-New rounded-[3px] select-clean"
                  renderValue={(selected) => {
                    const v = Number(selected ?? 0);
                    if (!v)
                      return (
                        <span className="text-textNew text-[12px] w-full text-left block">Seleccionar Planta</span>
                      );
                    const found = (plantas ?? []).find((p: any) => p.id === v);
                    return <span className="text-textNew text-[12px] w-full text-left block">{found?.name ?? v}</span>;
                  }}>
                  <MenuItem value={0} disabled>
                    Seleccionar Planta
                  </MenuItem>
                  {(plantas ?? []).map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* PRODUCTO */}
          <Controller
            control={control}
            name="productoId"
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl className="w-full max-w-[320px]" size="small" disabled={!plantWatch}>
                <Select
                  {...field}
                  displayEmpty
                  className="w-full h-[44px] bg-New rounded-[3px] select-clean"
                  renderValue={(selected) => {
                    const v = Number(selected ?? 0);
                    if (!v)
                      return (
                        <span className="text-textNew text-[12px] w-full text-left block">Seleccionar Producto</span>
                      );
                    const found = (productos ?? []).find((p: any) => p.id === v);
                    return (
                      <span className="text-textNew text-[12px] w-full text-left block">
                        {found?.nombre ?? found?.descripcion ?? v}
                      </span>
                    );
                  }}>
                  <MenuItem value={0} disabled>
                    Seleccionar Producto
                  </MenuItem>
                  {(productos ?? []).map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre ?? p.name ?? p.descripcion ?? p.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* PUESTO */}
          <Controller
            control={control}
            name="rechazoPuestoId"
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl className="w-full max-w-[320px]" size="small" disabled={!productoWatch}>
                <Select
                  {...field}
                  displayEmpty
                  className="w-full h-[44px] bg-New rounded-[3px] select-clean"
                  onChange={(e) => {
                    field.onChange(e);
                    const next = Number((e.target as any).value ?? 0);
                    if (next > 0) setTimeout(onGetRechazoImagen, 0);
                  }}
                  renderValue={(selected) => {
                    const v = Number(selected ?? 0);
                    if (!v)
                      return (
                        <span className="text-textNew text-[12px] w-full text-left block">Seleccionar Puesto</span>
                      );
                    const found = (puestos ?? []).find((x: any) => x.id === v);
                    return (
                      <span className="text-textNew text-[12px] w-full text-left block">{found?.nombre ?? v}</span>
                    );
                  }}>
                  <MenuItem value={0} disabled>
                    Seleccionar Puesto
                  </MenuItem>
                  {(puestos ?? []).map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>

        <Button
          className={`min-w-[140px] h-[35px] shadow-[0px_4px_4px_0px_#00000040] rounded-[5px] bg-[#137FEC] !text-[#FFF] font-medium normal-case hover:bg-[#2c94fdff]`}
          onClick={crearPuesto}
          disabled={!productoWatch}>
          + Puesto
        </Button>
      </div>

      {rpWatch > 0 && (
        <div className="px-5">
          <RechazoImagenTable
            openForm={setOpenFormProps}
            setEditState={setEditProps}
            openImage={setImageProps}
            refresh={onGetRechazoImagen}
          />
        </div>
      )}

      <ModalCompoment
        setOpenPopup={setOpenForm}
        openPopup={openForm}
        title={editState ? "Editar un puesto de rechazo" : "Agregar un puesto de rechazo"}>
        <RechazoImagenForm
          closeModal={setOpenFormProps}
          editState={editState}
          rPuestoId={getValues("rechazoPuestoId")}
          refresh={onGetRechazoImagen}
        />
      </ModalCompoment>

      <ModalCompoment
        setOpenPopup={setImageForm}
        openPopup={imageForm}
        title={editState ? "Editar una imagen" : "Agregar una imagen"}>
        <ImagenForm closeModal={setImageForm} editState={editState} refresh={onGetRechazoImagen} />
      </ModalCompoment>

      <ModalCompoment setOpenPopup={setModalOpenPuesto} openPopup={ModalOpenPuesto} title={"Agregar un puesto"}>
        <RechazoPuestoForm
          refresh={() => onGetPuestos(productoId)}
          editState={null}
          productoId={productoId}
          closeModal={setModalOpenPuesto}
        />
      </ModalCompoment>
    </div>
  );
};
