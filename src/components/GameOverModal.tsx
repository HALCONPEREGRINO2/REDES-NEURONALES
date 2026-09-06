import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GameStats } from '../types';
import { getRankInfo } from '../utils/gameLogic';

interface GameOverModalProps {
  stats: GameStats;
  isOpen: boolean;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isOpen,
  onRestart,
}) => {
  const rank = getRankInfo(stats.score);
  const isNewRecord = stats.score > 0 && stats.score >= stats.highScore;

  useEffect(() => {
    if (isOpen && stats.score > 60) {
      confetti({
        particleCount: isNewRecord ? 90 : 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#a855f7', '#10b981', '#fbbf24'],
      });
    }
  }, [isOpen, stats.score, isNewRecord]);

  if (!isOpen) return null;

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
      : 0;

  return (
    <div
      id="game-over-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        {/* Title */}
        <div className="inline-block p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3 shadow-inner text-3xl">
          {rank.badge}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-tech text-slate-100 mb-1 tracking-wide">
          FIN DEL TURNO DE URGENCIA
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-4">
          La unidad de bio-robótica ha procesado el reporte de desempeño
        </p>

        {/* Rank Card with Geometric framing */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-widest font-mono text-purple-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Rango Obtenido
            </span>
            {isNewRecord && (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ¡NUEVO RÉCORD!
              </span>
            )}
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">
            {rank.title}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {rank.description}
          </p>
        </div>

        {/* Stats Grid - Symmetrical 3-card balance */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center justify-center gap-1 font-mono uppercase">
              <Trophy className="w-3 h-3 text-cyan-400" /> Puntos
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300">
              {stats.score}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center justify-center gap-1 font-mono uppercase">
              <Flame className="w-3 h-3 text-amber-400" /> Max Racha
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-300">
              x{stats.maxStreak}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center justify-center gap-1 font-mono uppercase">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Aciertos
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          id="btn-restart-shift"
          onClick={onRestart}
          className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-tech text-base tracking-wider shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>INICIAR OTRO TURNO</span>
        </button>
      </div>
    </div>
  );
};
