/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import { Select, MenuItem, InputLabel, FormControl, Button, Tooltip, IconButton } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IPlant } from "app/models";
import { WhatsappMsgTiempoPlantSliceRequests } from "app/Middleware/reducers/WhatsappMsgTiempoPlantSlice";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { Delete } from "@mui/icons-material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

interface props {
  whatsappMsgTiempo: IWhatsappMsgTiempo;
}

export const AccionAsignarPlanta = ({ whatsappMsgTiempo }: props) => {
  const dispatch = useAppDispatch();
  const { FetchDelete } = useFetchApiMultiResults();
  const classes = MaterialButtons();

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [plantSelected, setPlantSelected] = useState(0);

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
  };

  const getListByWhatsappMsgTiempoId = async () => {
    const result = unwrapResult(await dispatch(WhatsappMsgTiempoPlantSliceRequests.getAllRequest()));

    if (result) {
      setDataInfo(result.filter((x) => x.whatsappMsgTiempoId == whatsappMsgTiempo.id));
    } else setDataInfo([]);
  };

  const guardar = async () => {
    const object: IWhatsappMsgTiempoPlant = {
      plantId: plantSelected,
      whatsappMsgTiempoId: whatsappMsgTiempo.id
    };
    const result = unwrapResult(await dispatch(WhatsappMsgTiempoPlantSliceRequests.PostRequest(object)));
    if (result) {
      console.log("gurdado");
      getListByWhatsappMsgTiempoId();
    }
  };

  const eliminarAsignacion = (id) => {
    FetchDelete({
      sliceRequest: WhatsappMsgTiempoPlantSliceRequests.deleteRequest,
      deleteId: id,
      consoleLog: false,
      mensajePersonalizado: true,
      messageUser: "Desea eliminar la asignacion?",
      titleUser: "Eliminar Asignacion",
      functionAdd: async () => {
        const result = unwrapResult(await dispatch(WhatsappMsgTiempoPlantSliceRequests.getAllRequest()));
        if (result) {
          setDataInfo(result.filter((x) => x.whatsappMsgTiempoId == whatsappMsgTiempo.id));
        }
      }
    });
  };

  useEffect(() => {
    if (whatsappMsgTiempo) getListByWhatsappMsgTiempoId();
    getPlantas();
  }, []);

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
        <Button disabled={plantSelected == 0} variant="contained" className={classes.greenButton} onClick={guardar}>
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
              render: (row: IWhatsappMsgTiempo) => {
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
