import React from 'react';

const PowerLanding = ({ onBack, onBuild }: { onBack: () => void, onBuild: () => void }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-600 overflow-y-auto no-scrollbar pb-40">
            {/* HERO */}
            <header className="relative pt-40 pb-20 px-10 border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <button onClick={onBack} className="mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors bg-white/5 backdrop-blur px-6 py-2 rounded-full border border-white/10">← Return to HQ</button>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/20 rounded-full mb-8 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Critical Safety Advisory</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                        The Cord <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Stops Here.</span>
                    </h1>
                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-12">
                        Stop running extension cords across the lawn in February. It’s dangerous, inefficient, and frankly, amateur hour.
                    </p>
                    <button onClick={onBuild} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-2xl shadow-orange-900/50 hover:-translate-y-1">
                        Build a Powered Shed →
                    </button>
                </div>
            </header>

            {/* THE PROBLEM */}
            <section className="py-40 px-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-6 block">The DIY Reality</span>
                        <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase">Extension Cords Are <br /> Temporary.</h2>
                        <p className="text-white/40 text-lg mb-8 leading-relaxed">
                            You buy a shed for $5k and power it with a $40 cord from Home Depot. Then snow covers it. Then you mow over it. Then volt drop kills your tools.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-white/80 font-bold">
                                <span className="text-red-500 text-2xl">✕</span> Fire Hazard in Snow/Rain
                            </li>
                            <li className="flex items-center gap-4 text-white/80 font-bold">
                                <span className="text-red-500 text-2xl">✕</span> Voltage Drop Damages Motors
                            </li>
                            <li className="flex items-center gap-4 text-white/80 font-bold">
                                <span className="text-red-500 text-2xl">✕</span> Looks Like Trash
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors" />
                        <img src="https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?q=80&w=2544&auto=format&fit=crop" className="w-full h-96 object-cover rounded-2xl grayscale mix-blend-luminosity opacity-50 group-hover:opacity-80 transition-opacity" alt="Messy cords" />
                    </div>
                </div>
            </section>

            {/* THE SOLUTION */}
            <section className="py-40 px-10 bg-white text-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-6 block">The Placed Standard</span>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-8">Professional Power <br /> Pre-Installed.</h2>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
                            We rough-in the wiring, panels, and outlets in our factory. Your electrician just hooks up the final connection. Safe, coded, done.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mb-8">⚡</div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">20A Weekender</h3>
                            <p className="text-slate-500 font-bold text-sm mb-6">For lights, laptops, and chargers.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ 4 Interior Outlets</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ LED Overhead Light</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ Exterior GFI Plug</li>
                            </ul>
                            <div className="text-3xl font-black tracking-tighter">$300</div>
                        </div>
                        <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden transform md:-translate-y-8 shadow-2xl shadow-slate-900/40">
                            <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">Most Popular</div>
                            <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-8">🛠️</div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">30A Workshop</h3>
                            <p className="text-white/40 font-bold text-sm mb-6">For heaters, saws, and serious work.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-xs font-bold text-white/80">✓ 6 Interior Outlets (20A)</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-white/80">✓ 30A Sub-Panel</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-white/80">✓ Dedicated Heater Circuit</li>
                            </ul>
                            <div className="text-3xl font-black tracking-tighter text-orange-500">$900</div>
                        </div>
                        <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mb-8">🏠</div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">50A Guest Suite</h3>
                            <p className="text-slate-500 font-bold text-sm mb-6">Full living capability. Requires permit.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ Full Kitchen/Bath Prep</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ 50A Panel</li>
                                <li className="flex items-center gap-2 text-xs font-bold text-slate-700">✓ 240V Heating Config</li>
                            </ul>
                            <div className="text-3xl font-black tracking-tighter">$1,500</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAFETY CTA */}
            <section className="py-40 px-10 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-600 to-red-600 rounded-[4rem] p-20 shadow-2xl shadow-orange-900/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase">Stop Playing with Fire.</h2>
                        <p className="text-white/80 text-xl font-bold mb-10 max-w-2xl mx-auto">
                            Get a shed that's built like a house, not a plastic toy. Book your consultation today and let's talk power.
                        </p>
                        <button onClick={onBuild} className="bg-white text-orange-600 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl">
                            Configure Your Workshop Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PowerLanding;
