import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type RawData = {
  x: number[];
  y: number[];
  z: number[];
  sum: number[];
  interval: number;
};

type Props = {
  chartData: RawData;
};

const primaryColor = "#789FFF";
const secondaryColor = "#FF6D66";
const tertiaryColor = "#E5FF85";
const quaternaryColor = "#AAAFD9";
const quinaryColor = "#E29082";

export const RawChart = (props: Props) => {
  const { chartData } = props;
  const { x, y, z, sum } = chartData;

  const graphOptions = {
    plugins: {
      title: { display: false },
    },
    scales: {},
    events: [],
    radius: 0,
  };
  const data = {
    labels: Array.from({ length: x.length }, (v, k) => k),
    datasets: [
      // {
      //   label: "x",
      //   data: x,
      //   borderColor: primaryColor,
      //   backgroundColor: primaryColor,
      // },
      // {
      //   label: "y",
      //   data: y,
      //   borderColor: secondaryColor,
      //   backgroundColor: secondaryColor,
      // },
      // {
      //   label: "z",
      //   data: z,
      //   borderColor: tertiaryColor,
      //   backgroundColor: tertiaryColor,
      // },
      {
        label: "sum",
        data: sum,
        borderColor: quaternaryColor,
        backgroundColor: quaternaryColor,
      },
    ],
  };
  return <Line options={graphOptions} data={data} />;
};
