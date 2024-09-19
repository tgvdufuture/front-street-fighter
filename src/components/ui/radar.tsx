"use client";

import { useRef, useEffect } from "react";
import {
  Chart,
  ChartData,
  ChartOptions,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { useTheme } from "next-themes";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

export interface RadarProps {
  data: ChartData<"radar">;
  options?: ChartOptions<"radar">;
  className?: string;
}

export function Radar({ data, options, className }: RadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"radar"> | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const defaultOptions: ChartOptions<"radar"> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
          },
          grid: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
          },
          pointLabels: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.7)",
          },
          ticks: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.7)",
            backdropColor: "transparent",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    chartRef.current = new Chart(ctx, {
      type: "radar",
      data,
      options: { ...defaultOptions, ...options },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options, theme]);

  return <canvas ref={canvasRef} className={className} />;
}
