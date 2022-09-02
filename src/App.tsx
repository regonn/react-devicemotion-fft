import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { RawChart, RawData } from "./components/RawChart";
import { FttChart, FttData } from "./components/FttChart";
import { fft } from "ezfft";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

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
      if (prev.x.length > 200) {
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
    if (data.sum && data.sum.length > 1) {
      let fftData = fft(data.sum, 1000.0 / data.interval);

      setFttData({
        frequency: fftData.frequency.frequency,
        amplitude: fftData.frequency.amplitude,
      });
    }
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
      </header>
    </div>
  );
}

export default App;
