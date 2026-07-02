import axios from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic RGlzdHJpYnV0b3I6NjJmMmYwZjFlZmYxMGQzMTUyYzk1ZjZmMDU5NjU3NmU0ODJiYjhlNDQ4MDY0MzNmNGNmOTI5NzkyODM0YjAxNA=='
};
const host = 'robott/api/v2.0.0/';

export const abortarMision = async () => {
    try {
        const response = await axios.delete(`${host}mission_queue`, { headers });
        console.log('Mision pendientes canceladas', response.data);
    } catch (error) {
        console.error('problemon  con la solicitud de axios:', error);
    }
};

export const AxioMissionGroups = async () => {
    const response = await axios.get(`${host}mission_groups`, { headers });
    if (!response) {
        throw new Error('Error axios mission groups');
    }
    const data = await response.data;
    console.log('esto es en los servicios ',data);
    return data;
};

export const getStatusAndBattery = async () => {
    try {
      const response = await axios.get(`${host}status`, { headers });
      const data = response.data;
      return {
        estadoActual: data.state_text,
        batteryPercentage: Math.floor(data.battery_percentage)
      };
    } catch (error) {
      console.error('ProblemON con la solicitud :', error);
    }
  };