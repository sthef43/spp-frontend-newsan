/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { IBateasDTO } from "../../models/IBateasDTO";
import { IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { PlacasBateasModal } from "../GenerarLpnPadre/PlacasBateasModal";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const ExaminarContenidoModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control } = useForm();

  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [openModalExaminarPlacas, setOpenModalExaminarPlacas] = useState<boolean>(false);
  const [codigoBatea, setCodigoBatea] = useState("");

  const [listaBateas, setListaBateas] = useState<IBateasDTO[]>([]);
  FetchApi<IBateasDTO[]>(
    TrazaOperacionesSliceRequests.GetAllPuntIntoContainerById,
    contenedor.id,
    false,
    openModal,
    setListaBateas,
    true
  );

  const handlePlacasBateasModal = (codigoBatea: string) => {
    setCodigoBatea(codigoBatea);
    setOpenModalExaminarPlacas(true);
  };

  return (
    <main>
      {listaBateas && listaBateas.length > 0 && (
        <section className="flex flex-col mt-4 gap-y-2">
          {listaBateas.map((elementos, index) => (
            <figure
              key={index}
              className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors cursor-pointer">
              <div>
                <h2 className="mb-2">{elementos.bateas}</h2>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <div>
                  <Tooltip title="Examinar Placas">
                    <span>
                      <IconButton
                        size="small"
                        style={{ position: "relative" }}
                        onClick={() => {
                          handlePlacasBateasModal(elementos.bateas);
                        }}>
                        <Visibility color="primary" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </div>
            </figure>
          ))}
        </section>
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalExaminarPlacas}
        openPopup={openModalExaminarPlacas}
        title="Placas En la batea">
        <PlacasBateasModal
          openModal={openModalExaminarPlacas}
          setOpenModal={setOpenModalExaminarPlacas}
          codigoBatea={codigoBatea}
        />
      </ModalCompoment>
    </main>
  );
};
