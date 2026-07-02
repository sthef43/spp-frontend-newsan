import axios from 'axios';
import React,{  useCallback, useEffect, useState,useRef  } from 'react';
import PropTypes from 'prop-types';
import { SelectMission } from './SelectMission';
import cancelIcon from '../asset/cancel.png';
import playIcon from '../asset/play.png';
import pauseIcon from '../asset/pause.png';
import "../components/JarvisMision.css";
import { abortarMision ,getStatusAndBattery} from 'app/services/jarvis/connectJarvis';


export const JarvisMision  = ({ missionContent }) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic RGlzdHJpYnV0b3I6NjJmMmYwZjFlZmYxMGQzMTUyYzk1ZjZmMDU5NjU3NmU0ODJiYjhlNDQ4MDY0MzNmNGNmOTI5NzkyODM0YjAxNA=='
    };
    const host = `/robott/api/v2.0.0/`;
    const postEndpointAndDelete = 'mission_queue';
    const [selectedMissionName, setSelectedMissionName] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [estadoPauseoReady, setEstadoPauseoReady] = useState(0);
    const [batteryPercentage, setBatteryPercentage] = useState(0);
    const [statusRobot, setStatusRobot] = useState('');

    const intervalRef = useRef(null);  // ref para manejar el intervalo
    
    const hacerMission =async (selectedMissionName) => {
        try {
            const dataToSend = {
               mission_id: selectedMissionName.guid
            };
           const postResponse = await axios.post(host + postEndpointAndDelete, dataToSend,{ headers });
           console.log('respuesta del POST:', postResponse.data);
       } catch (error) {
           console.error('problemon  con la solicitud de axios:', error);
       }
       };
    const enviar=async()=>{
        //api para hacer la mission de descarga, osea es una missions
        try {
        const dataToSend ={ 
             mission_id: '0c3e08ca-2e17-11ef-a659-000129af97dd'
           }
        const postResponse = await axios.post(host + postEndpointAndDelete, dataToSend, { headers });
        console.log('respuesta del POST:', postResponse.data);
       } catch (error) {
           console.error('problemon  con la solicitud de axios:', error);}};
    
    const pause = async () => {
        setIsPlaying(!isPlaying);
        //cuando en getStatus este en  ready=3 el boton estara en ready, pause=4 y viceversa
        const newState = { state_id: estadoPauseoReady === 4 ? 3 : 4 };
        try {
            const response = await axios.put(host + 'status', newState, { headers });
            console.log('pausa/ready existoso');
        } catch (error) {
             console.error('Error al pausar a jarvis:', error);}}
   
      //funcion de estado del jarvis 
  const handleGetStatusAndBattery = useCallback(async () => {
    try {
      const { estadoActual, batteryPercentage } = await getStatusAndBattery();
      setBatteryPercentage(batteryPercentage);
      setStatusRobot(estadoActual);
    } catch (error) {
      console.error('Error al obtener el estado y batería de Jarvis', error);
    }
  }, []);

  useEffect(() => {
    // Al montar, empezar a hacer peticiones cada 5 segundos
    intervalRef.current = setInterval(handleGetStatusAndBattery, 5000);
    
    // Limpiar el intervalo al desmontar
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
}, [handleGetStatusAndBattery]);


return (
    <>
        <div className="second-component">
            <div className="header">
                <h2>Seleccione Misión</h2>
            </div>
            <SelectMission
                host={host}
                headers={headers}
                onMissionSelect={setSelectedMissionName}
                missionGrupGuid={missionContent}
            />
            <div className="botones-en-fila">
                <button onClick={()=>hacerMission(selectedMissionName)} className='Llamar'>Llamar</button>
                <button onClick={enviar} className='Enviar'>Enviar</button>
            </div>
            <div className="botones-en-fila">
                <button className='statusPlay' onClick={pause}>
                    <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" className="icon" />
                </button>
                <button onClick={abortarMision} className='cancel'>
                    <img src={cancelIcon} alt="Cancel" className="icon" />
                </button>
            </div>

            <div className="img-Mision">
                <div className="ruta-imagen">
                    <p>Sector: Dobladora</p>
                    <p>Misión: {selectedMissionName ? selectedMissionName.name : "Ninguna misión seleccionada"}</p>
                </div>
                <div className="imagen"></div>
            </div>
        </div>
        
        {/* ////// */}
        <div className='foot'>
        <div className='info-row'>
          <p>Informacion</p>
          <p>Version 1.0</p>
        </div>
        <hr></hr>
        <div className='info-row-two'>
          <p>Estado........... {statusRobot}</p>
          <p>Bateria.......... {batteryPercentage}%</p>
        </div>
      </div>
    </>
);
};
// para validar la props
JarvisMision.propTypes = {
    missionContent: PropTypes.string.isRequired,
};

