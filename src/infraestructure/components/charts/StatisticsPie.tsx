/* import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts" */
import { Cell, Pie, PieChart, Tooltip } from "recharts"

//Datos con los que se representa el grafico
const data = [
    { name: "Coordinación de Informática", value: 7 },
    { name: "Unidad Jurídica y de Igualdad de Género", value: 2 },
    { name: "Unidad de Información, Planeación, Programación y Evaluación", value: 3 },
    { name: "Coordinación Administrativa", value: 20 },
    { name: "Órgano Interno de Control", value: 6 },
    { name: "Dirección de Geografía", value: 21 },
    { name: "Dirección de Estadística", value: 9 },
    { name: "Dirección de Catastro", value: 7 },
    { name: "Dirección de Servicios de Información", value: 40 }
]

const COLORS = ['#e6b0aa', '#f5b7b1', '#d7bde2', '#d2b4de', '#a9cce3', '#aed6f1', '#a3e4d7', '#a2d9ce', '#a9dfbf', '#abebc6'];

const renderCustomizedLabel = ({
    cx, 
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
} : {
    cx: number, 
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number,
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline='central'
        > {`${(percent * 100).toFixed(0)}%`} </text>
    )
}


export const StatisticsPie = () => {
    return (
        <PieChart width={600} height={600}>
            <Pie data={data} dataKey='value' label={renderCustomizedLabel} labelLine={false}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
}