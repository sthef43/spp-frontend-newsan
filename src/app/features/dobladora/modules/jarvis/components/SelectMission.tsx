import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './SelectMission.css';  // importamos el archivo CSS


export const SelectMission = ({ host , headers, onMissionSelect,missionGrupGuid }) => {
    const [missions, setMissions] = useState([]);
    const [selectedMissionGuid, setSelectedMissionGuid] = useState('');

    useEffect(() => {
        const axiosMissions = async () => {
            try {
                const response = await axios.get(`${host}mission_groups/${missionGrupGuid}/missions`, { headers });
                console.log('Todas las misiones:', response.data);
                setMissions(response.data);
            } catch (error) {
                console.error('Error en la solicitud de misiones disponibles:', error);
            }
        };
        axiosMissions();
    }, []);
// }, [host, groupId, missionPath, headers]);

    const handleChange = (event) => {
        const selectedGuid = event.target.value;
        setSelectedMissionGuid(selectedGuid);
        console.log('GUID de la misión seleccionada:', selectedGuid);

        const selectedMission = missions.find(mission => mission.guid === selectedGuid);
        if (selectedMission) {
            onMissionSelect(selectedMission);
        } else {
            onMissionSelect('');
        }
    };
    return (
        <div className="select-container">
            <select id="mission-select" value={selectedMissionGuid} onChange={handleChange}>
                <option value="">Seleccione Misión...</option>
                {missions.map((mission) => (
                    <option key={mission.guid} value={mission.guid}>
                        {mission.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

SelectMission.propTypes = {
    host: PropTypes.string.isRequired,
    headers: PropTypes.object.isRequired,
    onMissionSelect: PropTypes.func.isRequired,
    missionGrupGuid: PropTypes.string.isRequired,
  };


