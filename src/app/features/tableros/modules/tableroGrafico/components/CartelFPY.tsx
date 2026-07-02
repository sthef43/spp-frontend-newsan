import React from 'react'


interface CartelFPYProps {
  rechazo: number,
  produccion:number
}

const CartelFPY: React.FC<CartelFPYProps> = ({ produccion, rechazo }) => {
  const fpy = Math.round((produccion / (produccion + rechazo)) * 100) | 0;  
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
      <h1 className='text-[50px] font-bold'>FPY</h1>
      <h1 className='text-[50px] font-bold text-[#EAE509]' >{ fpy }%</h1>
    </div>
  )
}

export default CartelFPY
