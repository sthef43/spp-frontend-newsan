import { Delete, Edit } from "@mui/icons-material";
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { ReparadoresSliceRequests } from "app/Middleware/reducers/ReparadoresSlice";
import { useAppDispatch } from "app/core/store/store";
import { IReparadores } from "app/models/IReparadores";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IconButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ReparadoresForm } from "app/features/trazabilidad/modules/cargarReparadores/modal/ReparadoresForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const Reparadores = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = IconButtons();
  interface initialState {
    planta: string;
  }
  const initialStateVar = {
    planta: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  //Leer Plantas
  const [listPlantas, setListPlantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  //Leer Reparadores por Planta
  const [ListReparadores, setReparadores] = useState([]);
  const getReparadores = async () => {
    if (watchPlantaId) {
      try {
        const responses = unwrapResult(
          await dispatch(ReparadoresSliceRequests.getListByPlantIdRequest(parseInt(watchPlantaId)))
        );
        console.log(responses);
        setReparadores(responses);
      } catch (error) {
        openNotificationUI("Error al leer Reparadores.", "error");
      }
    }
  };

  //Habilitar Lista de Reparadores
  const watchPlantaId = watch("planta");
  useEffect(() => {
    // console.log(watchPlantaId);
    getReparadores();
  }, [watchPlantaId]);

  useEffect(() => {
    TitleChanger("REPARADORES");
    getPlantas();
  }, []);

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Eliminar
  const deleteRow = async (row) => {
    const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(ReparadoresSliceRequests.deleteRequest(row.id)));
        if (response) {
          openNotificationUI("Se elimino el registro correctamente", "success");
          getReparadores();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Agregar
  const agregar = () => {
    if (watchPlantaId) {
      setEditState([]);
      setEstaEditando(false);
      setModalOpen(true);
    } else {
      openNotificationUI("Ingrese Planta.", "error");
    }
  };

  const loginSubmit = async (e) => {
    console.log(e);
  };

  return (
    <div style={{ height: "100%", width: "100vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <div className="mt-2" style={{ width: "60%", textAlign: "center" }}>
                <Controller
                  name="planta"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Planta</InputLabel>
                      <Select {...field} placeholder="Seleccione Planta" variant="standard">
                        {listPlantas &&
                          listPlantas.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.name}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        {/* Visualizo tipo form */}
        <div className="my-2 mx-4 h-full">
          <TableComponent
            Dense={true}
            Overflow={false}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Reparador",
                field: "reparador"
              },
              {
                title: "Código",
                field: "codigo"
              },
              {
                title: "Lineas",
                field: "",
                render: (row: IReparadores) => {
                  return row.lineas.length == 0 ? (
                    <span>SIN LINEA ASIGNADAS</span>
                  ) : (
                    <span>{row.lineas.length} Lineas asignadas</span>
                  );
                }
              },

              {
                title: "Fecha Creación",
                field: "",
                render: (row) => {
                  return moment(row.createdDate).format("L");
                }
              },
              {
                title: "Fecha Modificación",
                field: "",
                render: (row) => {
                  return moment(row.lastModifiedDate).format("L");
                }
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => {
                              editar(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Eliminar">
                          <span>
                            <IconButton
                              onClick={() => {
                                deleteRow(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            agregar={() => {
              agregar();
            }}
            dataInfo={ListReparadores}
          />
        </div>
        <ModalCompoment title="Nuevo Registro Reparadores" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <ReparadoresForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getReparadores}
            estaEditando={estaEditando}
          />
        </ModalCompoment>
      </form>
    </div>
  );
};

// import { Delete, Edit } from "@mui/icons-material";
// import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { PlantSliceRequests } from "app/Middleware/reducers";
// import { ReparadoresSliceRequests } from "app/Middleware/reducers/ReparadoresSlice";
// import { useAppDispatch } from "app/Middleware/store/store";
// import { ModalCompoment } from "app/shared/components/ModalComponent";
// import { TableComponent } from "app/shared/components/Table/TableComponent";
// import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
// import { ReparadoresForm } from "app/shared/components/trazabilidad/reparadores/ReparadoresForm";
// import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
// import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
// import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";

// export const Reparadores = (): JSX.Element => {
//   const { TitleChanger } = useTitleOfApp();
//   const dispatch = useAppDispatch();
//   const { openNotificationUI } = useNotificationUI();
//   const { getConfirmation } = useConfirmationDialog();
//   const buttonClasses = MaterialButtons();
//   interface initialState {
//     planta: string;
//   }
//   const initialStateVar = {
//     planta: ""
//   };

//   const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
//     defaultValues: initialStateVar
//   });

//   //Leer Reparadores por Planta
//   const [listReparadores, setListReparadores] = useState([]);
//   const getReparadores = async () => {
//     try {
//       const responses = unwrapResult(
//         await dispatch(ReparadoresSliceRequests.getListByPlantIdRequest(parseInt(watchPlantaId)))
//       );
//       // const responses = unwrapResult(await dispatch(ReparadoresSliceRequests.getAllRequest()));
//       setListReparadores(responses);
//     } catch (error) {
//       openNotificationUI("Error al leer Reparadores.", "error");
//     }
//   };
//   useEffect(() => {
//     console.log(listReparadores);
//   }, [listReparadores]);

//   //Leer Plantas
//   const [listPlantas, setListPantas] = useState([]);
//   const getPlantas = async () => {
//     try {
//       const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
//       setListPantas(responses);
//     } catch (error) {
//       openNotificationUI("Error al leer plantas.", "error");
//     }
//   };
//   // useEffect(() => {
//   //   console.log(listPlantas);
//   // }, [listPlantas]);

//   //Eliminar
//   const deleteRow = async (row) => {
//     const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
//     if (resp) {
//       try {
//         const response = unwrapResult(await dispatch(ReparadoresSliceRequests.deleteRequest(row.id)));
//         if (response) {
//           openNotificationUI("Se elimino el registro correctamente", "success");
//           // getReparadores();
//         }
//       } catch (error) {
//         openNotificationUI("Error al eliminar el registro.", "error");
//       }
//     }
//   };

//   //Watch
//   // setListReparadores(null);
//   const watchPlantaId = watch("planta");
//   useEffect(() => {
//     getReparadores();
//   }, [watchPlantaId]);

//   //Editar
//   const [estaEditando, setEstaEditando] = useState(false);
//   const [editState, setEditState] = useState(null);
//   const [ModalOpen, setModalOpen] = useState(false);
//   const editar = (rowData) => {
//     setEditState({ ...rowData });
//     setEstaEditando(true);
//     setModalOpen(true);
//   };

//   //Agregar
//   const agregar = () => {
//     if (watchPlantaId) {
//       setEditState({ plantaId: watchPlantaId });
//       setEstaEditando(false);
//       setModalOpen(true);
//     } else {
//       openNotificationUI("Ingrese Planta.", "error");
//     }
//   };

//   //Login Submit
//   const loginSubmit = async (e) => {
//     console.log(e);
//     // console.log(editState);
//     // const objNuevo = {
//     //   ...editState,
//     //   emails: editState.emails==""? e.mail: editState.emails + ";" + e.mail
//     // };
//     // console.log(objNuevo);
//     // try {
//     //   const result = unwrapResult(await dispatch(EmailGroupSliceRequests.PutRequest(objNuevo)));
//     //   openNotificationUI("Agregado...", "success");
//     //   getEmails();
//     //   setValue("mail", "");
//     // } catch (x) {
//     //   openNotificationUI("Error al agregar.", "error");
//     // }
//   };

//   //Genérico
//   useEffect(() => {
//     TitleChanger("REPARADORES");
//     getPlantas();
//     // getReparadores();
//   }, []);

//   return (
//     <div style={{ height: "100%", width: "100vw", position: "relative" }}>
//     <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
//       <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
//         <Grid container spacing={1}>
//           <Grid item xs={3}>
//             <div className="mt-2" style={{ width: "60%" }}>
//               <Controller
//                 name="planta"
//                 control={control}
//                 // rules={{ required: true }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Planta</InputLabel>
//                     <Select {...field} placeholder="Seleccione Planta" variant="standard">
//                       {listPlantas &&
//                         listPlantas.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.name}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//           </Grid>
//         </Grid>
//       </div>
//       <div className="my-2 mx-4 h-full">
//         {listReparadores.length > 0 && (
//           <TableComponent
//             IDcolumn={"id"}
//             Dense={true}
//             buscar={true}
//             excel
//             columns={[
//               {
//                 title: "Reparador",
//                 field: "reparador"
//               },
//               {
//                 title: "Código",
//                 field: "codigo"
//               },
//               {
//                 title: "Fecha Creación",
//                 field: "",
//                 render: (row) => {
//                   return moment(row.createdDate).format("L");
//                 }
//               },
//               {
//                 title: "Fecha Modificación",
//                 field: "",
//                 render: (row) => {
//                   return moment(row.lastModifiedDate).format("L");
//                 }
//               },
//               {
//                 title: "Acciones",
//                 field: "",
//                 render: (row) => {
//                   return (
//                     <div className="flex w-full justify-end sm:justify-start gap-4">
//                       <div>
//                         <Tooltip title="Editar">
//                           <IconButton
//                             onClick={() => {
//                               editar(row);
//                             }}
//                             size="small"
//                             style={{ position: "relative" }}>
//                             <Edit />
//                           </IconButton>
//                         </Tooltip>
//                       </div>
//                       <div>
//                         <Tooltip title="Eliminar">
//                           <span>
//                             <IconButton
//                               onClick={() => {
//                                 deleteRow(row);
//                               }}
//                               size="small"
//                               style={{ position: "relative" }}>
//                               <Delete color="error" />
//                             </IconButton>
//                           </span>
//                         </Tooltip>
//                       </div>
//                     </div>
//                   );
//                 }
//               }
//             ]}
//             agregar={() => {
//               agregar();
//             }}
//             dataInfo={listReparadores}
//           />
//         )}
//         <ModalCompoment title="Nuevo Registro Reparadores" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
//           <ReparadoresForm
//             setOpenPopup={setModalOpen}
//             editState={editState}
//             refresh={getReparadores}
//             estaEditando={estaEditando}
//           />
//         </ModalCompoment>
//       </div>
//       </form>
//     </div>
//   );
// };
