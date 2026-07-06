import { Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISupermaestro } from "app/models/ISupermaestro";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
interface Props {
  generico: string;
}

export const SupermaestroLoadExcel = ({ generico }: Props) => {
  const hiddenFileInput: any = React.useRef(null);
  const [data, setData] = useState(null);
  const [dataSubmit, setDataSubmit] = useState(null);
  const [url, setUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const OnSubmit = async () => {
    try {
      // Copio y repito lo de la fila BPautas ya que se repite los mismo en los cuatros atributos
      const newDataMaped = data.map((obj) => {
        return { ...obj, CodigoPautas: obj.BPautas, BWip: obj.BPautas, CodigoWip: obj.BPautas };
      });
      const response = await dispatch(SupermaestroSliceRequest.multiPostNested(newDataMaped));
      openNotificationUI("Se subio correctamente", "success");
      const refresh = await dispatch(SupermaestroSliceRequest.getByGenerico(generico));
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onFileChange = (event) => {
    const file = event.target.files[0];
    // const file = e.newState[0]?.getRawFile();
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
        cellDates: true,
        dateNF: "dd.mm.yyyy"
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const dataExcel: ISupermaestro[] = XLSX.utils.sheet_to_json(ws);
      console.log(dataExcel);
      /* Update state */
      setData(dataExcel);
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };
  const check = () => {
    const checkData = data.filter((data) => data?.Generico?.length != 0);
    console.log(checkData);
  };
  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };
  const onModal = () => {
    if (data[0].Generico == generico.trim()) {
      setOpenModal(true);
    } else {
      openNotificationUI("El generico del excel no corresponde al generico seleccionado", "error");
    }
  };
  useEffect(() => {
    if (data) {
      check();
      onModal();
    }
  }, [data]);
  return (
    <div>
      {" "}
      <Button
        onClick={handleClick}
        variant="contained"
        className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
        <Upload />
        <span className="hidden sm:block">Importar excel</span>
      </Button>
      <input
        type="file"
        accept=".xlsx"
        name="Importar"
        onChange={onFileChange}
        ref={hiddenFileInput}
        multiple={false}
        className="hidden"
      />
      <ModalCompoment
        openPopup={openModal}
        setOpenPopup={setOpenModal}
        title={"El archivo se cargo correctamente, desea subirlo?"}>
        <div className="flex justify-center gap-4">
          <Button className={buttonClasses.greenButton} onClick={OnSubmit}>
            Confirmar
          </Button>
          <Button className={buttonClasses.redButton} onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </div>
      </ModalCompoment>
    </div>
  );
};
