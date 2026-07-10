import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useState } from "react";
import { Select, MenuItem, InputLabel, FormControl, Button, Tooltip, IconButton } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IPlant } from "app/models";
import { WhatsappMsgTiempoPlantSliceRequests } from "app/features/admin/slices/WhatsappMsgTiempoPlantSlice";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { Delete } from "@mui/icons-material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";

interface Props {
  whatsappMsgTiempo: IWhatsappMsgTiempo;
}

export const AccionAsignarPlanta: React.FC<Props> = ({ whatsappMsgTiempo }: Props) => {
  const { FetchDelete, FetchPost } = useFetchApiMultiResults();
  const classes = MaterialButtons();

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  const [plantSelected, setPlantSelected] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [dataInfo, setDataInfo] = useState<IWhatsappMsgTiempoPlant[]>([]);

  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false, false, false);

  FetchApi<IWhatsappMsgTiempoPlant[]>(
    WhatsappMsgTiempoPlantSliceRequests.getAllRequest, null, false,
    { whatsappMsgTiempo, refreshKey },
    (data) => {
      if (data) {
        setDataInfo(data.filter((x) => x.whatsappMsgTiempoId === whatsappMsgTiempo.id));
      } else setDataInfo([]);
    },
    true, false, false
  );

  const guardar = async () => {
    const object: IWhatsappMsgTiempoPlant = {
      plantId: plantSelected,
      whatsappMsgTiempoId: whatsappMsgTiempo.id
    };
    FetchPost(WhatsappMsgTiempoPlantSliceRequests.PostRequest, object, false, () => setRefreshKey(k => k + 1));
  };

  const eliminarAsignacion = (id: number) => {
    FetchDelete({
      sliceRequest: WhatsappMsgTiempoPlantSliceRequests.deleteRequest,
      deleteId: id,
      consoleLog: false,
      mensajePersonalizado: true,
      messageUser: "Desea eliminar la asignacion?",
      titleUser: "Eliminar Asignacion",
      functionAdd: () => setRefreshKey(k => k + 1)
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mb-2">
        {plantas && (
          <div className="w-1/2">
            <FormControl fullWidth variant="standard">
              <InputLabel variant="standard">Planta</InputLabel>
              <Select
                fullWidth
                value={plantSelected}
                variant="standard"
                onChange={(e) => {
                  setPlantSelected(parseInt(e.target.value.toString()));
                }}>
                {plantas &&
                  plantas.map((x) => (
                    <MenuItem key={x.id} value={x.id}>
                      <div className="w-full">
                        <div>{x.name}</div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        <Button disabled={plantSelected === 0} variant="contained" className={classes.greenButton} onClick={guardar}>
          Guardar
        </Button>
      </div>
      <ContainerForPages optionsLayout="Table" tableForModalOrPageStyle="Modal">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Planta",
              field: "plant.name"
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IWhatsappMsgTiempoPlant) => {
                return (
                  <section>
                    <div>
                      <Tooltip title="Eliminar asignacion de horario">
                        <IconButton
                          onClick={() => {
                            eliminarAsignacion(row.id);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
          dataInfo={dataInfo}
        />
      </ContainerForPages>
    </div>
  );
};
