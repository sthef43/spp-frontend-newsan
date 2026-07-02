import { Add, Delete, Edit } from "@mui/icons-material";
import { IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { SgsmodeloSliceRequests } from "app/Middleware/reducers/SgsmodeloSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISgsmodelo } from "app/models/ISgsmodelo";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ModeloCRUD } from "app/features/produccion/modules/creacionModelos/modals/ModeloCRUD";
import { SgsModelosCRUD } from "app/features/produccion/modules/creacionModelos/modals/SgsModelosCRUD";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";

const getAllYears = () => {
  const infoIni = 2015;
  const infoFinish = moment().get("year");
  const years = [];
  for (let index = infoIni; index <= infoFinish; index++) {
    years.push(index);
  }
  return years;
};
const ini = {
  year: moment().get("year"),
  AllYears: getAllYears()
};
export const ModelosCrudPage = () => {
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const [modelos, setmodelos] = useState([]);
  const [initialInfo, setinitialInfo] = useState(ini);
  const [openPopUpSgsmodelo, setopenPopUpSgsmodelo] = useState(false);
  const [openPopUp, setopenPopUp] = useState(false);
  const [modeloSelected, setmodeloSelected] = useState(null);
  const [EditmodeloSelected, setEditmodeloSelected] = useState(null);
  const { State: ListSgsModelos, setState: setListSgsModelos } = useFetchApi<ISgsmodelo[]>(
    SgsmodeloSliceRequests.getAll
  );
  React.useEffect(() => {
    TitleChanger("Modelos CRUD");
    console.log(initialInfo);
  }, []);
  useEffect(() => {
    (async () => {
      let info;
      try {
        info = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTemporada(initialInfo.year)));
      } catch (error) {
        info = null;
      }
      if (info) setmodelos(info);
    })();
  }, [initialInfo.year]);
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar", "Esta seguro que desea eliminar el modelo?");
      if (confirm) {
        const deleteRequest = await dispatch(ModelosSliceRequests.deleteRequest(id));
      }
    } catch (error) {
      openNotificationUI(error, "error");
    }
  };
  const getAllModels = (info: string) => {
    if (info && ListSgsModelos) {
      if (info.startsWith("S4")) {
        const infosecondPart = info.slice(2, info.length);
        console.log(infosecondPart);
        const Lista = ListSgsModelos.filter((x) => x.modelo.includes(infosecondPart));

        return (
          <div>
            {Lista && (
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-bold">Codigo</div>
                  <div className="font-bold">Descripcion</div>
                  <div className="font-bold">Numero</div>
                  <div className="font-bold">Modelo</div>

                  {Lista.map((element) => (
                    <React.Fragment key={element.id}>
                      <div>{element.codigo}</div>
                      <div>{element.descripcion}</div>
                      <div>{element.numero}</div>
                      <div>{element.modelo}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        console.log(info);
        console.log(ListSgsModelos);
        const Lista = ListSgsModelos.filter((x) => x.modelo?.includes(info));

        return (
          <div>
            {Lista && (
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-bold">Codigo</div>
                  <div className="font-bold">Descripcion</div>
                  <div className="font-bold">Numero</div>
                  <div className="font-bold">Modelo</div>

                  {Lista.map((element) => (
                    <React.Fragment key={element.id}>
                      <div>{element.codigo}</div>
                      <div>{element.descripcion}</div>
                      <div>{element.numero}</div>
                      <div>{element.modelo}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return <div></div>;
  };
  return (
    <div>
      <div className="px-2 pt-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="text-center">
          <TextField
            value={initialInfo.year}
            label={"Año"}
            placeholder="Año"
            onChange={(x) => {
              const info = x.target.value;
              if (info) {
                setinitialInfo({ ...initialInfo, year: Number(info) });
              }
            }}
            select>
            {ini.AllYears.map((x) => (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {modelos && (
          <TableComponent
            IDcolumn={"idModelo"}
            columns={[
              {
                title: "Codigo modelo",
                field: "codigoModelo"
              },
              {
                title: "Descripcion",
                field: "descripcion"
              },
              {
                title: "Tipo de unidad",
                field: "tipoUnidad"
              },
              {
                title: "Capacidad tipo",
                field: "capacidadTipo"
              },
              {
                title: "Temporada",
                field: "temporada"
              },
              {
                title: "Acciones",
                field: "",
                render: (row: any) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            setEditmodeloSelected(row);
                            setopenPopUp(true);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            onDelete(row.idModelo);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="">
                        <IconButton
                          onClick={() => {
                            setmodeloSelected(row.codigoModelo);
                            setopenPopUpSgsmodelo(true);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={modelos}
            Collapse={true}
            buscar={true}
            agregar={() => {
              setopenPopUp(true);
            }}
            CollapseExtraModulesBefore={(info: any) => {
              return <div className="w-full">{getAllModels(info.row.codigoModelo)}</div>;
            }}
            filterWithSpecificValues={"Estado"}
          />
        )}
      </div>
      <ModalCompoment openPopup={openPopUp} setOpenPopup={setopenPopUp} title="Creacion de modelo">
        <ModeloCRUD setOpenPopup={setopenPopUp} modelo={EditmodeloSelected} />
      </ModalCompoment>
      <ModalCompoment openPopup={openPopUpSgsmodelo} setOpenPopup={setopenPopUpSgsmodelo} title="Creacion de Sgs">
        <SgsModelosCRUD setOpenPopup={setopenPopUpSgsmodelo} modelo={modeloSelected} />
      </ModalCompoment>
    </div>
  );
};
