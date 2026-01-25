import React, { useState } from 'react';

const ElectricianPortal = ({ onBack }: { onBack: () => void }) => {
    const [step, setStep] = useState<'intro' | 'apply' | 'success'>('intro');

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 overflow-y-auto no-scrollbar pb-40">
            {step === 'intro' && (
                <div className="pt-40 px-10 max-w-7xl mx-auto">
                    <button onClick={onBack} className="mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors bg-white/5 backdrop-blur px-6 py-2 rounded-full border border-white/10">← Return to HQ</button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/20 border border-cyan-500/20 rounded-full mb-8">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Trade Partners Only</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                                Stop Chasing <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Attic Wire.</span>
                            </h1>
                            <p className="text-white/40 text-xl font-medium leading-relaxed mb-10 max-w-xl">
                                Join the Placed Network. We deliver the shed with the rough-in done. You just handle the final hookup.
                                <br /><br />
                                <span className="text-white">Flat Rate. Zero Crawling. Volume Work.</span>
                            </p>
                            <button onClick={() => setStep('apply')} className="bg-cyan-500 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-900/50 hover:-translate-y-1">
                                Apply for Access →
                            </button>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
                            <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-50">
                                <div className="bg-white/10 p-4 rounded-xl w-64 backdrop-blur-md">
                                    <div className="h-2 w-20 bg-cyan-500 rounded mb-2" />
                                    <div className="h-2 w-32 bg-white/20 rounded" />
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl w-64 backdrop-blur-md translate-x-8">
                                    <div className="h-2 w-20 bg-cyan-500 rounded mb-2" />
                                    <div className="h-2 w-32 bg-white/20 rounded" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">The Placed Promise</h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-cyan-900/40 rounded-xl flex items-center justify-center text-cyan-400 text-xl">⚡</div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Pre-Wired Panels</h4>
                                        <p className="text-white/40 text-sm font-medium">Every shed arrives with a sub-panel and circuits tested. No rough-in needed.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-cyan-900/40 rounded-xl flex items-center justify-center text-cyan-400 text-xl">🤝</div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Referral Pipeline</h4>
                                        <p className="text-white/40 text-sm font-medium">When a customer in your zone buys a shed, you get the alert first.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-cyan-900/40 rounded-xl flex items-center justify-center text-cyan-400 text-xl">📱</div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Digital Paperwork</h4>
                                        <p className="text-white/40 text-sm font-medium">Permits and specs are auto-generated and sent to your phone.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {step === 'apply' && (
                <div className="pt-40 px-10 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <button onClick={() => setStep('intro')} className="mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">← Back</button>
                    <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase">Partner Application</h2>
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('success'); }}>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Business Name</label>
                            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="e.g. Saint John Electric" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Red Seal #</label>
                            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="######" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Service Area</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors appearance-none">
                                <option>Saint John & Valley</option>
                                <option>Moncton / Dieppe</option>
                                <option>Fredericton</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-cyan-500 text-white p-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-xl mt-6">
                            Submit Application
                        </button>
                    </form>
                </div>
            )}

            {step === 'success' && (
                <div className="pt-40 px-10 max-w-xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-8 mx-auto shadow-2xl shadow-green-900/50">✓</div>
                    <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase">Application Received.</h2>
                    <p className="text-white/40 font-medium mb-10">We're reviewing your credentials. Expect a call from our Contractor Relations team within 24 hours.</p>
                    <button onClick={onBack} className="text-white hover:text-cyan-400 font-black text-xs uppercase tracking-[0.2em] transition-colors">Return to Homepage</button>
                </div>
            )}
        </div>
    );
};

export default ElectricianPortal;
