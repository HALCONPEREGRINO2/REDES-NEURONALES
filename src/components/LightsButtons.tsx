import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

interface LightsButtonsProps {
  onSelect: (level: RiskLevel) => void;
  disabled: boolean;
  revealed: boolean;
  correctLevel?: RiskLevel;
  selectedChoice?: RiskLevel | -1 | null;
}

export const LightsButtons: React.FC<LightsButtonsProps> = ({
  onSelect,
  disabled,
  revealed,
  correctLevel,
  selectedChoice,
}) => {
  const options: Array<{
    level: RiskLevel;
    label: string;
    sublabel: string;
    threshold: string;
    keyLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    baseBorder: string;
    activeBorder: string;
    bgGrad: string;
    glowColor: string;
  }> = [
    {
      level: 0,
      label: 'BAJO',
      sublabel: 'Estable',
      threshold: 'z < 1.0',
      keyLabel: '1',
      icon: ShieldCheck,
      baseBorder: 'border-emerald-500/30 hover:border-emerald-400/80 hover:bg-emerald-950/20',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-500/50 bg-emerald-950/40',
      bgGrad: 'from-slate-900/90 to-slate-950/90',
      glowColor: 'rgba(16, 185, 129, 0.35)',
    },
    {
      level: 1,
      label: 'MEDIO',
      sublabel: 'Observación',
      threshold: '1.0 ≤ z < 1.5',
      keyLabel: '2',
      icon: AlertTriangle,
      baseBorder: 'border-amber-500/30 hover:border-amber-400/80 hover:bg-amber-950/20',
      activeBorder: 'border-amber-400 ring-2 ring-amber-500/50 bg-amber-950/40',
      bgGrad: 'from-slate-900/90 to-slate-950/90',
      glowColor: 'rgba(245, 158, 11, 0.35)',
    },
    {
      level: 2,
      label: 'ALTO',
      sublabel: 'Código Rojo',
      threshold: 'z ≥ 1.5',
      keyLabel: '3',
      icon: Siren,
      baseBorder: 'border-rose-500/30 hover:border-rose-400/80 hover:bg-rose-950/20',
      activeBorder: 'border-rose-400 ring-2 ring-rose-500/50 bg-rose-950/40',
      bgGrad: 'from-slate-900/90 to-slate-950/90',
      glowColor: 'rgba(239, 68, 68, 0.35)',
    },
  ];

  return (
    <div
      id="lights-decision-panel"
      className="w-full grid grid-cols-3 gap-2 sm:gap-3 my-1.5"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isCorrect = revealed && correctLevel === opt.level;
        const isSelected = selectedChoice === opt.level;
        const isWrongPick = revealed && isSelected && !isCorrect;

        let statusClass = opt.baseBorder;
        if (revealed) {
          if (isCorrect) {
            statusClass = 'border-emerald-400 bg-emerald-950/50 ring-2 ring-emerald-400/60 scale-[1.01]';
          } else if (isWrongPick) {
            statusClass = 'border-rose-600 bg-rose-950/50 ring-1 ring-rose-500/40 opacity-70';
          } else {
            statusClass = 'border-slate-800/80 opacity-30';
          }
        }

        return (
          <button
            key={opt.level}
            id={`btn-light-${opt.level}`}
            onClick={() => onSelect(opt.level)}
            disabled={disabled}
            className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-150 cursor-pointer disabled:cursor-not-allowed select-none bg-gradient-to-b ${opt.bgGrad} ${statusClass} active:scale-95 shadow-md backdrop-blur-md`}
            style={{
              boxShadow: isCorrect ? `0 0 20px ${opt.glowColor}` : undefined,
            }}
          >
            {/* Keyboard shortcut tag */}
            <span className="hidden sm:inline-block absolute top-2 right-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {opt.keyLabel}
            </span>

            <div className="mb-1.5 flex items-center justify-center">
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  opt.level === 0
                    ? 'text-emerald-400'
                    : opt.level === 1
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              />
            </div>

            <span className="text-sm sm:text-base font-bold font-tech tracking-wider text-slate-100">
              {opt.label}
            </span>

            <span className="text-[11px] text-slate-400 font-medium hidden xs:inline mt-0.5">
              {opt.sublabel}
            </span>

            <span className="mt-1.5 text-[10px] sm:text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-300 border border-slate-800">
              {opt.threshold}
            </span>
          </button>
        );
      })}
    </div>
  );
};
