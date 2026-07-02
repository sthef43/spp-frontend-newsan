import { IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { IDotaSector } from "app/models/IDotaSector";
import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { DotacionEditCantidad } from "./DotacionEditCantidad";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { DotaSectorPuestoSliceRequests } from "app/Middleware/reducers/DotaSectorPuestoSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Delete, Edit } from "@mui/icons-material";
interface props {
  arraySectoresPuestos: IDotaSectorPuesto[];
  setArraySectoresPuestos: any;
  sector: IDotaSector;
  refreshSectoresPuestos: any; //refresca los sectores y puestos al agregar o editar.
  editando: boolean;
}
export const PuestosRender = ({
  sector,
  setArraySectoresPuestos,
  arraySectoresPuestos,
  refreshSectoresPuestos,
  editando
}: props) => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [sectorPuestoEdit, setSectorPuestoEdit] = useState<IDotaSectorPuesto>();
  const { openNotificationUI } = useNotificationUI();

  const eliminar = async (sectorPuestoDelete: IDotaSectorPuesto) => {
    //Si esta editando, elimina en BD.
    if (editando) {
      unwrapResult(await dispatch(DotaSectorPuestoSliceRequests.deleteRequest(sectorPuestoDelete.id)));
      openNotificationUI("Eliminado exitosamente :)", "success");
      refreshSectoresPuestos();
    } else {
      //Si no esta editando, y solamente esta creando la estructura por primera vez,
      //Elimina solamente del array sin ir a la BD.
      eliminadoFront(sectorPuestoDelete);
    }
  };

  const eliminadoFront = (dotaSectorPuestoEliminar: IDotaSectorPuesto) => {
    const result = arraySectoresPuestos.filter(
      (x) => x.dotaSector.nombre !== sector.nombre || x.dotaPuesto.nombre !== dotaSectorPuestoEliminar.dotaPuesto.nombre
    );
    setArraySectoresPuestos([...result]);
  };

  const editarCantidad = (sectorPuesto: IDotaSectorPuesto) => {
    setOpenModal(true);
    setSectorPuestoEdit(sectorPuesto);
    refreshSectoresPuestos();
  };

  return (
    <div>
      {arraySectoresPuestos &&
        arraySectoresPuestos.map((sectorPuesto) => (
          <div key={sectorPuesto.id}>
            {sectorPuesto.dotaSector.nombre == sector.nombre && (
              <div className="flex justify-between">
                <div>
                  <Typography variant={arraySectoresPuestos.length > 3 ? "h6" : "h5"}>
                    {sectorPuesto.cantidad} {" - " + sectorPuesto.dotaPuesto.nombre}
                  </Typography>
                </div>
                <div>
                  <IconButton
                    onClick={() => editarCantidad(sectorPuesto)}
                    size="small"
                    style={{ position: "relative" }}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => eliminar(sectorPuesto)} size="small" style={{ position: "relative" }}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        ))}
      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title={"Alta dotacion."}>
        <DotacionEditCantidad
          sectorPuestoEdit={sectorPuestoEdit}
          setOpenModal={setOpenModal}
          refreshSectoresPuestos={refreshSectoresPuestos}></DotacionEditCantidad>
      </ModalCompoment>
    </div>
  );
};
