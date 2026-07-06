import React, { useEffect, useState } from "react";
// import useFetchApi from "app/shared/hooks/useFetchApi";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { AgregarFamiliaForm } from "app/features/trazabilidad/modules/lineaDeProduccion/components/AgregarFamiliaForm";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { Checkbox, FormControlLabel, IconButton, Tooltip, Chip } from "@mui/material";
import { Add, Info } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { FamiliaInfo } from "app/features/trazabilidad/modules/lineaDeProduccion/modals/FamiliaInfo";
import { ILineaProduccionFamilia } from "app/models/ILineaProduccionFamilia";
import { IFamilia } from "app/models/IFamilia";
import { SemiElaboradoIALineaFamiliaForm } from "app/features/trazabilidad/modules/lineaDeProduccion/components/semiIAlineaProdForm";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  setOpenPopup: any;
  productId: any;
  filaSeleccionada: any;
  refresh: any;
}
//filaSeleccionada tiene el id de LineaProduccion
//productoId es el id del producto que tiene la LineaProduccion
export const AccionAsignarFamilias = ({ setOpenPopup, filaSeleccionada, productId, refresh }: Props): JSX.Element => {
  const [familiasList, setFamiliasList] = useState(null);
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState<ILineaProduccionFamilia[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [familiaInfo, setFamiliaInfo] = useState<string>("");
  const [familiaSelect, setFamiliaSelect] = useState<IFamilia>(null);
  const [openSemiIAForm, setopenSemiIAForm] = useState(false);

  useEffect(() => {
    getFamiliasByLineaProduccion();
  }, []);

  React.useEffect(() => {
    if (familiasList?.length > 0) {
      //Le saco el producto, por que tiene data repetida para todos los registrso y hace que el buscador no funcione correctamente !
      const newAray = familiasList.map((x) => {
        const familia = { ...x.familia, producto: null };
        const lineaproduccion = { ...x, familia: familia };
        return lineaproduccion;
      });
      setData(JSON.parse(JSON.stringify(newAray)));
    } else {
      setData([]);
    }
  }, [familiasList]);

  const getFamiliasByLineaProduccion = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const result = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(filaSeleccionada)));
    console.log(result);

    setFamiliasList(result);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  const handleActivarFamilia = async (data) => {
    data.semielaboradoIA = null; //Nulleo esta data xq explotaba la guardar.
    data.activa = !data.activa;
    const response = await dispatch(LineaProduccionFamiliaSliceRequests.PutRequest(data));
    if (response) {
      openNotificationUI("Activado exitosamente :)", "success");
      getFamiliasByLineaProduccion();
    } else {
      openNotificationUI("Hubo un problema al activar :(", "error");
    }
  };

  const { openNotificationUI } = useNotificationUI();

  return (
    <div className="my-2 mx-4 h-full">
      <AgregarFamiliaForm
        familiasList={familiasList}
        productId={productId}
        filaSeleccionada={filaSeleccionada}
        refreshList={getFamiliasByLineaProduccion}
        refreshListaLineasProduccion={refresh}></AgregarFamiliaForm>
      <TableComponent
        buscar
        IDcolumn={"id"}
        columns={[
          {
            title: "Familia",
            field: "familia.nombre",
            render: (row) => (
              <div className="flex">
                {row.familia.nombre}
                <Tooltip title="Informacion de la familia">
                  <IconButton
                    onClick={() => {
                      setFamiliaInfo(row.familia.nombre);
                      setFamiliaSelect(row.familia);
                      setOpenModal(true);
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <Info />
                  </IconButton>
                </Tooltip>
              </div>
            )
          },
          {
            title: "Descripción",
            field: "familia.descripcion"
          },
          {
            title: "Semielaborado",
            field: "familia.semielaboradoIAId",
            render: (row) =>
              row.semielaboradoIA ? (
                <Tooltip title={row.semiActivo ? "Semielaborado Activado" : "Semielaborado Desactivado"}>
                  <Chip
                    label={row.semielaboradoIA.valor}
                    variant="outlined"
                    color={row.semiActivo ? "success" : "default"}
                  />
                </Tooltip>
              ) : (
                "Sin Semielaborado"
              )
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={row.activa}
                      onClick={() => {
                        handleActivarFamilia(row);
                      }}
                    />
                  }
                  label="Activar"
                />
                <Tooltip title="Ver SemiElaborados Externos">
                  <IconButton
                    size="small"
                    onClick={() => {
                      // setFamilia(row);
                      // setopenSemiIAForm(true);
                    }}
                    style={{ position: "relative" }}>
                    <Add color="success" />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
        ]}
        dataInfo={DataOpen}
      />

      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        title={`Informacion de la familia ${familiaInfo}`}>
        <FamiliaInfo familia={familiaSelect} />
      </ModalCompoment>
      <ModalCompoment
        title={"Agregar SemiElaborado Externo"}
        openPopup={openSemiIAForm}
        setOpenPopup={setopenSemiIAForm}>
        <SemiElaboradoIALineaFamiliaForm />
      </ModalCompoment>
    </div>
  );
};
