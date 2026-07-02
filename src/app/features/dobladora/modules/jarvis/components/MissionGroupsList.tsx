import React, { useState } from 'react';
import './MissionGroupsList.css';
import { JarvisMision } from './JarvisMision';
import PropTypes from 'prop-types';

// Modal component
const Modal = ({ content, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button2" onClick={onClose}>x</button>
        <div>
        <JarvisMision missionContent={content} />
        </div>
      </div>
    </div>
  );
};
//para las props
Modal.propTypes = {
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const MissionGroupsList = ({ missionGroups }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index);
    const groupContent = index ;
    setModalContent(groupContent);
    console.log(groupContent);
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <div className="containerr">
      <div className="header">
        <h1 className='h11'>Seleccione el Área</h1>
      </div>
      <ul>
        {missionGroups.map((group, index) => {
          const parts = group.name.split(':');
          return (
            <li
              key={group.id}
              className={activeIndex === index ? 'active' : ''}
              onClick={() => handleClick(group.guid)}
            >
              {parts.length > 1 ? (
                <>
                  <span className="prefix">{parts[0]}:</span>
                  <span className="suffix">{parts[1]}</span>
                </>
              ) : (
                group.name
              )}
            </li>
          );
        })}
      </ul>
      {modalContent && (
        <Modal content={modalContent} onClose={handleCloseModal} />
      )}
    </div>
  );
};
MissionGroupsList.propTypes = {
  missionGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      guid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MissionGroupsList;
