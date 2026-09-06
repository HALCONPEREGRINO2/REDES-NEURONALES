import React from 'react';
import { HeartPulse, User, Droplet, TestTube, Activity } from 'lucide-react';
import { PatientCase, RiskLevel } from '../types';

interface VitalsCardProps {
  currentCase: PatientCase | null;
  revealed: boolean;
  userChoice: RiskLevel | -1 | null;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  currentCase,
  revealed,
  userChoice,
}) => {
  if (!currentCase) {
    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        Iniciando turno médico...
      </div>
    );
  }

  const { x, w, b, z, correctLevel, patientName, patientAge, perfil20 } = currentCase;

  // Partial products for step-by-step display
  const p1 = Math.round(x[0] * w[0] * 100) / 100;
  const p2 = Math.round(x[1] * w[1] * 100) / 100;
  const p3 = Math.round(x[2] * w[2] * 100) / 100;

  return (
    <section
      id="patient-vitals-card"
      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-200"
    >
      {/* Patient header with Perfil 20 Hematológico badge */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{patientName}</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                ({patientAge} años)
              </span>
            </h3>
            <p className="text-[10px] text-cyan-400/90 font-mono flex items-center gap-1">
              <span>🔬 Perfil 20 Hematológico &amp; Bioquímica</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span>Triage #{currentCase.id.slice(-4).toUpperCase()}</span>
        </div>
      </div>

      {/* 4 Chips: x1, x2, x3, bias - Symmetrical 4-quadrant geometric data grid from Perfil 20 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
        {/* x1: Glicemia (Química Perfil 20) */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 rounded-xl p-2.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-[11px] text-sky-400 mb-1">
            <span className="font-semibold flex items-center gap-1 truncate">
              <TestTube className="w-3 h-3 shrink-0" /> x₁ Glicemia
            </span>
            <span className="text-[9px] font-mono text-slate-400">Química</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base sm:text-lg font-mono font-bold text-sky-100">
              {perfil20?.glicemia ?? 110} <span className="text-[10px] font-sans text-slate-400 font-normal">mg/dL</span>
            </span>
            <span className="text-[10px] font-mono bg-sky-950/80 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/80">
              w₁={w[0]}
            </span>
          </div>
          <div className="text-[10px] font-mono text-sky-300/90 flex items-center justify-between border-t border-slate-800/80 pt-1">
            <span className="text-slate-400 text-[9px]">Sensor norm:</span>
            <span className="font-bold text-sky-200">x₁ = {x[0].toFixed(1)}</span>
          </div>
        </div>

        {/* x2: Colesterol Total (Perfil Lipídico Perfil 20) */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-xl p-2.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-[11px] text-purple-400 mb-1">
            <span className="font-semibold flex items-center gap-1 truncate">
              <Droplet className="w-3 h-3 shrink-0" /> x₂ Colesterol
            </span>
            <span className="text-[9px] font-mono text-slate-400">Lípidos</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base sm:text-lg font-mono font-bold text-purple-100">
              {perfil20?.colesterol ?? 195} <span className="text-[10px] font-sans text-slate-400 font-normal">mg/dL</span>
            </span>
            <span className="text-[10px] font-mono bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/80">
              w₂={w[1]}
            </span>
          </div>
          <div className="text-[10px] font-mono text-purple-300/90 flex items-center justify-between border-t border-slate-800/80 pt-1">
            <span className="text-slate-400 text-[9px]">Sensor norm:</span>
            <span className="font-bold text-purple-200">x₂ = {x[1].toFixed(1)}</span>
          </div>
        </div>

        {/* x3: Leucocitos (Hematología Completa Perfil 20) */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 rounded-xl p-2.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-[11px] text-rose-400 mb-1">
            <span className="font-semibold flex items-center gap-1 truncate">
              <Activity className="w-3 h-3 shrink-0" /> x₃ Leucocitos
            </span>
            <span className="text-[9px] font-mono text-slate-400">Hematol.</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base sm:text-lg font-mono font-bold text-rose-100">
              {perfil20?.leucocitos ?? 6.8} <span className="text-[10px] font-sans text-slate-400 font-normal">k/µL</span>
            </span>
            <span className="text-[10px] font-mono bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/80">
              w₃={w[2]}
            </span>
          </div>
          <div className="text-[10px] font-mono text-rose-300/90 flex items-center justify-between border-t border-slate-800/80 pt-1">
            <span className="text-slate-400 text-[9px]">Sensor norm:</span>
            <span className="font-bold text-rose-200">x₃ = {x[2].toFixed(1)}</span>
          </div>
        </div>

        {/* b: Sesgo Neuronal */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-2.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-[11px] text-amber-400 mb-1">
            <span className="font-semibold">Sesgo (b)</span>
            <span className="text-[9px] font-mono text-slate-400">Neurona</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base sm:text-lg font-mono font-bold text-amber-100">
              {b > 0 ? `+${b}` : b}
            </span>
            <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/80">
              b
            </span>
          </div>
          <div className="text-[10px] font-mono text-amber-300/90 flex items-center justify-between border-t border-slate-800/80 pt-1">
            <span className="text-slate-400 text-[9px]">Umbral:</span>
            <span className="font-normal text-[9px] text-slate-300">
              {b < 0 ? 'Inhibición' : b > 0 ? 'Excitación' : 'Neutro'}
            </span>
          </div>
        </div>
      </div>

      {/* Neural Formula Box with Geometric Balance Styling */}
      <div className="bg-slate-950/90 rounded-xl p-2.5 sm:p-3 border border-slate-800 text-center font-mono">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
          <span>Ecuación de Activación</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400 font-semibold">z = (x₁·w₁) + (x₂·w₂) + (x₃·w₃) + b</span>
        </div>

        {!revealed ? (
          <div className="text-sm sm:text-base text-slate-200 font-medium py-1">
            <span className="text-sky-300 font-semibold">{x[0].toFixed(1)}×{w[0]}</span>
            {' + '}
            <span className="text-purple-300 font-semibold">{x[1].toFixed(1)}×{w[1]}</span>
            {' + '}
            <span className="text-rose-300 font-semibold">{x[2].toFixed(1)}×{w[2]}</span>
            {b !== 0 && (
              <span className="text-amber-300 font-semibold">
                {b > 0 ? ` + ${b}` : ` − ${Math.abs(b)}`}
              </span>
            )}
            {' = '}
            <span className="text-cyan-400 font-bold animate-pulse text-base sm:text-lg">❓</span>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-100 py-1 space-y-1">
            <div className="flex items-center justify-center flex-wrap gap-1">
              <span className="text-sky-300">({p1.toFixed(2)})</span>
              <span>+</span>
              <span className="text-purple-300">({p2.toFixed(2)})</span>
              <span>+</span>
              <span className="text-rose-300">({p3.toFixed(2)})</span>
              {b !== 0 && (
                <span className="text-amber-300">
                  {b > 0 ? `+ ${b}` : `− ${Math.abs(b)}`}
                </span>
              )}
              <span>=</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-md ${
                  correctLevel === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : correctLevel === 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                z = {z.toFixed(2)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              {correctLevel === 0 && 'z < 1.0  →  Riesgo BAJO (Estable)'}
              {correctLevel === 1 && '1.0 ≤ z < 1.5  →  Riesgo MEDIO (Vigilancia)'}
              {correctLevel === 2 && 'z ≥ 1.5  →  Riesgo ALTO (Crítico)'}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
