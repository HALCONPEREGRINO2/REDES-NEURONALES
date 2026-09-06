import React, { useEffect, useRef } from 'react';
import { Activity, Heart } from 'lucide-react';
import { RiskLevel } from '../types';

interface ECGMonitorProps {
  bpm: number;
  riskLevel?: RiskLevel | null;
  isPlaying: boolean;
  lives: number;
}

export const ECGMonitor: React.FC<ECGMonitorProps> = ({
  bpm,
  riskLevel,
  isPlaying,
  lives,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!isPlaying || lives <= 0) {
        // Flatline
        ctx.beginPath();
        ctx.strokeStyle = lives <= 0 ? '#ef4444' : '#64748b';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = lives <= 0 ? '#ef4444' : '#64748b';
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        return;
      }

      // ECG color based on state
      let traceColor = '#22d3ee'; // cyan
      if (riskLevel === 0) traceColor = '#10b981'; // green
      else if (riskLevel === 1) traceColor = '#f59e0b'; // amber
      else if (riskLevel === 2) traceColor = '#ef4444'; // red

      ctx.strokeStyle = traceColor;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = traceColor;
      ctx.beginPath();

      const speed = bpm > 110 ? 3.2 : 2.4;
      offset = (offset + speed) % 180;

      for (let x = 0; x < width; x++) {
        const cycle = (x + offset) % 180;
        let y = centerY;

        // Realistic P-Q-R-S-T wave model
        if (cycle > 30 && cycle < 42) {
          // P wave (atrial depolarization)
          y -= Math.sin(((cycle - 30) / 12) * Math.PI) * 7;
        } else if (cycle >= 48 && cycle < 54) {
          // Q wave
          y += 5;
        } else if (cycle >= 54 && cycle < 62) {
          // R wave peak (ventricular depolarization)
          const progress = (cycle - 54) / 8;
          y -= Math.sin(progress * Math.PI) * (height * 0.42);
        } else if (cycle >= 62 && cycle < 70) {
          // S wave
          y += 9;
        } else if (cycle >= 84 && cycle < 106) {
          // T wave (ventricular repolarization)
          y -= Math.sin(((cycle - 84) / 22) * Math.PI) * 11;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, riskLevel, isPlaying, lives]);

  return (
    <div id="ecg-monitor-card" className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 relative overflow-hidden backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wider text-slate-200 uppercase text-[11px] font-mono flex items-center gap-1.5">
            Telemetría Cardíaca
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-mono bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
            <Heart
              className={`w-3.5 h-3.5 text-rose-500 ${isPlaying && lives > 0 ? 'animate-heartbeat' : ''}`}
            />
            <span className="text-slate-100 font-bold text-xs">
              {isPlaying && lives > 0 ? `${bpm} BPM` : '--- BPM'}
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
              lives <= 0
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : riskLevel === 2
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : riskLevel === 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {lives <= 0
              ? 'PARO'
              : riskLevel === 2
              ? 'CRÍTICO'
              : riskLevel === 1
              ? 'ALERTA'
              : 'ESTABLE'}
          </span>
        </div>
      </div>

      <div className="w-full h-14 sm:h-16 rounded-lg overflow-hidden border border-slate-800 relative bg-[#070b12]">
        <canvas
          ref={canvasRef}
          width={640}
          height={70}
          className="w-full h-full block"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30" />
      </div>
    </div>
  );
};
