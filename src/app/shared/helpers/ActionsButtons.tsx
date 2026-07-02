import { Add, AddPhotoAlternate, Delete, Edit, Image, Info, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
interface Props {
  row: any;
  addTitle?: string;
  addColor?: "success" | "error" | "warning" | "info";
  viewTitle?: string;
  infoTitle?: string
  viewColor?: "success" | "error" | "warning" | "info";
  imageTitle?: string;
  onEditProps?: (row) => void;
  onDeleteProps?: (row) => void;
  onInfoProps?: (row) => void;
  onAddProps?: (row) => void;
  onViewProps?: (row) => void;
  onImageProps?: (row) => void
  edit?: boolean;
  eliminar?: boolean;
  info?: boolean;
  add?: boolean;
  view?: boolean;
  image?: boolean
  sinImagen?: boolean
  disabled?: boolean;
  mostrarIconoImagen?: boolean
}
/**
 * @param row: es la data que se le pasa como objecto;
 * @param addTitle?: es el titulo que se le pued poner al agregar;
 * @param addColor:string, se le pasa el color que queres ponerle al boton add ;
 * @param onEditProps?: (row) => void; es la funcion que te manda a llamar cuando apretas el boton edit, se le pasa un callback;
 * @param onDeleteProps?: (row) => void; es la funcion que te manda a llamar cuando apretas el boton delete, se le pasa un callback;
 * @param onInfoProps?: (row) => void; es la funcion que te manda a llamar cuando apretas el boton info, se le pasa un callback;
 * @param onAddProps?: (row) => void; es la funcion que te manda a llamar cuando apretas el boton add, se le pasa un callback;
 * @param edit?: boolean, poner en props si quiere mostrar el boton;
 * @param eliminar?: boolean, poner en props si quiere mostrar el boton;
 * @param info?: boolean, poner en props si quiere mostrar el boton;
 * @param add?: boolean, poner en props si quiere mostrar el boton;
 * @param disabled?: boolean, poner en los botones disabled;
 * @returns Botones de acciones para usar en una tabla o donde se requiera;
 */
export const ActionsButtons = (props: Props) => {
  const {
    sinImagen,
    row,
    addTitle = "Agregar",
    infoTitle = "Info",
    addColor = "",
    imageTitle = "",
    viewTitle = "Agregar",
    viewColor = "",
    onDeleteProps,
    onEditProps,
    onInfoProps,
    onAddProps,
    onViewProps,
    onImageProps,
    eliminar = false,
    edit = false,
    info = false,
    add = false,
    view = false,
    disabled = false,
    image = false,
    mostrarIconoImagen
  } = props;
  return (
    <div className="flex w-full justify-end sm:justify-start gap-4 ml-3">
      {edit && (
        <div>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                onEditProps(row);
              }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              <Edit />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {eliminar && (
        <div>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => {
                onDeleteProps(row);
              }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {info && (
        <div>
          <Tooltip title={infoTitle}>
            <IconButton
              onClick={() => {
                onInfoProps(row);
              }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              <Info color="info" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {add && (
        <div>
          <Tooltip title={addTitle}>
            <IconButton
              onClick={() => {
                onAddProps(row);
              }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              {addColor == "" && <Add />}
              {addColor == "success" && <Add color="success" />}
              {addColor == "error" && <Add color="error" />}
              {addColor == "warning" && <Add color="warning" />}
              {addColor == "info" && <Add color="info" />}
            </IconButton>
          </Tooltip>
        </div>
      )}
      {view && (
        <div>
          <Tooltip title={viewTitle}>
            <IconButton
              onClick={() => {
                onViewProps(row);
              }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              {viewColor == "" && <Visibility />}
              {viewColor == "success" && <Visibility color="success" />}
              {viewColor == "error" && <Visibility color="error" />}
              {viewColor == "warning" && <Visibility color="warning" />}
              {viewColor == "info" && <Visibility color="info" />}
            </IconButton>
          </Tooltip>
        </div>
      )}
      {image && (
        <div>
          <Tooltip title={imageTitle}>
            <IconButton onClick={() => {
              onImageProps(row)
            }}
              disabled={disabled}
              size="small"
              style={{ position: "relative" }}>
              <Image color="secondary" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {mostrarIconoImagen && (
        <>
          {sinImagen && sinImagen ? (
            <div>
              <Tooltip title="Actualizar Imagen">
                <IconButton onClick={() => {
                  onImageProps(row)
                }}
                  disabled={disabled}
                  size="small"
                  style={{ position: "relative" }}>
                  <Image color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div>
              <Tooltip title="Asignar Imagen">
                <IconButton onClick={() => {
                  onImageProps(row)
                }}
                  disabled={disabled}
                  size="small"
                  style={{ position: "relative" }}>
                  <AddPhotoAlternate color="secondary" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </>
      )}
    </div>
  );
};
