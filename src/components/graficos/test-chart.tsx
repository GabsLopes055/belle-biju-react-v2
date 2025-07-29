import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

export const TestChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destruir gráfico existente
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Gráfico de teste simples
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Dinheiro", "PIX", "Débito", "Crédito"],
        datasets: [
          {
            label: "Teste",
            data: [10, 20, 30, 40],
            backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-bold mb-4">Teste Chart.js</h3>
      <div className="h-64">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
