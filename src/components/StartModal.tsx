import React from 'react';
import { Play, Sparkles, BrainCircuit, Heart, Gauge, ShieldAlert } from 'lucide-react';

interface StartModalProps {
  isOpen: boolean;
  onStart: () => void;
  onOpenTheory: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({
  isOpen,
  onStart,
  onOpenTheory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="start-briefing-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-7 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3 shadow-inner">
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Bio-Robótica &amp; Redes Neuronales</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-tech tracking-wide text-slate-50 mb-1">
          🫀 NEURONA CARDIÓLOGA
        </h1>
        <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-4">
          TURNO DE URGENCIA
        </p>

        {/* Narrative & Rules */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left text-xs sm:text-sm text-slate-300 space-y-2.5 mb-5 leading-relaxed">
          <p>
            Eres la <strong className="text-cyan-300">unidad de procesamiento neuronal</strong> en un sistema robótico de urgencias cardiológicas. Procesa en tiempo real las lecturas del <strong className="text-slate-100">Perfil 20 Hematológico</strong> (Glicemia, Colesterol y Leucocitos) para clasificar el riesgo:
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-center text-cyan-200">
            z = (x₁·w₁) + (x₂·w₂) + (x₃·w₃) + b
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-medium font-tech pt-1">
            <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 p-2 rounded-lg">
              🟢 BAJO<br /><span className="text-[10px] text-slate-400 font-mono">z &lt; 1.0</span>
            </div>
            <div className="bg-amber-950/30 border border-amber-500/30 text-amber-300 p-2 rounded-lg">
              🟡 MEDIO<br /><span className="text-[10px] text-slate-400 font-mono">1.0 ≤ z &lt; 1.5</span>
            </div>
            <div className="bg-rose-950/30 border border-rose-500/30 text-rose-300 p-2 rounded-lg">
              🔴 ALTO<br /><span className="text-[10px] text-slate-400 font-mono">z ≥ 1.5</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            ⚡ <strong>3 vidas</strong> para todo el turno. Cada <strong>4 aciertos</strong> subes de nivel: los pesos sinápticos se vuelven más exigentes y el tiempo de respuesta disminuye.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            id="btn-start-game"
            onClick={onStart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-tech text-base tracking-wider shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>INICIAR TURNO</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 hover:border-slate-600 text-slate-300 font-tech text-xs sm:text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            VER TEORÍA
          </button>
        </div>
      </div>
    </div>
  );
};
