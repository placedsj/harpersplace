import React, { useState, useMemo } from 'react';
import { COMPARISON_DATA } from '../constants';

const ROICalculator = ({ onClose }: { onClose?: () => void }) => {
    const [monthlyRent, setMonthlyRent] = useState(250); // Updated base to a more realistic modern rate
    const [shedPrice, setShedPrice] = useState(COMPARISON_DATA.placedPrice);
    const [years, setYears] = useState(5);
    const [hasPower, setHasPower] = useState(false);

    const adjustedPrice = useMemo(() => {
        return hasPower ? shedPrice + 1200 : shedPrice;
    }, [shedPrice, hasPower]);

    const results = useMemo(() => {
        const totalRent = monthlyRent * 12 * years;
        const totalSavings = totalRent - adjustedPrice;
        const breakEvenMonths = Math.ceil(adjustedPrice / monthlyRent);
        return { totalSavings, breakEvenMonths, isProfitable: totalSavings > 0 };
    }, [monthlyRent, adjustedPrice, years]);

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-40 pb-40 px-10 selection:bg-orange-600 overflow-y-auto no-scrollbar relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="fixed top-10 left-10 z-50 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] backdrop-blur-xl border border-white/10 transition-all group"
                >
                    ← <span className="group-hover:translate-x-1 transition-transform inline-block">Back to Builder</span>
                </button>
            )}

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-6 block">Financial Intelligence</span>
                    <h1 className="text-7xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter uppercase">
                        Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700 decoration-slate-500 line-through decoration-4">Renting.</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Start Owning.</span>
                    </h1>
                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                        Calculate how fast a Placed Shed pays for itself versus a "dead money" storage unit.
                        <br />
                        <span className="text-cyan-500 text-sm font-bold uppercase tracking-widest mt-4 block">Saint John Market Data Included</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                    <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
                        <div className="space-y-12">
                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Storage Cost ($)</label>
                                    <span className="text-4xl font-black text-white">${monthlyRent}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100" max="800" step="10"
                                    value={monthlyRent}
                                    onChange={(e) => setMonthlyRent(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>$100 (Small)</span>
                                    <span>$250 (Std. 10x10)</span>
                                    <span>$800 (Climate)</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Cost ($)</label>
                                    <span className="text-4xl font-black text-white">${adjustedPrice.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="4000" max="25000" step="500"
                                    value={shedPrice}
                                    onChange={(e) => setShedPrice(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>Economy</span>
                                    <span>Standard Build</span>
                                    <span>Luxury Studio</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                                onClick={() => setHasPower(!hasPower)}
                            >
                                <div>
                                    <div className="text-sm font-black uppercase tracking-widest mb-1 text-white">Power Kit Equity</div>
                                    <div className="text-[10px] text-slate-400">Add 30A Smart Panel (Increases resale value)</div>
                                </div>
                                <div className={`w-14 h-8 rounded-full p-1 transition-colors ${hasPower ? 'bg-green-500' : 'bg-slate-700'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${hasPower ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projection (Years)</label>
                                    <span className="text-4xl font-black text-white">{years} Years</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="10" step="1"
                                    value={years}
                                    onChange={(e) => setYears(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/20 p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">

                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-8 block">Projected Wealth Retained</span>
                            <div className="text-7xl md:text-8xl font-black tracking-tighter mb-8 text-white">
                                ${results.totalSavings > 0 ? results.totalSavings.toLocaleString() : 0}
                            </div>

                            {/* DYNAMIC BREAK-EVEN GRAPH */}
                            <div className="relative h-48 w-full mt-10">
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />
                                <div className="absolute inset-0 flex items-end gap-1">
                                    {[...Array(years * 12)].map((_, i) => {
                                        if (i % 3 !== 0) return null; // Show fewer bars
                                        const totalRentPaid = monthlyRent * (i + 1);
                                        const isProfit = totalRentPaid > adjustedPrice;
                                        return (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-t-sm transition-all duration-300 ${isProfit ? 'bg-cyan-400' : 'bg-orange-900/40'}`}
                                                style={{ height: `${Math.min(100, (totalRentPaid / (monthlyRent * 12 * 10)) * 100)}%` }}
                                            />
                                        )
                                    })}
                                </div>
                                {/* BREAK EVEN LINE */}
                                <div className="absolute top-0 right-0 bg-white/10 px-4 py-2 rounded-full text-[9px] font-bold text-white/60 uppercase tracking-widest border border-white/5 backdrop-blur-md">
                                    Break Even: Month {results.breakEvenMonths}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Break Even Point</span>
                                <div className="text-4xl font-black text-white mb-1">
                                    {(results.breakEvenMonths / 12).toFixed(1)} <span className="text-lg text-slate-500">Years</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Asset Value</span>
                                <div className="text-4xl font-black text-white mb-1">100%</div>
                                <span className="text-[9px] text-slate-600 uppercase tracking-widest">You Keep It.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ROICalculator;
