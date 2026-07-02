/* eslint-disable unused-imports/no-unused-vars */
import { MoreHorizRounded } from "@mui/icons-material";
import { IconButton, Popper, Fade } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";

interface Props<T> {
  elemento: T;
  elementoIndex: (item: T) => string | number;
  children?: React.ReactNode;
  showElement?: React.ReactNode | JSX.Element;
  customChildren?: React.ReactNode | JSX.Element;
}

export const PopperComponent = <T,>({ elemento, elementoIndex, children, showElement, customChildren }: Props<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeoutPopperRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timeoutPopperRef.current) {
      clearTimeout(timeoutPopperRef.current);
      timeoutPopperRef.current = null;
    }
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    return () => {
      if (timeoutPopperRef.current) clearTimeout(timeoutPopperRef.current);
    };
  }, []);

  const handleMouseLeave = () => {
    timeoutPopperRef.current = setTimeout(() => {
      setAnchorEl(null);
      timeoutPopperRef.current = null;
    }, 50);
  };

  const open = Boolean(anchorEl);
  const id = open ? `popper-${elementoIndex(elemento)}` : undefined;

  return (
    <div className="relative pointer-events-auto no-hover-zone" onMouseLeave={handleMouseLeave}>
      <IconButton onMouseEnter={handleMouseEnter} aria-describedby={id}>
        {showElement ? showElement : <MoreHorizRounded />}
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        modifiers={[
          {
            name: "preventOverflow",
            options: { boundary: "viewport" }
          }
        ]}
        style={{ zIndex: 1300 }}
        onMouseEnter={() => {
          if (timeoutPopperRef.current) clearTimeout(timeoutPopperRef.current);
        }}>
        {({ TransitionProps }) =>
          customChildren ? (
            <Fade {...TransitionProps} timeout={300}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "var(--secondary-color)",
                  zIndex: 10,
                  minWidth: "25rem",
                  borderRadius: "12px",
                  boxShadow: 3
                }}>
                {customChildren}
              </Box>
            </Fade>
          ) : (
            <Fade {...TransitionProps} timeout={300}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "var(--secondary-color)",
                  zIndex: 10,
                  minWidth: "15rem",
                  borderRadius: "12px",
                  boxShadow: 3
                }}>
                <section className="p-2">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-xl font-bold">Acciones</p>
                  </div>
                  <div className="px-2 py-2 mt-2 flex flex-col gap-y-2">{children}</div>
                </section>
              </Box>
            </Fade>
          )
        }
      </Popper>
    </div>
  );
};
