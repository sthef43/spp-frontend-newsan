import React, { useState, useEffect } from 'react';
import { AxioMissionGroups } from  'app/services/jarvis/connectJarvis';
import MissionGroupsList from './MissionGroupsList';

const MissionGroupsComponent = (showMissionDetails ) => {
  const [missionGroups, setMissionGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMissionGroups = async () => {
      try {
        const data = await AxioMissionGroups();
                // Filtrar los grupos que contienen "AREA"
                const filteredData = data.filter(group => group.name.includes('Área'));
                setMissionGroups(filteredData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getMissionGroups();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <MissionGroupsList missionGroups={missionGroups} />;
};

export default MissionGroupsComponent;
