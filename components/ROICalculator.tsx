
import React, { useState, useMemo } from 'react';
import { COMPARISON_DATA } from '../constants';

const ROICalculator = () => {
    const [monthlyRent, setMonthlyRent] = useState(180);
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
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-6 block">Financial Intelligence</span>
                    <h1 className="text-7xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter uppercase">
                        Backyard <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ROI Calculator.</span>
                    </h1>
                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                        Stop renting space. Own your asset. See how quickly your structure pays for itself compared to traditional storage units in Saint John.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                    <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
                        <div className="space-y-12">
                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Storage Rent ($)</label>
                                    <span className="text-4xl font-black text-white">${monthlyRent}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50" max="600" step="10"
                                    value={monthlyRent}
                                    onChange={(e) => setMonthlyRent(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>$50</span>
                                    <span>Regional Standard</span>
                                    <span>$600</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structure Cost ($)</label>
                                    <span className="text-4xl font-black text-white">${shedPrice.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="2000" max="18000" step="100"
                                    value={shedPrice}
                                    onChange={(e) => setShedPrice(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>Compact Gable</span>
                                    <span>Placed 12x20 Lofted</span>
                                    <span>12x28 Superstar</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-black uppercase tracking-widest mb-1">Add Plug-In Power Kit (30A Workshop)</div>
                                    <div className="text-[10px] text-slate-400">Includes all cables, inlets, and wiring for a heating/office-ready shed without trenching. +$1,200</div>
                                </div>
                                <button
                                    onClick={() => setHasPower(!hasPower)}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors ${hasPower ? 'bg-cyan-500' : 'bg-white/10'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${hasPower ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Horizon (Years)</label>
                                    <span className="text-4xl font-black text-white">{years} Years</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="15" step="1"
                                    value={years}
                                    onChange={(e) => setYears(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-16 rounded-[4rem] shadow-2xl shadow-cyan-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-8 block">Total {years}-Year Savings</span>
                            <div className="text-8xl md:text-9xl font-black tracking-tighter mb-8 transition-transform group-hover:-translate-y-2">
                                ${results.totalSavings.toLocaleString()}
                            </div>

                            {/* MINI BAR CHART */}
                            <div className="flex items-end gap-2 h-32 mb-8 bg-black/20 p-6 rounded-3xl">
                                {[...Array(years)].map((_, i) => {
                                    const yearRent = monthlyRent * 12 * (i + 1);
                                    const yearCost = adjustedPrice + (i * 100); // maintenance estimate
                                    const savings = yearRent - yearCost;
                                    const height = Math.max(10, Math.min(100, (yearRent / (monthlyRent * 12 * 15)) * 100));
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-700 delay-[${i * 100}ms] ${savings > 0 ? 'bg-cyan-300' : 'bg-white/20'}`}
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className="text-[8px] font-black text-white/40">YR{i + 1}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-white/80 font-medium text-lg leading-relaxed max-w-sm">
                                Investing in a Placed Shed adds equity to your property instead of flushing money into monthly rentals.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-colors">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-4">Total ROI (Storage Savings Only)</span>
                                <div className="text-5xl font-black text-cyan-400 mb-2 group-hover:scale-110 transition-transform">{results.breakEvenMonths}</div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Months</span>
                            </div>
                            {hasPower ? (
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-4">Home Office Value</span>
                                    <div className="text-5xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform">+$5.8k</div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Per Year</span>
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-4">Property Value</span>
                                    <div className="text-5xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform">+$3.2k</div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Avg Appreciation</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* THE PLACED ADVANTAGE SECTION */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10">
                        <div className="bg-orange-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest animate-pulse">Placed Advantage</div>
                    </div>

                    <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase">Comparison: {COMPARISON_DATA.model}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Placed Sheds</span>
                            <div className="text-6xl font-black">${hasPower ? (COMPARISON_DATA.placedPrice + 1200).toLocaleString() : COMPARISON_DATA.placedPrice.toLocaleString()}</div>
                            <p className="text-white/40 text-sm font-medium">
                                {hasPower
                                    ? "Powered 12' x 20' Quaker with 30A Plug-In Kit – ready for office, studio, or workshop."
                                    : "Saint John focused builds with free city delivery and high-end materials."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">National Competitors</span>
                            <div className="text-6xl font-black text-slate-700">${COMPARISON_DATA.competitorPrice.toLocaleString()}</div>
                            <p className="text-white/40 text-sm font-medium">
                                {hasPower
                                    ? "Unpowered generic shed – no utilities, extra cost to trench and wire separately."
                                    : "Standard cookie-cutter models with generic framing and shipping fees."}
                            </p>
                        </div>

                        <div className="bg-orange-600/10 border border-orange-500/20 p-10 rounded-[3rem] flex flex-col justify-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-2">Upfront Savings</span>
                            <div className="text-5xl font-black text-white">${(COMPARISON_DATA.competitorPrice - adjustedPrice).toLocaleString()}</div>
                            <p className="text-white/40 text-xs mt-4">Direct-to-consumer advantage in Atlantic Canada.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ROICalculator;
