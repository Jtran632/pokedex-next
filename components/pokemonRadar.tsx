import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Filler);

interface RadarChartProps {
  data: Array<{ base_stat: number }>;
}

export function RadarChart({ data }: RadarChartProps) {
  const stats = data.map((stat) => stat.base_stat);
  let maxNum = Math.max(...stats)
  const chartData = {
    labels: ["Hp", "Atk", "Def", "Sp.Atk", "Sp.Def", "Spd"],
    datasets: [
      {
        label: "Stats",
        data: stats,
        backgroundColor: "rgba(0, 255, 30, 0.25)",
        borderColor: "rgba(0, 255, 0, 0)",
        pointStyle: "circle",
        borderWidth: 1,
        fill: true,
      },
    ],
  };
  const options = {
    scales: {
      r: {
        grid: {
          lineWidth: 2
        },
        angleLines: {
          display: true,
        },
        ticks: {
          display: false,
          stepSize: Math.ceil(maxNum/3),
        },
        min: 0,
        max: maxNum,

      },
    },
  };
  return <Radar data={chartData} options={options} />;
}
