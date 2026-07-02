/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import {
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from "@mui/material";
import { InfoRounded } from "@mui/icons-material";
import { useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IAuditoriaListaValores } from "../../../models/IAuditoriaListaValores";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { IAuditoriaValoresListaBloq } from "../../../models/IAuditoriaValoresListaBloq";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IAuditoriaValores } from "../../../models/IAuditoriaValores";
import { AuditoriaValoresSliceRequest } from "../../../slices/AuditoriaValoresSlice";
import { useAppDispatch } from "app/core/store/store";
import { estadoDeRenderizadosSlice } from "../../../slices/EstadoDeRenderizadosSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { statesListDataForAuditoriasSlice } from "../../../slices/ListaDatosParaAuditoriasSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
}

export const ValoresExistentes: React.FC<Props> = ({ setOpenModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost } = useFetchApiMultiResults<
    IAuditoriaListaValores | IAuditoriaValores[] | IAuditoriaValoresListaBloq[]
  >();

  const listadoValores = useAppSelector<IAuditoriaValores[]>((state) => state.auditoriaValores.dataAll);

  const { tipoProductoId } = useAppSelector((state) => state.listaDatosParaAuditorias);

  const [checked, setChecked] = useState<number[]>([]);

  FetchApi<IAuditoriaValores[]>(
    AuditoriaValoresSliceRequest.getAllRequest,
    null,
    false,
    null,
    null,
    true,
    false,
    false
  );

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const onSubmit = async (data: any) => {
    const listadoResult = generarResultValores();
    if (
      await getConfirmation(
        "Crear lista de Valores",
        "Desea continuar con la creacion de valores",
        null,
        "Aceptar",
        "Cancelar"
      )
    ) {
      dispatch(statesListDataForAuditoriasSlice.actions.setListaValoresPreview(listadoResult));
      dispatch(estadoDeRenderizadosSlice.actions.setMostrarListaValores(true));
      setOpenModal(false);
    }
  };

  const generarResultValores = (): IAuditoriaValores[] => {
    const listaFiltradaChecks = listadoValores.filter((item) => checked.includes(item.id));
    const listado: IAuditoriaValores[] = listaFiltradaChecks.map((item) => {
      return {
        nombre: item.nombre,
        descripcion: item.descripcion,
        flagCriterio: false,
        flagMail: false
      };
    });
    return listado;
  };

  return (
    <form>
      <ContainerForPages optionsLayout="personalized" classNamePersonalized="flex flex-col w-full" activeEffectVisible>
        <List
          sx={{
            width: "100%",
            maxHeight: "360px",
            overflowY: "auto",
            backgroundColor: "var(--background-color)",
            marginTop: "12px",
            borderRadius: "10px",
            padding: "0"
          }}>
          {listadoValores.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;
            return (
              <ListItem
                sx={{
                  borderBottom: "1px solid #d3cecec9"
                }}
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <Tooltip title={item.descripcion}>
                      <InfoRounded />
                    </Tooltip>
                  </IconButton>
                }
                disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(item.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(item.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`Nombre del valor: ${item.nombre}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <div className="mt-6 flex w-full justify-center">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={checked.length === 0}
            className={buttonClases.blueButton}
            variant="contained"
            type="submit"
            color="primary">
            Crear lista de valores
          </Button>
        </div>
      </ContainerForPages>
    </form>
  );
};
