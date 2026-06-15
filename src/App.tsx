import React from "react";
import { 
  ArrowLeft, 
  Copy, 
  Check 
} from "lucide-react";
import { SpaceOrbitCanvas } from "./components/SpaceOrbitCanvas.tsx";

export default function App() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#03000a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
      
      {/* Interactive 3D celestial canvas as backdrop */}
      <SpaceOrbitCanvas />

      {/* Cosmic background flares */}
      <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-cyan-600/15 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] bg-emerald-600/10 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none z-0 animate-[pulse_10s_ease-in-out_infinite_1.5s]" />

      {/* Main Container Card */}
      <main 
        id="main-container"
        className="relative z-10 w-full max-w-2xl bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-2xl transition-all duration-500 ease-out hover:border-emerald-500/35 group"
        style={{ 
          boxShadow: "0 0 35px rgba(16, 185, 129, 0.07), inset 0 0 20px rgba(14, 165, 233, 0.04)" 
        }}
      >
        
        {/* Top state badge */}
        <div id="state-badge-container" className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Construyendo el futuro
          </span>
        </div>

        {/* Title and Editorial copy */}
        <div id="main-content" className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-emerald-100 to-green-200 leading-tight">
            Espacio en <span className="text-emerald-400">desarrollo</span>
          </h1>
          <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-500 to-emerald-400 mx-auto my-6 rounded-full"></div>
          
          <div className="text-slate-350 font-light leading-relaxed text-sm sm:text-base max-w-xl mx-auto space-y-4">
            <p>
              Si requiere obtener una cita para tramitar su carné de residente permanente por primera vez, puede hacerlo a través de los siguientes medios:
            </p>

            <div className="mt-6 space-y-2.5 text-left bg-slate-950/60 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between gap-2 p-1.5 hover:bg-white/[0.02] rounded transition-colors group/item">
                <span className="text-slate-400">Por correo:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-300 break-all select-all font-semibold">citaresidente@tribunal-electoral.gob.pa</span>
                  <button 
                    onClick={() => handleCopy("citaresidente@tribunal-electoral.gob.pa", "correo")}
                    title="Copiar correo" 
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedText === "correo" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 p-1.5 hover:bg-white/[0.02] rounded transition-colors group/item">
                <span className="text-slate-400">Vía telefónica:</span>
                <div className="flex items-center gap-1.5">
                  <a href="tel:5078080" className="text-emerald-300 hover:underline font-semibold">507-8080</a>
                  <button 
                    onClick={() => handleCopy("507-8080", "telefono")}
                    title="Copiar teléfono" 
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedText === "telefono" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-1.5 hover:bg-white/[0.02] rounded transition-colors">
                <span className="text-slate-400 block mb-1">Presencialmente:</span>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] font-normal pl-2 border-l border-emerald-500/30">
                  Departamento de Extranjería, planta baja del ala occidental, Dirección Regional de Cedulación de la Sede del Tribunal Electoral en Ancón.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase interactive status indicator */}
        <div id="system-status-pnl" className="mb-8 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Estado del Sistema</span>
            <span className="text-xs font-bold text-emerald-400">75% Completado</span>
          </div>
          {/* Glowing Progress bar fluid animation */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Primary redirect action button */}
        <div id="action-container" className="pt-6 border-t border-white/5">
          <a 
            id="back-to-home-link"
            href="https://tribunalcontigo.com/" 
            className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-medium text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
            Volver a la página inicial
          </a>
        </div>
      </main>

      {/* Copy notification Toast */}
      {copiedText && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-slate-950/95 border border-emerald-500/30 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <p className="text-xs font-medium text-slate-200">
            Copiado al portapapeles
          </p>
        </div>
      )}

    </div>
  );
}
