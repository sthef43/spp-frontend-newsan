import { Button } from "@mui/material";
import React from "react";
import { MaterialButtons } from "../components/material-ui/MaterialButtons";

interface IFormbuttons {
  onCancel: () => void;
  submitName?: string;
  disabledFunction?: () => boolean;
  disabled?: boolean;
}

export const FormButtons = ({ onCancel, submitName, disabledFunction, disabled }: IFormbuttons): JSX.Element => {
  const buttonDisabled = disabledFunction ? disabledFunction() : false;
  const buttonDisabledOpcion2 = disabled ? disabled : false;
  const buttonClasses = MaterialButtons();

  return (
    <div className="flex justify-center gap-x-4">
      <div className="mt-4">
        <Button
          disabled={buttonDisabled || buttonDisabledOpcion2}
          className={buttonClasses.greenButton}
          type="submit"
          variant="contained">
          {submitName ? submitName : "Guardar"}
        </Button>
      </div>
      <div className="mt-4">
        <Button className={buttonClasses.redButton} type="button" variant="contained" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
