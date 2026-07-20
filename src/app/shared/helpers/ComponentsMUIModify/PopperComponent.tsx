import { MoreHorizRounded } from "@mui/icons-material";
import { IconButton, Popper, Fade, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface IProps<T> {
  elemento: T;
  elementoIndex: (item: T) => string | number;
  children?: React.ReactNode;
  showElement?: React.ReactNode | JSX.Element;
  customChildren?: React.ReactNode | JSX.Element;
}

const POPPER_Z_INDEX = 1300;
const HOVER_TIMEOUT_MS = 200;

export const PopperComponent = <T,>({ elemento, elementoIndex, children, showElement, customChildren }: IProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeoutPopperRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useTheme();

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutPopperRef.current) {
      clearTimeout(timeoutPopperRef.current);
      timeoutPopperRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, [clearCurrentTimeout]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
      clearCurrentTimeout();
      setAnchorEl(event.currentTarget);
    },
    [clearCurrentTimeout]
  );

  const handleClose = useCallback(() => {
    clearCurrentTimeout();
    timeoutPopperRef.current = setTimeout(() => {
      setAnchorEl(null);
      timeoutPopperRef.current = null;
    }, HOVER_TIMEOUT_MS);
  }, [clearCurrentTimeout]);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (anchorEl) {
        clearCurrentTimeout();
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl, clearCurrentTimeout]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        clearCurrentTimeout();
        setAnchorEl(null);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle(event as unknown as React.MouseEvent<HTMLElement>);
      }
    },
    [clearCurrentTimeout, handleToggle]
  );

  const open = Boolean(anchorEl);
  const id = open ? `popper-${elementoIndex(elemento)}` : undefined;

  return (
    <div className="relative pointer-events-auto no-hover-zone" onMouseLeave={handleClose}>
      <IconButton
        onMouseEnter={handleOpen}
        onFocus={handleOpen}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-describedby={id}
        aria-haspopup="menu"
        aria-expanded={open}>
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
        style={{ zIndex: POPPER_Z_INDEX }}
        onMouseEnter={clearCurrentTimeout}>
        {({ TransitionProps }) =>
          customChildren ? (
            <Fade {...TransitionProps} timeout={300}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "var(--background-color)",
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
                  backgroundColor: "var(--background-color)",
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
