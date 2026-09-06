import React from 'react';
import { X, Cpu, HeartPulse, Brain, Zap, Stethoscope } from 'lucide-react';

interface RoboticsTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoboticsTheoryModal: React.FC<RoboticsTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="robotics-theory-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-tech text-slate-100 tracking-wide">
                Robótica Médica &amp; Redes Neuronales
              </h2>
              <p className="text-xs text-slate-400">
                Guía de ingeniería biomédica para estudiantes de robótica (17 años)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Biomedical Robotics */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-cyan-400 font-semibold flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-wide">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              1. ¿Por qué la robótica está en la medicina y cardiología?
            </h3>
            <p className="text-slate-300 mb-2">
              Cuando pensamos en robótica, solemos imaginar brazos industriales KUKA o rovers sobre ruedas. Sin embargo, 
              la <strong>bio-robótica</strong> es uno de los campos de mayor impacto en el mundo:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>
                <strong className="text-slate-200">Marcapasos autónomos y biónicos:</strong> Chips embebidos que monitorean señales eléctricas del corazón en milisegundos y aplican microdescargas reguladas.
              </li>
              <li>
                <strong className="text-slate-200">Robótica quirúrgica (Ej. Da Vinci):</strong> Brazos de teleoperación con micro-retroalimentación de fuerza y filtrado de temblores del cirujano.
              </li>
              <li>
                <strong className="text-slate-200">Triage autónomo en urgencias:</strong> Algoritmos de clasificación en tiempo real que priorizan camas y medicación en segundos críticos.
              </li>
            </ul>
          </div>

          {/* Section 2: Artificial Neuron / Perceptron */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-purple-400 font-semibold flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-purple-400" />
              2. La Neurona Artificial (El Perceptrón)
            </h3>
            <p className="text-slate-300 mb-2">
              La unidad elemental de una red neuronal artificial funciona exactamente como un controlador en robótica:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-center text-cyan-300 mb-2.5">
              z = (x₁ · w₁) + (x₂ · w₂) + (x₃ · w₃) + b
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-sky-300 font-bold font-mono">xᵢ (Entradas Perfil 20):</span> Lecturas del laboratorio clínico normalizadas de 0.0 a 1.0 (Glicemia en mg/dL, Colesterol en mg/dL y Leucocitos en k/µL).
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-purple-300 font-bold font-mono">wᵢ (Pesos Sinápticos):</span> La ganancia de cada sensor. Si un sensor es crítico para la vida, su peso es mayor (ej. w=2.0).
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-bold font-mono">b (Sesgo / Bias):</span> Umbral basal. Un sesgo negativo (ej. -0.5) exige señales más fuertes antes de disparar la alarma.
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-300 font-bold font-mono">Función de Activación:</span> Clasifica $z$ en rangos de decisión (Bajo &lt; 1, Medio &lt; 1.5, Alto ≥ 1.5).
              </div>
            </div>
          </div>

          {/* Section 3: Pro Tips for Mental Math */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-amber-400 font-semibold flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amber-400" />
              3. Trucos de Cálculo Rápido para tu Turno
            </h3>
            <div className="space-y-1.5 text-slate-300">
              <p>
                💡 <strong>Multiplica primero los pesos enteros:</strong> Si $x_3 = 0.8$ y $w_3 = 2$, duplica mentalmente: $0.8 \times 2 = 1.6$. ¡Ya superó 1.5 por sí solo!
              </p>
              <p>
                💡 <strong>Pesos de 0.5 son simplemente la mitad:</strong> Si $x_2 = 0.6$, su aporte es $0.3$.
              </p>
              <p>
                💡 <strong>Aplica el sesgo al final:</strong> Si el sesgo es $-0.5$, calcula la suma bruta y descuenta medio punto antes de comparar con el semáforo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-tech text-sm tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            ENTENDIDO · VOLVER AL TURNO
          </button>
        </div>
      </div>
    </div>
  );
};
