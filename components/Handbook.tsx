
import React, { useState } from 'react';
import { HANDBOOK_ARTICLES, ROOFING_JOKES } from '../constants';
import { RoofingJoke } from '../types';

const JokeCard: React.FC<{ joke: RoofingJoke }> = ({ joke }) => {
    const [revealed, setRevealed] = useState(false);
    return (
        <div
            onClick={() => setRevealed(!revealed)}
            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex flex-col items-center text-center
            ${revealed ? 'bg-orange-600 border-orange-500 shadow-2xl shadow-orange-900/40' : 'bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/10'}`}
        >
            <span className="text-4xl mb-6 group-hover:scale-125 transition-transform">{joke.icon}</span>
            <p className={`text-lg font-bold mb-4 tracking-tighter ${revealed ? 'text-white' : 'text-slate-300'}`}>{joke.question}</p>
            {revealed && (
                <p className="text-xl font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-500">
                    ...{joke.answer}
                </p>
            )}
            {!revealed && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">Click to Reveal</span>}
        </div>
    );
};

const Handbook = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-600 overflow-y-auto no-scrollbar pb-40">
            <div className="max-w-7xl mx-auto px-10 pt-40">

                {/* HERO */}
                <header className="mb-32 text-center md:text-left relative">
                    <div className="absolute top-0 right-0 hidden xl:flex flex-col gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] animate-in slide-in-from-right-10 duration-1000">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Sections</span>
                        {['Systems', 'Maintenance', 'Humor', 'Articles'].map((s, i) => (
                            <button key={s} className="text-[9px] font-black uppercase tracking-wider text-white/40 hover:text-orange-500 transition-colors text-left flex items-center gap-2 group">
                                <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-orange-500" /> {s}
                            </button>
                        ))}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/10 border border-orange-500/20 rounded-full mb-8">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Essential Resource</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                        Homeowner's <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Handbook.</span>
                    </h1>
                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl font-medium leading-relaxed">
                        Your complete guide to architectural care, maintenance, and project insights in Atlantic Canada.
                    </p>
                </header>

                {/* ROOF SYSTEM BASICS */}
                <section className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="bg-white/5 border border-white/10 p-16 rounded-[4rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase">Understanding Your System</h2>
                        <div className="space-y-8">
                            {[
                                { t: "Roofing Material", d: "The outermost layer (metal panels, shingles). Your first line of defense." },
                                { t: "Underlayment", d: "A waterproof barrier beneath the material providing secondary protection." },
                                { t: "Flashing", d: "Metal pieces installed at joints and vents to prevent water intrusion." },
                                { t: "Ventilation", d: "Systems allowing air to circulate, preventing heat and moisture buildup." },
                                { t: "POWERING YOUR OUTBUILDINGS", d: "Backyard Power Basics – Safely bringing electricity to sheds, workshops, and studios without overloading your home's system. Learn the difference between temporary and permanent setups, and how to size the right circuit for your space." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group/item">
                                    <span className="text-orange-500 font-black text-xl">0{i + 1}</span>
                                    <div>
                                        <h4 className="font-black text-white/90 mb-2 uppercase tracking-tighter">{item.t}</h4>
                                        <p className="text-white/40 leading-relaxed text-sm font-medium">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-10">
                        <div className="p-12 bg-orange-600 rounded-[3rem] shadow-2xl shadow-orange-900/40">
                            <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">Maintenance Check</h3>
                            <ul className="space-y-4 text-white/80 font-medium">
                                <li className="flex items-center gap-3">✅ Inspect Regularly (Twice a year)</li>
                                <li className="flex items-center gap-3">✅ Keep Gutters Clean</li>
                                <li className="flex items-center gap-3">✅ Trim Overhanging Branches</li>
                                <li className="flex items-center gap-3">✅ Avoid Roof Foot Traffic</li>
                                <li className="flex items-center gap-3">✅ Check Outdoor Connections – Inspect cords, inlets, and shed power kits every season for damage or moisture.</li>
                            </ul>
                        </div>
                        <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem]">
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-orange-500">Built for Atlantic Weather</h3>
                            <p className="text-white/40 font-medium leading-relaxed mb-4">
                                Cable, inlets, and hardware rated for New Brunswick winters, salt air, and freeze–thaw cycles.
                            </p>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-white">Code-Smart, Not Cowboy</h3>
                            <p className="text-white/40 font-medium leading-relaxed">
                                Designed to play nicely with Canadian Electrical Code and local inspectors, even when you're DIY-leaning.
                            </p>
                        </div>
                    </div>
                </section>

                {/* JOKES SECTION */}
                <section className="mb-40">
                    <div className="mb-16 text-center">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Dad's Roofing Jokes</h2>
                        <p className="text-white/40 font-medium">Because even roofing should have a sense of humor.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {ROOFING_JOKES.map((j, i) => <JokeCard key={i} joke={j} />)}
                    </div>
                </section>

                {/* BLOG GRID */}
                <section className="mb-40">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-4 block">Atlantic Insights</span>
                            <h2 className="text-6xl font-black tracking-tighter uppercase">Articles & Guides</h2>
                        </div>
                        <div className="hidden md:block h-[1px] flex-1 bg-white/10 mx-10 mb-5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {HANDBOOK_ARTICLES.map((article, i) => (
                            <div
                                key={article.id}
                                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-10 duration-700"
                                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'backwards' }}
                            >
                                <div className="aspect-[4/3] rounded-[3rem] overflow-hidden mb-8 border border-white/10 relative">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest">{article.category}</div>
                                    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 block">{article.subtitle}</span>
                                <h3 className="text-2xl font-black mb-4 group-hover:text-orange-400 transition-colors tracking-tighter leading-tight uppercase">{article.title}</h3>
                                <p className="text-white/40 text-sm font-medium leading-relaxed mb-6">{article.excerpt}</p>
                                <div className="w-12 h-[1px] bg-white/10 group-hover:w-full group-hover:bg-orange-500 transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-40 border-t border-white/10 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-950 font-black text-xl">H</div>
                        <span className="text-[11px] font-black uppercase tracking-widest">Homeowner's Handbook</span>
                    </div>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
                        © 2026 Homeowner's Handbook. All Rights Reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Handbook;
