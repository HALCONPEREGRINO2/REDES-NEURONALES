import { LevelConfig, PatientCase, RiskLevel } from '../types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    w: [1, 1, 1],
    b: 0,
    durationMs: 14000,
    description: 'Pesos unitarios (Glicemia, Colesterol, Leucocitos)',
    roboticsNote: 'Calibración Perfil 20: Los 3 canales del perfil hematológico y químico tienen peso w = 1.0.',
  },
  {
    level: 2,
    w: [1, 1, 2],
    b: 0,
    durationMs: 12000,
    description: 'Prioridad sináptica en Leucocitosis aguda (w3 = 2)',
    roboticsNote: 'Ponderación asimétrica: La serie blanca hematológica tiene ganancia doble para alertar respuesta inflamatoria aguda.',
  },
  {
    level: 3,
    w: [1, 0.5, 2],
    b: 0,
    durationMs: 11000,
    description: 'Atenuación sináptica de Colesterol (w2 = 0.5)',
    roboticsNote: 'Filtro atenuador: El perfil lipídico crónico se modula a 0.5 para priorizar descompensaciones agudas.',
  },
  {
    level: 4,
    w: [1.5, 0.5, 2],
    b: -0.5,
    durationMs: 10000,
    description: 'Activación con Sesgo Inhibitorio (b = -0.5)',
    roboticsNote: 'Umbral de seguridad: El sesgo negativo evita falsas alarmas ante ligeras fluctuaciones basales de glicemia.',
  },
  {
    level: 5,
    w: [2, 0.5, 1.5],
    b: -0.5,
    durationMs: 9000,
    description: 'Urgencia Cardíaca Crítica (Glicemia severa w1 = 2)',
    roboticsNote: 'Modo UCI Robótica: La hiperglucemia aguda domina la compuerta de decisión sobre el actuador de medicación.',
  },
  {
    level: 6,
    w: [2, 1.5, 2],
    b: -1.0,
    durationMs: 8000,
    description: 'Turno Maestro: Perfil 20 Completo a Alta Frecuencia',
    roboticsNote: 'Cirugía Robótica Autónoma: Integración instantánea de química sanguínea y serie blanca con sesgo b = -1.0.',
  },
];

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 6) {
    return LEVEL_CONFIGS[level - 1];
  }
  // For endless mode beyond level 6:
  return {
    level,
    w: [2, 1.5, 2],
    b: -1.0,
    durationMs: Math.max(6500, 8000 - (level - 6) * 300),
    description: `Turno Extremo Nivel ${level}`,
    roboticsNote: 'Sobrecarga de emergencia: Procesamiento neuromórfico al límite de ciclo de reloj.',
  };
}

const SAMPLE_PATIENTS = [
  { name: 'Dr. Vega (Simulación)', age: 58 },
  { name: 'Paciente #402 (UCI)', age: 64 },
  { name: 'Unidad Biónica #12', age: 47 },
  { name: 'Paciente #819 (Urgencias)', age: 72 },
  { name: 'Piloto Androide K-7', age: 39 },
  { name: 'Sujeto Clínico #503', age: 61 },
  { name: 'Paciente Pediátrico Bio-Link', age: 16 },
  { name: 'Atleta Cyber-Cardio', age: 29 },
  { name: 'Monitor Ambulatorio #77', age: 53 },
  { name: 'Protocolo Triage Delta', age: 68 },
];

export function generatePatientCase(level: number): PatientCase {
  const config = getLevelConfig(level);
  const { w, b } = config;

  let xs: [number, number, number] = [0, 0, 0];
  let z = 0;

  // Generate safe values avoiding ambiguous boundaries:
  for (let attempt = 0; attempt < 80; attempt++) {
    xs = [
      Math.round(Math.random() * 10) / 10,
      Math.round(Math.random() * 10) / 10,
      Math.round(Math.random() * 10) / 10,
    ];
    z = xs[0] * w[0] + xs[1] * w[1] + xs[2] * w[2] + b;
    // Boundary checks: threshold at 1.0 and 1.5
    if (Math.abs(z - 1.0) > 0.12 && Math.abs(z - 1.5) > 0.12) {
      break;
    }
  }

  // Ensure 2 decimals precision floating point
  z = Math.round(z * 100) / 100;

  let correctLevel: RiskLevel;
  if (z < 1.0) {
    correctLevel = 0; // Bajo
  } else if (z < 1.5) {
    correctLevel = 1; // Medio
  } else {
    correctLevel = 2; // Alto
  }

  const patient = SAMPLE_PATIENTS[Math.floor(Math.random() * SAMPLE_PATIENTS.length)];
  const bpmBase = correctLevel === 0 ? 70 : correctLevel === 1 ? 95 : 135;
  const bpm = bpmBase + Math.floor(Math.random() * 14 - 7);

  // Perfil 20 Hematológico y Bioquímico real-world associative values:
  // Glicemia (mg/dL): normal 70-100 mg/dL, alterado hasta 280 mg/dL
  const glicemia = Math.round(70 + xs[0] * 200 + (Math.random() * 6 - 3));
  // Colesterol Total (mg/dL): normal <200 mg/dL, alterado hasta 330 mg/dL
  const colesterol = Math.round(140 + xs[1] * 180 + (Math.random() * 8 - 4));
  // Leucocitos (x10^3/µL): normal 4.5-10.0 x10^3/µL, leucocitosis reactiva hasta 18.5
  const leucocitos = Math.round((4.2 + xs[2] * 14.5 + (Math.random() * 0.4 - 0.2)) * 10) / 10;

  return {
    id: `case-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    x: xs,
    w,
    b,
    z,
    correctLevel,
    patientName: patient.name,
    patientAge: patient.age,
    bpm,
    perfil20: {
      glicemia,
      colesterol,
      leucocitos,
    },
  };
}

export interface RankInfo {
  title: string;
  badge: string;
  description: string;
  nextRankAt: number | null;
}

export function getRankInfo(score: number): RankInfo {
  if (score < 60) {
    return {
      title: 'Interno de Medicina Bio-Robótica',
      badge: '🩺',
      description: 'Estás aprendiendo a conectar los sensores con los actuadores de la neurona.',
      nextRankAt: 60,
    };
  }
  if (score < 140) {
    return {
      title: 'Residente en Cibernética Médica',
      badge: '⚕️',
      description: 'Dominas la multiplicación de pesos y la compensación del sesgo en tiempo real.',
      nextRankAt: 140,
    };
  }
  if (score < 250) {
    return {
      title: 'Cardiólogo Algorítmico de Guardia',
      badge: '🫀',
      description: 'Triage impecable bajo presión de tiempo. Diagnóstico neuromórfico veloz.',
      nextRankAt: 250,
    };
  }
  if (score < 400) {
    return {
      title: 'Neurona Artificial Certificada',
      badge: '🤖',
      description: 'Velocidad de cómputo sobrehumana. Tus sinapsis reaccionan en milisegundos.',
      nextRankAt: 400,
    };
  }
  return {
    title: 'Director de Bio-Robótica y Cirugía Autónoma',
    badge: '🏆',
    description: 'Máxima distinción. Eres el arquitecto del sistema neuronal del hospital del futuro.',
    nextRankAt: null,
  };
}
