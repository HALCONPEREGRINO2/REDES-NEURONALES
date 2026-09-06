import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HUD } from './components/HUD';
import { ECGMonitor } from './components/ECGMonitor';
import { PerceptronDiagram } from './components/PerceptronDiagram';
import { VitalsCard } from './components/VitalsCard';
import { LightsButtons } from './components/LightsButtons';
import { StartModal } from './components/StartModal';
import { RoboticsTheoryModal } from './components/RoboticsTheoryModal';
import { SandboxModal } from './components/SandboxModal';
import { GameOverModal } from './components/GameOverModal';
import { PatientCase, RiskLevel, GameStats } from './types';
import { generatePatientCase, getLevelConfig } from './utils/gameLogic';
import { soundManager } from './utils/audio';
import { ChevronDown, ChevronUp, Clock, Lightbulb } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState<GameStats>(() => {
    let savedHighScore = 0;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neurona_cardiologa_highscore');
      if (saved) savedHighScore = parseInt(saved, 10) || 0;
    }
    return {
      score: 0,
      streak: 0,
      maxStreak: 0,
      lives: 3,
      level: 1,
      correctCount: 0,
      totalAnswered: 0,
      highScore: savedHighScore,
    };
  });

  const [currentCase, setCurrentCase] = useState<PatientCase | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<RiskLevel | -1 | null>(null);

  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'neutral' | 'success' | 'error';
    details?: string;
  }>({
    text: '🚑 ¡Inicia tu turno para recibir al primer paciente de urgencias!',
    type: 'neutral',
  });

  // Modals state
  const [isStartOpen, setIsStartOpen] = useState<boolean>(true);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getIsMuted());

  // Show / Hide Perceptron Diagram for compactness
  const [showDiagram, setShowDiagram] = useState<boolean>(true);

  // Timer reference & animation
  const [timeRatio, setTimeRatio] = useState<number>(1.0);
  const timerStartRef = useRef<number>(0);
  const timerDurationRef = useRef<number>(9000);
  const animFrameRef = useRef<number | null>(null);
  const nextCaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load a new patient case
  const nextCase = useCallback((currentLevel: number) => {
    if (nextCaseTimeoutRef.current) {
      clearTimeout(nextCaseTimeoutRef.current);
      nextCaseTimeoutRef.current = null;
    }

    const newCase = generatePatientCase(currentLevel);
    const config = getLevelConfig(currentLevel);

    setCurrentCase(newCase);
    setIsAnswered(false);
    setUserChoice(null);

    // Play heartbeat blip
    soundManager.playHeartbeat(newCase.bpm);

    timerDurationRef.current = config.durationMs;
    timerStartRef.current = Date.now();
    setTimeRatio(1.0);

    setFeedback({
      text: `Paciente: ${newCase.patientName} (${newCase.patientAge} a). Calcula z con pesos del Nivel ${currentLevel}.`,
      type: 'neutral',
    });
  }, []);

  // Answer handler
  const handleAnswer = useCallback(
    (choice: RiskLevel | -1) => {
      if (!isGameActive || isAnswered || !currentCase) return;

      setIsAnswered(true);
      setUserChoice(choice);

      // Cancel timer loop
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      const isCorrect = choice === currentCase.correctLevel;
      const riskNames = ['🟢 BAJO', '🟡 MEDIO', '🔴 ALTO'];
      const targetName = riskNames[currentCase.correctLevel];

      setStats((prev) => {
        let newScore = prev.score;
        let newStreak = prev.streak;
        let newMaxStreak = prev.maxStreak;
        let newLives = prev.lives;
        let newLevel = prev.level;
        let newCorrectCount = prev.correctCount;
        const newTotalAnswered = prev.totalAnswered + 1;

        if (isCorrect) {
          soundManager.playCorrect();
          const pointsGained = 10 * prev.level + prev.streak * 2;
          newScore = prev.score + pointsGained;
          newStreak = prev.streak + 1;
          newMaxStreak = Math.max(newMaxStreak, newStreak);
          newCorrectCount = prev.correctCount + 1;

          let levelUpText = '';
          if (newCorrectCount % 4 === 0) {
            newLevel = prev.level + 1;
            soundManager.playLevelUp();
            levelUpText = ` ¡Subiste al Nivel ${newLevel}! Nuevos pesos calibrados.`;
          }

          setFeedback({
            text: `✅ ¡Correcto! z = ${currentCase.z.toFixed(2)} → ${targetName}. (+${pointsGained} pts)${levelUpText}`,
            type: 'success',
          });
        } else {
          newStreak = 0;
          newLives = prev.lives - 1;

          if (choice === -1) {
            soundManager.playTimeout();
            setFeedback({
              text: `⏰ ¡Tiempo agotado! z = ${currentCase.z.toFixed(2)} correspondía a ${targetName}.`,
              type: 'error',
            });
          } else {
            soundManager.playWrong();
            setFeedback({
              text: `❌ Incorrecto. z = ${currentCase.z.toFixed(2)} era ${targetName} (seleccionaste ${riskNames[choice]}).`,
              type: 'error',
            });
          }

          if (newLives <= 0) {
            soundManager.playFlatline();
          }
        }

        const newHighScore = Math.max(prev.highScore, newScore);
        if (typeof window !== 'undefined') {
          localStorage.setItem('neurona_cardiologa_highscore', String(newHighScore));
        }

        // Check if game over
        if (newLives <= 0) {
          setIsGameActive(false);
          setTimeout(() => {
            setIsGameOverOpen(true);
          }, 1200);
        } else {
          // Schedule next case
          nextCaseTimeoutRef.current = setTimeout(() => {
            nextCase(newLevel);
          }, 2100);
        }

        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          maxStreak: newMaxStreak,
          lives: newLives,
          level: newLevel,
          correctCount: newCorrectCount,
          totalAnswered: newTotalAnswered,
          highScore: newHighScore,
        };
      });
    },
    [isGameActive, isAnswered, currentCase, nextCase]
  );

  // Timer animation loop
  useEffect(() => {
    if (!isGameActive || isAnswered) return;

    const tick = () => {
      const elapsed = Date.now() - timerStartRef.current;
      const remaining = Math.max(0, 1 - elapsed / timerDurationRef.current);
      setTimeRatio(remaining);

      if (remaining <= 0) {
        handleAnswer(-1); // Timeout!
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isGameActive, isAnswered, handleAnswer]);

  // Keyboard shortcut listener (1, 2, 3 and Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive || isAnswered || isStartOpen || isTheoryOpen || isSandboxOpen || isGameOverOpen) {
        return;
      }
      if (e.key === '1' || e.key === 'ArrowLeft' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleAnswer(0);
      } else if (e.key === '2' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleAnswer(1);
      } else if (e.key === '3' || e.key === 'ArrowRight' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleAnswer(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameActive, isAnswered, isStartOpen, isTheoryOpen, isSandboxOpen, isGameOverOpen, handleAnswer]);

  // Start new game
  const startGame = () => {
    setIsStartOpen(false);
    setIsGameOverOpen(false);

    let savedHighScore = 0;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neurona_cardiologa_highscore');
      if (saved) savedHighScore = parseInt(saved, 10) || 0;
    }

    setStats({
      score: 0,
      streak: 0,
      maxStreak: 0,
      lives: 3,
      level: 1,
      correctCount: 0,
      totalAnswered: 0,
      highScore: savedHighScore,
    });

    setIsGameActive(true);
    nextCase(1);
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      id="app-container"
      className="min-h-screen geometric-bg text-slate-100 flex flex-col items-center justify-between p-2.5 sm:p-4 selection:bg-cyan-500 selection:text-slate-950 scanline-effect relative"
    >
      {/* Background ambient radial gradients and geometric grid accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-cyan-950/25 via-slate-900/0 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-purple-950/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-sky-950/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container with Geometric Balance Layout */}
      <main className="w-full max-w-2xl flex flex-col items-center gap-2 sm:gap-3 my-auto z-10">
        {/* Title Header */}
        <header className="text-center select-none pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/50 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Bio-Robótica &amp; Perceptrón Clínico
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-tech tracking-wider text-slate-50 flex items-center justify-center gap-2">
            <span className="text-cyan-400">🫀 NEURONA CARDIÓLOGA</span>
            <span className="text-slate-600 font-mono text-sm hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm text-slate-300 font-medium font-sans hidden sm:inline">Turno de Urgencia</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 max-w-lg mx-auto">
            Calcula mentalmente <strong className="text-slate-200 font-mono">z = ∑(xᵢ·wᵢ) + b</strong> y activa el semáforo antes del paro cardíaco.
          </p>
        </header>

        {/* HUD */}
        <HUD
          stats={stats}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          onOpenTheory={() => setIsTheoryOpen(true)}
          onOpenSandbox={() => setIsSandboxOpen(true)}
        />

        {/* Live ECG Telemetry */}
        <ECGMonitor
          bpm={currentCase ? currentCase.bpm : 72}
          riskLevel={isAnswered ? currentCase?.correctLevel : null}
          isPlaying={isGameActive}
          lives={stats.lives}
        />

        {/* Integrated Clinical Decision Cockpit: Vitals + Timer + Decision Buttons */}
        <section id="triage-decision-station" className="w-full flex flex-col gap-2">
          {/* Vitals Patient Card (Input Values x1, x2, x3 & Formula) */}
          <VitalsCard
            currentCase={currentCase}
            revealed={isAnswered}
            userChoice={userChoice}
          />

          {/* High-Visibility Eye-Level Countdown Timer Bar */}
          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-md backdrop-blur-md flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={`w-2 h-2 rounded-full ${timeRatio > 0.2 ? 'bg-cyan-400' : 'bg-rose-500 animate-ping'}`} />
                <span className="text-[11px] font-semibold tracking-wider text-slate-200">
                  TIEMPO DE RESPUESTA
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className={`w-3.5 h-3.5 ${timeRatio <= 0.2 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                <span className={`text-sm ${
                  timeRatio > 0.45 ? 'text-cyan-300' : timeRatio > 0.2 ? 'text-amber-300' : 'text-rose-400 font-extrabold animate-pulse'
                }`}>
                  {isGameActive && !isAnswered ? `${(timeRatio * (timerDurationRef.current / 1000)).toFixed(1)}s` : isAnswered ? 'EVALUADO' : '--'}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950/90 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5 border border-slate-800 relative">
              <div
                id="timer-progress-bar"
                className={`h-full rounded-full transition-all duration-75 relative shadow-sm ${
                  timeRatio > 0.45
                    ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500'
                    : timeRatio > 0.2
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 animate-pulse'
                }`}
                style={{ width: `${Math.max(0, timeRatio * 100)}%` }}
              />
            </div>
          </div>

          {/* Decision Traffic Lights (Directly beneath input values and timer) */}
          <LightsButtons
            onSelect={handleAnswer}
            disabled={!isGameActive || isAnswered}
            revealed={isAnswered}
            correctLevel={currentCase?.correctLevel}
            selectedChoice={userChoice}
          />
        </section>

        {/* Feedback / Educational Status bar */}
        <div
          id="game-feedback-bar"
          className={`w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-sans flex items-center justify-center gap-2.5 border transition-all duration-200 text-center shadow-md backdrop-blur-md ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-emerald-950/30'
              : feedback.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-rose-950/30'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300'
          }`}
        >
          <Lightbulb className="w-4 h-4 shrink-0 text-cyan-400" />
          <p className="leading-snug">{feedback.text}</p>
        </div>

        {/* Perceptron Diagram Toggle & Component (Positioned below the decision area) */}
        <div className="w-full">
          <div className="flex items-center justify-between px-1 mb-1">
            <button
              onClick={() => setShowDiagram((prev) => !prev)}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer py-0.5"
            >
              {showDiagram ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showDiagram ? 'Ocultar Circuito Neuronal' : 'Ver Circuito del Perceptrón'}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              Pesos sinápticos calibrados bio-robóticamente
            </span>
          </div>

          {showDiagram && currentCase && (
            <PerceptronDiagram
              x={currentCase.x}
              w={currentCase.w}
              b={currentCase.b}
              z={isAnswered ? currentCase.z : null}
              revealedLevel={isAnswered ? currentCase.correctLevel : null}
            />
          )}
        </div>
      </main>

      {/* Footer information with geometric divider */}
      <footer className="w-full max-w-2xl py-2 text-center text-[11px] text-slate-500 select-none z-10 border-t border-slate-800/40 mt-1">
        Neurona Cardióloga · Módulo de Robótica Médica e Inteligencia Artificial para Estudiantes (17 años)
      </footer>

      {/* Modals */}
      <StartModal
        isOpen={isStartOpen}
        onStart={startGame}
        onOpenTheory={() => setIsTheoryOpen(true)}
      />

      <RoboticsTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      <SandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />

      <GameOverModal
        stats={stats}
        isOpen={isGameOverOpen}
        onRestart={startGame}
      />
    </div>
  );
}
