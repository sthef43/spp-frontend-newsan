import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, } from 'recharts'


const COLORS = [
  {
    rechazo: 'TAKAYA',
    color:"#5F67FF"
  },
  {    rechazo: 'COMPLETAMIENTO',
  color:"#FFB53F"
  }, {
    rechazo: 'OTROS',
    color:'#73EEFF '
  }, {
    rechazo: 'JIG',
    color:'#EAE509'
  }
]


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, fill }) => {
  // midangle angulo medio entre los angulo de inicio y fin del segmento
  
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;//
  const cos = Math.cos(-RADIAN * midAngle);
  const sin = Math.sin(-RADIAN * midAngle);

  const sx = cx + (outerRadius) * cos;
  const sy = cy + (outerRadius) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  let textColor = 'white';
  let fontSize = 12

  let x = cx;
  let y = cy
  const  porcentaje = +(percent * 100).toFixed(1)  
  if (porcentaje > 60) {    
     x = cx+20 + radius * Math.cos(-midAngle * RADIAN);
    y = cy + radius * Math.sin(-midAngle * RADIAN);
    textColor = 'black';
    fontSize = 15
  } else {
     x =cx + (outerRadius + 15) * cos;
     y = cy + (outerRadius + 15) * sin;
  }
  

  return (
    <g>
      {
        (porcentaje < 60) && (
          <path d={`M${sx},${sy}L${mx},${my}`} stroke={fill} strokeWidth={2} fill="none" />
        )
      }
    
    <text x={x} y={y} fill={textColor} textAnchor={x > cx ? 'start' : 'end'} fontSize={fontSize} dominantBaseline="central">
      {`${porcentaje}%`}
    </text>
    </g>
  );
};



interface Props {
  produccion:any[]
}

const IndicadorPorFamilia = ({produccion}:Props) => {


  const [info, setInfo] = useState([])
  const [noInfo, setNoInfo] = useState(true)
  


  const formatData = (data: any[]) => {    
    const info = [];
    console.log(data)
    data.forEach((d) => {
      const tempInfo = [];
      const obj = { name: "GOOD", value: d.cantidad, color : "#B0E719" };
      tempInfo.push(obj);
      if (d.rechazos == 0) {    
        setNoInfo(true)
        return
      }
      setNoInfo(false)
      d.rechazos.data.forEach((r) => {        
        const color = COLORS.find(c => c.rechazo.toLowerCase().includes(r.puesto.toLowerCase()) )
        const objR = { name: r.puesto, value: r.total, color: color ? color.color : '#73EEFF'  };
        tempInfo.push(objR)
      })

      const newData = {
        familia: d.familia,
        data:tempInfo
      }
      info.push(newData)

    })

    console.log(info)
    setInfo(info)        

  }
  

  useEffect(() => {
    formatData(produccion)
  }, [produccion] )


  return (
    <>
      {
        noInfo ?
          <div className='flex justify-center p-4 border rounded-sm w-full'>
            Sin Información de Rechazo
        </div> :     <div className='w-full border border-dashed p-4 rounded-sm'>      
        <div className='w-full grid grid-cols-1 gap-2 md:h-[250px] md:grid-cols-3 '>
          {
           info && info.map((i) => (
              <div key={i.familia} className=' relative w-[250px] m-auto xl:m-0'>
              <h2 className='text-white text-[25px] font-bold absolute'>{i.familia}</h2>
            
                <PieChart width={220} height={220}>
                  <Pie
                    data={i.data}
                    cx="50%"
                    cy="50%"                                             
                    outerRadius={70}
                    label={renderCustomizedLabel}
                  fill="#8884d8"
                  paddingAngle={15}
                    dataKey="value"
                    labelLine={false}
                  >
                    {i.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>                
            </div>
              
            ) )
          }
  
        </div>
        <div className="w-full h-[23px] flex justify-around items-center">
      <div className="flex gap-2 items-center">
          <div className="w-3.5 h-3.5  bg-[#B0E719] rounded-full"></div>
          <div className=" text-center text-white text-xl font-medium">Good</div>
          </div>
          {
            COLORS.map(color => (
              <div key={color.color} className="flex gap-2 items-center">
                <div className={` w-3.5 h-3.5  bg-[${color.color}] rounded-full `} style={{background:color.color}} ></div>
              <div className=" text-center text-white text-xl font-medium ">{ color.rechazo }</div>
          </div>            
            ))
          }
  
  </div>
      </div>
    }
    </>


  )
}

export default IndicadorPorFamilia
