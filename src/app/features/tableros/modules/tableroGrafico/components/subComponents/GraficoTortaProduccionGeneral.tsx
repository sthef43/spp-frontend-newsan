import React from 'react'
import { Cell, Pie , PieChart, ResponsiveContainer } from 'recharts';




const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, name } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const my = cy + (outerRadius + 30) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  
  return (
      <g>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill}>{`${name}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey+20}  textAnchor={textAnchor} fill={fill}>{`${(percent * 100).toFixed(2)}%` }</text>
      </g>
  )
};


export interface GraficoTortaProduccionGeneralData {
  name: "GOOD" | "NO GOOD",
  value: number,
  color : string
}

interface GraficoTortaProduccionGeneralProps {
  data:GraficoTortaProduccionGeneralData[]
}


const GraficoTortaProduccionGeneral:React.FC<GraficoTortaProduccionGeneralProps> = ({data}) => {
  
  return (
    <div className='w-full h-[400px]'>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
        <defs>
          <linearGradient id="green" x1="1" y1="1" x2="0" y2="0">
            <stop offset="100%" stopColor="#BAF321"  />
            <stop offset="100%" stopColor="#9ACF0A"  />
            </linearGradient>
            <linearGradient id="red" x1="1" y1="1" x2="0" y2="0">
            <stop offset="100%" stopColor="#B5834A"  />
            <stop offset="100%" stopColor="#E16A64"  />
          </linearGradient>
        </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8" 
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={ entry.color == 'green' ? "url(#green)" : "url(#red)" }  />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      </div>
  )
}

export default GraficoTortaProduccionGeneral
