import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { DotaPuestoForm } from "./DotaPuestoForm";
import { DotaSectorForm } from "./DotaSectorForm";
import { DotaFamiliaForm } from "./DotaFamiliaForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

export const DotacionesFormulariosButtom = (props: any) => {
  const classButtons = MaterialButtons();
  const [modalPuesto, setModalPuesto] = useState(false);
  const [modalSector, setModalSector] = useState(false);
  const [modalFamilia, setModalFamilia] = useState(false);

  const { setRefreshFamilia } = props; //Refresca las familas

  return (
    <div>
      <Accordion sx={{ marginBottom: "10px" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content">
          <Typography sx={{ textAlign: "center", justifyContent: "center", width: "100%" }}>ALTA DATOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex justify-around">
            <div>
              <Button className={classButtons.purpleButton} onClick={() => setModalPuesto(true)}>
                Crear puesto
              </Button>
              <ModalCompoment openPopup={modalPuesto} setOpenPopup={setModalPuesto} title={"Puestos"}>
                <DotaPuestoForm></DotaPuestoForm>
              </ModalCompoment>
            </div>
            <div>
              <Button className={classButtons.purpleButton} onClick={() => setModalSector(true)}>
                Crear sector
              </Button>
              <ModalCompoment openPopup={modalSector} setOpenPopup={setModalSector} title={"Sectores"}>
                <DotaSectorForm></DotaSectorForm>
              </ModalCompoment>
            </div>
            <div>
              <Button className={classButtons.purpleButton} onClick={() => setModalFamilia(true)}>
                Crear familia
              </Button>
              <ModalCompoment openPopup={modalFamilia} setOpenPopup={setModalFamilia} title={"Familias/Modelos"}>
                <DotaFamiliaForm setRefreshFamilia={setRefreshFamilia}></DotaFamiliaForm>
              </ModalCompoment>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
