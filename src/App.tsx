import React from "react";
import { 
  ArrowLeft, 
  Copy, 
  Check 
} from "lucide-react";
import { SpaceOrbitCanvas } from "./components/SpaceOrbitCanvas.tsx";

export default function App() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async (text: string, label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedText(label);
      } else {
        // Fallback robust and secure for restricted sandbox environments
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (success) {
          setCopiedText(label);
        }
      }
    } catch (err) {
      console.error("Error copy operation:", err);
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500/10 selection:text-emerald-900">
      
      {/* Interactive 3D celestial canvas as backdrop */}
      <SpaceOrbitCanvas />

      {/* Cosmic background flares */}
      <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-cyan-400/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] bg-emerald-400/8 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none z-0 animate-[pulse_10s_ease-in-out_infinite_1.5s]" />

      {/* Main Container Card */}
      <main 
        id="main-container"
        className="relative z-10 w-full max-w-2xl bg-white/70 border border-slate-200/80 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:border-emerald-500/30 group"
        style={{ 
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.04), 0 0 35px rgba(16, 185, 129, 0.03)" 
        }}
      >
        
        {/* Top state badge */}
        <div id="state-badge-container" className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium tracking-widest uppercase bg-cyan-50 border border-cyan-200/80 text-cyan-700">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            Construyendo el futuro
          </span>
        </div>

        {/* Title and Editorial copy */}
        <div id="main-content" className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 leading-tight">
            Espacio en <span className="text-emerald-600 font-bold">desarrollo</span>
          </h1>
          <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-500 to-emerald-400 mx-auto my-6 rounded-full"></div>
          
          <div className="text-slate-600 font-normal leading-relaxed text-sm sm:text-base max-w-xl mx-auto space-y-4">
            <p>
              Si requiere obtener una cita para tramitar su carné de residente permanente por primera vez, puede hacerlo a través de los siguientes medios:
            </p>

            <div className="mt-6 space-y-2.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-700">
              <div className="flex items-center justify-between gap-2 p-1.5 hover:bg-slate-100 rounded transition-colors group/item">
                <span className="text-slate-500">Por correo:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-700 break-all select-all font-semibold">citaresidente@tribunal-electoral.gob.pa</span>
                  <button 
                    onClick={() => handleCopy("citaresidente@tribunal-electoral.gob.pa", "correo")}
                    title="Copiar correo" 
                    className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedText === "correo" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 p-1.5 hover:bg-slate-100 rounded transition-colors group/item">
                <span className="text-slate-500">Vía telefónica:</span>
                <div className="flex items-center gap-1.5">
                  <a href="tel:5078080" className="text-emerald-700 hover:underline font-semibold font-mono">507-8080</a>
                  <button 
                    onClick={() => handleCopy("507-8080", "telefono")}
                    title="Copiar teléfono" 
                    className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedText === "telefono" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-1.5 hover:bg-slate-100 rounded transition-colors">
                <span className="text-slate-500 block mb-1">Presencialmente:</span>
                <p className="text-slate-600 font-sans leading-relaxed text-[11px] font-normal pl-2 border-l-2 border-emerald-500">
                  Departamento de Extranjería, planta baja del ala occidental, Dirección Regional de Cedulación de la Sede del Tribunal Electoral en Ancón.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase interactive status indicator */}
        <div id="system-status-pnl" className="mb-8 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Estado del Sistema</span>
            <span className="text-xs font-bold text-emerald-700">75% Completado</span>
          </div>
          {/* Glowing Progress bar fluid animation */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Primary redirect action button */}
        <div id="action-container" className="pt-6 border-t border-slate-200/80">
          <a 
            id="back-to-home-link"
            href="https://tribunalcontigo.com/" 
            className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-medium text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
            Volver a la página inicial
          </a>
        </div>
      </main>

      {/* Copy notification Toast */}
      {copiedText && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-white/95 border border-emerald-500/20 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <p className="text-xs font-medium text-slate-700">
            Copiado al portapapeles
          </p>
        </div>
      )}

    </div>
  );
}
