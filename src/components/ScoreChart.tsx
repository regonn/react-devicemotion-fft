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

export type ScoreData = {
  scores: number[];
};

type Props = {
  chartData: ScoreData;
};

const primaryColor = "#789FFF";
const secondaryColor = "#FF6D66";
const tertiaryColor = "#E5FF85";
const quaternaryColor = "#AAAFD9";
const quinaryColor = "#E29082";

export const ScoreChart = (props: Props) => {
  const { chartData } = props;
  const { scores } = chartData;

  const graphOptions = {
    plugins: {
      title: { display: false },
    },
    scales: {},
    events: [],
    radius: 0,
  };
  const data = {
    labels: Array.from({ length: scores.length }, (v, k) => k),
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
        label: "score",
        data: scores,
        borderColor: tertiaryColor,
        backgroundColor: tertiaryColor,
      },
    ],
  };
  return <Line options={graphOptions} data={data} />;
};
