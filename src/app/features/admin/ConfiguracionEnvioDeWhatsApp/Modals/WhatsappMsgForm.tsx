import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import Switch from "@mui/material/Switch";
import { Button, Typography } from "@mui/material";
import { ILinea, IPlant } from "app/models";
import { WhatsappMsgSliceRequests } from "app/features/admin/slices/WhatsappMsgSlice";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";

interface Props {
  setOpenPopup: (newValue: boolean) => void;
  editState: boolean;
  refresh?: (newValue: IWhatsappMsg[]) => void;
  lineas: ILinea[];
  rowSelected: IWhatsappMsg;
  opcionSeleccionada: number;
}

interface FormValues {
  idLinea: number;
  m: boolean;
  t: boolean;
  n: boolean;
  plantId: number;
  whatsappMsgOpcionAsignacionId: number;
}

const initialFormValues: FormValues = {
  idLinea: 0,
  m: false,
  t: false,
  n: false,
  plantId: 0,
  whatsappMsgOpcionAsignacionId: 0
};

export const WhatsappMsgForm: React.FC<Props> = ({
  setOpenPopup,
  editState,
  refresh,
  lineas,
  rowSelected,
  opcionSeleccionada
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty }
  } = useForm<FormValues>({
    defaultValues:
      rowSelected != null ? rowSelected : { ...initialFormValues, whatsappMsgOpcionAsignacionId: opcionSeleccionada }
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const [listLineas, setListLineas] = useState<ILinea[]>();

  const watchTurnom = useWatch({ control, name: "m" });
  const watchTurnot = useWatch({ control, name: "t" });
  const watchTurnon = useWatch({ control, name: "n" });
  const watchPlantId = useWatch({ control, name: "plantId" });

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false, false, false);

  FetchApi<ILinea[]>(
    LineaSliceRequests.getAllRequest,
    null,
    false,
    watchPlantId,
    (data) => {
      if (data) setListLineas(data.filter((x) => x.plantId === watchPlantId));
    },
    true,
    false,
    false
  );

  const onSubmit = (formData: FormValues) => {
    if (rowSelected) {
      FetchPut({
        sliceRequest: WhatsappMsgSliceRequests.PutRequest,
        modelPut: formData,
        consoleLog: false,
        activeConfirmation: true,
        mensajePersonalizado: true,
        messageUser: "¿Está seguro de actualizar este mensaje?",
        titleUser: "Actualizar Mensaje WhatsApp",
        functionAdd: () => {
          openNotificationUI("Guardado exitosamente :)", "success");
          setOpenPopup(false);
          if (refresh) {
            dispatch(WhatsappMsgSliceRequests.GetAllByWhatsapAsignacionId(opcionSeleccionada)).then((res) => {
              refresh(res.payload as IWhatsappMsg[]);
            });
          }
        }
      });
    } else {
      FetchPost(WhatsappMsgSliceRequests.PostRequest, formData, false, () => {
        openNotificationUI("Guardado exitosamente :)", "success");
        setOpenPopup(false);
        if (refresh) {
          dispatch(WhatsappMsgSliceRequests.GetAllByWhatsapAsignacionId(opcionSeleccionada)).then((res) => {
            refresh(res.payload as IWhatsappMsg[]);
          });
        }
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, turno: string) => {
    switch (turno) {
      case "m":
        setValue("m", event.target.checked);
        break;
      case "t":
        setValue("t", event.target.checked);
        break;
      case "n":
        setValue("n", event.target.checked);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full w-[55vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full w-full">
        <div className="flex items-center justify-around">
          <div className="w-[180px]">
            <SelectComponentForm<FormValues, IPlant>
              control={control}
              name="plantId"
              label="Planta"
              listItems={plantas ?? []}
              valueLabel={(x) => x.name}
              valueSelect={(x) => x.id}
              rules={{ required: "Planta es requerida" }}
              variant="standard"
            />
          </div>
          <div className="w-[180px]">
            <SelectComponentForm<FormValues, ILinea>
              control={control}
              name="idLinea"
              label="Linea Produccion"
              listItems={listLineas ?? []}
              valueLabel={(x) => x.descripcion}
              valueSelect={(x) => x.idLinea}
              rules={{ required: "Linea de Produccion es requerida" }}
              variant="standard"
            />
          </div>
          <div>
            <Typography variant="h6">Mañana</Typography>
            <Switch
              checked={watchTurnom}
              onChange={(e) => {
                handleChange(e, "m");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
          <div>
            <Typography variant="h6">Tarde</Typography>
            <Switch
              checked={watchTurnot}
              onChange={(e) => {
                handleChange(e, "t");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
          <div>
            <Typography variant="h6">Noche</Typography>
            <Switch
              checked={watchTurnon}
              onChange={(e) => {
                handleChange(e, "n");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
        </div>
        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
