import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type FttData = {
  frequency: number[];
  amplitude: number[];
};

type Props = {
  chartData: FttData;
};

const primaryColor = "#789FFF";
const secondaryColor = "#FF6D66";
const tertiaryColor = "#E5FF85";
const quaternaryColor = "#AAAFD9";
const quinaryColor = "#E29082";

export const FttChart = (props: Props) => {
  const { chartData } = props;
  const { frequency, amplitude } = chartData;

  const graphOptions = {
    plugins: {
      title: { display: false },
    },
    scales: {
      xAxis: {
        min: 0,
      },
    },
    events: [],
    radius: 0,
  };
  const data = {
    labels: frequency,
    datasets: [
      {
        label: "frequency",
        data: amplitude,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
      },
    ],
  };
  return <Line options={graphOptions} data={data} />;
};
