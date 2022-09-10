import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { RawChart, RawData } from "./components/RawChart";
import { ScoreChart, ScoreData } from "./components/ScoreChart";
import { FttChart, FttData } from "./components/FttChart";
import { fft } from "ezfft";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const range = 200

function App() {
  const [data, setData] = useState<RawData>({
    x: [],
    y: [],
    z: [],
    sum: [],
    interval: 0,
  });
  const [fttData, setFttData] = useState<FttData>({
    frequency: [],
    amplitude: [],
  });
  const [scoreData, setScoreData] = useState<ScoreData>({
    scores: [],
  });

  const handleMotionEvent = (event: DeviceMotionEvent) => {
    if (!event.rotationRate) {
      alert("event.rotationRate is null");
      return;
    }
    const x: number = event.rotationRate.alpha ?? 0;
    const y: number = event.rotationRate.beta ?? 0;
    const z: number = event.rotationRate.gamma ?? 0;
    const sum: number = Math.sqrt(x * x + y * y + z * z);
    const interval: number = event.interval ?? 0;

    setData((prev) => {
      if (prev.x.length > range) {
        prev.x.shift();
        prev.y.shift();
        prev.z.shift();
        prev.sum.shift();
      }
      return {
        x: [...prev.x, x],
        y: [...prev.y, y],
        z: [...prev.z, z],
        sum: [...prev.sum, sum],
        interval: interval,
      };
    });
  };

  const requestPermission = (
    DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
  ).requestPermission;
  const iOS = typeof requestPermission === "function";
  const startRequest = async () => {
    if (iOS) {
      const permissionState: string = await requestPermission();

      if (permissionState === "granted") {
        window.addEventListener("devicemotion", handleMotionEvent);
      } else {
        alert("DeviceMotionEvent.requestPermission is not found");
      }
    } else {
      window.addEventListener("devicemotion", handleMotionEvent);
    }
  };

  const stopRequest = () => {
    window.removeEventListener("devicemotion", handleMotionEvent);
  };

  useEffect(() => {
    let score = 0
    if (data.sum && data.sum.length > range) {
      let fftRawData = fft(data.sum, 1000.0 / data.interval);
      for (const i in Array.from({ length: fftRawData.frequency.frequency.length }, (v, k) => k)) {
        const frequency = fftRawData.frequency.frequency[i];
        const amplitude = fftRawData.frequency.amplitude[i];

        if (frequency == 0) {
          score = 1 - (((10 - amplitude) ** 2) / 100);
          if (score < 0) {
            score = 0;
          }
        }
      }

      setFttData({
        frequency: fftRawData.frequency.frequency,
        amplitude: fftRawData.frequency.amplitude,
      });
    }

    setScoreData((prev) => {
      if (prev.scores.length > range) {
        prev.scores.shift();
      }
      return {  
        scores: [...prev.scores, score],
      };
    });
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={startRequest}> start </button>
        <button onClick={stopRequest}> stop </button>
        <span>{data.x.slice(-1)[0]}</span>
        <span>{data.y.slice(-1)[0]}</span>
        <span>{data.z.slice(-1)[0]}</span>
        <span>{data.sum.slice(-1)[0]}</span>
        <RawChart chartData={data} />

        <FttChart chartData={fttData} />
        <ScoreChart chartData={scoreData} />
      </header>
    </div>
  );
}

export default App;
