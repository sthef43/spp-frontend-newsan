import React, { useState, useEffect } from "react";
import MissionGroupsComponent from "./components/MissionGroupComponent";
import "./Jarvis.css";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

export const Jarvis = () => {
  const { TitleChanger } = useTitleOfApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    openModal();
    TitleChanger("jarvis");
  }, []);

  return (
    <div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <MissionGroupsComponent />
          </div>
        </div>
      )}
    </div>
  );
};
