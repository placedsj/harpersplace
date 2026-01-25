import React, { useState, useEffect } from 'react';

interface LivePowerGaugeProps {
    maxAmps?: number;
    loadFactor?: number; // 0 to 1
    status?: string;
}

const LivePowerGauge: React.FC<LivePowerGaugeProps> = ({ maxAmps = 15, loadFactor = 0.5, status: propStatus }) => {
    const [amps, setAmps] = useState(maxAmps * loadFactor);
    const [status, setStatus] = useState(propStatus || 'All Systems Go');
    const [history, setHistory] = useState<number[]>(new Array(20).fill(maxAmps * loadFactor));

    useEffect(() => {
        const interval = setInterval(() => {
            const fluctuation = (Math.random() - 0.5) * (maxAmps * 0.05);
            setAmps(prev => {
                const targetBase = maxAmps * loadFactor;
                const next = Math.max(0, Math.min(maxAmps + 0.5, prev + fluctuation + (targetBase - prev) * 0.1));
                
                setHistory(h => [...h.slice(1), next]);
                
                if (!propStatus) {
                    if (next > maxAmps * 0.9) setStatus('Critical Load Warning');
                    else if (next > maxAmps * 0.7) setStatus('High Demand');
                    else setStatus('All Systems Go');
                }
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [maxAmps, loadFactor, propStatus]);

    const percentage = (amps / maxAmps) * 100;
    const isOverloaded = amps > maxAmps * 0.85;

    return (
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-2 block">Live Power Stream</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Current Command</h3>
                </div>
                <div className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse border transition-colors duration-500 ${
                    isOverloaded 
                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' 
                    : 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30'
                }`}>
                    {propStatus || status}
                </div>
            </div>

            <div className="relative h-48 flex items-center justify-center relative z-10">
                <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-white/5"
                        strokeDasharray="471"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className={`transition-all duration-1000 ease-out ${isOverloaded ? 'text-orange-500' : 'text-cyan-500'}`}
                        strokeDasharray="471"
                        strokeDashoffset={471 - (471 * percentage) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute text-center">
                    <div className="text-5xl font-black tracking-tighter text-white tabular-nums">{amps.toFixed(1)}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-500/40">Amps Output</div>
                </div>
            </div>

            {/* Pro Sparkline */}
            <div className="h-10 w-full mt-6 flex items-end gap-[2px] px-2">
                {history.map((h, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all duration-1000 ${
                            h > maxAmps * 0.85 ? 'bg-orange-500/40' : 'bg-cyan-500/20'
                        }`}
                        style={{ height: `${Math.min(100, (h / maxAmps) * 100)}%` }}
                    />
                ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">Grid Limit</span>
                    <span className="text-sm font-bold uppercase tracking-tight text-white">{maxAmps}A TETHER</span>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">Efficiency</span>
                    <span className="text-sm font-bold uppercase tracking-tight text-white">{percentage < 40 ? 'EXCELLENT' : (percentage < 80 ? 'NOMINAL' : 'WARM')}</span>
                </div>
            </div>

            <p className="mt-6 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] leading-relaxed relative z-10">
                PLACED V12 Smart Management Active. <br/>
                Optimizing for Atlantic Power Cycles.
            </p>
        </div>
    );
};

export default LivePowerGauge;
