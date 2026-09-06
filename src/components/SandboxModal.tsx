import React, { useState } from 'react';
import { X, RotateCcw, Sliders } from 'lucide-react';
import { RiskLevel } from '../types';

interface SandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxModal: React.FC<SandboxModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [x1, setX1] = useState<number>(0.7);
  const [x2, setX2] = useState<number>(0.4);
  const [x3, setX3] = useState<number>(0.6);

  const [w1, setW1] = useState<number>(1.5);
  const [w2, setW2] = useState<number>(0.5);
  const [w3, setW3] = useState<number>(2.0);

  const [b, setB] = useState<number>(-0.5);

  if (!isOpen) return null;

  const p1 = Math.round(x1 * w1 * 100) / 100;
  const p2 = Math.round(x2 * w2 * 100) / 100;
  const p3 = Math.round(x3 * w3 * 100) / 100;
  const z = Math.round((p1 + p2 + p3 + b) * 100) / 100;

  let risk: RiskLevel = 0;
  if (z >= 1.5) risk = 2;
  else if (z >= 1.0) risk = 1;

  const resetValues = () => {
    setX1(0.5);
    setX2(0.5);
    setX3(0.5);
    setW1(1.0);
    setW2(1.0);
    setW3(1.0);
    setB(0);
  };

  return (
    <div
      id="sandbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-tech text-slate-100 tracking-wide">
                Simulador Interactivo del Perceptrón
              </h2>
              <p className="text-xs text-slate-400">
                Experimenta con entradas sensoriales, pesos sinápticos y sesgo sin límite de tiempo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetValues}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              title="Restablecer valores estándar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar simulador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time calculated Result Bar */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 mb-4 text-center font-mono">
          <div className="text-xs text-slate-400 mb-1">
            z = ({x1.toFixed(1)}·{w1.toFixed(1)}) + ({x2.toFixed(1)}·{w2.toFixed(1)}) + ({x3.toFixed(1)}·{w3.toFixed(1)}) {b >= 0 ? `+ ${b.toFixed(1)}` : `− ${Math.abs(b).toFixed(1)}`}
          </div>
          <div className="text-xs text-slate-500 mb-2">
            = {p1.toFixed(2)} + {p2.toFixed(2)} + {p3.toFixed(2)} {b >= 0 ? `+ ${b.toFixed(1)}` : `− ${Math.abs(b).toFixed(1)}`}
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl font-bold font-mono text-cyan-300">
              z = {z.toFixed(2)}
            </div>

            <div
              className={`px-3 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider ${
                risk === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : risk === 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {risk === 0 ? '🟢 BAJO (z < 1.0)' : risk === 1 ? '🟡 MEDIO (1.0 ≤ z < 1.5)' : '🔴 ALTO (z ≥ 1.5)'}
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-3">
          {/* x1 and w1 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between items-center text-xs font-semibold text-sky-400 mb-1.5 font-mono">
              <span>x₁ Glicemia: {x1.toFixed(1)} (~{Math.round(70 + x1 * 200)} mg/dL)</span>
              <span>w₁: {w1.toFixed(1)} (x₁·w₁ = {p1.toFixed(2)})</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Entrada Sensor (x₁ Química)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={x1}
                  onChange={(e) => setX1(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Ganancia / Peso (w₁)</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={w1}
                  onChange={(e) => setW1(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* x2 and w2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between items-center text-xs font-semibold text-purple-400 mb-1.5 font-mono">
              <span>x₂ Colesterol Total: {x2.toFixed(1)} (~{Math.round(140 + x2 * 180)} mg/dL)</span>
              <span>w₂: {w2.toFixed(1)} (x₂·w₂ = {p2.toFixed(2)})</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Entrada Sensor (x₂ Lípidos)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={x2}
                  onChange={(e) => setX2(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Ganancia / Peso (w₂)</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={w2}
                  onChange={(e) => setW2(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* x3 and w3 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between items-center text-xs font-semibold text-rose-400 mb-1.5 font-mono">
              <span>x₃ Leucocitos: {x3.toFixed(1)} (~{(4.2 + x3 * 14.5).toFixed(1)} k/µL)</span>
              <span>w₃: {w3.toFixed(1)} (x₃·w₃ = {p3.toFixed(2)})</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Entrada Sensor (x₃ Hematología)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={x3}
                  onChange={(e) => setX3(parseFloat(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Ganancia / Peso (w₃)</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={w3}
                  onChange={(e) => setW3(parseFloat(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bias */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between items-center text-xs font-semibold text-amber-400 mb-1.5 font-mono">
              <span>Sesgo Neuronal (b / Bias): {b > 0 ? `+${b.toFixed(1)}` : b.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px] font-sans font-normal">
                {b < 0 ? 'Inhibición basal' : b > 0 ? 'Excitación basal' : 'Neutral'}
              </span>
            </div>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.5"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-tech text-sm tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            LISTO · VOLVER AL JUEGO
          </button>
        </div>
      </div>
    </div>
  );
};
