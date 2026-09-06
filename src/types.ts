export type RiskLevel = 0 | 1 | 2; // 0: Bajo (< 1), 1: Medio (1 <= z < 1.5), 2: Alto (z >= 1.5)

export interface Perfil20Data {
  glicemia: number;    // mg/dL (Química sanguínea, VN: 70-100 mg/dL)
  colesterol: number;  // mg/dL (Perfil lipídico, VN: <200 mg/dL)
  leucocitos: number;  // x10^3/µL (Hematología completa, VN: 4.5-10.0 x10^3/µL)
}

export interface PatientCase {
  id: string;
  x: [number, number, number]; // [x1: Glicemia norm, x2: Colesterol norm, x3: Leucocitos norm]
  w: [number, number, number]; // [w1, w2, w3]
  b: number;                  // sesgo
  z: number;                  // suma ponderada exacta
  correctLevel: RiskLevel;
  patientName: string;
  patientAge: number;
  bpm: number;
  perfil20: Perfil20Data;
}

export interface LevelConfig {
  level: number;
  w: [number, number, number];
  b: number;
  durationMs: number;
  description: string;
  roboticsNote: string;
}

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  lives: number;
  level: number;
  correctCount: number;
  totalAnswered: number;
  highScore: number;
}

export type GameStatus = 'idle' | 'playing' | 'answered' | 'gameover';
