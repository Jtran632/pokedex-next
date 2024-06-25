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
  let maxNum = Math.max(...stats);
  const chartData = {
    labels: [
      "Hp" + ` [${stats[0]}]`,
      "Atk" + ` [${stats[1]}]`,
      "Def" + ` [${stats[2]}]`,
      "Spd" + ` [${stats[5]}]`,
      "Sp.Def" + ` [${stats[4]}]`,
      "Sp.Atk" + ` [${stats[3]}]`,
    ],
    datasets: [
      {
        label: "Stats",
        data: [stats[0], stats[1], stats[2], stats[5], stats[4], stats[3]],
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        borderColor: "rgba(0, 255, 0, 0)",
        pointStyle: "line",
        borderWidth: 1,
        fill: true,
      },
    ],
  };
  const options = {
    scales: {
      r: {
        grid: {
          lineWidth: 1.5,
          color: "black",
        },
        angleLines: {
          display: true,
          lineWidth: 0.5,
          color: "black",
        },
        ticks: {
          display: false,
          stepSize: 255,
        },
        min: 0,
        max: 255,
      },
    },
  };
  return (
    <div className=" h-fit w-fit p-2">
      <Radar data={chartData} options={options} />
    </div>
  );
}
