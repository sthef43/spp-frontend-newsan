import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Paper, Grid, Button } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { AuditTypeSliceRequests } from "app/features/audit/slices/AuditTypeSlice";
import { IAuditType } from "app/models/IAuditType";
import { AuditTypeForm } from "../modals/AuditTypeForm";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { IAuditTable } from "app/models/IAuditTable";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IAuditMail } from "app/models/IAuditMail";
import produce from "immer";
import _ from "lodash";
import { IAppUser } from "app/models/IAppUser";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IListaValores } from "app/models";
import { AuditTableSliceRequests } from "app/features/audit/slices/AuditTableSlice";
export const AuditTypeSelector = (props: {
  callback: (auditType: IAuditType) => void;
  callbackEmail: (auditMail: IAuditMail[]) => void;
  callbackValores?: (valores: IListaValores[]) => void;
  showButton: boolean;
  AuditType?: IAuditType;
  AuditEmails?: IAuditMail[];
  Valores?: IListaValores[];
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const Rol = useAppSelector((state) => state.appUser.data as IAppUser).permisos.rol;
  const ref = useRef(true);
  const buttonClasses = MaterialButtons();
  const [ModalOpen, setModalOpen] = useState(false);
  const [AuditType, setAuditType] = useState<IAuditType[] | null>(null);
  const [AuditMails, setAuditMails] = useState<IAuditMail[]>(props.AuditEmails);
  const [valores, setValores] = useState<IListaValores[] | null>(props.Valores || null);
  const [selectedItemAuditType, setSelectedItemAuditType] = useState<IAuditType>(props.AuditType || null);
  const { State: AuditTable } = useFetchApi<IAuditTable[]>(AuditTableSliceRequests.getAllRequest);
  //me traigo los audit types y los filtro por el rol
  const OnInit = async () => {
    ref.current = false;
    let fetchResult;

    try {
      fetchResult = unwrapResult(await dispatch(AuditTypeSliceRequests.getAllRequest()));
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      console.log(Rol.id, "rol");
      const fetchResultNew = fetchResult.filter((item) => item.rolId == Rol.id);
      console.log(fetchResultNew);
      setAuditType(fetchResultNew);
    }
  };
  const handleChange = (event: any) => {
    const selectedAuditType = AuditType.find((x) => x.id == (event.target.value as number));
    if (selectedAuditType) {
      setSelectedItemAuditType(selectedAuditType);
      setAuditMails([]);
      props.callback(selectedAuditType);
      console.log(selectedAuditType);
    }
  };
  //cambio los emails
  const changeMail = (e: boolean, id: number, index: number) => {
    setSelectedItemAuditType(
      produce((draft) => {
        draft.lista.listaValores[index].valor.flagMail = e;
      })
    );
    setValores(
      produce((draft) => {
        draft[index].valor.flagMail = e;
      })
    );

    if (e === true) {
      const x = selectedItemAuditType?.lista?.listaValores?.find((x) => x.valor?.id == id);
      setAuditMails(
        produce((draft) => {
          draft.push({ valorId: x.valor?.id, rolId: Rol.id });
        })
      );
    }
    if (e === false) {
      //const x = selectedItemAuditType?.lista?.listaValores?.find((x) => x.valor?.id == id);
      setAuditMails(
        produce((draft) => {
          _.remove(draft, (x) => x.valorId == id);
        })
      );
    }
  };
  const changeflagCriterio = (e: boolean, index: number) => {
    console.log(e, index);

    setSelectedItemAuditType(
      produce((draft) => {
        draft.lista.listaValores[index].valor.flagCriterio = e;
      })
    );
    setValores(
      produce((draft) => {
        draft[index].valor.flagCriterio = e;
      })
    );
  };
  useEffect(() => {
    props.callbackEmail(AuditMails);
  }, [AuditMails]);
  useEffect(() => {
    setValores(props.Valores);
  }, [props.Valores]);
  useEffect(() => {
    valores && props.callbackValores(valores);
  }, [valores]);

  const callbackNewAuditType = useCallback((selectedAuditType: IAuditType) => {
    setAuditType(
      produce((draft) => {
        draft.push(selectedAuditType);
      })
    );
    setSelectedItemAuditType(selectedAuditType);
    setAuditMails([]);
    props.callback(selectedAuditType);
  }, []);
  // const modalNewAuditType = () => {
  //     <AuditTypeForm callbackFunction={callbackNewAuditType} />;
  // };
  useEffect(() => {
    ref.current && OnInit();
    console.log(AuditType);
  }, [AuditType]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="pb-3 font-bold text-center">Selección de los valores</div>
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid item xs={12} sm={9}>
            <Grid container sx={{ flexGrow: 1 }} spacing={2}>
              <Grid item xs={12} sm={10}>
                {!AuditType ? (
                  <Skeleton animation="wave" />
                ) : (
                  <div className="w-full p-1 rounded-md bg-secondaryNew shadow-elevation-4">
                    <FormControl fullWidth variant="standard">
                      <InputLabel id="demo-simple-select-filled-label">Tipo de Valores</InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        fullWidth
                        value={selectedItemAuditType ? selectedItemAuditType?.id.toString() : ""}
                        defaultValue={""}
                        onChange={handleChange}
                        variant="standard">
                        <MenuItem value="" disabled>
                          <div></div>
                        </MenuItem>
                        {AuditType &&
                          AuditType.map((element, _x) => (
                            <MenuItem key={element.id} value={element.id}>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                                <div>{`${element.name}`}</div>
                                <div>
                                  {"Valores: ("}
                                  {element.lista?.listaValores?.map((y) => ` ${y.valor?.name} `)}
                                  {")"}
                                </div>
                                <div className="sm:col-span-2">
                                  {`Muestra :${
                                    AuditTable?.find((x) => x.id == element.auditTableId)?.name || "ninguno"
                                  }`}
                                </div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={2}>
                <div className="flex justify-center items-center h-full">
                  <Button
                    color="primary"
                    variant="contained"
                    className={buttonClasses.blueButton}
                    onClick={() => {
                      setModalOpen(true);
                    }}>
                    Nuevo
                  </Button>
                </div>
              </Grid>

              <Grid item xs={12} sm={12}>
                {selectedItemAuditType?.lista && (
                  <div>
                    <div className="mb-3 py-2 shadow-elevation-4 rounded-lg font-bold text-center bg-secondaryNew">
                      Selección de los valores
                    </div>
                    <div className="p-2 bg-secondaryNew shadow-elevation-4 rounded-lg">
                      <div className="grid grid-cols-4 gap-4 w-full text-lg font-medium">
                        <div>Valor</div>
                        <div>Descripcion</div>
                        <div>Envío por email</div>
                        <div>Item good</div>
                      </div>
                      {selectedItemAuditType.lista?.listaValores?.map((element, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 w-full items-center text-lg">
                          <div>{`${element.valor.name}`}</div>
                          <div>{`${element.valor.descripcion}`}</div>
                          <div>
                            <FormControl fullWidth variant="standard">
                              <InputLabel>Email</InputLabel>
                              <Select
                                name="valorId"
                                value={element.valor.flagMail ? true : false}
                                onChange={(e) => {
                                  changeMail(e.target.value as boolean, element.valor.id, index);
                                }}
                                variant="standard">
                                <MenuItem value={true as any}>
                                  <div className="text-green-500">SI</div>
                                </MenuItem>
                                <MenuItem value={false as any} className="text-red-600">
                                  <div className="text-red-500">NO</div>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                          <div>
                            <FormControl fullWidth variant="standard">
                              <InputLabel></InputLabel>
                              <Select
                                name="flagCriterio"
                                value={element.valor.flagCriterio ? true : false}
                                onChange={(e) => {
                                  changeflagCriterio(e.target.value as boolean, index);
                                }}
                                variant="standard">
                                <MenuItem value={true as any}>
                                  <div className="text-green-600"> SI</div>
                                </MenuItem>
                                <MenuItem value={false as any} className="text-red-600">
                                  <div className="text-red-600"> NO</div>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                          {/* <div>
                            {element.valor.flagCriterio ? (
                              <span className="text-green-600">SI</span>
                            ) : (
                              <span className="text-red-600">NO</span>
                            )}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper elevation={3}>
              <div
                className="bg-newsanLighten text-gray-200 rounded-md mb-2 
                            text-center text-xl font-medium">
                Ejemplo de Valores
              </div>
            </Paper>
            <div
              className="border-red-500 border-2 rounded-2xl shadow-xl overflow-hidden 
                            sm:transform hover:-translate-x-1/2 hover:scale-200 transition duration-1000">
              <img src={`${import.meta.env.BASE_URL}images/AuditValores.png`} />
            </div>
          </Grid>
        </Grid>
      </div>
      <ModalCompoment title="Creacion de tipo de auditoria" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <AuditTypeForm callbackFunction={callbackNewAuditType} setpopup={setModalOpen} />
      </ModalCompoment>
    </div>
  );
};
