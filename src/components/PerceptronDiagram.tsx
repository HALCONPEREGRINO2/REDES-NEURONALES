import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { RiskLevel } from '../types';

interface PerceptronDiagramProps {
  x: [number, number, number];
  w: [number, number, number];
  b: number;
  z: number | null;
  revealedLevel?: RiskLevel | null;
}

export const PerceptronDiagram: React.FC<PerceptronDiagramProps> = ({
  x,
  w,
  b,
  z,
  revealedLevel,
}) => {
  const inputs = [
    { label: 'x₁ Glicemia', val: x[0], weight: w[0], color: '#38bdf8' },
    { label: 'x₂ Colest.', val: x[1], weight: w[1], color: '#a855f7' },
    { label: 'x₃ Leucocit.', val: x[2], weight: w[2], color: '#f43f5e' },
  ];

  let outputColor = '#64748b';
  let outputText = 'z = ?';

  if (z !== null && revealedLevel !== undefined && revealedLevel !== null) {
    if (revealedLevel === 0) {
      outputColor = '#10b981';
      outputText = `z=${z.toFixed(2)} (BAJO)`;
    } else if (revealedLevel === 1) {
      outputColor = '#f59e0b';
      outputText = `z=${z.toFixed(2)} (MEDIO)`;
    } else {
      outputColor = '#ef4444';
      outputText = `z=${z.toFixed(2)} (ALTO)`;
    }
  }

  return (
    <div id="perceptron-diagram-container" className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-widest font-mono text-[11px]">Circuito Neuronal del Perceptrón</span>
        </div>
        <div className="text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>z = ∑ (xᵢ · wᵢ) + b</span>
        </div>
      </div>

      <div className="relative w-full h-36 sm:h-40 flex items-center justify-center">
        <svg
          viewBox="0 0 540 160"
          className="w-full h-full max-w-xl select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Synaptic connection paths */}
          <path
            d="M 120 30 C 180 30, 200 80, 270 80"
            fill="none"
            stroke="url(#lineGrad1)"
            strokeWidth={Math.max(2, w[0] * 2.5)}
            strokeDasharray="4 2"
          />
          <path
            d="M 120 80 L 270 80"
            fill="none"
            stroke="url(#lineGrad2)"
            strokeWidth={Math.max(2, w[1] * 2.5)}
            strokeDasharray="4 2"
          />
          <path
            d="M 120 130 C 180 130, 200 80, 270 80"
            fill="none"
            stroke="url(#lineGrad3)"
            strokeWidth={Math.max(2, w[2] * 2.5)}
            strokeDasharray="4 2"
          />

          {/* Connection to activation & output */}
          <path
            d="M 320 80 L 410 80"
            fill="none"
            stroke={outputColor}
            strokeWidth="3.5"
          />

          {/* Input Nodes */}
          {inputs.map((inp, idx) => {
            const y = 30 + idx * 50;
            return (
              <g key={idx}>
                {/* Node Box */}
                <rect
                  x="10"
                  y={y - 18}
                  width="110"
                  height="36"
                  rx="8"
                  fill="#0f172a"
                  stroke={inp.color}
                  strokeWidth="1.5"
                />
                <text
                  x="20"
                  y={y - 2}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {inp.label}
                </text>
                <text
                  x="20"
                  y={y + 12}
                  fill="#f8fafc"
                  fontWeight="bold"
                  fontSize="13"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {inp.val.toFixed(1)}
                </text>

                {/* Weight badge on the line */}
                <rect
                  x="165"
                  y={idx === 0 ? 36 : idx === 1 ? 70 : 104}
                  width="44"
                  height="18"
                  rx="4"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text
                  x="187"
                  y={idx === 0 ? 49 : idx === 1 ? 83 : 117}
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  w={inp.weight}
                </text>
              </g>
            );
          })}

          {/* Summation Node (Soma) */}
          <g>
            <circle
              cx="295"
              cy="80"
              r="28"
              fill="#0f172a"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />
            <text
              x="295"
              y="77"
              fill="#22d3ee"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              ∑ + b
            </text>
            <text
              x="295"
              y="93"
              fill="#fbbf24"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              b={b > 0 ? `+${b}` : b}
            </text>
          </g>

          {/* Activation & Threshold Node */}
          <g>
            <rect
              x="410"
              y="60"
              width="115"
              height="40"
              rx="8"
              fill="#0f172a"
              stroke={outputColor}
              strokeWidth="2"
            />
            <text
              x="467"
              y="76"
              fill="#94a3b8"
              fontSize="9"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              Función Escalón
            </text>
            <text
              x="467"
              y="92"
              fill={outputColor}
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              {outputText}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
