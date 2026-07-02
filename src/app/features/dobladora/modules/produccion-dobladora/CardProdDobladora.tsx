import { IDobProdDeclaracion } from 'app/models/IDobProdDeclaracion';
import { IXXE_WIP_OT } from 'app/models/IXXE_WIP_OT';
import { ModalCompoment } from 'app/shared/components/ModalComponent';
import React, { useEffect, useMemo, useState } from 'react';
import { DeclararProdDIalog } from './DeclararProdDialog';

interface Props {
  data: IXXE_WIP_OT,
  declaraciones: IDobProdDeclaracion[],
  familiaSelected:string,
  onRefreshDeclaraciones: () => void;
}


export const CardProdDobladora = ({data,declaraciones,familiaSelected,onRefreshDeclaraciones}:Props): JSX.Element =>{
const [openDeclaracion, setOpenDeclarancion] = useState(false);
const [dataDeclaracion, setDataDeclaracion] = useState<IDobProdDeclaracion | undefined>(undefined);
const paleta_Colores= ['#ECFEFF','#EFF6FF','#F8F6FF','#F4F4F5'];

const getRandomColor = () => {
  const pos = Math.floor(Math.random() * paleta_Colores.length);
  return paleta_Colores[pos];
}

const getDeclaracionesProduccion = (op:string) =>{
  const cantDeclarada = declaraciones.find(x => x.op === op);
  if(cantDeclarada){
    return cantDeclarada.totalDeclarado;
  }else{
    return 0;
  }
}

  const colorFondo = useMemo( () => getRandomColor(),[])

  const handleClose = () =>{
    setOpenDeclarancion(false);
  }

useEffect(() => {
  const encontrada = declaraciones.find(x => x.op === data.wiP_ENTITY_NAME);
  setDataDeclaracion(encontrada);
}, [openDeclaracion,declaraciones])

return (
  <div>

    <div className='flex flex-col h-full rounded-xl shadow-md border border-gray-200 overflow-hidden min-h-[160px] bg-white hover:cursor-pointer'
    onClick={ (e) =>{
      setOpenDeclarancion(true)}
    }
    >
      
      <div className='w-full bg-blue-100 p-3 border-b border-blue-200'>
          <p className='text-sm font-black text-gray-800 truncate'>{data.segmenT1}</p>
          <p className='text-[11px] text-gray-500 truncate italic'>{data.description || 'Sin descripción'}</p>
      </div>

      
      <div 
        className='w-full p-3 flex-grow space-y-3'
        style={{ backgroundColor: colorFondo }}
      >
          
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-xs font-semibold text-gray-700'>{data.wiP_ENTITY_NAME}</p>
            </div>
          </div>
    
          {/* 09:20 --> op total - dec prod - dec ebs */}
          <div className='w-full bg-gray-200 rounded-full h-1.5'> 
              <div 
                className='bg-green-500 h-1.5 rounded-full' 
                style={{ 
                  width: `${Math.min(
                    ((Number(getDeclaracionesProduccion(data.wiP_ENTITY_NAME))) / Number(data.starT_QUANTITY)) * 100, 
                    100
                  )}%` 
                }}
              >    
              </div>
          </div>

          <div className='flex justify-between border-t border-black/5 pt-2'>
              <div className='text-center'>
                  <p className='text-[9px] uppercase text-gray-500'>Programado</p>
                  <p className='text-xs font-bold text-gray-800'>{data.starT_QUANTITY}</p>
              </div>
              <div className='text-center'>
                  <p className='text-[9px] uppercase text-gray-500'>Producido</p>
                  <p className='text-xs font-bold  text-green-700'>{getDeclaracionesProduccion(data.wiP_ENTITY_NAME)}</p>
              </div>
              <div className='text-center border-l border-black/5 pl-4'>
                    <p className='text-[9px] uppercase text-gray-500'>EBS</p>
                    <p className='text-xs font-black text-gray-800'>{data.quantitY_COMPLETED}</p>
              </div>
          </div>
      </div>
    </div>

    <ModalCompoment
      title={data.segmenT1}
      openPopup={openDeclaracion}
        setOpenPopup={setOpenDeclarancion}
        titleModalStyle="Audit"     
        onCloseDynamic={false}      
        showModalCenterPage={true}
        subTitle={data.description}
        >
          <DeclararProdDIalog
          dataEBS={data}
          dataLocal={dataDeclaracion}
          setOpenModal={setOpenDeclarancion}
          openModal={openDeclaracion}
          declaracionesHistorico={dataDeclaracion}
          familia={familiaSelected}
          onSuccessSave={onRefreshDeclaraciones}
          />
      </ModalCompoment>
    
  </div>
  )
}