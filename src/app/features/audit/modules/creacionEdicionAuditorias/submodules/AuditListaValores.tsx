/* eslint-disable unused-imports/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Typography,
  Button,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  IconButton
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IAuditBloq } from "app/models/IAuditBloq";
import { BloqSliceRequests } from "app/features/audit/slices/BloqSlice";
import { IBloq } from "app/models/IBloq";
import CloseIcon from "@mui/icons-material/Close";
import produce from "immer";
import { INivelItem } from "app/models/INivelItem";
import { NivelItemSliceRequests } from "app/Middleware/reducers/NivelItemSlice";
import { IAppUser } from "app/models/IAppUser";
import { IPermisos } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Image } from "@mui/icons-material";
import { AuditImageBloq } from "app/features/audit/modules/creacionEdicionAuditorias/components/AuditImageBloq";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AuditBloqForm } from "../modals/AuditBloqForm";
import { unwrapResult } from "@reduxjs/toolkit";
export const ArrAuditBloqSelector = (props: {
  callback: (ArrAuditBloq: IAuditBloq[]) => void;
  showButton: boolean;
  ArrAuditBloq?: IAuditBloq[];
}): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const permisos: IPermisos = useAppSelector<IAppUser>((state) => state.authentification.data.permisos as any);
  // function onInit(result: IBloq[]) {
  //   return result.filter((x) => x.rolId == permisos.rolId);
  // }
  const ref = useRef(true);
  const [ModalOpen, setModalOpen] = useState(false);
  const [ModalOpenImagen, setModalOpenImagen] = useState(false);
  const [bloqIndex, setBloqIndex] = useState(null);
  const [auditBloqSelect, setAuditBloqSelect] = useState<IAuditBloq>(null);
  //Comento esto por que cada vez que creabas un nuevo bloque en la BDD, no se podia actualizar el listado de los bloques, Lo cambie por una funcion q se puede llamar y se actualiza cada vez que agregas.
  /* const { State: ArrBloq, setState: setArrBloq } = useFetchApi<IBloq[]>(
    BloqSliceRequests.getAllRequest,
    undefined,
    onInit
  ); */
  const [ArrBloq, setArrBloq] = useState([]);
  const [selectedArrAuditBloq, setSelectedArrAuditBloq] = useState<IAuditBloq[]>(props.ArrAuditBloq || []);
  const { State: ListnivelItem } = useFetchApi<INivelItem[]>(NivelItemSliceRequests.getAllRequest);

  const getListBloq = async () => {
    const result = unwrapResult(await dispatch(BloqSliceRequests.getAllRequest()));
    if (result) {
      const newResult = result.filter((x) => x.rolId == permisos.rolId);
      setArrBloq(newResult);
      // console.log("meti esto");
      // console.log(newResult);
    }
  };

  const addBloq = () => {
    const bloq: IAuditBloq = { deleted: false, imagen: "sinImagen" };
    setSelectedArrAuditBloq(
      produce((draft) => {
        draft.push(bloq);
      })
    );
  };

  const handleChange = (event: any, index: number) => {
    setBloqIndex(index);
    const varSelectedArrAuditBloq = ArrBloq.find((x) => x.id === event.target.value);
    if (varSelectedArrAuditBloq) {
      setSelectedArrAuditBloq(
        produce((draft) => {
          draft[index].bloq = varSelectedArrAuditBloq;
        })
      );
    }
  };

  const handleChangeImage = (elementBloq: IAuditBloq, index: number) => {
    if (selectedArrAuditBloq[index].bloq) {
      setAuditBloqSelect(elementBloq);
      setBloqIndex(index);
      setModalOpenImagen(true);
    } else {
      openNotificationUI("Primero seleccione  un tipo de valor", "error");
    }
  };

  // const handleEditAudit = (elementBloq: IAuditBloq, index: number) => {
  //   if (selectedArrAuditBloq[index].bloq) {
  //     setAuditBloqSelect(elementBloq);
  //     setBloqIndex(index);
  //     setModalOpen(true);
  //   } else {
  //     openNotificationUI("Primero seleccione  un tipo de valor", "error");
  //   }
  // };

  useEffect(() => {
    if (selectedArrAuditBloq.length > 0) {
      props.callback(selectedArrAuditBloq);
    }
  }, [selectedArrAuditBloq]);
  const removeItem = (numberElement) => {
    // console.log(numberElement);
    //si esta en el bloque ya con id lo deleteo
    if (selectedArrAuditBloq?.[numberElement]?.id > 0) {
      setSelectedArrAuditBloq(
        produce((draft) => {
          draft[numberElement].deleted = true;
          return draft;
        })
      );
    } else {
      setSelectedArrAuditBloq(
        produce((draft) => {
          draft.splice(numberElement, 1);
          return draft;
        })
      );
    }
  };

  const llamar = () => {
    getListBloq();
  };

  useEffect(() => {
    llamar();
  }, []);

  const callbackNewArrAuditBloq = useCallback((selectedArrAuditBloqs: IBloq) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const bloq: IAuditBloq = {
      bloq: { ...selectedArrAuditBloqs }
    };
    // console.log("esto estoy metiendo en callbacknewArrAuditBloq");
    // console.log(bloq);
    //Comento esto por que cuando agregabas un nuevo bloque, se duplicaba el array de los bloques.
    /* try {
      setSelectedArrAuditBloq(
        produce((draft) => {
          draft.push(bloq);
        })
      );
    } catch (e) {
      console.log(e);
    } */
    llamar();
  }, []);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="pb-3 font-bold text-center"> Selección de los bloques y sus respectivos items</div>
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid item xs={12} md={9}>
            {!ArrBloq ? (
              <Skeleton animation="wave" />
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <Button
                    color="primary"
                    className={buttonClasses.blueButton}
                    variant="contained"
                    onClick={() => {
                      addBloq();
                    }}>
                    agregar Bloque
                  </Button>
                  <h1>Si Necesita crear un nuevo bloque* {`==>`}</h1>
                  <Button
                    color="primary"
                    className={buttonClasses.blueButton}
                    variant="contained"
                    onClick={() => {
                      setAuditBloqSelect(null);
                      setModalOpen(true);
                    }}>
                    crear Nuevo Bloque
                  </Button>
                </div>

                {selectedArrAuditBloq &&
                  selectedArrAuditBloq.map((elementBloq, index) => {
                    return (
                      elementBloq.deleted == false && (
                        <div key={index} className="flex w-full items-baseline">
                          <Accordion className="w-full">
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                              <Typography>
                                {index + 1}.{elementBloq?.bloq?.name || `Bloque numero ${index + 1}`}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{ padding: 2 }}>
                              <Grid container sx={{ flexGrow: 1 }}>
                                <Grid item xs={12} md={12}>
                                  <Paper elevation={3}>
                                    <FormControl className="m-1 p-1 w-full" variant="standard">
                                      <InputLabel id="demo-simple-select-filled-label">Tipo de Valores</InputLabel>

                                      <Select
                                        value={selectedArrAuditBloq?.[index]?.bloq?.id ?? {}}
                                        onChange={(event) => {
                                          handleChange(event, index);
                                        }}
                                        variant="standard">
                                        {ArrBloq &&
                                          ArrBloq.map((element, _x) => (
                                            <MenuItem key={element.id} value={element.id as any}>
                                              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
                                                <div>{`${element.name}`}</div>
                                              </div>
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                  </Paper>
                                </Grid>

                                <div className="w-full bg-newsanLighten my-2 px-2 shadow-elevation-4 text-gray-200 rounded-md mb-2 text-center text-xl font-medium">
                                  Items del bloque
                                </div>

                                <Grid item xs={12} md={12}>
                                  {elementBloq && (
                                    <div className="p-2 mx-2 flex relative text-lg font-medium">
                                      <div
                                        className="
                                                              border-red-500 border-2 py-3 rounded-2xl shadow-elevation-6 transform  rotate-180"
                                        style={{
                                          //textOrientation: "sideways-right",
                                          writingMode: "vertical-lr"
                                        }}>
                                        <span>{elementBloq?.bloq?.name}</span>
                                      </div>

                                      <div className="w-full px-2">
                                        {elementBloq?.bloq?.itemBloq?.map((element, x) => (
                                          <div
                                            className="grid grid-cols-6 border-t-2 border-gray-900 dark:border-gray-200 gap-1 w-full text-lg"
                                            key={x}>
                                            <div className="col-span-5">{`${element.item?.name}`}</div>
                                            <div className="border-l-2 border-gray-900 dark:border-gray-200 px-2">
                                              {`${
                                                ListnivelItem
                                                  ? ListnivelItem.find((x) => x.id == element.item?.nivelItemId)?.name
                                                  : null
                                              }`}
                                            </div>
                                          </div>
                                        ))}
                                        <div className="border-t-2 border-gray-900"></div>
                                      </div>
                                    </div>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                          <div>
                            {elementBloq?.id && (
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  handleChangeImage(elementBloq, index);
                                }}
                                size="large">
                                <Image />
                              </IconButton>
                            )}
                          </div>
                          {/* Comento este editar por que si editas los item del bloque, se cambia a todas las auditorias que usan ese bloque. */}
                          {/*        <div>
                            <Tooltip title="Editar Auditoria">
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  handleEditAudit(elementBloq, index);
                                }}
                                size="large">
                                <Create />
                              </IconButton>
                            </Tooltip>
                          </div> */}
                          <div className="w-min">
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                removeItem(index);
                              }}
                              size="large">
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      )
                    );
                  })}
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={6}>
              <div
                className="bg-newsanLighten text-gray-200 rounded-md mb-2 
                            text-center text-xl font-medium">
                Ejemplo de Bloque
              </div>
            </Paper>
            <div
              className="border-red-500 border-2 rounded-2xl shadow-xl overflow-hidden center
                            md:transform hover:-translate-x-1/2 hover:scale-200 transition duration-1000">
              <img src={`${import.meta.env.BASE_URL}images/AuditBloque.png`} />
            </div>
          </Grid>
        </Grid>
      </div>
      <footer>*Para agregar imagen al bloque puede hacerlo editando la auditoria</footer>
      <ModalCompoment title="Ingresar imagen a bloque" openPopup={ModalOpenImagen} setOpenPopup={setModalOpenImagen}>
        <AuditImageBloq
          bloqIndex={bloqIndex}
          auditBloqSelect={auditBloqSelect}
          setSelectedArrAuditBloq={setSelectedArrAuditBloq}
          setOpenPopup={setModalOpenImagen}
        />
      </ModalCompoment>
      {
        <ModalCompoment
          title={auditBloqSelect ? "Editar Bloque" : "Nuevo Bloque"}
          openPopup={ModalOpen}
          setOpenPopup={setModalOpen}>
          <AuditBloqForm
            //auditBloqSelect={auditBloqSelect}
            callbackFunction={callbackNewArrAuditBloq}
            setOpenPopup={setModalOpen}
          />
        </ModalCompoment>
      }
    </div>
  );
};
