import React, { useState, useRef } from "react";
import { IconButton, Popper, Fade, Box } from "@mui/material";
import { MoreHorizRounded, DeleteRounded, VisibilityRounded } from "@mui/icons-material";
import { ITickets } from "../../models/ITickets";

interface Props {
  elemento: ITickets;
  accionesTickets: { habilitarEliminar: boolean; verTrazabilidad: boolean };
  onDelete: (ticketSeleccionado: ITickets, event: React.MouseEvent<HTMLElement>) => void;
  onTrace: (ticketSeleccionado: ITickets, event: React.MouseEvent<HTMLElement>) => void;
}

export const PopperTicket: React.FC<Props> = ({ elemento, accionesTickets, onDelete, onTrace }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeoutPopperRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timeoutPopperRef.current) clearTimeout(timeoutPopperRef.current);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    timeoutPopperRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 50);
  };

  const open = Boolean(anchorEl);
  const id = open ? `popper-ticket-${elemento.id}` : undefined;

  return (
    <div className="relative pointer-events-auto no-hover-zone" onMouseLeave={handleMouseLeave}>
      <IconButton onMouseEnter={handleMouseEnter} aria-describedby={id}>
        <MoreHorizRounded />
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        onMouseEnter={() => {
          if (timeoutPopperRef.current) clearTimeout(timeoutPopperRef.current);
        }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={50}>
            <Box
              sx={{
                border: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "var(--secondary-color)",
                zIndex: 1600,
                width: "15rem",
                borderRadius: "6px",
                boxShadow: 3
              }}>
              <div className="p-2">
                <p className="text-xl">Acciones</p>
              </div>
              <hr />
              <div className="flex flex-col">
                {accionesTickets.habilitarEliminar && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(elemento, e);
                      setAnchorEl(null);
                    }}
                    className="flex flex-row items-center gap-x-2 p-3 cursor-pointer hover:text-blue-500 hover:bg-gray-100 transition-all">
                    <DeleteRounded color="error" />
                    <p className="text-xs">Dar de baja ticket</p>
                  </div>
                )}
                {accionesTickets.verTrazabilidad &&
                  elemento.ticketsTrazabilidad &&
                  elemento.ticketsTrazabilidad.length > 0 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrace(elemento, e);
                        setAnchorEl(null);
                      }}
                      className="flex flex-row items-center gap-x-2 p-3 cursor-pointer hover:text-blue-500 hover:bg-gray-100 transition-all">
                      <VisibilityRounded color="primary" />
                      <p className="text-xs">Examinar Trazabilidad</p>
                    </div>
                  )}
              </div>
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
