import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSlice, LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { SuperCargalineaSlice, SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlanProd, ISuperCargalinea } from "app/models";
import { ComercialDeleteAll } from "app/features/ingenieria/modules/comercial/modals/ComercialDeleteAll";
import { ComercialForm } from "app/features/supermercado/generaradorEtiquetas/modals/ComercialForm";
import { ComercialGenerador } from "app/features/ingenieria/components/ComercialGenerador";
import { ComercialPrint } from "app/features/ingenieria/components/ComercialPrint";
import { ComercialTable } from "app/features/supermercado/generaradorEtiquetas/components/ComercialTable";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import _, { Dictionary } from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

export const ComercialPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [numerosOp, setNumerosOp] = useState<Array<{ numOp: string; numLote: string }>>(null);
  const [key, setKey] = useState<string>("");
  const [lineas, setLineas] = useState<ILinea[]>(null);
  const [modelos, setModelos] = useState<IPlanProd[]>(null);
  const [edit, setEdit] = useState<ISuperCargalinea>(null);
  const [superCargalineaGroup, setSupercargaLineaGroup] = useState<Dictionary<ISuperCargalinea[]>>(null);

  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: { idLinea: 0, modelo: "", numeroOp: "" }
  });
  const handleModelos = async () => {
    try {
      setValue("modelo", "");
      dispatch(SuperCargalineaSlice.actions.clearData());
      const response = unwrapResult(
        await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(getValues("idLinea")))
      );
      dispatch(LineaSlice.actions.setSelectLinea(getValues("idLinea")));
      setModelos(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleGetComercial = async (key?, numOp?) => {
    try {
      const response = unwrapResult(
        await dispatch(SuperCargalineaSliceRequests.getByModeloRequest(getValues("modelo")))
      );
      setKey("");
      setValue("numeroOp", "");
      const orderByPosicion = _.orderBy(response, "descripSector");
      const groupByOp = _.groupBy(orderByPosicion, "numeroOp");
      setNumerosOp(
        Object.keys(groupByOp).map((op) => {
          return { numOp: op, numLote: groupByOp[op][0].lote };
        })
      );
      setSupercargaLineaGroup(groupByOp);
      if (key && numOp) {
        setKey(key);
        setValue("numeroOp", numOp);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleGetComercialByOp = async () => {
    const op = getValues("numeroOp");
    op && setKey(op);
  };
  const getAllLineas = async () => {
    try {
      const response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      setLineas(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        await dispatch(SuperCargalineaSliceRequests.deleteRequest(id));
        openNotificationUI("Se elimino el registro", "warning");
        handleGetComercial(key, getValues("numeroOp"));
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onEdit = (superCargalinea: ISuperCargalinea) => {
    setEdit(superCargalinea);
    setOpenModal(true);
  };
  const onAdd = () => {
    setEdit(null);
    setOpenModal(true);
  };
  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Reporte de materiales comercial`,
    copyStyles: true
  });
  const imprimirInforme = async () => {
    handleImprimir();
  };
  useEffect(() => {
    TitleChanger("Visualización de Materiales Comercial");
    getAllLineas();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <div className="p-4 rounded-lg shadow-elevation-4 bg-secondaryNew gap-4 ">
        <div className="m-3 grid grid-cols-4 gap-4">
          <Controller
            control={control}
            name="idLinea"
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Seleccione una linea</InputLabel>
                <Select {...field} onClick={handleModelos}>
                  {lineas &&
                    lineas.map((linea) => (
                      <MenuItem key={linea.idLinea} value={linea.idLinea}>
                        {linea.descripcion}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="modelo"
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Seleccione un modelo</InputLabel>
                <Select {...field} onClick={handleGetComercial}>
                  {modelos &&
                    modelos.map((modelo, index) => (
                      <MenuItem key={index} value={modelo.nombre}>
                        {modelo.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
          {numerosOp?.length > 0 ? (
            <Controller
              control={control}
              name="numeroOp"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Seleccione un numero de OP</InputLabel>
                  <Select {...field} onClick={handleGetComercialByOp}>
                    {numerosOp &&
                      numerosOp.map((op, index) => (
                        <MenuItem key={index} value={op.numOp}>
                          {superCargalineaGroup && op.numOp + " lote " + op.numLote}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          ) : (
            <TextField fullWidth value="Tiene que generar el comercial primero" disabled />
          )}

          <div className="flex justify-between gap-4 items-center">
            {getValues("modelo") != "" && key != "" && (
              <ComercialGenerador
                modelo={getValues("modelo")}
                superCargalinea={superCargalineaGroup[key]}
                refresh={handleGetComercial}
              />
            )}
            {getValues("modelo") != "" && key != "" && superCargalineaGroup[key].length > 0 && (
              <ComercialDeleteAll superCargalinea={superCargalineaGroup[key]} refresh={handleGetComercial} />
            )}
            <div className="hidden bg-white">
              {getValues("modelo") != "" && key != "" && superCargalineaGroup[key].length > 0 && (
                <ComercialPrint
                  superCargaLinea={superCargalineaGroup[key]}
                  parentRef={componentRef}
                  modelo={getValues("modelo")}
                  numOpyLote={{
                    numOp: getValues("numeroOp"),
                    numLote: numerosOp.find((n) => n.numOp == getValues("numeroOp"))?.numLote
                  }}
                />
              )}
            </div>
            {getValues("modelo") != "" && key != "" && superCargalineaGroup[key].length > 0 && (
              <Button
                onClick={() => {
                  // generarReporte(lotesProducidos);
                  imprimirInforme();
                }}
                sx={{ marginLeft: 3 }}
                className={buttonClasses.greenButton}
                variant="contained"
                disabled={superCargalineaGroup[key].length == 0}>
                Imprimir
              </Button>
            )}
          </div>
        </div>
        {key != "" && (
          <ComercialTable
            onAddProps={onAdd}
            data={superCargalineaGroup[key]}
            onDeleteProps={onDelete}
            onEditProps={onEdit}
            modelo={getValues("modelo")}
            refresh={null}
          />
        )}
        <ModalCompoment
          openPopup={openModal}
          setOpenPopup={setOpenModal}
          title={edit ? "Editar material" : "Agregar material"}>
          <ComercialForm
            modelo={getValues("modelo")}
            dataEdit={edit}
            setOpenModal={setOpenModal}
            idLinea={getValues("idLinea")}
            refresh={handleGetComercial}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
