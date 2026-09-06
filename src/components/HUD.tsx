import React from 'react';
import { Volume2, VolumeX, Flame, Trophy, BookOpen, Sliders } from 'lucide-react';
import { GameStats } from '../types';

interface HUDProps {
  stats: GameStats;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenTheory: () => void;
  onOpenSandbox: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isMuted,
  onToggleSound,
  onOpenTheory,
  onOpenSandbox,
}) => {
  const maxLives = 3;

  return (
    <header id="game-hud" className="w-full max-w-2xl flex flex-col gap-2">
      {/* Top Utility bar */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-400">Récord:</span>
            <b className="text-amber-300 font-bold">{stats.highScore}</b>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-open-theory"
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 text-cyan-300 px-3 py-1 rounded-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer shadow-sm"
            title="Aprender sobre Robótica y Redes Neuronales"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px] font-medium tracking-wide">Teoría</span>
          </button>

          <button
            id="btn-open-sandbox"
            onClick={onOpenSandbox}
            className="flex items-center gap-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 text-purple-300 px-3 py-1 rounded-lg border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-sm"
            title="Laboratorio de simulación interactivo"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px] font-medium tracking-wide">Simulador</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer shadow-sm"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Main Stats HUD - Geometric 4-column balanced grid */}
      <div className="grid grid-cols-4 gap-2 text-center select-none">
        {/* Puntuación */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl py-2 px-2 flex flex-col justify-center backdrop-blur-md transition-colors">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Puntos</span>
          <span className="text-base sm:text-lg font-bold font-mono text-cyan-300 tracking-tight">
            {stats.score}
          </span>
        </div>

        {/* Racha */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl py-2 px-2 flex flex-col justify-center backdrop-blur-md transition-colors relative overflow-hidden">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium flex items-center justify-center gap-1">
            <Flame className={`w-3 h-3 ${stats.streak > 1 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            Racha
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-300 tracking-tight">
            x{stats.streak}
          </span>
        </div>

        {/* Vidas */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 rounded-xl py-2 px-2 flex flex-col justify-center backdrop-blur-md transition-colors">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Vidas</span>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm mt-0.5">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-200 ${
                  i < stats.lives ? 'text-rose-500 scale-100 drop-shadow-sm' : 'text-slate-700 scale-90 opacity-40'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Nivel */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-xl py-2 px-2 flex flex-col justify-center backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium px-0.5">
            <span>Nivel</span>
            <span className="text-purple-400 text-[10px]">{stats.correctCount % 4}/4</span>
          </div>
          <span className="text-base sm:text-lg font-bold font-mono text-purple-300 tracking-tight">
            Nv. {stats.level}
          </span>
        </div>
      </div>
    </header>
  );
};
